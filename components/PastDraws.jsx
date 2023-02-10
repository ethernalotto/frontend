import {useEffect, useState} from 'react';
import Link from 'next/link';

import {useWeb3React} from '@web3-react/core';

import Card from './Cards';
import {LotteryContext} from './LotteryContext';
import {Modal, ModalContext} from './Modals';
import {SectionTitle} from './SectionTitle';
import Table from './Tables';


export const DrawModal = () => (
  <Modal name="draw" className="modal-dialog-lg" resolveOnHide>{({params: [draw], setTitle}) => {
    setTitle(`${draw.date.toDateString()} Drawing`);
    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Cell>
              <span className="main-table__text">Matches</span>
            </Table.Cell>
            <Table.Cell>
              <span className="main-table__text">Number of winners</span>
            </Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <span className="main-table__text">6</span>
            </Table.Cell>
            <Table.Cell>
              <span className="main-table__text main-table__text--blue">
                {draw.winners[4].length}
              </span>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <span className="main-table__text">5</span>
            </Table.Cell>
            <Table.Cell>
              <span className="main-table__text main-table__text--blue">
                {draw.winners[3].length}
              </span>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <span className="main-table__text">4</span>
            </Table.Cell>
            <Table.Cell>
              <span className="main-table__text main-table__text--blue">
                {draw.winners[2].length}
              </span>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <span className="main-table__text">3</span>
            </Table.Cell>
            <Table.Cell>
              <span className="main-table__text main-table__text--blue">
                {draw.winners[1].length}
              </span>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <span className="main-table__text">2</span>
            </Table.Cell>
            <Table.Cell>
              <span className="main-table__text main-table__text--blue">
                {draw.winners[0].length}
              </span>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }}</Modal>
);


const Winnings = ({lottery, draw, account}) => {
  const [winningTickets, setWinningTickets] = useState(null);
  useEffect(() => {
    (async () => {
      const tickets = await lottery.getTicketsForRound(account, draw.round);
      const winning = [];
      for (const ticket of tickets) {
        for (const winners of draw.winners) {
          if (winners.includes(ticket.id)) {
            winning.push(ticket);
          }
        }
      }
      setWinningTickets(winning);
    })();
  }, [lottery, draw, account, setWinningTickets]);
  if (!winningTickets) {
    return null;
  }
  if (winningTickets.length > 0) {
    return (<Card.Prize/>);
  } else {
    return (<Card.NoWin/>);
  }
};


const MaybeWinnings = ({draw}) => {
  const {account} = useWeb3React();
  if (!account) {
    return null;
  }
  return (
    <LotteryContext.Consumer>{lottery => lottery ? (
      <Winnings lottery={lottery} draw={draw} account={account}/>
    ) : null}</LotteryContext.Consumer>
  );
};


const DrawCard = ({draw}) => (
  <ModalContext.Consumer>{({showModal}) => (
    <Card date={draw.date} onDetails={() => {
      showModal('draw', draw);
    }}>
      <Card.Jackpot jackpot={draw.jackpot}/>
      <Card.Numbers title="Drawn Numbers" numbers={draw.numbers}/>
      <MaybeWinnings draw={draw}/>
    </Card>
  )}</ModalContext.Consumer>
);


const DrawList = ({lottery}) => {
  const [draws, setDraws] = useState([]);
  useEffect(() => {
    (async () => {
      const data = await Promise.all([-1, -2, -3].map(async round => {
        try {
          return await lottery.getDrawData(round);
        } catch (e) {
          return null;
        }
      }));
      setDraws(data.filter(draw => !!draw));
    })();
  }, [lottery]);
  return (
    <section className="draws d-flex justify-content-start align-items-center flex-column flex-lg-row align-items-lg-start">
      {draws.map((draw, index) => (
        <DrawCard key={index} draw={draw}/>
      ))}
    </section>
  );
};


export const PastDraws = ({lottery}) => (
  <section className="past-draws">
    <div className="container">
      <article className="mb-5">
        <p className="past-draws__descr">
          EthernaLotto is a global, decentralized, trustless, autonomous, and provably fair lottery
          game. It&apos;s based on the Ethereum blockchain.
        </p>
        <p className="past-draws__descr">
          To win the game a player must predict at least 2 of 6 numbers that will be drawn every
          week (<Link href="/howtoplay">read more</Link>).
        </p>
        <p className="past-draws__descr">
          EthernaLotto is the safest and most rewarding lottery ever created, and it will last
          forever.
        </p>
      </article>
      <SectionTitle title="Past Draws"/>
      <LotteryContext.Consumer>{lottery => lottery ? (
        <DrawList lottery={lottery}/>
      ) : null}</LotteryContext.Consumer>
    </div>
  </section>
);
