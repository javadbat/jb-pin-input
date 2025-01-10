import { JBPinInputWebComponent } from 'jb-pin-input';
import { useCallback } from 'react';
import { useBindEvent } from '../../../../common/hooks/use-event.js';

export type JBPinInputEventType<T> = T & {
  target: JBPinInputWebComponent
}
export type PropsEvent = {
  onChange?: (e: JBPinInputEventType<Event>) => void,
  onKeyup?: (e: JBPinInputEventType<KeyboardEvent>) => void,
  onKeydown?: (e: JBPinInputEventType<KeyboardEvent>) => void,
  onEnter?: (e: JBPinInputEventType<CustomEvent>) => void,
  onInput?: (e: JBPinInputEventType<InputEvent>) => void,
  onBeforeinput?: (e: JBPinInputEventType<InputEvent>) => void,
  onFocus?: (e: JBPinInputEventType<FocusEvent>) => void,
  onBlur?: (e: JBPinInputEventType<FocusEvent>) => void,
  onComplete?: (e: JBPinInputEventType<CustomEvent>) => void,
}

export function JBPinInputEventsHook(props:PropsEvent,element:React.MutableRefObject<JBPinInputWebComponent>) {
  function onChange(e:JBPinInputEventType<Event>) {
    if (typeof props.onChange == "function") {
      props.onChange(e);
    }
  }
  const onKeydown = useCallback((e: JBPinInputEventType<KeyboardEvent>) => {
    if (typeof props.onKeydown == "function") {
      props.onKeydown(e);
    }
  }, [props.onKeydown]);
  const onKeyup = useCallback((e: JBPinInputEventType<KeyboardEvent>) => {
    if (typeof props.onKeyup == "function") {
      props.onKeyup(e);
    }
  }, [props.onKeyup]);

  const onEnter = useCallback((e: JBPinInputEventType<CustomEvent>) => {
    if (props.onEnter) {
      props.onEnter(e);
    }
  }, [props.onEnter]);
  const onFocus = useCallback((e: JBPinInputEventType<FocusEvent>) => {
    if (props.onFocus && e instanceof FocusEvent) {
      props.onFocus(e);
    }
  }, [props.onFocus]);
  const onBlur = useCallback((e: JBPinInputEventType<FocusEvent>) => {
    if (props.onBlur && e instanceof FocusEvent) {
      props.onBlur(e);
    }
  }, [props.onBlur]);
  const onInput = useCallback((e: JBPinInputEventType<InputEvent>) => {
    if (typeof props.onInput == 'function' && e instanceof InputEvent) {
      props.onInput(e);
    }
  }, [props.onInput]);
  const onComplete = useCallback((e: JBPinInputEventType<CustomEvent>) => {
    if (typeof props.onComplete == 'function') {
      props.onComplete(e);
    }
  }, [props.onComplete]);
  const onBeforeInput = useCallback((e: JBPinInputEventType<InputEvent>) => {
    if (typeof props.onBeforeinput == 'function' && e instanceof InputEvent) {
      props.onBeforeinput(e);
    }
  }, [props.onBeforeinput]);

  useBindEvent(element, 'change', onChange);
  useBindEvent(element, 'keydown', onKeydown);
  useBindEvent(element, 'keyup', onKeyup);
  useBindEvent(element, 'focus', onFocus);
  useBindEvent(element, 'blur', onBlur);
  useBindEvent(element, 'enter', onEnter);
  useBindEvent(element, 'input', onInput);
  useBindEvent(element, 'complete', onComplete);
  useBindEvent(element, 'beforeinput', onBeforeInput);
}