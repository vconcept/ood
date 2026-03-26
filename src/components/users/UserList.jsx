// src/components/users/UserList.jsx
import React, { useState } from 'react';
import { UserCard } from './UserCard';

export const UserList = ({ users, onViewBooks, selectedUserId, onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.getName().toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.getEmail().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No users found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map(user => (
            <UserCard
              key={user.getUserId()}
              user={user}
              onViewBooks={onViewBooks}
              isSelected={selectedUserId === user.getUserId()}
              onSelect={onSelectUser}
            />
          ))}
        </div>
      )}
    </div>
  );
};