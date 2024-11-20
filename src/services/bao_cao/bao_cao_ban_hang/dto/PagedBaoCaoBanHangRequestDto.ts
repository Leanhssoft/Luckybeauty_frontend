export interface PagedBaoCaoBanHangRequestDto {
    filter: string;
    idChiNhanh?: string;
    idDichVu?: string;
    sortBy: string;
    sortType: string;
    skipCount: number;
    maxResultCount: number;
    timeFrom: string;
    timeTo: string;
}
