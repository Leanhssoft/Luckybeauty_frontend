import { ParamSearchDto, RequestFromToDto } from '../../dto/ParamSearchDto';

export interface PagedBookingResultRequestDto {
    idChiNhanh: string;
    dateSelected: string;
    typeView: string;
    idNhanVien?: string;
    idDichVu?: string;
}

export class BookingRequestDto extends RequestFromToDto {
    trangThaiBook = 3; // 3.all, 1.chua xacnha, 2.da xacnhan, 0.xoa

    constructor({
        idChiNhanhs = [],
        currentPage = 0,
        pageSize = 10,
        textSearch = '',
        trangThaiBook = 3,
        fromDate = null,
        toDate = null
    }) {
        super({ idChiNhanhs, currentPage, pageSize, textSearch, fromDate, toDate });
        this.trangThaiBook = trangThaiBook;
    }
}
