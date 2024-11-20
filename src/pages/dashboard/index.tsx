import React, { useContext, useEffect, useState } from 'react';
import './dashboardNew.css';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AppoimentsNew from './components/Appointment/AppointmentsNew';
import LineChartNew from './components/Charts/LineChartNew';
import ColumnChartNew from './components/Charts/ColumnChartNew';
import HotServicesNew from './components/Statistical/HotServicesNew';
import Box from '@mui/material/Box';
import OverView from './components/OverView/ovver-view';
import { Grid, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';
import dashboardStore from '../../stores/dashboardStore';
import Cookies from 'js-cookie';
import { observer } from 'mobx-react';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import ButtonOnlyIcon from '../../components/Button/ButtonOnlyIcon';
import MenuWithDataHasSearch from '../../components/Menu/MenuWithData_HasSearch';
import { IList } from '../../services/dto/IList';
import suggestStore from '../../stores/suggestStore';
import { addMonths, endOfMonth, format, startOfMonth } from 'date-fns';
import DateFilterCustom from '../../components/DatetimePicker/DateFilterCustom';
import { RequestFromToDto } from '../../services/dto/ParamSearchDto';
import { DateType } from '../../lib/appconst';
const Dashboard: React.FC = () => {
    const toDay = new Date();
    const [dashboardDateView, setDashboardDateView] = useState('day');
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;

    const [lblChiNhanh, setLblChiNhanh] = useState('HOST');
    const [dateTypeFilter, setDateTypeFilter] = useState('Hôm nay');
    const [dateTypeFilterLichHen, setDateTypeFilterLichHen] = useState('Hôm nay');
    const [dateTypeFilterTopService, setDateTypeFilterTopService] = useState('Tháng này');

    const [anchorChiNhanh, setAnchorChiNhanh] = React.useState<null | HTMLElement>(null);
    const expandDropdownChiNhanh = Boolean(anchorChiNhanh);

    const [anchorDateEl, setAnchorDateEl] = useState<HTMLSpanElement | null>(null);
    const openDateFilter = Boolean(anchorDateEl);

    const [paramSearch, setParamSearch] = useState<RequestFromToDto>({
        dateType: DateType.HOM_NAY,
        fromDate: format(toDay, 'yyyy-MM-dd'),
        toDate: format(toDay, 'yyyy-MM-dd'),
        idChiNhanhs: [Cookies.get('IdChiNhanh') ?? '']
    });
    const [paramSearchLichHen, setParamSearchLichHen] = useState<RequestFromToDto>({
        dateType: DateType.HOM_NAY,
        fromDate: format(toDay, 'yyyy-MM-dd'),
        toDate: format(toDay, 'yyyy-MM-dd'),
        idChiNhanhs: [Cookies.get('IdChiNhanh') ?? '']
    });
    const [paramSearchTopService, setParamSearchTopService] = useState<RequestFromToDto>({
        dateType: DateType.THANG_NAY,
        fromDate: format(startOfMonth(toDay), 'yyyy-MM-dd'),
        toDate: format(endOfMonth(toDay), 'yyyy-MM-dd'),
        idChiNhanhs: [Cookies.get('IdChiNhanh') ?? '']
    });

    useEffect(() => {
        getData(); // This will be called when chinhanh.id changes
    }, [chinhanh.id]);

    const getData = async () => {
        const storedDateType = Cookies.get('dashBoardDateType') ?? 'day';
        dashboardStore.dashboardDateType = storedDateType;
        setDashboardDateView(storedDateType);
        await dashboardStore.onChangeDateType(storedDateType);
    };
    const sumTongTien = dashboardStore.thongKeDoanhThu?.reduce((sum, item) => sum + item.thangNay, 0);
    const handleChangeDateType = async (event: SelectChangeEvent<string>) => {
        const newValue = event.target.value as string;
        setDashboardDateView(newValue);
        await dashboardStore.onChangeDateType(event.target.value as string);
        if (newValue === 'week') {
            Cookies.set('dashBoardDateType', 'week');
        } else if (newValue === 'day') {
            Cookies.set('dashBoardDateType', 'day');
        } else if (newValue === 'month') {
            Cookies.set('dashBoardDateType', 'month');
        } else if (newValue === 'year') {
            Cookies.set('dashBoardDateType', 'year');
        }
    };

    const toggleChiNhanh = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorChiNhanh(event.currentTarget);
    };

    const onApplyFilterDate = async (from: string, to: string, dateType: string, dateTypeText: string) => {
        setAnchorDateEl(null);
        setDateTypeFilter(dateTypeText);
        setParamSearch({ ...paramSearch, fromDate: from, toDate: to, currentPage: 1 });

        const param = {
            ...paramSearch,
            fromDate: from,
            toDate: to
        };
        await dashboardStore.getThongKeSoLuong(param);
    };
    const onApplyFilterDateLichHen = async (from: string, to: string, dateType: string, dateTypeText: string) => {
        setAnchorDateEl(null);
        setDateTypeFilterLichHen(dateTypeText);
        setParamSearchLichHen({ ...paramSearch, fromDate: from, toDate: to, currentPage: 1, pageSize: 3 });

        const param = {
            ...paramSearch,
            fromDate: from,
            toDate: to,
            currentPage: 1,
            pageSize: 3
        };
        await dashboardStore.getDanhSachLichHen(param);
    };
    const onApplyFilterDateTopService = async (from: string, to: string, dateType: string, dateTypeText: string) => {
        setAnchorDateEl(null);
        setDateTypeFilterTopService(dateTypeText);
        setParamSearchTopService({ ...paramSearch, fromDate: from, toDate: to, currentPage: 1, pageSize: 3 });

        const param = {
            ...paramSearch,
            fromDate: from,
            toDate: to,
            currentPage: 1,
            pageSize: 3
        };
        await dashboardStore.getThongKeHotService(param);
    };
    return (
        <div style={{ height: 'auto' }}>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ paddingTop: '16px', paddingBottom: '16px' }}>
                <div className="page-header_col-1">
                    <div className="breadcrumb">Trang chủ</div>
                </div>
                <Stack
                    direction={'row'}
                    spacing={1}
                    sx={{ padding: '8px 12px', background: 'wheat', borderRadius: '4px' }}>
                    {suggestStore?.suggestChiNhanh_byUserLogin?.length > 1 && (
                        <Stack
                            direction={'row'}
                            alignItems={'center'}
                            spacing={1.5}
                            // display={{ xs: 'none', lg: 'flex', md: 'flex' }}
                        >
                            <Stack>
                                <Stack direction={'row'} spacing={0.5} onClick={toggleChiNhanh}>
                                    <Typography variant="body1">HOST</Typography>
                                    <ExpandMoreIcon />
                                </Stack>

                                <MenuWithDataHasSearch
                                    open={expandDropdownChiNhanh}
                                    hasCheckBox={true}
                                    lstData={suggestStore?.suggestChiNhanh_byUserLogin?.map((x) => {
                                        return {
                                            id: x.id,
                                            text: x.tenChiNhanh
                                        } as IList;
                                    })}
                                    anchorEl={anchorChiNhanh}
                                    handleClose={() => setAnchorChiNhanh(null)}
                                />
                            </Stack>
                        </Stack>
                    )}

                    <Stack>
                        <Stack
                            direction={'row'}
                            spacing={0.5}
                            onClick={(event) => setAnchorDateEl(event.currentTarget)}>
                            <Typography variant="body1">{dateTypeFilter}</Typography>
                            <ExpandMoreIcon />
                        </Stack>

                        <DateFilterCustom
                            id="popover-date-filter"
                            dateTypeDefault={paramSearch.dateType}
                            open={openDateFilter}
                            anchorEl={anchorDateEl}
                            onClose={() => setAnchorDateEl(null)}
                            onApplyDate={onApplyFilterDate}
                        />
                    </Stack>
                </Stack>
            </Box>
            <div style={{ gap: '16px' }}>
                <OverView />
                <Box paddingTop={'16px'}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ height: '100%' }}>
                            <Stack
                                bgcolor={'#FFF'}
                                padding={'16px 24px'}
                                borderBottom={'1px solid #EEF0F4'}
                                borderRadius={'4px'}
                                direction={'row'}
                                justifyContent={'space-between'}>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        fontWeight: '600'
                                    }}>
                                    Danh sách cuộc hẹn
                                </Typography>
                                <Stack>
                                    <Stack
                                        direction={'row'}
                                        spacing={0.5}
                                        onClick={(event) => setAnchorDateEl(event.currentTarget)}>
                                        <Typography variant="body1">{dateTypeFilterLichHen}</Typography>
                                        <ExpandMoreIcon />
                                    </Stack>

                                    <DateFilterCustom
                                        id="popover-date-filter"
                                        dateTypeDefault={paramSearchLichHen.dateType}
                                        open={openDateFilter}
                                        anchorEl={anchorDateEl}
                                        onClose={() => setAnchorDateEl(null)}
                                        onApplyDate={onApplyFilterDateLichHen}
                                    />
                                </Stack>
                            </Stack>
                            <Box bgcolor={'#FFF'} padding={'8px 24px 16px 24px'} sx={{ height: '300px' }}>
                                <AppoimentsNew />
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Stack width={'100%'} bgcolor={'#FFF'} padding={'16px 24px'} borderRadius={'4px'}>
                                <Stack direction={'row'} justifyContent={'space-between'}>
                                    <Typography
                                        sx={{
                                            fontSize: '18px',
                                            fontWeight: '600'
                                        }}>
                                        Top 5 dịch vụ hot
                                    </Typography>
                                    <Stack>
                                        <Stack
                                            direction={'row'}
                                            spacing={0.5}
                                            onClick={(event) => setAnchorDateEl(event.currentTarget)}>
                                            <Typography variant="body1">{dateTypeFilterTopService}</Typography>
                                            <ExpandMoreIcon />
                                        </Stack>

                                        <DateFilterCustom
                                            id="popover-date-filter"
                                            dateTypeDefault={paramSearchTopService.dateType}
                                            open={openDateFilter}
                                            anchorEl={anchorDateEl}
                                            onClose={() => setAnchorDateEl(null)}
                                            onApplyDate={onApplyFilterDateTopService}
                                        />
                                    </Stack>
                                </Stack>

                                <HotServicesNew />
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
                <Box marginTop={'16px'}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={9} lg={12} xl={12} borderRadius={'8px'}>
                            <Box bgcolor={'#FFF'} padding={'8px 24px'} borderRadius={'8px'}>
                                <Typography
                                    sx={{
                                        //color: '#29303D',
                                        fontFamily: 'Roboto',
                                        fontSize: '18px',
                                        fontWeight: '700'
                                    }}>
                                    Doanh thu
                                </Typography>
                                <Typography
                                    sx={{
                                        //color: '#29303D',
                                        fontFamily: 'Roboto',
                                        fontSize: '12px',
                                        fontWeight: '400'
                                    }}>
                                    Doanh thu cửa hàng
                                </Typography>
                            </Box>
                            <Grid
                                container
                                display={'flex'}
                                justifyContent={'space-between'}
                                bgcolor={'#FFF'}
                                padding={'8px 24px'}>
                                <Grid item xs={12} sm={6}>
                                    <Box width={'100%'} borderRadius={'8px'}>
                                        <Typography
                                            sx={{
                                                color: '#3D475C',
                                                fontFamily: 'Roboto',
                                                fontSize: '24px',
                                                fontWeight: '700'
                                            }}>
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(sumTongTien)}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <Box display={'flex'} justifyContent={'end'} width={'100%'}>
                                        <Box
                                            display={'flex'}
                                            justifyContent={'space-between'}
                                            alignItems={'center'}
                                            marginRight={'24px'}>
                                            <Box
                                                sx={{
                                                    borderRadius: '50%',
                                                    width: '12px',
                                                    height: '12px',
                                                    bgcolor: 'var(--color-main)'
                                                }}></Box>
                                            <Typography
                                                sx={{
                                                    marginLeft: '8px',
                                                    //color: '#29303D',
                                                    fontFamily: 'Roboto',
                                                    fontSize: '12px',
                                                    fontWeight: '400'
                                                }}>
                                                Năm này
                                            </Typography>
                                        </Box>

                                        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                            <Box
                                                sx={{
                                                    borderRadius: '50%',
                                                    width: '12px',
                                                    height: '12px',
                                                    bgcolor: '#ff9900'
                                                }}></Box>
                                            <Typography
                                                sx={{
                                                    marginLeft: '8px',
                                                    //color: '#29303D',
                                                    fontFamily: 'Roboto',
                                                    fontSize: '12px',
                                                    fontWeight: '400'
                                                }}>
                                                Năm trước
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Box bgcolor={'#FFF'} padding={'8px 24px'} borderRadius={'8px'}>
                                <ColumnChartNew />
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Box
                                style={{
                                    background: '#FFF',
                                    padding: '16px 24px',
                                    borderRadius: '8px'
                                }}>
                                <Typography
                                    sx={{
                                        //color: '#29303D',
                                        fontFamily: 'Roboto',
                                        fontSize: '18px',
                                        fontWeight: '700'
                                    }}>
                                    Tổng số cuộc hẹn hàng tuần
                                </Typography>
                                <LineChartNew />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </div>
    );
};

export default observer(Dashboard);
