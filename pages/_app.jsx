import Head from 'next/head';

import SSRProvider from 'react-bootstrap/SSRProvider';

import {ConnectionProvider} from '@/components/Connection';
import {LotteryContextProvider} from '@/components/LotteryContext';

import styles from '@/styles/main.scss';


export default function App({Component, pageProps}) {
  return (
    <ConnectionProvider>
      <LotteryContextProvider>
        <SSRProvider>
          <Head>
            <title>EthernaLotto</title>
            <link rel="icon" href="/favicon.png"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <meta name="theme-color" content="#000000"/>
            <meta name="description" content="EthernaLotto"/>
          </Head>
          <Component {...pageProps}/>
        </SSRProvider>
      </LotteryContextProvider>
    </ConnectionProvider>
  );
}
