import { RequestFromToDto } from '../../dto/ParamSearchDto';

export class ParamSearchSoQuyDto extends RequestFromToDto {
    hinhThucThanhToans?: number[];
    idTaiKhoanNganHang?: string | null;
    idKhoanThuChi?: string | null;
    idLoaiChungTus?: number[]; //11.thu, 12.chi
    idLoaiChungTuLienQuan?: number; // 1.banhang, 2.nhaphang, -1. thu/chi từ nhân viên,0 .all

    constructor({
        idChiNhanhs = [],
        textSearch = '',
        currentPage = 0,
        pageSize = 10,
        columnSort = '',
        typeSort = 'DESC',
        fromDate = null,
        toDate = null,
        hinhThucThanhToans = []
    }) {
        super({
            idChiNhanhs: idChiNhanhs,
            textSearch: textSearch,
            currentPage: currentPage,
            pageSize: pageSize,
            columnSort: columnSort,
            typeSort: typeSort,
            fromDate: fromDate,
            toDate: toDate
        });
        this.hinhThucThanhToans = hinhThucThanhToans;
    }
}
