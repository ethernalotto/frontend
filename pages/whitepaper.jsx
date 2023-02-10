import {ArticleHeader} from '@/components/Headers';
import {MainBody} from '@/components/MainBody';


// PDFs inside iframes are not scrollable on Safari, so we need to detect Safari and fall back to
// Google's PDF viewer in that browser.
const isSafari = typeof window !== 'undefined' && typeof window.GestureEvent === "function";

const Whitepaper = () => (
  <iframe
      title="whitepaper"
      className="whitepaper-frame"
      src={isSafari ? `https://docs.google.com/gview?url=https://${process.env.NEXT_PUBLIC_SITE_NAME}/whitepaper.pdf&embedded=true` : '/whitepaper.pdf'}/>
);


export default function Page() {
  return (
    <MainBody>
      <ArticleHeader/>
      <Whitepaper/>
    </MainBody>
  );
}
