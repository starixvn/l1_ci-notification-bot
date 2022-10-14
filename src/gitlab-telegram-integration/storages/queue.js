import { EventEmitter } from "events";

export class Queue extends EventEmitter {
  items = [];

  enqueue(item) {
    this.emit("enqueue", item);
    this.items.push(item);
  }

  dequeue() {
    this.emit("dequeue", this.peek());
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
