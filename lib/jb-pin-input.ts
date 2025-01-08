import HTML from './jb-pin-input.html';
import CSS from './jb-pin-input.scss';
import { ValidationItem, ValidationResult, type WithValidation, ValidationHelper, ShowValidationErrorInput } from 'jb-validation';
import { Elements, ValidationValue } from "./Types";
import { JBFormInputStandards } from 'jb-form';
export class JBPinInputWebComponent extends HTMLElement implements WithValidation<ValidationValue>, JBFormInputStandards<string> {
  elements!: Elements;
  #internals?: ElementInternals;
  #value: null | string = null;
  #acceptPersianNumber = true;
  static get formAssociated() { return true; }
  get emptyChar() {
    //char that replace value of empty input in value
    return '-';
  }
  #disabled = false;
  get disabled() {
    return this.#disabled;
  }
  set disabled(value: boolean) {
    this.#disabled = value;
    this.elements.inputs.forEach((i) => i.disabled = value);
    if (value) {
      //TODO: remove as any when typescript support
      (this.#internals as any).states?.add("disabled");
    } else {
      (this.#internals as any).states?.delete("disabled");
    }
  }
  #required = false;
  set required(value: boolean) {
    this.#required = value;
    this.#checkValidity(false);
  }
  get required() {
    return this.#required;
  }
  get value() {
    const arr = (this.elements!).inputs.map((input) => {
      const char = input.value;
      if (char) {
        return char;
      } else {
        return this.emptyChar;
      }
    });
    const value = arr.join('');
    return this.#standardValue(value);
  }
  set value(value: string) {
    const sValue = this.#standardValue(value);
    this.#setValue(sValue);
  }
  /**
   * @description set value to the inputs without any validation so use validation before calling this function
   * @param {string} value 
   */
  #setValue(value: string) {
    (this.elements!).inputs.forEach((input, index) => {
      if (Number.isNaN(value[index]) || value[index] === "" || value[index] == this.emptyChar || value[index] == null || value[index] == undefined) {
        input.value = "";
      } else {
        input.value = value[index];
      }
    });
    if (this.#internals && typeof this.#internals.setFormValue == "function") {
      this.#internals.setFormValue(value);
    }
  }
  // get validationList() {
  //     //return this._validationList;
  //     return true;
  // }
  // set validationList(value) {
  //     //TODO: impl custom validation
  //     // this._validationList = value;
  //     // this.triggerInputValidation(false);
  // }
  #charLength = 6;
  get charLength() {
    return this.#charLength;
  }
  set charLength(value) {
    this.#charLength = value;
    this.initInputsDom();
  }
  #validation = new ValidationHelper({
    clearValidationError: this.clearValidationError.bind(this),
    showValidationError: this.showValidationError.bind(this),
    getValue: () => this.value,
    getValueString: () => this.#value,
    setValidationResult: this.#setValidationResult.bind(this)
  });
  get validation() {
    return this.#validation;
  }
  initialValue = "";
  get isDirty(): boolean {
    return this.#value !== this.initialValue;
  }
  get name() {
    return this.getAttribute('name') || '';
  }
  constructor() {
    super();
    if (typeof this.attachInternals == "function") {
      //some browser dont support attachInternals
      this.#internals = this.attachInternals();
    }
    this.initWebComponent();
  }
  connectedCallback() {
    // standard web component event that called when all of dom is binded
    this.callOnLoadEvent();
    this.initProp();
    this.callOnInitEvent();

  }
  callOnLoadEvent() {
    const event = new CustomEvent('load', { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }
  callOnInitEvent() {
    const event = new CustomEvent('init', { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }
  initWebComponent() {
    const shadowRoot = this.attachShadow({
      mode: 'open',
      delegatesFocus: true
    });
    const html = `<style>${CSS}</style>` + '\n' + HTML;
    const element = document.createElement('template');
    element.innerHTML = html;
    shadowRoot.appendChild(element.content.cloneNode(true));
    this.elements = {
      inputsWrapper: shadowRoot.querySelector('.inputs-wrapper')!,
      inputs: [],
      error: shadowRoot.querySelector('.error-message')!
    };

  }
  registerEventListener() {
    //
  }
  initProp() {
    //this._validationList = [];
    //this.value = this.getAttribute('value') || '';
    // this.validation = {
    //     isValid: null,
    //     message: null
    // };
    this.initInputsDom();
    this.registerEventListener();

  }
  static get observedAttributes() {
    return ['autofocus', 'char-length'];
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    // do something when an attribute has changed
    this.onAttributeChange(name, newValue);
  }
  onAttributeChange(name: string, value: string) {
    switch (name) {
      case 'autofocus':
        if (value == 'true') {
          if ((this.elements!).inputs[0]) {
            (this.elements!).inputs[0].focus();
          }
        }
        break;
      case 'char-length':
        if (Number.isInteger(Number(value))) {
          this.charLength = Number(value);
        }
        break;
    }

  }
  #standardValue(value: string) {
    //TODO: add acceptance for non-digits by config
    let standardValue = value;
    if (this.#acceptPersianNumber) {
      standardValue = this.#faToEnDigits(standardValue);
    }
    return standardValue;
  }
  #faToEnDigits(value: string) {
    let standardValue = value;
    if (this.#acceptPersianNumber && typeof value == "string") {
      standardValue = value.replace(/\u06F0/g, '0').replace(/\u06F1/g, '1').replace(/\u06F2/g, '2').replace(/\u06F3/g, '3').replace(/\u06F4/g, '4').replace(/\u06F5/g, '5').replace(/\u06F6/g, '6').replace(/\u06F7/g, '7').replace(/\u06F8/g, '8').replace(/\u06F9/g, '9');
    }
    return standardValue;
  }
  initInputsDom() {
    const inputElements = this.createInputs();
    (this.elements!).inputs = inputElements.map(x => x.querySelector('.pin-input')!);
    (this.elements!).inputsWrapper.innerHTML = "";
    inputElements.forEach((elements) => {
      (this.elements!).inputsWrapper.appendChild(elements);
    });
    // auto focus if it set to be auto focused
    const autofocus = this.getAttribute('autofocus');
    if (autofocus == 'true' && (this.elements!).inputs[0]) {
      (this.elements!).inputs[0].focus();
    }
  }
  /**
   * 
   * @return {Array.<HTMLInputElement>} inputList - array of pin input DOM
   */
  createInputs(): HTMLDivElement[] {
    const inputsList: HTMLDivElement[] = [];
    for (let i = 0; i < this.charLength; i++) {
      const inputDom = this.createInput(i);
      inputsList.push(inputDom);
    }
    return inputsList;
  }
  createInput(index: number): HTMLDivElement {
    const wrapperDom = document.createElement('div');
    wrapperDom.classList.add('pin-input-wrapper');
    const inputDom = document.createElement('input');
    inputDom.classList.add('pin-input');
    inputDom.addEventListener('keypress', this.onInputKeyPress.bind(this));
    inputDom.addEventListener('keyup', this.onInputKeyup.bind(this));
    inputDom.addEventListener('beforeinput', this.onBeforeInput.bind(this));
    inputDom.addEventListener('blur', this.onInputBlur.bind(this));
    inputDom.addEventListener('input', (e) => this.onInput((e as InputEvent)), { passive: true });
    inputDom.addEventListener('paste', this.onPasteValue.bind(this));
    inputDom.setAttribute('inputmode', 'numeric');
    inputDom.setAttribute('pattern', '[0-9]*');
    const shapeDom = document.createElement('div');
    shapeDom.classList.add('pin-input-shape');
    wrapperDom.appendChild(inputDom);
    wrapperDom.appendChild(shapeDom);
    wrapperDom.setAttribute('data-pin-index', index.toString());
    return wrapperDom;
  }
  onPasteValue(e: ClipboardEvent) {
    e.preventDefault();
    let value = (e.clipboardData!).getData('text');
    const index = Number((e.target as HTMLInputElement).parentElement!.dataset.pinIndex);
    const regex = new RegExp(`(.*\\D|^)(?<pin>[0-9]{${this.charLength}})(\\D.*|$)`);
    // convert persian digit so regex accept them too
    value = this.#faToEnDigits(value);
    const regexResult = regex.exec(value);
    let filteredValue = "";
    if (regexResult && regexResult.groups && regexResult.groups.pin) {
      //first we looking for full pin code match
      //if we find all digits in pasted value
      filteredValue = regexResult.groups.pin;
      this.#setValue(filteredValue);
      const index = this.value.length;
      //change input foucs to the last pin based on pasted value length
      if (this.value.length > 0) {
        (this.elements!).inputs[index - 1].focus();
      }
    }
    else {
      //when full match not found we just get any incomplete numbers
      const filteredValue = value.match(`[0-9]{1,${this.charLength}}`);
      if (filteredValue) {
        const inputValue = filteredValue[0];
        const value = [...this.value];
        const loopLength = Math.min(this.charLength - index, inputValue.length);
        let i: number;
        for (i = 0; i < loopLength; i++) {
          value[index + i] = inputValue[i];
        }
        //change input foucs to the last pin based on pasted value length
        (this.elements!).inputs[i].focus();
        this.value = value.join('');

      }

    }

  }
  onInputBlur(e: FocusEvent) {
    const focusedElement = e.relatedTarget;
    if (this.elements.inputs.includes(focusedElement as HTMLInputElement)) {
      //
    } else {
      this.blur();
    }
  }
  blur() {
    this.validation.checkValidity({ showError: true });
  }
  onInputKeyDown(e: KeyboardEvent) {
    const keyDownnInitObj: KeyboardEventInit = {
      key: e.key,
      keyCode: e.keyCode,
      code: e.code,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      charCode: e.charCode,
      which: e.which
    };
    const event = new KeyboardEvent("keydown", keyDownnInitObj);
    this.dispatchEvent(event);
  }
  onInputKeyPress(e: KeyboardEvent) {
    const keyPressInitObj: KeyboardEventInit = {
      key: e.key,
      keyCode: e.keyCode,
      code: e.code,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      charCode: e.charCode,
      which: e.which,
      bubbles: e.bubbles,
      cancelable: e.cancelable,
      composed: e.composed,
      detail: e.detail,
      isComposing: e.isComposing,
      location: e.location,
      metaKey: e.metaKey,
      view: e.view,
      repeat: e.repeat
    };
    const event = new KeyboardEvent('keypress', keyPressInitObj);
    this.dispatchEvent(event);
  }
  /**
   * 
   * @param {InputEvent} e 
   */
  onInput(e: InputEvent) {
    const elem = e.target;
    const currentPinIndex = parseInt((elem as HTMLInputElement).parentElement!.dataset.pinIndex!);
    let nextIndex = currentPinIndex;
    this.validation.checkValidity({ showError: false });
    const value = this.#faToEnDigits((e.target as HTMLInputElement).value);
    if (/[0-9]+/g.test(value)) {
      // if user type 1-9
      nextIndex = currentPinIndex + 1 < this.charLength ? (currentPinIndex + 1) : this.charLength - 1;
    }
    if (currentPinIndex !== nextIndex) {
      const nextInput = (this.elements!).inputs[nextIndex];
      nextInput.focus();
    }
  }
  /**
* 
* @param {InputEvent} e 
*/
  onBeforeInput(e: InputEvent) {
    const target = e.target as HTMLInputElement;
    const inputtedText = e.data!;
    const standardInputtedText = this.#faToEnDigits(inputtedText);
    // const caretPosition = (e.target as HTMLInputElement).selectionStart;
    if (!(/[0-9]+/g.test(standardInputtedText))) {
      if (e.inputType === 'deleteContentBackward') {
        if (target.value == "") {
          //dont move it to onkeyup becuse we cant determine input is empty condition there becuase input is always empty in there
          //if value is empty we move cursor to prev input if not we just stop 
          const currentPinIndex = parseInt(target.parentElement!.dataset.pinIndex!);
          const nextIndex = currentPinIndex == 0 ? 0 : (currentPinIndex - 1);
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
  onInputKeyup(e: KeyboardEvent) {
    //change focus 
    const elem = e.target as HTMLInputElement;
    const currentPinIndex = parseInt(elem.parentElement!.dataset.pinIndex!);
    let nextIndex = currentPinIndex;

    //if inputed key is not a number
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

    //here is the rare  time we update #value directly becuase we want trigger event that may read value directly from dom
    //this.#value = inputText;
    //this.triggerInputValidation(false);
    const keyUpInitObj = {
      key: e.key,
      keyCode: e.keyCode,
      code: e.code,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      charCode: e.charCode,
      which: e.which,
    };
    const event = new KeyboardEvent('keyup', keyUpInitObj);
    this.dispatchEvent(event);
    if (e.keyCode == 13) {
      this.onInputEnter();
    }
  }
  onInputEnter() {
    const event = new CustomEvent('enter');
    this.dispatchEvent(event);
  }
  onInputChange(e: InputEvent) {
    const inputText = (e.target as HTMLInputElement).value;
    // this.triggerInputValidation(true);
    //here is the rare  time we update #value directly becuase we want trigger event that may read value directly from dom
    this.#value = inputText;
    // const validationObject = this.checkInputValidation(inputText);
    const event = new CustomEvent('change', {
      detail: {
        // isValid: validationObject.isAllValid,
        // validationObject: validationObject,
      },
    });
    this.dispatchEvent(event);
  }
  checkAllInputFields() {
    let validationResult = true;
    let validationObject = {
      message: "",
      isValid: true
    };
    for (let i = 0; i < this.elements.inputs.length; i++) {
      if (this.elements.inputs[i].value == "" || this.elements.inputs[i].value == null) {
        validationResult = false;
        break;
      }

    }
    if (!validationResult) {
      validationObject = {
        message: "لطفا کد تایید را وارد کنید.",
        isValid: false,
      };
    }
    return validationObject;
  }
  showValidationError(error: ShowValidationErrorInput) {
    this.elements.error.innerHTML = error.message;
  }
  clearValidationError() {
    this.elements.error.innerHTML = "";
  }
  /**
* @description will determine if component trigger jb-validation mechanism automatically on user event or it just let user-developer handle validation mechanism by himself
*/
  get isAutoValidationDisabled(): boolean {
    //currently we only support disable-validation in attribute and only in initiate time but later we can add support for change of this 
    return this.getAttribute('disable-auto-validation') === '' || this.getAttribute('disable-auto-validation') === 'true' ? true : false;
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
    if (result.isAllValid) {
      this.#internals.setValidity({}, '');
    } else {
      const states: ValidityStateFlags = {};
      let message = "";
      result.validationList.forEach((res) => {
        if (!res.isValid) {
          if (res.validation.stateType) { states[res.validation.stateType] = true; }
          if (message == '') { message = res.message; }
        }
      });
      this.#internals.setValidity(states, message);
    }
  }
  #getInsideValidation(): ValidationItem<ValidationValue>[] {
    const validationList: ValidationItem<ValidationValue>[] = [];
    if (this.required) {
      validationList.push({
        validator: /.{1}/g,
        message: this.getAttribute("label") + " " + "میبایست حتما وارد شود",
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
    return this.#internals.validationMessage;
  }
  /**
   * @public
   */
  focus() {
    (this.elements!).inputs[0].focus();
  }
}
const myElementNotExists = !customElements.get('jb-pin-input');
if (myElementNotExists) {
  window.customElements.define('jb-pin-input', JBPinInputWebComponent);
}
