import {Card} from "./utils/card";

export interface Room {
    code: string;
    owned: Player;
    players: Player[];
    maxPlayers: number;
}

export interface EventGame {
    playerHand: Card[];
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
    OWN_CARDS="OWN_CARDS",
    FLOP="FLOP",
    TURN="TURN",
    RIVER="RIVER"
}