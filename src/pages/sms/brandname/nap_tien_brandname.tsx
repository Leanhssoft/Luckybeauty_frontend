import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    Grid,
    Radio,
    TextField,
    Stack,
    debounce
} from '@mui/material';

import { Formik, Form } from 'formik';
import { useEffect, useState, useContext } from 'react';
import { NumericFormat } from 'react-number-format';
import utils from '../../../utils/utils';
import DateTimePickerCustom from '../../../components/DatetimePicker/DateTimePickerCustom';
import * as yup from 'yup';
import { format } from 'date-fns';
import AppConsts, { ISelect, LoaiChungTu } from '../../../lib/appconst';
import { Guid } from 'guid-typescript';
import { AppContext, ChiNhanhContext } from '../../../services/chi_nhanh/ChiNhanhContext';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import { PropConfirmOKCancel } from '../../../utils/PropParentToChild';
import QuyHoaDonDto from '../../../services/so_quy/QuyHoaDonDto';
import SoQuyServices from '../../../services/so_quy/SoQuyServices';
import QuyChiTietDto from '../../../services/so_quy/QuyChiTietDto';
import SelectWithData from '../../../components/Select/SelectWithData';
import DialogButtonClose from '../../../components/Dialog/ButtonClose';
import AutocompleteFromDB from '../../../components/Autocomplete/AutocompleteFromDB';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import LichSuNap_ChuyenTienService from '../../../services/sms/lich_su_nap_tien/LichSuNap_ChuyenTienService';
import BrandnameService from '../../../services/sms/brandname/BrandnameService';
import ILichSuNap_ChuyenTienDto from '../../../services/sms/lich_su_nap_tien/ILichSuNap_ChuyenTienDto';
import { IDataAutocomplete } from '../../../services/dto/IDataAutocomplete';

const NapTienBrandname = ({ visiable = false, idQuyHD = null, onClose, onOk }: any) => {
    const doiTuongNopTien = [
        { value: 1, text: 'Khách hàng' },
        { value: 3, text: 'Nhân viên' }
    ];

    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;
    const [inforDelete, setinforDelete] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const [quyHoaDon, setQuyHoaDon] = useState<QuyHoaDonDto>(
        new QuyHoaDonDto({
            id: Guid.create().toString(),
            idChiNhanh: chinhanh.id,
            idLoaiChungTu: LoaiChungTu.PHIEU_THU,
            tongTienThu: 0,
            idDoiTuongNopTien: null,
            hinhThucThanhToan: 1,
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
                    idBrandname: data.idBrandname,
                    idLoaiChungTu: data.idLoaiChungTu,
                    ngayLapHoaDon: data.ngayLapHoaDon,
                    maHoaDon: data.maHoaDon,
                    noiDungThu: data.noiDungThu,
                    tongTienThu: data.tongTienThu,
                    hachToanKinhDoanh: data.hachToanKinhDoanh,
                    loaiDoiTuong: quyCT[0]?.idNhanVien != null ? 3 : 1,
                    idDoiTuongNopTien: quyCT[0]?.idNhanVien != null ? quyCT[0]?.idNhanVien : quyCT[0]?.idKhachHang,
                    hinhThucThanhToan: quyCT[0].hinhThucThanhToan,
                    idKhoanThuChi: quyCT[0].idKhoanThuChi,
                    idTaiKhoanNganHang: quyCT[0].idTaiKhoanNganHang,
                    quyHoaDon_ChiTiet: quyCT
                });
            }
        }
    };

    const PageLoad = () => {
        //
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
                loaiDoiTuong: 1,
                ngayLapHoaDon: format(new Date(), 'yyyy-MM-dd HH:mm'),
                noiDungThu: '',
                hinhThucThanhToan: 1,
                idKhoanThuChi: null,
                idTaiKhoanNganHang: null,
                hachToanKinhDoanh: true
            });
        } else {
            // update
            if (visiable) getInforQuyHoaDon();
        }
    }, [visiable]);

    const deleteSoQuy = () => {
        setinforDelete({ ...inforDelete, show: false });
        onOk(quyHoaDon, 3);
    };

    const checkSaveDB = async (maHoaDon: string | undefined) => {
        if (!utils.checkNull(maHoaDon)) {
            const response = await SoQuyServices.CheckExistsMaPhieuThuChi(maHoaDon ?? '', idQuyHD);
            if (response) {
                setObjAlert({ show: true, mes: 'Mã phiếu thu đã tồn tại', type: 2 });
                return !response;
            }
        }
        return true;
    };

    const saveSoQuy = async (values: QuyHoaDonDto) => {
        const check = await checkSaveDB(values?.maHoaDon);
        if (!check) return;
        const tongThu = utils.formatNumberToFloat(values.tongTienThu);
        const myData = { ...values };
        const idKhachHang = (values.loaiDoiTuong == 3 ? null : values.idDoiTuongNopTien) as null;
        const idNhanVien = (values.loaiDoiTuong == 3 ? values.idDoiTuongNopTien : null) as null;
        myData.tongTienThu = tongThu;

        if (utils.checkNull(idQuyHD)) {
            // insert
            const quyCT = new QuyChiTietDto({
                idKhachHang: idKhachHang,
                hinhThucThanhToan: values.hinhThucThanhToan,
                tienThu: tongThu,
                idNhanVien: idNhanVien,
                idKhoanThuChi: values.idKhoanThuChi as null,
                idTaiKhoanNganHang: values.idTaiKhoanNganHang as null
            });
            myData.quyHoaDon_ChiTiet = [quyCT];
            const data = await SoQuyServices.CreateQuyHoaDon(myData);
            values.id = data.id;
            values.maHoaDon = data.maHoaDon;
            values.txtTrangThai = 'Đã thanh toán';
            myData.id = data.id;

            onOk(values, 1);
        } else {
            // update
            // assign again ctquy
            myData.quyHoaDon_ChiTiet = quyHoaDon.quyHoaDon_ChiTiet?.map((x: any) => {
                return {
                    id: x.id,
                    idQuyHoaDon: x.idQuyHoaDon,
                    idKhachHang: idKhachHang,
                    hinhThucThanhToan: values.hinhThucThanhToan,
                    tienThu: tongThu,
                    idNhanVien: idNhanVien,
                    idKhoanThuChi: values.idKhoanThuChi as null,
                    diemThanhToan: x.diemThanhToan,
                    chiPhiNganHang: x.chiPhiNganHang,
                    idTaiKhoanNganHang: values.idTaiKhoanNganHang,
                    laPTChiPhiNganHang: x.laPTChiPhiNganHang,
                    thuPhiTienGui: x.thuPhiTienGui
                } as QuyChiTietDto;
            });
            const data = await SoQuyServices.UpdateQuyHoaDon(myData);
            values.id = data.id;
            values.maHoaDon = data.maHoaDon;
            values.txtTrangThai = 'Đã thanh toán';
            onOk(values, 2);
        }
        await ThemMoiPhieuNapTienSMS(myData);
    };

    const ThemMoiPhieuNapTienSMS = async (quyHoaDon: QuyHoaDonDto) => {
        if (!utils.checkNull(quyHoaDon.idBrandname)) {
            // insert other tenant (DB#)
            const tenant = await BrandnameService.GetInforBrandnamebyID(quyHoaDon.idBrandname as string);
            if (tenant !== null) {
                const objNapTien = {
                    tenantId: tenant.tenantId,
                    idPhieuNapTien: quyHoaDon.id,
                    soTienChuyen_Nhan: quyHoaDon.tongTienThu,
                    thoiGianNap_ChuyenTien: quyHoaDon.ngayLapHoaDon,
                    noiDungChuyen_Nhan: quyHoaDon.noiDungThu
                } as unknown as ILichSuNap_ChuyenTienDto;
                const naptien = LichSuNap_ChuyenTienService.ThemMoi_CapNhatPhieuNapTien(tenant.tenantId, objNapTien);
                console.log('naptien ', naptien);
            }
        }
    };

    useEffect(() => {
        setQuyHoaDon({
            ...quyHoaDon,
            loaiPhieu: quyHoaDon.idLoaiChungTu === 11 ? 'Phiếu thu' : 'Phiếu chi'
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
        idBrandname: yup.string().required('Vui lòng chọn brandname'),
        tongTienThu: yup
            .number()
            .transform((value: any, originalValue: any) => {
                return utils.formatNumberToFloat(originalValue);
            })
            .notOneOf([0], 'Tổng tiền phải > 0')
            .required('Vui lòng nhập số tiền')
    });

    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <ConfirmDelete
                isShow={inforDelete.show}
                title={inforDelete.title}
                mes={inforDelete.mes}
                onOk={deleteSoQuy}
                onCancel={() => setinforDelete({ ...inforDelete, show: false })}></ConfirmDelete>
            <Dialog open={visiable} fullWidth maxWidth={'sm'} onClose={onClose}>
                <DialogTitle>
                    <Box className="modal-title" sx={{ float: 'left' }}>
                        {utils.checkNull(idQuyHD) ? 'Thêm mới' : 'Cập nhật'} phiếu nạp tiền
                    </Box>
                    <DialogButtonClose onClose={onClose} />
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={quyHoaDon}
                        validationSchema={validate}
                        onSubmit={saveSoQuy}
                        enableReinitialize>
                        {({ isSubmitting, values, errors, touched, setFieldValue }: any) => (
                            <Form>
                                <Grid container spacing={2} marginTop={0.5}>
                                    <Grid item xs={12}>
                                        <AutocompleteFromDB
                                            type="brandname"
                                            label="Chọn brandname"
                                            optionLabel={{ label1: 'Brandname:', label2: 'SĐT:' }}
                                            idChosed={values.idBrandname}
                                            handleChoseItem={(item: IDataAutocomplete) => {
                                                setFieldValue('idBrandname', item?.id);
                                            }}
                                            helperText={touched.idBrandname && errors.idBrandname}
                                            err={touched.idBrandname && Boolean(errors.idBrandname)}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            label="Mã phiếu"
                                            value={values.maHoaDon}
                                            onChange={(e) => {
                                                setFieldValue('maHoaDon', e.target.value);
                                            }}
                                            helperText={touched.maHoaDon && errors.maHoaDon}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <DateTimePickerCustom
                                            props={{ width: '100%' }}
                                            defaultVal={values.ngayLapHoaDon}
                                            labelText="Ngày lập phiếu"
                                            handleChangeDate={(dt: string) => {
                                                setFieldValue('ngayLapHoaDon', dt);
                                            }}
                                            helperText={touched.idDoiTuongNopTien && errors.idDoiTuongNopTien}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <SelectWithData
                                            label="Hình thức"
                                            data={AppConsts.hinhThucThanhToan}
                                            idChosed={quyHoaDon?.hinhThucThanhToan}
                                            handleChange={(item: ISelect) => {
                                                setFieldValue('hinhThucThanhToan', item.value as number);
                                                setQuyHoaDon({
                                                    ...quyHoaDon,
                                                    hinhThucThanhToan: item.value as number
                                                });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <NumericFormat
                                            fullWidth
                                            size="small"
                                            name="tongTienThu"
                                            label={`Tiền ${sLoai}`}
                                            thousandSeparator={'.'}
                                            decimalSeparator={','}
                                            value={values?.tongTienThu}
                                            customInput={TextField}
                                            onChange={(e: any) => {
                                                setFieldValue('tongTienThu', e.target.value);
                                            }}
                                            error={touched?.tongTienThu && Boolean(errors?.tongTienThu)}
                                            helperText={touched.tongTienThu && errors.tongTienThu}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            size="small"
                                            multiline
                                            rows={3}
                                            fullWidth
                                            label={`Nội dung ${sLoai}`}
                                            value={values?.noiDungThu}
                                            onChange={(e: any) => setFieldValue('noiDungThu', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} style={{ display: 'none' }}>
                                        <FormGroup>
                                            <FormControlLabel
                                                value="end"
                                                control={
                                                    <Checkbox
                                                        name="ckHachToanKinhDoanh"
                                                        checked={values.hachToanKinhDoanh === true}
                                                        onChange={(e: any) => {
                                                            setFieldValue('hachToanKinhDoanh', e.target.checked);
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
                                            {!isSubmitting ? (
                                                <Button
                                                    variant="contained"
                                                    sx={{ bgcolor: '#7C3367' }}
                                                    className="btn-container-hover"
                                                    type="submit">
                                                    Lưu
                                                </Button>
                                            ) : (
                                                isSubmitting && (
                                                    <Button
                                                        variant="contained"
                                                        sx={{ bgcolor: '#7C3367' }}
                                                        className="btn-container-hover"
                                                        type="submit">
                                                        Đang lưu
                                                    </Button>
                                                )
                                            )}

                                            {!utils.checkNull(idQuyHD) && (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        sx={{ bgcolor: 'red' }}
                                                        className="btn-container-hover"
                                                        onClick={() => {
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
                                            )}
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </>
    );
};
export default NapTienBrandname;
