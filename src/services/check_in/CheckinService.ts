import http from '../httpService';
import { ICheckInHoaDonto, KHCheckInDto, PageKhachHangCheckInDto } from './CheckinDto';
import { Guid } from 'guid-typescript';
import utils from '../../utils/utils';
import { PagedRequestDto } from '../dto/pagedRequestDto';

class CheckinService {
    CheckExistCusCheckin = async (idCus: string, idCheckIn?: string): Promise<boolean> => {
        if (utils.checkNull_OrEmpty(idCus)) {
            return false;
        }
        if (utils.checkNull_OrEmpty(idCheckIn)) {
            idCheckIn = Guid.EMPTY;
        }
        const xx = await http.get(
            `api/services/app/CheckIn/CheckExistCusCheckin?idCus=${idCus}&idCheckIn=${idCheckIn}`
        );
        return xx.data.result;
    };
    GetInforCheckIn_byId = async (idCheckIn: string) => {
        if (utils.checkNull_OrEmpty(idCheckIn)) {
            return new KHCheckInDto({ id: Guid.EMPTY });
        }
        const xx = await http
            .get(`api/services/app/CheckIn/GetInforCheckIn_byId?idCheckIn=${idCheckIn}`)
            .then((res: { data: { result: KHCheckInDto } }) => {
                return res.data.result;
            });
        return xx;
    };
    InsertCustomerCheckIn = async (input: KHCheckInDto) => {
        const xx = await http
            .post(`api/services/app/CheckIn/InsertCustomerCheckIn`, input)
            .then((res: { data: { result: KHCheckInDto } }) => {
                return res.data.result;
            });
        return xx;
    };
    UpdateCustomerCheckIn = async (input: KHCheckInDto) => {
        const xx = await http
            .post(`api/services/app/CheckIn/UpdateCustomerCheckIn`, input)
            .then((res: { data: { result: string } }) => {
                return res.data.result;
            });
        return xx;
    };
    GetListCustomerChecking = async (input: PagedRequestDto): Promise<PageKhachHangCheckInDto[]> => {
        const xx = await http
            .post(`api/services/app/CheckIn/GetListCustomerChecking`, input)
            .then((res: { data: { result: PageKhachHangCheckInDto[] } }) => {
                return res.data.result;
            });
        return xx;
    };
    UpdateTrangThaiCheckin = async (idCheckIn: string, trangThai = 1) => {
        if (utils.checkNull_OrEmpty(idCheckIn)) {
            return;
        }
        const xx = await http
            .post(`api/services/app/CheckIn/UpdateTrangThaiCheckin?idCheckIn=${idCheckIn}&trangThai=${trangThai}`)
            .then((res: { data: { result: string } }) => {
                return res.data.result;
            });
        return xx;
    };
    UpdateTrangThaiBooking_byIdCheckIn = async (idCheckIn: string, trangThaiBooking: number): Promise<boolean> => {
        if (utils.checkNull_OrEmpty(idCheckIn)) {
            return false;
        }
        const xx = await http.get(
            `api/services/app/CheckIn/UpdateTrangThaiBooking_byIdCheckIn?idCheckIn=${idCheckIn}&trangThaiBooking=${trangThaiBooking}`
        );
        return xx.data.result;
    };
    GetArrIdChecking_fromIdBooking = async (idBooking: string): Promise<string[]> => {
        if (utils.checkNull(idBooking) || idBooking === Guid.EMPTY) {
            return [];
        }
        const xx = await http
            .get(`api/services/app/CheckIn/GetArrIdChecking_fromIdBooking?idBooking=${idBooking}`)
            .then((res) => {
                return res.data.result;
            });
        return xx;
    };

    InsertCheckInHoaDon = async (input: ICheckInHoaDonto) => {
        if (utils.checkNull(input?.idCheckIn) || input?.idCheckIn === Guid.EMPTY) {
            return;
        }
        if (utils.checkNull(input?.idBooking) || input?.idBooking === Guid.EMPTY) {
            input.idBooking = null;
        }
        const xx = await http
            .post(`api/services/app/CheckIn/InsertCheckInHoaDon`, input)
            .then((res: { data: { result: ICheckInHoaDonto } }) => {
                return res.data.result;
            });
        return xx;
    };
    Update_IdHoaDon_toCheckInHoaDon = async (idCheckIn: string, idHoaDon: string) => {
        if (utils.checkNull(idCheckIn) || idCheckIn === Guid.EMPTY) {
            return false;
        }
        try {
            const xx = await http.get(
                `api/services/app/CheckIn/Update_IdHoaDon_toCheckInHoaDon?idCheckIn=${idCheckIn}&idHoaDon=${idHoaDon}`
            );
            return xx.data.result;
        } catch (error) {
            return false;
        }
    };
}
export default new CheckinService();
