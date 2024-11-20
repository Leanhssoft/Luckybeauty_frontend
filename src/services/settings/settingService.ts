import http from '../httpService';
import { EmailSettingsEditDto } from './dto/EmailSettingsEditDto';

class SettingService {
    async getEmailSettings() {
        const response = await http.get('api/services/app/Settings/GetEmailSettings');
        return response.data.result;
    }
    async updateEmailSettings(input: EmailSettingsEditDto) {
        const response = await http.post('api/services/app/Settings/UpdateEmailSettings', input);
        return response.data.result;
    }
}
export default new SettingService();
