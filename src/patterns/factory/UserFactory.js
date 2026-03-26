// src/patterns/factory/UserFactory.js
import { Student } from '../../models/Student';
import { Teacher } from '../../models/Teacher';

export class UserFactory {
  static createUser(type, data) {
    switch (type.toLowerCase()) {
      case 'student':
        return new Student(
          data.userId || this.generateId(),
          data.name,
          data.email,
          data.studentId
        );
      case 'teacher':
        return new Teacher(
          data.userId || this.generateId(),
          data.name,
          data.email,
          data.department
        );
      default:
        throw new Error(`Invalid user type: ${type}`);
    }
  }

  static generateId() {
    return Math.random().toString(36).substr(2, 8);
  }
}