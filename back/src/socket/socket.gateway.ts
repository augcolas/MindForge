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
    LISTENER_EVENT_LEAVE_ROOM, LISTENER_EVENT_PLAYER_ACTION,
    LISTENER_EVENT_START_GAME,
    LISTENER_EVENT_STATUS
} from "../app.const";
import {PlayerStatus, Room} from "../model";
import {Logger} from "@nestjs/common";

export interface PlayerSocket extends Socket {
    roomCode: string;
}



@WebSocketGateway({cors: {origin: '*'}})
export class SocketGateway implements OnGatewayConnection {

    private readonly logger:Logger = new Logger(SocketService.name);

    @WebSocketServer()
    private server: Server;

    constructor(private readonly socketService: SocketService) {
    }

    handleConnection(client: PlayerSocket): void {}

    @SubscribeMessage(LISTENER_EVENT_CREATE_ROOM)
    async handleCreate(
      @ConnectedSocket() client: PlayerSocket,
      @MessageBody('playerName') playerName: string
    ): Promise<Room|undefined> {
        try {
            return await this.socketService.createRoom(client, playerName);
        }
        catch (error) {
            this.logger.error(error);
        }
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
            this.logger.error(error);
        }

    }

    @SubscribeMessage(LISTENER_EVENT_LEAVE_ROOM)
    async handleLeave(client: PlayerSocket): Promise<void> {
        try {
            await this.socketService.leaveRoom(client);
        } catch (error) {
            this.logger.error(error);
        }
    }

    @SubscribeMessage(LISTENER_EVENT_START_GAME)
    async handleStart(client: PlayerSocket): Promise<void> {
        try {
            await this.socketService.startGame(client,this.server);
        }catch (error) {
            this.logger.error(error);
        }
    }


    @SubscribeMessage(LISTENER_EVENT_STATUS)
    async handleStatus(client: PlayerSocket): Promise<PlayerStatus> {
        return await this.socketService.roomStatus(client);
    }

    @SubscribeMessage(LISTENER_EVENT_PLAYER_ACTION)
    async handlePlayerAction(@ConnectedSocket() client: PlayerSocket, @MessageBody() data: any): Promise<void> {
        try {
            await this.socketService.playerAction(client, this.server,data);
        }catch (error) {
            this.logger.error(error);
        }
    }
}