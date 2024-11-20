export interface IInputNumber {
    textMask: string;
    numberValue: string;
}
export interface InputPropNumber {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

export class ClassInputNumber implements IInputNumber {
    textMask = '000-0000';
    numberValue: string;
    constructor({ textMask = '000-0000', numberValue = '0' }) {
        this.textMask = textMask;
        this.numberValue = numberValue;
    }
}
