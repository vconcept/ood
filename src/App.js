// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useLibrarySystem } from './hooks/useLibrarySystem';
import { Navbar } from './components/common/Navbar';
import { Notification } from './components/common/Notification';
import { BookList } from './components/books/BookList';
import { BookForm } from './components/books/BookForm';
import { UserList } from './components/users/UserList';
import { UserForm } from './components/users/UserForm';
import { BorrowReturn } from './components/transactions/BorrowReturn';
import { BorrowedBooks } from './components/transactions/BorrowedBooks';

function App() {
  const {
    users,
    books,
    availableBooks,
    transactions,
    stats,
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
    importData
  } = useLibrarySystem();

  const [currentUserId, setCurrentUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showBookForm, setShowBookForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [viewingBooksUserId, setViewingBooksUserId] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleAddUser = (userData) => {
    const result = addUser(userData);
    if (result.success) {
      setShowUserForm(false);
      showNotification(`User ${userData.name} added successfully!`, 'success');
    } else {
      showNotification(`Failed to add user: ${result.error}`, 'error');
    }
  };

  const handleAddBook = (bookData) => {
    const result = addBook(bookData);
    if (result.success) {
      setShowBookForm(false);
      showNotification(`Book "${bookData.title}" added successfully!`, 'success');
    } else {
      showNotification(`Failed to add book: ${result.error}`, 'error');
    }
  };

  const handleBorrow = (isbn) => {
    if (!currentUserId) {
      showNotification('Please select a user first', 'warning');
      return;
    }
    const result = borrowBook(currentUserId, isbn);
    if (result.success) {
      showNotification(`Book borrowed successfully! Due date: ${result.dueDate.toLocaleDateString()}`, 'success');
    } else {
      showNotification(`Failed to borrow: ${result.error}`, 'error');
    }
  };

  const handleReturn = (isbn) => {
    if (!currentUserId) {
      showNotification('Please select a user first', 'warning');
      return;
    }
    const result = returnBook(currentUserId, isbn);
    if (result.success) {
      if (result.fine > 0) {
        showNotification(`Book returned with fine: $${result.fine.toFixed(2)}`, 'warning');
      } else {
        showNotification('Book returned successfully!', 'success');
      }
    } else {
      showNotification(`Failed to return: ${result.error}`, 'error');
    }
  };

  const handleCheckOverdue = () => {
    const overdue = checkOverdueBooks();
    if (overdue.length === 0) {
      showNotification('No overdue books found!', 'success');
    } else {
      showNotification(`Found ${overdue.length} overdue book(s). Notifications sent!`, 'warning');
    }
  };

  const currentUserBorrowedBooks = currentUserId 
    ? getUserBorrowedBooks(currentUserId)
    : [];

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <div className="container mx-auto px-4 py-8">
          <Routes>
            {/* Dashboard */}
            <Route path="/" element={
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-3xl mb-2">📚</div>
                    <div className="text-2xl font-bold">{stats.totalBooks || 0}</div>
                    <div className="text-gray-600">Total Books</div>
                    <div className="text-sm text-green-600">{stats.availableBooks || 0} available</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-3xl mb-2">👥</div>
                    <div className="text-2xl font-bold">{stats.totalUsers || 0}</div>
                    <div className="text-gray-600">Total Users</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-3xl mb-2">🔄</div>
                    <div className="text-2xl font-bold">{stats.activeLoans || 0}</div>
                    <div className="text-gray-600">Active Loans</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-3xl mb-2">⚠️</div>
                    <div className="text-2xl font-bold">{stats.overdueLoans || 0}</div>
                    <div className="text-gray-600">Overdue Books</div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowUserForm(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Add User
                    </button>
                    <button
                      onClick={() => setShowBookForm(true)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Add Book
                    </button>
                    <button
                      onClick={handleCheckOverdue}
                      className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Check Overdue
                    </button>
                  </div>
                </div>

                {showUserForm && (
                  <UserForm
                    onSubmit={handleAddUser}
                    onCancel={() => setShowUserForm(false)}
                  />
                )}

                {showBookForm && (
                  <BookForm
                    onSubmit={handleAddBook}
                    onCancel={() => setShowBookForm(false)}
                  />
                )}
              </div>
            } />

            {/* Books Page */}
            <Route path="/books" element={
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold text-gray-800">Books</h1>
                  <button
                    onClick={() => setShowBookForm(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    + Add Book
                  </button>
                </div>
                <BookList
                  books={books}
                  onBorrow={handleBorrow}
                  onReturn={handleReturn}
                  currentUserId={currentUserId}
                  userBorrowedBooks={currentUserBorrowedBooks}
                />
                {showBookForm && (
                  <BookForm
                    onSubmit={handleAddBook}
                    onCancel={() => setShowBookForm(false)}
                  />
                )}
              </div>
            } />

            {/* Users Page */}
            <Route path="/users" element={
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold text-gray-800">Users</h1>
                  <button
                    onClick={() => setShowUserForm(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    + Add User
                  </button>
                </div>
                <UserList
                  users={users}
                  onViewBooks={setViewingBooksUserId}
                  selectedUserId={selectedUserId}
                  onSelectUser={setSelectedUserId}
                />
                {showUserForm && (
                  <UserForm
                    onSubmit={handleAddUser}
                    onCancel={() => setShowUserForm(false)}
                  />
                )}
                {viewingBooksUserId && (
                  <div className="mt-6">
                    <BorrowedBooks
                      user={users.find(u => u.getUserId() === viewingBooksUserId)}
                      books={getUserBorrowedBooks(viewingBooksUserId)}
                      onReturn={handleReturn}
                    />
                  </div>
                )}
              </div>
            } />

            {/* Borrow/Return Page */}
            <Route path="/borrow-return" element={
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Borrow/Return Books</h1>
                <BorrowReturn
                  users={users}
                  books={books}
                  availableBooks={availableBooks}
                  currentUserId={currentUserId}
                  setCurrentUserId={setCurrentUserId}
                  userBorrowedBooks={currentUserBorrowedBooks}
                  onBorrow={handleBorrow}
                  onReturn={handleReturn}
                />
              </div>
            } />

            {/* Transactions Page */}
            <Route path="/transactions" element={
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Transactions</h1>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrow Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fine</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {transactions.map(transaction => {
                        const user = users.find(u => u.getUserId() === transaction.getUserId());
                        const book = books.find(b => b.getIsbn() === transaction.getBookIsbn());
                        const isOverdue = transaction.isOverdue();
                        const isReturned = transaction.getReturnDate();
                        
                        return (
                          <tr key={transaction.getTransactionId()} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">{transaction.getTransactionId()}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{user?.getName() || 'Unknown'}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{book?.getTitle() || 'Unknown'}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{transaction.getBorrowDate().toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{transaction.getDueDate().toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {isReturned ? transaction.getReturnDate().toLocaleDateString() : '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {transaction.getFine() > 0 ? `$${transaction.getFine().toFixed(2)}` : '-'}
                            </td>
                            <td className="px-6 py-4">
                              {!isReturned && isOverdue ? (
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Overdue</span>
                              ) : !isReturned ? (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Active</span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">Returned</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {transactions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No transactions yet</div>
                  )}
                </div>
              </div>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;