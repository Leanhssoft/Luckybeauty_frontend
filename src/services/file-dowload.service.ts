import { makeAutoObservable } from 'mobx';
import AppConsts from '../lib/appconst';
// import { saveAs } from 'file-saver';
import { FileDto, IFileDto } from './dto/FileDto';

class FileDownloadService {
    constructor() {
        makeAutoObservable(this);
    }
    downloadExportFile(file: IFileDto) {
        const url =
            AppConsts.remoteServiceBaseUrl +
            'File/DownloadTempFile?fileType=' +
            file.fileType +
            '&fileToken=' +
            file.fileToken +
            '&fileName=' +
            file.fileName;
        location.href = url; //TODO: This causes reloading of same page in Firefox
        // alert(url);
    }
}

export default new FileDownloadService();
