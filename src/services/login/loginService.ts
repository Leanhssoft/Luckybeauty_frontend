import '../../lib/abp.js';
import Cookies from 'js-cookie';
import LoginModel from '../../models/Login/loginModel';
import http from '../httpService';
import sessionStore from '../../stores/sessionStore';
import IsTenantAvaibleOutput from '../account/dto/isTenantAvailableOutput';
import TenantAvailabilityState from '../account/dto/tenantAvailabilityState';
import { LoginResult } from './dto/LoginResult.js';
class LoginService {
    public async CheckTenant(tenantName: string): Promise<IsTenantAvaibleOutput> {
        //const tenancy = tenantName || 'default';
        if (tenantName === '') {
            Cookies.remove('TenantName');
            return {
                state: TenantAvailabilityState.Available,
                tenantId: 0
            };
        }

        const result = await http.post('api/services/app/Account/IsTenantAvailable', {
            tenancyName: tenantName
        });

        if (result.data.result['state'] === 1) {
            Cookies.set('TenantName', tenantName, {
                expires: 365
            });
        }

        return result.data.result;
    }

    async Login(loginModel: LoginModel): Promise<LoginResult> {
        const checkTenant = await this.CheckTenant(loginModel.tenancyName);
        if (checkTenant.state !== 1) {
            return {
                success: false,
                message: 'Tenant không tồn tại hoặc đã hết hạn!'
            };
        }
        const requestBody = {
            userNameOrEmailAddress: loginModel.userNameOrEmailAddress,
            password: loginModel.password,
            rememberClient: loginModel.rememberMe
        };

        const apiResult = await http.post('/api/TokenAuth/Authenticate', requestBody, {
            headers: {
                'Abp.TenantId':
                    checkTenant.tenantId === 0 || checkTenant.tenantId === null ? 'null' : checkTenant.tenantId,
                'Content-Type': 'application/json'
            }
        });
        const tokenExpireDate = loginModel.rememberMe
            ? new Date(new Date().getTime() + 1000 * apiResult.data.result.expireInSeconds)
            : undefined;
        if (checkTenant.tenantId !== 0) {
            loginModel.rememberMe
                ? Cookies.set('Abp.TenantId', checkTenant.tenantId.toString(), { expires: tokenExpireDate })
                : Cookies.set('Abp.TenantId', checkTenant.tenantId.toString());
        }
        loginModel.rememberMe
            ? Cookies.set('isRememberMe', 'true', { expires: tokenExpireDate })
            : Cookies.set('isRememberMe', 'false');
        Cookies.set('Abp.AuthToken', apiResult.data.result['accessToken'], {
            expires: tokenExpireDate
        });
        Cookies.set('refreshToken', apiResult.data.result['refreshToken'], {
            expires: tokenExpireDate
        });
        Cookies.set('authenticated', apiResult.data.success, {
            expires: tokenExpireDate
        });
        const sessionResult = await sessionStore.getCurrentLoginInformations();
        Cookies.set('userId', sessionResult.user.id.toString(), {
            expires: tokenExpireDate
        });
        if (sessionResult.user.nhanSuId) {
            Cookies.set('IdNhanVien', sessionResult.user.nhanSuId, {
                expires: tokenExpireDate
            });
        }

        Cookies.set('fullname', sessionResult.user.fullName, {
            expires: tokenExpireDate
        });
        Cookies.set('email', sessionResult.user.emailAddress, {
            expires: tokenExpireDate
        });
        if (sessionResult.user.avatar) {
            Cookies.set('avatar', sessionResult.user.avatar, {
                expires: tokenExpireDate
            });
        }
        if (sessionResult.user.idChiNhanhMacDinh) {
            Cookies.set('idChiNhanhMacDinh', apiResult.data.result['idChiNhanhMacDinh'], {
                expires: tokenExpireDate
            });
        }

        await this.GetPermissionByUserId(sessionResult.user.id, loginModel.rememberMe);

        return {
            success: apiResult.data.success,
            message: 'Đăng nhập thành công!'
        };
    }
    async GetPermissionByUserId(userId: number, isRemember: boolean) {
        const response = await http.post(`api/services/app/Permission/GetAllPermissionByRole?UserId=${userId}`);
        const tokenExpireDate = isRemember === true ? new Date(new Date().getTime() + 1000 * 86400) : undefined;
        const item = {
            value: response.data.result['permissions'],
            expiry: tokenExpireDate
        };
        localStorage.setItem('permissions', JSON.stringify(item));
        return response.data.result;
    }
}
export default new LoginService();
