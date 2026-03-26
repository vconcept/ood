class NotificationService {
  static notify(message) {
    console.log(`Notification: ${message}`);
    // In a real app, this could send emails, push notifications, etc.
  }

  static notifyBookBorrowed(user, book) {
    this.notify(`${user.name} borrowed "${book.title}"`);
  }

  static notifyBookReturned(user, book) {
    this.notify(`${user.name} returned "${book.title}"`);
  }
}

export default NotificationService;