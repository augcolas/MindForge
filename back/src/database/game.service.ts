import {Room} from "../model";
import {DatabaseService} from "./database.service";
import {Injectable, Logger} from "@nestjs/common";
import {Card} from "../utils/card";
import {getRandomNumber} from "../utils/shared.utils";

@Injectable()
export class GameService {
    constructor(private db: DatabaseService) {}


    public async create(room: Room, deck: any): Promise<void> {
        await this.db.db.collection('game').insertOne({
            ...room,
            deck: deck
        });
    }


    public async getACardFromDeck(gameId: string): Promise<Card> {
        const game = await this.db.db.collection('game').findOne({code: gameId});

        //TODO: retirer la carte du deck
        if (game) {
            const length = game.deck.length;
            const random = getRandomNumber(0, length);
            return game.deck[random];
        } else {
            throw new Error('Game not found');
        }
    }
}