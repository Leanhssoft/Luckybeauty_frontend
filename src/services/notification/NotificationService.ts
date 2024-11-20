import { identity } from 'lodash';
import http from '../httpService';
import { GetNotificationsOutput } from './dto/GetNotificationsOutput';
import { GetUserNotificationsInput } from './dto/GetUserNotificationsInput';

class NotificationService {
    async GetNotifiationByCurrentUser(input: GetUserNotificationsInput): Promise<GetNotificationsOutput> {
        const response = await http.get('api/services/app/Notification/GetUserNotifications', {
            params: input
        });
        return response.data.result;
    }
    async SetAllNotificationsAsRead() {
        const response = await http.post('api/services/app/Notification/SetAllNotificationsAsRead');
        return response.data.result;
    }
    async SetNotificationAsRead(id: string) {
        const response = await http.post(`api/services/app/Notification/SetNotificationAsRead`, {
            id: id
        });
        return response.data.result;
    }
}
export default new NotificationService();
