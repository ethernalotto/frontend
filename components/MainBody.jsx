import {WalletModal} from '@/components/Connection';
import {CookieNotice} from '@/components/CookieNotice';
import {MessageModal, ModalContainer} from '@/components/Modals';
import {DrawModal} from '@/components/PastDraws';


export const MainBody = ({children}) => (
  <div className="main-body">
    <ModalContainer>
      {children}
      <WalletModal/>
      <DrawModal/>
      <MessageModal/>
      <CookieNotice/>
    </ModalContainer>
  </div>
);
