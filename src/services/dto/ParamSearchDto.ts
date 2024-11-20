import { DateType } from '../../lib/appconst';

export class ParamSearchDto {
    idChiNhanhs?: string[];
    textSearch?: string;
    currentPage? = 1;
    pageSize? = 10;
    columnSort?: string;
    typeSort?: string;
    trangThais?: number[] = [];

    constructor({
        idChiNhanhs = [''],
        textSearch = '',
        currentPage = 0,
        pageSize = 10,
        columnSort = '',
        typeSort = 'DESC',
        trangThais = []
    }) {
        this.idChiNhanhs = idChiNhanhs;
        this.textSearch = textSearch;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.columnSort = columnSort;
        this.typeSort = typeSort;
        this.trangThais = trangThais;
    }
}

export class RequestFromToDto extends ParamSearchDto {
    fromDate?: string | null = null;
    toDate?: string | null = null;
    dateType?: string;

    constructor({
        idChiNhanhs = [''],
        textSearch = '',
        currentPage = 0,
        pageSize = 10,
        columnSort = '',
        typeSort = 'DESC',
        fromDate = null,
        toDate = null,
        dateType = DateType.THANG_NAY
    }) {
        super({
            idChiNhanhs: idChiNhanhs,
            textSearch: textSearch,
            currentPage: currentPage,
            pageSize: pageSize,
            columnSort: columnSort,
            typeSort: typeSort
        });
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.dateType = dateType;
    }
}

export class HoaDonRequestDto extends RequestFromToDto {
    idLoaiChungTus?: number[];
    trangThaiNos?: number[]; // 0.hetno, 1.conno

    constructor({
        idChiNhanhs = [],
        textSearch = '',
        currentPage = 0,
        pageSize = 10,
        columnSort = '',
        typeSort = 'DESC',
        fromDate = null,
        toDate = null,
        idLoaiChungTus = [],
        trangThaiNos = []
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
        this.trangThaiNos = trangThaiNos;
    }
}
