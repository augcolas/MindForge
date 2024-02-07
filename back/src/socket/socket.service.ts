import {Injectable, Logger} from '@nestjs/common';
import {Server} from 'socket.io';
import {PlayerStatus, Room} from "../model";
import {PlayerSocket} from "./socket.gateway";
import {EMIT_EVENT_GAME_STARTED, EMIT_RECEIVE_CARD} from "../app.const";
import {Card} from "../utils/card";
import {Color, Value} from "../app.enum";

import {RoomService} from "../database/room.service";
import {GameService} from "../database/game.service";

@Injectable()
export class SocketService {

    private readonly logger: Logger = new Logger(SocketService.name);

    constructor(private roomService: RoomService, private gameService: GameService) {
    }


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
                this.logger.log('Room ' + room.code + ' started');
                server.to(room.code).emit(EMIT_EVENT_GAME_STARTED);

                const deck = this.create52cards();
                await this.gameService.create(room, deck);

                // Distribute cards to all players
                for (const player of room.players) {
                    const card1 = await this.gameService.getACardFromDeck(room.code);
                    const card2 = await this.gameService.getACardFromDeck(room.code);
                    server.to(player.socketId).emit(EMIT_RECEIVE_CARD, [card1,card2]);
                }

                // Distribute cards to the main hand
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
}