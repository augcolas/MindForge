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

        if (game) {
            const length = game.deck.length;
            const random = getRandomNumber(0, length);

            const card = game.deck[random];

            game.deck.splice(random, 1);

            await this.db.db.collection('game').updateOne({code: gameId}, {
                $set: {
                    deck: game.deck
                }
            });

            return card;
        } else {
            throw new Error('Game not found');
        }
    }
}