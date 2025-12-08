export class Iterator<T> {
  private index = 0;

  constructor(private items: T[]) {}

  current(): T {
    return this.items[this.index];
  }

  next(): T | null {
    if (this.hasNext()) {
      this.index++;
      return this.items[this.index];
    }
    return null;
  }

  hasNext(): boolean {
    return this.index < this.items.length - 1;
  }

  reset() {
    this.index = 0;
  }
}
