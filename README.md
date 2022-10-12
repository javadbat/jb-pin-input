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
| css variable name                          | description                                                                                   |
| -------------                              | -------------                                                                                 |
| --jb-pin-input-inputs-wrapper-width        | width of inputs wrapper,default is `100%`                                                     |
| --jb-pin-input-bottom-line-color           | color of bottom line of each number.  default value is `#9DA6B6`                              |
| --jb-pin-input-bottom-line-border-radius   | border radius of bottom line.  default value is `16px`                                        |
| --jb-pin-input-bottom-line-height          | height of bottom line of each number. default value is `4px`                                  |
| --jb-pin-input-bottom-line-display         | display of bottom line of each number. default value is `block`                               |
| --jb-pin-input-bottom-line-color-active    | color of bottom line of each number when user focus on it. default value is `#1565D8`         |
| --jb-pin-input-wrapper-border-width        | border width of each number input wrapper. default value is `0`                               |
| --jb-pin-input-wrapper-border-color        | border color of each number input wrapper. default value is `black`                           |
| --jb-pin-input-wrapper-border-style        | border style of  each number input wrapper. default value is `solid`                          |
| --jb-pin-input-wrapper-border-color-active | border color of each number input wrapper  when user focus on it. default value is `#1565D8`  |
| --jb-pin-input-pin-color                   | color of inputed text.default value is #333                                                   |
| --jb-pin-input-pin-height                  | height of  each number input. default value is `40px`                                         |
| --jb-pin-input-pin-font-size               | font size of  each number input. default value is `24`                                        |   
| --jb-pin-input-pin-font-weight             | font weight of  each number input. default value is `900`                                     |   

