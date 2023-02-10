import Web3 from 'web3';
import {provider} from 'web3-core';
import {Subscription} from 'web3-core-subscriptions';
import {BlockHeader} from 'web3-eth';
import {Contract} from 'web3-eth-contract';
import {AbiItem} from 'web3-utils';

import LotteryABI from './Lottery.json';


export interface Options {
  web3?: Web3;
  provider?: provider;
  address: string;
}


export class LotterySubscription<SubscriptionType> {
  public constructor(private readonly _subscription: Subscription<SubscriptionType>) {}

  public cancel(): void {
    this._subscription.unsubscribe();
  }
}


export interface Receipt {
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  blockNumber: number;
}

export interface Draw {
  date: Date;
  round: number;
  jackpot: number;
  numbers: number[];
  winners: number[][];
}

export interface Ticket {
  id: number;
  date: Date;
  round: number;
  draw: Draw | null;
  player: string;
  numbers: number[];
}


export class Lottery {
  public static readonly ABI: AbiItem[] = LotteryABI.abi as AbiItem[];

  public static readonly NULL_REFERRAL_CODE =
      '0x0000000000000000000000000000000000000000000000000000000000000000';

  private readonly _address: string;
  private readonly _web3: Web3;
  private readonly _contract: Contract;

  public constructor(options: Options) {
    if (!options.address) {
      throw new Error('the `address` option is required');
    }
    if (!options.web3 && !options.provider) {
      throw new Error('either a Web3 instance or a `provider` must be specified in the options');
    }
    this._address = options.address;
    if (options.web3) {
      this._web3 = options.web3;
    } else {
      this._web3 = new Web3(options.provider!);
    }
    this._contract = new this._web3.eth.Contract(Lottery.ABI, this._address);
  }

  public get address(): string {
    return this._address;
  }

  public get web3(): Web3 {
    return this._web3;
  }

  public setProvider(p: provider): void {
    this._web3.setProvider(p);
  }

  public async isPaused(): Promise<boolean> {
    return await this._contract.methods.paused().call();
  }

  public async getJackpot(): Promise<string> {
    return await this._web3.eth.getBalance(this._address);
  }

  public subscribeToJackpot(
      callback: (jackpot: string) => unknown): LotterySubscription<BlockHeader>
  {
    const fetch = async () => callback(await this.getJackpot());
    const subscription = this._web3.eth.subscribe('newBlockHeaders').on('data', () => fetch());
    fetch();
    return new LotterySubscription<BlockHeader>(subscription);
  }

  public generateReferralCode(): string {
    const bytes = Array.from({length: 32}, () => Math.floor(Math.random() * 256));
    const hex = this._web3.utils.bytesToHex(bytes);
    return this._web3.utils.padLeft(hex, 64);
  }

  public async isReferralCodeClaimed(code: string): Promise<boolean> {
    const address = await this._contract.methods.partnersByReferralCode(code).call();
    return !this._web3.utils.toBN(address).isZero();
  }

  public async claimReferralCode(code: string, account: string): Promise<void> {
    await this._contract.methods.claimReferralCode(code, account).send({from: account});
  }

  public encodeReferralCode(code: string): string {
    const bytes = this._web3.utils.hexToBytes(code);
    const unpadded = [];
    let zero = true;
    for (let i = 0; i < bytes.length; i++) {
      if (bytes[i] > 0) {
        zero = false;
      }
      if (!zero) {
        unpadded.push(bytes[i]);
      }
    }
    return window.btoa(String.fromCharCode(...unpadded));
  }

  public decodeReferralCode(encoded: string): string {
    const bytes = Array.from(window.atob(encoded), c => c.charCodeAt(0));
    const hex = this._web3.utils.bytesToHex(bytes);
    return this._web3.utils.padLeft(hex, 64);
  }

  public async getBaseTicketPrice(): Promise<string> {
    return await this._contract.methods.baseTicketPrice().call();
  }

  public async getTicketPrice(numbers: number[]): Promise<string> {
    return await this._contract.methods.getTicketPrice(numbers).call();
  }

  public async buyTicket(numbers: number[], account?: string): Promise<Receipt> {
    const value = await this._contract.methods.getTicketPrice(numbers).call();
    return await this._contract.methods.buyTicket(
        Lottery.NULL_REFERRAL_CODE, numbers).send({from: account, value});
  }

  public async getCurrentRound(): Promise<number> {
    const round = await this._contract.methods.currentRound().call();
    return parseInt(round, 10);
  }

  public async isRoundClosing(): Promise<boolean> {
    return await this._contract.methods.state().call() !== 0;
  }

  public async getTicketIds(account: string): Promise<number[]> {
    const ids: string[] = await this._contract.methods.getTicketIds(account).call();
    return ids.map(id => parseInt(id, 10));
  }

  public async getTicket(id: number): Promise<Ticket> {
    const {player, round, timestamp, numbers}: {
      player: string,
      round: string,
      timestamp: string,
      numbers: string[],
    } = await this._contract.methods.getTicket(id).call();
    const parsedRound = parseInt(round, 10);
    const currentRound = await this.getCurrentRound();
    const draw = parsedRound < currentRound ? await this.getDrawData(parsedRound) : null;
    return {
      id,
      date: new Date(parseInt(timestamp, 10) * 1000),
      round: parsedRound,
      draw,
      player,
      numbers: numbers.map(number => parseInt(number, 10)),
    };
  }

  private static async _sanitizeRoundNumber(currentRound: number, round?: number): Promise<number> {
    if (!round && round !== 0) {
      round = currentRound;
    }
    if (round < 0) {
      round = currentRound + round;
    }
    if (round < 0) {
      throw new Error('invalid round number');
    }
    return round!;
  }

  private async sanitizeRoundNumber(round?: number): Promise<number> {
    const currentRound = await this.getCurrentRound();
    return Lottery._sanitizeRoundNumber(currentRound, round);
  }

  public async getTicketsForRound(account: string, round?: number): Promise<Ticket[]> {
    const currentRound = await this.getCurrentRound();
    round = await Lottery._sanitizeRoundNumber(currentRound, round);
    const maybeGetDrawData = async () => {
      if (round! < currentRound) {
        return this.getDrawData(round);
      } else {
        return null;
      }
    };
    const idStrings: string[] = await this._contract.methods.getTicketIdsForRound(
        account, round).call();
    if (!idStrings.length) {
      return [];
    }
    const ids = idStrings.map(id => parseInt(id, 10));
    const [draw, data] = await Promise.all([
      maybeGetDrawData(),
      Promise.all(ids.map(id => this._contract.methods.getTicket(id).call())),
    ]);
    return data.map(({timestamp, numbers}: {
      timestamp: string,
      numbers: string[],
    }, index) => ({
      id: ids[index],
      date: new Date(parseInt(timestamp, 10) * 1000),
      round: round!,
      draw: draw,
      player: account,
      numbers: numbers.map(number => parseInt(number, 10)),
    }));
  }

  public async getTimeOfNextDraw(): Promise<Date> {
    const nextDrawTime = await this._contract.methods.nextDrawTime().call();
    return new Date(parseInt(nextDrawTime, 10) * 1000);
  }

  public async getDrawData(round?: number): Promise<Draw> {
    round = await this.sanitizeRoundNumber(round);
    const {blockNumber, numbers, winners}: {
      blockNumber: string,
      numbers: string[],
      winners: string[][],
    } = await this._contract.methods.getDrawData(round).call();
    const parsedBlockNumber = parseInt(blockNumber, 10);
    const [{timestamp}, jackpot] = await Promise.all([
      this._web3.eth.getBlock(parsedBlockNumber),
      this._web3.eth.getBalance(this._address, parsedBlockNumber),
    ]);
    return {
      date: new Date(parseInt('' + timestamp, 10) * 1000),
      round: round,
      jackpot: parseFloat(this._web3.utils.fromWei(jackpot).toString()),
      numbers: numbers.map(number => parseInt(number, 10)),
      winners: winners.map(ids => ids.map(id => parseInt(id, 10))),
    };
  }

  public async getUnclaimedPrizes(account: string): Promise<string> {
    return await this._contract.methods.payments(account).call();
  }

  public async withdrawPrizes(account: string): Promise<Receipt> {
    return await this._contract.methods.withdrawPayments(account).send({from: account});
  }
}
