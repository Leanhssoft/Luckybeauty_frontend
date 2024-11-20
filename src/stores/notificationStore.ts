import { makeAutoObservable } from 'mobx';
import { GetNotificationsOutput } from '../services/notification/dto/GetNotificationsOutput';
import { GetUserNotificationsInput } from '../services/notification/dto/GetUserNotificationsInput';
import NotificationService from '../services/notification/NotificationService';
import * as signalR from '@microsoft/signalr';
class NotificationStore {
    idNotification!: string;
    notifications!: GetNotificationsOutput;
    getNotificationInput!: GetUserNotificationsInput;
    notificationHubConnection!: signalR.HubConnection | null;
    maxResultCountNotification!: number;
    skipCountNotification!: number;
    constructor() {
        this.maxResultCountNotification = 5;
        this.skipCountNotification = 0;
        this.getNotificationInput = {
            maxResultCount: this.maxResultCountNotification,
            skipCount: this.skipCountNotification
        };
        this.createHubConnection();
        makeAutoObservable(this);
    }
    createHubConnection = async () => {
        if (!this.notificationHubConnection) {
            const newNotificationConnection = new signalR.HubConnectionBuilder()
                .withUrl(process.env.REACT_APP_REMOTE_SERVICE_BASE_URL + 'notifications') // Adjust the hub URL here
                .build();
            try {
                await newNotificationConnection.start();
                console.log('SignalR notification connected');
                this.notificationHubConnection = newNotificationConnection;
                newNotificationConnection.on('ReceiveNotification', this.handleReceivedNotification);
            } catch (e) {
                console.error('SignalR connection error: ', e);
            }
        }
    };

    handleReceivedNotification = async () => {
        await this.GetUserNotification();
    };
    async GetUserNotification() {
        this.getNotificationInput.maxResultCount = this.maxResultCountNotification;
        this.getNotificationInput.skipCount = this.skipCountNotification;
        const data = await NotificationService.GetNotifiationByCurrentUser(this.getNotificationInput);
        this.notifications = data;
    }
    async setAllNotificationAsRead() {
        await NotificationService.SetAllNotificationsAsRead();
        await this.GetUserNotification();
    }
}
export default NotificationStore;
