import utils from '../../utils/utils';
import http from '../httpService';
import { AnhLieuTrinhChiTietDto, AnhLieuTrinhDto } from './AnhLieuTrinhDto';

class AnhLieuTrinhService {
    GetInforImage_OfAnyAnhLieuTrinh = async (): Promise<string> => {
        const xx = await http.get(`api/services/app/AnhLieuTrinh/GetInforImage_OfAnyAnhLieuTrinh`);
        return xx.data.result;
    };
    GetAllAlbum_ofCustomer = async (idKhachHang: string): Promise<AnhLieuTrinhDto[]> => {
        if (utils.checkNull_OrEmpty(idKhachHang)) return [];
        const result = await http.get(
            `api/services/app/AnhLieuTrinh/GetAllAlbum_ofCustomer?idKhachHang=${idKhachHang}`
        );
        return result.data.result;
    };
    GetAllImage_inAlbum = async (albumId: string): Promise<AnhLieuTrinhChiTietDto[]> => {
        if (utils.checkNull_OrEmpty(albumId)) return [];
        const result = await http.get(`api/services/app/AnhLieuTrinh/GetAllImage_inAlbum?albumId=${albumId}`);
        return result.data?.result;
    };
    Insert_AnhLieuTrinh = async (params: AnhLieuTrinhDto): Promise<AnhLieuTrinhDto> => {
        const result = await http.post(`api/services/app/AnhLieuTrinh/Insert_AnhLieuTrinh`, params);
        return result.data?.result;
    };
    Update_AnhLieuTrinh = async (params: AnhLieuTrinhDto): Promise<AnhLieuTrinhDto> => {
        const result = await http.post(`api/services/app/AnhLieuTrinh/Update_AnhLieuTrinh`, params);
        return result.data?.result;
    };
    RemoveAlbum_byId = async (albumId: string): Promise<boolean> => {
        if (utils.checkNull_OrEmpty(albumId)) return false;
        const xx = await http.get(`api/services/app/AnhLieuTrinh/RemoveAlbum_byId?albumId=${albumId}`);
        return xx.data?.result;
    };
    Remove_AnhLieuTrinhChiTiet = async (idChiTietAnh: string) => {
        if (utils.checkNull_OrEmpty(idChiTietAnh)) return false;
        const result = await http.get(
            `api/services/app/AnhLieuTrinh/Remove_AnhLieuTrinhChiTiet?idChiTietAnh=${idChiTietAnh}`
        );
        return result.data;
    };
}

export default new AnhLieuTrinhService();
