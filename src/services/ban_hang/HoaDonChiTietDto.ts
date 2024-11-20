import { Guid } from 'guid-typescript';
import NhanVienThucHienDto from '../nhan_vien_thuc_hien/NhanVienThucHienDto';

export interface IHoaDonChiTiet_UseForBaoCao {
    soLuong?: number;
    tienChietKhau?: number;
    tienThue?: number;
    thanhTienTruocCK?: number;
    thanhTienSauCK?: number;
}

export default class HoaDonChiTietDto {
    id = Guid.create().toString();
    stt = 0;
    idHoaDon = Guid.createEmpty().toString();
    idDonViQuyDoi? = null;
    soLuong = 1;
    donGiaTruocCK = 0;
    ptChietKhau? = 0;
    tienChietKhau? = 0;
    laPTChietKhau = true;
    thanhTienTruocCK? = 0;
    ptThue? = 0;
    tienThue? = 0;
    ghiChu = '';
    trangThai? = 3; // 0.Xóa, 1.Tạm lưu, 2.Đang xử lý, 3.Hoàn thành

    donGiaSauCK? = 0;
    donGiaSauVAT? = 0;
    thanhTienSauCK? = 0;
    thanhTienSauVAT? = 0;

    private _thanhTienTruocCK?: number;
    // private _donGiaSauCK?: number;
    private _thanhTienSauCK?: number;
    // private _donGiaSauVAT?: number;
    private _thanhTienSauVAT?: number;

    idChiTietHoaDon?: string | null;

    nhanVienThucHien?: NhanVienThucHienDto[];

    constructor({
        id = Guid.create().toString(),
        idHoaDon = Guid.createEmpty().toString(),
        idDonViQuyDoi = null,
        soLuong = 1,
        donGiaTruocCK = 0,
        ptChietKhau = 0,
        tienChietKhau = 0,
        laPTChietKhau = true,
        ptThue = 0,
        tienThue = 0,
        ghiChu = '',
        trangThai = 3,
        idChiTietHoaDon = null
    }) {
        this.id = id;
        this.idHoaDon = idHoaDon;
        this.idDonViQuyDoi = idDonViQuyDoi;
        this.soLuong = soLuong;
        this.donGiaTruocCK = donGiaTruocCK;
        this.ptChietKhau = ptChietKhau;
        this.laPTChietKhau = laPTChietKhau;
        this.tienChietKhau = ptChietKhau > 0 ? (donGiaTruocCK * ptChietKhau) / 100 : tienChietKhau;
        this.ptThue = ptThue;
        this.tienThue = ptThue > 0 ? ((donGiaTruocCK - this.tienChietKhau) * ptThue) / 100 : tienThue;
        this.ghiChu = ghiChu;
        this.trangThai = trangThai;
        this.idChiTietHoaDon = idChiTietHoaDon;
        this.nhanVienThucHien = [];

        Object.defineProperties(this, {
            thanhTienTruocCK: {
                get() {
                    if (this._thanhTienTruocCK === undefined) {
                        return this.soLuong * this.donGiaTruocCK;
                    }
                    return this._thanhTienTruocCK;
                },
                set(value: number) {
                    this._thanhTienTruocCK = value;
                }
            },
            donGiaSauCK: {
                get() {
                    if (this.ptChietKhau ?? 0 > 0) {
                        return this.donGiaTruocCK - (this.donGiaTruocCK * (this.ptChietKhau ?? 0)) / 100;
                    }
                    return this.donGiaTruocCK - (this.tienChietKhau ?? 0);
                }
                // set(newVal: number) {
                //     return newVal;
                // }
            },
            // vừa có thể tự động tính toán
            // nhưng vẫn có thể thay đổi giá trị nếu được gán lại
            thanhTienSauCK: {
                get() {
                    if (this._thanhTienSauCK === undefined) {
                        return this.soLuong * this.donGiaSauCK;
                    }
                    return this._thanhTienSauCK;
                },
                set(value: number) {
                    this._thanhTienSauCK = value;
                }
            },
            donGiaSauVAT: {
                get() {
                    if (this.pTThue ?? 0 > 0) {
                        return this.donGiaSauCK + (this.donGiaSauCK * (this.pTThue ?? 0)) / 100;
                    }
                    return this.donGiaSauCK - (this.tienThue ?? 0);
                }
                // set(newVal: number) {
                //     return newVal;
                // }
            },
            thanhTienSauVAT: {
                get() {
                    if (this._thanhTienSauVAT === undefined) {
                        return this.soLuong * this.donGiaSauVAT;
                    }
                    return this._thanhTienSauVAT;
                },
                set(value: number) {
                    this._thanhTienSauVAT = value;
                }
            }
        });
    }
}
