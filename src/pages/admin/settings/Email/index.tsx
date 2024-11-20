import { Button, Checkbox, FormControlLabel, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import { useEffect, useState } from 'react';
import { EmailSettingsEditDto } from '../../../../services/settings/dto/EmailSettingsEditDto';
import SettingService from '../../../../services/settings/settingService';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import settingService from '../../../../services/settings/settingService';
import { enqueueSnackbar } from 'notistack';
const EmailSetting = () => {
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
    const [settingEmail, setSettingEmail] = useState<EmailSettingsEditDto>({
        defaultFromAddress: '',
        defaultFromDisplayName: '',
        smtpDomain: '',
        smtpEnableSsl: false,
        smtpHost: '',
        smtpPassword: '',
        smtpPort: 0,
        smtpUseDefaultCredentials: false,
        smtpUserName: ''
    });
    useEffect(() => {
        getData();
    }, []);
    const getData = async () => {
        const data = await SettingService.getEmailSettings();
        setSettingEmail(data);
    };

    return (
        <Box paddingTop={2}>
            <Formik
                enableReinitialize={true}
                initialValues={settingEmail}
                onSubmit={async (values) => {
                    const result = await settingService.updateEmailSettings(values);
                    enqueueSnackbar(result.message, {
                        variant: result.status,
                        autoHideDuration: 3000
                    });
                }}>
                {({ values, errors, touched, handleChange }) => (
                    <Form
                        onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                            if (event.key === 'Enter') {
                                event.preventDefault(); // Prevent form submission
                            }
                        }}
                        autoComplete="off">
                        <Box
                            sx={{ borderBottom: '1px soild black' }}
                            paddingBottom={'16px 0px'}
                            display={'flex'}
                            justifyContent={'space-between'}
                            alignItems={'center'}>
                            <Typography variant="h1" fontSize="16px" fontWeight="700" color="#333233">
                                Email (SMTP)
                            </Typography>
                            <Button variant="contained" type="submit">
                                Lưu
                            </Button>
                        </Box>
                        <Box marginTop={'24px'} gap={4}>
                            <Typography marginTop={2}>Địa chỉ email người gửi mặc định</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                name={'defaultFromAddress'}
                                value={values.defaultFromAddress}
                                onChange={handleChange}></TextField>
                            <Typography marginTop={2}>Tên hiển thị người gửi mặc định</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                name={'defaultFromDisplayName'}
                                value={values.defaultFromDisplayName}
                                onChange={handleChange}></TextField>
                            <Typography marginTop={2}>Địa chỉ IP máy chủ SMTP</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                name={'smtpHost'}
                                value={values.smtpHost}
                                onChange={handleChange}
                            />
                            <Typography marginTop={2}>Cổng SMTP</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                name={'smtpPort'}
                                value={values.smtpPort}
                                onChange={handleChange}></TextField>
                            <FormControlLabel
                                checked={values.smtpEnableSsl}
                                name="smtpEnableSsl"
                                onChange={handleChange}
                                control={<Checkbox />}
                                label="Sử dụng SSL"
                            />
                            <div>
                                <FormControlLabel
                                    name="smtpUseDefaultCredentials"
                                    checked={values.smtpUseDefaultCredentials}
                                    onChange={handleChange}
                                    control={<Checkbox />}
                                    label="Sử dụng thông tin xác thực mặc định"
                                />
                            </div>
                            {values.smtpUseDefaultCredentials === false ? (
                                <div>
                                    <Typography marginTop={2}>Tên truy cập</Typography>
                                    <TextField
                                        fullWidth
                                        autoComplete="off"
                                        size="small"
                                        name={'smtpUserName'}
                                        value={values.smtpUserName}
                                        onChange={handleChange}></TextField>
                                    <Typography marginTop={2}>Mật khẩu</Typography>
                                    <TextField
                                        fullWidth
                                        type={isShowPassword === true ? 'text' : 'password'}
                                        size="small"
                                        autoComplete="off"
                                        name={'smtpPassword'}
                                        value={values.smtpPassword}
                                        onChange={handleChange}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => {
                                                            setIsShowPassword(!isShowPassword);
                                                        }}>
                                                        {isShowPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}></TextField>
                                </div>
                            ) : null}
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};
export default EmailSetting;
