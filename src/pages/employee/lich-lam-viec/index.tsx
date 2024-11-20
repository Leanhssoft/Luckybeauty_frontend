import { Box, Typography, Grid, Button } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import LichLamViec from './lich-lam-viec';
import CreateOrEditLichLamViecModal from './create-or-edit-lich-lam-viec-modal';
import AppConsts from '../../../lib/appconst';
import lichLamViecStore from '../../../stores/lichLamViecStore';
import { AppContext } from '../../../services/chi_nhanh/ChiNhanhContext';
import suggestStore from '../../../stores/suggestStore';
import Cookies from 'js-cookie';
const LichLamViecScreen: React.FC = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const appContext = useContext(AppContext);
    const chinhanhContext = appContext.chinhanhCurrent;
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const handleSubmit = () => {
        handleCloseDialog();
        getData();
    };
    useEffect(() => {
        lichLamViecStore.createModel();
    }, []);
    useEffect(() => {
        getSuggestNhanVien();
    }, [chinhanhContext.id]);
    const getSuggestNhanVien = async () => {
        await suggestStore.getSuggestNhanVien();
    };
    const onShowModal = async (id: string) => {
        if (id === '') {
            await lichLamViecStore.createModel();
        } else {
            await lichLamViecStore.getForEdit(id);
        }
        handleOpenDialog();
    };
    const getData = async () => {
        await lichLamViecStore.getLichLamViecNhanVienWeek({
            dateFrom: new Date(),
            dateTo: new Date(),
            idChiNhanh: Cookies.get('IdChiNhanh') ?? '',
            keyword: '',
            skipCount: 0,
            maxResultCount: 10,
            idNhanVien: ''
        });
    };
    return (
        <Box>
            <Box sx={{ paddingTop: '16px' }}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs="auto">
                        <Typography variant="h1" color="#0C050A" fontSize="18px" fontWeight="700">
                            Lịch làm việc
                        </Typography>
                    </Grid>
                    <Grid item xs="auto">
                        <Box sx={{ display: 'flex', gap: '8px' }}>
                            <Button
                                sx={{
                                    minWidth: 'unset',
                                    bgcolor: 'unset!important',
                                    '&:hover svg': {
                                        color: '#7C3367'
                                    }
                                }}>
                                <MoreHorizIcon
                                    sx={{
                                        color: '#231F20'
                                    }}
                                />
                            </Button>
                            <Button
                                variant="contained"
                                className="btn-container-hover"
                                onClick={() => {
                                    onShowModal('');
                                }}>
                                Thêm lịch làm việc
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ borderTop: '1px solid #E6E1E6', mt: '18px', pt: '16px' }}>
                    <LichLamViec />
                </Box>
                <CreateOrEditLichLamViecModal
                    idNhanVien={AppConsts.guidEmpty}
                    open={openDialog}
                    onClose={handleSubmit}
                />
            </Box>
        </Box>
    );
};

export default LichLamViecScreen;
