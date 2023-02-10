import {Blog} from '@/components/Blog';
import {Header} from '@/components/Headers';
import {MainBody} from '@/components/MainBody';


export default function Page({posts}) {
  return (
    <MainBody>
      <Header/>
      <Blog posts={posts}/>
    </MainBody>
  );
}


export const getStaticProps = async () => {
  const index = Array.from(await import('@/articles/blog/index.json'));
  return {
    props: {posts: index.reverse()},
  };
};
