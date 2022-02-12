export type Elements = {
    inputsWrapper: HTMLDivElement,
    inputs: Array<HTMLInputElement>,
    error: HTMLParagraphElement
}
export type ValidationResult = {
    isValid: boolean
    message: string
}

declare global {
    interface ElementInternals {
        setFormValue(value: string): void;
    }
}

