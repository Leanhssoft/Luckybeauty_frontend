import { RequestFromToDto } from '../../dto/ParamSearchDto';

export class ParamSearchBaoCaoTGT extends RequestFromToDto {
    idLoaiChungTus?: number[];
    idCustomer?: string | null;

    constructor({
        idChiNhanhs = [''],
        textSearch = '',
        currentPage = 0,
        pageSize = 10,
        columnSort = '',
        typeSort = 'DESC',
        fromDate = null, // ngaylapPhieuThu
        toDate = null,
        idLoaiChungTus = [0],
        idCustomer = null
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
        this.idLoaiChungTus = idLoaiChungTus;
        this.idCustomer = idCustomer;
    }
}
