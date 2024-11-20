import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface PagedKhachHangResultRequestDto extends PagedFilterAndSortedRequest {
    keyword: string;
    loaiDoiTuong?: number;
    idChiNhanh?: string;
    idNhomKhach?: string;
    sortBy: string;
    sortType: string;
    timeFrom?: Date;
    timeTo?: Date;
    tongChiTieuTu?: number;
    tongChiTieuDen?: number;
    gioiTinh?: boolean;
    isUserZalo?: number;
}
