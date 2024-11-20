import React from 'react';
import * as Yup from 'yup';
import { Formik, Form, FormikHelpers } from 'formik';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    IconButton,
    Box,
    Tab,
    TextField,
    Checkbox,
    Button,
    FormGroup,
    FormControlLabel,
    Select,
    MenuItem,
    Grid,
    Autocomplete
} from '@mui/material';
import useWindowWidth from '../../../../components/StateWidth';
import { ReactComponent as CloseIcon } from '../../../../images/close-square.svg';
import fileIcon from '../../../../images/file.svg';
import fileUpload from '../../../../images/fi_upload-cloud.svg';
import userService from '../../../../services/user/userService';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { CreateOrUpdateUserInput } from '../../../../services/user/dto/createOrUpdateUserInput';
import { SuggestNhanSuDto } from '../../../../services/suggests/dto/SuggestNhanSuDto';
import { GetRoles } from '../../../../services/user/dto/getRolesOuput';
import TabList from '@mui/lab/TabList';
import { enqueueSnackbar } from 'notistack';
import AppConsts from '../../../../lib/appconst';
import { NumericFormat } from 'react-number-format';
import authenticationStore from '../../../../stores/authenticationStore';
import Cookies from 'js-cookie';
import { Tracing } from 'trace_events';
//import rules from './createOrUpdateUser.validation';
export interface ICreateOrEditUserProps {
    visible: boolean;
    onCancel: () => void;
    modalType: string;
    onOk: () => void;
    formRef: CreateOrUpdateUserInput;
    userId: number;
    roles: GetRoles[];
    suggestNhanSu: SuggestNhanSuDto[];
}
class CreateOrEditUser extends React.Component<ICreateOrEditUserProps> {
    state = {
        confirmDirty: false,
        tabIndex: '1',
        hoVaTen: '',
        avatar: ''
    };

    setConfirmDirty = (value: boolean) => {
        this.setState({
            confirmDirty: value
        });
    };
    handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        this.setState({ tabIndex: newValue });
    };

    handleSubmit = async (values: CreateOrUpdateUserInput, helper: FormikHelpers<any>) => {
        try {
            const { formRef, onOk } = this.props;
            if (formRef.id === 0) {
                await userService.create(values);
                enqueueSnackbar('Thêm mới thành công!', {
                    variant: 'success',
                    autoHideDuration: 3000
                });
            } else {
                await userService.update({
                    id: formRef.id,
                    nhanSuId: values.nhanSuId as string,
                    emailAddress: values.emailAddress,
                    phoneNumber: values.phoneNumber,
                    isActive: values.isActive,
                    name: values.name,
                    password: values.password,
                    surname: values.surname,
                    userName: values.userName,
                    roleNames: values.roleNames,
                    isAdmin: values.isAdmin ?? false
                });
                enqueueSnackbar('Cập nhật thành công!', {
                    variant: 'success',
                    autoHideDuration: 3000
                });
                formRef.id.toString() === Cookies.get('userId') ? authenticationStore.logout() : undefined;
            }
            this.setState({ avatar: '' });
            helper.resetForm();
            onOk();
        } catch (error) {
            enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại sau!', {
                variant: 'error',
                autoHideDuration: 3000
            });
        }
    };
    handleFormKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
        }
    };
    render() {
        const { visible, onCancel, modalType, userId, roles, suggestNhanSu, formRef } = this.props;

        const options = roles.map((x) => ({
            label: x.name,
            value: x.normalizedName
        }));

        const initialValues = {
            id: formRef.id ?? 0,
            nhanSuId: formRef.nhanSuId,
            surname: formRef.surname,
            name: formRef.name,
            emailAddress: formRef.emailAddress,
            phoneNumber: formRef.phoneNumber,
            userName: formRef.userName,
            password: formRef.password,
            confirmPassword: formRef.password,
            isActive: formRef.isActive,
            roleNames: formRef.roleNames,
            isAdmin: formRef.isAdmin
        };

        const rules = Yup.object().shape({
            surname: Yup.string().required('Tên là bắt buộc'),
            name: Yup.string().required('Họ là bắt buộc'),
            emailAddress: Yup.string()
                .matches(AppConsts.emailRegex, 'Email không hợp lệ')
                .required('Email là bắt buộc'),
            userName: Yup.string().required('Tên truy cập là bắt buộc'),
            phoneNumber: Yup.string().matches(AppConsts.phoneRegex, 'Số điện thoại không hợp lệ').notRequired(),
            password: Yup.string().matches(
                AppConsts.passwordRegex,
                'Mật khẩu phải chứa ít nhất một chữ cái, một số và ít nhất 6 ký tự'
            ),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), ''], 'Mật khẩu xác nhận phải trùng khớp')
        });
        return (
            <Dialog
                open={visible}
                onClose={() => {
                    onCancel();
                    this.setState({ avatar: '' });
                }}
                fullWidth
                maxWidth="sm">
                <DialogTitle>
                    <Typography
                        variant="h3"
                        fontSize="24px"
                        //color="rgb(51, 50, 51)"
                        fontWeight="700">
                        {modalType}
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={() => {
                            onCancel();
                            this.setState({ avatar: '' });
                        }}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            '&:hover': {
                                filter: ' brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                            }
                        }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ paddingBottom: '0' }}>
                    <Formik initialValues={initialValues} onSubmit={this.handleSubmit} validationSchema={rules}>
                        {({ handleChange, values, errors, touched, setFieldValue, isSubmitting }) => (
                            <Form onKeyPress={this.handleFormKeyPress}>
                                <TabContext value={this.state.tabIndex}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <TabList onChange={this.handleTabChange} aria-label="lab API tabs example">
                                            <Tab
                                                label="Người dùng"
                                                value="1"
                                                sx={{ textTransform: 'unset!important' }}
                                            />
                                            <Tab label="Vai trò" value="2" sx={{ textTransform: 'unset!important' }} />
                                        </TabList>
                                    </Box>
                                    <TabPanel value="1" sx={{ padding: '16px 0px 0px 0px' }}>
                                        <Grid container sx={{ '& label': { marginBottom: '4px' } }} spacing={2}>
                                            <Grid item sm={4} xs={12}>
                                                <Box textAlign={'center'}>
                                                    <img src={this.state.avatar} width={150} height={150} />
                                                </Box>
                                            </Grid>
                                            <Grid item sm={8} xs={12} display="flex" flexDirection="column" gap="16px">
                                                <FormGroup>
                                                    <Autocomplete
                                                        value={
                                                            suggestNhanSu.find((x) => x.id === values.nhanSuId) || {
                                                                id: '',
                                                                avatar: '',
                                                                chucVu: '',
                                                                soDienThoai: '',
                                                                tenNhanVien: ''
                                                            }
                                                        }
                                                        options={suggestNhanSu ?? []}
                                                        getOptionLabel={(option) => option.tenNhanVien}
                                                        size="small"
                                                        fullWidth
                                                        disablePortal
                                                        onChange={(event, value) => {
                                                            setFieldValue('nhanSuId', value ? value.id : undefined);
                                                            this.setState({
                                                                avatar: value?.avatar
                                                            });
                                                            const nhanVien = suggestNhanSu.find(
                                                                (x) => x.id === value?.id
                                                            ) || {
                                                                avatar: '',
                                                                chucVu: '',
                                                                id: '',
                                                                soDienThoai: '',
                                                                tenNhanVien: ''
                                                            };
                                                            setFieldValue('phoneNumber', nhanVien.soDienThoai || '');

                                                            const names = nhanVien.tenNhanVien
                                                                .split(' ')
                                                                .filter(Boolean);
                                                            if (names.length > 0) {
                                                                setFieldValue('name', names[names.length - 1]);
                                                                setFieldValue(
                                                                    'surname',
                                                                    names.slice(0, -1).join(' ') ||
                                                                        names[names.length - 1]
                                                                );
                                                            } else {
                                                                setFieldValue('name', '');
                                                                setFieldValue('surname', '');
                                                            }
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label={
                                                                    <Typography variant="body1" fontSize="14px">
                                                                        Chọn nhân sự đã có
                                                                    </Typography>
                                                                }
                                                                placeholder="Chọn nhân viên"
                                                            />
                                                        )}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <TextField
                                                        label={
                                                            <label style={{ fontSize: '14px' }}>
                                                                Tên truy cập
                                                                <span
                                                                    style={{
                                                                        color: 'red',
                                                                        marginLeft: '2px'
                                                                    }}>
                                                                    *
                                                                </span>
                                                            </label>
                                                        }
                                                        error={touched.userName && errors.userName ? true : false}
                                                        helperText={
                                                            touched.userName &&
                                                            errors.userName && <div>{errors.userName}</div>
                                                        }
                                                        disabled={userId === 0 ? false : true}
                                                        type="text"
                                                        name="userName"
                                                        value={values.userName}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        size="small"
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <TextField
                                                        label={
                                                            <label style={{ fontSize: '14px' }}>
                                                                Email
                                                                <span
                                                                    style={{
                                                                        color: 'red',
                                                                        marginLeft: '2px'
                                                                    }}>
                                                                    *
                                                                </span>
                                                            </label>
                                                        }
                                                        error={
                                                            touched.emailAddress && errors.emailAddress ? true : false
                                                        }
                                                        helperText={
                                                            touched.emailAddress &&
                                                            errors.emailAddress && <div>{errors.emailAddress}</div>
                                                        }
                                                        type="email"
                                                        name="emailAddress"
                                                        value={values.emailAddress}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        size="small"
                                                    />
                                                </FormGroup>
                                            </Grid>
                                            <Grid item xs={12} display="flex" flexDirection="column" gap="16px">
                                                <FormGroup>
                                                    <TextField
                                                        label={
                                                            <label style={{ fontSize: '14px' }}>
                                                                Mật khẩu
                                                                {/* <span className="text-danger">
                                                                    *
                                                                </span> */}
                                                            </label>
                                                        }
                                                        error={touched.password && errors.password ? true : false}
                                                        helperText={
                                                            touched.password &&
                                                            errors.password && <span>{errors.password}</span>
                                                        }
                                                        type="password"
                                                        name="password"
                                                        value={values.password}
                                                        onChange={handleChange}
                                                        onClick={() => {
                                                            setFieldValue('password', '');
                                                        }}
                                                        fullWidth
                                                        size="small"
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <TextField
                                                        label={
                                                            <label style={{ fontSize: '14px' }}>
                                                                Nhập lại mật khẩu
                                                                {/* <span className="text-danger">
                                                                    *
                                                                </span> */}
                                                            </label>
                                                        }
                                                        error={
                                                            touched.confirmPassword && errors.confirmPassword
                                                                ? true
                                                                : false
                                                        }
                                                        helperText={
                                                            touched.confirmPassword &&
                                                            errors.confirmPassword && (
                                                                <span>{errors.confirmPassword}</span>
                                                            )
                                                        }
                                                        type="password"
                                                        fullWidth
                                                        name="confirmPassword"
                                                        value={values.confirmPassword}
                                                        onChange={handleChange}
                                                        onClick={() => {
                                                            setFieldValue('confirmPassword', '');
                                                        }}
                                                        size="small"
                                                    />
                                                </FormGroup>
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sx={{
                                                        '.MuiGrid-item': {
                                                            paddingTop: '0px !important'
                                                        }
                                                    }}>
                                                    <FormGroup>
                                                        <FormControlLabel
                                                            name="isAdmin"
                                                            value={values.isAdmin === true ? true : false}
                                                            onChange={handleChange}
                                                            checked={values.isAdmin === true ? true : false}
                                                            control={<Checkbox />}
                                                            label="Là quản trị viên"
                                                        />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid xs={12} item padding={'0px !important'}>
                                                    <FormGroup>
                                                        <FormControlLabel
                                                            name="isActive"
                                                            value={values.isActive}
                                                            onChange={handleChange}
                                                            checked={values.isActive}
                                                            control={<Checkbox />}
                                                            label="Kích hoạt"
                                                        />
                                                    </FormGroup>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                    <TabPanel value="2" sx={{ padding: '0' }}>
                                        <Box display="flex" gap="16px">
                                            <FormGroup>
                                                {options.map((option: any) => (
                                                    <FormControlLabel
                                                        key={option.value}
                                                        value={option.value}
                                                        control={
                                                            <Checkbox
                                                                checked={values.roleNames.includes(option.value)}
                                                                onChange={handleChange}
                                                                name="roleNames"
                                                                value={option.value}
                                                                // sx={{
                                                                //     color: 'var(--color-main)!important'
                                                                // }}
                                                            />
                                                        }
                                                        label={option.label}
                                                    />
                                                ))}
                                            </FormGroup>
                                        </Box>
                                    </TabPanel>
                                </TabContext>
                                <DialogActions
                                    sx={{
                                        padding: '0px 0px 16px 0px !important',
                                        position: 'sticky',
                                        bottom: '0',
                                        left: '0',
                                        zIndex: '5',
                                        bgcolor: '#fff'
                                    }}>
                                    <Box
                                        display="flex"
                                        marginLeft="auto"
                                        gap="8px"
                                        sx={{
                                            '& button': {
                                                textTransform: 'unset!important'
                                            }
                                        }}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                color: 'var(--color-main)',
                                                fontSize: '14px'
                                            }}
                                            onClick={() => {
                                                onCancel();
                                                this.setState({ avatar: '' });
                                            }}
                                            className="btn-outline-hover">
                                            Hủy
                                        </Button>
                                        {!isSubmitting ? (
                                            <Button
                                                variant="contained"
                                                sx={{ fontSize: '14px' }}
                                                size="small"
                                                type="submit"
                                                className="btn-container-hover">
                                                Lưu
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                sx={{ fontSize: '14px' }}
                                                size="small"
                                                className="btn-container-hover">
                                                Đang lưu
                                            </Button>
                                        )}
                                    </Box>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        );
    }
}

export default CreateOrEditUser;
