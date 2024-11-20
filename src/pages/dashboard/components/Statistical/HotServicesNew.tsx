import React from 'react';
import './hotServicesNew.css';
import { Box, Grid, LinearProgress, Typography } from '@mui/material';
import dashboardStore from '../../../../stores/dashboardStore';
const HotServicesNew: React.FC = () => {
    return (
        <Box borderRadius={'8px'}>
            <Grid container spacing={5}>
                {dashboardStore.danhSachDichVuHot?.map((item, key) => (
                    <Grid item xs={12} key={key}>
                        <Box display={'flex'} justifyContent={'space-between'} width="100%">
                            <Typography
                                sx={{
                                    color: '#3D475C',
                                    fontFamily: 'Roboto',
                                    fontSize: '14px',
                                    fontWeight: '400'
                                }}>
                                {item.tenDichVu}
                            </Typography>
                            <Typography
                                sx={{
                                    color: item.color ?? '#F90',
                                    fontFamily: 'Roboto',
                                    fontSize: '14px',
                                    fontWeight: '400'
                                }}>
                                {item.tongDoanhThu}
                            </Typography>
                        </Box>
                        <LinearProgress
                            sx={{
                                height: '10px',
                                color: item.color ?? 'maroon',
                                borderRadius: '25px'
                            }}
                            value={item.phanTram}
                            variant="determinate"
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
export default HotServicesNew;
