import http from '../httpService';
import { ModelHangHoaDto, ModelNhomHangHoa, PagedProductSearchDto } from './dto';

export const GetDetailProduct = async (id: string) => {
    const data = await http
        .get(`${process.env.REACT_APP_BASE_URL_LOCAL}HangHoa/GetDetailProduct?idDonViQuyDoi=${id}`)
        .then((res) => {
            return res.data.result;
        });
    return data;
};
export const Get_DMHangHoa = async (input: PagedProductSearchDto) => {
    const xx = await http
        .post(`${process.env.REACT_APP_BASE_URL_LOCAL}HangHoa/GetDMHangHoa`, input)
        .then((res: { data: { result: any } }) => {
            return res.data.result;
        });
    return xx;
};
export const CreateOrEditProduct = async (input: ModelHangHoaDto) => {
    const xx = await http
        .post(`${process.env.REACT_APP_BASE_URL_LOCAL}HangHoa/CreateOrEdit`, input)
        .then((res: { data: { result: any } }) => {
            return res.data.result;
        });
    return xx;
};

/* group product */
export const GetNhomHangHoa_byID = async (id: string) => {
    const xx = await http
        .get(`${process.env.REACT_APP_BASE_URL_LOCAL}NhomHangHoa/GetNhomHangHoa_byID?id=${id}`)
        .then((res: { data: { result: any } }) => {
            return res.data.result;
        });
    return xx;
};

export const GetDM_NhomHangHoa = async () => {
    const xx = await http
        .get(`${process.env.REACT_APP_BASE_URL_LOCAL}NhomHangHoa/GetNhomDichVu`)
        .then((res: { data: { result: any } }) => {
            return res.data.result;
        });
    return xx;
};

export const InsertNhomHangHoa = async (param: ModelNhomHangHoa) => {
    const xx = await http
        .post(`${process.env.REACT_APP_BASE_URL_LOCAL}NhomHangHoa/CreateNhomHangHoa`, param)
        .then((res) => {
            return res.data.result;
        });
    return xx;
};
