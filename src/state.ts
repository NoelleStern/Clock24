// The most sample reactive state manager
export type Listener<T> = (v: T) => void;
export class State<T> {
  private value: T;
  private listeners: Listener<T>[] = [];

  constructor(initial: T) { this.value = initial; }

  get(): T { return this.value; }
  set(v: T) { if (this.value != v) { this.value = v; this.listeners.forEach(l => l(v)); } }
  subscribe(fn: Listener<T>) { this.listeners.push(fn); }
}