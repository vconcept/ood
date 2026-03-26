// src/patterns/observer/Observer.js
export class Observer {
  update(message) {
    throw new Error('Abstract method: update() must be implemented');
  }
}