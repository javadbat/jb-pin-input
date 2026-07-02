import type { JBPinInputWebComponent } from 'jb-pin-input';
import { expect } from 'storybook/test';

export function getPinInput(canvasElement: HTMLElement, index = 0) {
  const pinInput = canvasElement.querySelectorAll<JBPinInputWebComponent>('jb-pin-input')[index];
  expect(pinInput).toBeTruthy();
  expect(pinInput!.shadowRoot).toBeTruthy();
  return pinInput!;
}

export function getPinCells(pinInput: JBPinInputWebComponent) {
  const inputs = Array.from(pinInput.shadowRoot?.querySelectorAll<HTMLInputElement>('.pin-input') ?? []);
  expect(inputs.length).toBeGreaterThan(0);
  return inputs;
}

export function getMessageText(pinInput: JBPinInputWebComponent) {
  return pinInput.shadowRoot?.querySelector<HTMLElement>('.message-box')?.textContent ?? '';
}

export function getJBButton(canvasElement: HTMLElement, text: string) {
  const button = Array.from(canvasElement.querySelectorAll<HTMLElement>('jb-button')).find((item) =>
    item.textContent?.includes(text)
  );
  expect(button).toBeTruthy();
  return button!;
}

export function getJBButtonNativeButton(button: HTMLElement) {
  const nativeButton = button.shadowRoot?.querySelector<HTMLButtonElement>('button');
  expect(nativeButton).toBeTruthy();
  return nativeButton!;
}

export function dispatchPaste(input: HTMLInputElement, text: string) {
  const event = new ClipboardEvent('paste', {
    bubbles: true,
    cancelable: true,
    clipboardData: new DataTransfer(),
  } as ClipboardEventInit);
  event.clipboardData?.setData('text', text);
  input.dispatchEvent(event);
}
