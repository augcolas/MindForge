import {createContext, useContext} from "react";
import {io, Socket} from "socket.io-client";
import {Room} from "../../back/src/model";


interface WebSocketContextInterface {
    socket: Socket;
    getRoom: () => Room;
    createRoom: () => Promise<Room>;
    joinRoom: (roomId: string, playerName: string) => Promise<Room>;
}

const WebSocketContext = createContext({
    socket: null as any,
    getRoom: (): Room => {
        return null as any
    },
    createRoom: (): Promise<Room> => {
        return Promise.reject("Unexpected");
    },
    joinRoom: (roomId: string, playerName: string): Promise<Room> => {
        return Promise.reject("Unexpected");
    },
});

const WebSocketProvider = (props: any): JSX.Element => {
        const socket: Socket = io("http://127.0.0.1:3000");

        let room: Room = null as any;


    socket.on('room-status', (data: Room) => {
        room = data;
    });


        const createRoom = (): Promise<Room> => {
            return new Promise((resolve, reject) => {
                socket.emit("create-room", "", (val: Room) => {
                    if (val) {
                        room = val;
                        resolve(val);
                    } else {
                        reject("Error occurred while creating the room");
                    }
                });
            });
        };

        const joinRoom = (roomId: string, playerName: string): Promise<Room> => {
            return new Promise((resolve, reject) => {
                socket.emit("join-room", {roomId: roomId, playerName: playerName}, (val: Room) => {
                    console.log("return of join-room", val);
                    if (val) {
                        room = val;
                        resolve(val);
                    } else {
                        reject("Error occurred while creating the room");
                    }
                });
            });
        };


        const getRoom = (): Room => {
            return room;
        }

        const value: WebSocketContextInterface = {
            socket,
            getRoom,
            createRoom,
            joinRoom
        };

        return (
            <WebSocketContext.Provider value={value}>
                {props.children}
            </WebSocketContext.Provider>
        );
    }
;

const useWebSocket = (): WebSocketContextInterface => {
    return useContext(WebSocketContext);
};

export {WebSocketProvider, useWebSocket};
