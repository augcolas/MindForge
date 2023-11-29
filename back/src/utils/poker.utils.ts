import {getRandomNumber} from "./shared.utils";
import { Value, Color } from '../app.enum';
import {Card} from "./card";


export const drawCard = (): Card => {
    const value: Value = (Object.values(Value) as Value[])[getRandomNumber(2, 14)];
    const color = Object.values(Color)[getRandomNumber(0,3)]
    return new Card(Value.Ace, color);
}