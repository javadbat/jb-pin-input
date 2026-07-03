# jb-pin-input

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/jb-pin-input)
[![GitHub license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://raw.githubusercontent.com/javadbat/jb-pin-input/main/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/jb-pin-input)](https://www.npmjs.com/package/jb-pin-input)
![GitHub Created At](https://img.shields.io/github/created-at/javadbat/jb-pin-input)

`jb-pin-input` is a standalone, form-associated web component for PIN, OTP, and one-time-code entry.

- Renders one input cell per character.
- Supports configurable PIN length with `charLength` / `char-length`.
- Accepts Persian and Arabic digits and stores English digits.
- Supports smart paste from text that contains a full or partial PIN.
- Moves focus between cells while typing, deleting, and using left/right arrows.
- Dispatches `complete` event when all cells are filled and validation passes.
- Uses `jb-validation` for custom validation and built-in `required` validation.

## When to use

Use `jb-pin-input` for OTP, verification code, PIN, and short numeric code entry.

Use [`jb-password-input`](https://github.com/javadbat/jb-password-input) for secret text that should be masked as a password. Use [`jb-input`](https://github.com/javadbat/jb-input) for normal single-field text entry.

## Demo

- [CodePen](https://codepen.io/javadbat/pen/zYPEqNJ)
- [GitHub Pages](https://javadbat.github.io/jb-pin-input)
- [Storybook](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbpininput)


## Using With JS Frameworks

- [<img src="https://img.shields.io/badge/React.js-jb--pin--input%2Freact-000.svg?logo=react&logoColor=%2361DAFB" height="30" />](https://github.com/javadbat/jb-pin-input/tree/main/react)

## Installation

```sh
npm i jb-pin-input
```

```js
import 'jb-pin-input';
```

```html
<jb-pin-input label="Verification code" name="otp" char-length="6" message="Enter verification code"></jb-pin-input>
```

### CDN

```html
<script src="https://unpkg.com/jb-pin-input"></script>
```

## API reference

### Attributes

| name | type | default | description |
| --- | --- | --- | --- |
| `value` | `string` | `""` | Initial or reflected PIN value. Missing cells are represented by `-` in `.value`. |
| `char-length` | `number` | `6` | Number of PIN cells. |
| `name` | `string` | `""` | Form field name. |
| `label` | `string` | `""` | Accessible label used for the PIN group and each internal cell. |
| `accessible-label` | `string` | `""` | Accessible label fallback when you do not want to use `label`. |
| `required` | `boolean` | `false` | Enables required validation. Empty attribute and `"true"` mean true. |
| `disabled` | `boolean` | `false` | Disables all inner PIN inputs. Empty attribute and `"true"` mean true. |
| `autofocus` | `boolean` | `false` | Focuses the first input after initialization. Empty attribute and `"true"` mean true. |
| `inputmode` | `string` | `numeric` | Input mode forwarded to each internal input. |
| `message` | `string` | `""` | Helper text shown below the PIN cells when no validation error is visible. |
| `error` | `string` | `""` | External validation error message. |
| `disable-auto-validation` | `boolean` | `false` | Disables automatic validation on blur when set to an empty attribute or `"true"`. |

### Properties

| name | type | readonly | description |
| --- | --- | --- | --- |
| `value` | `string` | no | Canonical PIN value. Empty cells are represented by `-`. |
| `charLength` | `number` | no | Number of PIN cells. See the [charLength demo](https://javadbat.github.io/design-system/?path=/docs/components-form-elements-jbpininput-charlength--docs). |
| `emptyChar` | `'-'` | yes | Character used in `.value` for empty cells. |
| `inputMode` | `string` | no | Input mode forwarded to each internal input. |
| `disabled` | `boolean` | no | Enables or disables all inner inputs. |
| `required` | `boolean` | no | Enables required validation. |
| `validation` | `ValidationHelper<string>` | yes | Validation helper from `jb-validation`; set `validation.list` for custom rules. See the [validation demo](https://javadbat.github.io/design-system/?path=/docs/components-form-elements-jbpininput-validation--docs). |
| `form` | `HTMLFormElement \| null` | yes | Associated form from `ElementInternals`. |
| `name` | `string` | yes | Form field name from the `name` attribute. |
| `isDirty` | `boolean` | yes | `true` when current value differs from `initialValue`. |
| `validationMessage` | `string \| null` | yes | Current validation message from `ElementInternals`. |

### Methods

| name | returns | description |
| --- | --- | --- |
| `checkValidity()` | `boolean` | Runs validation without showing the error message. Dispatches `invalid` when invalid. |
| `reportValidity()` | `boolean` | Runs validation and shows the first error message. Dispatches `invalid` when invalid. |
| `focus()` | `void` | Focuses the first empty cell, or the last cell when all cells are filled. |
| `clearValidationError()` | `void` | Clears the visible validation error and restores `message`. |

### Events

| event | description |
| --- | --- |
| `load` | Dispatched from `connectedCallback` before initialization. |
| `init` | Dispatched from `connectedCallback` after initialization. |
| `beforeinput` | Re-dispatched from the active inner input. |
| `input` | Dispatched after a PIN cell changes. |
| `change` | Dispatched on blur when the PIN value changed during focus. |
| `keydown` | Re-dispatched from the active inner input. |
| `keyup` | Re-dispatched from the active inner input. |
| `keypress` | Re-dispatched from the active inner input. |
| `enter` | Dispatched when Enter is pressed. |
| `complete` | Dispatched after the last cell is filled and validation passes. |
| `invalid` | Dispatched when `checkValidity()` or `reportValidity()` fails. |

## Value

The default length is 6. Empty cells are represented by `-` in `.value`.

```js
const pinInput = document.querySelector('jb-pin-input');

pinInput.value = '1234';
console.log(pinInput.value); // "1234--"
```

```html
<jb-pin-input value="123456"></jb-pin-input>
```

The component accepts Persian and Arabic digits and stores English digits.

## Character length

```js
const pinInput = document.querySelector('jb-pin-input');

pinInput.charLength = 5;
```

```html
<jb-pin-input char-length="5"></jb-pin-input>
```

## Smart paste

When pasted text contains a full PIN with the configured length, the component extracts that PIN. If no full match exists, it extracts the first partial digit sequence and fills from the current cell.

## Validation

Use `required` for the common required rule. It is valid only when all cells are filled.

```html
<jb-pin-input required></jb-pin-input>
```

Use `validation.list` for custom rules. For advanced validators, async validation, and validation result options, see [`jb-validation`](https://github.com/javadbat/jb-validation).

```js
const pinInput = document.querySelector('jb-pin-input');

pinInput.validation.list = [
  {
    validator: /^1234--$/g,
    message: 'Only 1234 is accepted',
  },
  {
    validator: (value) => value.startsWith('1'),
    message: 'PIN must start with 1',
  },
];
```

```js
const isValid = pinInput.checkValidity();
const isVisibleValid = pinInput.reportValidity();
```

## Autofocus

```html
<jb-pin-input autofocus></jb-pin-input>
```

## CSS parts and variables

See the [Storybook styling demos](https://javadbat.github.io/design-system/?path=/docs/components-form-elements-jbpininput-styling--docs) for examples using CSS variables and `::part(...)`.

| part | description |
| --- | --- |
| `inputs-wrapper` | Wrapper around all PIN cells. Useful for layout-level styling. |
| `input-wrapper` | Every PIN cell wrapper. |
| `input-wrapper-{index}` | A specific PIN cell wrapper, starting from `0`; for example `input-wrapper-0`. |
| `pin-input` | Every internal input element. |
| `pin-input-{index}` | A specific internal input element, starting from `0`; for example `pin-input-0`. |
| `input-line` | Every bottom line element below a PIN input. |
| `input-line-{index}` | A specific bottom line element, starting from `0`; for example `input-line-0`. |
| `message` | Helper or validation message element. |

| CSS variable name | description |
| --- | --- |
| `--jb-pin-input-inputs-wrapper-width` | Width of the inputs wrapper. |
| `--jb-pin-input-inputs-gap` | Gap between PIN cells. |
| `--jb-pin-input-bottom-line-color` | Bottom line color. |
| `--jb-pin-input-bottom-line-border-radius` | Bottom line border radius. |
| `--jb-pin-input-bottom-line-height` | Bottom line height. |
| `--jb-pin-input-bottom-line-display` | Bottom line display value. |
| `--jb-pin-input-bottom-line-color-active` | Bottom line color while focused. |
| `--jb-pin-input-wrapper-border-width` | Cell wrapper border width. |
| `--jb-pin-input-wrapper-border-color` | Cell wrapper border color. |
| `--jb-pin-input-wrapper-border-style` | Cell wrapper border style. |
| `--jb-pin-input-wrapper-border-color-active` | Cell wrapper border color while focused. |
| `--jb-pin-input-wrapper-border-radius` | Cell wrapper border radius. |
| `--jb-pin-input-wrapper-box-shadow` | Cell wrapper box shadow while focused. |
| `--jb-pin-input-pin-color` | PIN text color. |
| `--jb-pin-input-pin-height` | Cell input height. |
| `--jb-pin-input-pin-font-size` | Cell input font size. |
| `--jb-pin-input-pin-font-weight` | Cell input font weight. |
| `--jb-pin-input-message-box-display` | Message box display value. |
| `--jb-pin-input-message-color` | Message text color. |
| `--jb-pin-input-message-error-color` | Error message text color. |
| `--jb-pin-input-message-font-size` | Message font size. |
| `--jb-pin-input-message-margin` | Message box margin. |

```css
jb-pin-input {
  --jb-pin-input-inputs-wrapper-width: 20rem;
  --jb-pin-input-inputs-gap: 0.75rem;
  --jb-pin-input-bottom-line-color-active: #0f766e;
  --jb-pin-input-pin-font-size: 1.75rem;
}

jb-pin-input::part(input-wrapper) {
  background: #ffffff;
}

jb-pin-input::part(input-line-0) {
  background: #0f766e;
}
```

## Accessibility notes

- The component is form-associated and submits `.value` as its form value.
- The component uses multiple internal inputs with `inputmode="numeric"` by default. Each internal cell receives an accessible name in the form `Verification code, digit 1 of 6`.
- Set `label`, `accessible-label`, or `aria-label` on `<jb-pin-input>` so assistive technologies receive a useful name. The `label` attribute is not rendered visually, so add a visible label in your app layout when needed.
- The first internal input uses `autocomplete="one-time-code"` for OTP autofill support.
- Helper and validation messages are connected to each internal input with `aria-describedby`; visible errors also set `aria-invalid` and `aria-errormessage`.

## Related Docs

- See [`jb-pin-input/react`](https://github.com/javadbat/jb-pin-input/tree/main/react) if you want to use this component in React.
- See [All JB Design System Component List](https://javadbat.github.io/design-system/) for more components.
- Use [Contribution Guide](https://github.com/javadbat/design-system/blob/main/docs/contribution-guide.md) if you want to contribute to this component.

## AI agent notes

- Import `jb-pin-input` once before using `<jb-pin-input>`.
- Use `char-length` in HTML and `charLength` in JavaScript/React.
- `.value` includes `-` for empty cells, so a partially entered value may look like `"12----"`.
- Listen to `complete` for the moment all cells are filled and validation passes.
- Use `label`, `accessible-label`, or `aria-label` to provide the accessible name for the generated PIN cells.
- Listen to `change` for a committed value change after blur.
- This package includes [`custom-elements.json`](./custom-elements.json) and points to it with the package.json `customElements` field. The field is documented by the Custom Elements Manifest project in [Referencing manifests from npm packages](https://github.com/webcomponents/custom-elements-manifest#referencing-manifests-from-npm-packages).
- In `custom-elements.json`, `exports.kind: "js"` describes JavaScript/TypeScript exports and `exports.kind: "custom-element-definition"` maps the `jb-pin-input` tag name to `JBPinInputWebComponent`.
