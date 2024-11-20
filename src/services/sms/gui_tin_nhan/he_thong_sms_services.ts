import { RequestFromToDto } from '../../dto/ParamSearchDto';
import { PagedResultDto } from '../../dto/pagedResultDto';
import {
    CreateOrEditSMSDto,
    CustomerSMSDto,
    CustomerZaloDto,
    ESMSDto,
    NhatKyGuiTinSMSDto,
    ResultESMSDto,
    IResultESMS_CountSuccess,
    ParamSearchSMS
} from './gui_tin_nhan_dto';
import http from '../../httpService';
import { IFileDto } from '../../dto/FileDto';

class HeThongSMSServices {
    JqAutoCustomer_byIdLoaiTin = async (input: ParamSearchSMS, idLoaiTin: number): Promise<CustomerSMSDto[]> => {
        // get ds khachhang co: sinhnhat, lichhen, giaodich
        const result = await http.post(
            `api/services/app/HeThongSMS/JqAutoCustomer_byIdLoaiTin?idLoaiTin=${idLoaiTin}`,
            input
        );
        return result.data.result;
    };
    GetListCustomer_byIdLoaiTin = async (
        input: ParamSearchSMS,
        idLoaiTin: number
    ): Promise<PagedResultDto<CustomerSMSDto>> => {
        const result = await http.post(
            `api/services/app/HeThongSMS/GetListCustomer_byIdLoaiTin?idLoaiTin=${idLoaiTin}`,
            input
        );
        return result.data.result;
    };
    Insert_HeThongSMS = async (input: CreateOrEditSMSDto): Promise<CreateOrEditSMSDto> => {
        const result = await http.post(`api/services/app/HeThongSMS/Insert_HeThongSMS`, input);
        return result.data.result;
    };
    Update_HeThongSMS = async (input: CreateOrEditSMSDto): Promise<CreateOrEditSMSDto> => {
        const result = await http.post(`api/services/app/HeThongSMS/Update_HeThongSMS`, input);
        return result.data.result;
    };
    GuiLai_TinNhan_ThatBai = async (listId: any, brandname: string): Promise<IResultESMS_CountSuccess> => {
        const result = await http.post(
            `api/services/app/HeThongSMS/GuiLai_TinNhan_ThatBai?brandname=${brandname}`,
            listId
        );
        return result.data.result;
    };
    GetListSMS = async (input: RequestFromToDto): Promise<PagedResultDto<CreateOrEditSMSDto>> => {
        const result = await http.post(`api/services/app/HeThongSMS/GetListSMS`, input);
        return result.data.result;
    };
    SendSMS_Json = async (input: ESMSDto): Promise<ResultESMSDto> => {
        // api cua ben ESMS: tra ve idTinNhan + trangthaiTin
        const result = await http.post(`api/services/app/ESMS/SendSMS_Json`, input);
        return result.data.result;
    };

    ExportToExcel_DanhSachTinNhan = async (input: RequestFromToDto): Promise<IFileDto> => {
        const result = await http.post(`api/services/app/HeThongSMS/ExportToExcel_DanhSachTinNhan`, input);
        return result.data.result;
    };
    ExportToExcel_DanhSachKhachHang_SMS = async (input: RequestFromToDto, idLoaiTin: number): Promise<IFileDto> => {
        const result = await http.post(
            `api/services/app/HeThongSMS/ExportToExcel_DanhSachKhachHang_SMS?idLoaiTin=${idLoaiTin}`,
            input
        );
        return result.data.result;
    };
    ThemMoi_NhatKyGuiTinSMS = async (input: NhatKyGuiTinSMSDto): Promise<ResultESMSDto> => {
        const result = await http.post(`api/services/app/NhatKyGuiTinSMS/ThemMoi_NhatKyGuiTinSMS`, input);
        return result.data.result;
    };
    ThemMoi_NhatKyGuiTin_TrongKhoangThoiGian = async (input: NhatKyGuiTinSMSDto): Promise<ResultESMSDto> => {
        const result = await http.post(
            `api/services/app/NhatKyGuiTinSMS/ThemMoi_NhatKyGuiTin_TrongKhoangThoiGian`,
            input
        );
        return result.data.result;
    };
}

export default new HeThongSMSServices();
