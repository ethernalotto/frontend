import {Header} from '@/components/Headers';
import {MainBody} from '@/components/MainBody';
import {PastDraws} from '@/components/PastDraws';


export default function Page() {
  return (
    <MainBody>
      <Header/>
      <PastDraws/>
    </MainBody>
  );
}
