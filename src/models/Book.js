// src/models/Book.js
export class Book {
  constructor(isbn, title, author, publisher, year, totalCopies = 1) {
    this._isbn = isbn;
    this._title = title;
    this._author = author;
    this._publisher = publisher;
    this._year = year;
    this._totalCopies = totalCopies;
    this._availableCopies = totalCopies;
    this._borrowedBy = [];
  }

  getIsbn() { return this._isbn; }
  getTitle() { return this._title; }
  getAuthor() { return this._author; }
  getPublisher() { return this._publisher; }
  getYear() { return this._year; }
  getTotalCopies() { return this._totalCopies; }
  getAvailableCopies() { return this._availableCopies; }
  isAvailable() { return this._availableCopies > 0; }

  borrowBook(userId) {
    if (this.isAvailable()) {
      this._availableCopies--;
      this._borrowedBy.push(userId);
      return true;
    }
    return false;
  }

  returnBook(userId) {
    const index = this._borrowedBy.indexOf(userId);
    if (index !== -1) {
      this._borrowedBy.splice(index, 1);
      this._availableCopies++;
      return true;
    }
    return false;
  }

  toJSON() {
    return {
      isbn: this._isbn,
      title: this._title,
      author: this._author,
      publisher: this._publisher,
      year: this._year,
      totalCopies: this._totalCopies,
      availableCopies: this._availableCopies,
      borrowedBy: this._borrowedBy
    };
  }

  static fromJSON(data) {
    const book = new Book(data.isbn, data.title, data.author, data.publisher, data.year, data.totalCopies);
    book._availableCopies = data.availableCopies;
    book._borrowedBy = data.borrowedBy || [];
    return book;
  }
}