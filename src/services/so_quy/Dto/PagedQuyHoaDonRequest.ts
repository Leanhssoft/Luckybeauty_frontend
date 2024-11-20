export interface PagedQuyHoaDonRequestDto {
    tenantId?: number;
    filter: string;
    idChiNhanh?: string;
    sortBy: string;
    sortType: string;
    skipCount: number;
    maxResultCount: number;
}
