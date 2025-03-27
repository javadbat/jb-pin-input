import { JBPinInputWebComponent, type ValidationValue } from "jb-pin-input";
import { type ValidationItem } from "jb-validation";
import { RefObject, useEffect } from "react";

export type JBPinInputAttributes = {
  value?: string | number,
  required?: boolean,
  validationList?: ValidationItem<ValidationValue>[],
  disabled?: boolean,
  inputmode?: string,
  autofocus?: boolean,
  charLength?: number,
  error?: string,
}
export function useJBPinInputAttribute(element: RefObject<JBPinInputWebComponent>, props: JBPinInputAttributes) {

  useEffect(() => {
    let value = props.value;
    if (props.value == null || props.value === undefined) {
      value = '';
    }
    if (element.current) {
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
    if (props.inputmode) {
      element.current?.setAttribute('inputmode', props.inputmode);
    } else {
      element.current?.removeAttribute('inputmode');
    }
  }
  , [props.inputmode]);
  useEffect(() => {
    if (props.autofocus) {
      element.current?.setAttribute("autofocus", "true");
    }
  }, [props.autofocus]);

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
  }, [props.error]);
}