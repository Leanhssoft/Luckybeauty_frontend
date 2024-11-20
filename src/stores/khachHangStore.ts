import { makeAutoObservable } from 'mobx';
import { CreateOrEditKhachHangDto } from '../services/khach-hang/dto/CreateOrEditKhachHangDto';
import khachHangService from '../services/khach-hang/khachHangService';
import AppConsts from '../lib/appconst';
import { KhachHangDetail } from '../services/khach-hang/dto/KhachHangDetail';
import { ILichSuDatLich } from '../services/khach-hang/dto/ILichSuDatLich';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { LichSuGiaoDich } from '../services/khach-hang/dto/LichSuGiaoDich';
import { CreateOrEditNhomKhachDto } from '../services/khach-hang/dto/CreateOrEditNhomKhachDto';
import { PagedRequestDto } from '../services/dto/pagedRequestDto';
import { ICustomerDetail_FullInfor } from '../services/khach-hang/dto/KhachHangDto';

class KhachHangSrore {
    createEditKhachHangDto!: CreateOrEditKhachHangDto;
    createOrEditNhomKhachDto!: CreateOrEditNhomKhachDto;
    khachHangDetail!: ICustomerDetail_FullInfor;
    lichSuDatLich!: PagedResultDto<ILichSuDatLich>;
    lichSuGiaoDich!: PagedResultDto<LichSuGiaoDich>;
    constructor() {
        this.khachHangDetail = {
            id: AppConsts.guidEmpty,
            avatar: '',
            ngaySinh: new Date(),
            maKhachHang: '',
            tenKhachHang: '',
            soDienThoai: '',
            diaChi: '',
            gioiTinhNam: false,
            email: '',
            maSoThue: '',
            idLoaiKhach: 1,
            tenNhomKhach: '',
            tenNguonKhach: '',
            tongTichDiem: 0
        };
        this.createNewNhomKhachDto();
        makeAutoObservable(this);
    }
    async getForEdit(id: string) {
        const result = await khachHangService.getKhachHang(id);
        this.createEditKhachHangDto = result;
    }
    async getNhomKhachForEdit(id: string) {
        const result = await khachHangService.getForEditNhomKhach(id);
        this.createOrEditNhomKhachDto = result;
    }
    async getDetail(id: string) {
        const result = await khachHangService.getDetail(id);
        this.khachHangDetail = result;
    }
    async getLichSuDatLich(idKhachHang: string, input: PagedRequestDto) {
        const result = await khachHangService.lichSuDatLich(idKhachHang, input);
        this.lichSuDatLich = result;
    }
    async getLichSuGiaoDich(idKhachHang: string, input: PagedRequestDto) {
        const result = await khachHangService.lichSuGiaoDich(idKhachHang, input);
        this.lichSuGiaoDich = result;
    }
    async createKhachHangDto() {
        this.createEditKhachHangDto = {
            id: AppConsts.guidEmpty,
            maKhachHang: '',
            tenKhachHang: '',
            soDienThoai: '',
            gioiTinhNam: false,
            idLoaiKhach: 1,
            idNhomKhach: '',
            idNguonKhach: '',
            diaChi: '',
            moTa: ''
        };
    }
    async createNewNhomKhachDto() {
        this.createOrEditNhomKhachDto = {
            id: AppConsts.guidEmpty,
            maNhomKhach: '',
            tenNhomKhach: '',
            moTa: '',
            trangThai: 1
        };
    }
}
export default new KhachHangSrore();
