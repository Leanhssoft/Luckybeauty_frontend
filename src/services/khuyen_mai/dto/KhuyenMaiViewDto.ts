import { KhuyenMaiChiTiet } from './CreateOrEditKhuyenMaiDto';

export interface KhuyenMaiViewDto {
    id: string;
    maKhuyenMai: string;
    tenKhuyenMai: string;
    hinhThucKM: string;
    thoiGianApDung: string;
    thoiGianKetThuc: string;
    ngayApDung: string;
    thangApDung: string;
    thuApDung: string;
    gioApDung: string;
    ghiChu: string;
    khuyenMaiChiTiets: KhuyenMaiChiTiet[];
}
