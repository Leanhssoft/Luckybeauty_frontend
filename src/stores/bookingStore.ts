import { makeAutoObservable } from 'mobx';
import { BookingDetail_ofCustomerDto, BookingGetAllItemDto } from '../services/dat-lich/dto/BookingGetAllItemDto';
import datLichService from '../services/dat-lich/datLichService';
import Cookies from 'js-cookie';
import { BookingInfoDto } from '../services/dat-lich/dto/BookingInfoDto';
import AppConsts from '../lib/appconst';
import { CreateBookingDto } from '../services/dat-lich/dto/CreateBookingDto';
import { FullCalendarEvent } from '../services/dat-lich/dto/FullCalendarEvent';
import { addDays, endOfWeek, format as formatDate, startOfWeek } from 'date-fns';
import suggestStore from './suggestStore';
import utils from '../utils/utils';
import PageHoaDonChiTietDto from '../services/ban_hang/PageHoaDonChiTietDto';
import { dbDexie } from '../lib/dexie/dexieDB';
import PageHoaDonDto from '../services/ban_hang/PageHoaDonDto';
import { SuggestNhanSuDto } from '../services/suggests/dto/SuggestNhanSuDto';
import TrangThaiBooking from '../enum/TrangThaiBooking';

class BookingStore {
    selectedDate: string = new Date().toString();
    fromDate: string = formatDate(addDays(startOfWeek(new Date()), 1), 'yyyy-MM-dd');
    toDate: string = formatDate(addDays(endOfWeek(new Date()), 1), 'yyyy-MM-dd');
    textSearch!: string;
    currentPage = 1;
    pageSize = 10;
    trangThaiBooks: number[] = [TrangThaiBooking.Wait, TrangThaiBooking.Confirm];
    listBooking!: BookingGetAllItemDto[];
    totalRowLichHen!: number;
    listNhanVienBooking: SuggestNhanSuDto[] = [];
    fullCalendarEvents!: FullCalendarEvent[];
    typeView!: string;
    idNhanVien!: string;
    idService!: string;
    idBooking!: string;
    bookingInfoDto!: BookingInfoDto;
    createOrEditBookingDto!: CreateBookingDto;
    isShowCreateOrEdit!: boolean;
    isShowBookingInfo!: boolean;
    isShowConfirmDelete!: boolean;
    constructor() {
        makeAutoObservable(this);
        this.selectedDate = new Date().toString();
        this.isShowBookingInfo = false;
        this.isShowConfirmDelete = false;
        this.isShowCreateOrEdit = false;
        this.createNewBookingDto();
        this.bookingInfoDto = {
            id: AppConsts.guidEmpty,
            bookingDate: new Date(),
            startTime: '',
            endTime: '',
            color: 'blue',
            donGia: 0,
            ghiChu: '',
            nhanVienThucHien: '',
            soDienThoai: '',
            tenDichVu: '',
            tenKhachHang: '',
            avatarKhachHang: '',
            trangThai: 1
        };
    }
    async addDataBooking_toCacheHD(itemBook: BookingDetail_ofCustomerDto, idCheckIn: string) {
        // always add new cache hoadon
        const hoadonCT = [];
        let tongTienHang = 0;

        for (let i = 0; i < itemBook.details.length; i++) {
            const itFor = itemBook.details[i];
            const newCT = new PageHoaDonChiTietDto({
                idDonViQuyDoi: itFor.idDonViQuyDoi as unknown as null,
                maHangHoa: itFor.maHangHoa,
                tenHangHoa: itFor.tenHangHoa,
                giaBan: itFor.giaBan,
                idNhomHangHoa: itFor.idNhomHangHoa as unknown as null,
                idHangHoa: itFor.idHangHoa as unknown as null,
                soLuong: 1
            });
            hoadonCT.push(newCT);
            tongTienHang += itFor.giaBan;
        }
        // create cache hd with new id
        const idChiNhanh = Cookies.get('IdChiNhanh')?.toString() as string;
        const hoadon = new PageHoaDonDto({
            idChiNhanh: idChiNhanh,
            idKhachHang: itemBook.idKhachHang as unknown as null,
            maKhachHang: itemBook.maKhachHang,
            tenKhachHang: itemBook.tenKhachHang,
            soDienThoai: itemBook.soDienThoai,
            tongTienHang: tongTienHang
        });
        hoadon.idCheckIn = idCheckIn;
        hoadon.tongTienHangChuaChietKhau = tongTienHang;
        hoadon.tongTienHDSauVAT = tongTienHang;
        hoadon.tongThanhToan = tongTienHang;
        hoadon.hoaDonChiTiet = hoadonCT;
        await dbDexie.hoaDon.add(hoadon);
    }
    async createNewBookingDto() {
        this.createOrEditBookingDto = {
            id: AppConsts.guidEmpty,
            idChiNhanh: Cookies.get('IdChiNhanh') ?? '',
            idDonViQuiDoi: '',
            idKhachHang: '',
            idNhanVien: '',
            startHours: '',
            startTime: formatDate(new Date(), 'yyyy-MM-dd'),
            ghiChu: '',
            trangThai: 1
        };
    }
    async getForEditBooking(id: string) {
        const result = await datLichService.GetForEdit(id);
        this.createOrEditBookingDto = result;
    }
    async onCreateOrEditBooking(input: CreateBookingDto) {
        if (utils.checkNull(input.idNhanVien)) {
            input.idNhanVien = null;
        }
        const result = await datLichService.CreateOrEditBooking(input);
        this.isShowCreateOrEdit = false;
        await this.createNewBookingDto();
        return result;
    }
    async onShowBookingInfo() {
        this.isShowBookingInfo = !this.isShowBookingInfo;
    }
    async getData() {
        const result = await datLichService.getAllBooking({
            idChiNhanhs: [Cookies.get('IdChiNhanh') ?? ''],
            fromDate: this.fromDate,
            toDate: this.toDate,
            textSearch: this.textSearch,
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            trangThais: this.trangThaiBooks
        });
        this.listBooking = result?.items;
        this.totalRowLichHen = result?.totalCount ?? 0;
        const arrIdNhanVien: string[] = [];
        this.listNhanVienBooking = [];
        for (let index = 0; index < result?.items?.length; index++) {
            const element = result?.items[index];
            if (!arrIdNhanVien.includes(element.idNhanVien)) {
                const newNV: SuggestNhanSuDto = {
                    id: element?.idNhanVien,
                    tenNhanVien: element?.nhanVienThucHien,
                    soDienThoai: '',
                    avatar: element?.avatar,
                    chucVu: element?.tenChucVu
                };
                this.listNhanVienBooking.push(newNV);
            }
        }

        this.fullCalendarEvents = result?.items?.map((item) => {
            const [hoursStart, minutesStart] = item.startTime.split(':').map(Number);
            const [hoursEnd, minutesEnd] = item.endTime.split(':').map(Number);
            const bookingDateTime = new Date(item.bookingDate);
            const startTime = bookingDateTime.setHours(hoursStart, minutesStart);
            const endTime = bookingDateTime.setHours(hoursEnd, minutesEnd);
            const event: FullCalendarEvent = {
                id: item.id,
                title: item.tenDichVu,
                start: new Date(startTime),
                end: new Date(endTime),
                backgroundColor: item.color + '1a',
                textColor: item.color,
                borderColor: item.color + '1a',
                display: item.tenKhachHang,
                resourceId: item.idNhanVien,
                startStr: new Date(startTime).toISOString(),
                endStr: new Date(endTime).toISOString()
            };

            return event;
        });
    }
    async getBookingInfo(id: string) {
        const result = await datLichService.GetInforBooking(id);
        this.bookingInfoDto = result;
    }
    async onChangeTypeView(type: string) {
        this.typeView = type;
        await this.getData();
    }
    async onChangeDate(date: string) {
        this.selectedDate = date;
        await this.getData();
    }
    async onChangeEmployee(idNhanVien: string) {
        this.idNhanVien = idNhanVien;
        await suggestStore.getSuggestDichVu(idNhanVien);
        await this.getData();
    }
    async onChangeService(idService: string) {
        this.idService = idService;
        if (idService == '' || idService == null || idService == undefined) {
            await suggestStore.getSuggestKyThuatVien();
        } else {
            await suggestStore.getSuggestKyThuatVienByIdDichVu(idService);
        }

        await this.getData();
    }
}
export default new BookingStore();
