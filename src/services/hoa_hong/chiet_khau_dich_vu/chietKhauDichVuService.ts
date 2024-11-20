import { Guid } from 'guid-typescript';
import { ExecuteResultDto } from '../../dto/ExecuteResultDto';
import { PagedRequestDto } from '../../dto/pagedRequestDto';
import { PagedResultDto } from '../../dto/pagedResultDto';
import http from '../../httpService';
import { ChietKhauDichVuDto } from './Dto/ChietKhauDichVuDto';
import { ChietKhauDichVuItemDto, ChietKhauDichVuItemDto_TachRiengCot } from './Dto/ChietKhauDichVuItemDto';
import { ChietKhauDichVuDto_AddMultiple, CreateOrEditChietKhauDichVuDto } from './Dto/CreateOrEditChietKhauDichVuDto';
import { IFileDto } from '../../dto/FileDto';

class ChietKhauDichVuService {
    public async CreateOrEdit(input: CreateOrEditChietKhauDichVuDto) {
        const result = await http.post('api/services/app/ChietKhauDichVu/CreateOrEdit', input);
        return result.data.result;
    }

    AddMultiple_ChietKhauDichVu_toMultipleNhanVien = async (input: ChietKhauDichVuDto_AddMultiple): Promise<number> => {
        const result = await http.post(
            'api/services/app/ChietKhauDichVu/AddMultiple_ChietKhauDichVu_toMultipleNhanVien',
            input
        );
        return result.data.result;
    };
    ApplyAll_SetupHoaHongDV = async (
        input: ChietKhauDichVuDto_AddMultiple,
        idNhanVienChosed: string,
        loaiApDung: number
    ): Promise<number> => {
        const result = await http.get(`api/services/app/ChietKhauDichVu/ApplyAll_SetupHoaHongDV`, {
            params: {
                ...input,
                idNhanVienChosed: idNhanVienChosed,
                loaiApDung: loaiApDung
            }
        });
        return result.data.result;
    };
    public async Delete(id: string) {
        const result = await http.post(`api/services/app/ChietKhauDichVu/Delete?id=${id}`);
        return result.data.result;
    }
    DeleteSetup_DichVu_ofNhanVien = async (arrIdNhanVien: string[], arrIdDonViQuyDoi: string[]): Promise<boolean> => {
        const result = await http.get(`api/services/app/ChietKhauDichVu/DeleteSetup_DichVu_ofNhanVien`, {
            params: {
                arrIdNhanVien: arrIdNhanVien,
                arrIdDonViQuyDoi: arrIdDonViQuyDoi
            }
        });
        return result.data.result;
    };
    UpdateSetup_HoaHongDichVu_ofNhanVien = async (input: CreateOrEditChietKhauDichVuDto): Promise<boolean> => {
        const result = await http.post(`api/services/app/ChietKhauDichVu/UpdateSetup_HoaHongDichVu_ofNhanVien`, input);
        return result.data.result;
    };
    public async GetForEdit(id: string): Promise<CreateOrEditChietKhauDichVuDto> {
        const result = await http.get('api/services/app/ChietKhauDichVu/GetForEdit', {
            params: {
                id
            }
        });
        return result.data.result;
    }
    public async GetAccordingByNhanVien(
        input: PagedRequestDto,
        idNhanVien: string = Guid.EMPTY,
        idChiNhanh: string | undefined
    ): Promise<PagedResultDto<ChietKhauDichVuItemDto>> {
        const result = await http.get('api/services/app/ChietKhauDichVu/GetAccordingByNhanVien', {
            params: {
                ...input,
                idNhanVien,
                idChiNhanh
            }
        });
        return result.data.result;
    }
    public async GetAllSetup_HoaHongDichVu(
        input: PagedRequestDto,
        idNhanVien: string = Guid.EMPTY,
        idChiNhanh: string | undefined
    ): Promise<PagedResultDto<ChietKhauDichVuItemDto_TachRiengCot>> {
        const result = await http.get('api/services/app/ChietKhauDichVu/GetAllSetup_HoaHongDichVu', {
            params: {
                ...input,
                idNhanVien,
                idChiNhanh
            }
        });
        return result.data.result;
    }
    public async GetAll(input: PagedRequestDto): Promise<PagedResultDto<ChietKhauDichVuItemDto>> {
        const result = await http.get('api/services/app/ChietKhauDichVu/GetAll', {
            params: {
                input
            }
        });
        return result.data.result;
    }
    GetHoaHongNV_theoDichVu = async (
        idNhanVien: string,
        idDonViQuyDoi: string,
        idChiNhanh: string
    ): Promise<CreateOrEditChietKhauDichVuDto[]> => {
        try {
            const result = await http.get(
                `api/services/app/ChietKhauDichVu/GetHoaHongNV_theoDichVu?idNhanVien=${idNhanVien}&idDonViQuyDoi=${idDonViQuyDoi}&idChiNhanh=${idChiNhanh}`
            );
            return result.data.result;
        } catch {
            return [];
        }
    };
    GetAllHoaHong_theoNhanVien = async (idNhanVien: string): Promise<CreateOrEditChietKhauDichVuDto[]> => {
        const result = await http.get(
            `api/services/app/ChietKhauDichVu/GetAllHoaHong_theoNhanVien?idNhanVien=${idNhanVien}`
        );
        return result.data.result;
    };
    GetAllHoaHong_theoDichVu = async (idDonViQuyDoi: string): Promise<CreateOrEditChietKhauDichVuDto[]> => {
        const result = await http.get(
            `api/services/app/ChietKhauDichVu/GetAllHoaHong_theoDichVu?idNhanVien=${idDonViQuyDoi}`
        );
        return result.data.result;
    };
    public async ExportToExcel_CaiDat_HoaHongDV(
        input: PagedRequestDto,
        idNhanVien: string = Guid.EMPTY,
        idChiNhanh: string | undefined
    ): Promise<IFileDto> {
        const result = await http.get('api/services/app/ChietKhauDichVu/ExportToExcel_CaiDat_HoaHongDV', {
            params: {
                ...input,
                idNhanVien,
                idChiNhanh
            }
        });
        return result.data.result;
    }
}
export default new ChietKhauDichVuService();
