import { RequestFromToDto } from '../dto/ParamSearchDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import http from '../httpService';
import QuyHoaDonDto from '../so_quy/QuyHoaDonDto';
import utils from '../../utils/utils';
import { Guid } from 'guid-typescript';
import { IFileDto } from '../dto/FileDto';
import QuyChiTietDto from './QuyChiTietDto';
import { ParamSearchSoQuyDto } from './Dto/ParamSearchSoQuyDto';
import { IThuChiDauKyCuoiKyDto } from './Dto/IThuChiDauKyCuoiKyDto';
import { HINH_THUC_THANH_TOAN, LoaiChungTu, TrangThaiActive } from '../../lib/appconst';
import { format } from 'date-fns';
import { CreateNhatKyThaoTacDto } from '../nhat_ky_hoat_dong/dto/CreateNhatKyThaoTacDto';
import nhatKyHoatDongService from '../nhat_ky_hoat_dong/nhatKyHoatDongService';

class SoQuyServices {
    CreateQuyHoaDon = async (input: any): Promise<QuyHoaDonDto> => {
        const result = await http.post('api/services/app/QuyHoaDon/Create', input);
        return result.data.result;
    };
    UpdateQuyHoaDon = async (input: any) => {
        const result = await http.post('api/services/app/QuyHoaDon/UpdateQuyHoaDon', input);
        return result.data.result;
    };
    UpdateQuyHD_RemoveCT_andAddAgain = async (input: QuyHoaDonDto): Promise<QuyHoaDonDto> => {
        const result = await http.post('api/services/app/QuyHoaDon/UpdateQuyHD_RemoveCT_andAddAgain', input);
        return result.data.result;
    };
    DeleteSoQuy = async (id: string) => {
        const result = await http.get('api/services/app/QuyHoaDon/Delete?id=' + id);
        return result.data.result;
    };
    KhoiPhucSoQuy = async (id: string): Promise<QuyHoaDonDto> => {
        const result = await http.get('api/services/app/QuyHoaDon/KhoiPhucSoQuy?idQuyHoaDon=' + id);
        return result.data.result;
    };
    UpdateCustomer_toQuyChiTiet = async (idHoaDonLienQuan: string, idKhachHangnew: string): Promise<QuyHoaDonDto> => {
        const result = await http.get(
            `api/services/app/QuyHoaDon/UpdateCustomer_toQuyChiTiet?idHoaDonLienQuan=${idHoaDonLienQuan}&idKhachHangnew=${idKhachHangnew}`
        );
        return result.data.result;
    };
    UpdateNgayLapQuyHD_ifChangeNgayLapHD = async (
        idHoaDonLienQuan: string,
        ngayLapHDNew: string
    ): Promise<QuyHoaDonDto> => {
        const result = await http.get(
            `api/services/app/QuyHoaDon/UpdateNgayLapQuyHD_ifChangeNgayLapHD?idHoaDonLienQuan=${idHoaDonLienQuan}&ngayLapHDNew=${ngayLapHDNew}`
        );
        return result.data.result;
    };
    DeleteMultiple_QuyHoaDon = async (lstId: any) => {
        const result = await http.post('api/services/app/QuyHoaDon/DeleteMultiple_QuyHoaDon', lstId);
        return result.data.success;
    };
    GetNhatKyThanhToan_ofHoaDon = async (idHoaDonLienQuan: string): Promise<QuyHoaDonDto[]> => {
        if (utils.checkNull(idHoaDonLienQuan)) return [];
        const result = await http.get(
            `api/services/app/QuyHoaDon/GetNhatKyThanhToan_ofHoaDon?idHoaDonLienQuan=${idHoaDonLienQuan}`
        );
        return result.data.result;
    };
    HuyPhieuThuChi_ofHoaDonLienQuan = async (idHoaDonLienQuan: string) => {
        const result = await http.get(
            `api/services/app/QuyHoaDon/HuyPhieuThuChi_ofHoaDonLienQuan?idHoaDonLienQuan=${idHoaDonLienQuan}`
        );
        return result.data.result;
    };
    async getAll(input: ParamSearchSoQuyDto): Promise<PagedResultDto<QuyHoaDonDto>> {
        const response = await http.get('api/services/app/QuyHoaDon/GetAll', {
            params: input
        });
        return response.data.result;
    }
    async GetThuChi_DauKyCuoiKy(input: ParamSearchSoQuyDto): Promise<IThuChiDauKyCuoiKyDto> {
        const response = await http.get('api/services/app/QuyHoaDon/GetThuChi_DauKyCuoiKy', {
            params: input
        });
        return response.data.result;
    }

    async ExportToExcel(input: RequestFromToDto): Promise<IFileDto> {
        const response = await http.post('api/services/app/QuyHoaDon/ExportExcelQuyHoaDon', input);
        return response.data.result;
    }
    async GetInforQuyHoaDon_byId(idQuyHD: string): Promise<QuyHoaDonDto | null> {
        if (utils.checkNull_OrEmpty(idQuyHD)) {
            return null;
        }
        const response = await http.get(`api/services/app/QuyHoaDon/GetForEdit?id=${idQuyHD}`);
        return response.data.result;
    }
    async GetQuyChiTiet_byIQuyHoaDon(idQuyHD: string): Promise<QuyChiTietDto[]> {
        const response = await http.get(`api/services/app/QuyHoaDon/GetQuyChiTiet_byIQuyHoaDon?idQuyHoaDon=${idQuyHD}`);
        return response.data.result;
    }
    CheckExistsMaPhieuThuChi = async (maHoaDon: string, idQuy: string | null = null) => {
        if (utils.checkNull(maHoaDon)) {
            return false;
        } else {
            if (utils.checkNull(idQuy)) {
                idQuy = Guid.EMPTY;
            }
            const response = await http.get(
                `api/services/app/QuyHoaDon/CheckExistsMaPhieuThuChi?maphieu=${maHoaDon}&id=${idQuy}`
            );
            return response.data.result;
        }
    };
    savePhieuThu_forHoaDon = async ({
        phaiTT = 0,
        tienDiem = 0,
        tienmat = 0,
        tienPOS = 0,
        tienCK = 0,
        thegiatri = 0,
        tiencoc = 0,
        maPhieuThu = '',
        idQuyHD = '',
        idChiNhanh = '',
        idLoaiChungTu = LoaiChungTu.PHIEU_THU,
        idTaiKhoanChuyenKhoan = null,
        idTaiKhoanPOS = null,
        noiDungThu = '',
        hachToanKinhDoanh = true,
        ngayLapHoaDon = format(new Date(), 'yyyy-MM-dd'),
        hoadon = {
            id: null,
            idKhachHang: null,
            maHoaDon: '',
            tenKhachHang: ''
        }
    }): Promise<QuyHoaDonDto | null> => {
        const lstQuyCT_After: QuyChiTietDto[] = [];
        const shareMoney = this.ShareMoney_QuyHD({
            phaiTT: phaiTT,
            tienmat: tienmat,
            chuyenkhoan: tienCK,
            tienPOS: tienPOS,
            tienDiem: tienDiem,
            thegiatri: thegiatri,
            tiencoc: tiencoc
        });
        const tienMatNew = shareMoney.TienMat,
            tienPosNew = shareMoney.TienPOS,
            tienCKNew = shareMoney.TienChuyenKhoan,
            tienTheGiaTri = shareMoney.TienTheGiaTri,
            tienDiemNew = shareMoney.TTBangDiem;

        if (tienDiemNew > 0) {
            const newQCT = new QuyChiTietDto({
                hinhThucThanhToan: HINH_THUC_THANH_TOAN.DOI_DIEM,
                tienThu: tienDiemNew,
                idHoaDonLienQuan: hoadon?.id,
                idKhachHang: hoadon?.idKhachHang,
                diemThanhToan: 0 // todo
            });
            lstQuyCT_After.push(newQCT);
        }
        if (tienTheGiaTri > 0) {
            const newQCT = new QuyChiTietDto({
                hinhThucThanhToan: HINH_THUC_THANH_TOAN.THE_GIA_TRI,
                tienThu: tienTheGiaTri,
                idHoaDonLienQuan: hoadon?.id,
                idKhachHang: hoadon?.idKhachHang
            });
            lstQuyCT_After.push(newQCT);
        }
        if (tienMatNew > 0) {
            const newQCT = new QuyChiTietDto({
                hinhThucThanhToan: HINH_THUC_THANH_TOAN.TIEN_MAT,
                tienThu: tienMatNew,
                idHoaDonLienQuan: hoadon?.id,
                idKhachHang: hoadon?.idKhachHang
            });
            lstQuyCT_After.push(newQCT);
        }
        if (tienCKNew > 0) {
            const newQCT = new QuyChiTietDto({
                hinhThucThanhToan: HINH_THUC_THANH_TOAN.CHUYEN_KHOAN,
                tienThu: tienCKNew,
                idTaiKhoanNganHang: idTaiKhoanChuyenKhoan,
                idHoaDonLienQuan: hoadon?.id,
                idKhachHang: hoadon?.idKhachHang
            });
            lstQuyCT_After.push(newQCT);
        }
        if (tienPosNew > 0) {
            const newQCT = new QuyChiTietDto({
                hinhThucThanhToan: HINH_THUC_THANH_TOAN.QUYET_THE,
                tienThu: tienPosNew,
                idTaiKhoanNganHang: idTaiKhoanPOS,
                idHoaDonLienQuan: hoadon?.id,
                idKhachHang: hoadon?.idKhachHang
            });
            lstQuyCT_After.push(newQCT);
        }
        const tongThu = lstQuyCT_After.reduce((currentValue: number, item) => {
            return currentValue + item.tienThu;
        }, 0);
        if (tongThu > 0) {
            const quyHD = new QuyHoaDonDto({
                maHoaDon: maPhieuThu,
                idChiNhanh: idChiNhanh,
                idLoaiChungTu: idLoaiChungTu,
                ngayLapHoaDon: ngayLapHoaDon,
                tongTienThu: tongThu,
                noiDungThu: noiDungThu,
                hachToanKinhDoanh: hachToanKinhDoanh
            });
            quyHD.quyHoaDon_ChiTiet = lstQuyCT_After;
            if (utils.checkNull_OrEmpty(idQuyHD)) {
                // insert
                const dataPT = await this.CreateQuyHoaDon(quyHD);
                if (dataPT) {
                    quyHD.maHoaDon = dataPT?.maHoaDon;
                    quyHD.tenNguoiNop = hoadon?.tenKhachHang;
                    await this.saveDiarySoQuy(hoadon?.maHoaDon, quyHD);
                    dataPT.tenNguoiNop = hoadon?.tenKhachHang;
                    dataPT.quyHoaDon_ChiTiet = lstQuyCT_After; // used to print qrCode
                    return dataPT;
                }
            } else {
                quyHD.id = idQuyHD;
                // update (remove & add again)
                const dataPT = await this.UpdateQuyHD_RemoveCT_andAddAgain(quyHD);
                return dataPT;
            }
        }
        return null;
    };

    saveDiarySoQuy = async (maHoaDon: string, quyHD: QuyHoaDonDto) => {
        let ptThanhToan = '';
        const itemMat = quyHD?.quyHoaDon_ChiTiet?.filter((x) => x.hinhThucThanhToan === HINH_THUC_THANH_TOAN.TIEN_MAT);
        if ((itemMat?.length ?? 0) > 0) {
            ptThanhToan += 'Tiền mặt, ';
        }
        const itemCK = quyHD?.quyHoaDon_ChiTiet?.filter(
            (x) => x.hinhThucThanhToan === HINH_THUC_THANH_TOAN.CHUYEN_KHOAN
        );
        if ((itemCK?.length ?? 0) > 0) {
            ptThanhToan += 'Chuyển khoản, ';
        }
        const itemPos = quyHD?.quyHoaDon_ChiTiet?.filter((x) => x.hinhThucThanhToan === HINH_THUC_THANH_TOAN.QUYET_THE);
        if ((itemPos?.length ?? 0) > 0) {
            ptThanhToan += 'POS';
        }
        ptThanhToan = utils.Remove_LastComma(ptThanhToan);
        const diary = {
            idChiNhanh: quyHD?.idChiNhanh,
            noiDung: `Thêm mới phiếu thu ${quyHD?.maHoaDon} cho hóa đơn ${maHoaDon}`,
            chucNang: 'Thêm mới phiếu thu',
            noiDungChiTiet: `<b> Chi tiết phiếu thu: </b> <br /> Mã phiếu thu: ${
                quyHD?.maHoaDon
            }  <br /> Ngày lập: ${format(new Date(quyHD?.ngayLapHoaDon), 'dd/MM/yyyy HH:mm')} <br /> Khách hàng: ${
                quyHD?.tenNguoiNop
            }  <br /> Tổng tiền:  ${Intl.NumberFormat('vi-VN').format(
                quyHD?.tongTienThu
            )} <br /> Phương thức thanh toán: ${ptThanhToan} `,
            loaiNhatKy: 1
        } as CreateNhatKyThaoTacDto;
        nhatKyHoatDongService.createNhatKyThaoTac(diary);
    };
    ShareMoney_QuyHD = (
        // thứ tự thanh toán ưu tiên
        {
            phaiTT = 0,
            tienDiem = 0, // 2
            tienmat = 0, // 4
            tienPOS = 0, // 6
            chuyenkhoan = 0, //5
            thegiatri = 0, // 3
            tiencoc = 0 // 1
        }
    ) => {
        // thutu uutien: 1.coc, 2.diem, 3.thegiatri, 4.mat, 5.pos, 6.chuyenkhoan
        if (tiencoc >= phaiTT) {
            return {
                TienCoc: phaiTT,
                TTBangDiem: 0,
                TienMat: 0,
                TienPOS: 0,
                TienChuyenKhoan: 0,
                TienTheGiaTri: 0
            };
        } else {
            phaiTT = phaiTT - tiencoc;
            if (tienDiem >= phaiTT) {
                return {
                    TienCoc: tiencoc,
                    TTBangDiem: phaiTT,
                    TienMat: 0,
                    TienPOS: 0,
                    TienChuyenKhoan: 0,
                    TienTheGiaTri: 0
                };
            } else {
                phaiTT = phaiTT - tienDiem;
                if (thegiatri >= phaiTT) {
                    return {
                        TienCoc: tiencoc,
                        TTBangDiem: tienDiem,
                        TienMat: 0,
                        TienPOS: 0,
                        TienChuyenKhoan: 0,
                        TienTheGiaTri: Math.abs(phaiTT)
                    };
                } else {
                    phaiTT = phaiTT - thegiatri;
                    if (tienmat >= phaiTT) {
                        return {
                            TienCoc: tiencoc,
                            TTBangDiem: tienDiem,
                            TienMat: Math.abs(phaiTT),
                            TienPOS: 0,
                            TienChuyenKhoan: 0,
                            TienTheGiaTri: thegiatri
                        };
                    } else {
                        phaiTT = phaiTT - tienmat;
                        if (chuyenkhoan >= phaiTT) {
                            return {
                                TienCoc: tiencoc,
                                TTBangDiem: tienDiem,
                                TienMat: tienmat,
                                TienPOS: 0,
                                TienChuyenKhoan: Math.abs(phaiTT),
                                TienTheGiaTri: thegiatri
                            };
                        } else {
                            phaiTT = phaiTT - chuyenkhoan;
                            if (tienPOS >= phaiTT) {
                                return {
                                    TienCoc: tiencoc,
                                    TTBangDiem: tienDiem,
                                    TienMat: tienmat,
                                    TienPOS: Math.abs(phaiTT),
                                    TienChuyenKhoan: chuyenkhoan,
                                    TienTheGiaTri: thegiatri
                                };
                            } else {
                                phaiTT = phaiTT - tienPOS;
                                return {
                                    TienCoc: tiencoc,
                                    TTBangDiem: tienDiem,
                                    TienMat: tienmat,
                                    TienPOS: tienPOS,
                                    TienChuyenKhoan: chuyenkhoan,
                                    TienTheGiaTri: thegiatri
                                };
                            }
                        }
                    }
                }
            }
        }
    };
    AssignAgainQuyChiTiet = (lstQuyCT: QuyChiTietDto[], sumTienKhachTra: number, tongPhaiTra: number) => {
        let lstQuyCT_After: QuyChiTietDto[] = [];
        let tienMat = 0,
            tienPos = 0,
            tienCK = 0;
        let idTaiKhoanPos = null,
            idTaiKhoanCK = null;
        const itemPos = lstQuyCT.filter((x: QuyChiTietDto) => x.hinhThucThanhToan === HINH_THUC_THANH_TOAN.QUYET_THE);
        const itemCK = lstQuyCT.filter((x: QuyChiTietDto) => x.hinhThucThanhToan === HINH_THUC_THANH_TOAN.CHUYEN_KHOAN);
        if (itemPos.length > 0) {
            idTaiKhoanPos = itemPos[0].idTaiKhoanNganHang;
        }
        if (itemCK.length > 0) {
            idTaiKhoanCK = itemCK[0].idTaiKhoanNganHang;
        }

        for (let i = 0; i < lstQuyCT.length; i++) {
            const itFor = lstQuyCT[i];
            switch (itFor.hinhThucThanhToan) {
                case HINH_THUC_THANH_TOAN.TIEN_MAT:
                    tienMat += itFor.tienThu;
                    break;
                case HINH_THUC_THANH_TOAN.QUYET_THE:
                    tienPos += itFor.tienThu;
                    break;
                case HINH_THUC_THANH_TOAN.CHUYEN_KHOAN:
                    tienCK += itFor.tienThu;
                    break;
            }
        }
        if (sumTienKhachTra > tongPhaiTra) {
            const shareMoney = this.ShareMoney_QuyHD({
                phaiTT: tongPhaiTra,
                tienmat: tienMat,
                chuyenkhoan: tienCK,
                tienPOS: tienPos
            });
            const tienMatNew = shareMoney.TienMat,
                tienPosNew = shareMoney.TienPOS,
                tienCKNew = shareMoney.TienChuyenKhoan;

            if (tienMatNew > 0) {
                const newQCT = new QuyChiTietDto({
                    hinhThucThanhToan: HINH_THUC_THANH_TOAN.TIEN_MAT,
                    tienThu: tienMatNew
                });
                lstQuyCT_After.push(newQCT);
            }
            if (tienPosNew > 0) {
                const newQCT = new QuyChiTietDto({
                    hinhThucThanhToan: HINH_THUC_THANH_TOAN.QUYET_THE,
                    tienThu: tienPosNew,
                    idTaiKhoanNganHang: idTaiKhoanPos as null
                });
                lstQuyCT_After.push(newQCT);
            }
            if (tienCKNew > 0) {
                const newQCT = new QuyChiTietDto({
                    hinhThucThanhToan: HINH_THUC_THANH_TOAN.CHUYEN_KHOAN,
                    tienThu: tienCKNew,
                    idTaiKhoanNganHang: idTaiKhoanCK as null
                });
                lstQuyCT_After.push(newQCT);
            }
        } else {
            lstQuyCT_After = [...lstQuyCT.filter((x: QuyChiTietDto) => x.tienThu > 0)];
        }
        return lstQuyCT_After;
    };
}

export default new SoQuyServices();
