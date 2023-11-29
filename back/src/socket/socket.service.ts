import {Injectable} from '@nestjs/common';
import {Socket} from 'socket.io';
import {Room} from "../model";
import {generateUuid} from "../utils/shared.utils";

@Injectable()
export class SocketService {
    private readonly connectedClients: Map<string, Socket> = new Map();

    private readonly rooms: Room[] = [];

    public createRoom(socket: Socket) {
        const room: Room = {uuid: generateUuid()};
        socket.join(room.uuid);
        this.rooms.push(room);
    }

    joinRoom(socket: Socket, roomId: string) {
        socket.join(roomId);
    }

    public roomExist(uuid: string) {
        return this.rooms.some((r: Room) => r.uuid === uuid);
    }
}