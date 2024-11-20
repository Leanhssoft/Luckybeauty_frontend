import { GetCurrentLoginInformations } from './dto/getCurrentLoginInformations';
import http from '../httpService';

class SessionService {
    public async getCurrentLoginInformations(): Promise<GetCurrentLoginInformations> {
        const result = await http.get(
            'api/services/app/Session/GetCurrentLoginInformations'
            // {
            // headers: {
            //     'Abp.TenantId': Cookies.get('Abp.TenantId')
            // }
            //}
        );

        return result.data.result;
    }
}

export default new SessionService();
