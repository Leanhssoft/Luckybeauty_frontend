import { ParamSearchDto } from '../dto/ParamSearchDto';

export default class ParamSearchChiTietSuDungGDVDto extends ParamSearchDto {
    idCustomer: string;
    idGoiDichVu?: string;

    constructor({ idChiNhanhs = [''], textSearch = '', idCustomer = '' }) {
        super({
            idChiNhanhs: idChiNhanhs,
            textSearch: textSearch
        });
        this.idCustomer = idCustomer;
    }
}
