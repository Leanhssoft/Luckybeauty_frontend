import { IReportCellValue } from '../../../dto/IReportCellValue';
import { RequestFromToDto } from '../../../dto/ParamSearchDto';

export class ParamSearchBaoCaoBanHang extends RequestFromToDto {
    idLoaiChungTus?: string[];
    idNhomHangHoa?: string;

    reportValueCell?: IReportCellValue[];

    constructor({
        idChiNhanhs = [''],
        textSearch = '',
        currentPage = 0,
        pageSize = 10,
        columnSort = '',
        typeSort = 'DESC',
        fromDate = null, // ngaylapPhieuThu
        toDate = null,
        idLoaiChungTus = [''],
        idNhomHangHoa = ''
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
        this.idNhomHangHoa = idNhomHangHoa;
    }
}
