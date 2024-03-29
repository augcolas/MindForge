import { Card } from './utils/card';

export interface Room {
  code: string;
  owned: Player;
  players: Player[];
  maxPlayers: number;
}

export interface Game {
  code: string;
  deck: Card[];
  players: PlayerGame[];
}

export interface PlayerGame extends Player {
  money: number;
  currentBet: number | null;
}

export interface PlayerStatus {
  currentRoom?: string;
  roomPlayersConnected?: number;
  roomMaxPlayers?: number;
  roomOwner?: Player;
}

export interface Player {
  name: string;
  socketId: string;
}

export enum SendCardEnum {
  OWN_CARDS = 'OWN_CARDS',
  FLOP = 'FLOP',
  TURN = 'TURN',
  RIVER = 'RIVER',
}
