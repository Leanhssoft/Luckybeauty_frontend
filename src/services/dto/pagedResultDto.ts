export interface PagedResultDto<T> {
    totalCount: number;
    totalPage: number;
    items: T[];
}
