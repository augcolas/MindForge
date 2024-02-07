import {Player, PlayerStatus, Room} from "../model";
import {generateCode} from "../utils/shared.utils";
import {MAX_PLAYERS} from "../app.const";
import {PlayerSocket} from "../socket/socket.gateway";
import {Injectable, Logger} from "@nestjs/common";
import {DatabaseService} from "./database.service";

@Injectable()
export class RoomService {
    private readonly logger: Logger = new Logger(RoomService.name);

    constructor(private db: DatabaseService) {
    }

    public async create(socket: PlayerSocket, playerName: string): Promise<Room> {
        if (!playerName) {
            playerName = 'Anonymous-1';
        }
        const player: Player = {name: playerName, socketId: socket.id};
        const room: Room = {code: generateCode(), players: [player], maxPlayers: MAX_PLAYERS, owned: player};
        socket.join(room.code);
        socket.roomCode = room.code;

        await this.db.db.collection('rooms').insertOne(room);
        this.logger.log('Player:' + playerName + ' created room:' + room.code);
        return room;
    }

    public async join(socket: PlayerSocket, roomId: string, playerName: string): Promise<Room> {
        await this.canJoinRoom(socket, roomId);
        const room: Room = await this.findRoom(roomId) as Room;
        socket.join(roomId);
        socket.roomCode = room.code;

        if (!playerName) {
            playerName = 'Anonymous-' + (room.players.length + 1);
        }

        const player: Player = {name: playerName, socketId: socket.id};
        room.players.push(player);
        await this.updateRoom(room);

        this.logger.log('Player:' + playerName + ' joined room:' + roomId);
        return room;
    }

    public async leave(socket: PlayerSocket): Promise<void> {
        const room = await this.findRoom(socket.roomCode);
        if (room) {
            const index = room.players.findIndex(player => player.socketId === socket.id);
            const name = room.players[index].name;
            if (index !== -1) {
                room.players.splice(index, 1);
                await this.updateRoom(room);
                socket.leave(room.code);

                this.logger.log('Player:' + name + ' left room:' + room.code)

                if (room.players.length === 0) {
                    await this.deleteRoom(room.code);
                    return
                } else if (room.players[index].socketId === room.owned.socketId) {
                    room.owned = room.players[0];
                    await this.updateRoom(room);
                    return
                }
            }
        }
    }

    public async status(socket: PlayerSocket): Promise<PlayerStatus> {
        const room = await this.findRoom(socket.roomCode);
        return {
            currentRoom: room?.code,
            roomPlayersConnected: room?.players.length,
            roomOwner: room?.owned,
            roomMaxPlayers: room?.maxPlayers
        }
    }

    public async canStartGame(socket: PlayerSocket): Promise<void> {
        const room = await this.findRoom(socket.roomCode ?? '');
        if (!room) {
            throw new Error("Room not found");
        }
        if (socket.id !== room.owned.socketId) {
            throw new Error("You are not the owner of the room");
        }
    }

    public async findRoom(code: string): Promise<Room | undefined> {
        const room = await this.db.db.collection('rooms').findOne({code: code});
        if (room) {
            return {
                code: room.code,
                players: room.players,
                maxPlayers: room.maxPlayer,
                owned: room.owned
            };
        } else {
            return undefined;
        }
    }

    /********************************************
     *
     * PRIVATE
     *
     *********************************************/

    private async canJoinRoom(socket: PlayerSocket, roomId: string): Promise<void> {
        //TODO: VERIFIER SI IL EST DANS AUCUNE AUTRE ROOM

        const room = await this.findRoom(roomId);
        if (!room) {
            throw new Error("Room not found");
        }

        if (room?.players.length === room?.maxPlayers) {
            throw new Error("The room is full");
        }

        const present: boolean = room?.players.some(player => player.socketId === socket.id) ?? false;
        if (present) {
            throw new Error("You are already in this room");
        }
    }

    private async updateRoom(room: Room): Promise<void> {
        await this.db.db.collection('rooms').updateOne({code: room.code}, {$set: room});
        this.logger.log('Room:' + room.code + ' updated')
    }

    private async deleteRoom(code: string): Promise<void> {
        await this.db.db.collection('rooms').deleteOne({code: code});
        this.logger.log('Room:' + code + ' deleted')
    }

}