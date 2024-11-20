/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Grid,
    TextField,
    FormControlLabel,
    Checkbox,
    InputAdornment,
    IconButton,
    Typography,
    CircularProgress
} from '@mui/material';
import './login.css';
import LoginModel from '../../../models/Login/loginModel';
import LoginService from '../../../services/login/loginService';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import logo from '../../../images/Logo_Lucky_Beauty.svg';
import { Link } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import nhatKyHoatDongService from '../../../services/nhat_ky_hoat_dong/nhatKyHoatDongService';
import { enqueueSnackbar } from 'notistack';
const LoginScreen: React.FC = () => {
    const navigate = useNavigate();
    const loginModel = new LoginModel();
    useEffect(() => {
        localStorage.clear();
        sessionStorage.clear();
        // get an array of all cookie names
        Object.keys(Cookies.get()).forEach((cookieName) => {
            if (cookieName !== 'TenantName') {
                Cookies.remove(cookieName);
            }
        });
    }, []);
    const [showPassword, setShowPassword] = useState(false);
    const formik = useFormik({
        initialValues: {
            tenant: Cookies.get('TenantName') ?? '',
            userNameOrEmail: '',
            password: '',
            remember: true
        },
        validationSchema: Yup.object({
            tenant: Yup.string(),
            userNameOrEmail: Yup.string().required('Tài khoản không được để trống.'),
            password: Yup.string().required('Mật khẩu không được để trống.')
        }),
        onSubmit: async (values) => {
            loginModel.tenancyName = values.tenant;
            loginModel.userNameOrEmailAddress = values.userNameOrEmail;
            loginModel.password = values.password;
            loginModel.rememberMe = values.remember;
            const loginResult = await LoginService.Login(loginModel);
            if (loginResult.success === true) {
                await nhatKyHoatDongService.createNhatKyThaoTac({
                    chucNang: 'Đăng nhập',
                    loaiNhatKy: 6,
                    noiDung: 'Đăng nhập hệ thống',
                    noiDungChiTiet: 'Đăng nhập hệ thống'
                });
                window.location.href = '/';
            } else {
                await nhatKyHoatDongService.createNhatKyThaoTac({
                    chucNang: 'Đăng nhập',
                    loaiNhatKy: 6,
                    noiDung: 'Đăng nhập hệ thống thất bại',
                    noiDungChiTiet: 'Đăng nhập hệ thống thất bại'
                });
                enqueueSnackbar(loginResult.message, {
                    variant: 'error',
                    autoHideDuration: 3000
                });
            }
        }
    });

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            formik.handleSubmit();
        }
    };

    return (
        <div className="login-page">
            <Grid container className="align-items-center justify-content-center mt-2 h-100">
                <Grid xs={12} item>
                    <div className="login-page-inner">
                        <div className="logo-login" style={{ padding: '12px 0px' }}>
                            <div className="logo-image">
                                <img src={logo} alt="Lucky Beauty" />
                            </div>
                            <div className="logo-text">Lucky Beauty</div>
                        </div>
                        <Typography
                            sx={{
                                textAlign: 'center',
                                fontSize: '24px',
                                color: '#00284C',
                                fontWeight: 700,
                                fontFamily: 'Roboto'
                            }}>
                            Đăng nhập
                        </Typography>
                        <form className="login-form" onSubmit={formik.handleSubmit}>
                            <Grid container>
                                <span className="login-label">ID đăng nhập</span>
                                <Grid xs={12} item>
                                    <TextField
                                        {...formik.getFieldProps('tenant')}
                                        error={formik.touched.tenant && formik.errors.tenant ? true : false}
                                        helperText={formik.touched.tenant && formik.errors.tenant}
                                        onKeyDown={handleKeyDown}
                                        variant="outlined"
                                        name="tenant"
                                        value={formik.values.tenant}
                                        placeholder="ID đăng nhập"
                                        type="text"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: 'none!important'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>
                                <span className="login-label">Tên đăng nhập</span>
                                <Grid xs={12} item>
                                    <TextField
                                        {...formik.getFieldProps('userNameOrEmail')}
                                        error={
                                            formik.touched.userNameOrEmail && formik.errors.userNameOrEmail
                                                ? true
                                                : false
                                        }
                                        helperText={formik.touched.userNameOrEmail && formik.errors.userNameOrEmail}
                                        onKeyDown={handleKeyDown}
                                        variant="outlined"
                                        name="userNameOrEmail"
                                        placeholder="Nhập email hoặc tên tài khoản"
                                        type="text"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: 'none!important'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>
                                <span className="login-label">Mật khẩu</span>
                                <Grid xs={12} item>
                                    <TextField
                                        {...formik.getFieldProps('password')}
                                        onKeyDown={handleKeyDown}
                                        variant="outlined"
                                        name="password"
                                        placeholder="Nhập mật khẩu"
                                        error={formik.touched.password && formik.errors.password ? true : false}
                                        helperText={formik.touched.password && formik.errors.password}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                display: 'block',
                                                paddingRight: '0',
                                                '& fieldset': {
                                                    border: 'none!important'
                                                }
                                            },
                                            '& .MuiInputBase-root ': {
                                                background: '#f2f6fa'
                                            },
                                            '& button': {
                                                position: 'absolute',
                                                right: '0',
                                                top: '0'
                                            }
                                        }}
                                        type={showPassword ? 'text' : 'password'}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={handleShowPassword}>
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid xs={12} item className="form-item_checkBox">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                {...formik.getFieldProps('remember')}
                                                checked={formik.values.remember}
                                                sx={{
                                                    color: 'var(--color-main)',
                                                    '&.Mui-checked': {
                                                        color: 'var(--color-main)'
                                                    }
                                                }}
                                            />
                                        }
                                        label="Ghi nhớ"
                                    />
                                    <Link className="login-form-forgot" to="/forgot-password">
                                        Quên mật khẩu ?
                                    </Link>
                                </Grid>

                                <Grid xs={12} item>
                                    <button type="submit" className="btn-login">
                                        {formik.isSubmitting ? (
                                            <CircularProgress
                                                className="text-login"
                                                sx={{ color: 'white' }}
                                                size={'32px'}
                                            />
                                        ) : (
                                            <span className="text-login">Đăng nhập</span>
                                        )}
                                    </button>
                                </Grid>
                                <Grid xs={12} item>
                                    <p className="text-support">
                                        Tổng đài hỗ trợ : <span>0247 303 9333 - 0936 363 069</span>
                                    </p>
                                </Grid>
                                <Grid xs={12} item>
                                    <p className="text-register">
                                        Bạn chưa có tài khoản?{' '}
                                        {/* <Link className="a quenMk" to="/register">
                                            Đăng ký
                                        </Link> */}
                                        <a className="a quenMk" href={'https://luckybeauty.vn/dangkydungthu'}>
                                            Đăng ký
                                        </a>
                                    </p>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default LoginScreen;
