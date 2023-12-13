import {Injectable} from '@nestjs/common';
import {Server} from 'socket.io';
import {MongoClient} from 'mongodb';

import {Player, PlayerStatus, Room} from "../model";
import {generateCode} from "../utils/shared.utils";
import {PlayerSocket} from "./socket.gateway";
import {DATABASE_NAME, DATABASE_URL, MAX_PLAYERS} from "../app.const";

@Injectable()
export class SocketService {
    private client = new MongoClient(DATABASE_URL);

    public async createRoom(socket: PlayerSocket,playerName: string): Promise<Room> {
        const player: Player = {name: playerName, socketId: socket.id};
        const room: Room = {code: generateCode(), players: [player], maxPlayers: MAX_PLAYERS, owned: player};
        socket.join(room.code);
        socket.roomCode = room.code;

        const db = this.client.db(DATABASE_NAME);
        await db.collection('rooms').insertOne(room);

        return room;
    }

    public async joinRoom(socket: PlayerSocket, roomId: string, playerName: string): Promise<Room> {
        const player: Player = {name: playerName, socketId: socket.id};
        if (await this.canJoinRoom(socket, roomId)) {
            const room: Room = await this.findRoom(roomId) as Room;
            socket.join(roomId);
            socket.roomCode = room.code;
            room.players.push(player);
            await this.updateRoom(room);
            return room;
        } else {
            throw new Error("Cannot join room");
        }
    }

    public async startGame(socket: PlayerSocket, server: Server): Promise<void> {
        if (await this.canStartGame(socket)) {
            const room = await this.findRoom(socket.roomCode);
            if(room) {
                console.log('Starting game');
            }
        } else {
            throw new Error("Cannot start game");
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

     private async canStartGame(socket: PlayerSocket): Promise<boolean> {
        const room = await this.findRoom(socket.roomCode ?? '');
        return (room !== undefined && socket.id === room.owned.socketId)
    }

    private async canJoinRoom(socket: PlayerSocket, roomId: string): Promise<boolean> {
        //TODO: VERIFIER SI IL EST DANS AUCUNE AUTRE ROOM
        const room = await this.findRoom(roomId);
        const present: boolean = room?.players.some(player => player.socketId === socket.id) ?? false;
        return room !== undefined && room.maxPlayers > room.players.length && !present;
    }

    private async findRoom(code: string): Promise<Room | undefined> {
        const db = this.client.db(DATABASE_NAME);
        const room = await db.collection('rooms').findOne({code: code});
        if(room) {
            return {
                code: room.code,
                players: room.players,
                maxPlayers: room.maxPlayer,
                owned: room.owned
            };
        }else{
            return undefined;
        }
    }

    private async updateRoom(room: Room): Promise<void> {
        const db = this.client.db(DATABASE_NAME);
        await db.collection('rooms').updateOne({code: room.code}, {$set: room});
    }
}