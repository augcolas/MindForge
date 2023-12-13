import {Card} from "./utils/card";

export interface Room {
    uuid: string;
    owned: string;
    players: string[];
    maxPlayers: number;
}

export interface EventGame {
    playerHand: Card[];
}

export interface PlayerStatus {
    currentRoom?: string;
    roomPlayersConnected?: number;
    roomMaxPlayers?: number;
    roomOwner?: string;
}


