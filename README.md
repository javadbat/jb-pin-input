# jb-pin-input

pure js standalone pin input web-component

- smart paste algorithm
- mobile freindly
- light and fast

sample:<https://codepen.io/javadbat/pen/zYPEqNJ>

## doc

### usage

##### load javascript code

you can load this web component with 2 method:

1- using npm:
if you have modern app with module mechanism and npm you can install and import module from npm:

```cmd
npm i jb-pin-input
```
in your js file:

```javascript
import 'jb-pin-input';
```
2- using cdn:
```html
<script src="https://unpkg.com/jb-pin-input"></script>
```
#### in HTML view

```html
<jb-pin-input></jb-pin-input>
```
### set value

to select value in your code you have 2 option:
1- set it via dom assign `pinInputDom.value = yourValue`
2- set through dom attribute `<jb-pin-input value="yourValueSting"></jb-pin-input>`
remember set value as attribute if your option is a plain string but in direct assign like first option you can attach both string or object value assignation


### events

```js

    dropDownElement.addEventListener('load',(e)=>{/*your function*/});
    dropDownElement.addEventListener('init',(e)=>{/*your function*/});
    dropDownElement.addEventListener('change',(e)=>{/*your function*/});
    dropDownElement.addEventListener('keyup',(e)=>{/*your function*/});
    //on user press enter
    dropDownElement.addEventListener('enter',(e)=>{/*your function*/});

```

### set custome style

in some cases in your project you need to change defualt style of web-component for example you need zero margin or different border-radius and etc.  
if you want to set a custom style to this web-component all you need is to set css variable in parent scope of web-component
| css variable name                         | description                                                                                   |
| -------------                             | -------------                                                                                 |
| --jb-pin-input-bottom-line-color          | color of bottom line of each number                                                           |
| --jb-pin-input-bottom-line-color-active   | color of bottom line of each number when user focus on it                                     |
| --jb-pin-input-pin-color                  | color of inputed text                                                                         |
