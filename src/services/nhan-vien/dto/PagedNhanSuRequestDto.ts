import { LargeNumberLike } from 'crypto';

export interface PagedNhanSuRequestDto {
    tenantId?: number;
    filter: string;
    idChiNhanh?: string;
    idChucVu?: string | null;
    sortBy: string;
    sortType: string;
    skipCount: number;
    maxResultCount: number;
}
