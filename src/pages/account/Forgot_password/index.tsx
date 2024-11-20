import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box, IconButton } from '@mui/material';
import './forgotPassword.css';
import logo from '../../../images/Logo_Lucky_Beauty.svg';
import { Link } from 'react-router-dom';
import ChangeTenantModal from '../../../components/AlertDialog/ChangeTenantModel';
import { Cookie } from '@mui/icons-material';
import Cookies from 'js-cookie';
import accountService from '../../../services/account/accountService';
import { enqueueSnackbar } from 'notistack';
interface ForgotPasswordFormData {
    email: string;
}

function ForgotPasswordPage() {
    const [formData, setFormData] = useState<ForgotPasswordFormData>({
        email: ''
    });
    const [tenancyName, setTenancyName] = useState('');
    const [error, setError] = useState('');
    const [isShowChangeTenant, setIsShowChangeTenant] = useState(false);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Kiểm tra các trường có được nhập hay không
        if (formData.email.trim() === '') {
            setError('Vui lòng nhập địa chỉ email.');
            return;
        }
        const tenantId = Cookies.get('Abp.TenantId') ?? 'null';
        const result = await accountService.SendPasswordResetCode(
            formData.email.trim(),
            tenantId === 'null' ? undefined : Number.parseInt(tenantId)
        );
        if (result === true) {
            enqueueSnackbar(
                'Mã xác nhận đã được gửi qua địa chỉ email vui lòng kiểm tra và thao tác đổi lại mật khẩu',
                {
                    variant: 'success',
                    autoHideDuration: undefined
                }
            );
        } else {
            enqueueSnackbar('Địa chỉ email không tồn tại tong Tenant hiện tại, Vui lòng kiểm tra lại', {
                variant: 'error',
                autoHideDuration: 5000
            });
        }
    };
    useEffect(() => {
        Cookies.get('TenantName') == ''
            ? setTenancyName('Chưa lựa chọn')
            : setTenancyName(Cookies.get('TenantName') ?? '');
    }, []);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <div className="forgot-password-page">
            <Box sx={{ maxWidth: 400, margin: '0 auto' }} className="forgot-password-page-box">
                <div className="logo-forgot">
                    <div className="logo-image">
                        <img src={logo} alt="Lucky Beauty" />
                    </div>
                    <div className="logo-text">Lucky Beauty</div>
                </div>
                <Box textAlign={'center'} padding={'8px 8px 0px 8px'}>
                    <Typography fontSize={'13px'}>
                        Tenant hiện tại: {tenancyName} (
                        <Button
                            sx={{
                                width: 'auto !important',
                                height: 'auto !important',
                                background: '#fff !important',
                                padding: '0px !important',
                                fontSize: '13px !important',
                                minWidth: 'auto !important',
                                color: 'green !important',
                                ':hover': {
                                    color: '#1976B2 !important'
                                }
                            }}
                            onClick={() => {
                                setIsShowChangeTenant(true);
                            }}>
                            Thay đổi
                        </Button>
                        )
                    </Typography>
                </Box>

                <Typography variant="h1">Quên mật khẩu</Typography>
                <Typography>
                    Nhập địa chỉ email bạn đã sử dụng khi tạo tài khoản và chúng tôi sẽ gửi cho bạn mã để đặt lại mật
                    khẩu
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        type="email"
                        name="email"
                        label="Địa chỉ email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    border: 'none'
                                }
                            }
                        }}
                    />
                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                        Gửi yêu cầu
                    </Button>
                    {error && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}
                </form>
                <Link to="/login" className="back_login ">
                    Trở lại đăng nhập
                </Link>
            </Box>
            <ChangeTenantModal
                isShow={isShowChangeTenant}
                handleClose={() => {
                    setIsShowChangeTenant(false);
                }}
            />
        </div>
    );
}

export default ForgotPasswordPage;
