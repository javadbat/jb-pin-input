export type Elements = {
    inputsWrapper: HTMLDivElement,
    inputs: Array<HTMLInputElement>,
    error: HTMLParagraphElement
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
