import { makeAutoObservable } from 'mobx';

// import AppConsts from './../lib/appconst'
import LoginModel from '../models/Login/loginModel';
import tokenAuthService from '../services/tokenAuth/tokenAuthService';
import Cookies from 'js-cookie';
import { AuthenticationResultModel } from '../services/tokenAuth/dto/authenticationResultModel';
import loginService from '../services/login/loginService';
import http from '../services/httpService';

//declare let abp: any

class AuthenticationStore {
    loginModel: LoginModel = new LoginModel();
    loginResultModel!: AuthenticationResultModel;
    get isAuthenticated(): boolean {
        if (!Cookies.get('userId')) {
            return false;
        }

        return true;
    }

    public async login(model: LoginModel, tenantName: string) {
        await loginService.CheckTenant(tenantName);
        const LoginResult = await tokenAuthService.authenticate({
            userNameOrEmailAddress: model.userNameOrEmailAddress,
            password: model.password,
            rememberClient: model.rememberMe
        });
        this.loginResultModel = LoginResult;
        const tokenExpireDate = model.rememberMe
            ? new Date(new Date().getTime() + 1000 * LoginResult.expireInSeconds)
            : undefined;
        Cookies.set('Abp.AuthToken', LoginResult.accessToken, { expires: tokenExpireDate });
        Cookies.set('encryptedAccessToken', LoginResult.encryptedAccessToken, {
            expires: tokenExpireDate,
            path: '/'
        });
        Cookies.set('userId', LoginResult.userId.toString(), {
            expires: tokenExpireDate
        });
        Cookies.set('IdNhanVien', LoginResult.idNhanVien, {
            expires: tokenExpireDate
        });
        model.rememberMe
            ? Cookies.set('isRememberMe', 'true', { expires: tokenExpireDate })
            : Cookies.set('isRememberMe', 'false');
    }
    logout() {
        localStorage.clear();
        sessionStorage.clear();
        // get an array of all cookie names
        Object.keys(Cookies.get()).forEach((cookieName) => {
            if (cookieName !== 'TenantName') {
                Cookies.remove(cookieName);
            }
        });

        window.location.href = '/login';
    }
    async LogoutForImpersonate() {
        await http
            .get('api/TokenAuth/LogOut', {
                headers: {
                    'Abp.TenantId': Cookies.get('Abp.TenantId'),
                    Authorization: 'Bearer ' + Cookies.get('Abp.AuthToken')
                }
            })
            .then((result) => {
                localStorage.clear();
                sessionStorage.clear();
                //get an array of all cookie names
                Object.keys(Cookies.get()).forEach((cookieName) => {
                    this.handleDeleteCookie(cookieName);
                });
            })
            .catch((ex) => console.error(ex));
    }
    handleDeleteCookie(cookieName: string) {
        // Đặt ngày hết hạn của cookie thành một thời gian trong quá khứ
        document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        // Kiểm tra xem cookie đã được xóa thành công hay không
        if (Cookies.get(cookieName) === undefined) {
            console.log(`Cookie ${cookieName} đã được xóa.`);
        } else {
            console.log(`Xóa cookie ${cookieName} thất bại.`);
        }
    }
    constructor() {
        makeAutoObservable(this);
    }
}
export default new AuthenticationStore();
