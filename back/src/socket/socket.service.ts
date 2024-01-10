import {Injectable} from '@nestjs/common';
import {Server} from 'socket.io';
import {MongoClient} from 'mongodb';
import {ConfigService} from "@nestjs/config";
import {Player, PlayerStatus, Room} from "../model";
import {generateCode} from "../utils/shared.utils";
import {PlayerSocket} from "./socket.gateway";
import {MAX_PLAYERS} from "../app.const";

@Injectable()
export class SocketService {
    constructor(private configService: ConfigService) {
    }

    private dbUrl :string = this.configService.get<string>('database.url')!;
    private dbName :string = this.configService.get<string>('database.name')!;

    private db = new MongoClient(this.dbUrl).db(this.dbName);

    public async createRoom(socket: PlayerSocket,playerName: string): Promise<Room> {
        if(!playerName){
            playerName = 'Anonymous-1';
        }
        const player: Player = {name: playerName, socketId: socket.id};
        const room: Room = {code: generateCode(), players: [player], maxPlayers: MAX_PLAYERS, owned: player};
        socket.join(room.code);
        socket.roomCode = room.code;

        await this.db.collection('rooms').insertOne(room);

        console.log('Player:' + playerName + ' created room:' + room.code)
        return room;
    }

    public async joinRoom(socket: PlayerSocket, roomId: string, playerName: string): Promise<Room> {
        await this.canJoinRoom(socket, roomId);
        const room: Room = await this.findRoom(roomId) as Room;
        socket.join(roomId);
        socket.roomCode = room.code;

        if(!playerName){
            playerName = 'Anonymous-' + (room.players.length+1);
        }

        const player: Player = {name: playerName, socketId: socket.id};
        room.players.push(player);
        await this.updateRoom(room);

        console.log('Player:' + playerName + ' joined room:' + roomId)
        return room;
    }

    public async startGame(socket: PlayerSocket, server: Server): Promise<void> {
        try {
            await this.canStartGame(socket);
            const room = await this.findRoom(socket.roomCode);
            if(room) {
                console.log('Starting game');
            }
        }catch (error) {
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
        if(!room) {
            throw new Error("Room not found");
        }
        if(socket.id !== room.owned.socketId) {
            throw new Error("You are not the owner of the room");
        }
    }

    private async canJoinRoom(socket: PlayerSocket, roomId: string): Promise<void> {
        //TODO: VERIFIER SI IL EST DANS AUCUNE AUTRE ROOM

        const room = await this.findRoom(roomId);
        if(!room) {
            throw new Error("Room not found");
        }

        if(room?.players.length === room?.maxPlayers) {
            throw new Error("The room is full");
        }

        const present: boolean = room?.players.some(player => player.socketId === socket.id) ?? false;
        if(present) {
            throw new Error("You are already in this room");
        }
     }

    private async findRoom(code: string): Promise<Room | undefined> {
        const room = await this.db.collection('rooms').findOne({code: code});
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
        await this.db.collection('rooms').updateOne({code: room.code}, {$set: room});
    }
}