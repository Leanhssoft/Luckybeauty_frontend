import utils from '../../utils/utils';
import http from '../httpService';
import NhanVienThucHienDto from './NhanVienThucHienDto';

class NhanVienThucHienService {
    UpdateNVThucHienDichVu = async (input: any) => {
        const result = await http.post('api/services/app/NhanVienThucHien/UpdateNVThucHienDichVu', input);
        return result.data;
    };
    GetNhanVienThucHien_byIdHoaDon = async (
        idHoaDon: string,
        idQuyHoaDon: null | string = null
    ): Promise<NhanVienThucHienDto[]> => {
        if (!utils.checkNull(idHoaDon)) {
            const result = await http.get(
                `api/services/app/NhanVienThucHien/GetNhanVienThucHien_byIdHoaDon?idHoaDon=${idHoaDon}&idQuyHoaDon=${idQuyHoaDon}`
            );
            return result.data.result;
        }
        return [];
    };
    GetNhanVienThucHien_byIdHoaDonChiTiet = async (idHoaDonChiTiet: string): Promise<NhanVienThucHienDto[]> => {
        if (!utils.checkNull(idHoaDonChiTiet)) {
            const result = await http.get(
                `api/services/app/NhanVienThucHien/GetNhanVienThucHien_byIdHoaDonChiTiet?idHoaDonChiTiet=${idHoaDonChiTiet}`
            );
            return result.data.result;
        }
        return [];
    };
    UpdateNVThucHien_byIdQuyHoaDon = async (
        idHoaDon: string,
        idQuyHoaDon: string | null = null,
        lstNV: NhanVienThucHienDto[]
    ): Promise<NhanVienThucHienDto[]> => {
        const result = await http.post(
            `api/services/app/NhanVienThucHien/UpdateNVThucHien_byIdQuyHoaDon?idHoaDon=${idHoaDon}&idQuyHoaDon=${idQuyHoaDon}`,
            lstNV
        );
        return result.data;
    };
    UpdateNhanVienThucHienn_byIdHoaDon = async (
        idHoaDon: string,
        lstNV: NhanVienThucHienDto[]
    ): Promise<NhanVienThucHienDto[]> => {
        const result = await http.post(
            `api/services/app/NhanVienThucHien/UpdateNhanVienThucHienn_byIdHoaDon?idHoaDon=${idHoaDon}`,
            lstNV
        );
        return result.data;
    };
    UpdateNVThucHien_byIdHoaDonChiTiet = async (
        idHoaDonChiTiet: string,
        lstNV: NhanVienThucHienDto[]
    ): Promise<NhanVienThucHienDto[]> => {
        const result = await http.post(
            `api/services/app/NhanVienThucHien/UpdateNVThucHien_byIdHoaDonChiTiet?idHoaDonChiTiet=${idHoaDonChiTiet}`,
            lstNV
        );
        return result.data;
    };
    UpdateTienChietKhau_forNhanVien_whenUpdateCTHD = async (
        idHoaDonChiTiet: string,
        soLuongOld: number
    ): Promise<boolean> => {
        if (utils.checkNull_OrEmpty(idHoaDonChiTiet)) {
            return false;
        }
        const result = await http.get(
            `api/services/app/NhanVienThucHien/UpdateTienChietKhau_forNhanVien_whenUpdateCTHD?idHoaDonChiTiet=${idHoaDonChiTiet}&soLuongOld=${soLuongOld}`
        );
        return result.data.result;
    };
}

export default new NhanVienThucHienService();
