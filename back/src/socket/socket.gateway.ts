import {OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {SocketService} from './socket.service';
import {validUuid} from "../utils/shared.utils";
import {isString} from "@nestjs/common/utils/shared.utils";

@WebSocketGateway({cors: {origin: '*'}})
export class SocketGateway implements OnGatewayConnection {
    @WebSocketServer()
    private server: Server;

    constructor(private readonly socketService: SocketService) {}

    handleConnection(client: Socket): void {
        console.log('connected');
    }

    @SubscribeMessage('create')
    handleCreate(client: Socket): string {
        console.log("---- CREATE ----");
        const id =  this.socketService.createRoom(client);
        console.log(id);
        return id;
        //client.emit('created', id);
    }

    @SubscribeMessage('status')
    handleEvent(client:Socket): void {
        console.log("---- STATUS ----");
        console.log(client.rooms);
    }
}