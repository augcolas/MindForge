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
import {isString} from "@nestjs/common/utils/shared.utils";
import {validUuid} from "../utils/shared.utils";

@WebSocketGateway({cors: {origin: '*'}})
export class SocketGateway implements OnGatewayConnection {
    @WebSocketServer()
    private server: Server;

    constructor(private readonly socketService: SocketService) {
    }

    handleConnection(client: Socket): void {
        console.log('connected');
    }

    @SubscribeMessage('join')
    handleJoin(@ConnectedSocket() client: Socket, @MessageBody('roomId') roomId: string): void {
        if (isString(roomId) && validUuid(roomId)) this.socketService.joinRoom(client, roomId);
    }

    @SubscribeMessage('create')
    handleCreate(client: Socket): string {
        console.log("---- CREATE ----");
        const id = this.socketService.createRoom(client);
        console.log(id);
        return id;
    }

    @SubscribeMessage('status')
    handleEvent(client: Socket): void {
        console.log("---- STATUS ----");
        console.log(client.rooms);
    }
}