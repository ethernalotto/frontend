import {ArticleHeader} from '@/components/Headers';
import {MainBody} from '@/components/MainBody';
import {Article} from '@/components/Article';

import {loadSource} from '../../lib/Article';


export default function Page({path, source}) {
  return (
    <MainBody>
      <ArticleHeader/>
      <Article path={path} source={source}/>
    </MainBody>
  );
}


export const getStaticPaths = async () => {
  const index = Array.from(await import('@/articles/blog/index'));
  return {
    paths: index.map(params => ({params})),
    fallback: false,
  };
};

export const getStaticProps = async ({params: {slug}}) => {
  return {
    props: {
      path: `articles/${slug}`,
      source: await loadSource(`blog/${slug}`),
    },
  };
};
