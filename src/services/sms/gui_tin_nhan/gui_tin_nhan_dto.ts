import { Guid } from 'guid-typescript';
import { PagedResultDto } from '../../dto/pagedResultDto';
import { CustomerBasicDto } from '../../khach-hang/dto/CustomerBasicDto';
import { IDataAutocomplete } from '../../dto/IDataAutocomplete';
import { format } from 'date-fns';
import { SMS_HinhThucGuiTin } from '../../../lib/appconst';
import { RequestFromToDto } from '../../dto/ParamSearchDto';
import { IInforUserZOA } from '../../zalo/zalo_dto';

export class ParamSearchSMS extends RequestFromToDto {
    idLoaiTin?: number;
    hinhThucGuiTins?: number[] = []; // 1.sms, 2.zalo, 3.gmail
    isFilterCustomer?: boolean = false;
    loaiUser_CoTheGuiTin?: number = 0;
}

export class CreateOrEditSMSDto {
    id = Guid.EMPTY;
    idTinNhan = Guid.EMPTY;
    idChiNhanh: string;
    idBrandname?: string;
    soTinGui = 1;
    noiDungTin = '';
    idKhachHang = Guid.EMPTY;
    soDienThoai = '';
    idHoaDon?: string | null;
    idBooking?: string | null;
    trangThai = 100;
    giaTienMoiTinNhan = 950; // hiện tại, đang mặc định giá này cho all nhà mạng (nếu sau cần thì thêm data)
    hinhThucGui?: number = SMS_HinhThucGuiTin.SMS;

    idLoaiTin = 1;
    idNguoiGui?: string | null = null;

    tenKhachHang = '';
    loaiTinNhan = '';
    thoiGianGui = new Date();
    sTrangThaiGuiTinNhan = '';

    idMauTin?: string | null = '';
    lstCustomer?: IDataAutocomplete[]; // hiện tại chỉ dung cái này với mục đích check lỗi khi click lưu (formik)

    constructor({
        idLoaiTin = 1,
        idChiNhanh = Guid.EMPTY,
        idKhachHang = Guid.EMPTY,
        noiDungTin = '',
        soTinGui = 1,
        soDienThoai = '',
        hinhThucGui = SMS_HinhThucGuiTin.SMS,
        lstCustomer = []
    }) {
        this.idLoaiTin = idLoaiTin;
        this.idChiNhanh = idChiNhanh;
        this.idKhachHang = idKhachHang;
        this.noiDungTin = noiDungTin;
        this.soTinGui = soTinGui;
        this.soDienThoai = soDienThoai;
        this.hinhThucGui = hinhThucGui;
        this.lstCustomer = lstCustomer;
    }
}

export class PagedResultSMSDto implements PagedResultDto<CreateOrEditSMSDto> {
    totalCount: number;
    totalPage: number;
    items: CreateOrEditSMSDto[];

    constructor({ totalCount = 0, totalPage = 0, items = [] }) {
        this.totalCount = totalCount;
        this.totalPage = totalPage;
        this.items = items;
    }
}

// ESMS
export class ESMSDto {
    phone: string;
    content: string;
    brandname: string;

    constructor({ sdtKhachhang = '', noiDungTin = '', tenBranname = '' }) {
        this.phone = sdtKhachhang;
        this.content = noiDungTin;
        this.brandname = tenBranname;
    }
}

export class ResultESMSDto {
    messageId: string;
    messageStatus: number;

    constructor({ messageId = '', messageStatus = 100 }) {
        this.messageId = messageId;
        this.messageStatus = messageStatus;
    }
}

export interface IResultESMS_CountSuccess {
    success?: number;
    err?: number;
    messageStatus?: number;
}

export interface CustomerSMSDto extends IInforUserZOA {
    id: string;
    zoaUserId: string;
    maHoaDon?: string | null;
    ngayLapHoaDon?: string;
    tongThanhToan?: number;
    daThanhToan?: number;
    ptThanhToan?: string;

    idHoaDon?: string;
    idBooking?: string;

    bookingCode?: string | null;
    tenHangHoa?: string | null;
    bookingDate?: string;
    startTime?: string;
    thoiGianHen?: string;

    tenChiNhanh?: string;
    diaChiChiNhanh?: string;
    soDienThoaiChiNhanh?: string;

    tenCuaHang?: string;
    diaChiCuaHang?: string;
    dienThoaiCuaHang?: string;
    websiteCuHang?: string;

    sTrangThaiGuiTinNhan?: string;
}

export class CustomerZaloDto extends CustomerBasicDto {
    zoaUserId: string;
    idHoaDon?: string;
    idBooking?: string;

    constructor({ idKhachHang = '', maKhachHang = '', tenKhachHang = '', soDienThoai = '', zoaUserId = '' }) {
        super({
            idKhachHang: idKhachHang,
            maKhachHang: maKhachHang,
            tenKhachHang: tenKhachHang,
            soDienThoai: soDienThoai
        });
        this.zoaUserId = zoaUserId;
    }
}

export class NhatKyGuiTinSMSDto {
    idHeThongSMS!: string;
    idKhachHang!: string;
    idChiNhanh!: string;
    idLoaiTin!: number;
    thoiGianTu!: string;
    thoiGianDen!: string;
    idHoaDon: string | null = null;
    idBooking: string | null = null;

    constructor({
        idHeThongSMS = '',
        idKhachHang = '',
        idChiNhanh = '',
        idLoaiTin = 1,
        thoiGianTu = format(new Date(), 'YYYY-MM-DD'),
        thoiGianDen = format(new Date(), 'YYYY-MM-DD'),
        idHoaDon = null,
        idBooking = null
    }) {
        this.idHeThongSMS = idHeThongSMS;
        this.idKhachHang = idKhachHang;
        this.idChiNhanh = idChiNhanh;
        this.idLoaiTin = idLoaiTin;
        this.thoiGianTu = thoiGianTu;
        this.thoiGianDen = thoiGianDen;
        this.idHoaDon = idHoaDon;
        this.idBooking = idBooking;
    }
}
