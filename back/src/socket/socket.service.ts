import {Injectable, Logger} from '@nestjs/common';
import {Server} from 'socket.io';
import {MongoClient} from 'mongodb';
import {ConfigService} from "@nestjs/config";
import {PlayerStatus, Room} from "../model";
import {getRandomNumber} from "../utils/shared.utils";
import {PlayerSocket} from "./socket.gateway";
import {EMIT_RECEIVE_CARD} from "../app.const";
import {Card} from "../utils/card";
import {Color, Value} from "../app.enum";

import {RoomService} from "../database/room.service";
import {GameService} from "../database/game.service";

@Injectable()
export class SocketService {
    constructor(private configService: ConfigService) {
    }

    private readonly logger: Logger = new Logger(SocketService.name);

    private dbUrl: string = this.configService.get<string>('database.url')!;
    private dbName: string = this.configService.get<string>('database.name')!;

    private db = new MongoClient(this.dbUrl).db(this.dbName);

    private roomService = new RoomService(this.db);
    private gameService = new GameService(this.db);

    public async createRoom(socket: PlayerSocket, playerName: string): Promise<Room> {
        return await this.roomService.create(socket, playerName);
    }

    public async joinRoom(socket: PlayerSocket, roomId: string, playerName: string): Promise<Room> {
        return await this.roomService.join(socket, roomId, playerName);
    }

    public async leaveRoom(socket: PlayerSocket): Promise<void> {
        return await this.roomService.leave(socket);
    }
    public async roomStatus(socket: PlayerSocket): Promise<PlayerStatus> {
        return await this.roomService.status(socket);
    }


    public async startGame(socket: PlayerSocket, server: Server): Promise<void> {
        try {
            await this.roomService.canStartGame(socket);
            const room = await this.roomService.findRoom(socket.roomCode);
            if (room) {
                const deck = this.create52cards();
                await this.gameService.create(room, deck);

                for (const player of room.players) {
                    const card1 = await this.getACardFromDeck(room.code);
                    const card2 = await this.getACardFromDeck(room.code);
                    server.to(player.socketId).emit(EMIT_RECEIVE_CARD, card1);
                    server.to(player.socketId).emit(EMIT_RECEIVE_CARD, card2);
                }

                this.logger.log('Start game');
                server.to(room.code).emit('game-started');
            }
        } catch (error) {
            throw error;
        }
    }

    private create52cards(): Card[] {
        const allCards: Card[] = [];
        Object.values(Value).filter(value => typeof value === 'number').forEach((value: Value) => {
            Object.values(Color).forEach((color: Color) => {
                allCards.push(new Card(value, color));
            });
        });
        return allCards;
    }


    private async getACardFromDeck(roomId: string): Promise<Card> {
        const gamedb = await this.db.collection('game').findOne({code: roomId});

        //TODO: retirer la carte du deck
        if (gamedb) {
            const length = gamedb.deck.length;
            const random = getRandomNumber(0, length);
            return gamedb.deck[random];
        } else {
            throw new Error('Game not found');
        }
    }
}