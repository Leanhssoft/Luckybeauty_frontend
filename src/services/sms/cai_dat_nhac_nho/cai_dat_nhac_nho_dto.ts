export interface ICaiDatNhacNhoDto {
    id: string;
    idLoaiTin: number;
    nhacTruocKhoangThoiGian?: number;
    loaiThoiGian?: number;
    trangThai: number;
    idMauTin?: string;
    hinhThucGui?: number;
}

export interface IICaiDatNhacNho_GroupLoaiTin {
    idLoaiTin: number;
    lstDetail?: ICaiDatNhacNhoDto[];
}
