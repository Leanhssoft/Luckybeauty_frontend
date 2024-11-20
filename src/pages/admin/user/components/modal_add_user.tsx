/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Tab,
    Grid,
    Stack,
    TextField,
    FormControlLabel,
    Checkbox,
    FormGroup,
    Button,
    InputAdornment,
    IconButton
} from '@mui/material';
import DialogButtonClose from '../../../../components/Dialog/ButtonClose';
import { useContext, useEffect, useState } from 'react';
import TabPanel from '@mui/lab/TabPanel';
import AutocompleteNhanVien from '../../../../components/Autocomplete/NhanVien';
import AutocompleteChiNhanh from '../../../../components/Autocomplete/ChiNhanh';
import userService from '../../../../services/user/userService';
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';
import { Box } from '@mui/system';
import CircleImageUpload from '../../../../components/ImportComponent/CircleImageUpload';
import utils from '../../../../utils/utils';
import uploadFileService from '../../../../services/uploadFileService';
import * as Yup from 'yup';
import AppConsts from '../../../../lib/appconst';
import { Formik, Form } from 'formik';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AppContext } from '../../../../services/chi_nhanh/ChiNhanhContext';
import { enqueueSnackbar } from 'notistack';
import { IChiNhanhRoles, IUserRoleDto } from '../../../../models/Roles/userRoleDto';
import { ChiNhanhDto } from '../../../../services/chi_nhanh/Dto/chiNhanhDto';
import TableRoleChiNhanh from '../../../../components/Table/RoleChiNhanh';
import roleService from '../../../../services/role/roleService';
import authenticationStore from '../../../../stores/authenticationStore';
import Cookies from 'js-cookie';

export default function ModalAddUser({
    isShowModal,
    dataNhanVien,
    userId,
    avatarNV = '',
    dataChiNhanh,
    allRoles,
    onCancel,
    onOk,
    objUserUpdate
}: any) {
    const appContext = useContext(AppContext);
    const chinhanhCurrent = appContext.chinhanhCurrent;
    const idChiNhanh = chinhanhCurrent?.id;
    const [tabIndex, setTabIndex] = useState('1');
    const [avatar, setAvatar] = useState(''); // from nay khong cap nhat avatar (vi avatar lay tu DS nhanvien)
    const [googleDrive_fileId, setGoogleDrive_fileId] = useState('');
    const [fileImage, setFileImage] = useState<File>({} as File); // file image
    const [showPassword, setShowPassword] = useState<boolean>(false); // file image
    const [showPasswordNew, setShowPasswordNew] = useState<boolean>(false); // file image
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [changePassword, setChangePassword] = useState<boolean>(false); // file image
    const [isActive, setIsActive] = useState<boolean>(true); // file image
    const [chiNhanhRoles, setChiNhanhRoles] = useState<IChiNhanhRoles[]>([]);
    const [lstChosed, setLstChosed] = useState<IUserRoleDto[]>([]);

    const initialValues = {
        id: 0,
        nhanSuId: '',
        emailAddress: '',
        userName: '',
        password: '',
        passwordNew: '',
        confirmPassword: '',
        changePassword: false,
        isActive: false,
        isAdmin: false,
        idChiNhanhMacDinh: '',
        phoneNumber: '',
        name: '',
        surname: ''
    };

    const confirmPasswordValidation = (
        userId: number,
        changePassword: boolean,
        password: string,
        passwordNew: string
    ) => {
        if (userId === 0) {
            return Yup.string()
                .required('Vui lòng xác nhận mật khẩu')
                .oneOf([password], 'Mật khẩu xác nhận phải trùng khớp');
        } else {
            if (changePassword) {
                return Yup.string()
                    .required('Vui lòng xác nhận mật khẩu')
                    .oneOf([passwordNew], 'Mật khẩu xác nhận phải trùng khớp');
            }
            return Yup.string();
        }
    };

    const passwordValidation = (userId: number, changePassword: boolean) => {
        if (userId === 0) {
            return Yup.string()
                .required('Vui lòng nhập mật khẩu')
                .matches(AppConsts.passwordRegex, 'Mật khẩu phải chứa ít nhất một chữ cái, một số và ít nhất 6 ký tự');
        } else {
            if (changePassword) {
                return Yup.string().required('Vui lòng nhập khẩu hiện tại');
            }
            return Yup.string();
        }
    };

    const rules = Yup.object().shape({
        // nhanSuId: Yup.string().required('Vui lòng chọn nhân viên'),
        emailAddress: Yup.string().matches(AppConsts.emailRegex, 'Email không hợp lệ').required('Vui lòng nhập email'),
        userName: Yup.string().required('Vui lòng nhập tên truy cập'),
        idChiNhanhMacDinh: Yup.string().required('Vui lòng chọn chi nhánh'),
        password: Yup.lazy((value: any, schema: any) => {
            return passwordValidation(schema.parent.userId, schema.parent.changePassword);
        }),
        passwordNew: Yup.string().when(['changePassword'], {
            is: (changePassword: boolean) => {
                return changePassword;
            },
            then: (schema: any) => {
                return schema
                    .required('Vui lòng nhập khẩu hiện mới')
                    .matches(
                        AppConsts.passwordRegex,
                        'Mật khẩu phải chứa ít nhất một chữ cái, một số và ít nhất 6 ký tự'
                    );
            }
        }),

        confirmPassword: Yup.lazy((value: any, schema: any) => {
            return confirmPasswordValidation(
                schema.parent.id,
                schema.parent.changePassword,
                schema.parent.password,
                schema.parent.passwordNew
            );
        })
    });

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue.toString());
    };

    const GetInforUser = async () => {
        const userEdit = { ...objUserUpdate };
        initialValues.id = userEdit?.id;
        initialValues.nhanSuId = userEdit?.nhanSuId as string;
        initialValues.emailAddress = userEdit?.emailAddress;
        initialValues.userName = userEdit?.userName;
        initialValues.name = userEdit?.name;
        initialValues.surname = userEdit?.surname;
        initialValues.phoneNumber = userEdit?.phoneNumber;
        initialValues.password = '';
        initialValues.passwordNew = '';
        initialValues.confirmPassword = '';
        initialValues.changePassword = false;
        initialValues.isActive = userEdit.isActive;
        initialValues.isAdmin = userEdit.isAdmin as boolean;
        initialValues.idChiNhanhMacDinh = userEdit?.idChiNhanhMacDinh as string;
        setIsActive(userEdit?.isActive ?? false);
        setAvatar(avatarNV ?? '');
    };

    const GetRolebyChiNhanh_ofUser = async () => {
        const data = await roleService.GetRolebyChiNhanh_ofUser(userId);

        setLstChosed(
            data.map((item: any) => {
                return {
                    idChiNhanh: item.idChiNhanh,
                    roleId: item.roleId
                } as IUserRoleDto;
            })
        );
    };

    useEffect(() => {
        if (isShowModal) {
            if (userId === 0) {
                initialValues.id = 0;
                initialValues.idChiNhanhMacDinh = idChiNhanh;
                initialValues.emailAddress = '';
                initialValues.userName = '';
                initialValues.passwordNew = '';
                initialValues.confirmPassword = '';
                initialValues.changePassword = false;
                initialValues.isActive = true;
                initialValues.isAdmin = false;
                setAvatar('');
            } else {
                GetInforUser();
                GetRolebyChiNhanh_ofUser();
            }
            setChangePassword(false);
            setChiNhanhRoles(
                dataChiNhanh.map((item: ChiNhanhDto) => {
                    return {
                        idChiNhanh: item.id,
                        tenChiNhanh: item.tenChiNhanh,
                        roles: allRoles
                    } as unknown as IChiNhanhRoles;
                })
            );
        }
    }, [isShowModal]);

    const handleClickShowPassword = () => setShowPassword((show: boolean) => !show);
    const handleClickShowPasswordNew = () => setShowPasswordNew((show: boolean) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const choseImage = async (pathFile: string, file: File) => {
        if (!utils.checkNull(googleDrive_fileId)) {
            await uploadFileService.GoogleApi_RemoveFile_byId(googleDrive_fileId);
        }
        setAvatar(pathFile);
        setFileImage(file);
    };
    const closeImage = () => {
        setAvatar('');
        setGoogleDrive_fileId('');
    };
    const getRoleChiNhanh_fromChild = (lst: IUserRoleDto[]) => {
        setLstChosed(lst);
    };

    const checkSaveDB = async (user: any) => {
        const existUser = await userService.CheckExistUser(userId, user?.userName);
        if (existUser) {
            enqueueSnackbar('Người dùng đã tồn tại', {
                variant: 'error',
                autoHideDuration: 3000
            });
            return false;
        }
        const existEmail = await userService.CheckExistEmail(userId, user?.emailAddress);
        if (existEmail) {
            enqueueSnackbar('Email đã tồn tại', {
                variant: 'error',
                autoHideDuration: 3000
            });
            return false;
        }
        const response = await userService.CheckMatchesPassword(userId, user?.password);
        if (!response) {
            enqueueSnackbar('Mật khẩu hiện tại không đúng', {
                variant: 'error',
                autoHideDuration: 3000
            });
            return false;
        }
        return true;
    };
    const saveUser = async (values: any) => {
        let userIdNew = 0;
        const checkDB = await checkSaveDB(values);
        if (!checkDB) {
            return;
        }
        let passNew_samePassOld = false;
        if (values.changePassword) {
            // check math passOld & passsNew
            passNew_samePassOld = await userService.CheckMatchesPassword(userId, values?.passwordNew);
            values.password = values.passwordNew;
        }
        // user có thể không phải là nhân viên --> setdefault (name, surname ='' --> avoid error null in DB)
        values.nhanSuId = values?.nhanSuId == '' ? null : values.nhanSuId;
        values.name = utils.checkNull(values?.name) ? '' : values.name;
        values.surname = utils.checkNull(values?.surname) ? '' : values.surname;
        values.idChiNhanhMacDinh = values?.idChiNhanhMacDinh == '' ? null : values.idChiNhanhMacDinh;
        if (userId == 0) {
            const data = await userService.CreateUser(values);
            if (data !== null) {
                userIdNew = data.id;
                await roleService.CreateRole_byChiNhanhOfUser(userIdNew, lstChosed);
                enqueueSnackbar('Thêm mới người dùng thành công', {
                    variant: 'success',
                    autoHideDuration: 3000
                });
            } else {
                enqueueSnackbar('Số lượng người dùng đã đến giới hạn,Vui lòng nâng cấp gói cước để sử dụng tính năng', {
                    variant: 'error',
                    autoHideDuration: 3000
                });
            }
        } else {
            const data = await userService.UpdateUser(values);
            if (data !== null) {
                userIdNew = userId;
                await roleService.CreateRole_byChiNhanhOfUser(userIdNew, lstChosed);
                enqueueSnackbar('Cập nhật người dùng thành công', {
                    variant: 'success',
                    autoHideDuration: 3000
                });
            } else {
                enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại sau', {
                    variant: 'error',
                    autoHideDuration: 3000
                });
            }
        }
        const userLogin = Cookies.get('userId');
        if (userLogin === userId.toString()) {
            if (!passNew_samePassOld) return authenticationStore.logout(); // logout if change pass
        }
        onOk();
    };

    const iconPassword =
        userId === 0
            ? {
                  endAdornment: (
                      <InputAdornment position="end">
                          <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              // onMouseDown={
                              //     handleMouseDownPassword
                              // }
                              edge="end">
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                      </InputAdornment>
                  )
              }
            : {};
    const iconPasswordNew = (passNew: string) =>
        userId !== 0 && !utils.checkNull(passNew)
            ? {
                  endAdornment: (
                      <InputAdornment position="end">
                          <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPasswordNew}
                              // onMouseDown={
                              //     handleMouseDownPassword
                              // }
                              edge="end">
                              {showPasswordNew ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                      </InputAdornment>
                  )
              }
            : {};
    return (
        <>
            <Dialog open={isShowModal} maxWidth={'sm'} fullWidth onClose={onCancel}>
                <DialogTitle>
                    <Box className="modal-title">{userId === 0 ? 'Thêm mới' : 'Cập nhật'} người dùng</Box>

                    <DialogButtonClose onClose={onCancel} />
                </DialogTitle>
                <DialogContent sx={{ '& .MuiTabPanel-root': { padding: 0 } }}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={rules}
                        onSubmit={(values) => saveUser(values)}>
                        {({ handleChange, values, errors, touched, setFieldValue }) => (
                            <Form>
                                <TabContext value={tabIndex}>
                                    <TabList onChange={handleChangeTab}>
                                        <Tab label="Người dùng" value={'1'}></Tab>
                                        <Tab label="Vai trò" value={'2'}></Tab>
                                    </TabList>
                                    <TabPanel value="1" sx={{ marginTop: 2 }}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={4}>
                                                <CircleImageUpload
                                                    pathImg={avatar}
                                                    handeChoseImage={choseImage}
                                                    handleCloseImage={closeImage}
                                                    roleChangeImg={false} // form này không cho phép thay đổi ảnh (chỉ hiển thị theo ảnh nhân viên)
                                                />
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Stack spacing={2}>
                                                    <AutocompleteNhanVien
                                                        label="Chọn nhân sự đã có"
                                                        helperText={
                                                            touched.nhanSuId &&
                                                            errors.nhanSuId && <span>{errors.nhanSuId}</span>
                                                        }
                                                        dataNhanVien={dataNhanVien}
                                                        idChosed={values.nhanSuId}
                                                        handleChoseItem={(item: any) => {
                                                            const arrTenNV = item?.tenNhanVien.split(' ');
                                                            let surName = ''; // họ
                                                            if (arrTenNV?.length > 0) {
                                                                surName = arrTenNV[0];
                                                            }
                                                            setFieldValue('nhanSuId', item?.id);
                                                            setFieldValue('name', item?.tenNhanVien);
                                                            setFieldValue('surname', surName);
                                                            setFieldValue('phoneNumber', item?.soDienThoai);
                                                            setAvatar(item?.avatar);
                                                        }}
                                                    />
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        name="userName"
                                                        label={
                                                            <label style={{ fontSize: '16px' }}>
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
                                                        value={values?.userName || ''}
                                                        onChange={(e) => {
                                                            setFieldValue('userName', e.target.value);
                                                        }}
                                                        helperText={
                                                            touched.userName &&
                                                            errors.userName && <span>{errors.userName}</span>
                                                        }
                                                    />
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        name="emailAddress"
                                                        label={
                                                            <label style={{ fontSize: '16px' }}>
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
                                                        value={values?.emailAddress || ''}
                                                        onChange={(e) => {
                                                            setFieldValue('emailAddress', e.target.value);
                                                        }}
                                                        helperText={
                                                            touched.emailAddress &&
                                                            errors.emailAddress && <span>{errors.emailAddress}</span>
                                                        }
                                                    />
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2} paddingTop={2}>
                                            <Grid item xs={12}>
                                                <AutocompleteChiNhanh
                                                    label={
                                                        <label style={{ fontSize: '16px' }}>
                                                            Chi nhánh mặc định
                                                            <span
                                                                style={{
                                                                    color: 'red',
                                                                    marginLeft: '2px'
                                                                }}>
                                                                *
                                                            </span>
                                                        </label>
                                                    }
                                                    dataChiNhanh={dataChiNhanh}
                                                    idChosed={values?.idChiNhanhMacDinh || ''}
                                                    error={errors.idChiNhanhMacDinh && touched.idChiNhanhMacDinh}
                                                    helperText={
                                                        touched.idChiNhanhMacDinh &&
                                                        errors.idChiNhanhMacDinh && (
                                                            <span>{errors.idChiNhanhMacDinh}</span>
                                                        )
                                                    }
                                                    handleChoseItem={(item: any) => {
                                                        setFieldValue('idChiNhanhMacDinh', item?.id);
                                                    }}
                                                />
                                            </Grid>
                                            {userId !== 0 && isActive && (
                                                <Grid item xs={12}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                size="small"
                                                                checked={values?.changePassword}
                                                                onChange={() => {
                                                                    setChangePassword(() => !changePassword);
                                                                    setFieldValue('changePassword', !changePassword);
                                                                }}
                                                            />
                                                        }
                                                        label="Đổi mật khẩu"
                                                    />
                                                </Grid>
                                            )}

                                            {(changePassword || userId === 0) && (
                                                <Grid item xs={12}>
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        name="password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={values?.password || ''}
                                                        onChange={(e) => {
                                                            setFieldValue('password', e.target.value);
                                                        }}
                                                        label={
                                                            <label style={{ fontSize: '13px' }}>
                                                                Mật khẩu {userId === 0 ? '' : 'hiện tại'}
                                                                <span
                                                                    style={{
                                                                        color: 'red',
                                                                        marginLeft: '2px'
                                                                    }}>
                                                                    *
                                                                </span>
                                                            </label>
                                                        }
                                                        helperText={
                                                            touched.password &&
                                                            errors.password && <span>{errors.password}</span>
                                                        }
                                                        InputProps={iconPassword}
                                                    />
                                                </Grid>
                                            )}

                                            {changePassword && (
                                                <>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sx={{
                                                            display: userId !== 0 ? '' : 'none'
                                                        }}>
                                                        <TextField
                                                            size="small"
                                                            fullWidth
                                                            name="passwordNew"
                                                            type={showPasswordNew ? 'text' : 'password'}
                                                            value={values?.passwordNew || ''}
                                                            label={
                                                                <label style={{ fontSize: '13px' }}>
                                                                    Mật khẩu mới
                                                                    <span
                                                                        style={{
                                                                            color: 'red',
                                                                            marginLeft: '2px'
                                                                        }}>
                                                                        *
                                                                    </span>
                                                                </label>
                                                            }
                                                            onChange={handleChange}
                                                            helperText={
                                                                touched.passwordNew &&
                                                                errors.passwordNew && <span>{errors.passwordNew}</span>
                                                            }
                                                            InputProps={iconPasswordNew(values.passwordNew)}
                                                        />
                                                    </Grid>
                                                </>
                                            )}
                                            {(changePassword || userId === 0) && (
                                                <Grid item xs={12}>
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        name="confirmPassword"
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        onChange={handleChange}
                                                        value={values?.confirmPassword || ''}
                                                        label={
                                                            <label style={{ fontSize: '13px' }}>
                                                                Nhập lại mật khẩu
                                                                <span
                                                                    style={{
                                                                        color: 'red',
                                                                        marginLeft: '2px'
                                                                    }}>
                                                                    *
                                                                </span>
                                                            </label>
                                                        }
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        onClick={handleClickShowConfirmPassword}
                                                                        edge="end">
                                                                        {showConfirmPassword ? (
                                                                            <Visibility />
                                                                        ) : (
                                                                            <VisibilityOff />
                                                                        )}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                        helperText={
                                                            touched.confirmPassword &&
                                                            errors.confirmPassword && (
                                                                <span>{errors.confirmPassword}</span>
                                                            )
                                                        }
                                                    />
                                                </Grid>
                                            )}

                                            <Grid
                                                item
                                                xs={12}
                                                sx={{
                                                    paddingTop:
                                                        userId !== 0 && !changePassword
                                                            ? '0px!important'
                                                            : '8px!important'
                                                }}>
                                                <FormGroup>
                                                    {/* {isActive && (
                                                        <FormControlLabel
                                                            control={<Checkbox size="small" />}
                                                            label="Là quản trị viên"
                                                            name="isAdmin"
                                                            value={values?.isAdmin}
                                                            onChange={handleChange}
                                                            checked={values?.isAdmin}
                                                        />
                                                    )} */}

                                                    {userId !== 0 && (
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    name="isActive"
                                                                    value={values?.isActive}
                                                                    onChange={handleChange}
                                                                    checked={values?.isActive}
                                                                    size="small"
                                                                />
                                                            }
                                                            label="Kích hoạt"
                                                        />
                                                    )}
                                                </FormGroup>
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                    <TabPanel value="2" sx={{ marginTop: 2 }}>
                                        <TableRoleChiNhanh
                                            userId={userId}
                                            allRoles={allRoles}
                                            chiNhanhRoles={chiNhanhRoles}
                                            passDataToParent={getRoleChiNhanh_fromChild}
                                        />
                                    </TabPanel>
                                </TabContext>
                                <Grid container justifyContent={'end'}>
                                    <Stack spacing={1} justifyContent={'flex-end'} direction={'row'}>
                                        <Button variant="outlined" onClick={onCancel}>
                                            Hủy
                                        </Button>
                                        <Button variant="contained" type="submit">
                                            Lưu
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </>
    );
}
