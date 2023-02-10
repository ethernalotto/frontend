import {useEffect} from 'react';

import Image from 'next/image';
import Link from 'next/link';

import Web3 from 'web3';
import {Web3ReactProvider, useWeb3React} from '@web3-react/core';
import {NetworkConnector} from '@web3-react/network-connector';
import {InjectedConnector} from '@web3-react/injected-connector';
import {WalletConnectConnector} from '@web3-react/walletconnect-connector';

import {Modal, ModalContext} from '@/components/Modals';

import metaMaskLogo from '@/images/metamask.png';
import walletConnectLogo from '@/images/walletconnect.png';


const ConnectWeb3 = ({children}) => {
  const context = useWeb3React();
  const chainId = parseInt(process.env.NEXT_PUBLIC_NETWORK_ID, 10);
  useEffect(() => {
    (async () => {
      if (!context.connector) {
        await context.activate(new NetworkConnector({
          urls: {
            [chainId]: process.env.NEXT_PUBLIC_RPC_URL,
          },
          defaultChainId: chainId,
        }), null, /*throwErrors=*/true);
      }
    })();
  }, [context, chainId]);
  return children;
};


export const ConnectionProvider = ({children}) => (
  <Web3ReactProvider getLibrary={provider => new Web3(provider)}>
    <ConnectWeb3>{children}</ConnectWeb3>
  </Web3ReactProvider>
);


const WalletButton = ({name, logo, createConnector, onConnect, onError}) => {
  const {activate} = useWeb3React();
  return (
    <button className="btn btn-with-icon" onClick={async () => {
      try {
        await activate(createConnector(), onError, true);
      } catch (e) {
        console.error(e);
        onError(e);
        return;
      }
      onConnect();
    }}>
      <span className="btn-with-icon__frame">
        <span className="btn-with-icon__frame-in">
          <span className="btn-with-icon__text">{name}</span>
          <span className="btn-with-icon__icon">
            <Image src={logo} alt={name}/>
          </span>
        </span>
      </span>
      <span className="btn-with-icon__arrow-start"></span>
      <span className="btn-with-icon__arrow-end"></span>
    </button>
  );
};


export const WalletModal = () => {
  const chainId = parseInt(process.env.NEXT_PUBLIC_NETWORK_ID, 10);
  return (
    <Modal
        name="wallet"
        className="modal-dialog-sm modal-wallet"
        title="Connect to a Wallet"
    >{({name, resolve, reject, hide}) => (
      <>
        <WalletButton
            name="MetaMask"
            logo={metaMaskLogo}
            createConnector={() => new InjectedConnector({
              supportedChainIds: [chainId],
            })}
            onConnect={() => {
              hide();
              resolve?.();
            }}
            onError={error => {
              hide();
              reject?.(error);
            }}/>
        <WalletButton
            name="WalletConnect"
            logo={walletConnectLogo}
            createConnector={() => new WalletConnectConnector({
              rpc: {
                [chainId]: process.env.NEXT_PUBLIC_RPC_URL,
              },
            })}
            onConnect={() => {
              hide();
              resolve?.();
            }}
            onError={error => {
              hide();
              reject?.(error);
            }}/>
        <div className="modal-wallet__help">
          <Link href="https://ethereum.org/wallets" target="_blank" rel="noreferrer">
            Learn more about wallets
          </Link>
        </div>
      </>
    )}</Modal>
  );
};


export const ConnectButton = () => {
  const {account} = useWeb3React();
  if (account) {
    return null;
  }
  return (
    <div className="btn-wallet">
      <ModalContext.Consumer>{({showModal}) => (
        <button className="btn btn-wallet__main-btn" onClick={() => showModal('wallet')}>
          <span className="btn-s__text btn-wallet__text">Connect Wallet</span>
        </button>
      )}</ModalContext.Consumer>
      <div className="btn-wallet__doubling">
        <span className="btn-s__frame"></span>
      </div>
    </div>
  );
};
