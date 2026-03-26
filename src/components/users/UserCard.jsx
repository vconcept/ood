// src/components/users/UserCard.jsx
import React from 'react';

export const UserCard = ({ user, onViewBooks, isSelected, onSelect }) => {
  const borrowedCount = user.getBorrowedBooks().length;
  const limit = user.getBorrowingLimit();

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-4 border-2 transition-all cursor-pointer ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:shadow-lg'
      }`}
      onClick={() => onSelect(user.getUserId())}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{user.getName()}</h3>
          <p className="text-gray-600 text-sm">{user.getEmail()}</p>
          <p className="text-gray-500 text-xs mt-1">
            {user.getType() === 'student' ? '🎓 Student' : '👨‍🏫 Teacher'}
          </p>
          {user.getType() === 'student' ? (
            <p className="text-gray-500 text-xs">ID: {user.getStudentId()}</p>
          ) : (
            <p className="text-gray-500 text-xs">Dept: {user.getDepartment()}</p>
          )}
        </div>
        <div className="text-right">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            borrowedCount < limit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {borrowedCount}/{limit} Books
          </span>
        </div>
      </div>
      
      <div className="mt-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewBooks(user.getUserId());
          }}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          View Borrowed Books →
        </button>
      </div>
    </div>
  );
};