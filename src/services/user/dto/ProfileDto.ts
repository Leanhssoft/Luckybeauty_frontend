export interface ProfileDto {
    id: number;
    nhanSuId?: string;
    surname: string;
    name: string;
    userName: string;
    phoneNumber: string;
    emailAddress: string;
    ngaySinh: string;
    cccd: string;
    gioiTinh: number;
    avatar: string;
    ngayCap: string;
    noiCap: string;
    password: string;
}

export interface IUserProfileDto extends ProfileDto {
    tenNhanVien: string;
    idChiNhanhMacDinh?: string;
    tenChiNhanh: string;
    isActive: boolean;
    isAdmin: boolean;
    roleNames: string;
    txtTrangThai: string;
}
