import {useEffect, useState} from 'react';

import Web3 from 'web3';

import {JackpotConversion} from '@/components/Jackpot';
import {LotteryContext} from '@/components/LotteryContext';
import {MONTHS} from '@/components/Utilities';


const PlayButton = ({lottery}) => {
  const [nextDraw, setNextDraw] = useState(null);
  useEffect(() => {
    const updateTime = async () => {
      if (lottery) {
        setNextDraw(await lottery.getTimeOfNextDraw());
      }
    };
    const interval = window.setInterval(updateTime, 60000);
    updateTime();
    return () => {
      window.clearInterval(interval);
    };
  }, [lottery]);
  return (
    <button className="btn-s btn-play" onClick={async () => {
      // TODO
    }}>
      <span className="btn-s__frame btn-play__frame">
        <span className="btn-s__text">Play</span>
        <span className="btn-play-in btn-s">
          <span className="btn-play-in__frame btn-s__frame">
            <span className="btn-play-in__text">
              {nextDraw ? (
                <>{MONTHS[nextDraw.getMonth()]} <b>{nextDraw.getDate()}</b>, <b>{nextDraw.getFullYear()}</b> Draw</>
              ) : ''}
            </span>
          </span>
        </span>
      </span>
    </button>
  );
};


const Widget = ({lottery}) => {
  const [jackpot, setJackpot] = useState(null);
  const [numbers, setNumbers] = useState([]);
  useEffect(() => {
    if (lottery) {
      const subscription = lottery.subscribeToJackpot(jackpot => {
        setJackpot(parseFloat(Web3.utils.fromWei(jackpot)));
      });
      return () => {
        subscription.cancel();
      };
    }
  }, [lottery]);
  return (
    <div className="jackpot__main">
      <div className="jackpot__top-win">
        {(jackpot !== null) && `${Math.floor(jackpot * 100) / 100}`} ETH
      </div>
      {(jackpot !== null) && (<JackpotConversion jackpot={jackpot}/>)}
      <PlayButton lottery={lottery} numbers={numbers}/>
    </div>
  );
};


export default function Page() {
  return (
    <LotteryContext.Consumer>{lottery => (
      <Widget lottery={lottery}/>
    )}</LotteryContext.Consumer>
  );
}
