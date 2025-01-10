import React, { useRef, useEffect, useImperativeHandle, useState, type PropsWithChildren } from 'react';
import 'jb-pin-input';
import {type ValidationItem} from 'jb-validation';

// eslint-disable-next-line no-duplicate-imports
import { type JBPinInputWebComponent, type ValidationValue} from 'jb-pin-input';
import { JBPinInputEventsHook, type PropsEvent } from './events-hook.js';

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

  
  useEffect(() => {
    let value = props.value;
    if (props.value == null || props.value === undefined) {
      value = '';
    }
    if(element.current){
      element.current.value = value?.toString() || "";
    }
  }, [props.value]);
  useEffect(() => {
    if (element && element.current) {
      element.current.validation.list = props.validationList || [];
    }
  }, [props.validationList]);
  useEffect(() => {
    if (typeof props.disabled == "boolean") {
      element.current?.setAttribute('disabled', `${props.disabled}`);
    }
  }, [props.disabled]);
  useEffect(() => {
    if (typeof props.charLength == "number" && element.current) {
      element.current.charLength = props.charLength;
    }
  }, [props.charLength]);
  useEffect(() => {
    if(props.inputmode){
      element.current?.setAttribute('inputmode',props.inputmode);
    }else{
      element.current?.removeAttribute('inputmode');
    }
  }
  , [props.inputmode]);
  useEffect(()=>{
    if(props.autofocus){
      element.current?.setAttribute("autofocus","true");
    }
  },[props.autofocus]);
  useEffect(() => {
    if (element.current && typeof props.required == "boolean") {
      element.current.required = props.required;
    }
  }, [element, props.required]);
  JBPinInputEventsHook(props,element);
  return (
    <jb-pin-input ref={element} class={props.className} label={props.label} message={props.message??""}>
      {props.children}
    </jb-pin-input>
  );
});
export type Props = PropsWithChildren<JBPinInputProps>;
type JBPinInputProps = PropsEvent & {
    label?: string,
    value?: string | number,
    required?: boolean,
    message?:string,
    className?: string,
    validationList?: ValidationItem<ValidationValue>[],
    disabled?: boolean,
    inputmode?: string,
    autofocus?: boolean,
    charLength?:number,
}
JBPinInput.displayName = "JBPinInput";

