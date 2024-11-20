export interface PagedBaoCaoLichHenRequestDto {
    filter: string;
    idChiNhanh?: string;
    idDichVu?: string;
    idKhachHang?: string;
    trangThai?: number;
    sortBy: string;
    sortType: string;
    skipCount: number;
    maxResultCount: number;
    timeFrom: string;
    timeTo: string;
}
