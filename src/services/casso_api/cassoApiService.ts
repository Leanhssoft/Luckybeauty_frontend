import Cookies from 'js-cookie';

const key =
    'AK_CS.bceffca0175811ef9e7e3bff706c3b3e.h4biIHycQUb6PkS6j9UwA8PCtFiaqHdzOg9nHJvt6NZNBvFsQrWbURX6VnvMqnlm5BKz4haD';
const url = 'https://oauth.casso.vn/v2';

export class cassoApiService {
    GetUserInfo = async () => {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Apikey ${key}`);

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders
        };

        const response = await fetch(`${url}/userInfo`, requestOptions);
        const jsonData = await response.json();
        return jsonData.result;
    };
    GetBankAccount = async () => {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Apikey ${key}`);

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders
        };

        const response = await fetch(`${url}/accounts`, requestOptions);
        const jsonData = await response.json();
        return jsonData.result;
    };
    TaoWebhook = async () => {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Apikey ${key}`);
        myHeaders.append('Accept', `application/json`);
        myHeaders.append('Content-Type', `application/json`);

        const accToken = Cookies.get('Abp.AuthToken');
        // webhooks/id= 25214

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                income_only: true,
                secure_token: '0001',
                webhook: 'https://api.luckybeauty.vn/api/baokim-payment/webhook/transaction-notification'
            })
        };

        const response = await fetch(`${url}/webhooks`, requestOptions);
        const jsonData = await response.json();
        return jsonData.result;
    };
}

export default new cassoApiService();
