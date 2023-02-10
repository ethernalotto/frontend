import {useEffect, useState} from 'react';
import {Col, Form, Row} from 'react-bootstrap';

import {useWeb3React} from '@web3-react/core';

import {ModalContext} from './Modals';
import {formatBigNumber} from './Utilities';

import ICO from './ICO.json';


// 1 ETH in wei, i.e. 1e18.
const DECIMALS = '1000000000000000000';

// Total ELOT supply in ELOT-wei (1e27).
const TOTAL_SUPPLY = '1000000000000000000000000000';


const FormContent = ({ico}) => {
  const {library: web3, account} = useWeb3React();
  const hundred = web3.utils.toBN(100);
  const decimals = web3.utils.toBN(DECIMALS);
  const totalSupply = web3.utils.toBN(TOTAL_SUPPLY);
  const [price, setPrice] = useState(null);
  const [balance, setBalance] = useState(null);
  const [saleOpen, setSaleOpen] = useState(false);
  const [ethText, setEthText] = useState('0');
  const [ethAmount, setEthAmount] = useState(web3.utils.toBN(0));
  const [elotText, setElotText] = useState('0');
  const [elotAmount, setElotAmount] = useState(web3.utils.toBN(0));  // eslint-disable-line no-unused-vars
  const [shareText, setShareText] = useState('0');
  const [share, setShare] = useState(0);  // eslint-disable-line no-unused-vars
  const updateEth = ethText => {
    setEthText(ethText);
    const ethAmount = web3.utils.toBN(web3.utils.toWei(ethText));
    setEthAmount(ethAmount);
    const elotAmount = ethAmount.mul(decimals).div(price);
    setElotText(web3.utils.fromWei(elotAmount));
    setElotAmount(elotAmount);
    const share = web3.utils.fromWei(elotAmount.mul(hundred).mul(decimals).div(totalSupply));
    setShareText(share);
    setShare(parseFloat(share));
  };
  const updateElot = elotText => {
    setElotText(elotText);
    const elotAmount = web3.utils.toBN(web3.utils.toWei(elotText));
    const ethAmount = elotAmount.mul(price).div(decimals);
    setEthText(web3.utils.fromWei(ethAmount));
    setEthAmount(ethAmount);
    setElotAmount(elotAmount);
    const share = web3.utils.fromWei(elotAmount.mul(hundred).mul(decimals).div(totalSupply));
    setShareText(share);
    setShare(parseFloat(share));
  };
  const updateShare = shareText => {
    setShareText(shareText);
    let share = web3.utils.toBN(web3.utils.toWei(shareText)).div(hundred);
    if (share.gt(decimals)) {
      share = decimals;
    }
    const elotAmount = totalSupply.mul(share).div(decimals);
    const ethAmount = elotAmount.mul(price).div(decimals);
    setEthText(web3.utils.fromWei(ethAmount));
    setEthAmount(ethAmount);
    setElotText(web3.utils.fromWei(elotAmount));
    setElotAmount(elotAmount);
    setShare(parseFloat(web3.utils.fromWei(share.mul(hundred))));
  };
  useEffect(() => {
    (async () => {
      const price = web3.utils.toBN(await ico.methods.price().call());
      setPrice(price);
      setSaleOpen(await ico.methods.isOpen().call());
    })();
    // eslint-disable-next-line
  }, [web3, ico]);
  useEffect(() => {
    (async () => {
      if (account) {
        setBalance(web3.utils.toBN(await ico.methods.balance(account).call()));
      } else {
        setBalance(null);
      }
    })();
    // eslint-disable-next-line
  }, [web3, account, ico]);
  useEffect(() => {
    if (price !== null) {
      updateShare('1');
    }
    // eslint-disable-next-line
  }, [price]);
  return (
    <ModalContext.Consumer>{({showModal}) => (
      <Form className="mb-1" onSubmit={async e => {
        e.preventDefault();
        if (!e.target.checkValidity()) {
          return;
        }
        if (account) {
          await ico.methods.buy().send({
            from: account,
            value: ethAmount,
          });
        } else {
          showModal('wallet');
        }
      }}>
        <Form.Group as={Row} className="mx-sm-3 mb-3">
          <Form.Label column sm={3}>Current ELOT price:</Form.Label>
          <Col>
            <Form.Control
                type="static"
                disabled
                value={price ? `${formatBigNumber(web3, price)} ETH` : ''}/>
          </Col>
        </Form.Group>
        {balance !== null ? (
          <Form.Group as={Row} className="mx-sm-3 mb-3">
            <Form.Label column sm={3}>Your ELOT balance:</Form.Label>
            <Col>
              <Form.Control
                  type="static"
                  disabled
                  value={balance !== null ? `${formatBigNumber(web3, balance)} ELOT` : ''}/>
            </Col>
          </Form.Group>
        ) : null}
        <Row className="mb-4">
          <Form.Group as={Col} className="mx-sm-3">
            <Form.Label>ETH</Form.Label>
            <Form.Control
                type="text"
                disabled={price === null}
                required
                pattern="[0-9]*(\.[0-9]*)?"
                value={ethText}
                onChange={({target}) => updateEth(target.value)}/>
          </Form.Group>
          <Form.Group as={Col} className="mx-sm-3">
            <Form.Label>ELOT</Form.Label>
            <Form.Control
                type="text"
                disabled={price === null}
                pattern="[0-9]*(\.[0-9]*)?"
                value={elotText}
                onChange={({target}) => updateElot(target.value)}/>
          </Form.Group>
          <Form.Group as={Col} className="mx-sm-3">
            <Form.Label>Share (%)</Form.Label>
            <Form.Control
                type="text"
                disabled={price === null}
                pattern="[0-9]*(\.[0-9]*)?"
                value={shareText}
                onChange={({target}) => updateShare(target.value)}/>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} className="mx-sm-3">
            <button type="submit" disabled={!saleOpen} className="btn btn-details mb-4">
              <span className="btn-details__text">Buy ELOT</span>
              <span className="btn-details__shadow"></span>
            </button>
          </Form.Group>
          <Form.Group as={Col} className="mx-sm-3">
            <button
                type="button"
                disabled={saleOpen || balance === null || balance.isZero()}
                className="btn btn-details mb-4"
                onClick={async () => {
                  if (account) {
                    await ico.methods.claim().send({from: account});
                  } else {
                    showModal('wallet');
                  }
                }}>
              <span className="btn-details__text">Redeem ELOT</span>
              <span className="btn-details__shadow"></span>
            </button>
          </Form.Group>
        </Row>
      </Form>
    )}</ModalContext.Consumer>
  );
};


export const ICOForm = () => {
  const context = useWeb3React();
  const [ico, setICO] = useState(null);
  useEffect(() => {
    if (context.active && context.library) {
      setICO(new context.library.eth.Contract(ICO.abi, process.env.NEXT_PUBLIC_ICO_ADDRESS));
    } else {
      setICO(null);
    }
  }, [context, context.active, context.library]);
  if (ico) {
    return (<FormContent ico={ico}/>);
  } else {
    return null;
  }
};
