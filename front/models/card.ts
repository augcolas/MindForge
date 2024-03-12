import { Value, Color } from './enum';
export class Card {
    private _value: Value;
    private _color: Color;

    constructor(value:Value, color:Color) {
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

    public name(): string {
        let result = "";

        switch (this._value) {
            case Value.Two:
                result=("2-");
                break;
            case Value.Three:
                result=("3-");
                break;
            case Value.Four:
                result=("4-");
                break;
            case Value.Five:
                result=("5-");
                break;
            case Value.Six:
                result=("6-");
                break;
            case Value.Seven:
                result=("7-");
                break;
            case Value.Eight:
                result=("8-");
                break;
            case Value.Nine:
                result=("9-");
                break;
            case Value.Ten:
                result=("10-");
                break;
            case Value.Jack:
                result=("J-");
                break;
            case Value.Queen:
                result=("Q-");
                break;
            case Value.King:
                result=("K-");
                break;
            case Value.Ace:
                result=("A-");
                break;
            case Value.Back:
                result=("Back-");
                break;
        }

        switch (this._color) {
            case Color.Hearts:
                result+=("H");
                break;
            case Color.Diamonds:
                result+=("D");
                break;
            case Color.Clubs:
                result+=("C");
                break;
            case Color.Spades:
                result+=("S");
                break;
            case Color.Back:
                result+=("Blue");
                break;
        }

        return result;
    }
}