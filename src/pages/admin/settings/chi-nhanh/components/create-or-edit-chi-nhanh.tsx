import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography,
    Box,
    FormControl,
    FormControlLabel,
    Checkbox,
    Stack
} from '@mui/material';
import { Component, ReactNode } from 'react';
import rules from './createOrEditChiNhanh.validate';
import { CreateOrEditChiNhanhDto } from '../../../../../services/chi_nhanh/Dto/createOrEditChiNhanhDto';
import { Form, Formik } from 'formik';
import chiNhanhService from '../../../../../services/chi_nhanh/chiNhanhService';
import MonochromePhotosOutlinedIcon from '@mui/icons-material/MonochromePhotosOutlined';
import AppConsts from '../../../../../lib/appconst';
import uploadFileService from '../../../../../services/uploadFileService';
import utils from '../../../../../utils/utils';
import { NumericFormat } from 'react-number-format';
import { format as formatDate } from 'date-fns';
import Cookies from 'js-cookie';
import DatePickerRequiredCustom from '../../../../../components/DatetimePicker/DatePickerRequiredCustom';
import DialogButtonClose from '../../../../../components/Dialog/ButtonClose';
interface ChiNhanhProps {
    isShow: boolean;
    onSave: () => void;
    onCLose: () => void;
    formRef: CreateOrEditChiNhanhDto;
    title: React.ReactNode;
}
class CreateOrEditChiNhanhModal extends Component<ChiNhanhProps> {
    state = {
        branchLogo: '',
        googleDrive_fileId: '',
        fileImage: {} as File
    };
    UNSAFE_componentWillReceiveProps(nextProp: any): void {
        if (nextProp.formRef !== undefined) {
            const objUpdate = JSON.parse(JSON.stringify(nextProp.formRef));
            this.setState({
                branchLogo: objUpdate?.logo ?? '',
                googleDrive_fileId: uploadFileService.GoogleApi_GetFileIdfromLink(objUpdate?.logo ?? '')
            });
        }
    }

    onSelectAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file: File = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
                this.setState((prev) => ({
                    ...prev,
                    branchLogo: reader.result?.toString() ?? '',
                    fileImage: file
                }));
            };
        }
    };
    render(): ReactNode {
        const { formRef, onSave, onCLose, title, isShow } = this.props;
        const initValues: CreateOrEditChiNhanhDto = formRef;
        return (
            <Dialog open={isShow} onClose={onCLose} fullWidth maxWidth={'sm'}>
                <DialogTitle className="modal-title">
                    {title}
                    <DialogButtonClose onClose={onCLose} />
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={initValues}
                        validationSchema={rules}
                        onSubmit={async (values) => {
                            values.id = values.id == '' ? AppConsts.guidEmpty : values.id;
                            values.idCongTy = Cookies.get('IdCuaHang') ?? AppConsts.guidEmpty;
                            let fileId = this.state.googleDrive_fileId;
                            const fileSelect = this.state.fileImage;
                            if (!utils.checkNull(this.state.branchLogo)) {
                                if (this.state.branchLogo !== formRef.logo) {
                                    fileId = await uploadFileService.GoogleApi_UploaFileToDrive(fileSelect, 'ChiNhanh');
                                }
                            }
                            values.logo = fileId !== '' ? `https://drive.google.com/uc?export=view&id=${fileId}` : '';
                            await chiNhanhService.CreateOrEdit(values);
                            onSave();
                        }}>
                        {({ handleChange, values, errors, touched, setFieldValue, isSubmitting }) => (
                            <Form
                                onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault(); // Prevent form submission
                                    }
                                }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Grid container justifyContent="flex-start">
                                            <Grid item xs={5}></Grid>
                                            <Grid item xs={2}>
                                                <Stack alignItems="center" position={'relative'}>
                                                    {!utils.checkNull(this.state.branchLogo) ? (
                                                        <Box
                                                            sx={{
                                                                position: 'relative'
                                                            }}>
                                                            <img
                                                                src={this.state.branchLogo}
                                                                className="user-image-upload"
                                                            />
                                                        </Box>
                                                    ) : (
                                                        <div>
                                                            <MonochromePhotosOutlinedIcon className="user-icon-upload" />
                                                        </div>
                                                    )}
                                                    <TextField
                                                        type="file"
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            opacity: 0,
                                                            '& input': {
                                                                height: '100%'
                                                            },
                                                            '& div': {
                                                                height: '100%'
                                                            }
                                                        }}
                                                        onChange={this.onSelectAvatarFile}
                                                    />
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={5}></Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            label={<Typography variant="subtitle2">Mã chi nhánh</Typography>}
                                            size="small"
                                            name="maChiNhanh"
                                            placeholder="Mã tự động"
                                            value={values.maChiNhanh}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            label={<Typography variant="subtitle2">Tên chi nhánh</Typography>}
                                            error={errors.tenChiNhanh && touched.tenChiNhanh ? true : false}
                                            helperText={
                                                errors.tenChiNhanh &&
                                                touched.tenChiNhanh && (
                                                    <span className="text-danger">{errors.tenChiNhanh}</span>
                                                )
                                            }
                                            autoFocus
                                            size="small"
                                            placeholder="Nhập tên chi nhánh"
                                            name="tenChiNhanh"
                                            value={values.tenChiNhanh}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <NumericFormat
                                            label={<Typography variant="subtitle2">Số điện thoại</Typography>}
                                            error={errors.soDienThoai && touched.soDienThoai ? true : false}
                                            helperText={
                                                errors.soDienThoai &&
                                                touched.soDienThoai && (
                                                    <span className="text-danger">{errors.soDienThoai}</span>
                                                )
                                            }
                                            size="small"
                                            name="soDienThoai"
                                            placeholder="Nhập số điện thoại"
                                            value={values.soDienThoai}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}
                                            customInput={TextField}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            label={<Typography variant="subtitle2">Địa chỉ</Typography>}
                                            size="small"
                                            placeholder="Nhập địa chỉ"
                                            name="diaChi"
                                            value={values.diaChi}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                    {/* ngayapdung + hethan: chỉ dùng cho bên gia hạn (HOST) */}
                                    <Grid item xs={12} sm={6} sx={{ display: 'none' }}>
                                        <DatePickerRequiredCustom
                                            props={{
                                                width: '100%',
                                                size: 'small',
                                                label: <Typography variant="subtitle2">Ngày áp dụng</Typography>,
                                                error: touched.ngayApDung && Boolean(errors.ngayApDung),
                                                helperText: touched.ngayApDung && Boolean(errors.ngayApDung) && (
                                                    <span className="text-danger">{String(errors.ngayApDung)}</span>
                                                )
                                            }}
                                            defaultVal={
                                                values.ngayApDung
                                                    ? formatDate(new Date(values.ngayApDung), 'yyyy/MM/dd')
                                                    : ''
                                            }
                                            handleChangeDate={(value: string) => {
                                                values.ngayApDung = new Date(value);
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} sx={{ display: 'none' }}>
                                        <DatePickerRequiredCustom
                                            props={{
                                                width: '100%',
                                                size: 'small',
                                                label: <Typography variant="subtitle2">Ngày hết hạn</Typography>,
                                                error: touched.ngayHetHan && Boolean(errors.ngayHetHan),
                                                helperText: touched.ngayHetHan && Boolean(errors.ngayHetHan) && (
                                                    <span className="text-danger">{String(errors.ngayHetHan)}</span>
                                                )
                                            }}
                                            defaultVal={
                                                values.ngayHetHan
                                                    ? formatDate(new Date(values.ngayHetHan), 'yyyy/MM/dd')
                                                    : ''
                                            }
                                            handleChangeDate={(value: string) => {
                                                values.ngayHetHan = new Date(value);
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label={<Typography variant="subtitle2">Ghi chú</Typography>}
                                            size="small"
                                            rows={3}
                                            multiline
                                            placeholder="Ghi chú"
                                            name="ghiChu"
                                            value={values.ghiChu}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                                    </Grid>
                                    {/* kichhoat+ ngungkichhoat: chỉ dùng cho bên gia hạn (HOST) */}
                                    <Grid item xs={12} sx={{ display: 'none' }}>
                                        <FormControl fullWidth>
                                            <FormControlLabel
                                                label="Trạng thái"
                                                onChange={(e, v) => {
                                                    setFieldValue('trangThai', v === true ? 1 : 0);
                                                }}
                                                value={values.trangThai === 1 ? true : false}
                                                checked={values.trangThai === 1 ? true : false}
                                                control={<Checkbox />}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1} direction={'row'} justifyContent={'flex-end'}>
                                            <Button
                                                variant="outlined"
                                                onClick={this.props.onCLose}
                                                sx={{
                                                    fontSize: '14px',
                                                    textTransform: 'unset',
                                                    color: '#666466'
                                                }}
                                                className="btn-outline-hover">
                                                Hủy
                                            </Button>
                                            {!isSubmitting ? (
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        fontSize: '14px',
                                                        textTransform: 'unset',
                                                        color: '#fff',

                                                        border: 'none'
                                                    }}
                                                    type="submit"
                                                    className="btn-container-hover">
                                                    Lưu
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        fontSize: '14px',
                                                        textTransform: 'unset',
                                                        color: '#fff',

                                                        border: 'none'
                                                    }}
                                                    className="btn-container-hover">
                                                    Đang lưu
                                                </Button>
                                            )}
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        );
    }
}
export default CreateOrEditChiNhanhModal;
