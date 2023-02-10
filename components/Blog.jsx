import Link from 'next/link';
import Image from 'next/image';

import {Container} from 'react-bootstrap';

import stockImage from '@/images/stock.jpg';

import {SectionTitle} from './SectionTitle';


export const Blog = ({posts}) => (
  <section className="blog">
    <Container>
      <SectionTitle title="Blog"/>
      <div className="blog-items d-flex justify-content-start align-items-start flex-wrap">
        {posts.map(({slug, title, date, excerpt}, index) => (
          <div key={index} className="blog-items__item">
            <div className="blog-items__frame-pic">
              <div className="blog-items__date">{date}</div>
              <div className="blog-items__pic">
                <Image src={stockImage} alt=""/>
              </div>
            </div>
            <div className="blog-items__title">{title}</div>
            <div className="blog-items__descr">{excerpt}</div>
            <div className="blog-items__button">
              <Link href={`/articles/${slug}`} className="btn btn-details">
                <span className="btn-details__text">Read More</span>
                <span className="btn-details__shadow"></span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);
