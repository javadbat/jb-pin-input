import React, { useRef, useEffect, useImperativeHandle, useState, type PropsWithChildren } from 'react';
import 'jb-pin-input';

// eslint-disable-next-line no-duplicate-imports
import { type JBPinInputWebComponent} from 'jb-pin-input';
import { useEvents, type PropsEvent } from './events-hook.js';
import { JBPinInputAttributes, useJBPinInputAttribute } from './attributes-hook.js';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
      interface IntrinsicElements {
        'jb-pin-input': JBPinInputType;
      }
      interface JBPinInputType extends React.DetailedHTMLProps<React.HTMLAttributes<JBPinInputWebComponent>, JBPinInputWebComponent> {
        class?:string,
        label?: string,
        name?:string,
        message?:string,
        // ref:React.RefObject<JBDateInputWebComponent>,
      }
    }
}
// eslint-disable-next-line react/display-name
export const JBPinInput = React.forwardRef((props:Props, ref) => {
  /**
     * @type {React.MutableRefObject<HTMLInputElement>}
     */
  const element = useRef<JBPinInputWebComponent>(null);
  const [refChangeCount, refChangeCountSetter] = useState(0);
  useImperativeHandle(
    ref,
    () => (element ? element.current : undefined),
    [element],
  );
  useEffect(() => {
    refChangeCountSetter(refChangeCount + 1);
  }, [element.current]);

  useJBPinInputAttribute(element, props);
  useEvents(props,element);
  return (
    <jb-pin-input ref={element} class={props.className} label={props.label} message={props.message??""}>
      {props.children}
    </jb-pin-input>
  );
});
export type Props = PropsWithChildren<JBPinInputProps>;
type JBPinInputProps = PropsEvent & JBPinInputAttributes & {
    className?: string,
    label?: string,
    message?:string,
}
JBPinInput.displayName = "JBPinInput";

