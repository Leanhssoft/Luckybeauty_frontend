import PageHoaDonChiTietDto from '../../../../services/ban_hang/PageHoaDonChiTietDto';
import PageHoaDonDto from '../../../../services/ban_hang/PageHoaDonDto';
import { ChiNhanhDto } from '../../../../services/chi_nhanh/Dto/chiNhanhDto';
import { KhachHangItemDto } from '../../../../services/khach-hang/dto/KhachHangItemDto';
import logoChiNhanh from '../../../../images/logo_Luckybeauty_full.png';
import { CuaHangDto } from '../../../../services/cua_hang/Dto/CuaHangDto';
import utils from '../../../../utils/utils';
import { format } from 'date-fns';
import QuyHoaDonDto from '../../../../services/so_quy/QuyHoaDonDto';
import QuyChiTietDto from '../../../../services/so_quy/QuyChiTietDto';
import TaiKhoanNganHangServices from '../../../../services/so_quy/TaiKhoanNganHangServices';
import { TaiKhoanNganHangDto } from '../../../../services/so_quy/Dto/TaiKhoanNganHangDto';
import { HINH_THUC_THANH_TOAN } from '../../../../lib/appconst';

const dv1 = new PageHoaDonChiTietDto({
    maHangHoa: 'DV01',
    tenHangHoa: 'Chăm sóc da mặt',
    soLuong: 1,
    giaBan: 100000
});

const dv2 = new PageHoaDonChiTietDto({
    maHangHoa: 'DV02',
    tenHangHoa: 'Gội nữ',
    soLuong: 2,
    giaBan: 80000
});
const congty = {
    tenCongTy: 'MAIANH HAIR SALON',
    soDienThoai: '0243.565.789',
    diaChi: 'Số 112, Tây Hồ, Hoàn Kiếm, HN',
    website: 'MaiAnhHairSalon.luckybeauty.vn',
    logo: logoChiNhanh
} as CuaHangDto;
const chinhanh = {
    maChiNhanh: 'CN01',
    tenChiNhanh: 'Chi nhánh Hà Nội',
    soDienThoai: '0978000854' as unknown as null,
    diaChi: '31 Lê Văn Lương',
    maSoThue: '',
    logo: logoChiNhanh as unknown as null
} as ChiNhanhDto;
const khachhang = {
    maKhachHang: 'KH001',
    tenKhachHang: 'Anh B',
    avatar: '',
    soDienThoai: '0975482120',
    diaChi: 'Hai Bà Trưng, HN',
    tenNhomKhach: 'Nhóm khách 01'
} as KhachHangItemDto;

const hoadon = new PageHoaDonDto({
    maHoaDon: 'HD001',
    ngayLapHoaDon: new Date().toString(),
    tenKhachHang: 'Anh B',
    tongTienHang: 1000000
});
hoadon.tongTienHangChuaChietKhau = 1100000;
hoadon.tongChietKhauHangHoa = 100000;
hoadon.tongGiamGiaHD = 20000;
hoadon.tongTienThue = 8000;
hoadon.tongTienHDSauVAT = 988000;
hoadon.tongThanhToan = 988000;
hoadon.pTGiamGiaHD = 2;
hoadon.ptThueHD = 0.8;
hoadon.daThanhToan = 500000;
hoadon.tenNhanVien = 'TN01';

const phieuthu = new QuyHoaDonDto({
    maHoaDon: 'SQPT001',
    ngayLapHoaDon: new Date().toString(),
    tongTienThu: 50000,
    noiDungThu: 'Thu bán hàng'
});
phieuthu.maNguoiNop = khachhang.maKhachHang;
phieuthu.tenNguoiNop = khachhang.tenKhachHang;
phieuthu.sdtNguoiNop = khachhang.soDienThoai;
phieuthu.quyHoaDon_ChiTiet = [
    { maHoaDonLienQuan: 'HD001', hinhThucThanhToan: 1, tienThu: 10000 } as QuyChiTietDto,
    {
        maHoaDonLienQuan: 'HD001',
        hinhThucThanhToan: 2,
        tienThu: 20000,
        tenChuThe: 'Nguyễn Huyền Trang',
        soTaiKhoan: '000222555',
        tenNganHang: 'Techcombank',
        maPinNganHang: '970407'
    } as QuyChiTietDto,
    {
        maHoaDonLienQuan: 'HD002',
        hinhThucThanhToan: 3,
        tienThu: 30000,
        tenChuThe: 'Nguyễn Linh Châu',
        soTaiKhoan: '000111555',
        tenNganHang: 'MBBank',
        maPinNganHang: '970422'
    } as QuyChiTietDto
];

class DataMauIn {
    congty = congty;
    khachhang = khachhang;
    chinhanh = chinhanh;
    hoadon = hoadon;
    phieuthu = phieuthu;
    hoadonChiTiet = [dv1, dv2];
    replaceChiNhanh = (shtml: string) => {
        let data = shtml;
        data = data.replaceAll('{TenCuaHang}', this.congty.tenCongTy.toUpperCase());
        data = data.replaceAll(
            '{LogoCuaHang}',
            `<img style="width: 100%" src=${utils.checkNull(this.congty.logo) ? logoChiNhanh : this.congty.logo} />`
        );
        data = data.replaceAll('{DiaChiCuaHang}', this.congty.diaChi);
        data = data.replaceAll('{DienThoaiCuaHang}', this.congty.soDienThoai);
        data = data.replaceAll(
            '{LogoChiNhanh}',
            `<img style="width: 100%" src=${utils.checkNull(this.chinhanh.logo) ? logoChiNhanh : this.chinhanh.logo} />`
        );
        data = data.replaceAll('{TenChiNhanh}', this.chinhanh.tenChiNhanh.toUpperCase());
        data = data.replaceAll('{DienThoaiChiNhanh}', this.chinhanh.soDienThoai ?? '');
        data = data.replaceAll('{DiaChiChiNhanh}', this.chinhanh.diaChi ?? '');
        return data;
    };
    replacePhieuThuChi = async (shtml: string) => {
        let data = shtml;

        data = data.replaceAll('{MaPhieuThuChi}', this.phieuthu?.maHoaDon ?? '');
        data = data.replaceAll(
            '{NgayLapPhieu}',
            format(new Date(this.phieuthu?.ngayLapHoaDon ?? ''), 'dd/MM/yyyy HH:mm:ss')
        );
        data = data.replaceAll('{NguoiNopTien}', this.phieuthu?.tenNguoiNop ?? '');
        data = data.replaceAll('{SDTNguoiNop}', this.phieuthu?.sdtNguoiNop ?? '');
        data = data.replaceAll('{GiaTriPhieu}', new Intl.NumberFormat('vi-VN').format(this.phieuthu?.tongTienThu));
        data = data.replaceAll('{NoiDungThu}', this.phieuthu?.noiDungThu ?? '');
        data = data.replaceAll('{TienBangChu}', utils.DocSo(this.phieuthu.tongTienThu));
        if (this.phieuthu.quyHoaDon_ChiTiet !== undefined && this.phieuthu.quyHoaDon_ChiTiet?.length > 0) {
            const quyTM = this.phieuthu.quyHoaDon_ChiTiet.filter(
                (x: QuyChiTietDto) => x.hinhThucThanhToan === HINH_THUC_THANH_TOAN.TIEN_MAT
            );
            const tienMat = quyTM.length > 0 ? quyTM[0].tienThu : 0;
            const quyCK = this.phieuthu.quyHoaDon_ChiTiet.filter(
                (x: QuyChiTietDto) => x.hinhThucThanhToan === HINH_THUC_THANH_TOAN.CHUYEN_KHOAN
            );
            const tienCK = quyCK.length > 0 ? quyCK[0].tienThu : 0;
            const quyPos = this.phieuthu.quyHoaDon_ChiTiet.filter(
                (x: QuyChiTietDto) => x.hinhThucThanhToan === HINH_THUC_THANH_TOAN.QUYET_THE
            );
            const tienPOS = quyPos.length > 0 ? quyPos[0].tienThu : 0;

            data = data.replaceAll('{TienMat}', new Intl.NumberFormat('vi-VN').format(tienMat));
            data = data.replaceAll('{TienPOS}', new Intl.NumberFormat('vi-VN').format(tienPOS));
            data = data.replaceAll('{TienChuyenKhoan}', new Intl.NumberFormat('vi-VN').format(tienCK));
            data = data.replaceAll('{TienMat_BangChu}', utils.DocSo(tienMat));
            data = data.replaceAll('{TienPOS_BangChu}', utils.DocSo(tienPOS));
            data = data.replaceAll('{TienChuyenKhoan_BangChu}', utils.DocSo(tienCK));
            let sHoaDonLienQuan = '';
            const arrHDLienQuan = this.phieuthu.quyHoaDon_ChiTiet?.filter(
                (x: QuyChiTietDto) => !utils.checkNull(x?.maHoaDonLienQuan)
            );

            if (arrHDLienQuan !== undefined && arrHDLienQuan?.length > 0) {
                const arrMa = arrHDLienQuan
                    ?.map((item: QuyChiTietDto) => {
                        return item.maHoaDonLienQuan;
                    })
                    .sort();
                sHoaDonLienQuan = Array.from(new Set(arrMa))?.toString();
            }
            data = data.replaceAll('{HoaDonLienQuan}', sHoaDonLienQuan);

            if (shtml.includes('QRCode')) {
                let qrCode = '';

                if (quyCK.length > 0) {
                    const bankAcc = await TaiKhoanNganHangServices.GetBankAccount_byId(
                        quyCK[0].idTaiKhoanNganHang ?? ''
                    );
                    if (bankAcc != null) {
                        qrCode = await TaiKhoanNganHangServices.GetQRCode(
                            {
                                tenChuThe: bankAcc.tenChuThe,
                                soTaiKhoan: bankAcc.soTaiKhoan,
                                tenNganHang: bankAcc.tenNganHang,
                                maPinNganHang: bankAcc.maPinNganHang
                            } as TaiKhoanNganHangDto,
                            tienCK,
                            this.phieuthu?.tenNguoiNop,
                            sHoaDonLienQuan
                        );
                    }
                } else {
                    if (quyPos.length > 0) {
                        const bankAcc = await TaiKhoanNganHangServices.GetBankAccount_byId(
                            quyPos[0].idTaiKhoanNganHang ?? ''
                        );
                        if (bankAcc != null) {
                            qrCode = await TaiKhoanNganHangServices.GetQRCode(
                                {
                                    tenChuThe: bankAcc.tenChuThe,
                                    soTaiKhoan: bankAcc.soTaiKhoan,
                                    tenNganHang: bankAcc.tenNganHang,
                                    maPinNganHang: bankAcc.maPinNganHang
                                } as TaiKhoanNganHangDto,
                                tienPOS,
                                this.phieuthu?.tenNguoiNop,
                                sHoaDonLienQuan
                            );
                        }
                    }
                }
                if (utils.checkNull(qrCode)) {
                    // get default first tknganhang (order by createtime desc)
                    const firstAcc = await TaiKhoanNganHangServices.GetDefault_TaiKhoanNganHang(
                        this.phieuthu.idChiNhanh as undefined
                    );
                    if (firstAcc !== null) {
                        qrCode = await TaiKhoanNganHangServices.GetQRCode(
                            {
                                tenChuThe: firstAcc.tenChuThe,
                                soTaiKhoan: firstAcc.soTaiKhoan,
                                tenNganHang: firstAcc.tenNganHang,
                                maPinNganHang: firstAcc.maPinNganHang
                            } as TaiKhoanNganHangDto,
                            tienCK > 0 ? tienCK : this.hoadon.tongThanhToan,
                            this.phieuthu?.tenNguoiNop,
                            sHoaDonLienQuan
                        );
                    }
                }
                data = data.replaceAll('{QRCode}', `<img style="width: 100%" src=${qrCode} />`);
            }
        }

        return data;
    };

    replaceHoaDon = (shtml: string) => {
        let data = shtml;
        data = data.replaceAll('{TenKhachHang}', this.khachhang.tenKhachHang);
        data = data.replaceAll('{DiaChiKhachHang}', this.khachhang.diaChi ?? '');
        data = data.replaceAll('{DienThoaiKhachHang}', this.khachhang.soDienThoai ?? '');

        data = data.replaceAll('{MaHoaDon}', this.hoadon.maHoaDon);
        data = data.replaceAll('{NgayBan}', format(new Date(this.hoadon?.ngayLapHoaDon ?? ''), 'dd/MM/yyyy HH:mm:ss'));
        data = data.replaceAll(
            '{NgayLapHoaDon}',
            format(new Date(this.hoadon?.ngayLapHoaDon ?? ''), 'dd/MM/yyyy HH:mm:ss')
        );
        data = data.replaceAll('{NhanVienBanHang}', this.hoadon.tenNhanVien ?? '');
        data = data.replaceAll('{GhiChuHD}', this.hoadon.ghiChuHD ?? '');

        data = data.replaceAll(
            '{TongTienHangChuaChietKhau}',
            new Intl.NumberFormat('vi-VN').format(this.hoadon.tongTienHangChuaChietKhau)
        );
        data = data.replaceAll(
            '{TongChietKhauHangHoa}',
            new Intl.NumberFormat('vi-VN').format(this.hoadon.tongChietKhauHangHoa)
        );
        data = data.replaceAll('{TongTienHang}', new Intl.NumberFormat('vi-VN').format(this.hoadon.tongTienHang));
        data = data.replaceAll('{PTThueHD}', this.hoadon.ptThueHD?.toString() ?? '0');
        data = data.replaceAll('{TongTienThue}', new Intl.NumberFormat('vi-VN').format(this.hoadon.tongTienThue ?? 0));
        data = data.replaceAll(
            '{TongTienHDSauVAT}',
            new Intl.NumberFormat('vi-VN').format(this.hoadon.tongTienHDSauVAT ?? 0)
        );
        data = data.replaceAll('{PTGiamGiaHD}', this.hoadon.pTGiamGiaHD?.toString() ?? '0');
        data = data.replaceAll('{TongGiamGiaHD}', new Intl.NumberFormat('vi-VN').format(this.hoadon.tongGiamGiaHD));
        data = data.replaceAll('{TongThanhToan}', new Intl.NumberFormat('vi-VN').format(this.hoadon.tongThanhToan));

        // thanh toan
        data = data.replaceAll('{DaThanhToan}', new Intl.NumberFormat('vi-VN').format(this.hoadon.daThanhToan ?? 0));
        data = data.replaceAll('{NoHoaDon}', new Intl.NumberFormat('vi-VN').format(this.hoadon.conNo ?? 0));
        data = data.replaceAll('{NoHoaDon_BangChu}', utils.DocSo(this.hoadon.conNo));
        data = data.replaceAll('{TienBangChu}', utils.DocSo(this.hoadon.daThanhToan));

        return data;
    };
    replaceChiTietHoaDon = (shtml: string) => {
        let data = shtml;
        // find table contain cthd
        let cthd_from = data.lastIndexOf('tbody', data.indexOf('{TenHangHoa')) - 1;
        let cthd_to = data.indexOf('tbody', data.indexOf('{TenHangHoa')) + 6;
        let contain_Ten = true;
        if (cthd_from < 0) {
            cthd_from = data.lastIndexOf('tbody', data.indexOf('{MaHangHoa}')) - 1;
            cthd_to = data.indexOf('tbody', data.indexOf('{MaHangHoa}')) + 6;
            contain_Ten = false;
        }
        const sTempCTHD = data.substring(cthd_from, cthd_to);

        let tr1_from = -1,
            tr1_to = -1;
        if (contain_Ten) {
            tr1_from = sTempCTHD.lastIndexOf('tr', sTempCTHD.indexOf('{TenHangHoa}')) - 1;
            tr1_to = sTempCTHD.indexOf('tr', sTempCTHD.indexOf('{TenHangHoa}')) + 3;
        } else {
            tr1_from = sTempCTHD.lastIndexOf('tr', sTempCTHD.indexOf('{MaHangHoa}'));
            tr1_to = sTempCTHD.indexOf('tr', sTempCTHD.indexOf('{MaHangHoa}'));
        }

        const tr2_from = sTempCTHD.lastIndexOf('tr', sTempCTHD.indexOf('{SoLuong}')) - 1;
        const tr2_to = sTempCTHD.indexOf('tr', sTempCTHD.indexOf('{SoLuong}')) + 3;

        let cthdContentCopy = '',
            cthdContent = '';

        if (tr2_from > 0 && tr2_from !== tr1_from) {
            // tenhanghoa + soluong # row
            cthdContentCopy = sTempCTHD.substring(tr1_from, tr2_to); // keep string
            cthdContent = cthdContentCopy;

            data = data.replace(cthdContentCopy, cthdContent);
        } else {
            // tenhanghoa + soluong same row
            cthdContentCopy = sTempCTHD.substring(tr1_from, tr1_to); // keep string
            cthdContent = cthdContentCopy;
        }
        for (let i = 0; i < this.hoadonChiTiet.length; i++) {
            const forCTHD = this.hoadonChiTiet[i];
            if (i === 0) {
                cthdContent = cthdContent.replaceAll('{STT}', forCTHD.stt.toString());
                cthdContent = cthdContent.replaceAll('{TenHangHoa}', forCTHD.tenHangHoa);
                cthdContent = cthdContent.replaceAll(
                    '{SoLuong}',
                    new Intl.NumberFormat('vi-VN').format(forCTHD.soLuong)
                );
                cthdContent = cthdContent.replaceAll(
                    '{DonGiaSauCK}',
                    new Intl.NumberFormat('vi-VN').format(forCTHD.donGiaSauCK ?? 0)
                );
                cthdContent = cthdContent.replaceAll(
                    '{ThanhTienSauCK}',
                    new Intl.NumberFormat('vi-VN').format(forCTHD.thanhTienSauCK ?? 0)
                );
            } else {
                let newRow = cthdContentCopy;
                newRow = newRow.replaceAll('{TenHangHoa}', forCTHD.tenHangHoa);
                newRow = newRow.replaceAll('{SoLuong}', new Intl.NumberFormat('vi-VN').format(forCTHD.soLuong));
                newRow = newRow.replaceAll(
                    '{DonGiaSauCK}',
                    new Intl.NumberFormat('vi-VN').format(forCTHD.donGiaSauCK ?? 0)
                );
                newRow = newRow.replaceAll(
                    '{ThanhTienSauCK}',
                    new Intl.NumberFormat('vi-VN').format(forCTHD.thanhTienSauCK ?? 0)
                );
                cthdContent = cthdContent.concat(newRow);
            }
        }
        data = data.replace(cthdContentCopy, cthdContent);

        return data;
    };

    Print = (contentHtml: string) => {
        contentHtml = contentHtml.replaceAll('figure', 'div');

        const link = `<link rel="stylesheet" type="text/css" media="print" href="./styleCkeditor.css" />`;
        const allContent = `<div class="ck-content"> ${link} ${contentHtml} </div>`;
        const newIframe = document.createElement('iframe');
        newIframe.height = '0';
        newIframe.src = 'about:blank';
        document.body.appendChild(newIframe);
        newIframe.src = 'javascript:window["contents"]';
        newIframe.focus();
        const pri = newIframe.contentWindow;
        pri?.document.open();
        pri?.document.write(allContent);
        pri?.document.close();
        pri?.focus();
        pri?.print();

        newIframe.style.display = 'none';

        // setTimeout(function () {
        //     pri?.print();
        // }, 1000);
        // return allContent;
    };
}

export default new DataMauIn();
