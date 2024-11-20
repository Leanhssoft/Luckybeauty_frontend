import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    DialogActions,
    TextField,
    Button,
    Stack,
    Typography
} from '@mui/material';
import DialogButtonClose from '../../../components/Dialog/ButtonClose';
import utils from '../../../utils/utils';
import { useEffect, useState } from 'react';
import { BrandnameDto } from '../../../services/sms/brandname/BrandnameDto';
import DatePickerCustom from '../../../components/DatetimePicker/DatePickerCustom';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import BrandnameService from '../../../services/sms/brandname/BrandnameService';
import { IOSSwitch } from '../../../components/Switch/IOSSwitch';
import { Guid } from 'guid-typescript';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import AutocompleteFromDB from '../../../components/Autocomplete/AutocompleteFromDB';
import { IDataAutocomplete } from '../../../services/dto/IDataAutocomplete';

export default function ModalCreateOrEditBrandname({ isShow, idBrandname, onClose, objUpdate, onSave }: any) {
    const [objBrandname, setObjBrandname] = useState<BrandnameDto>({
        id: '',
        tenantId: 0,
        brandname: '',
        sdtCuaHang: '',
        ngayKichHoat: new Date(),
        trangThai: 1
    } as BrandnameDto);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    useEffect(() => {
        if (isShow) {
            if (utils.checkNull(idBrandname)) {
                setObjBrandname({
                    ...objBrandname,
                    id: '',
                    tenantId: 0,
                    brandname: '',
                    sdtCuaHang: '',
                    ngayKichHoat: new Date(),
                    trangThai: 1
                } as BrandnameDto);
            } else {
                // get data from db
                setObjBrandname(() => {
                    return {
                        id: objUpdate.id,
                        tenantId: objUpdate.tenantId,
                        brandname: objUpdate.brandname,
                        sdtCuaHang: objUpdate.sdtCuaHang,
                        ngayKichHoat: objUpdate.ngayKichHoat,
                        trangThai: objUpdate.trangThai,
                        tongTienNap: objUpdate.tongTienNap,
                        daSuDung: objUpdate.daSuDung,
                        conLai: objUpdate.conLai
                    } as BrandnameDto;
                });
            }
        }
    }, [isShow]);

    const checkSaveDB = async (values: BrandnameDto) => {
        // brandname exist
        const sdtExists = await BrandnameService.Brandname_CheckExistSDT(values.sdtCuaHang, idBrandname);
        if (sdtExists) {
            setObjAlert({ ...objAlert, show: true, mes: 'Số điện thoại đã tồn tại', type: 2 });
            return false;
        }
        return true;
    };
    const saveBrandname = async (values: BrandnameDto) => {
        const check = await checkSaveDB(values);
        if (!check) return;

        if (utils.checkNull(idBrandname)) {
            values.id = Guid.EMPTY;
        }

        const data = values as BrandnameDto;
        if (utils.checkNull(idBrandname)) {
            const dataNew = await BrandnameService.CreateBrandname(values);
            dataNew.txtTrangThai = values.trangThai === 1 ? 'Kích hoạt' : 'Chưa kích hoạt';
            dataNew.tongTienNap = 0;
            dataNew.daSuDung = 0;
            dataNew.conLai = 0;
            dataNew.displayTenantName = values.displayTenantName;
            onSave(dataNew);
        } else {
            await BrandnameService.UpdateBrandname(values);
            data.txtTrangThai = values.trangThai === 1 ? 'Kích hoạt' : 'Chưa kích hoạt';
            data.tongTienNap = objUpdate.tongTienNap;
            data.daSuDung = objUpdate.daSuDung;
            data.conLai = objUpdate.conLai;
            onSave(data);
        }
    };

    const rules = yup.object().shape({
        tenantId: yup.string().required('Vui lòng chọn tenantname'),
        brandname: yup.string().required('Vui lòng nhập tên brandname'),
        sdtCuaHang: yup.string().required('Vui lòng nhập số điện thoại gửi tin')
    });

    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Dialog open={isShow} onClose={onClose} aria-labelledby="draggable-dialog-title" maxWidth="xs">
                <DialogTitle className="modal-title" id="draggable-dialog-title">
                    {utils.checkNull(idBrandname) ? 'Thêm' : 'Cập nhật'} brandname
                </DialogTitle>
                <DialogButtonClose onClose={onClose} />
                <Formik
                    initialValues={objBrandname}
                    validationSchema={rules}
                    onSubmit={saveBrandname}
                    enableReinitialize>
                    {({ isSubmitting, handleChange, values, errors, touched, setFieldValue }: any) => (
                        <Form>
                            <DialogContent sx={{ overflow: 'unset' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                            <Typography variant="body2">Kích hoạt</Typography>
                                            <IOSSwitch
                                                sx={{ m: 1 }}
                                                value={values.trangThai}
                                                checked={parseInt(values.trangThai) == 1 ? true : false}
                                                onChange={() => {
                                                    const newVal = values.trangThai == 1 ? 0 : 1;
                                                    setFieldValue('trangThai', newVal);
                                                }}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <AutocompleteFromDB
                                            type="tenant"
                                            label="Chọn tenant"
                                            optionLabel={{ label1: '', label2: 'Tenant:' }}
                                            idChosed={values.tenantId}
                                            handleChoseItem={(item: IDataAutocomplete) => {
                                                setFieldValue('tenantId', item?.id);
                                                setFieldValue('displayTenantName', item?.text1);
                                            }}
                                            helperText={touched.tenantId && errors.tenantId}
                                            err={touched.tenantId && Boolean(errors?.tenantId)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            name="brandname"
                                            fullWidth
                                            autoFocus
                                            label={`Tên brandname *`}
                                            onChange={handleChange}
                                            value={values.brandname}
                                            helperText={
                                                touched.brandname && errors.brandname && <span>{errors.brandname}</span>
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            name="sdtCuaHang"
                                            fullWidth
                                            label={`Số điện thoại`}
                                            onChange={handleChange}
                                            value={values.sdtCuaHang}
                                            helperText={
                                                touched.sdtCuaHang &&
                                                errors.sdtCuaHang && <span>{errors.sdtCuaHang}</span>
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <DatePickerCustom
                                            label="Ngày kích hoạt"
                                            defaultVal={values.ngayKichHoat}
                                            handleChangeDate={(newVal: string) => setFieldValue('ngayKichHoat', newVal)}
                                        />
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions style={{ paddingBottom: '20px' }}>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        color: 'var(--color-main)'
                                    }}
                                    onClick={onClose}
                                    className="btn-outline-hover">
                                    Hủy
                                </Button>
                                {isSubmitting ? (
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: 'var(--color-main)!important' }}
                                        className="btn-container-hover">
                                        Đang lưu
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: 'var(--color-main)!important' }}
                                        type="submit"
                                        className="btn-container-hover">
                                        Lưu
                                    </Button>
                                )}
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </>
    );
}
