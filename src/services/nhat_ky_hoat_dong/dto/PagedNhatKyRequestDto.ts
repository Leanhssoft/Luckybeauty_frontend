export interface PagedNhatKyRequestDto {
    loaiNhatKys: number[];
    keyword?: string;
    sortBy?: string;
    sortType?: string;
    skipCount: number;
    maxResultCount: number;
    timeFrom: Date;
    timeTo: Date;
}
