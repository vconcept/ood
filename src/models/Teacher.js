// src/models/Teacher.js
import { User } from './User';

export class Teacher extends User {
  constructor(userId, name, email, department) {
    super(userId, name, email);
    this._department = department;
    this._type = 'teacher';
  }

  getDepartment() { return this._department; }
  getType() { return this._type; }
  getBorrowingLimit() { return 10; }
  getLoanDuration() { return 30; } // 30 days

  toJSON() {
    return {
      userId: this._userId,
      name: this._name,
      email: this._email,
      department: this._department,
      type: this._type,
      borrowedBooks: this._borrowedBooks,
      notifications: this._notifications
    };
  }

  static fromJSON(data) {
    const teacher = new Teacher(data.userId, data.name, data.email, data.department);
    teacher._borrowedBooks = data.borrowedBooks || [];
    teacher._notifications = data.notifications || [];
    return teacher;
  }
}