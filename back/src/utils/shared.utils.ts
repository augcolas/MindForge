import {validate} from 'uuid';
import {Socket} from "socket.io";

export const generateCode = () => {
    const codeArray = Array.from({length: 5}, () => Math.floor(Math.random() * 10));
    return codeArray.join('');
}


//FIXME: DELETE THIS?
export const validUuid = (uuid: string): boolean => {
    return validate(uuid as string);
}

//FIXME: DELETE THIS?
export function isString(str: any): str is string {
    return typeof str === "string";
}

//FIXME: DELETE THIS?
export function getPlayingRoomUuid(socket: Socket): string | undefined {
    return Array.from(socket.rooms).find(r => r !== socket.id);
}


export const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * max) + min;
}