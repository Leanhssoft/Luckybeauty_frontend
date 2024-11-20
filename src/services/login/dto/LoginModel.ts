export default class LoginModel {
    tenantName: string;
    userNameOrEmailAddress: string;
    password: string;
    rememberClient: boolean;
    constructor(tenant: string, userName: string, password: string, rememberMe: boolean) {
        this.tenantName = tenant;
        this.userNameOrEmailAddress = userName;
        this.password = password;
        this.rememberClient = rememberMe;
    }
}
