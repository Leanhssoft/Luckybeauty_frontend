import React, { useContext, useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Avatar,
    Typography,
    Button,
    Select,
    SelectChangeEvent,
    MenuItem,
    ButtonGroup,
    Grid,
    TextField,
    Autocomplete
} from '@mui/material';
import { ReactComponent as EditIcon } from '../../../images/edit-2.svg';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ReactComponent as CalendarIcon } from '../../../images/calendar.svg';
import { ReactComponent as ListIcon } from '../../../images/list.svg';
import { ReactComponent as ArrowDown } from '../../../images/arow-down.svg';
import CustomEmployee from './DialogCustom';
import Delete from './deleteAlert';
import Cookies from 'js-cookie';
import lichLamViecStore from '../../../stores/lichLamViecStore';
import { observer } from 'mobx-react';
import { SuggestNhanSuDto } from '../../../services/suggests/dto/SuggestNhanSuDto';
import SuggestService from '../../../services/suggests/SuggestService';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import CreateOrEditLichLamViecModal from './create-or-edit-lich-lam-viec-modal';
import AppConsts from '../../../lib/appconst';
import { AppContext } from '../../../services/chi_nhanh/ChiNhanhContext';
import suggestStore from '../../../stores/suggestStore';
import lichLamViecService from '../../../services/nhan-vien/lich_lam_viec/lichLamViecService';
import { enqueueSnackbar } from 'notistack';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
const LichLamViec: React.FC = () => {
    const appContext = useContext(AppContext);
    const chinhanhContext = appContext.chinhanhCurrent;
    const [weekDates, setWeekDates] = useState<any[]>([]);
    const [filter, setFilter] = useState('');
    const [skipCount, setSkipCount] = useState(1);
    const [dateFrom, setDateFrom] = useState(new Date());
    const [maxResultCount, setMaxResultCount] = useState(10);
    const [dateSelected, setDateSelected] = useState<Date>(new Date());
    const [dateView, setDateView] = useState('');
    const [suggestNhanVien, setSuggestNhanVien] = useState<SuggestNhanSuDto[]>([]);
    const [idNhanVien, setIdNhanVien] = useState('');
    useEffect(() => {
        getCurrentDateInVietnamese(new Date());
        getWeekDate(new Date());
        getData();
        getSuggestNhanVien();
    }, [chinhanhContext.id]);
    const getSuggestNhanVien = async () => {
        const result = await SuggestService.SuggestNhanSu();
        //await suggestStore.getSuggestNhanVien();
        setSuggestNhanVien(result);
    };
    const getWeekDate = (dateCurrent: Date) => {
        const firstDayOfWeek = new Date(dateCurrent.setDate(dateCurrent.getDate() - dateCurrent.getDay() + 1));

        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(firstDayOfWeek);
            date.setDate(date.getDate() + i);
            const formattedDate = formatDate(date);
            dates.push(formattedDate);
        }

        setWeekDates(dates);
    };
    const getData = async () => {
        await lichLamViecStore.getLichLamViecNhanVienWeek({
            dateFrom: dateFrom,
            dateTo: dateFrom,
            idChiNhanh: Cookies.get('IdChiNhanh') ?? '',
            keyword: filter,
            skipCount: skipCount,
            maxResultCount: maxResultCount,
            idNhanVien: employ == '' ? undefined : employ
        });
    };
    const formatDate = (date: Date): JSX.Element => {
        const day = date.toLocaleDateString('vi', { weekday: 'long' });
        const month = date.toLocaleDateString('vi', { month: 'long' });
        const dayOfMonth = date.getDate();
        return (
            <>
                <Box sx={{ fontWeight: '400', fontSize: '16px', textAlign: 'center' }}>{day}</Box>
                <div style={{ textAlign: 'center', fontSize: '13px' }}>
                    {dayOfMonth} {month}
                </div>
            </>
        );
    };
    const [employ, setEmploy] = useState('');
    const changeEmploy = (event: SelectChangeEvent) => {
        setEmploy(event.target.value);
        lichLamViecStore.updateIdNhanVien(event.target.value);
        getData();
    };
    const [value, setValue] = useState('');
    const changeValue = (event: SelectChangeEvent) => {
        setValue(event.target.value);
    };

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedId, setSelectedId] = useState('');
    const open = Boolean(anchorEl);
    const handleOpenCustom = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setSelectedId(event.currentTarget.className);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedId('');
    };

    const [openDialog, setOpenDialog] = useState(false);
    const handleOpenDialog = () => {
        setAnchorEl(null);
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const handleSubmit = () => {
        handleCloseDialog();
        getData();
    };
    const [openDelete, setOpenDelete] = useState(false);
    const handleOpenDelete = () => {
        setAnchorEl(null);
        setOpenDelete(true);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
        setSelectedId('');
    };
    const handleDelete = async () => {
        if (selectedId !== '') {
            const result = await lichLamViecService.delete(selectedId);
            enqueueSnackbar(result.message, {
                variant: result.status,
                autoHideDuration: 3000
            });
            await getData();
        }
        handleCloseDelete();
    };
    const [openEdit, setOpenEdit] = useState(false);
    const handleOpenEdit = async () => {
        if (selectedId !== '' || selectedId !== AppConsts.guidEmpty) {
            await lichLamViecStore.getForEdit(selectedId);
        } else {
            await lichLamViecStore.createModel();
        }
        setOpenDialog(true);
        setAnchorEl(null);
    };
    const handleCloseEditEmployee = () => {
        setOpenEdit(false);
    };

    const getCurrentDateInVietnamese = (date: Date) => {
        const daysOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
        const monthsOfYear = [
            'tháng 1',
            'tháng 2',
            'tháng 3',
            'tháng 4',
            'tháng 5',
            'tháng 6',
            'tháng 7',
            'tháng 8',
            'tháng 9',
            'tháng 10',
            'tháng 11',
            'tháng 12'
        ];

        const dayOfWeek = daysOfWeek[date.getDay()];
        const dayOfMonth = date.getDate();
        const month = monthsOfYear[date.getMonth()];
        const year = date.getFullYear();

        const formattedDate = `${dayOfWeek},  ${dayOfMonth} ${month}, năm ${year}`;
        setDateView(formattedDate);
    };
    const prevWeek = async () => {
        const newDate = new Date(dateSelected);
        newDate.setDate(newDate.getDate() - 7);
        await lichLamViecStore.updateDate(newDate);
        setDateSelected(newDate);
        getCurrentDateInVietnamese(newDate);
        getWeekDate(newDate);
    };
    const nextWeek = async () => {
        const newDate = new Date(dateSelected);
        newDate.setDate(newDate.getDate() + 7);
        await lichLamViecStore.updateDate(newDate);
        setDateSelected(newDate);
        getCurrentDateInVietnamese(newDate);
        getWeekDate(newDate);
    };
    const toDayClick = async () => {
        const newDate = new Date();
        await lichLamViecStore.updateDate(newDate);
        setDateSelected(new Date(newDate));
        getCurrentDateInVietnamese(newDate);
        getWeekDate(newDate);
    };
    const handlePageChange = async (event: any, value: number) => {
        await lichLamViecStore.updatePageChange(value);
        setSkipCount(value);
        getData();
    };
    const handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await lichLamViecStore.updatePageChange(1);
        await lichLamViecStore.updatePerPageChange(parseInt(event.target.value.toString(), 10));
        setMaxResultCount(parseInt(event.target.value.toString(), 10));
        getData();
    };
    return (
        <Box>
            <CustomEmployee
                open={open}
                handleClose={handleCloseMenu}
                anchorEl={anchorEl}
                selectedRowId={selectedId}
                handleOpenDelete={handleOpenDelete}
                handleOpenDialog={handleOpenDialog}
                handleCloseDialog={handleCloseDialog}
                handleOpenEdit={handleOpenEdit}
            />

            {/* <Delete open={openDelete} onDelete={handleDelete} onClose={handleCloseDelete} /> */}
            <ConfirmDelete isShow={openDelete} onOk={handleDelete} onCancel={handleCloseDelete}></ConfirmDelete>
            {/* <ThemLich open={openDialog} onClose={handleCloseDialog} /> */}
            <CreateOrEditLichLamViecModal idNhanVien={idNhanVien} open={openDialog} onClose={handleSubmit} />
            <Grid container mb="16px" spacing={1}>
                <Grid item xs={12} sm={12} md={3}>
                    <Box display={'flex'} justifyContent={'space-between'} gap={0.5}>
                        <Autocomplete
                            fullWidth
                            onChange={(event, value) => {
                                setEmploy(value?.id ?? '');
                                lichLamViecStore.updateIdNhanVien(value?.id ?? AppConsts.guidEmpty);
                                getData();
                            }}
                            value={suggestNhanVien[0] ?? null}
                            options={[
                                { id: '', tenNhanVien: 'Tất cả nhân viên' }, // Option for all employees
                                ...suggestNhanVien
                            ]}
                            getOptionLabel={(item) => item.tenNhanVien}
                            size="small"
                            sx={{
                                '& .MuiAutocomplete-root': {
                                    backgroundColor: '#fff',
                                    '& .MuiSvgIcon-root': {
                                        position: 'relative',
                                        left: '-10px'
                                    },
                                    '&[aria-expanded="true"] .MuiSvgIcon-root': {
                                        transform: 'rotate(180deg)'
                                    }
                                },
                                maxWidth: '90%'
                            }}
                            renderInput={(params: any) => (
                                <TextField fullWidth {...params} label="Nhân viên" variant="outlined" />
                            )}
                        />
                        {window.screen.width < 900 ? (
                            <Box
                                display="flex"
                                sx={{ width: '100%' }}
                                alignItems="center"
                                justifyContent={'end'}
                                gap="8px">
                                <ButtonGroup
                                    variant="outlined"
                                    sx={{
                                        '& button': {
                                            minWidth: 'unset!important',
                                            paddingX: '6px!important',
                                            height: '32px',
                                            borderColor: '#E6E1E6!important'
                                        }
                                    }}>
                                    <Button className="btn-outline-hover" sx={{ mr: '1px' }}>
                                        <CalendarIcon />
                                    </Button>
                                    <Button className="btn-outline-hover">
                                        <ListIcon />
                                    </Button>
                                </ButtonGroup>
                                <Select
                                    onChange={changeValue}
                                    value={value}
                                    IconComponent={() => <ArrowDown />}
                                    displayEmpty
                                    size="small"
                                    sx={{
                                        '& .MuiSelect-select': {
                                            lineHeight: '32px',
                                            p: '0',
                                            height: '32px',
                                            pl: '10px'
                                        },
                                        bgcolor: '#fff',
                                        '& svg': {
                                            position: 'relative',
                                            left: '-10px',
                                            width: '20px',
                                            height: '20px'
                                        },
                                        '[aria-expanded="true"] ~ svg': {
                                            transform: 'rotate(180deg)'
                                        }
                                    }}>
                                    <MenuItem value="">Tuần</MenuItem>
                                    {/* <MenuItem value="Tháng">Tháng</MenuItem>
                            <MenuItem value="Năm">Năm</MenuItem> */}
                                </Select>
                            </Box>
                        ) : null}
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    display="flex"
                    alignItems={'center'}
                    gap={'8px'}
                    justifyContent={'center'}
                    sx={{
                        '& button:not(.btn-to-day)': {
                            minWidth: 'unset',
                            borderColor: '#E6E1E6',
                            bgcolor: '#fff!important',
                            px: '7px!important'
                        },
                        '& svg': {
                            color: '#666466!important'
                        },
                        alignItems: 'center'
                    }}>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            prevWeek();
                            getData();
                        }}
                        className="btn-outline-hover">
                        <ChevronLeftIcon />
                    </Button>
                    <Button
                        className="btn-to-day"
                        variant="text"
                        onClick={() => {
                            toDayClick();
                            getData();
                        }}
                        sx={{
                            color: 'var(--color-main)!important',
                            fontSize: '16px!important',
                            textTransform: 'unset!important',
                            bgcolor: 'transparent!important',
                            fontWeight: '400',
                            paddingX: '0',
                            pb: '10px'
                        }}>
                        Hôm nay
                    </Button>
                    <Typography variant="h3" color="#333233" fontSize="16px" fontWeight="700">
                        {dateView}
                    </Typography>
                    <Button
                        variant="outlined"
                        className="btn-outline-hover"
                        onClick={() => {
                            nextWeek();
                            getData();
                        }}>
                        <ChevronRightIcon />
                    </Button>
                </Grid>
                {window.screen.width >= 900 ? (
                    <Grid item xs={12} sm={12} md={3}>
                        <Box display="flex" alignItems="center" justifyContent={'end'} gap="8px">
                            <ButtonGroup
                                variant="outlined"
                                sx={{
                                    '& button': {
                                        minWidth: 'unset!important',
                                        paddingX: '6px!important',
                                        height: '32px',
                                        borderColor: '#E6E1E6!important'
                                    }
                                }}>
                                <Button className="btn-outline-hover" sx={{ mr: '1px' }}>
                                    <CalendarIcon />
                                </Button>
                                <Button className="btn-outline-hover">
                                    <ListIcon />
                                </Button>
                            </ButtonGroup>
                            <Select
                                onChange={changeValue}
                                value={value}
                                IconComponent={() => <ArrowDown />}
                                displayEmpty
                                size="small"
                                sx={{
                                    '& .MuiSelect-select': {
                                        lineHeight: '32px',
                                        p: '0',
                                        height: '32px',
                                        pl: '10px'
                                    },
                                    bgcolor: '#fff',
                                    '& svg': {
                                        position: 'relative',
                                        left: '-10px',
                                        width: '20px',
                                        height: '20px'
                                    },
                                    '[aria-expanded="true"] ~ svg': {
                                        transform: 'rotate(180deg)'
                                    }
                                }}>
                                <MenuItem value="">Tuần</MenuItem>
                                {/* <MenuItem value="Tháng">Tháng</MenuItem>
                            <MenuItem value="Năm">Năm</MenuItem> */}
                            </Select>
                        </Box>
                    </Grid>
                ) : null}
            </Grid>
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow
                            sx={{
                                '& .MuiTableCell-root': {
                                    paddingTop: '8px',
                                    paddingLeft: '4px',
                                    paddingRight: '4px'
                                }
                            }}>
                            <TableCell sx={{ border: 'none' }}>Nhân viên</TableCell>
                            {weekDates.map((date, index) => (
                                <TableCell key={index}>
                                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                        <Typography fontSize={'13px'}>{date}</Typography>
                                    </Box>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody
                        sx={{
                            '& .custom-time': {
                                fontFamily: 'Roboto',
                                fontWeight: '400',
                                height: '32px',
                                //bgcolor: 'var(--color-bg)',
                                borderRadius: '8px',
                                padding: '8px',
                                fontSize: '13px',
                                textAlign: 'center',
                                color: 'black'
                            },
                            '& .bodder-inline': {
                                borderInline: '1px solid #E6E1E6',
                                padding: '4px 4px 20px 4px'
                            }
                        }}>
                        {lichLamViecStore.listLichLamViec?.items?.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{ border: '0!important', width: '20%' }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}>
                                        <Avatar
                                            sx={{ width: 32, height: 32 }}
                                            src={item.avatar}
                                            alt={item.tenNhanVien}
                                        />
                                        <Box>
                                            <Typography
                                                fontSize="13px"
                                                fontWeight="400"
                                                fontFamily={'Roboto'}
                                                color="#3D475C">
                                                {item.tenNhanVien}
                                            </Typography>
                                            <Typography
                                                fontSize="13px"
                                                fontWeight="400"
                                                fontFamily={'Roboto'}
                                                color="#3D475C">
                                                {item.tongThoiGian}h
                                            </Typography>
                                        </Box>
                                        <Button
                                            onClick={(e) => {
                                                handleOpenCustom(e);
                                                setIdNhanVien(item.idNhanVien);
                                                setSelectedId(item.id);
                                            }}
                                            variant="text"
                                            sx={{
                                                minWidth: 'unset',
                                                ml: 'auto',
                                                '&:hover svg': {
                                                    filter: 'var(--color-hoverIcon)'
                                                }
                                            }}>
                                            <EditIcon />
                                        </Button>
                                    </Box>
                                </TableCell>
                                <TableCell className="bodder-inline">
                                    <Box className="custom-time">
                                        {item.monday === '' || item.monday === null ? 'Trống' : item.monday}
                                    </Box>
                                </TableCell>
                                <TableCell className="bodder-inline">
                                    <Box className="custom-time">
                                        {item.tuesday === '' || item.tuesday === null ? 'Trống' : item.tuesday}
                                    </Box>
                                </TableCell>
                                <TableCell className="bodder-inline">
                                    <Box className="custom-time">
                                        {item.wednesday === '' || item.wednesday === null ? 'Trống' : item.wednesday}
                                    </Box>
                                </TableCell>
                                <TableCell className="bodder-inline">
                                    <Box className="custom-time">
                                        {item.thursday === '' || item.thursday === null ? 'Trống' : item.thursday}
                                    </Box>
                                </TableCell>
                                <TableCell className="bodder-inline">
                                    <Box className="custom-time">
                                        {item.friday === '' || item.friday === null ? 'Trống' : item.friday}
                                    </Box>
                                </TableCell>
                                <TableCell className="bodder-inline">
                                    <Box className="custom-time">
                                        {item.saturday === '' || item.saturday === null ? 'Trống' : item.saturday}
                                    </Box>
                                </TableCell>
                                <TableCell className="bodder-inline">
                                    <Box className="custom-time">
                                        {item.sunday === '' || item.sunday === null ? 'Trống' : item.sunday}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <CustomTablePagination
                currentPage={lichLamViecStore.skipCount}
                rowPerPage={lichLamViecStore.maxResultCount}
                totalRecord={lichLamViecStore.totalCount}
                totalPage={lichLamViecStore.totalPage}
                handlePerPageChange={handlePerPageChange}
                handlePageChange={handlePageChange}
            />
        </Box>
    );
};

export default observer(LichLamViec);
