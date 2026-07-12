import type { JBPinInputWebComponent, ValidationValue } from "jb-pin-input";
import type { ValidationItem } from "jb-validation";
import { type RefObject, useEffect } from "react";

export type JBPinInputAttributes = {
  required?: boolean,
  validationList?: ValidationItem<ValidationValue>[],
  disabled?: boolean,
  inputmode?: string,
  autofocus?: boolean,
  charLength?: number,
  error?: string,
}
export function useJBPinInputAttribute(element: RefObject<JBPinInputWebComponent | null>, props: JBPinInputAttributes) {

  useEffect(() => {
    if (element?.current) {
      element.current.validation.list = props.validationList || [];
    }
  }, [props.validationList, element]);

  useEffect(() => {
    if (props.disabled === true) {
      element.current?.setAttribute('disabled', 'true');
    } else if (props.disabled === false) {
      element.current?.removeAttribute('disabled');
    }
  }, [props.disabled,element]);

  useEffect(() => {
    if (typeof props.charLength == "number" && element.current) {
      element.current.charLength = props.charLength;
    }
  }, [props.charLength, element.current]);

  useEffect(() => {
    if (props.inputmode) {
      element.current?.setAttribute('inputmode', props.inputmode);
    } else {
      element.current?.removeAttribute('inputmode');
    }
  }
  , [props.inputmode, element.current]);
  
  useEffect(() => {
    if (props.autofocus) {
      element.current?.setAttribute("autofocus", "true");
    } else {
      element.current?.removeAttribute("autofocus");
    }
  }, [props.autofocus, element.current]);

  useEffect(() => {
    if (element.current && typeof props.required == "boolean") {
      element.current.required = props.required;
    }
  }, [element, props.required]);

  useEffect(() => {
    if (props.error) {
      element?.current?.setAttribute('error', props.error);
    } else {
      element?.current?.removeAttribute('error');
    }
  }, [props.error, element?.current]);
}
