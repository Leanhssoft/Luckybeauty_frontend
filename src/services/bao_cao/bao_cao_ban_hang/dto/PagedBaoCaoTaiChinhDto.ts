export interface PagedBaoCaoTaiChinhDto {
    filter: string;
    idChiNhanh?: string;
    sortBy: string;
    sortType: string;
    skipCount: number;
    maxResultCount: number;
    timeFrom: string;
    timeTo: string;
}
