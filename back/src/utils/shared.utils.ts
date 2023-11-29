import {v4 as uuidv4, validate} from 'uuid';
import {Socket} from "socket.io";

export const generateUuid = () => {
    return uuidv4();
}

export const validUuid = (uuid: string): boolean => {
    return validate(uuid as string);
}

export function isString(str: any): str is string {
    return typeof str === "string";
}

export function getPlayingRoomUuid(socket: Socket): string | undefined {
    return Array.from(socket.rooms).find(r => r !== socket.id);
}


export const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * max) +min;
}