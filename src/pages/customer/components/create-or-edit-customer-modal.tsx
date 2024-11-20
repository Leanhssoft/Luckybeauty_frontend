import { Component, ReactNode } from 'react';
import { CreateOrEditKhachHangDto } from '../../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import {
    Autocomplete,
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    Dialog,
    RadioGroup,
    FormControlLabel,
    Radio,
    Stack,
    DialogTitle,
    DialogContent
} from '@mui/material';
import closeIcon from '../../../images/close-square.svg';
import React from 'react';
import { Form, Formik } from 'formik';
import khachHangService from '../../../services/khach-hang/khachHangService';
import AppConsts from '../../../lib/appconst';
import { enqueueSnackbar } from 'notistack';
import { observer } from 'mobx-react';
import suggestStore from '../../../stores/suggestStore';
import '../customerPage.css';
import rules from './create-or-edit-customer.validate';
import utils from '../../../utils/utils';
import uploadFileService from '../../../services/uploadFileService';
import PersonIcon from '@mui/icons-material/Person';
import { NumericFormat } from 'react-number-format';
import { format as formatDate } from 'date-fns';
import bookingStore from '../../../stores/bookingStore';
import DatePickerRequiredCustom from '../../../components/DatetimePicker/DatePickerRequiredCustom';
import ZaloService from '../../../services/zalo/ZaloService';
import { IInforUserZOA, IMemberZOA, ZaloAuthorizationDto } from '../../../services/zalo/zalo_dto';
import AutocompleteWithData from '../../../components/Autocomplete/AutocompleteWithData';
import { IDataAutocomplete } from '../../../services/dto/IDataAutocomplete';
import { KhachHangDto } from '../../../services/khach-hang/dto/KhachHangDto';

export interface ICreateOrEditCustomerProps {
    visible: boolean;
    onCancel: () => void;
    title: string;
    onOk: ({ dataSave }: any) => void;
    formRef: CreateOrEditKhachHangDto;
}
class CreateOrEditCustomerDialog extends Component<ICreateOrEditCustomerProps> {
    state = {
        errorPhoneNumber: false,
        errorTenKhach: false,
        cusImage: '',
        googleDrive_fileId: '',
        fileImage: {} as File,
        ZOA_allUser: [] as IInforUserZOA[],
        ZOA_userChosed: {} as IInforUserZOA,
        zaloToken: {} as ZaloAuthorizationDto
    };
    async getSuggest() {
        await suggestStore.getSuggestNguonKhach();
        await suggestStore.getSuggestNhomKhach();
        await this.GetDanhSach_KhachHang_QuanTamOA();
    }
    async GetDanhSach_KhachHang_QuanTamOA() {
        const zaloToken = await ZaloService.Innit_orGetToken();
        if (zaloToken != null && zaloToken.accessToken !== null) {
            this.setState({ zaloToken: zaloToken });
            const data = await ZaloService.ZOA_GetDanhSachNguoiDung(zaloToken.accessToken);

            if ((data?.total ?? 0) > 0) {
                const arr: IInforUserZOA[] = [];
                for (let index = 0; index < data?.users?.length; index++) {
                    const itFor = data?.users[index];
                    const user = await ZaloService.GetInforUser_ofOA(zaloToken?.accessToken, itFor.user_id);
                    if (user != null) {
                        user.idKhachHang = itFor.id;
                        user.soDienThoai = itFor?.soDienThoai;
                        arr.push(user);
                    }
                }
                this.setState({ ZOA_allUser: arr });
            }
        }
    }
    componentDidMount(): void {
        this.getSuggest();
    }
    UNSAFE_componentWillReceiveProps(nextProp: any): void {
        if (nextProp.formRef !== undefined) {
            const objUpdate = JSON.parse(JSON.stringify(nextProp.formRef));
            this.setState({
                cusImage: uploadFileService.GoogleApi_NewLink(objUpdate?.avatar ?? ''),
                googleDrive_fileId: uploadFileService.GoogleApi_GetFileIdfromLink(objUpdate?.avatar ?? '')
            });
        }
    }

    choseImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await this.closeImage();
        if (e.target.files && e.target.files[0]) {
            const file: File = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.setState((prev) => {
                    return {
                        ...prev,
                        cusImage: reader.result?.toString() ?? ''
                    };
                });
            };
            this.setState((prev) => {
                return {
                    ...prev,
                    fileImage: file
                };
            });
        }
    };
    closeImage = async () => {
        if (!utils.checkNull(this.state.googleDrive_fileId)) {
            await uploadFileService.GoogleApi_RemoveFile_byId(this.state.googleDrive_fileId);
        }
        this.setState((prev) => {
            return {
                ...prev,
                googleDrive_fileId: '',
                cusImage: ''
            };
        });
    };

    render(): ReactNode {
        const { visible, onCancel, title, onOk, formRef } = this.props;
        const initValues: CreateOrEditKhachHangDto = formRef;
        return (
            <Dialog open={visible} onClose={onCancel} maxWidth="sm" fullWidth>
                <DialogTitle className="modal-title">{title}</DialogTitle>
                <DialogContent>
                    <Formik
                        enableReinitialize
                        initialValues={initValues}
                        validationSchema={rules}
                        onSubmit={async (values) => {
                            // check exists sodienthoai
                            if (!utils.checkNull(values?.soDienThoai)) {
                                const existPhone = await khachHangService.checkExistSoDienThoai(
                                    values.soDienThoai,
                                    values.id
                                );
                                if (existPhone) {
                                    enqueueSnackbar('Số điện thoại đã tồn tại', {
                                        variant: 'error',
                                        autoHideDuration: 3000
                                    });
                                    return;
                                }
                            }

                            let fileId = this.state.googleDrive_fileId;
                            const fileSelect = this.state.fileImage;
                            if (!utils.checkNull(this.state.cusImage)) {
                                // nếu cập nhật: chỉ upload nếu chọn lại ảnh
                                if (
                                    utils.checkNull(formRef.id) ||
                                    (!utils.checkNull(formRef.id) &&
                                        !utils.checkNull(formRef.avatar) &&
                                        utils.checkNull(this.state.googleDrive_fileId)) ||
                                    utils.checkNull(formRef.avatar)
                                ) {
                                    // awlay insert: because image was delete before save
                                    fileId = await uploadFileService.GoogleApi_UploaFileToDrive(
                                        fileSelect,
                                        'KhachHang'
                                    );
                                }
                            }

                            // check exists zaoauserid
                            let idKhachHangZalo = await ZaloService.GetId_fromZOAUserId(values?.zoaUserId ?? '');
                            if (idKhachHangZalo == null) {
                                // get user zalo
                                const user = await ZaloService.GetInforUser_ofOA(
                                    this.state.zaloToken?.accessToken,
                                    values?.zoaUserId ?? ''
                                );
                                if (user !== null) {
                                    const input: IMemberZOA = {
                                        user_id: user.user_id as string,
                                        display_name: user.display_name as string,
                                        user_id_by_app: user.user_id_by_app as string,
                                        user_is_follower: user.user_is_follower,
                                        avatar: user.avatar
                                    };
                                    const zoaUserNew = await ZaloService.DangKyThanhVienZOA(input);
                                    idKhachHangZalo = zoaUserNew.id as unknown as string;
                                }
                            }
                            // gán lại image theo id mới
                            values.avatar = fileId !== '' ? `https://drive.google.com/uc?export=view&id=${fileId}` : '';
                            values.tenKhachHang_KhongDau = utils.strToEnglish(values.tenKhachHang);
                            values.idKhachHangZOA = idKhachHangZalo as unknown as undefined;

                            const createOrEdit = await khachHangService.createOrEdit(values);
                            bookingStore.createOrEditBookingDto.idKhachHang = createOrEdit.id.toString();
                            createOrEdit != null
                                ? values.id === AppConsts.guidEmpty
                                    ? enqueueSnackbar('Thêm mới thành công', {
                                          variant: 'success',
                                          autoHideDuration: 3000
                                      })
                                    : enqueueSnackbar('Cập nhật thành công', {
                                          variant: 'success',
                                          autoHideDuration: 3000
                                      })
                                : enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại sau', {
                                      variant: 'error',
                                      autoHideDuration: 3000
                                  });
                            this.setState({ errorPhoneNumber: false, errorTenKhach: false });
                            onOk(createOrEdit);
                        }}>
                        {({ isSubmitting, setFieldValue, values, handleChange, errors, touched }) => (
                            <Form
                                onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault(); // Prevent form submission
                                    }
                                }}>
                                <Box
                                    sx={{
                                        '& .text-danger': {
                                            fontSize: '12px'
                                        }
                                    }}>
                                    <Grid container className="form-container" spacing={2}>
                                        <Grid item xs={12}>
                                            <Grid container justifyContent="flex-start">
                                                <Grid item xs={5}></Grid>
                                                <Grid item xs={2}>
                                                    <Stack alignItems="center" position={'relative'}>
                                                        {!utils.checkNull(this.state.cusImage) ? (
                                                            <Box
                                                                sx={{
                                                                    position: 'relative'
                                                                }}>
                                                                <img
                                                                    src={this.state.cusImage}
                                                                    className="user-image-upload"
                                                                />
                                                            </Box>
                                                        ) : (
                                                            <div>
                                                                <PersonIcon className="user-icon-upload" />
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
                                                            onChange={this.choseImage}
                                                        />
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={5}></Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                size="small"
                                                name="tenKhachHang"
                                                autoFocus
                                                value={values.tenKhachHang}
                                                onChange={handleChange}
                                                label={
                                                    <Typography
                                                        //color="#4C4B4C"
                                                        variant="body2">
                                                        Tên khách hàng
                                                        <span className="text-danger">*</span>
                                                    </Typography>
                                                }
                                                helperText={
                                                    errors.tenKhachHang && touched.tenKhachHang ? (
                                                        <small className="text-danger">
                                                            Tên khách hàng không được để trống
                                                        </small>
                                                    ) : null
                                                }
                                                fullWidth
                                                sx={{
                                                    fontSize: '16px',
                                                    color: '#4c4b4c'
                                                }}></TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <NumericFormat
                                                name="soDienThoai"
                                                size="small"
                                                type="tel"
                                                label={<Typography variant="body2">Số điện thoại</Typography>}
                                                fullWidth
                                                value={values.soDienThoai}
                                                helperText={
                                                    errors.soDienThoai && touched.soDienThoai ? (
                                                        <small className="text-danger">
                                                            Số điện thoại không hợp lệ
                                                        </small>
                                                    ) : null
                                                }
                                                sx={{ fontSize: '13px' }}
                                                onChange={handleChange}
                                                customInput={TextField}
                                            />
                                        </Grid>
                                        <Grid item sm={6} xs={12}>
                                            <DatePickerRequiredCustom
                                                props={{
                                                    width: '100%',
                                                    label: 'Ngày sinh',
                                                    size: 'small'
                                                }}
                                                defaultVal={
                                                    values.ngaySinh
                                                        ? formatDate(new Date(values.ngaySinh), 'yyyy-MM-dd')
                                                        : ''
                                                }
                                                handleChangeDate={(dt: string) => {
                                                    values.ngaySinh = new Date(dt);
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                type="text"
                                                size="small"
                                                name="diaChi"
                                                label="Địa chỉ"
                                                value={values.diaChi}
                                                onChange={handleChange}
                                                fullWidth
                                                sx={{ fontSize: '16px' }}></TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <Autocomplete
                                                value={
                                                    suggestStore.suggestNhomKhach &&
                                                    suggestStore.suggestNhomKhach.length > 0
                                                        ? suggestStore.suggestNhomKhach.find(
                                                              (x) => x.id === values.idNhomKhach
                                                          ) || {
                                                              id: '',
                                                              tenNhomKhach: ''
                                                          }
                                                        : { id: '', tenNhomKhach: '' }
                                                }
                                                options={suggestStore?.suggestNhomKhach ?? []}
                                                getOptionLabel={(option) => option.tenNhomKhach}
                                                size="small"
                                                fullWidth
                                                disablePortal
                                                onChange={(event, value) => {
                                                    setFieldValue('idNhomKhach', value ? value.id : undefined);
                                                    // Update the 'idNhomKhach' value in Formik
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Nhóm khách"
                                                        // placeholder="Chọn nhóm khách"
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} style={{ display: 'none' }}>
                                            <Autocomplete
                                                value={
                                                    suggestStore.suggestNguonKhach &&
                                                    suggestStore.suggestNguonKhach.length > 0
                                                        ? suggestStore.suggestNguonKhach.find(
                                                              (x) => x.id === values.idNguonKhach
                                                          ) || {
                                                              id: '',
                                                              tenNguonKhach: ''
                                                          }
                                                        : { id: '', tenNguonKhach: '' }
                                                }
                                                options={suggestStore?.suggestNguonKhach ?? []}
                                                getOptionLabel={(option) => option.tenNguonKhach}
                                                size="small"
                                                fullWidth
                                                disablePortal
                                                onChange={(event, value) => {
                                                    setFieldValue('idNguonKhach', value ? value.id : undefined); // Update the 'idNguonKhach' value in Formik
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Nguồn khách"
                                                        placeholder="Chọn nguồn khách"
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12}>
                                            <Stack spacing={2} direction={'row'}>
                                                <Stack
                                                    className="modal-lable "
                                                    justifyContent={'center'}
                                                    alignItems={'center'}>
                                                    Giới tính
                                                </Stack>
                                                <RadioGroup
                                                    onChange={handleChange}
                                                    row
                                                    defaultValue={'true'}
                                                    value={values.gioiTinhNam ?? false}
                                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                                    name="gioiTinhNam">
                                                    <FormControlLabel value="true" control={<Radio />} label="Nam" />
                                                    <FormControlLabel value="false" control={<Radio />} label="Nữ" />
                                                    <FormControlLabel value="" control={<Radio />} label="Khác" />
                                                </RadioGroup>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <AutocompleteWithData
                                                label={'Tài khoản zalo'}
                                                idChosed={
                                                    utils.checkNull(values?.zoaUserId ?? '') ||
                                                    values?.zoaUserId === undefined
                                                        ? ''
                                                        : values?.zoaUserId
                                                }
                                                lstData={this.state.ZOA_allUser?.map((x) => {
                                                    return {
                                                        id: x?.user_id,
                                                        text1: x?.display_name,
                                                        imgUrl: x?.avatar
                                                    } as IDataAutocomplete;
                                                })}
                                                handleChoseItem={(item) => setFieldValue('zoaUserId', item?.id ?? '')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} style={{ display: 'none' }}>
                                            <TextField
                                                fullWidth
                                                name="moTa"
                                                label="Ghi chú"
                                                value={values.moTa || ''}
                                                onChange={handleChange}
                                                // rows={2}
                                                // maxRows={2}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Stack spacing={1} direction={'row'} justifyContent={'flex-end'}>
                                                <Button
                                                    variant="outlined"
                                                    onClick={onCancel}
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
                                </Box>
                            </Form>
                        )}
                    </Formik>
                    <Button
                        onClick={onCancel}
                        sx={{
                            position: 'absolute',
                            top: '16px',
                            right: '24px',
                            padding: '0',
                            maxWidth: '24px',
                            minWidth: '0',
                            '&:hover img': {
                                filter: 'brightness(0) saturate(100%) invert(36%) sepia(74%) saturate(1465%) hue-rotate(318deg) brightness(94%) contrast(100%)'
                            }
                        }}>
                        <img src={closeIcon} />
                    </Button>
                </DialogContent>
            </Dialog>
        );
    }
}
export default observer(CreateOrEditCustomerDialog);
