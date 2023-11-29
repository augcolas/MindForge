import {Injectable} from '@nestjs/common';
import {Server} from 'socket.io';
import {EventGame, PlayerStatus, Room} from "../model";
import {generateUuid} from "../utils/shared.utils";
import {PlayerSocket} from "./socket.gateway";
import {EMIT_EVENT_GAME} from "../app.const";
import {drawCard} from "../utils/poker.utils";

@Injectable()
export class SocketService {
    private readonly rooms: Room[] = [];


    public createRoom(socket: PlayerSocket): string {
        const room: Room = {uuid: generateUuid(), players: [socket.id], maxPlayer: 4, owned: socket.id};
        socket.join(room.uuid);
        socket.roomUuid = room.uuid;
        this.rooms.push(room);
        return room.uuid;
    }

    public joinRoom(socket: PlayerSocket, roomId: string): Room {
        if (this.canJoinRoom(socket, roomId)) {
            const room: Room = this.findRoom(roomId) as Room;
            socket.join(roomId);
            socket.roomUuid = room.uuid;
            room.players.push(socket.id);
            return room;
        } else {
            throw new Error("Cannot join room");
        }
    }

    public startGame(socket: PlayerSocket, server: Server): void {
        if (this.canStartGame(socket)) {
            const room = this.findRoom(socket.roomUuid);
            if(room) {
            }
        } else {
            throw new Error("Cannot start game");
        }
    }

    public status(socket: PlayerSocket): PlayerStatus {
        const room = this.findRoom(socket.roomUuid);
        return {
            currentRoom: room?.uuid,
            roomPlayerConnected: room?.players.length,
            roomOwner: room?.owned,
            roomMaxPlayer: room?.maxPlayer
        }
    }


    /********************************************
     *
     * PRIVATE
     *
     *********************************************/

     private canStartGame(socket: PlayerSocket): boolean {
        const room = this.findRoom(socket.roomUuid ?? '');
        return (room !== undefined && socket.id === room.owned)
    }

    private canJoinRoom(socket: PlayerSocket, roomId: string): boolean {
        //TODO: VERIFIER SI IL EST DEJA PRESENT DANS LA ROOM
        //TODO: VERIFIER SI IL EST DANS AUCUNE AUTRE ROOM
        const room = this.findRoom(roomId);
        return room !== undefined && room.maxPlayer > room.players.length;
    }

    private findRoom(uuid: string): Room | undefined {
        return this.rooms.find((r) => r.uuid === uuid);
    }
}