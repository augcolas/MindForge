import { Game, Player, PlayerGame, Room } from '../model';
import { DatabaseService } from './database.service';
import { Injectable } from '@nestjs/common';
import { Card } from '../utils/card';
import { getRandomNumber } from '../utils/shared.utils';

@Injectable()
export class GameService {
  constructor(private db: DatabaseService) {}

  public async create(
    room: Room,
    deck: Card[],
    players: Player[],
  ): Promise<Game> {
    const playersGames: PlayerGame[] = players.map((player) => ({
      ...player,
      money: 500,
      currentBet: null,
    }));

    const game: Game = { code: room.code, players: playersGames, deck };
    await this.db.db.collection('game').insertOne(game);

    return game;
  }

  public async getACardFromDeck(gameId: string): Promise<Card> {
    const game = await this.db.db.collection('game').findOne({ code: gameId });

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

  public async findGame(gameId: string): Promise<Game | undefined> {
    const game = await this.db.db.collection('game').findOne({ code: gameId });
    if (game) {
      return {
        code: game.code,
        players: game.players,
        deck: game.deck,
      };
    }
  }

  public async updateGame(game: Game): Promise<void> {
    await this.db.db
      .collection('game')
      .updateOne({ code: game.code }, { $set: { ...game } });
  }
}
