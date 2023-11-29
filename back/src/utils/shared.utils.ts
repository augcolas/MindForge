import {v4 as uuidv4, validate} from 'uuid';

export const generateUuid = () => {
    return uuidv4();
}

export const validUuid = (uuid: string): boolean => {
    return validate(uuid as string);
}

export function isString(str: any): str is string {
    return typeof str === "string";
}