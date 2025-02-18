import { JBPinInputWebComponent, JBPinInputEventType } from 'jb-pin-input';
import { useEvent } from 'jb-core/react';

export type PropsEvent = {
  onChange?: (e: JBPinInputEventType<Event>) => void,
  onKeyUp?: (e: JBPinInputEventType<KeyboardEvent>) => void,
  onKeyDown?: (e: JBPinInputEventType<KeyboardEvent>) => void,
  onEnter?: (e: JBPinInputEventType<CustomEvent>) => void,
  onInput?: (e: JBPinInputEventType<InputEvent>) => void,
  onBeforeInput?: (e: JBPinInputEventType<InputEvent>) => void,
  onFocus?: (e: JBPinInputEventType<FocusEvent>) => void,
  onBlur?: (e: JBPinInputEventType<FocusEvent>) => void,
  onComplete?: (e: JBPinInputEventType<CustomEvent>) => void,
}

export function useEvents(props:PropsEvent,element:React.MutableRefObject<JBPinInputWebComponent>) {
  useEvent(element, 'change', props.onChange);
  useEvent(element, 'keydown', props.onKeyDown);
  useEvent(element, 'keyup', props.onKeyUp);
  useEvent(element, 'focus', props.onFocus);
  useEvent(element, 'blur', props.onBlur);
  useEvent(element, 'enter', props.onEnter);
  useEvent(element, 'input', props.onInput);
  useEvent(element, 'complete', props.onComplete);
  useEvent(element, 'beforeinput', props.onBeforeInput);
}