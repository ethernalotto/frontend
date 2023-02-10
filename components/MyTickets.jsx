import {useEffect, useState} from 'react';

import {useWeb3React} from '@web3-react/core';

import Card from './Cards';
import {LotteryContext} from './LotteryContext';
import {SectionTitle} from './SectionTitle';


const Winnings = ({ticket}) => {
  if (!ticket.draw) {
    return null;
  }
  const matches = ticket.draw.numbers
      .map(number => ticket.numbers.includes(number))
      .reduce((match, count) => count + (match ? 1 : 0), 0);
  if (matches > 1) {
    return (<Card.Prize/>);
  } else {
    return (<Card.NoWin/>);
  }
};


const TicketList = ({lottery, account}) => {
  const [tickets, setTickets] = useState([]);
  useEffect(() => {
    (async () => {
      const ids = (await lottery.getTicketIds(account)).sort((id1, id2) => id2 - id1);
      setTickets(await Promise.all(ids.map(id => lottery.getTicket(id))));
    })();
  }, [account, lottery]);
  return (
    <section className="draws d-flex justify-content-start align-items-center flex-column flex-lg-row align-items-lg-start">
      {tickets.map((ticket, index) => (
        <Card key={index} date={ticket.date}>
          {ticket.draw ? (
            <Card.Numbers
                title="Drawn Numbers"
                numbers={ticket.draw.numbers}
                highlightedNumbers={ticket.numbers}/>
          ) : null}
          <Card.Numbers
              title="Your Numbers"
              numbers={ticket.numbers}
              highlightedNumbers={ticket.draw?.numbers}/>
          <Winnings ticket={ticket}/>
        </Card>
      ))}
    </section>
  );
};


export const MyTickets = () => {
  const {account} = useWeb3React();
  return (
    <section className="past-draws">
      <div className="container">
        <SectionTitle title="My Tickets"/>
        {account ? (
          <LotteryContext.Consumer>{lottery => (
            <TicketList lottery={lottery} account={account}/>
          )}</LotteryContext.Consumer>
        ) : (
          <article>
            <p className="past-draws__descr">Please connect your wallet.</p>
          </article>
        )}
      </div>
    </section>
  );
};
