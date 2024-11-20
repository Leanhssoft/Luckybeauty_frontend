/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    Grid,
    Radio,
    TextField,
    Stack
} from '@mui/material';

import { ReactComponent as CloseIcon } from '../../../../images/close-square.svg';
import SelectWithData from '../../../../components/Select/SelectWithData';
import { Formik, Form } from 'formik';
import { useEffect, useState, useRef, useContext } from 'react';
import { NumericFormat } from 'react-number-format';
import QuyChiTietDto from '../../../../services/so_quy/QuyChiTietDto';
import QuyHoaDonDto from '../../../../services/so_quy/QuyHoaDonDto';
import SoQuyServices from '../../../../services/so_quy/SoQuyServices';
import utils from '../../../../utils/utils';
import DateTimePickerCustom from '../../../../components/DatetimePicker/DateTimePickerCustom';
import AutocompleteCustomer from '../../../../components/Autocomplete/Customer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as yup from 'yup';
import { format } from 'date-fns';
import AppConsts, {
    HINH_THUC_THANH_TOAN,
    ISelect,
    LoaiChungTu,
    LoaiDoiTuong,
    TrangThaiActive,
    TypeAction
} from '../../../../lib/appconst';
import { Guid } from 'guid-typescript';
import { AppContext } from '../../../../services/chi_nhanh/ChiNhanhContext';
import nhanVienService from '../../../../services/nhan-vien/nhanVienService';
import NhanSuItemDto from '../../../../services/nhan-vien/dto/nhanSuItemDto';
import AutocompleteNhanVien from '../../../../components/Autocomplete/NhanVien';
import ConfirmDelete from '../../../../components/AlertDialog/ConfirmDelete';
import { PropConfirmOKCancel } from '../../../../utils/PropParentToChild';
import { PagedNhanSuRequestDto } from '../../../../services/nhan-vien/dto/PagedNhanSuRequestDto';
import AutocompleteAccountBank from '../../../../components/Autocomplete/AccountBank';
import suggestStore from '../../../../stores/suggestStore';
import SnackbarAlert from '../../../../components/AlertDialog/SnackbarAlert';
import abpCustom from '../../../../components/abp-custom';
import DialogButtonClose from '../../../../components/Dialog/ButtonClose';

interface SoQuyDialogProps {
    visiable: boolean;
    onClose: () => void;
    onOk: (dataSave: any, type: number) => void;
    idQuyHD: string | null;
}

const themeDate = createTheme({
    components: {
        MuiFormControl: {
            styleOverrides: {
                root: {
                    minWidth: '100%'
                }
            }
        }
    }
});
const CreateOrEditSoQuyDialog = ({ visiable = false, idQuyHD = null, onClose, onOk }: SoQuyDialogProps) => {
    const doiTuongNopTien = [
        { value: 1, text: 'Khách hàng' },
        // { id: 2, text: 'Nhà cung cấp' },
        { value: 3, text: 'Nhân viên' }
    ];

    const formRef = useRef();
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;
    const [errMaHoadon, setErrMaHoaDon] = useState('');
    const [allNhanVien, setAllNhanVien] = useState<NhanSuItemDto[]>([]);
    const [inforDelete, setinforDelete] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const [isShowModalAccountBank, setIsShowModalAccountBank] = useState(false);
    const [action, setAction] = useState(TypeAction.INSEART);

    const [quyHoaDon, setQuyHoaDon] = useState<QuyHoaDonDto>(
        new QuyHoaDonDto({
            id: Guid.create().toString(),
            idChiNhanh: chinhanh.id,
            idLoaiChungTu: LoaiChungTu.PHIEU_THU,
            tongTienThu: 0,
            idDoiTuongNopTien: null,
            hinhThucThanhToan: HINH_THUC_THANH_TOAN.TIEN_MAT,
            hachToanKinhDoanh: true,
            ngayLapHoaDon: format(new Date(), 'yyyy-MM-dd HH:mm')
        })
    );
    const sLoai = quyHoaDon?.idLoaiChungTu === LoaiChungTu.PHIEU_THU ? 'thu' : 'chi';

    const getInforQuyHoaDon = async () => {
        if (utils.checkNull(idQuyHD)) return;
        const data = await SoQuyServices.GetInforQuyHoaDon_byId(idQuyHD ?? '');
        if (data !== null) {
            const quyCT = data.quyHoaDon_ChiTiet;

            if (quyCT !== undefined && quyCT?.length > 0) {
                setQuyHoaDon({
                    ...quyHoaDon,
                    id: data.id,
                    idChiNhanh: data.idChiNhanh,
                    idLoaiChungTu: data.idLoaiChungTu,
                    ngayLapHoaDon: data.ngayLapHoaDon,
                    maHoaDon: data.maHoaDon,
                    noiDungThu: data.noiDungThu,
                    tongTienThu: data.tongTienThu,
                    hachToanKinhDoanh: data.hachToanKinhDoanh,
                    loaiDoiTuong: quyCT[0]?.idNhanVien != null ? LoaiDoiTuong.NHAN_VIEN : LoaiDoiTuong.KHACH_HANG,
                    idDoiTuongNopTien: quyCT[0]?.idNhanVien != null ? quyCT[0]?.idNhanVien : quyCT[0]?.idKhachHang,
                    hinhThucThanhToan: quyCT[0].hinhThucThanhToan,
                    idKhoanThuChi: quyCT[0].idKhoanThuChi,
                    idTaiKhoanNganHang: quyCT[0].idTaiKhoanNganHang,
                    quyHoaDon_ChiTiet: quyCT,
                    trangThai: data?.trangThai
                });
            }
        }
    };
    const GetListNhanVien = async () => {
        const data = await nhanVienService.getAll({
            skipCount: 0,
            maxResultCount: 100
        } as PagedNhanSuRequestDto);
        setAllNhanVien(data.items);
    };

    const PageLoad = () => {
        GetListNhanVien();
    };

    useEffect(() => {
        PageLoad();
    }, []);
    useEffect(() => {
        if (utils.checkNull(idQuyHD)) {
            // insert
            setQuyHoaDon({
                ...quyHoaDon,
                id: Guid.create().toString(),
                idChiNhanh: chinhanh.id,
                idLoaiChungTu: LoaiChungTu.PHIEU_THU,
                tongTienThu: 0,
                idDoiTuongNopTien: null,
                maHoaDon: '',
                loaiDoiTuong: LoaiDoiTuong.KHACH_HANG,
                ngayLapHoaDon: format(new Date(), 'yyyy-MM-dd HH:mm'),
                noiDungThu: '',
                hinhThucThanhToan: HINH_THUC_THANH_TOAN.TIEN_MAT,
                idKhoanThuChi: null,
                idTaiKhoanNganHang: null,
                hachToanKinhDoanh: true
            });
        } else {
            // update
            if (visiable) getInforQuyHoaDon();
        }
    }, [visiable]);

    const deleteSoQuy = async () => {
        setinforDelete({ ...inforDelete, show: false });
        switch (action) {
            case TypeAction.RESTORE:
                {
                    if (utils.checkNull(idQuyHD)) {
                        return;
                    }
                    await SoQuyServices.KhoiPhucSoQuy(idQuyHD as string);
                    setObjAlert({
                        show: true,
                        type: 1,
                        mes: 'Khôi phục sổ quỹ thành công'
                    });
                }
                break;
        }
        onOk(quyHoaDon, action);
    };

    const saveSoQuy = async () => {
        const myData = { ...quyHoaDon };
        const idKhachHang = (
            quyHoaDon.loaiDoiTuong == LoaiDoiTuong.NHAN_VIEN ? null : quyHoaDon.idDoiTuongNopTien
        ) as null;
        const idNhanVien = (
            quyHoaDon.loaiDoiTuong == LoaiDoiTuong.NHAN_VIEN ? quyHoaDon.idDoiTuongNopTien : null
        ) as null;

        if (utils.checkNull(idQuyHD)) {
            // insert
            const quyCT = new QuyChiTietDto({
                idKhachHang: idKhachHang,
                hinhThucThanhToan: quyHoaDon.hinhThucThanhToan,
                tienThu: quyHoaDon.tongTienThu,
                idNhanVien: idNhanVien,
                idKhoanThuChi: quyHoaDon.idKhoanThuChi as null,
                idTaiKhoanNganHang: quyHoaDon.idTaiKhoanNganHang as null
            });
            myData.quyHoaDon_ChiTiet = [quyCT];
            const data = await SoQuyServices.CreateQuyHoaDon(myData);
            quyHoaDon.id = data.id;
            quyHoaDon.maHoaDon = data.maHoaDon;
            quyHoaDon.txtTrangThai = 'Đã thanh toán';
            quyHoaDon.quyHoaDon_ChiTiet = myData.quyHoaDon_ChiTiet; // gán để tính gtrị các loại tiền at DS soquy
            onOk(quyHoaDon, TypeAction.INSEART);
        } else {
            // update
            // assign again ctquy
            myData.quyHoaDon_ChiTiet = quyHoaDon.quyHoaDon_ChiTiet?.map((x: any) => {
                return {
                    id: x.id,
                    idQuyHoaDon: x.idQuyHoaDon,
                    idKhachHang: idKhachHang,
                    hinhThucThanhToan: quyHoaDon.hinhThucThanhToan,
                    tienThu: quyHoaDon.tongTienThu,
                    idNhanVien: idNhanVien,
                    idKhoanThuChi: quyHoaDon.idKhoanThuChi as null,
                    diemThanhToan: x.diemThanhToan,
                    chiPhiNganHang: x.chiPhiNganHang,
                    idTaiKhoanNganHang: quyHoaDon.idTaiKhoanNganHang,
                    laPTChiPhiNganHang: x.laPTChiPhiNganHang,
                    thuPhiTienGui: x.thuPhiTienGui
                } as QuyChiTietDto;
            });
            const data = await SoQuyServices.UpdateQuyHoaDon(myData);
            quyHoaDon.id = data.id;
            quyHoaDon.maHoaDon = data.maHoaDon;
            quyHoaDon.txtTrangThai = 'Đã thanh toán';
            quyHoaDon.quyHoaDon_ChiTiet = myData.quyHoaDon_ChiTiet;
            onOk(quyHoaDon, TypeAction.UPDATE);
        }
    };

    useEffect(() => {
        setQuyHoaDon({
            ...quyHoaDon,
            loaiPhieu: quyHoaDon.idLoaiChungTu === LoaiChungTu.PHIEU_THU ? 'Phiếu thu' : 'Phiếu chi'
        });
    }, [quyHoaDon.idLoaiChungTu]);

    useEffect(() => {
        setQuyHoaDon({
            ...quyHoaDon,
            sHinhThucThanhToan: AppConsts.hinhThucThanhToan.filter(
                (x: ISelect) => x.value === quyHoaDon.hinhThucThanhToan
            )[0]?.text
        });
    }, [quyHoaDon.hinhThucThanhToan]);

    // todo validate ngaylapHoaDon
    const validate = yup.object().shape({
        hinhThucThanhToan: yup.number(),
        // check dc mã, nhưng call API quá nhiều lần
        maHoaDon: yup.string().test('maHoaDon', 'Mã phiếu đã tồn tại', async () => {
            if (!utils.checkNull(quyHoaDon?.maHoaDon)) {
                const response = await SoQuyServices.CheckExistsMaPhieuThuChi(quyHoaDon?.maHoaDon ?? '', idQuyHD);
                return !response;
            }
            return true;
        }),
        tongTienThu: yup
            .number()
            .transform((value: any, originalValue: any) => {
                return utils.formatNumberToFloat(originalValue);
            })
            .notOneOf([0], 'Tổng tiền phải > 0')
            .required('Vui lòng nhập số tiền'),
        idDoiTuongNopTien: yup.string().required('Vui lòng chọn đối tượng nộp tiền')
        // idTaiKhoanNganHang: yup
        //     .string()
        //     .when('hinhThucThanhToan', ([hinhThucThanhToan], schema) => {
        //         if (hinhThucThanhToan !== 1)
        //             return yup.string().required('Vui lòng chọn tài khoản ngân hàng');
        //         return schema;
        //     })
    });

    const saveOKAccountBank = (dataSave: any) => {
        setQuyHoaDon({
            ...quyHoaDon,
            idTaiKhoanNganHang: dataSave.id,
            tenNganHang: dataSave.tenNganHang,
            tenChuThe: dataSave.tenChuThe
        });
        setIsShowModalAccountBank(false);

        // setBankAccount([dataSave, ...bankAccount]);

        setObjAlert({
            show: true,
            type: 1,
            mes: 'Thêm tài khoản ngân hàng thành công'
        });
    };

    return (
        <>
            <ConfirmDelete
                isShow={inforDelete.show}
                title={inforDelete.title}
                mes={inforDelete.mes}
                onOk={deleteSoQuy}
                onCancel={() => setinforDelete({ ...inforDelete, show: false })}></ConfirmDelete>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Dialog open={visiable} fullWidth maxWidth={'sm'} onClose={onClose}>
                <DialogButtonClose onClose={onClose} />
                <DialogTitle>
                    <Box className="modal-title" sx={{ float: 'left' }}>
                        {utils.checkNull(idQuyHD) ? 'Thêm mới' : 'Cập nhật'} sổ quỹ
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={quyHoaDon}
                        validationSchema={validate}
                        onSubmit={saveSoQuy}
                        enableReinitialize>
                        {(formik) => (
                            <>
                                <Form
                                    onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                        if (event.key === 'Enter') {
                                            event.preventDefault(); // Prevent form submission
                                        }
                                    }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12} lg={12}>
                                            <FormControlLabel
                                                value="end"
                                                control={
                                                    <Radio
                                                        color="secondary"
                                                        value={LoaiChungTu.PHIEU_THU}
                                                        checked={quyHoaDon.idLoaiChungTu === LoaiChungTu.PHIEU_THU}
                                                        onChange={() =>
                                                            setQuyHoaDon({
                                                                ...quyHoaDon,
                                                                idLoaiChungTu: LoaiChungTu.PHIEU_THU
                                                            })
                                                        }
                                                    />
                                                }
                                                label="Phiếu thu"
                                            />
                                            <FormControlLabel
                                                value="end"
                                                control={
                                                    <Radio
                                                        color="secondary"
                                                        name="idLoaiChungTu"
                                                        value={LoaiChungTu.PHIEU_CHI}
                                                        checked={quyHoaDon.idLoaiChungTu === LoaiChungTu.PHIEU_CHI}
                                                        onChange={() =>
                                                            setQuyHoaDon({
                                                                ...quyHoaDon,
                                                                idLoaiChungTu: LoaiChungTu.PHIEU_CHI
                                                            })
                                                        }
                                                    />
                                                }
                                                label="Phiếu chi"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <ThemeProvider theme={themeDate}>
                                                <DateTimePickerCustom
                                                    defaultVal={quyHoaDon.ngayLapHoaDon}
                                                    labelText="Ngày lập phiếu"
                                                    handleChangeDate={(dt: string) => {
                                                        formik.setFieldValue('ngayLapHoaDon', dt);
                                                        setQuyHoaDon({
                                                            ...quyHoaDon,
                                                            ngayLapHoaDon: dt
                                                        });
                                                    }}
                                                    helperText={
                                                        formik.touched.idDoiTuongNopTien &&
                                                        formik.errors.idDoiTuongNopTien
                                                    }
                                                />
                                            </ThemeProvider>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                label="Mã phiếu"
                                                value={quyHoaDon.maHoaDon}
                                                onChange={(e) => {
                                                    formik.setFieldValue('maHoaDon', e.target.value);
                                                    setQuyHoaDon({
                                                        ...quyHoaDon,
                                                        maHoaDon: e.target.value
                                                    });
                                                }}
                                                helperText={formik.touched.maHoaDon && formik.errors.maHoaDon}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <SelectWithData
                                                label="Hình thức"
                                                data={AppConsts.hinhThucThanhToan}
                                                idChosed={quyHoaDon?.hinhThucThanhToan}
                                                handleChange={(item: ISelect) => {
                                                    {
                                                        switch (item.value) {
                                                            case HINH_THUC_THANH_TOAN.TIEN_MAT:
                                                                {
                                                                    setQuyHoaDon({
                                                                        ...quyHoaDon,
                                                                        hinhThucThanhToan: item.value as number,
                                                                        idTaiKhoanNganHang: null
                                                                    });
                                                                }
                                                                break;
                                                            case HINH_THUC_THANH_TOAN.CHUYEN_KHOAN:
                                                            case HINH_THUC_THANH_TOAN.QUYET_THE:
                                                                {
                                                                    // set default tk nganhang
                                                                    let idTaiKhoanNganHang = null;
                                                                    const tkNganHangDefault =
                                                                        suggestStore?.suggestTaiKhoanNganHangQr?.filter(
                                                                            (x) => x.isDefault
                                                                        );
                                                                    if (
                                                                        tkNganHangDefault !== undefined &&
                                                                        tkNganHangDefault.length > 0
                                                                    ) {
                                                                        idTaiKhoanNganHang = tkNganHangDefault[0].id;
                                                                    } else {
                                                                        if (
                                                                            suggestStore?.suggestTaiKhoanNganHangQr
                                                                                ?.length > 0
                                                                        ) {
                                                                            idTaiKhoanNganHang =
                                                                                suggestStore
                                                                                    ?.suggestTaiKhoanNganHangQr[0].id;
                                                                        }
                                                                    }
                                                                    setQuyHoaDon({
                                                                        ...quyHoaDon,
                                                                        hinhThucThanhToan: item.value as number,
                                                                        idTaiKhoanNganHang: idTaiKhoanNganHang
                                                                    });
                                                                }
                                                                break;
                                                        }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <SelectWithData
                                                label="Đối tượng nộp"
                                                data={doiTuongNopTien}
                                                idChosed={quyHoaDon?.loaiDoiTuong}
                                                handleChange={(item: any) =>
                                                    setQuyHoaDon({
                                                        ...quyHoaDon,
                                                        loaiDoiTuong: item.value
                                                    })
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            {quyHoaDon.loaiDoiTuong !== LoaiDoiTuong.NHAN_VIEN && (
                                                <>
                                                    <AutocompleteCustomer
                                                        idChosed={quyHoaDon?.idDoiTuongNopTien ?? ''}
                                                        handleChoseItem={(item: any) => {
                                                            {
                                                                formik.setFieldValue(
                                                                    'idDoiTuongNopTien',
                                                                    item?.id ?? null
                                                                );
                                                                setQuyHoaDon({
                                                                    ...quyHoaDon,
                                                                    idDoiTuongNopTien: item?.id,
                                                                    maNguoiNop: item?.maKhachHang,
                                                                    tenNguoiNop: item?.tenKhachHang
                                                                });
                                                            }
                                                        }}
                                                        error={
                                                            formik.touched.idDoiTuongNopTien &&
                                                            Boolean(formik.errors?.idDoiTuongNopTien)
                                                        }
                                                        helperText={
                                                            (formik.touched.idDoiTuongNopTien &&
                                                                formik.errors.idDoiTuongNopTien) as string
                                                        }
                                                    />
                                                </>
                                            )}
                                            {quyHoaDon.loaiDoiTuong === LoaiDoiTuong.NHAN_VIEN && (
                                                <>
                                                    <AutocompleteNhanVien
                                                        idChosed={quyHoaDon?.idDoiTuongNopTien}
                                                        dataNhanVien={allNhanVien}
                                                        handleChoseItem={(item: any) => {
                                                            {
                                                                formik.setFieldValue(
                                                                    'idDoiTuongNopTien',
                                                                    item?.id ?? null
                                                                );
                                                                setQuyHoaDon({
                                                                    ...quyHoaDon,
                                                                    idDoiTuongNopTien: item?.id,
                                                                    maNguoiNop: item?.maNhanVien,
                                                                    tenNguoiNop: item?.tenNhanVien
                                                                });
                                                            }
                                                        }}
                                                        error={
                                                            formik.touched.idDoiTuongNopTien &&
                                                            Boolean(formik.errors?.idDoiTuongNopTien)
                                                        }
                                                        helperText={
                                                            formik.touched.idDoiTuongNopTien &&
                                                            formik.errors.idDoiTuongNopTien
                                                        }
                                                    />
                                                </>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <NumericFormat
                                                fullWidth
                                                size="small"
                                                name="tongTienThu"
                                                label={`Tiền ${sLoai}`}
                                                thousandSeparator={'.'}
                                                decimalSeparator={','}
                                                value={quyHoaDon?.tongTienThu}
                                                customInput={TextField}
                                                onChange={(e: any) => {
                                                    formik.setFieldValue('tongTienThu', e.target.value);
                                                    setQuyHoaDon({
                                                        ...quyHoaDon,
                                                        tongTienThu: utils.formatNumberToFloat(e.target.value)
                                                    });
                                                }}
                                                error={
                                                    formik.touched?.tongTienThu && Boolean(formik.errors?.tongTienThu)
                                                }
                                                helperText={formik.touched.tongTienThu && formik.errors.tongTienThu}
                                            />
                                        </Grid>
                                        {/*  không cần chọn tài khoản ngân hàng*/}
                                        {quyHoaDon?.hinhThucThanhToan !== HINH_THUC_THANH_TOAN.TIEN_MAT && (
                                            <>
                                                <Grid item xs={12} sm={12}>
                                                    <AutocompleteAccountBank
                                                        listOption={suggestStore?.suggestTaiKhoanNganHangQr}
                                                        idChosed={quyHoaDon.idTaiKhoanNganHang}
                                                        handleClickBtnAdd={() => setIsShowModalAccountBank(true)}
                                                        handleChoseItem={(item: any) => {
                                                            {
                                                                formik.setFieldValue(
                                                                    'idTaiKhoanNganHang',
                                                                    item?.id ?? null
                                                                );
                                                                setQuyHoaDon({
                                                                    ...quyHoaDon,
                                                                    idTaiKhoanNganHang: item?.id,
                                                                    tenNganHang: item?.tenNganHang,
                                                                    tenChuThe: item?.tenChuThe
                                                                });
                                                            }
                                                        }}
                                                        error={
                                                            formik.touched.idTaiKhoanNganHang &&
                                                            Boolean(formik.errors?.idTaiKhoanNganHang)
                                                        }
                                                        helperText={
                                                            formik.touched.idTaiKhoanNganHang &&
                                                            formik.errors.idTaiKhoanNganHang
                                                        }
                                                    />
                                                </Grid>
                                            </>
                                        )}

                                        <Grid item xs={12} sm={12}>
                                            <TextField
                                                size="small"
                                                multiline
                                                rows={3}
                                                fullWidth
                                                label={`Nội dung ${sLoai}`}
                                                value={quyHoaDon?.noiDungThu}
                                                onChange={(e: any) =>
                                                    setQuyHoaDon({
                                                        ...quyHoaDon,
                                                        noiDungThu: e.target.value
                                                    })
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} style={{ display: 'none' }}>
                                            <FormGroup>
                                                <FormControlLabel
                                                    value="end"
                                                    control={
                                                        <Checkbox
                                                            name="ckHachToanKinhDoanh"
                                                            checked={quyHoaDon.hachToanKinhDoanh === true}
                                                            onChange={(e: any) => {
                                                                setQuyHoaDon({
                                                                    ...quyHoaDon,
                                                                    hachToanKinhDoanh: e.target.checked
                                                                });
                                                            }}
                                                            value="true"
                                                            sx={{
                                                                color: '#7C3367!important'
                                                            }}
                                                        />
                                                    }
                                                    label="Hạch toán vào kết quả hoạt động kinh doanh"
                                                />
                                            </FormGroup>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Stack spacing={1} direction={'row'} justifyContent={'flex-end'}>
                                                <Button
                                                    variant="outlined"
                                                    sx={{ color: 'var(--color-main)' }}
                                                    className="btn-outline-hover"
                                                    onClick={onClose}>
                                                    Hủy
                                                </Button>
                                                {!formik.isSubmitting &&
                                                quyHoaDon?.trangThai == TrangThaiActive.ACTIVE ? (
                                                    <Button
                                                        variant="contained"
                                                        sx={{ bgcolor: '#7C3367' }}
                                                        className="btn-container-hover"
                                                        type="submit">
                                                        Lưu
                                                    </Button>
                                                ) : (
                                                    formik.isSubmitting && (
                                                        <Button
                                                            variant="contained"
                                                            sx={{ bgcolor: '#7C3367' }}
                                                            className="btn-container-hover"
                                                            type="submit">
                                                            Đang lưu
                                                        </Button>
                                                    )
                                                )}

                                                {!utils.checkNull(idQuyHD) ? (
                                                    quyHoaDon?.trangThai == TrangThaiActive.ACTIVE ? (
                                                        <>
                                                            <Button
                                                                color="error"
                                                                variant="outlined"
                                                                sx={{
                                                                    display: abpCustom.isGrandPermission(
                                                                        'Pages.QuyHoaDon.Delete'
                                                                    )
                                                                        ? ''
                                                                        : 'none'
                                                                }}
                                                                onClick={() => {
                                                                    setAction(TypeAction.DELETE);
                                                                    setinforDelete(
                                                                        new PropConfirmOKCancel({
                                                                            show: true,
                                                                            title: 'Xác nhận xóa',
                                                                            mes: `Bạn có chắc chắn muốn xóa ${
                                                                                quyHoaDon?.loaiPhieu ?? ' '
                                                                            }  ${quyHoaDon?.maHoaDon ?? ' '} không?`
                                                                        })
                                                                    );
                                                                }}>
                                                                Xóa
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                color="error"
                                                                variant="outlined"
                                                                sx={{
                                                                    display: abpCustom.isGrandPermission(
                                                                        'Pages.QuyHoaDon.Restore'
                                                                    )
                                                                        ? ''
                                                                        : 'none'
                                                                }}
                                                                onClick={() => {
                                                                    setAction(TypeAction.RESTORE);
                                                                    setinforDelete(
                                                                        new PropConfirmOKCancel({
                                                                            show: true,
                                                                            title: 'Xác nhận khôi phục',
                                                                            mes: `Bạn có chắc chắn muốn khôi phục ${
                                                                                quyHoaDon?.loaiPhieu ?? ' '
                                                                            }  ${quyHoaDon?.maHoaDon ?? ' '} không?`
                                                                        })
                                                                    );
                                                                }}>
                                                                Khôi phục
                                                            </Button>
                                                        </>
                                                    )
                                                ) : null}
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Form>
                            </>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </>
    );
};
export default CreateOrEditSoQuyDialog;
