import { action, makeAutoObservable, observable, toJS } from 'mobx';
import { ModelNhomHangHoa } from '../services/product/dto';
import GroupProductService from '../services/product/GroupProductService';
import { TypeAction } from '../lib/appconst';

class nhomHangHoaStore {
    listAllNhomHang: ModelNhomHangHoa[] = [];
    constructor() {
        makeAutoObservable(this, {
            listAllNhomHang: observable,
            changeListNhomHang: action
        });
    }

    getAllNhomHang = async () => {
        const data = await GroupProductService.GetDM_NhomHangHoa();
        this.listAllNhomHang = data?.items;
    };

    changeListNhomHang = (objNhom: ModelNhomHangHoa, typeAction = TypeAction.INSEART) => {
        switch (typeAction) {
            case TypeAction.INSEART:
                {
                    this.listAllNhomHang = [objNhom, ...this.listAllNhomHang];
                }
                break;
            case TypeAction.UPDATE:
                {
                    this.listAllNhomHang = this.listAllNhomHang.map((item: ModelNhomHangHoa) => {
                        if (item.id === objNhom.id) {
                            return {
                                ...item,
                                color: objNhom?.color,
                                tenNhomHang: objNhom?.tenNhomHang,
                                tenNhomHang_KhongDau: objNhom?.tenNhomHang_KhongDau,
                                laNhomHangHoa: objNhom?.laNhomHangHoa,
                                sLoaiNhomHang: objNhom?.sLoaiNhomHang,
                                idParent: objNhom?.idParent
                            };
                        } else {
                            return item;
                        }
                    });
                }
                break;
            case TypeAction.DELETE:
                {
                    this.listAllNhomHang = this.listAllNhomHang.filter((x) => x.id !== objNhom.id);
                }
                break;
        }
    };
}

export default new nhomHangHoaStore();
