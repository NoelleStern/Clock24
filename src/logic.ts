import { TimeElement as TimeElementInternal, DoubleDigit } from './types';


// Behold the peak TS
export class TimeElement extends TimeElementInternal {
  init() {
    // Setup values
    this.hhElement.value = this.hh.value;
    this.mmElement.value = this.mm.value;

    // Setup HH Element
    this.hhElement.onfocus = (e) => { onFocus(this, e as FocusEvent & { currentTarget: EventTarget & HTMLInputElement; }); }
    this.hhElement.onkeydown = (e) => { onKeyDown(this, e as KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement; });}
    this.hhElement.onbeforeinput = (e) => { onBeforeInput(this, e as InputEvent & { currentTarget: EventTarget & HTMLInputElement; }); }
    this.hh.subscribe(v => { this.hhElement.value = v; });
  
    // Setup MM Element
    this.mmElement.onfocus = (e) => { onFocus(this, e as FocusEvent & { currentTarget: EventTarget & HTMLInputElement; }); }
    this.mmElement.onkeydown = (e) => { onKeyDown(this, e as KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement; }); }
    this.mmElement.onbeforeinput = (e) => { onBeforeInput(this, e as InputEvent & { currentTarget: EventTarget & HTMLInputElement; }); }
    this.mm.subscribe(v => { this.mmElement.value = v; });

    if (this.nativeElement) {
      this.nativeElement.value = this.value; // Setup value
      this.nativeElement.onchange = (e) => { onChange(this, e); } // Setup native Element
      this.syncOut = () => { this.nativeElement!.value = this.value; }; // Setup syncOut function
    }
  }
}


export function onChange(timeElement: TimeElementInternal, _e: Event) {
  if (!timeElement.nativeElement) { return; } // A little bit of foolproof-ing 

  const value: string = timeElement.nativeElement.value;
  
  if (TimeElement.validate(value)) {
    timeElement.value = value;
    // timeElement.syncOut();
  } else if (value == '') {
    // I think doing this generally would be an issue, but since
    // this piece of code is only relevant for mobile it should be fine
    timeElement.value = '00:00';
    // timeElement.syncOut();
  }
}

export function onFocus(timeElement: TimeElementInternal, e: FocusEvent & { currentTarget: EventTarget & HTMLInputElement }) {
  const dd: DoubleDigit|undefined = timeElement.getDD(e.currentTarget);
  if (!dd) { return; }
  
  e.currentTarget.select();
  dd.focus();
};

export function onKeyDown(timeElement: TimeElementInternal, e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }) {
  if (e.key.startsWith('Arrow')) {
    e.preventDefault(); // Stop bubbling

    if (e.currentTarget == timeElement.hhElement) {
      if (e.key == 'ArrowRight') { timeElement.mmElement.focus(); }
    } else {
      if (e.key == 'ArrowLeft') { timeElement.hhElement.focus(); }
    }
  }
}

// Imitates the native element behavior
export function onBeforeInput(timeElement: TimeElementInternal, e: InputEvent & { currentTarget: EventTarget & HTMLInputElement }) {
  e.preventDefault(); // Stop bubbling

  const dd: DoubleDigit|undefined = timeElement.getDD(e.currentTarget);
  if (!dd) { return; }

  let nextFlag: boolean = false; // If set changes the focus to mmElement
  const inputType: string = e.inputType; // Input type
  const input: number = Number( (e.data || '').replace(/\D/g, '') ); // Remove non-digits
  
  if (inputType == 'deleteContentBackward') { dd.backspace(); }
  else if (inputType == 'insertText') {
  
    if (dd.type == 'hh') { // Hour input

      // The first digit:
      //    1) Put it as is and change focus to next if it's > 2
      // The second digit:
      //    1) If the first digit is <= 1 - put it as is
      //    2) If the first digit is 2 - force the second digit to be within [0,3]
      
      if (dd.inputHistory.length == 0 || dd.inputHistory.length == 2) { // First digit

        if (dd.inputHistory.length == 2) { dd.resetHistory(); } // Reset if was set
        dd.addToHistory(input); 
        dd.setDigit(input);
        if (input > 2) { nextFlag = true; } // Change focus if makes sense

      } else if (dd.inputHistory.length == 1) { // Second digit

        dd.addToHistory(input);
        if (dd.inputHistory[0] <= 1) { dd.setDigit(input, dd.inputHistory[0]); } 
        else if (dd.inputHistory[0] == 2) { dd.setDigit(Math.min(3, input), 2); }
        nextFlag = true; // Change focus unconditionally

      }

    } else { // Minute input

      // The first digit:
      //    1) Put it as is
      // The second digit:
      //    1) If the first digit > 5 then replace value as well as history
      //    2) Otherwise put as is
      
      if (dd.inputHistory.length == 0 || dd.inputHistory.length == 2) { // First digit

        if (dd.inputHistory.length == 2) { dd.resetHistory(); } // Reset if was set
        dd.addToHistory(input);
        dd.setDigit(input);

      } else if (dd.inputHistory.length == 1) { // Second digit

        if (dd.inputHistory[0] > 5) {
          dd.resetHistory([input]);
          dd.setDigit(input);
        } else {
          dd.addToHistory(input);
          dd.setDigit(input, dd.inputHistory[0]);
        }

      }
      
    }
    
  }

  // Validate and update
  if (timeElement.validate()) { timeElement.syncOut(); } 

  // Change focus / reselect
  if (!nextFlag) { e.currentTarget.select(); }
  else { timeElement.mmElement!.focus(); }
}