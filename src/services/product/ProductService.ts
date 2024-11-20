import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { IHangHoaGroupTheoNhomDto, ModelHangHoaDto, PagedProductSearchDto } from './dto';
import Utils from '../../utils/utils';
import { IFileDto } from '../dto/FileDto';
import { FileUpload } from '../dto/FileUpload';

class ProductService {
    CheckExistsMaHangHoa = async (maHangHoa: string, id?: string) => {
        if (!Utils.checkNull(maHangHoa)) {
            const data = await http
                .get(`api/services/app/HangHoa/CheckExistsMaHangHoa?mahanghoa=${maHangHoa}&id=${id}`)
                .then((res) => {
                    return res.data.result;
                });
            return data;
        } else {
            return false;
        }
    };
    GetInforImage_OfAnyHangHoa = async (): Promise<string> => {
        const xx = await http.get(`api/services/app/HangHoa/GetInforImage_OfAnyHangHoa`);
        return xx.data.result;
    };
    GetDetailProduct = async (id: string): Promise<ModelHangHoaDto> => {
        const data = await http.get(`api/services/app/HangHoa/GetDetailProduct?idDonViQuyDoi=${id}`).then((res) => {
            return res.data.result;
        });
        return data;
    };
    GetInforBasic_OfListHangHoa = async (
        arrIdHangHoa: string[]
    ): Promise<{ id: string; idHangHoa: string; maHangHoa: string; tenHangHoa: string; ma_TenHangHoa: string }[]> => {
        const data = await http
            .post(`api/services/app/HangHoa/GetInforBasic_OfListHangHoa`, arrIdHangHoa)
            .then((res) => {
                return res.data.result;
            });
        return data;
    };
    Get_DMHangHoa = async (input: PagedProductSearchDto): Promise<PagedResultDto<ModelHangHoaDto>> => {
        const xx = await http
            .post(`api/services/app/HangHoa/GetDMHangHoa`, input)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };

    ExportToExcel = async (input: PagedProductSearchDto): Promise<IFileDto> => {
        const response = await http.post('api/services/app/HangHoa/ExportToExcel', input);
        return response.data.result;
    };
    async importHangHoa(input: FileUpload) {
        const response = await http.post('api/services/app/HangHoa/ImportFile_DanhMucHangHoa', input);
        return response.data.result;
    }
    CreateOrEditProduct = async (input: ModelHangHoaDto) => {
        const xx = await http
            .post(`api/services/app/HangHoa/CreateOrEdit`, input)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
    DeleteProduct_byIDHangHoa = async (idHangHoa: string) => {
        const xx = await http
            .post(`api/services/app/HangHoa/Delete?id=${idHangHoa}`)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
    DeleteMultipleProduct = async (lstIdHangHoa: any) => {
        const xx = await http.post(`api/services/app/HangHoa/DeleteMultipleProduct`, lstIdHangHoa);
        return xx.data.success;
    };
    ChuyenNhomHang = async (lstIdHangHoa: any, idNhomHangNew: string) => {
        const xx = await http.post(`api/services/app/HangHoa/ChuyenNhomHang?idNhomHang=${idNhomHangNew}`, lstIdHangHoa);
        return xx.data.success;
    };
    RestoreProduct_byIdHangHoa = async (idHangHoa: string) => {
        const xx = await http
            .post(`api/services/app/HangHoa/RestoreProduct?idHangHoa=${idHangHoa}`)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });

        return xx;
    };
    GetDMHangHoa_groupByNhom = async (input: PagedProductSearchDto) => {
        const xx = await http
            .post(`api/services/app/HangHoa/GetDMHangHoa_groupByNhom`, input)
            .then((res: { data: { result: IHangHoaGroupTheoNhomDto[] } }) => {
                return res.data.result;
            });
        return xx;
    };
}
export default new ProductService();
