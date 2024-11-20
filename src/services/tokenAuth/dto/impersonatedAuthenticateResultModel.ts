export interface ImpersonatedAuthenticateResultModel {
    accessToken: string;
    refreshToken: string;
    encryptedAccessToken: string;
    expireInSeconds: number;
}
