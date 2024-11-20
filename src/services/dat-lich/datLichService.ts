import http from '../httpService';
import { BookingDetail_ofCustomerDto, BookingGetAllItemDto } from './dto/BookingGetAllItemDto';
import { CreateBookingDto } from './dto/CreateBookingDto';
import qs from 'qs';
import { BookingRequestDto } from './dto/PagedBookingResultRequestDto';
import utils from '../../utils/utils';
import { Guid } from 'guid-typescript';
import { BookingInfoDto } from './dto/BookingInfoDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import { RequestFromToDto } from '../dto/ParamSearchDto';
import { IFileDto } from '../dto/FileDto';
class BookingServices {
    public async getAllBooking(input: RequestFromToDto): Promise<PagedResultDto<BookingGetAllItemDto>> {
        const result = await http.get('api/services/app/Booking/GetAll', { params: input });
        return result.data.result;
    }
    public async CreateOrEditBooking(input: CreateBookingDto) {
        const result = await http.post('api/services/app/Booking/CreateOrEditBooking', input);
        return result.data.result;
    }
    public async GetKhachHang_Booking(input: BookingRequestDto): Promise<PagedResultDto<BookingDetail_ofCustomerDto>> {
        const param = qs.stringify(input);
        const xx = await http.get(`api/services/app/Booking/GetKhachHang_Booking?${param}`);
        return xx.data.result;
    }
    public async UpdateTrangThaiBooking(idBooking: string, trangthai: number) {
        const xx = await http.post(
            `api/services/app/Booking/UpdateTrangThaiBooking?idBooking=${idBooking}&trangThai=${trangthai}`
        );
        return xx.data.result;
    }
    public async GetForEdit(id: string) {
        const response = await http.get(`api/services/app/Booking/GetForEdit?id=${id}`);
        return response.data.result;
    }
    GetListBooking_byId = async (arrIdBooking: string[] = []): Promise<BookingDetail_ofCustomerDto[] | []> => {
        if (arrIdBooking.length > 0) {
            const xx = await http.post(`api/services/app/Booking/GetInforBooking_byID?arrIdBooking=`, arrIdBooking);
            return xx.data.result;
        }
        return [];
    };
    GetInforBooking_byID = async (idBooking: string): Promise<BookingDetail_ofCustomerDto[] | []> => {
        if (utils.checkNull(idBooking) || idBooking == Guid.EMPTY) return [];
        const lst = await this.GetListBooking_byId([idBooking]);
        return lst;
    };
    GetInforBooking = async (idBooking: string): Promise<BookingInfoDto> => {
        const response = await http.get(`api/services/app/Booking/GetBookingInfo?id=${idBooking}`);
        return response.data.result;
    };
    DeleteBooking = async (idBooking: string) => {
        const result = await http.post(`api/services/app/Booking/DeleteBooking?id=${idBooking}`);
        return result.data.result;
    };
    HuyLichHen = async (idBooking: string) => {
        // # xóalichhen: chỉ update trangthai
        const result = await http.post(`api/services/app/Booking/CancelBooking?id=${idBooking}`);
        return result.data.result;
    };

    ExportExcel_LichHen = async (input: RequestFromToDto): Promise<IFileDto> => {
        const result = await http.post('api/services/app/Booking/ExportExcel_LichHen', input);
        return result.data.result;
    };
}
export default new BookingServices();
