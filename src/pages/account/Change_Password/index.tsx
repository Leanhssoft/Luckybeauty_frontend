import { Button, FormGroup, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Formik, Form } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import AppConsts from '../../../lib/appconst';
import './changePassword.css';
import accountService from '../../../services/account/accountService';
import { enqueueSnackbar } from 'notistack';
import logo from '../../../images/Logo_Lucky_Beauty.svg';
import { Visibility, VisibilityOff } from '@mui/icons-material';
const ResetPassword = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(0);
    const [tenantId, setTenantId] = useState(0);
    const [resetCode, setResetCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    useEffect(() => {
        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);
        setUserId(Number.parseInt(params.get('userId') ?? '0'));
        setTenantId(Number.parseInt(params.get('tenantId') ?? '0'));
        setResetCode(params.get('resetCode') ?? '');
    }, []);
    const rules = Yup.object().shape({
        password: Yup.string()
            .matches(AppConsts.passwordRegex, 'Mật khẩu phải chứa ít nhất một chữ cái, một số và ít nhất 6 ký tự')
            .required('Mật khẩu không được để trống'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), ''], 'Mật khẩu xác nhận phải trùng khớp')
            .required('Xác nhận mật khẩu là bắt buộc')
    });
    return (
        <Box className="change-password-page">
            <Grid container>
                <Grid item xs={12}>
                    <Box className={'change-password-page-inner'}>
                        <Box textAlign={'center'}>
                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} padding={'12px 0px'}>
                                <img src={logo} alt="Lucky Beauty" />
                                <Typography
                                    marginLeft={'5px'}
                                    fontSize={'18px'}
                                    fontWeight={700}
                                    fontFamily={'Vinhan !important'}
                                    color={'var(--color-main)'}>
                                    Lucky Beauty
                                </Typography>
                            </Box>

                            <Typography fontSize={'24px'} fontWeight={700}>
                                Đặt lại mật khẩu
                            </Typography>
                        </Box>
                        <Formik
                            validationSchema={rules}
                            initialValues={{
                                password: '',
                                confirmPassword: ''
                            }}
                            onSubmit={async (values) => {
                                const result = await accountService.ResetPassword({
                                    password: values.password,
                                    resetCode: resetCode,
                                    tenantId: tenantId,
                                    userId: userId
                                });
                                if (result.canLogin == true) {
                                    await enqueueSnackbar(result.message, {
                                        variant: 'success',
                                        autoHideDuration: 3000
                                    });
                                    navigate('/login');
                                } else {
                                    await enqueueSnackbar(result.message, {
                                        variant: 'error',
                                        autoHideDuration: 3000
                                    });
                                }
                            }}>
                            {({ values, handleChange, errors, touched }) => (
                                <Form>
                                    <Box gap={6}>
                                        <FormGroup sx={{ padding: '8px' }}>
                                            <Typography
                                                fontSize={'14px'}
                                                fontWeight={600}
                                                fontFamily={'Roboto'}
                                                marginBottom={'5px'}
                                                color={'var(--color-title)'}>
                                                Mã xác nhận
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                name="resetCode"
                                                value={resetCode}
                                                onChange={handleChange}
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
                                                placeholder="Nhập mã xác nhận"></TextField>
                                        </FormGroup>
                                        <FormGroup sx={{ padding: '8px' }}>
                                            <Typography
                                                fontSize={'14px'}
                                                fontWeight={600}
                                                fontFamily={'Roboto'}
                                                marginBottom={'5px'}
                                                color={'var(--color-title)'}>
                                                Mật khẩu
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                name="password"
                                                value={values.password}
                                                onChange={handleChange}
                                                error={errors.password && touched.password ? true : false}
                                                helperText={
                                                    errors.password && touched.password ? (
                                                        <span className="text-danger">{String(errors.password)}</span>
                                                    ) : (
                                                        ''
                                                    )
                                                }
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
                                                            <IconButton
                                                                onClick={() => {
                                                                    setShowPassword(!showPassword);
                                                                }}>
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                                placeholder="Nhập mật khẩu mới"></TextField>
                                        </FormGroup>
                                        <FormGroup sx={{ padding: '8px' }}>
                                            <Typography
                                                fontSize={'14px'}
                                                fontWeight={600}
                                                fontFamily={'Roboto'}
                                                marginBottom={'5px'}
                                                color={'var(--color-title)'}>
                                                Xác nhận mật khẩu
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                name="confirmPassword"
                                                value={values.confirmPassword}
                                                onChange={handleChange}
                                                error={errors.confirmPassword && touched.confirmPassword ? true : false}
                                                helperText={
                                                    errors.confirmPassword && touched.confirmPassword ? (
                                                        <span className="text-danger">
                                                            {String(errors.confirmPassword)}
                                                        </span>
                                                    ) : (
                                                        ''
                                                    )
                                                }
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
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => {
                                                                    setShowConfirmPassword(!showConfirmPassword);
                                                                }}>
                                                                {showConfirmPassword ? (
                                                                    <VisibilityOff />
                                                                ) : (
                                                                    <Visibility />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                                placeholder="Nhập xác nhận mật khẩu"></TextField>
                                        </FormGroup>
                                        <FormGroup sx={{ padding: '8px' }}>
                                            <Button
                                                sx={{ height: '48px' }}
                                                variant="contained"
                                                type="submit"
                                                color="primary"
                                                fullWidth>
                                                Đổi mật khẩu
                                            </Button>
                                        </FormGroup>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};
export default ResetPassword;
