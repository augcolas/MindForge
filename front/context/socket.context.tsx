import {createContext, useContext, useEffect} from "react";
import {io, Socket} from "socket.io-client";

interface WebSocketContextInterface {
    socket: Socket;
    createRoom: () => Promise<string>;
}

const WebSocketContext = createContext({
    socket: null as any,
    createRoom: (): Promise<string> => {
        return Promise.reject("Unexpected");
    },
});

const WebSocketProvider = (props: any): JSX.Element => {
    const socket: Socket = io("http://127.0.0.1:3000");

    const createRoom = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            socket.emit("create-room", "", (val: string) => {
                if (val) {
                    resolve(val);
                } else {
                    reject("Error occurred while creating the room");
                }
            });
        });
    };


    const value: WebSocketContextInterface = {
        socket,
        createRoom,
    };

    return (
        <WebSocketContext.Provider value={value}>
            {props.children}
        </WebSocketContext.Provider>
    );
};

const useWebSocket = (): WebSocketContextInterface => {
    return useContext(WebSocketContext);
};

export {WebSocketProvider, useWebSocket};
