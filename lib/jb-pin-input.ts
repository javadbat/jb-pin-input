import CSS from './jb-pin-input.css';
import VariablesCSS from './variables.css';
import { type ValidationItem, type ValidationResult, type WithValidation, ValidationHelper, type ShowValidationErrorParameters } from 'jb-validation';
import type { Elements, ValidationValue } from "./types.js";
import type { JBFormInputStandards } from 'jb-form';
import {registerDefaultVariables} from 'jb-core/theme';
import { renderHTML } from './render';
import { getRequiredMessage, i18n } from 'jb-core/i18n';
import { createInputEvent, createKeyboardEvent, faToEnDigits } from 'jb-core';

export * from './types.js';

export class JBPinInputWebComponent extends HTMLElement implements WithValidation<ValidationValue>, JBFormInputStandards<string> {
  elements!: Elements;
  #internals?: ElementInternals;
  #acceptPersianNumber = true;
  #hasVisibleError = false;
  #isInvalid = false;
  static get formAssociated() { return true; }
  /**
   * @description char that replace value of empty input in value
   */
  get emptyChar() {
    return '-';
  }
  #disabled = false;
  get disabled() {
    return this.#disabled;
  }
  set disabled(value: boolean) {
    this.#disabled = Boolean(value);
    this.elements.inputs.forEach((i) => {i.disabled = this.#disabled});
    this.setAttribute("aria-disabled", `${this.#disabled}`);
    if (this.#disabled) {
      this.#internals?.states?.add("disabled");
    } else {
      this.#internals?.states?.delete("disabled");
    }
  }
  get form(){
    return this.#internals?.form??null
  }
  #required = false;
  set required(value: boolean) {
    this.#required = Boolean(value);
    this.elements.inputs.forEach((input) => {
      input.setAttribute("aria-required", `${this.#required}`);
    });
    this.#checkValidity(false);
  }
  get required() {
    return this.#required;
  }
  get value() {
    return this.#getValue(this.emptyChar);
  }
  set value(value: string) {
    const sValue = this.#standardValue(`${value ?? ""}`);
    this.#setValue(sValue);
  }
  get inputMode() {
    return this.getAttribute("inputmode") || "numeric";
  }
  set inputMode(value: string) {
    if (value) {
      this.setAttribute("inputmode", value);
    } else {
      this.removeAttribute("inputmode");
    }
  }
  get label() {
    return this.getAttribute("label") || "";
  }
  set label(value: string) {
    if (value) {
      this.setAttribute("label", value);
    } else {
      this.removeAttribute("label");
    }
  }
  /**
   * @description set value to the inputs without any validation so use validation before calling this function
   */
  #getValue(emptyChar:string){
    const arr = (this.elements!).inputs.map((input) => {
      const char = input.value;
      if (char) {
        return char;
      } else {
        return emptyChar;
      }
    });
    const value = arr.join('');
    return this.#standardValue(value);
  }
  #setValue(value: string) {
    this.elements.inputs.forEach((input, index) => {
      input.value = this.#getValidCellValue(value[index]);
    });
    this.#setFormValue();
  }
  #setFormValue(value = this.value) {
    if (this.#internals && typeof this.#internals.setFormValue === "function") {
      this.#internals.setFormValue(value);
    }
  }
  #charLength = 6;
  get charLength() {
    return this.#charLength;
  }
  set charLength(value) {
    const numericValue = Number(value);
    if (Number.isInteger(numericValue) && numericValue > 0) {
      this.#charLength = numericValue;
      this.#initInputsDom();
    }
  }

  #validation = new ValidationHelper({
    clearValidationError: this.clearValidationError.bind(this),
    showValidationError: this.#showValidationError.bind(this),
    getValue: () => this.value,
    getValueString: () => this.value,
    setValidationResult: this.#setValidationResult.bind(this),
    getValidations: this.#getInsideValidation.bind(this)
  });

  get validation() {
    return this.#validation;
  }

  initialValue = "";
  get isDirty(): boolean {
    return this.value !== this.initialValue;
  }
  get name() {
    return this.getAttribute('name') || '';
  }
  constructor() {
    super();
    if (typeof this.attachInternals === "function") {
      //some browser dont support attachInternals
      this.#internals = this.attachInternals();
    }
    this.initWebComponent();
  }
  connectedCallback() {
    // standard web component event that called when all of dom is bound
    this.callOnLoadEvent();
    this.initProp();
    this.callOnInitEvent();

  }
  callOnLoadEvent() {
    const event = new CustomEvent('load', { bubbles: true, composed: false });
    this.dispatchEvent(event);
  }
  callOnInitEvent() {
    const event = new CustomEvent('init', { bubbles: true, composed: false });
    this.dispatchEvent(event);
  }
  initWebComponent() {
    const shadowRoot = this.attachShadow({
      mode: 'open',
      delegatesFocus: true,
      clonable:true,
      serializable:true
    });
    registerDefaultVariables();
    const html = `<style>${CSS} ${VariablesCSS}</style>\n${renderHTML()}`;
    const element = document.createElement('template');
    element.innerHTML = html;
    shadowRoot.appendChild(element.content.cloneNode(true));
    this.elements = {
      inputsWrapper: shadowRoot.querySelector('.inputs-wrapper')!,
      inputs: [],
      messageBox:shadowRoot.querySelector(".message-box")!
    };

  }
  registerEventListener() {
    //
  }
  initProp() {
    this.#initInputsDom();
    if (this.hasAttribute("value")) {
      this.value = this.getAttribute("value") || "";
    } else {
      this.#setFormValue();
    }
    this.registerEventListener();
  }
  static get observedAttributes() {
    return ['autofocus', 'char-length', 'disabled', 'inputmode', 'required', 'value', 'message', 'error', 'label', 'accessible-label', 'aria-label'];
  }
  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    // do something when an attribute has changed
    this.onAttributeChange(name, newValue);
  }
  onAttributeChange(name: string, value: string | null) {
    switch (name) {
      case 'autofocus':
        if (value === '' || value === 'true') {
          if ((this.elements!).inputs[0]) {
            (this.elements!).inputs[0].focus();
          }
        }
        break;
      case 'char-length':
        if (value != null && Number.isInteger(Number(value)) && Number(value) > 0) {
          this.charLength = Number(value);
        }
        break;
      case 'disabled':
        this.disabled = value === '' || value === 'true';
        break;
      case 'inputmode':
        this.#setInputsInputMode(value || "numeric");
        break;
      case 'required':
        this.required = value === '' || value === 'true';
        break;
      case 'value':
        this.value = value ?? "";
        break;
      case 'message':
        if(!this.elements.messageBox.classList.contains("error")){
          this.#setMessage(value ?? "", false);
        }
        break;
      case 'error':
        this.reportValidity();
        break;
      case 'label':
      case 'accessible-label':
      case 'aria-label':
        this.#setAccessibleLabels();
        break;
    }

  }
  #standardValue(value: string) {
    //TODO: add acceptance for non-digits by config
    let standardValue = value;
    if (this.#acceptPersianNumber) {
      standardValue = faToEnDigits(standardValue);
    }
    return standardValue;
  }
  #getValidCellValue(value?: string) {
    const standardValue = this.#standardValue(value ?? "");
    return /^[0-9]$/.test(standardValue) ? standardValue : "";
  }
  #getDigits(value: string) {
    return [...this.#standardValue(value)].filter((char) => /^[0-9]$/.test(char));
  }
  #setValueFromIndex(index: number, value: string) {
    const digits = this.#getDigits(value);
    const nextValue = [...this.value];
    const loopLength = Math.min(this.charLength - index, digits.length);
    for (let i = 0; i < loopLength; i++) {
      nextValue[index + i] = digits[i];
    }
    this.value = nextValue.join("");
    return loopLength;
  }
  #initInputsDom() {
    const inputElements = this.#createInputs();
    (this.elements!).inputs = inputElements.map(x => x.querySelector('.pin-input')!);
    (this.elements!).inputsWrapper.innerHTML = "";
    inputElements.forEach((elements) => {
      (this.elements!).inputsWrapper.appendChild(elements);
    });
    this.#setInputsInputMode(this.inputMode);
    this.disabled = this.disabled;
    this.#setAccessibleLabels();
    this.elements.inputs.forEach((input) => {
      input.setAttribute("aria-required", `${this.required}`);
      if (this.#isInvalid) {
        input.setAttribute("aria-invalid", "true");
      } else {
        input.removeAttribute("aria-invalid");
      }
    });
    this.#setMessageA11y();
    // auto focus if it set to be auto focused
    const autofocus = this.getAttribute('autofocus');
    if ((autofocus === '' || autofocus === 'true') && (this.elements!).inputs[0]) {
      (this.elements!).inputs[0].focus();
    }
  }
  #setInputsInputMode(inputMode: string) {
    this.elements.inputs.forEach((input) => {
      input.setAttribute('inputmode', inputMode || 'numeric');
    });
  }
  #getAccessibleLabel() {
    const label =
      this.getAttribute("aria-label")?.trim() ||
      this.getAttribute("accessible-label")?.trim() ||
      this.getAttribute("label")?.trim() ||
      this.getAttribute("name")?.trim();
    return label || "PIN";
  }
  #setAccessibleLabels() {
    if (!this.elements?.inputsWrapper || !this.elements?.inputs) {
      return;
    }
    const label = this.#getAccessibleLabel();
    this.elements.inputsWrapper.setAttribute("aria-label", label);
    this.elements.inputs.forEach((input, index) => {
      input.setAttribute("aria-label", `${label}, digit ${index + 1} of ${this.charLength}`);
    });
  }
  #setMessageA11y() {
    if (!this.elements?.messageBox || !this.elements?.inputsWrapper || !this.elements?.inputs) {
      return;
    }
    const messageId = this.elements.messageBox.id || "message";
    this.elements.messageBox.id = messageId;
    this.elements.messageBox.setAttribute("aria-live", this.#hasVisibleError ? "assertive" : "polite");
    this.elements.messageBox.setAttribute("role", this.#hasVisibleError ? "alert" : "status");
    this.elements.inputsWrapper.setAttribute("aria-describedby", messageId);
    this.elements.inputs.forEach((input) => {
      input.setAttribute("aria-describedby", messageId);
      if (this.#hasVisibleError) {
        input.setAttribute("aria-errormessage", messageId);
      } else {
        input.removeAttribute("aria-errormessage");
      }
    });
  }
  /**
   * 
   * @return {Array.<HTMLInputElement>} inputList - array of pin input DOM
   */
  #createInputs(): HTMLDivElement[] {
    const inputsList: HTMLDivElement[] = [];
    for (let i = 0; i < this.charLength; i++) {
      const inputDom = this.#createInput(i);
      inputsList.push(inputDom);
    }
    return inputsList;
  }
  #createInput(index: number): HTMLDivElement {
    const wrapperDom = document.createElement('div');
    wrapperDom.part.add('input-wrapper',`input-wrapper-${index}`)
    wrapperDom.classList.add('pin-input-wrapper');
    const inputDom = document.createElement('input');

    inputDom.classList.add('pin-input');
    inputDom.part.add("pin-input",`pin-input-${index}`)
    inputDom.addEventListener('keydown', this.#onInputKeyDown.bind(this));
    inputDom.addEventListener('keypress', this.#onInputKeyPress.bind(this));
    inputDom.addEventListener('keyup', this.#onInputKeyup.bind(this));
    inputDom.addEventListener('beforeinput', this.#onBeforeInput.bind(this));
    inputDom.addEventListener('blur', this.#onInputBlur.bind(this));
    inputDom.addEventListener('focus', this.#onInputFocus.bind(this));
    inputDom.addEventListener('input', (e) => this.#onInput((e as InputEvent)), { passive: true });
    inputDom.addEventListener('paste', this.#onPasteValue.bind(this));
    inputDom.setAttribute('inputmode', this.inputMode);
    inputDom.setAttribute('pattern', '[0-9]*');
    inputDom.setAttribute('autocomplete', index === 0 ? 'one-time-code' : 'off');
    inputDom.setAttribute('aria-label', `${this.#getAccessibleLabel()}, digit ${index + 1} of ${this.charLength}`);
    inputDom.setAttribute('aria-describedby', 'message');
    inputDom.setAttribute('aria-required', `${this.required}`);

    const shapeDom = document.createElement('div');
    shapeDom.classList.add('pin-input-shape');
    shapeDom.part.add(`input-line`,`input-line-${index}`)
    wrapperDom.appendChild(inputDom);
    wrapperDom.appendChild(shapeDom);
    wrapperDom.setAttribute('data-pin-index', index.toString());
    return wrapperDom;
  }
  #onPasteValue(e: ClipboardEvent) {
    e.preventDefault();
    let value = (e.clipboardData!).getData('text');
    const index = Number((e.target as HTMLInputElement).parentElement!.dataset.pinIndex);
    const regex = new RegExp(`(.*\\D|^)(?<pin>[0-9]{${this.charLength}})(\\D.*|$)`);
    // convert persian digit so regex accept them too
    value = faToEnDigits(value);
    const regexResult = regex.exec(value);
    let filteredValue = "";
    if (regexResult?.groups?.pin) {
      //first we looking for full pin code match
      //if we find all digits in pasted value
      filteredValue = regexResult.groups.pin;
      this.#setValue(filteredValue);
      //change input foucs to the last pin based on pasted value length
      if (this.value.length > 0) {
        (this.elements!).inputs[this.charLength - 1].focus();
      }
    }
    else {
      //when full match not found we just get any incomplete numbers
      const filteredValue = value.match(`[0-9]{1,${this.charLength}}`);
      if (filteredValue) {
        const loopLength = this.#setValueFromIndex(index, filteredValue[0]);
        //change input focus to the last pin based on pasted value length
        const nextFocusIndex = Math.min(index + loopLength - 1, this.charLength - 1);
        (this.elements!).inputs[nextFocusIndex]?.focus();

      }

    }
    this.#dispatchOnInputEvent(new InputEvent("input", {
      bubbles: true,
      composed: true,
      cancelable: false,
      data: value,
      inputType: "insertFromPaste"
    }));
    this.#checkValidity(false)?.then((validityRes)=>{
      if(!this.value.includes(this.emptyChar) && validityRes.isAllValid){
        this.#dispatchOnCompleteEvent();
      }
    });
  }
  /**
   * @property is we changing focus (when user type) or user focus
   */
  #weFocus = false;
  #onInputFocus(e: FocusEvent) {
    if(this.#weFocus){
      this.#weFocus = false;
    }else{
      this.#onFocusValue = this.value;
    }
  }
  #onInputBlur(e: FocusEvent) {
    const focusedElement = e.relatedTarget;
    if (this.elements.inputs.includes(focusedElement as HTMLInputElement)) {
      //
    } else {
      this.#onBlur();
    }
  }
  /**
   * @property keep value of component from last focus. will use it to detect change on blur
   */
  #onFocusValue = "";
  #onBlur() {
    this.#checkValidity(true);
    if(this.value !== this.#onFocusValue){
      this.#DispatchChangeEvent();
    }
  }
  #onInputKeyDown(e: KeyboardEvent) {
    const event = createKeyboardEvent("keydown", e, { bubbles: true, composed: true });
    if (!this.dispatchEvent(event)) {
      e.preventDefault();
    }
  }
  #onInputKeyPress(e: KeyboardEvent) {
    const event = createKeyboardEvent("keypress", e, { bubbles: true, composed: true });
    if (!this.dispatchEvent(event)) {
      e.preventDefault();
    }
  }
  #onInput(e: InputEvent) {
    const elem = e.target;
    const currentPinIndex = parseInt((elem as HTMLInputElement).parentElement!.dataset.pinIndex!, 10);
    let nextIndex = currentPinIndex;
    const input = e.target as HTMLInputElement;
    const digits = this.#getDigits(input.value);
    const value = digits.join("");
    const isLastIndex = !(currentPinIndex + 1 < this.charLength);
    if (digits.length > 1) {
      const loopLength = this.#setValueFromIndex(currentPinIndex, value);
      nextIndex = Math.min(currentPinIndex + loopLength - 1, this.charLength - 1);
    } else if (digits.length === 1) {
      input.value = digits[0] ?? "";
      // if user type 1-9
      nextIndex = !isLastIndex ? (currentPinIndex + 1) : this.charLength - 1;
    } else {
      input.value = "";
    }
    if (currentPinIndex !== nextIndex) {
      const nextInput = (this.elements!).inputs[nextIndex];
      this.#weFocus = true;
      nextInput.focus();
    }
    this.#setFormValue();
    this.#dispatchOnInputEvent(e);
    this.#checkValidity(false)?.then((validityRes)=>{
      if(e.inputType !== "deleteContentBackward" && isLastIndex && validityRes.isAllValid){
        this.#dispatchOnCompleteEvent();
      }
    });
  }
  #dispatchOnCompleteEvent(){
    const event = new CustomEvent("complete",{bubbles:true,composed:true,cancelable:false});
    this.dispatchEvent(event);
  }
  #dispatchOnInputEvent(e: InputEvent){
    const event = createInputEvent("input",e,{bubbles:true, composed:true, cancelable:false});
    this.dispatchEvent(event);
  }
  #onBeforeInput(e: InputEvent) {
    const target = e.target as HTMLInputElement;
    const event = createInputEvent("beforeinput", e, { bubbles: true, composed: true });
    if (!this.dispatchEvent(event)) {
      e.preventDefault();
      return;
    }
    const inputtedText = e.data || "";
    const standardInputtedText = faToEnDigits(inputtedText);
    // const caretPosition = (e.target as HTMLInputElement).selectionStart;
    if (!(/[0-9]+/g.test(standardInputtedText))) {
      if (e.inputType === 'deleteContentBackward') {
        if (target.value == "") {
          //dont move it to onkeyup because we cant determine input is empty condition there becuase input is always empty in there
          //if value is empty we move cursor to prev input if not we just stop 
          const currentPinIndex = parseInt(target.parentElement!.dataset.pinIndex!, 10);
          const nextIndex = currentPinIndex === 0 ? 0 : (currentPinIndex - 1);
          const nextInput = (this.elements!).inputs[nextIndex];
          nextInput.focus();
        }
      } else {

        //if input is not number and not backspace
        e.preventDefault();
      }
    } else {
      //on number input
      if (target.value.length > 0) {
        //when input had value before this input we remove old value so new value would replace
        target.value = '';
      }
    }
  }
  /**
   * 
   * @param {KeyboardEvent} e 
   */
  #onInputKeyup(e: KeyboardEvent) {
    //change focus 
    const elem = e.target as HTMLInputElement;
    const currentPinIndex = Number(elem.parentElement!.dataset.pinIndex!);
    let nextIndex = currentPinIndex;

    //if inputted key is not a number
    switch (e.keyCode) {
      case 39:
        // right arrow
        nextIndex = currentPinIndex + 1 < this.charLength ? (currentPinIndex + 1) : this.charLength - 1;
        break;
      case 37:
        // left arrow
        nextIndex = currentPinIndex > 0 ? (currentPinIndex - 1) : 0;
        break;

    }
    if (nextIndex !== currentPinIndex) {
      const nextInput = (this.elements!).inputs[nextIndex];
      nextInput.focus();
    }
    const event = createKeyboardEvent("keyup", e, { bubbles: true, composed: true });
    if (!this.dispatchEvent(event)) {
      e.preventDefault();
    }
    if (e.keyCode === 13) {
      this.#onInputEnter();
    }
  }
  #onInputEnter() {
    const event = new CustomEvent('enter');
    this.dispatchEvent(event);
  }

  #DispatchChangeEvent() {
    // const validationObject = this.checkInputValidation(inputText);
    const event = new Event('change', {cancelable:false,bubbles:true, composed:true});
    this.dispatchEvent(event);
  }
  #showValidationError(error: ShowValidationErrorParameters | string) {
    const message = typeof error === "string"?error:error.message;
    this.#setMessage(message, true);
  }
  clearValidationError() {
    const text = this.getAttribute("message") || "";
    this.#setMessage(text, false);
  }
  #setMessage(message: string, isError: boolean) {
    this.elements.messageBox.textContent = message;
    this.elements.messageBox.classList.toggle("error", isError);
    this.#hasVisibleError = isError && message.trim().length > 0;
    this.#setMessageA11y();
  }
  /**
* @description will determine if component trigger jb-validation mechanism automatically on user event or it just let user-developer handle validation mechanism by himself
*/
  get isAutoValidationDisabled(): boolean {
    //currently we only support disable-validation in attribute and only in initiate time but later we can add support for change of this 
    return !!(this.getAttribute('disable-auto-validation') === '' || this.getAttribute('disable-auto-validation') === 'true' );
  }
  #checkValidity(showError: boolean) {
    if (!this.isAutoValidationDisabled) {
      return this.#validation.checkValidity({ showError });
    }
  }
  /**
* @description this method called on every checkValidity calls and update validation result of #internal
*/
  #setValidationResult(result: ValidationResult<ValidationValue>) {
    this.#isInvalid = !result.isAllValid;
    if (result.isAllValid) {
      this.#internals?.setValidity({}, '');
    } else {
      const states: ValidityStateFlags = {};
      let message = "";
      result.validationList.forEach((res) => {
        if (!res.isValid) {
          if (res.validation.stateType) { states[res.validation.stateType] = true; }
          if (message == '') { message = res.message??""; }
        }
      });
      this.#internals?.setValidity(states, message);
    }
    this.elements.inputs.forEach((input) => {
      if (this.#isInvalid) {
        input.setAttribute("aria-invalid", "true");
      } else {
        input.removeAttribute("aria-invalid");
      }
    });
  }
  #getInsideValidation(): ValidationItem<ValidationValue>[] {
    const validationList: ValidationItem<ValidationValue>[] = [];
    if(this.getAttribute("error") !== null && (this.getAttribute("error")??"").trim().length > 0){
      validationList.push({
        validator: undefined,
        message: this.getAttribute("error")??"",
        stateType: "customError"
      });
    }
    if (this.required) {
      validationList.push({
        validator:(value:string)=>{
          return value.length === this.charLength && !value.includes(this.emptyChar)
        },
        message: getRequiredMessage(i18n,null),
        stateType: "valueMissing"
      });
    }
    return validationList;
  }
  /**
   * @public
   * @description this method used to check for validity but doesn't show error to user and just return the result
   * this method used by #internal of component
   */
  checkValidity(): boolean {
    const validationResult = this.#validation.checkValiditySync({ showError: false });
    if (!validationResult.isAllValid) {
      const event = new CustomEvent('invalid');
      this.dispatchEvent(event);
    }
    return validationResult.isAllValid;
  }
  /**
  * @public
 * @description this method used to check for validity and show error to user
 */
  reportValidity(): boolean {
    const validationResult = this.#validation.checkValiditySync({ showError: true });
    if (!validationResult.isAllValid) {
      const event = new CustomEvent('invalid');
      this.dispatchEvent(event);
    }
    return validationResult.isAllValid;
  }
  get validationMessage(){
    return this.#internals?.validationMessage??null;
  }
  /**
   * focus on first empty input
   * @public 
   */
  focus() {
    const firstEmpty = this.elements.inputs.find(i=>i.value == "");
    if(firstEmpty){
      firstEmpty.focus();
    }else{
      this.elements.inputs[this.elements.inputs.length-1]?.focus();

    }
  }
}
const myElementNotExists = !customElements.get('jb-pin-input');
if (myElementNotExists) {
  window.customElements.define('jb-pin-input', JBPinInputWebComponent);
}
