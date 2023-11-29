import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {SocketService} from './socket.service';
import {
    EMIT_ROOM_STATUS,
    LISTENER_EVENT_CREATE_ROOM,
    LISTENER_EVENT_JOIN_ROOM,
    LISTENER_EVENT_START_GAME,
    LISTENER_EVENT_STATUS
} from "../app.const";
import {PlayerStatus, Room} from "../model";

export interface PlayerSocket extends Socket {
    roomUuid: string;
}



@WebSocketGateway({cors: {origin: '*'}})
export class SocketGateway implements OnGatewayConnection {
    @WebSocketServer()
    private server: Server;

    constructor(private readonly socketService: SocketService) {
    }

    handleConnection(client: PlayerSocket): void {
        console.log('connected');
    }

    @SubscribeMessage(LISTENER_EVENT_JOIN_ROOM)
    handleJoin(@ConnectedSocket() client: PlayerSocket, @MessageBody('roomId') roomId: string): Room {
        const room = this.socketService.joinRoom(client, roomId);
        this.server.in(roomId).emit(EMIT_ROOM_STATUS, room);
        return room;
    }


    @SubscribeMessage(LISTENER_EVENT_CREATE_ROOM)
    handleCreate(client: PlayerSocket): string {
        return this.socketService.createRoom(client);
    }

    @SubscribeMessage(LISTENER_EVENT_START_GAME)
    handleStart(client: PlayerSocket): void {
        this.socketService.startGame(client, this.server);
    }


    @SubscribeMessage(LISTENER_EVENT_STATUS)
    handleStatus(client: PlayerSocket): PlayerStatus {
        return this.socketService.status(client);
    }
}