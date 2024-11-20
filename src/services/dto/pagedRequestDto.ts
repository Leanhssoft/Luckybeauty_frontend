export interface PagedRequestDto {
    keyword: string;
    maxResultCount: number;
    skipCount: number;
    sortBy?: string;
    sortType?: string;
    idChiNhanh?: string;
}
