'use client';
import React, { useRef, useImperativeHandle, type PropsWithChildren } from 'react';
import 'jb-pin-input';

import type { JBPinInputWebComponent } from 'jb-pin-input';
import { useEvents, type PropsEvent } from './events-hook.js';
import { type JBPinInputAttributes, useJBPinInputAttribute } from './attributes-hook.js';
import type { JBElementStandardProps } from 'jb-core/react';
import './module-declaration.js';

// eslint-disable-next-line react/display-name
export const JBPinInput = React.forwardRef((props: Props, ref) => {
  const element = useRef<JBPinInputWebComponent>(null);

  useImperativeHandle(
    ref,
    () => (element ? element.current : undefined),
    [element],
  );

  const { autofocus, charLength, disabled, error, initialValue, inputmode, required, validationList, value, onBeforeInput, onBlur, onChange, onComplete, onEnter, onFocus, onInput, onKeyDown, onKeyUp, ...otherProps } = props
  useJBPinInputAttribute(element, { autofocus, charLength, disabled, error, inputmode, required, validationList });
  useEvents({ onBeforeInput, onBlur, onChange, onComplete, onEnter, onFocus, onInput, onKeyDown, onKeyUp }, element);

  return (
    <jb-pin-input ref={element} value={value?.toString() ?? ""} initialValue={initialValue?.toString() ?? ""} {...otherProps}>
      {props.children}
    </jb-pin-input>
  );
});
export type Props = JBPinInputProps & JBElementStandardProps<JBPinInputWebComponent, keyof JBPinInputProps>;
type JBPinInputProps = PropsEvent & PropsWithChildren<JBPinInputAttributes> & {
  className?: string,
  label?: string,
  message?: string,
  value?: string | number,
  initialValue?: string | number,
}
JBPinInput.displayName = "JBPinInput";

