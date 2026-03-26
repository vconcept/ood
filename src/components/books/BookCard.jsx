// src/components/books/BookCard.jsx
import React from 'react';

export const BookCard = ({ book, onBorrow, onReturn, currentUserId, isBorrowedByUser }) => {
  const isAvailable = book.isAvailable();
  const availableCopies = book.getAvailableCopies();
  const totalCopies = book.getTotalCopies();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{book.getTitle()}</h3>
          <p className="text-gray-600 text-sm">by {book.getAuthor()}</p>
          <p className="text-gray-500 text-xs mt-1">ISBN: {book.getIsbn()}</p>
          <p className="text-gray-500 text-xs">{book.getPublisher()} ({book.getYear()})</p>
        </div>
        <div className="text-right">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isAvailable ? `Available (${availableCopies}/${totalCopies})` : 'Borrowed'}
          </span>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end space-x-2">
        {currentUserId && !isBorrowedByUser && isAvailable && (
          <button
            onClick={() => onBorrow(book.getIsbn())}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm transition-colors"
          >
            Borrow
          </button>
        )}
        {currentUserId && isBorrowedByUser && (
          <button
            onClick={() => onReturn(book.getIsbn())}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm transition-colors"
          >
            Return
          </button>
        )}
      </div>
    </div>
  );
};