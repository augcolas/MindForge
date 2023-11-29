import {Card} from "./utils/card";

export interface Room {
    uuid: string;
    owned: string;
    players: string[];
    maxPlayer: number;
}

export interface EventGame {
    playerHand: Card[];
}

export interface PlayerStatus {
    currentRoom?: string;
    roomPlayerConnected?: number;
    roomMaxPlayer?: number;
    roomOwner?: string;
}


