// src/patterns/observer/NotificationService.js
import { Observer } from './Observer';

export class NotificationService extends Observer {
  constructor() {
    super();
    this._observers = [];
  }

  attach(observer) {
    if (!this._observers.includes(observer)) {
      this._observers.push(observer);
    }
  }

  detach(observer) {
    const index = this._observers.indexOf(observer);
    if (index !== -1) {
      this._observers.splice(index, 1);
    }
  }

  notify(message, data = null) {
    this._observers.forEach(observer => {
      if (observer.addNotification) {
        observer.addNotification(message);
      }
      if (observer.update) {
        observer.update(message, data);
      }
    });
  }

  update(message, data) {
    this.notify(message, data);
  }

  checkOverdueBooks(transactions, users, books) {
    const overdueTransactions = transactions.filter(t => t.isOverdue() && !t.getReturnDate());
    
    overdueTransactions.forEach(transaction => {
      const user = users.find(u => u.getUserId() === transaction.getUserId());
      const book = books.find(b => b.getIsbn() === transaction.getBookIsbn());
      
      if (user && book) {
        const fine = transaction.calculateFine(
          user.getType() === 'student' ? 0.5 : 1.0
        );
        const message = `⚠️ BOOK OVERDUE: "${book.getTitle()}" was due on ${transaction.getDueDate().toLocaleDateString()}. Fine: $${fine.toFixed(2)}`;
        this.notify(message, { transaction, user, book, fine });
      }
    });
    
    return overdueTransactions;
  }
}