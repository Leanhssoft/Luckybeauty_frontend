import { Component, ReactNode } from 'react';
import { CreateOrUpdateNhanSuDto } from '../../../services/nhan-vien/dto/createOrUpdateNhanVienDto';
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    Grid,
    Stack,
    TextField,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    DialogTitle,
    DialogContent
} from '@mui/material';
import closeIcon from '../../../images/close-square.svg';
import '../employee.css';
import { Form, Formik } from 'formik';
import nhanVienService from '../../../services/nhan-vien/nhanVienService';
import rules from './createOrEditNhanVien.validate';
import AppConsts from '../../../lib/appconst';
import { enqueueSnackbar } from 'notistack';
import useWindowWidth from '../../../components/StateWidth';
import AddIcon from '@mui/icons-material/Add';
import CreateOrEditChucVuModal from '../chuc-vu/components/create-or-edit-chuc-vu-modal';
import suggestStore from '../../../stores/suggestStore';
import { observer } from 'mobx-react';
import abpCustom from '../../../components/abp-custom';
import utils from '../../../utils/utils';
import uploadFileService from '../../../services/uploadFileService';
import { SuggestChucVuDto } from '../../../services/suggests/dto/SuggestChucVuDto';
import PersonIcon from '@mui/icons-material/Person';
import { format as formatDate } from 'date-fns';
import vi from 'date-fns/locale/vi';
import { NumericFormat } from 'react-number-format';
import nhanVienStore from '../../../stores/nhanVienStore';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import DatePickerRequiredCustom from '../../../components/DatetimePicker/DatePickerRequiredCustom';
import { CreateOrEditChucVuDto } from '../../../services/nhan-vien/chuc_vu/dto/CreateOrEditChucVuDto';
import { Guid } from 'guid-typescript';
import { SuggestDichVuDto } from '../../../services/suggests/dto/SuggestDichVuDto';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { C } from '@fullcalendar/core/internal-common';
import { boolean } from 'yup';
export interface ICreateOrEditUserProps {
    visible: boolean;
    onCancel: () => void;
    title: string;
    onOk: () => void;
    formRef: CreateOrUpdateNhanSuDto;
}

class CreateOrEditEmployeeDialog extends Component<ICreateOrEditUserProps> {
    state = {
        avatarFile: '',
        chucVuVisiable: false,
        isShowConfirmDelete: false,
        staffImage: '',
        googleDrive_fileId: '',
        fileImage: {} as File,
        checkAllService: false as boolean
    };
    componentDidMount(): void {
        suggestStore.getSuggestDichVu();
    }
    onModalChucVu = () => {
        this.setState({
            chucVuVisiable: !this.state.chucVuVisiable
        });
    };
    handleSubmitChucVu = async () => {
        // assign idChucVu to nhanvien (todo)
        this.setState({
            chucVuVisiable: !this.state.chucVuVisiable
        });
    };
    onModalDelete = () => {
        this.setState({ isShowConfirmDelete: !this.state.isShowConfirmDelete });
    };
    handleDelete = async () => {
        this.onModalDelete();
        this.props.onCancel();
    };
    onOkDelete = async () => {
        const deleteResult = nhanVienStore.delete(nhanVienStore.createEditNhanVien.id);
        deleteResult != null
            ? enqueueSnackbar('Xóa bản ghi thành công', {
                  variant: 'success',
                  autoHideDuration: 3000
              })
            : enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại sau!', {
                  variant: 'error',
                  autoHideDuration: 3000
              });
        this.onModalDelete();
        this.props.onCancel();
    };
    // onSelectAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files && e.target.files[0]) {
    //         const file: File = e.target.files[0];
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file);

    //         reader.onload = () => {
    //             this.setState((prev) => ({
    //                 ...prev,
    //                 staffImage: reader.result?.toString() ?? '',
    //                 fileImage: file
    //             }));
    //         };
    //     }
    // };
    closeImage = async () => {
        if (!utils.checkNull(this.state.googleDrive_fileId)) {
            await uploadFileService.GoogleApi_RemoveFile_byId(this.state.googleDrive_fileId);
        }
        this.setState((prev) => {
            return {
                ...prev,
                googleDrive_fileId: '',
                staffImage: ''
            };
        });
    };
    handleSelectAllService = (checked: boolean) => {
        if (checked === true) {
            this.setState({
                selectedServices: suggestStore.suggestDichVu.map((item) => {
                    return item.id;
                })
            });
        } else {
            this.setState({
                selectedServices: []
            });
        }
    };

    render(): ReactNode {
        const { visible, onCancel, title, onOk, formRef } = this.props;
        const initValues: CreateOrUpdateNhanSuDto = nhanVienStore.createEditNhanVien;
        return (
            <Dialog
                open={visible}
                onClose={onCancel}
                maxWidth="md"
                fullWidth
                //className="poppup-them-nhan-vien"
                sx={{
                    borderRadius: '12px',
                    padding: '24px'
                }}>
                <DialogTitle>
                    <Typography
                        variant="h3"
                        fontSize="24px"
                        //color="#333233"
                        fontWeight="700">
                        {title}
                    </Typography>
                    <Button
                        onClick={onCancel}
                        sx={{
                            position: 'absolute',
                            top: '32px',
                            right: '28px',
                            padding: '0',
                            maxWidth: '24px',
                            minWidth: '0',
                            '&:hover img': {
                                filter: 'brightness(0) saturate(100%) invert(36%) sepia(74%) saturate(1465%) hue-rotate(318deg) brightness(94%) contrast(100%)'
                            }
                        }}>
                        <img src={closeIcon} />
                    </Button>
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={initValues}
                        validationSchema={rules}
                        onSubmit={async (values, { setFieldError }) => {
                            values.id = initValues.id;
                            values.idChucVu = nhanVienStore.createEditNhanVien.idChucVu;
                            let fileId = this.state.googleDrive_fileId;
                            const fileSelect = this.state.fileImage;
                            if (!utils.checkNull(this.state.staffImage)) {
                                fileId = await uploadFileService.GoogleApi_UploaFileToDrive(fileSelect, 'NhanVien');
                                values.avatar =
                                    fileId !== '' ? `https://drive.google.com/uc?export=view&id=${fileId}` : '';
                            }
                            if (values.idChucVu === '' || values.idChucVu === AppConsts.guidEmpty) {
                                setFieldError('idChucVu', 'Vị trí nhân viên không được để trống');
                            } else {
                                const createOrEdit = await nhanVienService.createOrEdit(values);
                                createOrEdit != null
                                    ? formRef.id === AppConsts.guidEmpty
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
                                this.setState({ staffImage: '' });
                                onOk();
                            }
                        }}>
                        {({ isSubmitting, handleChange, errors, values, setFieldValue, touched }) => (
                            <Form
                                onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault(); // Prevent form submission
                                    }
                                }}>
                                <Box
                                    display="flex"
                                    flexDirection={useWindowWidth() < 600 ? 'column' : 'row'}
                                    justifyContent="space-between">
                                    <Grid container className="form-container" spacing={2}>
                                        <Grid item xs={12}>
                                            <Box>
                                                <Stack alignItems="center" position={'relative'}>
                                                    {!utils.checkNull(values.avatar) ? (
                                                        <Box
                                                            sx={{
                                                                position: 'relative'
                                                            }}>
                                                            <img src={values.avatar} className="user-image-upload" />
                                                        </Box>
                                                    ) : (
                                                        <div>
                                                            <PersonIcon className="user-icon-upload" />
                                                        </div>
                                                    )}
                                                    <TextField
                                                        type="file"
                                                        name="avatar"
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
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                const file: File = e.target.files[0];
                                                                const reader = new FileReader();
                                                                reader.readAsDataURL(file);
                                                                reader.onload = () => {
                                                                    this.setState((prev) => ({
                                                                        ...prev,
                                                                        staffImage: reader.result?.toString() ?? '',
                                                                        fileImage: file
                                                                    }));
                                                                    setFieldValue(
                                                                        'avatar',
                                                                        reader.result?.toString() ?? ''
                                                                    );
                                                                };
                                                            }
                                                        }}
                                                    />
                                                </Stack>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                name="tenNhanVien"
                                                size="small"
                                                value={values.tenNhanVien}
                                                label={
                                                    <Typography
                                                        //color="#4C4B4C"
                                                        variant="subtitle2">
                                                        Họ và tên
                                                        <span className="text-danger">*</span>
                                                    </Typography>
                                                }
                                                error={errors.tenNhanVien && touched.tenNhanVien ? true : false}
                                                helperText={
                                                    errors.tenNhanVien &&
                                                    touched.tenNhanVien && (
                                                        <small className="text-danger">{errors.tenNhanVien}</small>
                                                    )
                                                }
                                                onChange={handleChange}
                                                fullWidth
                                                sx={{
                                                    fontSize: '16px'
                                                }}></TextField>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <NumericFormat
                                                name="soDienThoai"
                                                size="small"
                                                type="tel"
                                                label={
                                                    <Typography
                                                        //color="#4C4B4C"
                                                        variant="subtitle2">
                                                        Số điện thoại
                                                    </Typography>
                                                }
                                                fullWidth
                                                value={values.soDienThoai}
                                                error={errors.soDienThoai && touched.soDienThoai ? true : false}
                                                helperText={
                                                    errors.soDienThoai &&
                                                    touched.soDienThoai && (
                                                        <small className="text-danger">{errors.soDienThoai}</small>
                                                    )
                                                }
                                                sx={{ fontSize: '13px' }}
                                                onChange={handleChange}
                                                customInput={TextField}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                size="small"
                                                type="text"
                                                name="diaChi"
                                                label={
                                                    <Typography
                                                        //color="#4C4B4C"
                                                        variant="subtitle2">
                                                        Địa chỉ
                                                    </Typography>
                                                }
                                                value={values.diaChi}
                                                onChange={handleChange}
                                                placeholder="Nhập địa chỉ của nhân viên"
                                                fullWidth
                                                sx={{ fontSize: '16px' }}></TextField>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
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
                                                    values.ngaySinh = dt;
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box display={'flex'} flexDirection={'row'} gap={1}>
                                                <Autocomplete
                                                    value={
                                                        suggestStore.suggestChucVu?.filter(
                                                            (x) =>
                                                                x.idChucVu == nhanVienStore.createEditNhanVien.idChucVu
                                                        )[0] ||
                                                        ({
                                                            idChucVu: '',
                                                            tenChucVu: ''
                                                        } as SuggestChucVuDto)
                                                    }
                                                    options={suggestStore.suggestChucVu}
                                                    getOptionLabel={(option) => `${option.tenChucVu}`}
                                                    fullWidth
                                                    disablePortal
                                                    onChange={(event, value) => {
                                                        nhanVienStore.createEditNhanVien.idChucVu = value
                                                            ? value.idChucVu
                                                            : '';
                                                        setFieldValue('idChucVu', value ? value.idChucVu : ''); // Cập nhật giá trị id trong Formik
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            size="small"
                                                            label={
                                                                <Typography
                                                                    //color="#4C4B4C"
                                                                    variant="subtitle2">
                                                                    Chức vụ <span className="text-danger">*</span>
                                                                </Typography>
                                                            }
                                                            error={errors.idChucVu && touched.idChucVu ? true : false}
                                                            helperText={
                                                                errors.idChucVu &&
                                                                touched.idChucVu && (
                                                                    <small className="text-danger">
                                                                        {errors.idChucVu}
                                                                    </small>
                                                                )
                                                            }
                                                            placeholder="Nhập tên chức vụ"
                                                        />
                                                    )}
                                                />
                                                <Button
                                                    hidden={!abpCustom.isGrandPermission('Pages.ChucVu.Create')}
                                                    sx={{ width: '48px', padding: 0, minWidth: 'auto' }}
                                                    onClick={this.onModalChucVu}
                                                    variant="contained">
                                                    <AddIcon />
                                                </Button>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Stack spacing={1} direction={'row'}>
                                                <Stack
                                                    className="modal-lable "
                                                    justifyContent={'center'}
                                                    alignItems={'center'}>
                                                    <Typography
                                                        //color="#4C4B4C"
                                                        variant="subtitle2">
                                                        Giới tính
                                                    </Typography>
                                                </Stack>
                                                <RadioGroup
                                                    onChange={handleChange}
                                                    row
                                                    defaultValue={'true'}
                                                    value={values.gioiTinh}
                                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                                    name="gioiTinh">
                                                    <FormControlLabel value={1} control={<Radio />} label="Nam" />
                                                    <FormControlLabel value={2} control={<Radio />} label="Nữ" />
                                                    <FormControlLabel value={0} control={<Radio />} label="Khác" />
                                                </RadioGroup>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Autocomplete
                                                multiple
                                                options={[
                                                    { id: 'selectAll', tenDichVu: 'Chọn tất cả' },
                                                    ...suggestStore.suggestDichVu
                                                ]}
                                                getOptionLabel={(option) => option.tenDichVu}
                                                value={suggestStore.suggestDichVu?.filter((x) =>
                                                    values.services?.includes(x.id)
                                                )}
                                                disableClearable
                                                renderOption={(props, option) => (
                                                    <li
                                                        {...props}
                                                        onClick={option.id === 'selectAll' ? undefined : props.onClick}>
                                                        {option.id === 'selectAll' ? (
                                                            <div
                                                                style={{ width: '100%' }}
                                                                onClick={() => {
                                                                    const checked = !this.state.checkAllService;
                                                                    this.setState({
                                                                        checkAllService: checked
                                                                    });
                                                                    if (checked) {
                                                                        setFieldValue(
                                                                            'services',
                                                                            suggestStore.suggestDichVu.map(
                                                                                (item) => item.id
                                                                            )
                                                                        );
                                                                    } else {
                                                                        setFieldValue('services', []);
                                                                    }
                                                                }}>
                                                                <Checkbox
                                                                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                                                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                                                                    style={{ marginRight: 8 }}
                                                                    checked={
                                                                        values.services?.length ===
                                                                        suggestStore.suggestDichVu.length
                                                                    }
                                                                />
                                                                {option.tenDichVu}
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <Checkbox
                                                                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                                                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                                                                    style={{ marginRight: 8 }}
                                                                    checked={
                                                                        values.services?.includes(option.id) || false
                                                                    }
                                                                />
                                                                {option.tenDichVu}
                                                            </div>
                                                        )}
                                                    </li>
                                                )}
                                                onChange={(event, value) => {
                                                    if (value.some((x) => x.id === 'selectAll')) {
                                                        setFieldValue(
                                                            'services',
                                                            suggestStore.suggestDichVu.map((x) => x.id)
                                                        );
                                                    } else {
                                                        setFieldValue(
                                                            'services',
                                                            value.filter((x) => x.id !== 'selectAll').map((x) => x.id)
                                                        );
                                                    }
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Dịch vụ"
                                                        placeholder="Chọn dịch vụ cho nhân viên"
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                multiline
                                                size="small"
                                                label={
                                                    <Typography
                                                        //color="#4C4B4C"
                                                        variant="subtitle2">
                                                        Ghi chú
                                                    </Typography>
                                                }
                                                placeholder="Điền"
                                                name="ghiChu"
                                                value={values.ghiChu?.toString()}
                                                maxRows={4}
                                                minRows={4}
                                                style={{
                                                    width: '100%',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box
                                    sx={{
                                        position: 'sticky',
                                        bgcolor: '#fff',
                                        bottom: '0',
                                        display: 'flex',
                                        gap: '8px',
                                        paddingTop: '16px',
                                        justifyContent: 'end'
                                    }}>
                                    <Button
                                        onClick={onCancel}
                                        variant="outlined"
                                        sx={{
                                            fontSize: '14px',
                                            textTransform: 'unset',
                                            color: 'var(--color-main)'
                                        }}
                                        className="btn-outline-hover">
                                        Hủy
                                    </Button>
                                    {values.id === AppConsts.guidEmpty || values.id === '' ? null : (
                                        <Button
                                            onClick={this.onModalDelete}
                                            variant="outlined"
                                            color="error"
                                            sx={{
                                                fontSize: '14px'
                                                //textTransform: 'unset'
                                                //color: 'var(--color-main)'
                                            }}>
                                            Xóa
                                        </Button>
                                    )}

                                    {!isSubmitting ? (
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: '#fff',

                                                border: 'none'
                                            }}
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
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>

                <CreateOrEditChucVuModal
                    idChucVu={Guid.EMPTY}
                    visiable={this.state.chucVuVisiable}
                    handleClose={this.onModalChucVu}
                    handleSubmit={this.handleSubmitChucVu}
                />
                <ConfirmDelete
                    isShow={this.state.isShowConfirmDelete}
                    onOk={this.onOkDelete}
                    onCancel={this.handleDelete}></ConfirmDelete>
            </Dialog>
        );
    }
}
export default observer(CreateOrEditEmployeeDialog);
