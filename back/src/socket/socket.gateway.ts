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
    roomCode: string;
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

    @SubscribeMessage(LISTENER_EVENT_CREATE_ROOM)
    async handleCreate(
      @ConnectedSocket() client: PlayerSocket,
      @MessageBody('playerName') playerName: string
    ): Promise<Room> {
        return await this.socketService.createRoom(client, playerName);
    }

    @SubscribeMessage(LISTENER_EVENT_JOIN_ROOM)
    async handleJoin(
      @ConnectedSocket() client: PlayerSocket,
      @MessageBody('roomId') roomId: string,
      @MessageBody('playerName') playerName: string
    ): Promise<Room|undefined> {
        try {
            const room = await this.socketService.joinRoom(client, roomId, playerName);
            this.server.in(roomId).emit(EMIT_ROOM_STATUS, room);
            return room;
        } catch (error) {
            console.log(error.message);
        }

    }

    @SubscribeMessage(LISTENER_EVENT_START_GAME)
    async handleStart(client: PlayerSocket): Promise<void> {
        try {
            await this.socketService.startGame(client,this.server);
        }catch (error) {
            console.log(error);
        }
    }


    @SubscribeMessage(LISTENER_EVENT_STATUS)
    async handleStatus(client: PlayerSocket): Promise<PlayerStatus> {
        return await this.socketService.status(client);
    }
}