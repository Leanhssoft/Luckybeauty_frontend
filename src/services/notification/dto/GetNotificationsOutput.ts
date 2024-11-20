import { UserNotification } from './UserNotificationDto';

export interface GetNotificationsOutput {
    unreadCount: number;
    totalCount: number;
    items: UserNotification[];
}
