import {ArticleHeader} from '@/components/Headers';
import {MainBody} from '@/components/MainBody';
import {Article} from '@/components/Article';

import {loadSource} from '../lib/Article';


export default function Page({path, source}) {
  return (
    <MainBody>
      <ArticleHeader/>
      <Article path={path} source={source}/>
    </MainBody>
  );
}

export const getStaticProps = async () => {
  return {
    props: {
      path: 'howtoplay',
      source: await loadSource('howtoplay'),
    },
  };
};
