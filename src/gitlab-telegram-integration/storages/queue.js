export class Queue {
  items = [];

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    return this.items.shift();
  }

  peek() {
    if (this.items.length) {
      return this.items[0];
    } else {
      return undefined;
    }
  }

  isEmpty() {
    return !this.items.length;
  }
}
