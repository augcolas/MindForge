import {Injectable} from '@nestjs/common';
import {Server} from 'socket.io';
import {MongoClient} from 'mongodb';

import {EventGame, PlayerStatus, Room} from "../model";
import {generateUuid} from "../utils/shared.utils";
import {PlayerSocket} from "./socket.gateway";
import {
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_URL,
    DATABASE_NAME,
} from "../app.const";

@Injectable()
export class SocketService {
    //private readonly _rooms: Room[] = [];
    private client = new MongoClient(DATABASE_URL);

    public async createRoom(socket: PlayerSocket): Promise<string> {
        const room: Room = {uuid: generateUuid(), players: [socket.id], maxPlayers: 4, owned: socket.id};
        socket.join(room.uuid);
        socket.roomUuid = room.uuid;

        const db = this.client.db(DATABASE_NAME);
        await db.collection('rooms').insertOne(room);

        return room.uuid;
    }

    public async joinRoom(socket: PlayerSocket, roomId: string): Promise<Room> {
        if (await this.canJoinRoom(socket, roomId)) {
            const room: Room = await this.findRoom(roomId) as Room;
            socket.join(roomId);
            socket.roomUuid = room.uuid;
            room.players.push(socket.id);
            await this.updateRoom(room);
            return room;
        } else {
            throw new Error("Cannot join room");
        }
    }

    public async startGame(socket: PlayerSocket, server: Server): Promise<void> {
        if (await this.canStartGame(socket)) {
            const room = await this.findRoom(socket.roomUuid);
            if(room) {
            }
        } else {
            throw new Error("Cannot start game");
        }
    }

    public async status(socket: PlayerSocket): Promise<PlayerStatus> {
        const room = await this.findRoom(socket.roomUuid);
        return {
            currentRoom: room?.uuid,
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
        const room = await this.findRoom(socket.roomUuid ?? '');
        return (room !== undefined && socket.id === room.owned)
    }

    private async canJoinRoom(socket: PlayerSocket, roomId: string): Promise<boolean> {
        //TODO: VERIFIER SI IL EST DANS AUCUNE AUTRE ROOM
        const room = await this.findRoom(roomId);
        const present: boolean = room?.players.includes(socket.id) ?? false;
        return room !== undefined && room.maxPlayers > room.players.length && !present;
    }

    private async findRoom(uuid: string): Promise<Room | undefined> {
        const db = this.client.db(DATABASE_NAME);
        const room = await db.collection('rooms').findOne({uuid: uuid});
        if(room) {
            return {
                uuid: room.uuid,
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
        await db.collection('rooms').updateOne({uuid: room.uuid}, {$set: room});
    }
}