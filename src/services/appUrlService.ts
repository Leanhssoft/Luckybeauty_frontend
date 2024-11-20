import sessionStore from '../stores/sessionStore';

export class AppUrlService {
    static tenancyNamePlaceHolder = '{TENANCY_NAME}';
    get appRootUrl(): string {
        if (sessionStore.currentLogin.tenant) {
            return this.getAppRootUrlOfTenant(sessionStore.currentLogin.tenant.tenancyName);
        } else {
            return this.getAppRootUrlOfTenant();
        }
    }
    /**
     * Returning url ends with '/'.
     */
    getAppRootUrlOfTenant(tenancyName?: string): string {
        let baseUrl = this.ensureEndsWith(process.env.REACT_APP_APP_BASE_URL || '', '/');
        if (baseUrl.indexOf(AppUrlService.tenancyNamePlaceHolder) < 0) {
            return baseUrl;
        }

        if (baseUrl.indexOf(AppUrlService.tenancyNamePlaceHolder + '.') >= 0) {
            baseUrl = baseUrl.replace(AppUrlService.tenancyNamePlaceHolder + '.', AppUrlService.tenancyNamePlaceHolder);
            if (tenancyName) {
                tenancyName = tenancyName + '.';
            }
        }

        if (!tenancyName) {
            return baseUrl.replace(AppUrlService.tenancyNamePlaceHolder, '');
        }

        return baseUrl.replace(AppUrlService.tenancyNamePlaceHolder, tenancyName);
    }

    private ensureEndsWith(str: string, c: string) {
        if (str.charAt(str.length - 1) !== c) {
            str = str + c;
        }

        return str;
    }

    private removeFromEnd(str: string, c: string) {
        if (str.charAt(str.length - 1) === c) {
            str = str.substr(0, str.length - 1);
        }

        return str;
    }

    private removeFromStart(str: string, c: string) {
        if (str.charAt(0) === c) {
            str = str.substr(1, str.length - 1);
        }

        return str;
    }
}
