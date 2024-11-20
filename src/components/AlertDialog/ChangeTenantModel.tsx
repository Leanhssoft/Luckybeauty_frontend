import {
    Box,
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Modal,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomSwitch from '../Form/CustomSwitch';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import loginService from '../../services/login/loginService';
import { enqueueSnackbar } from 'notistack';

const ChangeTenantModal = ({ isShow, handleClose }: any) => {
    const [isSwitch, setIsSwitch] = useState(false);
    const [tenantName, setTenantName] = useState('');
    useEffect(() => {
        const tenant = Cookies.get('TenantName') ?? '';
        if (tenant === null || tenant === 'null' || tenant === undefined || tenant === '') {
            setIsSwitch(false);
            setTenantName('');
        } else {
            setIsSwitch(true);
            setTenantName(tenant);
        }
    }, []);
    return (
        <Dialog
            open={isShow}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            sx={{
                '.MuiDialog-container': {
                    height: 'auto'
                }
            }}>
            <DialogTitle sx={{ borderBottom: '1px solid #EBEDF3', padding: '8px 16px' }}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography fontWeight={700}>Thay đổi Tenant</Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon onClick={handleClose} />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ paddingTop: '16px !important' }}>
                <Grid container spacing={4} paddingY={'8px'} alignItems={'center'}>
                    <Grid item xs={4} justifyContent={'end'}>
                        <Typography fontSize={'14px'} fontWeight={500} color={'#8D8F9A'}>
                            Chuyển Tenant
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <CustomSwitch
                            checked={isSwitch}
                            onChange={(event, checked) => {
                                setIsSwitch(checked);
                                if (checked === true) {
                                    const tenant = Cookies.get('TenantName') ?? '';
                                    setTenantName(tenant);
                                } else {
                                    setTenantName('');
                                }
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={4} paddingY={'8px'} alignItems={'center'}>
                    <Grid item xs={4} fontSize={'14px'} color={'#8D8F9A'} justifyContent={'end'}>
                        <Typography fontSize={'14px'} fontWeight={500} color={'#8D8F9A'}>
                            Tên Tenant
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            size="small"
                            disabled={!isSwitch}
                            value={tenantName}
                            onChange={(e) => {
                                setTenantName(e.target.value);
                            }}
                            fullWidth></TextField>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid #EBEDF3' }}>
                <Button
                    variant="contained"
                    onClick={handleClose}
                    sx={{
                        ':hover': {
                            color: '#E8F1FA',
                            background: '#1976D2'
                        },
                        color: '#399BFF',
                        background: '#E1F0FF',
                        boxShadow: 'none'
                    }}>
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                        const result = await loginService.CheckTenant(tenantName);
                        if (result.state === 1) {
                            await handleClose();
                            window.location.reload();
                        } else if (result.state === 2) {
                            enqueueSnackbar('Tenant đã hết hạn sử dụng hoặc bị khóa', {
                                variant: 'error',
                                autoHideDuration: 5000
                            });
                        } else {
                            enqueueSnackbar('Tenant không tồn tại', {
                                variant: 'error',
                                autoHideDuration: 5000
                            });
                        }
                    }}>
                    {isSwitch === true ? 'Chuyển đến Tenant' : 'Chuyển đến Host'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default ChangeTenantModal;
