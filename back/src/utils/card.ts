import { Value, Color } from '../app.enum';
export class Card {
    private _value: Value;
    private _color: Color;

    constructor(value: Value, color: Color) {
        this._value = value;
        this._color = color;
    }

    public static builder(value: Value, color: Color): Card {
        return new Card(value, color);
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

    public name(): string {
        switch (this._value) {
            case Value.Two:
                return "2-" + this._color;
            case Value.Three:
                return "3-" + this._color;
            case Value.Four:
                return "4-" + this._color;
            case Value.Five:
                return "5-" + this._color;
            case Value.Six:
                return "6-" + this._color;
            case Value.Seven:
                return "7-" + this._color;
            case Value.Eight:
                return "8-" + this._color;
            case Value.Nine:
                return "9-" + this._color;
            case Value.Ten:
                return "10-" + this._color;
            case Value.Jack:
                return "J-" + this._color;
            case Value.Queen:
                return "Q-" + this._color;
            case Value.King:
                return "K-" + this._color;
            case Value.Ace:
                return "A-" + this._color;
        }
    }
}