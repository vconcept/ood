// src/patterns/singleton/LibrarySystem.js
import { UserFactory } from '../factory/UserFactory';
import { NotificationService } from '../observer/NotificationService';
import { Book } from '../../models/Book';
import { BorrowTransaction } from '../../models/BorrowTransaction';

class LibrarySystem {
  static instance = null;

  constructor() {
    if (LibrarySystem.instance) {
      return LibrarySystem.instance;
    }
    
    this._users = new Map();
    this._books = new Map();
    this._transactions = [];
    this._notificationService = new NotificationService();
    
    LibrarySystem.instance = this;
  }

  static getInstance() {
    if (!LibrarySystem.instance) {
      LibrarySystem.instance = new LibrarySystem();
    }
    return LibrarySystem.instance;
  }

  // User Management
  addUser(userData) {
    try {
      const user = UserFactory.createUser(userData.type, userData);
      this._users.set(user.getUserId(), user);
      this._notificationService.attach(user);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getUser(userId) {
    return this._users.get(userId);
  }

  getAllUsers() {
    return Array.from(this._users.values());
  }

  // Book Management
  addBook(bookData) {
    const existingBook = this._books.get(bookData.isbn);
    if (existingBook) {
      // Update existing book with new copies
      const newTotal = existingBook.getTotalCopies() + (bookData.totalCopies || 1);
      const updatedBook = new Book(
        bookData.isbn,
        bookData.title,
        bookData.author,
        bookData.publisher,
        bookData.year,
        newTotal
      );
      this._books.set(bookData.isbn, updatedBook);
      return { success: true, book: updatedBook };
    }

    const book = new Book(
      bookData.isbn,
      bookData.title,
      bookData.author,
      bookData.publisher,
      bookData.year,
      bookData.totalCopies || 1
    );
    this._books.set(bookData.isbn, book);
    return { success: true, book };
  }

  getBook(isbn) {
    return this._books.get(isbn);
  }

  getAllBooks() {
    return Array.from(this._books.values());
  }

  getAvailableBooks() {
    return Array.from(this._books.values()).filter(book => book.isAvailable());
  }

  searchBooks(query) {
    query = query.toLowerCase();
    return Array.from(this._books.values()).filter(book =>
      book.getTitle().toLowerCase().includes(query) ||
      book.getAuthor().toLowerCase().includes(query) ||
      book.getIsbn().includes(query)
    );
  }

  // Borrowing Operations
  borrowBook(userId, isbn) {
    const user = this._users.get(userId);
    const book = this._books.get(isbn);

    if (!user) return { success: false, error: 'User not found' };
    if (!book) return { success: false, error: 'Book not found' };
    if (!book.isAvailable()) return { success: false, error: 'Book is not available' };
    if (!user.canBorrow()) return { success: false, error: 'User has reached borrowing limit' };

    // Perform borrowing
    if (book.borrowBook(userId) && user.borrowBook(isbn)) {
      const transaction = new BorrowTransaction(
        Date.now().toString(),
        userId,
        isbn,
        new Date(),
        new Date(Date.now() + user.getLoanDuration() * 24 * 60 * 60 * 1000)
      );
      this._transactions.push(transaction);
      
      return { 
        success: true, 
        transaction,
        dueDate: transaction.getDueDate()
      };
    }
    
    return { success: false, error: 'Failed to borrow book' };
  }

  returnBook(userId, isbn) {
    const user = this._users.get(userId);
    const book = this._books.get(isbn);

    if (!user) return { success: false, error: 'User not found' };
    if (!book) return { success: false, error: 'Book not found' };

    // Find active transaction
    const transaction = this._transactions.find(t =>
      t.getUserId() === userId &&
      t.getBookIsbn() === isbn &&
      !t.getReturnDate()
    );

    if (!transaction) {
      return { success: false, error: 'No active borrowing record found' };
    }

    // Perform return
    if (book.returnBook(userId) && user.returnBook(isbn)) {
      const fine = transaction.returnBook();
      return { success: true, fine, transaction };
    }

    return { success: false, error: 'Failed to return book' };
  }

  getUserBorrowedBooks(userId) {
    const user = this._users.get(userId);
    if (!user) return [];
    
    const borrowedIsbns = user.getBorrowedBooks();
    return borrowedIsbns.map(isbn => this._books.get(isbn)).filter(book => book);
  }

  getUserTransactions(userId) {
    return this._transactions.filter(t => t.getUserId() === userId);
  }

  getAllTransactions() {
    return this._transactions;
  }

  // Notifications and Overdue Checks
  checkOverdueBooks() {
    return this._notificationService.checkOverdueBooks(
      this._transactions,
      this.getAllUsers(),
      this.getAllBooks()
    );
  }

  getUserNotifications(userId) {
    const user = this._users.get(userId);
    return user ? user.getNotifications() : [];
  }

  // System Statistics
  getStats() {
    return {
      totalUsers: this._users.size,
      totalBooks: this._books.size,
      totalCopies: Array.from(this._books.values()).reduce((sum, book) => sum + book.getTotalCopies(), 0),
      availableBooks: Array.from(this._books.values()).reduce((sum, book) => sum + book.getAvailableCopies(), 0),
      activeLoans: this._transactions.filter(t => !t.getReturnDate()).length,
      overdueLoans: this._transactions.filter(t => t.isOverdue() && !t.getReturnDate()).length,
      totalTransactions: this._transactions.length
    };
  }

  // Data Persistence
  exportData() {
    return {
      users: this.getAllUsers().map(user => user.toJSON()),
      books: this.getAllBooks().map(book => book.toJSON()),
      transactions: this._transactions.map(t => t.toJSON())
    };
  }

  importData(data) {
    try {
      // Clear existing data
      this._users.clear();
      this._books.clear();
      this._transactions = [];

      // Import users
      data.users.forEach(userData => {
        const user = userData.type === 'student' 
          ? Student.fromJSON(userData)
          : Teacher.fromJSON(userData);
        this._users.set(user.getUserId(), user);
        this._notificationService.attach(user);
      });

      // Import books
      data.books.forEach(bookData => {
        const book = Book.fromJSON(bookData);
        this._books.set(book.getIsbn(), book);
      });

      // Import transactions
      data.transactions.forEach(transactionData => {
        const transaction = BorrowTransaction.fromJSON(transactionData);
        this._transactions.push(transaction);
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default LibrarySystem;