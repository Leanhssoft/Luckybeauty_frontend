export class FileDto implements IFileDto {
    fileName!: string;
    fileType!: string;
    fileToken!: string;

    constructor(data?: IFileDto) {
        if (data) {
            Object.assign(this, data);
        }
    }

    init(_data?: any) {
        if (_data) {
            this.fileName = _data.fileName;
            this.fileType = _data.fileType;
            this.fileToken = _data.fileToken;
        }
    }

    static fromJS(data: any): FileDto {
        data = typeof data === 'object' ? data : {};
        const result = new FileDto();
        result.init(data);
        return result;
    }

    toJSON(): IFileDto {
        return {
            fileName: this.fileName,
            fileType: this.fileType,
            fileToken: this.fileToken
        };
    }
}

export interface IFileDto {
    fileName: string;
    fileType: string;
    fileToken: string;
}
