export interface AuthenticationResultModel {
    accessToken: string;
    encryptedAccessToken: string;
    expireInSeconds: number;
    userId: number;
    idNhanVien: string;
    fullName: string;
    avatar: string;
    email: string;
}
