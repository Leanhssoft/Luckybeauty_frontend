import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    Typography,
    TextField,
    Button
} from '@mui/material';
import PercentIcon from '@mui/icons-material/Percent';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import BlockIcon from '@mui/icons-material/Block';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DatePickerCustom from '../../components/DatetimePicker/DatePickerCustom';
import { useContext, useEffect, useState } from 'react';
import AutocompleteCustomer from '../../components/Autocomplete/Customer';
import { format } from 'date-fns';
import { NumericFormat } from 'react-number-format';
import utils from '../../utils/utils';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';
import { IPropModal } from '../../services/dto/IPropsComponent';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import { PropConfirmOKCancel } from '../../utils/PropParentToChild';
import HoaDonService from '../../services/ban_hang/HoaDonService';
import SoQuyServices from '../../services/so_quy/SoQuyServices';
import { LoaiChungTu, LoaiNhatKyThaoTac, TypeAction } from '../../lib/appconst';
import { CreateNhatKyThaoTacDto } from '../../services/nhat_ky_hoat_dong/dto/CreateNhatKyThaoTacDto';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import PageHoaDonDto from '../../services/ban_hang/PageHoaDonDto';
import nhatKyHoatDongService from '../../services/nhat_ky_hoat_dong/nhatKyHoatDongService';
import PaymentsForm from '../ban_hang/thu_ngan/PaymentsForm';
import { FormNumber } from '../../enum/FormNumber';
import DialogButtonClose from '../../components/Dialog/ButtonClose';

const ModalNapTheGiaTri = ({ isShowModal, isNew, idUpdate, onClose, onOK }: IPropModal<PageHoaDonDto>) => {
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;
    const [isSaving, seIsSaving] = useState(false);
    const [isShowModalThanhToan, setIsShowModalThanhToan] = useState(false);
    const [inforPayment, seInforPayment] = useState({
        tienMat: 0,
        tienCK: 0,
        tienPOS: 0,
        idTaiKhoanPos: null,
        idTaiKhoanCK: null,
        noiDungThu: ''
    });
    const [tienKhachDua, setTienKhachDua] = useState(0);
    const [soDuTheGiaTri, setSoDuTheGiaTri] = useState(0);
    const [newTGT, setNewTGT] = useState<PageHoaDonDto>(new PageHoaDonDto({ idLoaiChungTu: LoaiChungTu.THE_GIA_TRI }));
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [confirmDialog, setConfirmDialog] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });
    const tienKhachThieu = (newTGT?.tongThanhToan ?? 0) - tienKhachDua;

    useEffect(() => {
        if (isNew) {
            setNewTGT({
                ...newTGT,
                idLoaiChungTu: LoaiChungTu.THE_GIA_TRI,
                idChiNhanh: chinhanh.id,
                idKhachHang: '',
                tongTienHang: 0,
                pTGiamGiaHD: undefined,
                tongGiamGiaHD: 0,
                tongThanhToan: 0,
                ghiChuHD: '',
                ngayLapHoaDon: format(new Date(), 'yyyy-MM-dd')
            });
        }
    }, [isShowModal]);

    const GetSoDuTheGiaTri_ofKhachHang = async (idKhachHang: string) => {
        const data = await HoaDonService.GetSoDuTheGiaTri_ofKhachHang(idKhachHang);
        setSoDuTheGiaTri(data);
    };

    const changeCustomer = async (item: KhachHangItemDto) => {
        setNewTGT({
            ...newTGT,
            idKhachHang: item?.id?.toString(),
            tenKhachHang: item?.tenKhachHang,
            soDienThoai: item?.soDienThoai
        });
        await GetSoDuTheGiaTri_ofKhachHang(item?.id?.toString());
    };

    const editMucNap = (event: React.ChangeEvent<HTMLInputElement>) => {
        const mucNap = utils.formatNumberToFloat(event.target.value);
        let giamGia = newTGT?.tongGiamGiaHD ?? 0;
        if ((newTGT?.pTGiamGiaHD ?? 0) > 0) {
            giamGia = (mucNap * (newTGT?.pTGiamGiaHD ?? 0)) / 100;
        }
        setNewTGT({
            ...newTGT,
            tongTienHang: mucNap,
            tongThanhToan: mucNap - giamGia
        });
    };
    const editPTGiamGia = (event: React.ChangeEvent<HTMLInputElement>) => {
        const ptGiamGia = utils.formatNumberToFloat(event.target.value);
        const mucNap = newTGT.tongTienHang;
        const giamGia = (newTGT.tongTienHang * ptGiamGia) / 100;

        setNewTGT({
            ...newTGT,
            pTGiamGiaHD: ptGiamGia,
            tongGiamGiaHD: giamGia,
            tongThanhToan: mucNap - giamGia
        });
    };
    const editTongGiamGia = (event: React.ChangeEvent<HTMLInputElement>) => {
        const giamGia = utils.formatNumberToFloat(event.target.value);
        const mucNap = newTGT.tongTienHang;
        const ptGiamGia = (giamGia / mucNap) * 100;

        setNewTGT({
            ...newTGT,
            pTGiamGiaHD: ptGiamGia,
            tongGiamGiaHD: giamGia,
            tongThanhToan: mucNap - giamGia
        });
    };

    useEffect(() => {
        ResetInforPayment();
    }, [newTGT.tongThanhToan]);

    const ResetInforPayment = () => {
        setTienKhachDua(newTGT.tongThanhToan);
        seInforPayment({
            ...inforPayment,
            tienCK: 0,
            tienPOS: 0,
            tienMat: newTGT.tongThanhToan
        });
    };

    const editTienMatKhachDua = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTienKhachDua(utils.formatNumberToFloat(event.target.value));
        seInforPayment({
            ...inforPayment,
            tienCK: 0,
            tienPOS: 0,
            tienMat: utils.formatNumberToFloat(event.target.value)
        });
    };

    const showModalThanhToan = () => {
        setIsShowModalThanhToan(true);
    };
    const onXoaTheNap = async () => {
        //
    };

    const checkSave = async () => {
        if (utils.checkNull_OrEmpty(newTGT?.idKhachHang ?? '')) {
            setObjAlert({ show: true, mes: 'Vui lòng chọn khách hàng khi nạp thẻ', type: 2 });
            return false;
        }
        if (utils.checkNull(newTGT?.tongTienHang?.toString() ?? '') || (newTGT?.tongTienHang ?? 0) === 0) {
            setObjAlert({ show: true, mes: 'Vui lòng nhập mức nạp tiền', type: 2 });
            return false;
        }

        const checkExists = await HoaDonService.CheckExists_MaHoaDon(newTGT?.maHoaDon ?? '');
        if (checkExists) {
            setObjAlert({ show: true, mes: 'Mã thẻ nạp đã tồn tại', type: 2 });
            return false;
        }
        return true;
    };

    const saveDiaryNapThe = async (maHoaDon: string) => {
        const diary = {
            idChiNhanh: chinhanh.id,
            noiDung: `${isNew ? 'Thêm mới' : 'Cập nhật'} thẻ giá trị ${maHoaDon}`,
            chucNang: `Thẻ giá trị`,
            noiDungChiTiet: `<b>Nội dung chi tiết: </b> <br /> Mã thẻ: ${maHoaDon}  <br /> Ngày lập: ${format(
                new Date(newTGT?.ngayLapHoaDon),
                'dd/MM/yyyy HH:mm'
            )} <br /> Khách hàng: ${newTGT?.tenKhachHang}  <br /> Tổng nạp:  ${Intl.NumberFormat('vi-VN').format(
                newTGT?.tongTienHang
            )} <br /> Giảm giá:  ${Intl.NumberFormat('vi-VN').format(
                newTGT?.tongGiamGiaHD
            )}<br /> Phải thanh toán: ${Intl.NumberFormat('vi-VN').format(newTGT?.tongThanhToan)} `,
            loaiNhatKy: isNew ? LoaiNhatKyThaoTac.INSEART : LoaiNhatKyThaoTac.UPDATE
        } as CreateNhatKyThaoTacDto;
        nhatKyHoatDongService.createNhatKyThaoTac(diary);
    };

    const saveTheNap = async () => {
        const check = await checkSave();
        if (!check) {
            return;
        }
        seIsSaving(true);
        if (isSaving) {
            return;
        }

        const dataHD = await HoaDonService.InsertBH_HoaDon(newTGT);
        if (dataHD != null) {
            await saveDiaryNapThe(dataHD?.maHoaDon ?? '');
            const dataPhieuThu = await SoQuyServices.savePhieuThu_forHoaDon({
                phaiTT: newTGT?.tongThanhToan ?? 0,
                tienmat: inforPayment.tienMat,
                tienCK: inforPayment.tienCK,
                tienPOS: inforPayment.tienPOS,
                idTaiKhoanChuyenKhoan: inforPayment.idTaiKhoanCK,
                idTaiKhoanPOS: inforPayment.idTaiKhoanPos,
                noiDungThu: inforPayment.noiDungThu,
                idLoaiChungTu: LoaiChungTu.PHIEU_THU,
                idChiNhanh: chinhanh.id,
                hoadon: {
                    id: (dataHD?.id ?? null) as unknown as null,
                    idKhachHang: (newTGT?.idKhachHang ?? null) as unknown as null,
                    maHoaDon: dataHD?.maHoaDon,
                    tenKhachHang: ''
                }
            });

            const dataAfter = { ...newTGT };
            dataAfter.id = dataHD.id;
            dataAfter.maHoaDon = dataHD?.maHoaDon ?? '';
            dataAfter.daThanhToan = dataPhieuThu?.tongTienThu ?? 0;
            dataAfter.conNo = newTGT?.tongThanhToan - (dataPhieuThu?.tongTienThu ?? 0);
            onOK(TypeAction.INSEART, dataAfter);
        }
    };

    const onAgreeThanhToan = (
        tienTheGiaTri: number,
        tienMat: number,
        tienCK: number,
        tienPOS: number,
        idTaiKhoanPos: string | null,
        idTaiKhoanCK: string | null,
        noiDungThu: string
    ) => {
        setIsShowModalThanhToan(false);
        setTienKhachDua(tienMat + tienCK + tienPOS);
        seInforPayment({
            ...inforPayment,
            tienMat: tienMat,
            tienCK: tienCK,
            tienPOS: tienPOS,
            idTaiKhoanPos: (idTaiKhoanPos ?? null) as unknown as null,
            idTaiKhoanCK: (idTaiKhoanCK ?? null) as unknown as null,
            noiDungThu: noiDungThu
        });
    };

    return (
        <>
            <ConfirmDelete
                isShow={confirmDialog.show}
                title={confirmDialog.title}
                mes={confirmDialog.mes}
                onOk={onXoaTheNap}
                onCancel={() => setConfirmDialog({ ...confirmDialog, show: false })}
            />
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}
            />
            <Dialog open={isShowModalThanhToan} onClose={() => setIsShowModalThanhToan(false)} maxWidth="md">
                <PaymentsForm
                    formNumber={FormNumber.THE_GIA_TRI}
                    tongPhaiTra={newTGT.tongThanhToan}
                    onClose={() => setIsShowModalThanhToan(false)}
                    onSaveHoaDon={onAgreeThanhToan}
                />
            </Dialog>
            <Dialog open={isShowModal} maxWidth="md" fullWidth onClose={onClose}>
                <DialogButtonClose onClose={onClose} />
                <DialogTitle>
                    <span className="modal-title">{isNew ? 'Thêm mới' : 'Cập nhật'} thẻ giá trị</span>
                </DialogTitle>
                <DialogContent>
                    <Grid container padding={2}>
                        <Grid container spacing={5}>
                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <Grid container alignItems={'center'}>
                                    <Grid item lg={4} md={4} sm={5} xs={12}>
                                        <Typography variant="body2" fontWeight={500}>
                                            Mã hóa đơn
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={8} md={8} sm={7} xs={12}>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            placeholder="Mã tự động"
                                            onChange={(e) => setNewTGT({ ...newTGT, maHoaDon: e.target.value })}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container paddingTop={1} alignItems={'center'}>
                                    <Grid item lg={4} md={4} sm={5} xs={12}>
                                        <Typography variant="body2" fontWeight={500}>
                                            Ngày nạp
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={8} md={8} sm={7} xs={12}>
                                        <DatePickerCustom
                                            variant="outlined"
                                            defaultVal={newTGT?.ngayLapHoaDon}
                                            handleChangeDate={(dt) => setNewTGT({ ...newTGT, ngayLapHoaDon: dt })}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <Grid container alignItems={'center'}>
                                    <Grid item lg={4} md={4} sm={5} xs={12}>
                                        <Typography variant="body2" fontWeight={500}>
                                            Khách hàng
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={8} md={8} sm={7} xs={12}>
                                        <AutocompleteCustomer
                                            idChosed={newTGT?.idKhachHang ?? ''}
                                            handleChoseItem={changeCustomer}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container alignItems={'center'} paddingTop={1}>
                                    <Grid item lg={4} md={4} sm={5} xs={12}>
                                        <Typography variant="body2" fontWeight={500}>
                                            Số dư thẻ
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={8} md={8} sm={7} xs={12}>
                                        <Typography variant="body2" fontWeight={500} textAlign={'right'}>
                                            {new Intl.NumberFormat('vi-VN').format(soDuTheGiaTri)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container sx={{ backgroundColor: 'var(--color-bg)', borderRadius: '4px' }} padding={2}>
                        <Grid container spacing={5}>
                            <Grid item lg={6} md={6} sm={6}>
                                <Grid container spacing={1} alignItems={'center'}>
                                    <Grid item lg={12} md={12} sm={12} xs={12} paddingBottom={2}>
                                        <Typography variant="body1" fontWeight={500}>
                                            Thông tin giá trị nạp
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={5} xs={12}>
                                        <Typography variant="body2" fontWeight={500}>
                                            Mức nạp
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={8} md={8} sm={7} xs={12}>
                                        <NumericFormat
                                            className="input-number"
                                            size="small"
                                            fullWidth
                                            value={newTGT.tongTienHang}
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            customInput={TextField}
                                            onChange={editMucNap}
                                        />
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={5} xs={12}>
                                        <Typography variant="body2" fontWeight={500}>
                                            Giảm giá
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={8} md={8} sm={7} xs={12}>
                                        <Stack direction={'row'} justifyContent={'space-between'} spacing={2}>
                                            <TextField
                                                size="small"
                                                className="input-number"
                                                fullWidth
                                                sx={{ flex: 1 }}
                                                value={newTGT?.pTGiamGiaHD ?? ''}
                                                InputProps={{ endAdornment: <PercentIcon sx={{ width: 15 }} /> }}
                                                onChange={editPTGiamGia}
                                            />
                                            <NumericFormat
                                                className="input-number"
                                                size="small"
                                                fullWidth
                                                sx={{ flex: 2 }}
                                                value={newTGT?.tongGiamGiaHD ?? ''}
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                customInput={TextField}
                                                onChange={editTongGiamGia}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={5} xs={12}>
                                        <Typography variant="body2" fontWeight={500}>
                                            Ghi chú
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={8} md={8} sm={7} xs={12}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            rows={3}
                                            multiline
                                            value={newTGT?.ghiChuHD ?? ''}
                                            onChange={(e) => setNewTGT({ ...newTGT, ghiChuHD: e.target.value })}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <Grid container spacing={1} alignItems={'center'}>
                                    <Grid item lg={12} md={12} sm={12} xs={12} paddingBottom={2}>
                                        <Typography variant="body1" fontWeight={500}>
                                            Thông tin thanh toán
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={5} xs={12}>
                                        <Typography variant="body2" fontWeight={500}>
                                            Tổng phải trả
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={8} md={8} sm={7} xs={12}>
                                        <Typography variant="body2" fontWeight={500} textAlign={'right'}>
                                            {new Intl.NumberFormat('vi-VN').format(newTGT?.tongThanhToan ?? 0)}
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={5} xs={12}>
                                        <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
                                            <Typography variant="body2" fontWeight={500}>
                                                Tiền khách đưa
                                            </Typography>
                                            <MonetizationOnIcon onClick={showModalThanhToan} sx={{ width: 20 }} />
                                        </Stack>
                                    </Grid>
                                    <Grid item lg={8} md={8} sm={7} xs={12}>
                                        <NumericFormat
                                            className="input-number"
                                            size="small"
                                            fullWidth
                                            sx={{ flex: 2 }}
                                            value={tienKhachDua}
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            customInput={TextField}
                                            onChange={editTienMatKhachDua}
                                        />
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={5} xs={12}>
                                        <Typography variant="body2" fontWeight={500}>
                                            {tienKhachThieu >= 0 ? ' Còn thiếu' : 'Tiền thừa'}
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={8} md={8} sm={7} xs={12}>
                                        <Typography variant="body2" fontWeight={500} textAlign={'right'}>
                                            {new Intl.NumberFormat('vi-VN').format(Math.abs(tienKhachThieu))}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="error" startIcon={<BlockIcon />} onClick={onClose}>
                        Bỏ qua
                    </Button>
                    <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={saveTheNap}>
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ModalNapTheGiaTri;
