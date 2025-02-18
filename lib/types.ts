import type{ JBPinInputWebComponent } from "./jb-pin-input";
import type {EventTypeWithTarget} from 'jb-core';

export type Elements = {
    inputsWrapper: HTMLDivElement,
    inputs: Array<HTMLInputElement>,
    messageBox: HTMLDivElement
}
export type ValidationResult = {
    isValid: boolean
    message: string
}
export type ValidationValue = string; 
declare global {
    interface ElementInternals {
        setFormValue(value: string): void;
    }
}

export type JBPinInputEventType<TEvent> = EventTypeWithTarget<TEvent,JBPinInputWebComponent>;
