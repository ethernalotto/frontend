import {useEffect, useState} from 'react';

import {useWeb3React} from '@web3-react/core';

import ControllerABI from './Controller.json';
import TokenABI from './Token.json';
import {formatBigNumber} from './Utilities';


const DynamicStatus = ({context: {account, library: web3}, token, controller}) => {
  const [show, setShow] = useState(false);
  const [balance, setBalance] = useState(null);
  const [unclaimed, setUnclaimed] = useState(null);
  useEffect(() => {
    (async () => {
      setBalance(null);
      setUnclaimed(null);
      const balance = web3.utils.toBN(await token.methods.balanceOf(account).call());
      if (!balance.cmp(web3.utils.toBN(0))) {
        setShow(false);
        return;
      }
      setBalance(balance);
      setShow(true);
      setUnclaimed(web3.utils.toBN(await controller.methods.getUnclaimedRevenue(account).call()));
    })();
  }, [account, controller, token, web3]);
  if (!show) {
    return null;
  }
  return (
    <>
      <h2>Account Status</h2>
      <p>Greetings, esteemed partner!</p>
      <p>You are connected as: <a href={`https://${process.env.NEXT_PUBLIC_ETHERSCAN_ADDRESS}/address/${account}`} target="_blank" rel="noreferrer">{account}</a></p>
      {balance ? (
        <p>Your <code>ELOT</code> balance is: {formatBigNumber(web3, balance)}</p>
      ) : null}
      {(unclaimed && unclaimed.cmp(web3.utils.toBN(0))) ? (
        <p>You have unclaimed fees: {formatBigNumber(web3, unclaimed)} ETH &#8211; <button onClick={async () => {
          await controller.methods.withdraw(account).send({from: account});
        }}>withdraw</button></p>
      ) : null}
    </>
  );
};


export const PartnerStatus = () => {
  const context = useWeb3React();
  if (context.account) {
    const web3 = context.library;
    const token = new web3.eth.Contract(TokenABI.abi, process.env.NEXT_PUBLIC_TOKEN_ADDRESS);
    const controller = new web3.eth.Contract(
        ControllerABI.abi, process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS);
    return (
      <DynamicStatus context={context} token={token} controller={controller}/>
    );
  } else {
    return null;
  }
};
