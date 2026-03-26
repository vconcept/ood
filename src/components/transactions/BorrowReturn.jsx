// src/components/transactions/BorrowReturn.jsx
import React, { useState } from 'react';
import { BookList } from '../books/BookList';

export const BorrowReturn = ({ 
  users, 
  books, 
  availableBooks, 
  currentUserId, 
  setCurrentUserId,
  userBorrowedBooks,
  onBorrow, 
  onReturn 
}) => {
  const [selectedUserId, setSelectedUserId] = useState(currentUserId || '');
  const [showBorrowSection, setShowBorrowSection] = useState(true);

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    setCurrentUserId(userId);
    setShowBorrowSection(true);
  };

  const currentUser = users.find(u => u.getUserId() === selectedUserId);
  const borrowedBooks = userBorrowedBooks;

  return (
    <div className="space-y-6">
      {/* User Selection */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Select User</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {users.map(user => (
            <button
              key={user.getUserId()}
              onClick={() => handleUserSelect(user.getUserId())}
              className={`p-3 text-left rounded-lg transition-colors ${
                selectedUserId === user.getUserId()
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div className="font-semibold">{user.getName()}</div>
              <div className="text-sm opacity-75">{user.getEmail()}</div>
              <div className="text-xs mt-1">
                {user.getBorrowedBooks().length}/{user.getBorrowingLimit()} books
              </div>
            </button>
          ))}
        </div>
      </div>

      {currentUser && (
        <>
          {/* Borrow/Return Tabs */}
          <div className="flex space-x-2 border-b">
            <button
              onClick={() => setShowBorrowSection(true)}
              className={`px-4 py-2 font-semibold ${
                showBorrowSection
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Borrow Books
            </button>
            <button
              onClick={() => setShowBorrowSection(false)}
              className={`px-4 py-2 font-semibold ${
                !showBorrowSection
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Return Books ({borrowedBooks.length})
            </button>
          </div>

          {/* Borrow Section */}
          {showBorrowSection && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Available Books</h3>
              <BookList
                books={availableBooks}
                onBorrow={onBorrow}
                onReturn={onReturn}
                currentUserId={selectedUserId}
                userBorrowedBooks={borrowedBooks}
              />
            </div>
          )}

          {/* Return Section */}
          {!showBorrowSection && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Currently Borrowed Books</h3>
              {borrowedBooks.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-white rounded-lg">
                  No books borrowed
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {borrowedBooks.map(book => (
                    <div key={book.getIsbn()} className="bg-white rounded-lg shadow-md p-4">
                      <h4 className="font-semibold">{book.getTitle()}</h4>
                      <p className="text-gray-600 text-sm">by {book.getAuthor()}</p>
                      <button
                        onClick={() => onReturn(book.getIsbn())}
                        className="mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
                      >
                        Return Book
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};