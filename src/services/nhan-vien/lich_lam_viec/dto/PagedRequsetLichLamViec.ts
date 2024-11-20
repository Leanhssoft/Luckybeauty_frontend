import { PagedRequestDto } from '../../../dto/pagedRequestDto';

export interface PagedRequestLichLamViecDto extends PagedRequestDto {
    dateFrom: Date;
    dateTo: Date;
    idChiNhanh: string;
    idNhanVien?: string;
}
