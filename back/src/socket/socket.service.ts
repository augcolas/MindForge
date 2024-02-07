import {Injectable, Logger} from '@nestjs/common';
import {Server} from 'socket.io';
import {MongoClient} from 'mongodb';
import {ConfigService} from "@nestjs/config";
import {Player, PlayerStatus, Room} from "../model";
import {generateCode, getRandomNumber} from "../utils/shared.utils";
import {PlayerSocket} from "./socket.gateway";
import {EMIT_RECEIVE_CARD, MAX_PLAYERS} from "../app.const";
import {Card} from "../utils/card";
import {Color, Value} from "../app.enum";

@Injectable()
export class SocketService {
    constructor(private configService: ConfigService) {
    }

    private readonly logger: Logger = new Logger(SocketService.name);

    private dbUrl: string = this.configService.get<string>('database.url')!;
    private dbName: string = this.configService.get<string>('database.name')!;

    private db = new MongoClient(this.dbUrl).db(this.dbName);

    public async createRoom(socket: PlayerSocket, playerName: string): Promise<Room> {
        if (!playerName) {
            playerName = 'Anonymous-1';
        }
        const player: Player = {name: playerName, socketId: socket.id};
        const room: Room = {code: generateCode(), players: [player], maxPlayers: MAX_PLAYERS, owned: player};
        socket.join(room.code);
        socket.roomCode = room.code;

        await this.db.collection('rooms').insertOne(room);
        this.logger.log('Player ' + playerName + ' created room ' + room.code);
        return room;
    }

    public async joinRoom(socket: PlayerSocket, roomId: string, playerName: string): Promise<Room> {
        await this.canJoinRoom(socket, roomId);
        const room: Room = await this.findRoom(roomId) as Room;
        socket.join(roomId);
        socket.roomCode = room.code;

        if (!playerName) {
            playerName = 'Anonymous-' + (room.players.length + 1);
        }

        const player: Player = {name: playerName, socketId: socket.id};
        room.players.push(player);
        await this.updateRoom(room);

        this.logger.log('Player ' + playerName + ' join the room ' + roomId);
        return room;
    }

    public async leaveRoom(socket: PlayerSocket): Promise<void> {
        const room = await this.findRoom(socket.roomCode);
        if (room) {
            const index = room.players.findIndex(player => player.socketId === socket.id);
            const name = room.players[index].name;
            if (index !== -1) {
                room.players.splice(index, 1);
                await this.updateRoom(room);
                socket.leave(room.code);


                this.logger.log('Player:' + name + ' left room:' + room.code);


                if (room.players.length === 0) {
                    await this.deleteRoom(room.code);
                    return;
                } else if (room.players[index].socketId === room.owned.socketId) {
                    room.owned = room.players[0];
                    await this.updateRoom(room);
                    return;
                }
            }
        }
    }

    public async startGame(socket: PlayerSocket, server: Server): Promise<void> {
        try {
            await this.canStartGame(socket);
            const room = await this.findRoom(socket.roomCode);
            const dbRoom = await this.db.collection('rooms').findOne({code: socket.roomCode});
            if (room && dbRoom) {
                const deck = this.create52cards();
                await this.db.collection('game').insertOne({...dbRoom, deck: deck});

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

    public async status(socket: PlayerSocket): Promise<PlayerStatus> {
        const room = await this.findRoom(socket.roomCode);
        return {
            currentRoom: room?.code,
            roomPlayersConnected: room?.players.length,
            roomOwner: room?.owned,
            roomMaxPlayers: room?.maxPlayers
        }
    }


    /********************************************
     *
     * PRIVATE
     *
     *********************************************/

    private async canStartGame(socket: PlayerSocket): Promise<void> {
        const room = await this.findRoom(socket.roomCode ?? '');
        if (!room) {
            throw new Error("Room not found");
        }
        if (socket.id !== room.owned.socketId) {
            throw new Error("You are not the owner of the room");
        }
    }

    private async canJoinRoom(socket: PlayerSocket, roomId: string): Promise<void> {
        //TODO: VERIFIER SI IL EST DANS AUCUNE AUTRE ROOM

        const room = await this.findRoom(roomId);
        if (!room) {
            throw new Error("Room not found");
        }

        if (room?.players.length === room?.maxPlayers) {
            throw new Error("The room is full");
        }

        const present: boolean = room?.players.some(player => player.socketId === socket.id) ?? false;
        if (present) {
            throw new Error("You are already in this room");
        }
    }

    private async findRoom(code: string): Promise<Room | undefined> {
        const room = await this.db.collection('rooms').findOne({code: code});
        if (room) {
            return {
                code: room.code,
                players: room.players,
                maxPlayers: room.maxPlayer,
                owned: room.owned
            };
        } else {
            return undefined;
        }
    }

    private async updateRoom(room: Room): Promise<void> {
        await this.db.collection('rooms').updateOne({code: room.code}, {$set: room});
        this.logger.log('Room:' + room.code + ' updated');
    }

    private async deleteRoom(code: string): Promise<void> {
        await this.db.collection('rooms').deleteOne({code: code});
        this.logger.log('Room:' + code + ' deleted');
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