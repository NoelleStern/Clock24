import { Listener, State } from './state';

export type TimeDouble = 'hh'|'mm';

export class TimeElement {
  hh: DoubleDigit;
  mm: DoubleDigit;
  hhElement: HTMLInputElement;
  mmElement: HTMLInputElement;
  nativeElement: HTMLInputElement|null;
  syncOut: Function = () => {};

  constructor(
    hhElement: HTMLInputElement,
    mmElement: HTMLInputElement,
    nativeElement: HTMLInputElement|null = null,
    value: string = '00:00'
  ) {
    this.hh = new DoubleDigit('hh');
    this.mm = new DoubleDigit('mm');
    this.hhElement = hhElement;
    this.mmElement = mmElement;
    this.nativeElement = nativeElement;
    this.value = value;
  }

  get value(): string {
    return `${this.hh.value}:${this.mm.value}`;
  }
  set value(value: string) {
    const split: string[] = value.split(':');
    this.hh.resetValue(split[0]);
    this.mm.resetValue(split[1]);
  }

  public getDD(target: HTMLInputElement): DoubleDigit|undefined {
    if (target == this.hhElement) { return this.hh; }
    else if (target == this.mmElement) { return this.mm; }
  }

  // https://stackoverflow.com/questions/7536755/regular-expression-for-matching-hhmm-time-format
  public static validate(value: string): boolean {
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
  }
  public validate(): boolean {
    return TimeElement.validate(this.value);
  }

  public syncIn(value: string) {
    this.value = value;
  }
}

export class DoubleDigit {
  private pValue: State<string> = new State('');
  type: TimeDouble;
  inputHistory: number[] = [];

  constructor(
    type: TimeDouble,
    value: string = '00',
  ) {
    this.type = type;
    this.pValue.set(value);
  }

  public focus() {
    this.inputHistory = [];
  }

  public resetHistory(array: number[] = []) {
    this.inputHistory = array;
  }

  public addToHistory(n: number) {
    this.inputHistory.push(n);
  }

  public backspace() {
    this.resetValue();
  }

  public setDigit(input: number, firstDigit: number = 0) {
    this.pValue.set(`${firstDigit}${input}`);
  }

  public resetValue(value: string = '--') {
    this.pValue.set(value);
    this.inputHistory = [];
  }

  public subscribe(fn: Listener<string>) {
    this.pValue.subscribe(fn);
  }

  get value(): string {
    return this.pValue.get();
  }
  set value(v: string) {
    this.pValue.set(v);
  }
}