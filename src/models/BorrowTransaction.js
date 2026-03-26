// src/models/BorrowTransaction.js
export class BorrowTransaction {
  constructor(transactionId, userId, bookIsbn, borrowDate, dueDate) {
    this._transactionId = transactionId;
    this._userId = userId;
    this._bookIsbn = bookIsbn;
    this._borrowDate = borrowDate || new Date();
    this._dueDate = dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    this._returnDate = null;
    this._fine = 0;
  }

  getTransactionId() { return this._transactionId; }
  getUserId() { return this._userId; }
  getBookIsbn() { return this._bookIsbn; }
  getBorrowDate() { return new Date(this._borrowDate); }
  getDueDate() { return new Date(this._dueDate); }
  getReturnDate() { return this._returnDate ? new Date(this._returnDate) : null; }
  getFine() { return this._fine; }

  isOverdue() {
    if (this._returnDate) return false;
    return new Date() > new Date(this._dueDate);
  }

  calculateFine(finePerDay = 0.5) {
    if (!this.isOverdue()) return 0;
    const daysOverdue = Math.floor((new Date() - new Date(this._dueDate)) / (1000 * 60 * 60 * 24));
    this._fine = daysOverdue * finePerDay;
    return this._fine;
  }

  returnBook() {
    this._returnDate = new Date();
    return this.calculateFine();
  }

  toJSON() {
    return {
      transactionId: this._transactionId,
      userId: this._userId,
      bookIsbn: this._bookIsbn,
      borrowDate: this._borrowDate.toISOString(),
      dueDate: this._dueDate.toISOString(),
      returnDate: this._returnDate ? this._returnDate.toISOString() : null,
      fine: this._fine
    };
  }

  static fromJSON(data) {
    const transaction = new BorrowTransaction(
      data.transactionId,
      data.userId,
      data.bookIsbn,
      new Date(data.borrowDate),
      new Date(data.dueDate)
    );
    transaction._returnDate = data.returnDate ? new Date(data.returnDate) : null;
    transaction._fine = data.fine || 0;
    return transaction;
  }
}