import UserNotificationState from '../../../enum/UserNotificationState';

export interface GetUserNotificationsInput {
    state?: UserNotificationState | null;
    startDate?: Date | null;
    endDate?: Date | null;
    skipCount: number;
    maxResultCount: number;
}
