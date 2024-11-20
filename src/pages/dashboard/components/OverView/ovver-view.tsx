import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CakeRoundedIcon from '@mui/icons-material/CakeRounded';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { Grid, Stack, Typography } from '@mui/material';
import './overViewNew.css';
import dashboardStore from '../../../../stores/dashboardStore';
import { observer } from 'mobx-react';
const OverView = () => {
    const data = dashboardStore.thongKeSoLuong ?? {
        tongDoanhThu: 0,
        tongThucThu: 0,
        tongKhachHangSinhNhat: 0,
        tongLichHen: 0
    };

    const arr = [
        {
            text: 'Khách sinh nhật',
            color: '#9c27b0',
            icon: <CakeRoundedIcon color="secondary" sx={{ width: 40, height: 40 }} />,
            value: data.tongKhachHangSinhNhat,
            backgroundColor: '#f1e7f3'
        },
        {
            text: 'Tổng cuộc hẹn',
            color: '#0288d1',
            icon: <CalendarMonthOutlinedIcon color="info" sx={{ width: 40, height: 40 }} />,
            value: data.tongLichHen,
            backgroundColor: '#d6e9f3'
        },
        {
            text: 'Tổng doanh thu',
            color: '#296fb5',
            icon: <ReceiptIcon color="primary" sx={{ width: 40, height: 40 }} />,
            value: data.tongDoanhThu,
            backgroundColor: '#e8eff5'
        },
        {
            text: 'Tổng thực thu',
            icon: <AttachMoneyIcon color="success" sx={{ width: 40, height: 40 }} />,
            value: data.tongThucThu,
            color: '#2e7d32',
            backgroundColor: '#c4ebc6'
        }
    ];
    return (
        <Grid container spacing={2}>
            {arr?.map((x: any, index: number) => (
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3} key={index}>
                    <Stack padding={2} borderRadius={'4px'} sx={{ backgroundColor: x.backgroundColor }}>
                        <Stack direction={'row'} spacing={2}>
                            {x.icon}
                            <Stack spacing={1}>
                                <Typography variant="body1" fontWeight={500} color={x.color}>
                                    {x.text}
                                </Typography>
                                <Typography fontSize={18} fontWeight={500} color={x.color}>
                                    {new Intl.NumberFormat('vi-VN').format(x.value)}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </Grid>
            ))}
        </Grid>
    );
};
export default observer(OverView);
