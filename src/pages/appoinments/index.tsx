import React, { useState, useEffect, useContext, useRef } from 'react';
import {
    Box,
    Typography,
    Button,
    Avatar,
    Grid,
    RadioGroup,
    FormControlLabel,
    Radio,
    Stack,
    TextField,
    IconButton,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableFooter,
    Pagination,
    TableContainer
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ClearIcon from '@mui/icons-material/Clear';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { Search } from '@mui/icons-material';
import bookingStore from '../../stores/bookingStore';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import Cookies from 'js-cookie';
import CreateOrEditLichHenModal from './components/create-or-edit-lich-hen';
import abpCustom from '../../components/abp-custom';
import LichhenDetail from './components/lich-hen-detail';
import { inject, observer } from 'mobx-react';
import '../customer/customerPage.css';
import suggestStore from '../../stores/suggestStore';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import datLichService from '../../services/dat-lich/datLichService';
import AppConsts, { TypeAction } from '../../lib/appconst';
import * as signalR from '@microsoft/signalr';
import { DateSelectArg, DayHeaderContentArg, EventClickArg, EventContentArg } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { addDays, endOfMonth, endOfWeek, format as formatDateFns, parseISO, startOfMonth, startOfWeek } from 'date-fns';
import { vi } from 'date-fns/locale';
import './appointment.css';
import { QueryBuilder } from '@mui/icons-material';
import NotificationStore from '../../stores/notificationStore';
import Stores from '../../stores/storeIdentifier';
import { FullCalendar_TypeView } from '../../enum/FullCalendar_TypeView';
import ToolbarHeader from './components/Toolbarheader';
import { IHeaderTable, MyHeaderTable } from '../../components/Table/MyHeaderTable';
import TrangThaiBooking from '../../enum/TrangThaiBooking';
import { OptionPage } from '../../components/Pagination/OptionPage';
import { LabelDisplayedRows } from '../../components/Pagination/LabelDisplayedRows';
import { BookingGetAllItemDto } from '../../services/dat-lich/dto/BookingGetAllItemDto';
import { PropConfirmOKCancel } from '../../utils/PropParentToChild';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import fileDowloadService from '../../services/file-dowload.service';
import ButtonOnlyIcon from '../../components/Button/ButtonOnlyIcon';
import DateFilterCustom from '../../components/DatetimePicker/DateFilterCustom';
import PopoverFilterLichHen from './components/PopoverFilterLichHen';
import { RequestFromToDto } from '../../services/dto/ParamSearchDto';

enum KieuHienThi {
    DANG_LUOI = 0,
    DANG_BANG = 1
}
interface ILichHenProps {
    notificationStore: NotificationStore;
}
const LichHen: React.FC<ILichHenProps> = (props) => {
    const { notificationStore } = props;
    const toDay = new Date();
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;
    const cacheKieuHienThi = localStorage.getItem('lichhen_KieuHienThi');
    const [kieuHienThi, setKieuHienThi] = useState(
        cacheKieuHienThi != null ? parseInt(cacheKieuHienThi) : KieuHienThi.DANG_LUOI
    );
    const [txtSearch, setTxtSearch] = useState('');
    const [fromDate, setFromDate] = useState(addDays(startOfWeek(toDay), 1));
    const [toDate, setToDate] = useState(addDays(endOfWeek(toDay), 1));
    const [modalVisible, setModalVisible] = useState(false);
    const [initialView, setInitialView] = useState<string>(FullCalendar_TypeView.WEEK);
    const [initialDate, setInitialDate] = useState<Date>(toDay);
    const calendarRef = useRef<FullCalendar>(null);
    const [idBooking, setIdBooking] = useState<string>('');
    const [connection, setConnection] = useState<signalR.HubConnection>();
    const [notificationConnectionHub, setNotificationConnectionHub] = useState<signalR.HubConnection>();
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [confirmDialog, setConfirmDialog] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });

    const roleXemDanhSach = true;
    const roleEditLichHen = true;
    const roleDeleteLichHen = true;

    const paramFilter: RequestFromToDto = {
        idChiNhanhs: [chinhanh.id],
        textSearch: bookingStore.textSearch,
        fromDate: bookingStore.fromDate,
        toDate: bookingStore.toDate,
        trangThais: bookingStore.trangThaiBooks,
        currentPage: bookingStore.currentPage,
        pageSize: bookingStore.pageSize
    };

    const getData = async () => {
        let from: Date = new Date(),
            to: Date = new Date();
        const lichHenView = Cookies.get('lich-hen-view') ?? FullCalendar_TypeView.WEEK;
        setInitialView(lichHenView);
        const calendarComponent = calendarRef.current;
        if (calendarComponent && calendarComponent.getApi) {
            // Change the view to the new initialView
            const calendarApi = calendarComponent.getApi();
            calendarApi.changeView(lichHenView);

            switch (lichHenView) {
                case FullCalendar_TypeView.MONTH:
                    {
                        from = startOfMonth(toDay);
                        to = endOfMonth(toDay);
                    }
                    break;
                case FullCalendar_TypeView.WEEK:
                    {
                        from = addDays(startOfWeek(toDay), 1);
                        to = addDays(endOfWeek(toDay), 1);
                    }
                    break;
                default:
                    {
                        from = to = toDay;
                    }
                    break;
            }
            bookingStore.pageSize = 100000;

            setFromDate(from);
            setToDate(to);
        } else {
            // hiển thị dạng bảng: mặc định tháng này
            bookingStore.pageSize = 10;
            from = startOfMonth(toDay);
            to = endOfMonth(toDay);
        }
        bookingStore.fromDate = formatDateFns(from, 'yyyy-MM-dd');
        bookingStore.toDate = formatDateFns(to, 'yyyy-MM-dd');
        await bookingStore.getData();
    };

    const suggestData = async () => {
        await suggestStore.getSuggestKhachHang();
        await suggestStore.getSuggestKyThuatVien();
        await suggestStore.getSuggestDichVu(bookingStore.idNhanVien);
    };
    useEffect(() => {
        getData();
        suggestData();
    }, [chinhanh.id]);

    const handleSubmit = async () => {
        setModalVisible(!modalVisible);
        await bookingStore.getData();
        await sendNotification();
        await notificationStore.GetUserNotification();
        // Nếu đang mở xem thông tin lịch hẹn: không đóng form mà thực hiện gọi lại
        await bookingStore.getBookingInfo(bookingStore.bookingInfoDto?.id);
    };
    useEffect(() => {
        createHubConnection();
    }, []);

    const createHubConnection = async () => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(process.env.REACT_APP_REMOTE_SERVICE_BASE_URL + 'bookingHub') // Điều chỉnh URL hub tại đây
            .build();
        try {
            await newConnection.start();
            console.log('SignalR connected');
            setConnection(newConnection);
            newConnection.on('RecieiveAppointment', () => {
                getData();
            });
        } catch (e) {
            console.error('SignalR connection error: ', e);
        }
    };
    const sendNotification = async () => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(process.env.REACT_APP_REMOTE_SERVICE_BASE_URL + 'notifications') // Điều chỉnh URL hub tại đây
            .build();
        setNotificationConnectionHub(newConnection);
        if (newConnection) {
            // Khởi động kết nối nếu chưa kết nối hoặc đang trong trạng thái khác "Connected"
            if (newConnection.state !== 'Connected') {
                await newConnection.start();
            }
            newConnection
                .invoke('SendNotification')
                .then(() => {
                    console.log('Bắt đầu gửi thông báo');
                })
                .catch((error) => {
                    console.error('Error invoking SendNotification:', error);
                });
        }
    };
    const Modal = () => {
        setModalVisible(!modalVisible);
        bookingStore.isShowCreateOrEdit = !bookingStore.isShowCreateOrEdit;
    };
    const handleCreateUpdateShow = (idLichHen: string) => {
        setIdBooking(idLichHen);
        Modal();
    };

    const changeKieuHienThi = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = parseInt(e.target.value);
        setKieuHienThi(newVal);
        localStorage.setItem('lichhen_KieuHienThi', newVal.toString());
    };

    const handleKeyDownTextSearch = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            hanClickIconSearch();
        }
    };
    const hanClickIconSearch = async () => {
        bookingStore.textSearch = txtSearch;
        bookingStore.currentPage = 1;
        await bookingStore.getData();
    };

    const handleChangeDate = async (fromDate: Date, toDate: Date) => {
        const calendarComponent = calendarRef.current;
        if (calendarComponent && calendarComponent.getApi) {
            const calendarApi = calendarComponent.getApi();
            calendarApi.gotoDate(fromDate);
            calendarApi.gotoDate(toDate);
            setFromDate(fromDate);
            setToDate(toDate);
            bookingStore.fromDate = formatDateFns(fromDate, 'yyyy-MM-dd');
            bookingStore.toDate = formatDateFns(toDate, 'yyyy-MM-dd');
            await bookingStore.getData();
        }
    };

    const handleChangeViewType = async (type: FullCalendar_TypeView) => {
        setInitialView(type);
        const calendarComponent = calendarRef.current;
        if (calendarComponent && calendarComponent.getApi) {
            const calendarApi = calendarComponent.getApi();
            calendarApi.changeView(type);
        }
        Cookies.set('lich-hen-view', type);
    };

    const handleDateSelect = async (selectInfo: DateSelectArg) => {
        const calendarApi = selectInfo.view.calendar;
        const isoStartDate = selectInfo.startStr;
        const parsedDate = parseISO(isoStartDate);
        const startHours = formatDateFns(parsedDate, 'HH:mm');
        const startTime = formatDateFns(parsedDate, 'yyyy-MM-dd');
        calendarApi.unselect(); // clear date selection
        //bookingStore.createNewBookingDto();
        bookingStore.createOrEditBookingDto.startHours = startHours;
        bookingStore.createOrEditBookingDto.startTime = startTime;
        if (selectInfo.view.type === 'resourceTimeGridDay') {
            bookingStore.createOrEditBookingDto.idNhanVien = selectInfo.resource?.id ?? AppConsts.guidEmpty;
        }
        bookingStore.isShowCreateOrEdit = true;
    };

    const handleEventClick = async (clickInfo: EventClickArg) => {
        bookingStore.idBooking = clickInfo.event.id;
        if (clickInfo.event.id != null || clickInfo.event.id != '' || clickInfo.event.id !== undefined) {
            const modal = document.getElementsByClassName('fc-popover')[0] as HTMLElement | null;
            if (modal) {
                modal.style.display = 'none';
            }
            await bookingStore.getBookingInfo(clickInfo.event.id);
            await bookingStore.onShowBookingInfo();
        }
    };

    const changeNumberOfpage = async (pageSize: number) => {
        bookingStore.currentPage = 1;
        bookingStore.pageSize = pageSize;
        await bookingStore.getData();
    };

    const handleChangePage = async (value: number) => {
        bookingStore.currentPage = value;
        await bookingStore.getData();
    };

    const dataTable_doActionRow = async (typeAction: number, item: BookingGetAllItemDto) => {
        switch (typeAction) {
            case TypeAction.UPDATE:
                {
                    bookingStore.isShowCreateOrEdit = true;
                    await bookingStore.getForEditBooking(item.id);
                }
                break;
            case TypeAction.DELETE:
                {
                    setIdBooking(item?.id);
                    setConfirmDialog({
                        ...confirmDialog,
                        show: true,
                        title: 'Xác nhận hủy',
                        mes: `Bạn có chắc chắn muốn hủy lịch hẹn ${item.tenDichVu} của khách ${item?.tenKhachHang} không?`
                    });
                }
                break;
        }
    };

    const huyLichHen = async () => {
        const deleteReult = await datLichService.HuyLichHen(idBooking);
        if (deleteReult) {
            setObjAlert({ show: true, mes: 'Hủy lịch hẹn thành công', type: 1 });
        }
        setConfirmDialog({ ...confirmDialog, show: false });
        bookingStore.listBooking = bookingStore?.listBooking?.map((x) => {
            if (x.id === idBooking) {
                return {
                    ...x,
                    trangThai: TrangThaiBooking.Cancel
                };
            } else {
                return x;
            }
        });
    };

    const [anchorDateEl, setAnchorDateEl] = useState<HTMLDivElement | null>(null);
    const openDateFilter = Boolean(anchorDateEl);
    const [anchorElFilter, setAnchorElFilter] = useState<SVGSVGElement | null>(null);

    const onApplyFilterDate = async (from: string, to: string, txtShow: string) => {
        setAnchorDateEl(null);
        setFromDate(new Date(from));
        setToDate(new Date(to));
        bookingStore.currentPage = 1;
        bookingStore.fromDate = from;
        bookingStore.toDate = to;

        await bookingStore.getData();
    };

    const ApplyFilter = async (paramFilter: RequestFromToDto) => {
        setAnchorElFilter(null);
        bookingStore.currentPage = 1;
        bookingStore.fromDate = paramFilter?.fromDate ?? '';
        bookingStore.toDate = paramFilter?.toDate ?? '';
        bookingStore.trangThaiBooks = paramFilter?.trangThais ?? [];

        await bookingStore.getData();
    };

    const ExportToExcel = async () => {
        bookingStore.currentPage = 1;
        bookingStore.pageSize = bookingStore?.totalRowLichHen ?? 1;
        const data = await datLichService.ExportExcel_LichHen(paramFilter);
        fileDowloadService.downloadExportFile(data);
    };

    const listColumnHeader: IHeaderTable[] = [
        { columnId: 'tenKhachHang', columnText: 'Tên khách' },
        { columnId: 'soDienThoai', columnText: 'Số điện thoại' },
        { columnId: 'bookingDate', columnText: 'Ngày hẹn', align: 'center' },
        { columnId: 'startTime', columnText: 'Giờ hẹn', align: 'center' },
        { columnId: 'tenDichVu', columnText: 'Dịch vụ hẹn' },
        { columnId: 'nhanVienThucHien', columnText: 'Nhân viên' },
        { columnId: 'ghiChu', columnText: 'Ghi chú' },
        { columnId: 'trangThai', columnText: 'Trạng thái' }
    ];

    return (
        <Box
            sx={{
                height: '100%',
                backgroundColor: 'white'
            }}>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Stack
                direction={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
                sx={{
                    paddingBottom: '1.5277777777777777vw'
                }}>
                <Typography fontSize="16px" fontWeight="700">
                    Lịch hẹn
                </Typography>
                <RadioGroup row value={kieuHienThi} onChange={changeKieuHienThi}>
                    <FormControlLabel
                        value={KieuHienThi.DANG_LUOI}
                        label="Dạng lưới"
                        control={<Radio size="small" />}
                    />
                    <FormControlLabel
                        value={KieuHienThi.DANG_BANG}
                        label="Dạng bảng"
                        control={<Radio size="small" />}
                    />
                </RadioGroup>
            </Stack>
            <Grid container justifyContent={'space-between'} sx={{ borderBottom: '1px solid #ccc', paddingBottom: 2 }}>
                <Grid item lg={6}>
                    <Stack direction={'row'} spacing={1} flex={1}>
                        <Button
                            hidden={!abpCustom.isGrandPermission('Pages.Booking.Create')}
                            startIcon={window.screen.width > 768 ? <AddIcon /> : null}
                            variant="outlined"
                            color="secondary"
                            title="Thêm cuộc hẹn"
                            onClick={async () => {
                                bookingStore.createNewBookingDto();
                                handleCreateUpdateShow('');
                            }}
                            sx={{ fontSize: '14px', fontWeight: '400' }}>
                            {window.screen.width > 767 ? 'Thêm cuộc hẹn' : <AddIcon />}
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            sx={{ backgroundColor: 'white', color: 'black' }}
                            onClick={ExportToExcel}
                            startIcon={<FileUploadIcon />}>
                            Xuất file
                        </Button>
                    </Stack>
                </Grid>
                <Grid item lg={kieuHienThi === KieuHienThi.DANG_LUOI ? 4 : 6}>
                    <Stack direction={'row'} spacing={1}>
                        {kieuHienThi === KieuHienThi.DANG_BANG && (
                            <Stack flex={1}>
                                <TextField
                                    label="Thời gian"
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            height: '40px!important'
                                        },
                                        backgroundColor: 'white'
                                    }}
                                    onClick={(event) => setAnchorDateEl(event.currentTarget)}
                                    value={`${formatDateFns(fromDate, 'dd/MM/yyyy')} - ${formatDateFns(
                                        toDate,
                                        'dd/MM/yyyy'
                                    )}`}
                                />
                                <DateFilterCustom
                                    id="popover-date-filter"
                                    open={openDateFilter}
                                    anchorEl={anchorDateEl}
                                    onClose={() => setAnchorDateEl(null)}
                                    onApplyDate={onApplyFilterDate}
                                />
                            </Stack>
                        )}
                        <Stack flex={2} direction={'row'} spacing={1}>
                            <TextField
                                size="small"
                                placeholder="Tìm kiếm dịch vụ, nhân viên, khách hàng"
                                fullWidth
                                sx={{ backgroundColor: 'white' }}
                                InputProps={{
                                    startAdornment: (
                                        <IconButton type="button" onClick={hanClickIconSearch}>
                                            <Search />
                                        </IconButton>
                                    )
                                }}
                                onChange={(event) => {
                                    setTxtSearch(event.target.value);
                                }}
                                onKeyDown={(event) => {
                                    handleKeyDownTextSearch(event);
                                }}
                            />
                            <ButtonOnlyIcon
                                icon={
                                    <FilterAltOutlinedIcon
                                        sx={{ width: 20 }}
                                        titleAccess="Lọc nâng cao"
                                        onClick={(event) => setAnchorElFilter(event.currentTarget)}
                                    />
                                }
                                style={{
                                    width: 40,
                                    border: '1px solid #ccc',
                                    backgroundColor: 'white'
                                }}
                            />
                            <PopoverFilterLichHen
                                anchorEl={anchorElFilter}
                                paramFilter={paramFilter}
                                handleClose={() => setAnchorElFilter(null)}
                                handleApply={ApplyFilter}
                            />
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>

            {kieuHienThi === KieuHienThi.DANG_BANG ? (
                <TableContainer className="data-grid-row">
                    <Table>
                        <TableHead>
                            <MyHeaderTable
                                showAction={true}
                                isCheckAll={false}
                                isShowCheck={false}
                                sortBy={''}
                                sortType={''}
                                listColumnHeader={listColumnHeader}
                            />
                        </TableHead>
                        {roleXemDanhSach ? (
                            bookingStore?.totalRowLichHen == 0 ? (
                                <TableFooter>
                                    <TableRow className="table-empty">
                                        <TableCell colSpan={20} align="center">
                                            Không có dữ liệu
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            ) : (
                                <TableBody>
                                    {bookingStore?.listBooking?.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={{ minWidth: 200, maxWidth: 200 }}>
                                                {row?.tenKhachHang}
                                            </TableCell>
                                            <TableCell sx={{ minWidth: 100, maxWidth: 100 }}>
                                                {row?.soDienThoai}
                                            </TableCell>
                                            <TableCell sx={{ maxWidth: 150 }} align="center">
                                                {row?.bookingDate
                                                    ? formatDateFns(new Date(row?.bookingDate), 'dd/MM/yyyy')
                                                    : ''}
                                            </TableCell>
                                            <TableCell sx={{ maxWidth: 200 }} title={row?.tenKhachHang} align="center">
                                                {row?.startTime}
                                            </TableCell>
                                            <TableCell className="lableOverflow">{row?.tenDichVu}</TableCell>
                                            <TableCell>{row?.nhanVienThucHien}</TableCell>
                                            <TableCell className="lableOverflow">{row?.ghiChu}</TableCell>
                                            <TableCell
                                                className={
                                                    row?.trangThai === TrangThaiBooking.Wait
                                                        ? 'data-grid-cell-trangthai-active'
                                                        : row?.trangThai === TrangThaiBooking.Cancel
                                                        ? 'data-grid-cell-trangthai-notActive'
                                                        : ''
                                                }>
                                                {row?.trangThai === TrangThaiBooking.Confirm
                                                    ? 'Đã xác nhận'
                                                    : row?.trangThai === TrangThaiBooking.Wait
                                                    ? 'Chờ xác nhận'
                                                    : row?.trangThai === TrangThaiBooking.CheckIn
                                                    ? 'Đang checkin'
                                                    : row?.trangThai === TrangThaiBooking.Cancel
                                                    ? 'Đã hủy'
                                                    : 'Hoàn thành'}
                                            </TableCell>
                                            <TableCell sx={{ minWidth: 40 }}>
                                                <Stack spacing={1} direction={'row'}>
                                                    <OpenInNewOutlinedIcon
                                                        titleAccess="Cập nhật"
                                                        className="only-icon"
                                                        sx={{
                                                            width: '16px',
                                                            color: '#7e7979',
                                                            display: roleEditLichHen ? '' : 'none'
                                                        }}
                                                        onClick={() => dataTable_doActionRow(TypeAction.UPDATE, row)}
                                                    />
                                                    <ClearIcon
                                                        titleAccess="Xóa"
                                                        sx={{
                                                            ' &:hover': {
                                                                color: 'red',
                                                                cursor: 'pointer'
                                                            },
                                                            display: roleDeleteLichHen ? '' : 'none'
                                                        }}
                                                        style={{ width: '16px', color: 'red' }}
                                                        onClick={() => dataTable_doActionRow(TypeAction.DELETE, row)}
                                                    />
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            )
                        ) : (
                            <TableFooter>
                                <TableRow className="table-empty">
                                    <TableCell colSpan={20} align="center">
                                        Không có quyền xem danh sách lịch hẹn
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        )}
                    </Table>
                </TableContainer>
            ) : (
                <Box sx={{ marginTop: 3 }}>
                    <ToolbarHeader
                        defaultFromDate={fromDate}
                        defaultToDate={toDate}
                        onChangeDate={handleChangeDate}
                        onChangeView={handleChangeViewType}
                    />
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                            listPlugin,
                            resourceTimelinePlugin,
                            resourceTimeGridPlugin
                        ]}
                        schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
                        // chỉ get nhân viên được booking
                        resources={
                            bookingStore?.listNhanVienBooking?.length == 0
                                ? [
                                      {
                                          id: '0',
                                          title: `${JSON.stringify({
                                              id: '0',
                                              tenNhanVien: 'Không có lịch hẹn',
                                              avatar: '',
                                              chucVu: ''
                                          })}`
                                      }
                                  ]
                                : bookingStore?.listNhanVienBooking?.map((item) => ({
                                      title: `${JSON.stringify(item)}`,
                                      id: item.id
                                  }))
                        }
                        resourceLabelContent={renderResourceLabelContent}
                        headerToolbar={false}
                        locale={'vi'}
                        initialView={initialView}
                        firstDay={1}
                        editable={true}
                        selectable={true}
                        titleFormat={{
                            weekday: 'long'
                        }}
                        height={748}
                        initialDate={initialDate}
                        selectMirror={false}
                        dayMaxEvents={true}
                        dayMaxEventRows={4}
                        slotMinTime={'07:00:00'}
                        slotMaxTime={'23:00:00'}
                        allDaySlot={false}
                        dayHeaderFormat={{
                            weekday: 'long',
                            day: initialView === 'timeGridWeek' ? 'numeric' : '2-digit'
                        }}
                        slotLabelFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            omitZeroMinute: false // Set this to true if you want to omit ":00" for minutes
                        }}
                        nowIndicator={true}
                        events={bookingStore.fullCalendarEvents !== undefined ? bookingStore.fullCalendarEvents : []}
                        weekends={true}
                        select={handleDateSelect}
                        eventContent={renderEventContent} // custom render function
                        eventClick={handleEventClick}
                        dayHeaderContent={renderDayHeaderContent}
                    />
                </Box>
            )}
            {kieuHienThi === KieuHienThi.DANG_BANG && (
                <Grid item xs={12} marginTop={3}>
                    <Grid container>
                        <Grid item xs={4} md={4} lg={4} sm={4}>
                            <OptionPage changeNumberOfpage={changeNumberOfpage} />
                        </Grid>
                        <Grid item xs={8} md={8} lg={8} sm={8}>
                            <Stack direction="row" style={{ float: 'right' }}>
                                <LabelDisplayedRows
                                    currentPage={bookingStore?.currentPage ?? 1}
                                    pageSize={bookingStore?.pageSize ?? 10}
                                    totalCount={bookingStore?.totalRowLichHen}
                                />
                                <Pagination
                                    shape="rounded"
                                    count={Math.ceil(bookingStore?.totalRowLichHen / bookingStore?.pageSize)}
                                    page={bookingStore?.currentPage}
                                    defaultPage={bookingStore?.pageSize}
                                    onChange={(e, newVal) => handleChangePage(newVal)}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            )}

            <CreateOrEditLichHenModal
                visible={bookingStore.isShowCreateOrEdit}
                onCancel={() => {
                    setModalVisible(!modalVisible);
                    bookingStore.isShowCreateOrEdit = false;
                }}
                onOk={handleSubmit}
                idLichHen={idBooking}
            />
            <LichhenDetail />

            <ConfirmDelete
                isShow={confirmDialog.show}
                title={confirmDialog.title}
                mes={confirmDialog.mes}
                onOk={huyLichHen}
                onCancel={() => setConfirmDialog({ ...confirmDialog, show: false })}
            />
        </Box>
    );
};
export default inject(Stores.NotificationStore)(observer(LichHen));

//lable header theo ngày của từng nhân viên
function renderResourceLabelContent(args: any) {
    const lable = JSON.parse(args.resource.title);

    return (
        <Box
            display={'flex'}
            padding={'6px 4px'}
            justifyContent={'center'}
            alignItems={'center'}
            sx={{
                minHeight: '65px'
            }}>
            {lable.id !== '0' && (
                <Box>
                    <Box>
                        <Avatar src={lable.avatar} alt={lable.tenNhanVien} />
                    </Box>
                </Box>
            )}

            <Box
                marginLeft={'5px'}
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'space-between'}
                alignItems={'start'}>
                <Typography
                    fontSize="12px"
                    fontWeight="700"
                    sx={{
                        overflow: 'hidden'
                    }}>
                    {lable.tenNhanVien}
                </Typography>
                <Typography fontSize="12px">{lable.chucVu}</Typography>
            </Box>
        </Box>
    );
}

// render header của lịch theo tuần
function renderDayHeaderContent(args: DayHeaderContentArg) {
    const initialView = args.view.type;
    return (
        <Box
            display={'flex'}
            padding={'6px 4px'}
            // justifyContent={initialView === 'timeGridWeek' ? 'start' : 'center'}
            // flexDirection={initialView === 'timeGridWeek' ? 'column' : 'row'}
            // alignItems={initialView === 'timeGridWeek' ? 'start' : 'center'}
            justifyContent={'center'}
            flexDirection={initialView === 'timeGridWeek' ? 'column' : 'row'}
            alignItems={'center'}
            minHeight={'65px'}>
            <Box fontSize={initialView === 'timeGridWeek' ? '12px' : '14px'}>
                {formatDateFns(args.date, 'EEEE', { locale: vi })}
            </Box>
            {initialView === 'timeGridWeek' ? (
                <Box fontSize={'18px'} mt={1}>
                    {formatDateFns(args.date, 'd', { locale: vi })}
                </Box>
            ) : null}
        </Box>
    );
}
function renderEventContent(eventContent: EventContentArg) {
    const formattedStartTime = formatDateFns(eventContent.event.start ?? new Date(), 'HH:mm');
    const formattedEndTime = formatDateFns(eventContent.event.end ?? new Date(), 'HH:mm');
    return (
        <Box
            sx={{
                bgcolor: eventContent.event.backgroundColor,
                padding: '2px 8px',
                borderLeft: `4px solid ${eventContent.event.textColor}`,
                borderRadius: '4px',
                height: '100%',
                overflow: 'hidden'
            }}>
            {eventContent.view.type === 'dayGridMonth' ? (
                <Typography
                    variant="body1"
                    fontSize="12px"
                    whiteSpace="nowrap"
                    width={'100%'}
                    color={eventContent.event.textColor}>
                    {formattedStartTime} {eventContent.event.title + ':'}
                    {eventContent.event.display}
                </Typography>
            ) : (
                <Typography variant="body1" fontSize="12px" whiteSpace="normal" color={eventContent.event.textColor}>
                    <Box display={'flex'} alignItems={'center'} sx={{ overflow: 'hidden' }}>
                        {formattedStartTime} - {formattedEndTime}{' '}
                        <QueryBuilder
                            style={{
                                fontSize: '14px',
                                marginLeft: '5px'
                            }}
                        />
                    </Box>
                    <Box>{eventContent.event.title}</Box>
                    <Box>{eventContent.event.display}</Box>
                </Typography>
            )}
        </Box>
    );
}
