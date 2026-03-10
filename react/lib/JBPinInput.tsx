'use client';
import React, { useRef, useImperativeHandle, type PropsWithChildren } from 'react';
import 'jb-pin-input';

import type { JBPinInputWebComponent } from 'jb-pin-input';
import { useEvents, type PropsEvent } from './events-hook.js';
import { type JBPinInputAttributes, useJBPinInputAttribute } from './attributes-hook.js';
import type { JBElementStandardProps } from 'jb-core/react';

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'jb-pin-input': JBPinInputType;
    }
    interface JBPinInputType extends React.DetailedHTMLProps<React.HTMLAttributes<JBPinInputWebComponent>, JBPinInputWebComponent> {
      class?: string,
      label?: string,
      name?: string,
      message?: string,
      // ref:React.RefObject<JBDateInputWebComponent>,
    }
  }
}
// eslint-disable-next-line react/display-name
export const JBPinInput = React.forwardRef((props: Props, ref) => {
  const element = useRef<JBPinInputWebComponent>(null);

  useImperativeHandle(
    ref,
    () => (element ? element.current : undefined),
    [element],
  );

  const { autofocus, charLength, disabled, error, inputmode, required, validationList, value, onBeforeInput, onBlur, onChange, onComplete, onEnter, onFocus, onInput, onKeyDown, onKeyUp, ...otherProps } = props
  useJBPinInputAttribute(element, { autofocus, charLength, disabled, error, inputmode, required, validationList, value });
  useEvents({ onBeforeInput, onBlur, onChange, onComplete, onEnter, onFocus, onInput, onKeyDown, onKeyUp }, element);

  return (
    <jb-pin-input ref={element} {...otherProps}>
      {props.children}
    </jb-pin-input>
  );
});
export type Props = JBPinInputProps & JBElementStandardProps<JBPinInputWebComponent, keyof JBPinInputProps>;
type JBPinInputProps = PropsEvent & PropsWithChildren<JBPinInputAttributes> & {
  className?: string,
  label?: string,
  message?: string,
}
JBPinInput.displayName = "JBPinInput";

