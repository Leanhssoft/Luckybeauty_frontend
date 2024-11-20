import Cookies from 'js-cookie';
import accountService from '../account/accountService';
import authenticationStore from '../../stores/authenticationStore';
import sessionStore from '../../stores/sessionStore';
import tokenAuthService from '../tokenAuth/tokenAuthService';
import loginService from '../login/loginService';
export const Impersonation = 'IsImpersonation';
class ImpersonationService {
    public async impersonate(userId: number, tenantId?: number) {
        accountService
            .impersonate({ tenantId: tenantId, userId: userId })
            .then(async (response) => {
                await authenticationStore.LogoutForImpersonate();
                const impersonateTenantResult = tokenAuthService.ImpersonatedAuthenticate(response.impersonationToken);
                impersonateTenantResult
                    .then((res) => {
                        Cookies.set('Abp.AuthToken', res.accessToken, { expires: 1 });
                        Cookies.set('encryptedAccessToken', res.encryptedAccessToken, { expires: 1 });
                        Cookies.set('refreshToken', res.refreshToken, { expires: 365 });
                        Cookies.set('authenticated', 'true', { expires: 1 });
                        if (tenantId) {
                            Cookies.set('Abp.TenantId', tenantId.toString(), { expires: 1 });
                        }
                        Cookies.set(Impersonation, 'true', { expires: 1 });
                        sessionStore.getCurrentLoginInformations().then(async (result) => {
                            Cookies.set('TenantName', result.tenant.tenancyName, {
                                expires: 1
                            });
                            Cookies.set('userId', result.user.id.toString(), {
                                expires: 1
                            });
                            if (result.user.nhanSuId) {
                                Cookies.set('IdNhanVien', result.user.nhanSuId, {
                                    expires: 1
                                });
                            }

                            Cookies.set('fullname', result.user.fullName, {
                                expires: 1
                            });
                            Cookies.set('email', result.user.emailAddress, {
                                expires: 1
                            });
                            if (result.user.avatar) {
                                Cookies.set('avatar', result.user.avatar, {
                                    expires: 1
                                });
                            }
                            await loginService.GetPermissionByUserId(result.user.id, true);
                            // Tải lại trang và chuyển hướng đến trang chủ
                            window.location.href = '/';
                        });
                    })
                    .catch((ex) => console.log(ex));
            })
            .catch((ex) => {
                console.log(ex);
            })
            .catch((ex) => console.log(ex));
    }

    public backToImpersonate() {
        accountService
            .backToImpersonator()
            .then(async (response) => {
                await authenticationStore.LogoutForImpersonate();
                const impersonateTenantResult = await tokenAuthService.ImpersonatedAuthenticate(
                    response.impersonationToken
                );
                Cookies.set('Abp.AuthToken', impersonateTenantResult.accessToken, { expires: 1 });
                Cookies.set('encryptedAccessToken', impersonateTenantResult.encryptedAccessToken, { expires: 1 });
                Cookies.set('refreshToken', impersonateTenantResult.encryptedAccessToken, { expires: 365 });
                Cookies.set('authenticated', 'true', { expires: 1 });
                await sessionStore.getCurrentLoginInformations().then(async (result) => {
                    Cookies.set('userId', result.user.id.toString(), {
                        expires: 1
                    });
                    if (result.user.nhanSuId) {
                        Cookies.set('IdNhanVien', result.user.nhanSuId, {
                            expires: 1
                        });
                    }

                    Cookies.set('fullname', result.user.fullName, {
                        expires: 1
                    });
                    Cookies.set('email', result.user.emailAddress, {
                        expires: 1
                    });
                    if (result.user.avatar) {
                        Cookies.set('avatar', result.user.avatar, {
                            expires: 1
                        });
                    }
                    await loginService.GetPermissionByUserId(result.user.id, true);
                    // Tải lại trang và chuyển hướng đến trang chủ
                    window.location.href = '/';
                });
            })
            .catch((ex) => {
                console.log(ex);
            })
            .catch((ex) => console.log(ex));
    }
}
export default new ImpersonationService();
