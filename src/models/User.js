// src/models/User.js
export class User {
  constructor(userId, name, email) {
    this._userId = userId;
    this._name = name;
    this._email = email;
    this._borrowedBooks = [];
    this._notifications = [];
  }

  getUserId() { return this._userId; }
  getName() { return this._name; }
  getEmail() { return this._email; }
  getBorrowedBooks() { return [...this._borrowedBooks]; }
  getNotifications() { return [...this._notifications]; }

  canBorrow() {
    return this.getBorrowedBooks().length < this.getBorrowingLimit();
  }

  borrowBook(isbn) {
    if (this.canBorrow()) {
      this._borrowedBooks.push(isbn);
      return true;
    }
    return false;
  }

  returnBook(isbn) {
    const index = this._borrowedBooks.indexOf(isbn);
    if (index !== -1) {
      this._borrowedBooks.splice(index, 1);
      return true;
    }
    return false;
  }

  addNotification(message) {
    this._notifications.push({
      message,
      timestamp: new Date(),
      read: false
    });
  }

  // Abstract methods - to be overridden
  getBorrowingLimit() { throw new Error('Abstract method'); }
  getLoanDuration() { throw new Error('Abstract method'); }
}