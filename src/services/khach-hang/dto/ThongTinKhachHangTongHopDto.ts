export interface ThongTinKhachHangTongHopDto {
    tongCuocHen: number;
    cuocHenHuy: number;
    cuocHenHoanThanh: number;
    tongChiTieu: number;
    hoatDongs: HoatDongKhachHang[];
}
export interface HoatDongKhachHang {
    hoatDong: string;
    thoiGian: Date;
}
