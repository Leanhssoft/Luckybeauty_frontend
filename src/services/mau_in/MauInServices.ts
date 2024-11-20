import { LoaiMauIn } from '../../lib/appconst';
import utils from '../../utils/utils';
import http from '../httpService';
import { MauInDto } from './MauInDto';

class MauInServices {
    GetFileMauIn = async (fileName: string) => {
        const xx = await http
            .get(`api/services/app/MauIn/GetFileMauIn?file=${fileName}`)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
    GetContentMauInMacDinh = async (type = LoaiMauIn.K80, idLoaiChungTu = 1) => {
        const xx = await http
            .get(`api/services/app/MauIn/GetContentMauInMacDinh?type=${type}&idLoaiChungTu=${idLoaiChungTu}`)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
    InsertMauIn = async (input: MauInDto) => {
        const xx = await http
            .post(`api/services/app/MauIn/InsertMauIn`, input)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
    UpdatetMauIn = async (input: MauInDto) => {
        const xx = await http
            .post(`api/services/app/MauIn/UpdateMauIn`, input)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
    DeleteMauIn = async (idMauIn: string) => {
        const xx = await http
            .get(`api/services/app/MauIn/DeleteMauIn?id=${idMauIn}`)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
    GetAllMauIn_byChiNhanh = async (idChiNhanh: string | null = null, idLoaiChungTu = 0) => {
        if (utils.checkNull(idChiNhanh)) {
            const xx = await http
                .get(`api/services/app/MauIn/GetAllMauIn_byChiNhanh?idLoaiChungTu=${idLoaiChungTu}`)
                .then((res: { data: { result: any } }) => {
                    return res.data.result;
                });
            return xx;
        } else {
            const xx = await http
                .get(
                    `api/services/app/MauIn/GetAllMauIn_byChiNhanh?idChiNhanh=${idChiNhanh}&idLoaiChungTu=${idLoaiChungTu}`
                )
                .then((res: { data: { result: any } }) => {
                    return res.data.result;
                });
            return xx;
        }
    };
}

export default new MauInServices();
