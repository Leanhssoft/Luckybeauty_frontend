export interface UserNotification {
    id: string;
    tenantId?: number;
    userId: number;
    state: number;
    url: string;
    notification: NotificationData;
}
interface NotificationData {
    id: string;
    severity: number;
    notificationName: string;
    content: string;
    creationTime: Date;
}
