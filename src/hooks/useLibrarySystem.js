// src/hooks/useLibrarySystem.js
import { useState, useEffect, useCallback } from 'react';
import LibrarySystem from '../patterns/singleton/LibrarySystem';

export const useLibrarySystem = () => {
  const [library] = useState(() => LibrarySystem.getInstance());
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshData = useCallback(() => {
    setUsers(library.getAllUsers());
    setBooks(library.getAllBooks());
    setAvailableBooks(library.getAvailableBooks());
    setTransactions(library.getAllTransactions());
    setStats(library.getStats());
  }, [library]);

  useEffect(() => {
    refreshData();
  }, [refreshData, refreshTrigger]);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const addUser = useCallback((userData) => {
    const result = library.addUser(userData);
    if (result.success) triggerRefresh();
    return result;
  }, [library, triggerRefresh]);

  const addBook = useCallback((bookData) => {
    const result = library.addBook(bookData);
    if (result.success) triggerRefresh();
    return result;
  }, [library, triggerRefresh]);

  const borrowBook = useCallback((userId, isbn) => {
    const result = library.borrowBook(userId, isbn);
    if (result.success) triggerRefresh();
    return result;
  }, [library, triggerRefresh]);

  const returnBook = useCallback((userId, isbn) => {
    const result = library.returnBook(userId, isbn);
    if (result.success) triggerRefresh();
    return result;
  }, [library, triggerRefresh]);

  const searchBooks = useCallback((query) => {
    return library.searchBooks(query);
  }, [library]);

  const getUserBorrowedBooks = useCallback((userId) => {
    return library.getUserBorrowedBooks(userId);
  }, [library]);

  const getUserTransactions = useCallback((userId) => {
    return library.getUserTransactions(userId);
  }, [library]);

  const checkOverdueBooks = useCallback(() => {
    const overdue = library.checkOverdueBooks();
    triggerRefresh();
    return overdue;
  }, [library, triggerRefresh]);

  const getUserNotifications = useCallback((userId) => {
    return library.getUserNotifications(userId);
  }, [library]);

  const exportData = useCallback(() => {
    return library.exportData();
  }, [library]);

  const importData = useCallback((data) => {
    const result = library.importData(data);
    if (result.success) triggerRefresh();
    return result;
  }, [library, triggerRefresh]);

  return {
    // State
    users,
    books,
    availableBooks,
    transactions,
    stats,
    
    // Actions
    addUser,
    addBook,
    borrowBook,
    returnBook,
    searchBooks,
    getUserBorrowedBooks,
    getUserTransactions,
    checkOverdueBooks,
    getUserNotifications,
    exportData,
    importData,
    refreshData
  };
};