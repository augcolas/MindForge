import {Injectable} from '@nestjs/common';
import {Socket} from 'socket.io';
import {Room} from "../model";
import {generateUuid, validUuid} from "../utils/shared.utils";
import {isString} from "@nestjs/common/utils/shared.utils";

@Injectable()
export class SocketService {
    private readonly connectedClients: Map<string, Socket> = new Map();

    private readonly rooms: Room[] = [];


    public createRoom(socket: Socket): string {
        const room: Room = {uuid: generateUuid(), players: [], maxPlayer: 4, owned: socket.id};
        socket.join(room.uuid);
        this.rooms.push(room);
        return room.uuid;
    }

    public joinRoom(socket: Socket, roomId: string): boolean {
        //TODO: VERIFIER MAX JOUEUR
        //TODO: VERIFIER SI IL EST DEJA PRESENT DANS LA ROOM
        //TODO: VERIFIER SI IL EST DANS AUCUNE AUTRE ROOM
        if(isString(roomId) && validUuid(roomId)) {
            const room: Room | undefined = this.findRoom(roomId);
            if(room) {
                socket.join(roomId);
                room.players.push(socket.id);
                return true;
            }
        }
        return false;
    }
    

    public findRoom(uuid: string): Room | undefined {
        return this.rooms.find((r) => r.uuid === uuid);
    }
}