import {Injectable} from '@nestjs/common';
import {Socket} from 'socket.io';
import {Room} from "../model";
import {generateUuid} from "../utils/shared.utils";

@Injectable()
export class SocketService {
    private readonly connectedClients: Map<string, Socket> = new Map();

    private readonly rooms: Room[] = [];


    public createRoom(socket: Socket): string {
        const room: Room = {uuid: generateUuid(), players: []};
        socket.join(room.uuid);
        this.rooms.push(room);
        return room.uuid;
    }

    joinRoom(socket: Socket, roomId: string) {
        const room: Room | undefined = this.findRoom(roomId);

        if(room) {
            socket.join(roomId);
            room.players.push(socket.id);
        }
    }

    public findRoom(uuid: string): Room | undefined {
        return this.rooms.find((r) => r.uuid === uuid);
    }
}