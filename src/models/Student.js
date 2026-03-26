// src/models/Student.js
import { User } from './User';

export class Student extends User {
  constructor(userId, name, email, studentId) {
    super(userId, name, email);
    this._studentId = studentId;
    this._type = 'student';
  }

  getStudentId() { return this._studentId; }
  getType() { return this._type; }
  getBorrowingLimit() { return 5; }
  getLoanDuration() { return 14; } // 14 days

  toJSON() {
    return {
      userId: this._userId,
      name: this._name,
      email: this._email,
      studentId: this._studentId,
      type: this._type,
      borrowedBooks: this._borrowedBooks,
      notifications: this._notifications
    };
  }

  static fromJSON(data) {
    const student = new Student(data.userId, data.name, data.email, data.studentId);
    student._borrowedBooks = data.borrowedBooks || [];
    student._notifications = data.notifications || [];
    return student;
  }
}