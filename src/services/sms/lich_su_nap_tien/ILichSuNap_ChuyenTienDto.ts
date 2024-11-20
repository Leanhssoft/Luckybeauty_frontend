export default interface ILichSuNap_ChuyenTienDto {
    tenantId: number;
    id: string;
    idPhieuNapTien: string;
    thoiGianNap_ChuyenTien: string;
    idNguoiChuyenTien?: number;
    idNguoiNhanTien?: number;
    soTienChuyen_Nhan: number;
    noiDungChuyen_Nhan: string;
}
export interface INhatKyChuyenTienDto extends ILichSuNap_ChuyenTienDto {
    userChuyenTien: string;
    userNhanTien: string;
    createTime: string;
    loaiPhieu: string;
}
