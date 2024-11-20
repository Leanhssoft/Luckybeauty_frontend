import { PagedResultDto } from '../../dto/pagedResultDto';

export interface IPagedResultSoQuyDto<T> extends PagedResultDto<T> {
    sumTienMat?: number;
    sumTienChuyenKhoan?: number;
    sumTienQuyetThe?: number;
    sumTongThuChi?: number;
}
