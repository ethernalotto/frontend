import {useEffect, useState} from 'react';

import Link from 'next/link';

import {Container} from 'react-bootstrap';

import ReactMarkdown from 'react-markdown';
import {DiscussionEmbed} from 'disqus-react';

import frontmatter from 'remark-frontmatter';
import gfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import autolink from 'rehype-autolink-headings';

import YAML from 'yaml';

import {ICOForm} from './ICOForm';
import {PartnerStatus} from './PartnerStatus';
import {ReferralWizard} from './Referrals';


const components = {
  a: ({children, href, ...props}) => {
    if (/^[^/]+:/.test(href)) {
      // external link
      return (
        <a href={href} {...props} target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    } else {
      return (
        <Link href={href} {...props}>{children}</Link>
      );
    }
  },
  object: ({name}) => {
    switch (name) {
    case 'account-status':
      return (<PartnerStatus/>);
    case 'ico-form':
      return (<ICOForm/>);
    case 'referral-wizard':
      return (<ReferralWizard/>);
    default:
      return null;
    }
  },
};


export const Article = ({path, source}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [enableComments, setEnableComments] = useState(false);
  const parseFrontMatter = () => node => {
    if ('root' === node.type && node.children.length > 0) {
      const child = node.children[0];
      if ('yaml' === child.type) {
        const parsed = YAML.parse(child.value);
        setTimeout(() => {
          setTitle(parsed.title || '');
          setDate(parsed.date || '');
          if (parsed.comments) {
            setEnableComments(true);
          }
        }, 0);
      }
    }
  };
  return (
    <section className="article">
      <Container>
        <div className="article__wrap d-flex justify-content-start align-items-start flex-column flex-lg-row">
          <aside className="article__sidebar">
            <div className="article__date">{date}</div>
          </aside>
          <article className="article__body text">
            <ReactMarkdown
                remarkPlugins={[frontmatter, parseFrontMatter, gfm]}
                rehypePlugins={[rehypeRaw, rehypeSlug, autolink]}
                components={components}>{source}</ReactMarkdown>
            {enableComments ? <DiscussionEmbed shortname="ethernalotto" config={{
              url: `https://${process.env.NEXT_PUBLIC_SITE_NAME}/${path}`,
              identifier: path,
              title: title,
              language: 'en_US',
            }}/> : null}
          </article>
        </div>
      </Container>
    </section>
  );
};


export const BlogArticle = ({slug}) => {
  return (<Article path={`blog/${slug}`}/>);
};
