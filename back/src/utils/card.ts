import { Value, Color } from '../app.enum';
export class Card {
    private _value: Value;
    private _color: Color;

    constructor(value: Value, color: Color) {
        this._value = value;
        this._color = color;
    }


    get value(): Value {
        return this._value;
    }

    set value(value: Value) {
        this._value = value;
    }

    get color(): Color {
        return this._color;
    }

    set color(value: Color) {
        this._color = value;
    }
}