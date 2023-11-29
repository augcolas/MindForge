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

    handleConnection(socket: Socket): void {
        const roomUuid = socket.handshake.query.roomId;

        if(roomUuid === "create-room") this.socketService.createRoom(socket);

        else if(isString(roomUuid) && validUuid(roomUuid) && this.socketService.roomExist(roomUuid)) {
            this.socketService.joinRoom(socket, roomUuid);
        }
         else throw new Error("Cannot handle your query");
    }

    @SubscribeMessage('status')
    handleEvent(client:Socket): void {
        console.log(client.rooms);
        console.log("STATUS");
    }
}