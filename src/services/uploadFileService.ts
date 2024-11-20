import { util } from 'prettier';
import utils from '../utils/utils';
import { IFileDto } from './dto/FileDto';
import http from './httpService';
import Cookies from 'js-cookie';

class UpLoadFileService {
    async downloadImportTemplate(fileName: string): Promise<IFileDto> {
        const res = await http.get(`/api/upload-file/download-import-template?fileName=${fileName}`);
        return res.data;
    }

    AppendFile_toFormData = (fileImage: File) => {
        const formData = new FormData();
        formData.append('file', fileImage);
        return formData;
    };

    GoogleApi_GetFileIdfromLink = (url: string) => {
        if (!utils.checkNull(url)) {
            const arr = url.split('=');
            if (arr.length === 3) {
                return arr[2];
            }
        }
        return '';
    };

    GoogleApi_NewLink = (url: string) => {
        if (!utils.checkNull(url)) {
            const arr = url.split('=');
            if (arr.length === 3) {
                // https://lh3.googleusercontent.com/d/1lNQmIG-fprdjfZ7hEAEGc_id6acx19v5
                return `https://lh3.googleusercontent.com/d/${arr[2]}`;
            }
        }
        return '';
    };

    GoogleApi_UploaFileToDrive = async (fileSelect: File, subFolder = '') => {
        // const pathFile = URL.createObjectURL(fileSelect); // Lưu trong bộ nhớ của trình duyệt

        // cấu trúc lưu file: luckyBeauty/tenantName/subFolder/fileName
        let tenantName = Cookies.get('TenantName');
        if (utils.checkNull(tenantName)) {
            tenantName = 'Default';
        }
        const fromData = this.AppendFile_toFormData(fileSelect);
        const data = await http
            .post(
                `api/services/app/GoogleAPI/GoogleApi_UploaFileToDrive?tenantName=${tenantName}&subFolder=${subFolder}`,
                fromData
            )
            .then((res) => {
                return res.data.result;
            });
        return data;
    };
    GoogleApi_RemoveFile_byId = async (fileId: string) => {
        if (!utils.checkNull(fileId)) {
            try {
                const data = await http
                    .get(`api/services/app/GoogleAPI/GoogleApi_RemoveFile_byId?fileId=${fileId}`)
                    .then((res) => {
                        return res.data.result;
                    });
                return data;
            } catch (err: any) {
                return true;
            }
        }
        return true;
    };
}

export default new UpLoadFileService();
