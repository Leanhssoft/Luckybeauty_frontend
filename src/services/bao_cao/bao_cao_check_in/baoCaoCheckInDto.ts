import { IReportCellValue } from '../../dto/IReportCellValue';
import { RequestFromToDto } from '../../dto/ParamSearchDto';

export interface IBaoCaoKhachHangCheckIn {
    idKhachHang: string;
    maKhachHang: string;
    tenKhachHang: string;
    soDienThoai: string;
    soLanCheckIn: number;
    ngayCheckInGanNhat?: string;
    soNgayChuaCheckIn?: number;
    soLanDatHen: number;
    soLanHuyHen: number;
}

export interface IObjectFilterNumber_fromTo {
    loaiSoSanh: number;
    fromValue?: number;
    toValue?: number;
}

export class ParamSearchBaoCaoCheckIn extends RequestFromToDto {
    idNhomKhachs?: string[];
    soNgayChuaCheckIn_LoaiSoSanh?: number;
    soNgayChuaCheckIn_From?: number | null;
    soNgayChuaCheckIn_To?: number | null;

    soLanCheckIn_LoaiSoSanh?: number;
    soLanCheckIn_From?: number | null;
    soLanCheckIn_To?: number | null;

    soLanDatHen_LoaiSoSanh?: number;
    soLanDatHen_From?: number | null;
    soLanDatHen_To?: number | null;

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
        idNhomKhachs = [''],
        soNgayChuaCheckIn_From = 0,
        soNgayChuaCheckIn_To = 0,
        soLanCheckIn_From = 0,
        soLanCheckIn_To = 0
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
        this.idNhomKhachs = idNhomKhachs;
        this.soNgayChuaCheckIn_From = soNgayChuaCheckIn_From;
        this.soNgayChuaCheckIn_To = soNgayChuaCheckIn_To;
        this.soLanCheckIn_From = soLanCheckIn_From;
        this.soLanCheckIn_To = soLanCheckIn_To;
    }
}
