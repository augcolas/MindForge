import {Injectable, Logger} from '@nestjs/common';
import {Server} from 'socket.io';
import {PlayerStatus, Room, SendCardEnum} from "../model";
import {PlayerSocket} from "./socket.gateway";
import {
    EMIT_EVENT_GAME_STARTED,
    EMIT_EVENT_GAME_STATUS,
    EMIT_RECEIVE_CARD, LISTENER_EVENT_PLAYER_ACTION
} from "../app.const";
import {Card} from "../utils/card";
import {Color, Value} from "../app.enum";

import {RoomService} from "../database/room.service";
import {GameService} from "../database/game.service";

@Injectable()
export class SocketService {

    protected state = "";

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
                    server.to(player.socketId).emit(EMIT_RECEIVE_CARD, {
                        ev: SendCardEnum.OWN_CARDS,
                        cards: [card1, card2]
                    });
                }
                const flop1 = await this.gameService.getACardFromDeck(room.code);
                const flop2 = await this.gameService.getACardFromDeck(room.code);
                const flop3 = await this.gameService.getACardFromDeck(room.code);

                // Distribute cards to the main hand
                server.to(room.code).emit(EMIT_RECEIVE_CARD, {
                    ev: SendCardEnum.FLOP,
                    cards: [flop1, flop2, flop3]
                });

                this.state = "flop";

                // Emit the first player
                server.to(room.code).emit(EMIT_EVENT_GAME_STATUS, {
                    playing: room.players[0]
                });


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

    public async playerAction(socket: PlayerSocket,server: Server, data: any): Promise<void> {
        console.log("socket", socket);
        const room = await this.roomService.findRoom(socket.roomCode);
        console.log("player-action", data);

        if(room){
            const player = room.players.find(p => p.name === data.player);
            const action = data.action;

            if (player) {
                const index = room.players.indexOf(player);
                const nextPlayer = room.players[index + 1];

                if (nextPlayer) {
                    server.to(room.code).emit(EMIT_EVENT_GAME_STATUS, {
                        playing: nextPlayer
                    });
                } else {
                    server.to(room.code).emit(EMIT_EVENT_GAME_STATUS, {
                        playing: " "
                    });

                    switch (this.state) {
                        case "flop":
                            const turn = await this.gameService.getACardFromDeck(room.code);
                            server.to(room.code).emit(EMIT_RECEIVE_CARD, {
                                ev: SendCardEnum.TURN,
                                cards: [turn]
                            });
                            this.state = "turn";
                            break;
                        case "turn":
                            const river = await this.gameService.getACardFromDeck(room.code);
                            server.to(room.code).emit(EMIT_RECEIVE_CARD, {
                                ev: SendCardEnum.RIVER,
                                cards: [river]
                            });
                            this.state = "river";
                            break;
                    }

                    // Emit the first player
                    server.to(room.code).emit(EMIT_EVENT_GAME_STATUS, {
                        playing: room.players[0]
                    });
                }
            }
        }
    }
}