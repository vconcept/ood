// src/components/books/BookList.jsx
import React, { useState } from 'react';
import { BookCard } from './BookCard';

export const BookList = ({ books, onBorrow, onReturn, currentUserId, userBorrowedBooks = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.getTitle().toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.getAuthor().toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.getIsbn().includes(searchTerm);
    
    if (filter === 'available') return matchesSearch && book.isAvailable();
    if (filter === 'borrowed') return matchesSearch && !book.isAvailable();
    return matchesSearch;
  });

  const isBookBorrowedByUser = (isbn) => {
    return userBorrowedBooks.some(book => book.getIsbn() === isbn);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by title, author, or ISBN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Books</option>
          <option value="available">Available</option>
          <option value="borrowed">Borrowed</option>
        </select>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No books found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBooks.map(book => (
            <BookCard
              key={book.getIsbn()}
              book={book}
              onBorrow={onBorrow}
              onReturn={onReturn}
              currentUserId={currentUserId}
              isBorrowedByUser={isBookBorrowedByUser(book.getIsbn())}
            />
          ))}
        </div>
      )}
    </div>
  );
};