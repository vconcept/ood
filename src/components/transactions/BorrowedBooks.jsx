// src/components/transactions/BorrowedBooks.jsx
import React from 'react';

export const BorrowedBooks = ({ user, books, onReturn }) => {
  const borrowedBooks = books;

  if (!user) {
    return <div className="text-center py-8 text-gray-500">Select a user to view borrowed books</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">{user.getName()}'s Borrowed Books</h3>
        <p className="text-gray-600 mb-4">
          {borrowedBooks.length} / {user.getBorrowingLimit()} books borrowed
        </p>
      </div>

      {borrowedBooks.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-white rounded-lg">
          No books borrowed
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {borrowedBooks.map(book => (
            <div key={book.getIsbn()} className="bg-white rounded-lg shadow-md p-4">
              <h4 className="font-semibold text-lg">{book.getTitle()}</h4>
              <p className="text-gray-600">by {book.getAuthor()}</p>
              <p className="text-gray-500 text-sm mt-1">ISBN: {book.getIsbn()}</p>
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
  );
};