# Clock24 🕓

A TypeScript npm package for easier native-like time input handling.

Have you ever added an `<input type="time">` tag, only for it to display as a 12H atrocity when rendered? Well, be scared no more! This library makes it easier than ever to build gloriously beautiful 24H time elements.

## ✨ Features

* **Unstyled**: Customize the look to your liking
* **Dependency-free**: Super simple and lightweight
* **Framework-agnostic**: Pick your own framework poison
* **Written in TypeScript**: Strictly typed and pleasant to use

## 📌 Installation

```bash
npm install clock24
```

or

```bash
yarn add clock24
```

## 🚀 Usage

Create two `<input type="text" maxlength="2" inputmode="numeric">` inputs to act as HH and MM fields like following:

```html
<input
    id="input-HH"
    type="text"
    maxlength="2"
    inputmode="numeric"
>
<span>:</span>
<input
    id="input-MM"
    type="text"
    maxlength="2"
    inputmode="numeric"
>
```

To make it behave as a native input simply do the following snippet:

```TypeScript
import { TimeElement } from 'clock24';

const timeElement: TimeElement = new TimeElement(
    document.getElementById('input-HH'), // Hour input
    document.getElementById('input-MM'), // Minute input
    document.getElementById('native-input'), // Or null if you aren't concerned
    '04:20' // Set the value, '00:00' by default
);

console.log(timeElement.value); // Should print '04:20'
```

Now when typing it'll act in exactly the same way a native input would. The only thing still left to do is to style it to your liking and you're free to do so! It's actually that simple!

Additional native `<input type="time">` input might be provided and used as a mobile way of time value input. Just overlay it on top with `opacity: 0` if you detected a mobile device.