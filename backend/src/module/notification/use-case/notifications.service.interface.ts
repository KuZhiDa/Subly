export interface INotificationService {
  getEmits(userId: string);
  getNotifications(userId: string);
  readNotifications(userId: string, notifications: string[]);
  deleteNotifications(userId: string, notifications: string[]);
}
