import Dexie, { Table } from 'dexie';
import PageHoaDonDto from '../../services/ban_hang/PageHoaDonDto';
import { PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';
import { useContext } from 'react';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import Cookies from 'js-cookie';
import utils from '../../utils/utils';
import { format } from 'date-fns';
import { LoaiChungTu } from '../appconst';

export class SubClassDexie extends Dexie {
    hoaDon!: Table<PageHoaDonDto>;
    khachCheckIn!: Table<PageKhachHangCheckInDto>;

    constructor() {
        super('DBTest');
        this.version(1).stores({
            hoaDon: '&id, idKhachHang',
            khachCheckIn: '&idCheckIn, idKhachHang'
        });
        this.version(2)
            .stores({
                hoaDon: '&id, idKhachHang, idChiNhanh' // add column idChiNhanh
            })
            .upgrade((x) => {
                // update idChiNhanh for cache hdOld (if idChiNhanh null)
                const appContext = useContext(AppContext);
                const chinhanh = appContext.chinhanhCurrent;
                const idChiNhanh = chinhanh.id ?? Cookies.get('IdChiNhanh');
                return x
                    .table('hoaDon')
                    .filter((o) => utils.checkNull(o.idChiNhanh))
                    .modify((o) => (o.idChiNhanh = idChiNhanh));
            });
        this.version(3)
            .stores({
                hoaDon: '&id, idKhachHang, idChiNhanh, idCheckIn' // add column idCheckIn
            })
            .upgrade((x) => {
                // update idCheckIn for cache hdOld
                return x
                    .table('hoaDon')
                    .filter((o) => utils.checkNull(o.idCheckIn))
                    .modify(async (o) => {
                        const datCheckIn = await x
                            .table('khachCheckIn')
                            .where('idKhachHang')
                            .equals(o.idKhachHang)
                            .toArray();
                        if (datCheckIn.length > 0) {
                            o.idCheckIn = datCheckIn[0].idCheckIn;
                        } else {
                            x.table('hoaDon').delete(o.id);
                        }
                    });
            });
        this.version(4).stores({
            khachCheckIn: null // remove table
        });
        this.version(5)
            .stores({
                hoaDon: '&id, idKhachHang, idChiNhanh, idCheckIn, ngayLapHoaDon' // add column ngayLapHoaDon: used to sortby
            })
            .upgrade((x) => {
                // find ngayLapHoaDon in cache && update
                // else assign new Date()
                return x
                    .table('hoaDon')
                    .filter((o) => utils.checkNull(o.ngayLapHoaDon))
                    .modify(async (o) => {
                        const hdCache = await x.table('hoaDon').get(o.id);
                        if (hdCache.length > 0) {
                            o.ngayLapHoaDon = hdCache.ngayLapHoaDon;
                        } else {
                            o.ngayLapHoaDon = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
                        }
                    });
            });
        this.version(6)
            .stores({
                // isOpenLast: là hóa đơn vừa được mở ra xem cuối cùng
                hoaDon: '&id, idKhachHang, idChiNhanh, idCheckIn, ngayLapHoaDon, idLoaiChungTu, maHoaDon' // add column loaiHoaDon,isOpenLast
            })

            .upgrade((x) => {
                return x
                    .table('hoaDon')
                    .filter((o) => utils.checkNull(o.idLoaiChungTu))
                    .modify(async (o, index) => {
                        o.idLoaiChungTu = LoaiChungTu.HOA_DON_BAN_LE;
                        o.maHoaDon = 'HD0' + index;
                    });
            });
    }
}
export const dbDexie = new SubClassDexie();
