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
        if (this.socketService.joinRoom(client, roomId)) {
            this.server.in(roomId).emit('join', `${client.id} has join the room`);
        } else {
            client.emit('error', 'You cannot join this room');
        }
    }

    @SubscribeMessage('create')
    handleCreate(client: Socket): string {
        console.log("---- CREATE ----");
        const id = this.socketService.createRoom(client);
        console.log(id);
        return id;
    }

    @SubscribeMessage('start')
    handleStart(client: Socket): string {
        console.log("---- START GAME ----");
        const id = this.socketService.createRoom(client);
        return id;
    }




    @SubscribeMessage('status')
    handleEvent(client: Socket): void {
        console.log("---- STATUS ----");
        console.log(client.rooms);
    }
}