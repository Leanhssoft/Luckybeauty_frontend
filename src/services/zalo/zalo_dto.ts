import { Guid } from 'guid-typescript';
import { ICustomerBasic } from '../khach-hang/dto/CustomerBasicDto';

export interface IZaloResultMessage<T> {
    error: number;
    message: string;
    data: T;
}

export interface IZaloDataMessage {
    message_id: string;
    user_id?: string;
}

// dto lien quan den DB --
export interface IZalo_InforHoaDon {
    id: string;
    idKhachHang: string;
    maHoaDon: string;
    ngayLapHoaDon: string;
    tongTienHang: number;
}

export class PageResultCustomerCareOA {
    total!: number;
    followers!: [];
}

export interface InforZOA {
    oaid: string;
    name: string;
    description: string;
    oa_alias: string;
    oa_type: string;
    num_follower: string;
    avatar: string;
    package_valid_through_date: string;
    package_auto_renew_date: string;
    linked_ZCA: string;
}
export interface IInforUserZOA extends ICustomerBasic {
    avatar?: string;
    display_name?: string;
    user_gender?: number;
    user_id?: string;
    user_id_by_app?: string;
    user_is_follower?: boolean;

    idHoaDons?: string[]; // 1 khachhang - N hoaddon
    idBookings?: string[];
    ngaySinh?: string;
    xungHo?: string;
}

export interface IMemberZOA {
    id?: string;
    user_id: string;
    user_id_by_app: string;
    display_name: string;
    user_is_follower?: boolean;
    avatar?: string;

    tenDangKy?: string;
    soDienThoaiDK?: string;
    diaChi?: string;
    tenTinhThanh?: string;
    tenQuanHuyen?: string;
}

export interface IPropParam_TemplateZNS {
    name: string;
    require: boolean;
    minLength: number;
    maxLength: number;
    type: string;
}

export interface ITemplateZNS {
    templateId: number;
    templateName: string;
    status: string;

    price?: string;
    previewUrl?: string;
    listParams?: IPropParam_TemplateZNS[];
}

export interface IZaloDataSend {
    soDienThoai: string;
    tenKhachHang: string;
    maHoaDon?: string;
    ngayLapHoaDon?: string;
    tongTienHang?: number;
    bookingDate?: string;
    tenDichVu?: string;
    tenChiNhanh?: string;
    diaChiChiNhanh?: string;
    logoChiNhanh?: string;
    sdtChiNhanh?: string;
}

export class ZaloAuthorizationDto {
    id = Guid.EMPTY;
    codeVerifier: string;
    codeChallenge: string;
    authorizationCode: string;
    accessToken: string;
    refreshToken: string;
    expiresToken: string;
    isExpiresAccessToken: boolean;

    constructor({
        id = Guid.EMPTY,
        codeVerifier = '',
        codeChallenge = '',
        authorizationCode = '',
        accessToken = '',
        refreshToken = '',
        expiresToken = '0',
        isExpiresAccessToken = false
    }) {
        this.id = id;
        this.codeVerifier = codeVerifier;
        this.codeChallenge = codeChallenge;
        this.authorizationCode = authorizationCode;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresToken = expiresToken;
        this.isExpiresAccessToken = isExpiresAccessToken;
    }
}
