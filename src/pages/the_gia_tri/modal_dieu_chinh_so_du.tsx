import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import BlockIcon from '@mui/icons-material/Block';
import DatePickerCustom from '../../components/DatetimePicker/DatePickerCustom';
import AutocompleteCustomer from '../../components/Autocomplete/Customer';
import PageHoaDonDto from '../../services/ban_hang/PageHoaDonDto';
import { useContext, useEffect, useState } from 'react';
import { PropConfirmOKCancel } from '../../utils/PropParentToChild';
import HoaDonService from '../../services/ban_hang/HoaDonService';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';
import { LoaiChungTu, LoaiNhatKyThaoTac, TypeAction } from '../../lib/appconst';
import { IPropModal } from '../../services/dto/IPropsComponent';
import DialogButtonClose from '../../components/Dialog/ButtonClose';
import { CreateNhatKyThaoTacDto } from '../../services/nhat_ky_hoat_dong/dto/CreateNhatKyThaoTacDto';
import nhatKyHoatDongService from '../../services/nhat_ky_hoat_dong/nhatKyHoatDongService';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import { format } from 'date-fns';
import { NumericFormat } from 'react-number-format';
import utils from '../../utils/utils';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import HoaDonDto from '../../services/ban_hang/HoaDonDto';

const ModalDieuChinhSoDuTGT = ({ isShowModal, isNew, objUpDate, onClose, onOK }: IPropModal<PageHoaDonDto>) => {
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;
    const [isSaving, seIsSaving] = useState(false);
    const [soDuTheGiaTri, setSoDuTheGiaTri] = useState(0);
    const [newTGT, setNewTGT] = useState<PageHoaDonDto>(
        new PageHoaDonDto({ idLoaiChungTu: LoaiChungTu.PHIEU_DIEU_CHINH_TGT })
    );
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [confirmDialog, setConfirmDialog] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });

    useEffect(() => {
        if (isShowModal) {
            seIsSaving(false);
            if (isNew) {
                setNewTGT({
                    ...newTGT,
                    idLoaiChungTu: LoaiChungTu.PHIEU_DIEU_CHINH_TGT,
                    idChiNhanh: chinhanh.id,
                    idKhachHang: '',
                    tongTienHang: 0,
                    tongThanhToan: 0,
                    ghiChuHD: '',
                    ngayLapHoaDon: format(new Date(), 'yyyy-MM-dd')
                });
            } else {
                if (objUpDate) {
                    const ngayDieuChinh = format(new Date(objUpDate?.ngayLapHoaDon ?? new Date()), 'yyyy-MM-dd');
                    setNewTGT({
                        ...newTGT,
                        id: objUpDate?.id,
                        idLoaiChungTu: LoaiChungTu.PHIEU_DIEU_CHINH_TGT,
                        idChiNhanh: objUpDate?.idChiNhanh,
                        idKhachHang: objUpDate?.idKhachHang,
                        tenKhachHang: objUpDate?.tenKhachHang,
                        soDienThoai: objUpDate?.soDienThoai,
                        tongTienHang: objUpDate?.tongTienHang,
                        tongThanhToan: objUpDate?.tongThanhToan,
                        tongTienHangChuaChietKhau: objUpDate?.tongTienHangChuaChietKhau,
                        tongTienHDSauVAT: objUpDate?.tongTienHDSauVAT,
                        ghiChuHD: objUpDate?.ghiChuHD,
                        ngayLapHoaDon: ngayDieuChinh
                    });
                    GetSoDuTheGiaTri_ofKhachHang(objUpDate?.idKhachHang ?? '', ngayDieuChinh);
                }
            }
        }
    }, [isShowModal]);

    const GetSoDuTheGiaTri_ofKhachHang = async (idKhachHang: string, toDate?: string) => {
        const data = await HoaDonService.GetSoDuTheGiaTri_ofKhachHang(idKhachHang, toDate);
        setSoDuTheGiaTri(data);
    };

    const changeCustomer = async (item: KhachHangItemDto) => {
        setNewTGT({
            ...newTGT,
            idKhachHang: item?.id?.toString(),
            tenKhachHang: item?.tenKhachHang,
            soDienThoai: item?.soDienThoai
        });
        await GetSoDuTheGiaTri_ofKhachHang(item?.id?.toString(), newTGT?.ngayLapHoaDon);
    };

    const saveDiaryPhieuDieuChinh = async (maHoaDon: string) => {
        const diary = {
            idChiNhanh: chinhanh.id,
            noiDung: `${isNew ? 'Thêm mới' : 'Cập nhật'} phiếu điều chỉnh số dư thẻ giá trị ${maHoaDon}`,
            chucNang: `Phiếu điều chỉnh số dư thẻ giá trị`,
            noiDungChiTiet: `<b>Nội dung chi tiết: </b> <br /> Mã phiếu: ${maHoaDon}  <br /> Ngày lập: ${format(
                new Date(newTGT?.ngayLapHoaDon),
                'dd/MM/yyyy HH:mm'
            )} <br /> Khách hàng: ${newTGT?.tenKhachHang}  <br /> Số dư hiện tại:  ${Intl.NumberFormat('vi-VN').format(
                soDuTheGiaTri
            )} <br /> Số dư điều chỉnh:  ${Intl.NumberFormat('vi-VN').format(
                newTGT?.tongTienHang ?? 0
            )}<br /> Ghi chú: ${newTGT?.ghiChuHD ?? ''} `,
            loaiNhatKy: isNew ? LoaiNhatKyThaoTac.INSEART : LoaiNhatKyThaoTac.UPDATE
        } as CreateNhatKyThaoTacDto;
        nhatKyHoatDongService.createNhatKyThaoTac(diary);
    };

    const checkSave = async () => {
        if (utils.checkNull_OrEmpty(newTGT?.idKhachHang ?? '')) {
            setObjAlert({ show: true, mes: 'Vui lòng chọn khách hàng', type: 2 });
            return false;
        }
        if (utils.checkNull(newTGT?.tongTienHang?.toString() ?? '')) {
            setObjAlert({ show: true, mes: 'Vui lòng nhập số dư điều chỉnh', type: 2 });
            return false;
        }
        // const checkExists = await HoaDonService.CheckExists_MaHoaDon(newTGT?.maHoaDon ?? '');
        // if (checkExists) {
        //     setObjAlert({ show: true, mes: 'Mã phiếu đã tồn tại', type: 2 });
        //     return false;
        // }
        return true;
    };

    const savePhieuDieuChinh = async () => {
        const check = await checkSave();
        if (!check) {
            return;
        }
        seIsSaving(true);
        if (isSaving) {
            return;
        }
        let dataHD: HoaDonDto | null;
        if (isNew) {
            dataHD = await HoaDonService.InsertBH_HoaDon(newTGT);
        } else {
            dataHD = await HoaDonService.Update_InforHoaDon(newTGT);
        }

        if (dataHD != null) {
            await saveDiaryPhieuDieuChinh(dataHD?.maHoaDon ?? '');
            const dataAfter = { ...newTGT };
            dataAfter.id = dataHD.id;
            dataAfter.maHoaDon = dataHD?.maHoaDon ?? '';
            onOK(isNew ? TypeAction.INSEART : TypeAction.UPDATE, dataAfter);
        }
    };
    const onXoaPhieuDieuChinh = async () => {
        await HoaDonService.DeleteHoaDon(objUpDate?.id ?? '');
        setConfirmDialog({ ...confirmDialog, show: false });
        setObjAlert({ ...objAlert, show: true, mes: `Hủy phiếu điều chỉnh thành công` });

        const diary = {
            idChiNhanh: chinhanh?.id,
            chucNang: `Danh mục phiếu điều chỉnh`,
            noiDung: `Xóa phiếu điều chỉnh`,
            noiDungChiTiet: `Xóa phiếu điều chỉnh ${objUpDate?.maHoaDon} của khách hàng ${objUpDate?.tenKhachHang}`,
            loaiNhatKy: LoaiNhatKyThaoTac.DELETE
        } as CreateNhatKyThaoTacDto;
        await nhatKyHoatDongService.createNhatKyThaoTac(diary);
    };

    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}
            />
            <ConfirmDelete
                isShow={confirmDialog.show}
                title={confirmDialog.title}
                mes={confirmDialog.mes}
                onOk={onXoaPhieuDieuChinh}
                onCancel={() => setConfirmDialog({ ...confirmDialog, show: false })}
            />
            <Dialog open={isShowModal} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogButtonClose onClose={onClose} />
                <DialogTitle>
                    <span className="modal-title">{isNew ? 'Thêm mới' : 'Cập nhật'} Phiếu điều chỉnh </span>
                </DialogTitle>
                <DialogContent>
                    <Stack padding={1}>
                        <Stack spacing={1}>
                            <Grid container alignItems={'center'}>
                                <Grid item lg={4} md={4} sm={5} xs={12}>
                                    <Typography variant="body2" fontWeight={500}>
                                        Ngày điều chỉnh
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
                            <Grid container alignItems={'center'}>
                                <Grid item lg={4} md={4} sm={4} xs={12}>
                                    <Typography variant="body2" fontWeight={500}>
                                        Số dư hiện tại
                                    </Typography>
                                </Grid>
                                <Grid item lg={8} md={8} sm={8} xs={12}>
                                    <Typography variant="body2" fontWeight={500} textAlign={'right'}>
                                        {new Intl.NumberFormat('vi-VN').format(soDuTheGiaTri)}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container alignItems={'center'}>
                                <Grid item lg={4} md={4} sm={5} xs={12}>
                                    <Typography variant="body2" fontWeight={500}>
                                        Số dư điều chỉnh
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
                                        onChange={(e) => {
                                            const gtri = utils.formatNumberToFloat(e.target.value);
                                            setNewTGT({
                                                ...newTGT,
                                                tongTienHangChuaChietKhau: gtri,
                                                tongTienHang: gtri,
                                                tongTienHDSauVAT: gtri,
                                                tongThanhToan: gtri
                                            });
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container alignItems={'center'}>
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
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="error" startIcon={<BlockIcon />} onClick={onClose}>
                        Bỏ qua
                    </Button>
                    {isSaving ? (
                        <Button variant="contained" startIcon={<SaveOutlinedIcon />}>
                            Đang lưu
                        </Button>
                    ) : (
                        <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={savePhieuDieuChinh}>
                            {isNew ? 'Lưu' : 'Cập nhật'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ModalDieuChinhSoDuTGT;
