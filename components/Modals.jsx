import React, {useState} from 'react';

import {Modal as BSModal} from 'react-bootstrap';


export const ModalContext = React.createContext(null);


export const ModalContainer = ({children}) => {
  const [modal, setModal] = useState(null);
  const showModal = (name, ...params) => new Promise((resolve, reject) => {
    setModal({name, params, resolve, reject});
  });
  const hideModal = () => setModal(null);
  return (
    <ModalContext.Provider value={{
      modal,
      name: modal?.name,
      params: modal?.params,
      resolve: modal?.resolve,
      reject: modal?.reject,
      showModal,
      hideModal,
    }}>
      {children}
    </ModalContext.Provider>
  );
};


export const Modal = ({name, title, children, className, resolveOnHide}) => {
  const [mutableTitle, setMutableTitle] = useState(title);
  return (
    <ModalContext.Consumer>{({modal, resolve, reject, hideModal}) => (
      <BSModal
          show={modal?.name === name}
          centered
          dialogClassName={className}
          onHide={() => {
            hideModal();
            if (resolveOnHide) {
              resolve?.();
            } else {
              reject?.();
            }
          }}
      >
        <button type="button" className="btn btn-close-custom" onClick={() => {
          hideModal();
          if (resolveOnHide) {
            resolve?.();
          } else {
            reject?.();
          }
        }}/>
        <div className="modal-shadow">
          <div className="modal-shadow__title">
            <div className="one-row-title">
              <div className="one-row-title__top-frame">
                <div className="one-row-title__top-frame-clip"></div>
              </div>
              <div className="one-row-title__frame">
                <div className="one-row-title__frame-in">
                  <div className="one-row-title__main-text">{mutableTitle}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-clip">
            <div className="modal-content-wrapper">
              <div className="modal-inside">{modal?.name !== name ? null : children({
                name: modal.name,
                params: modal.params,
                resolve,
                reject,
                hide: hideModal,
                setTitle: value => {
                  setTimeout(() => {
                    setMutableTitle(value);
                  }, 0);
                },
              })}</div>
              <div className="modal-clip__lines">
                <span className="modal-clip__line1"></span>
                <span className="modal-clip__line2"></span>
                <span className="modal-clip__line3"></span>
                <span className="modal-clip__line4"></span>
                <span className="modal-clip__line5"></span>
                <span className="modal-clip__line6"></span>
              </div>
            </div>
          </div>
          <div className="modal-behind"></div>
        </div>
      </BSModal>
    )}</ModalContext.Consumer>
  );
};


export const MessageModal = () => (
  <Modal name="message" className="modal-wallet" resolveOnHide>
    {({params: [title, message], setTitle}) => {
      setTitle(title);
      return (
        <p>{message.toString()}</p>
      );
    }}
  </Modal>
);
