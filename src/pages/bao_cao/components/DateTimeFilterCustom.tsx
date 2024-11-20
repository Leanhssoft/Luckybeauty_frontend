import { Popover, Grid, Button } from '@mui/material';
import { Box } from '@mui/system';
import { LocalizationProvider, viVN, DatePicker, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    startOfDay,
    endOfDay,
    subDays,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfQuarter,
    endOfQuarter,
    subQuarters,
    startOfYear,
    endOfYear,
    subYears,
    format,
    setYear
} from 'date-fns';
import { ReactComponent as DateIcon } from '../../../images/calendarMenu.svg';
import { vi } from 'date-fns/locale';
import { useState } from 'react';
const HOM_NAY = 'Hôm nay';
const HOM_QUA = 'Hôm qua';
const TUAN_NAY = 'Tuần này';
const TUAN_TRUOC = 'Tuần trước';
const THANG_NAY = 'Tháng này';
const THANG_TRUOC = 'Tháng trước';
const QUY_NAY = 'Quý này';
const QUY_TRUOC = 'Quý trước';
const NAM_NAY = 'Năm này';
const NAM_TRUOC = 'Năm trước';
const TUY_CHON = 'Tùy chọn';
const TAT_CA = 'Tất cả';
const DateTimeFilterCustom = ({
    open,
    anchorEl,
    onClose,
    onOk,
    id,
    dateTimeType,
    setDateTimeType,
    timeFrom,
    setTimeFrom,
    timeTo,
    setTimeTo,
    setDisableSelectDate,
    disableSelectDate
}: any) => {
    const [dateType, setDateType] = useState(dateTimeType);
    return (
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
            }}>
            <div style={{ maxWidth: '690px' }}>
                <Grid container spacing={2} padding={'16px'}>
                    <Grid item xs={3}>
                        <Box display={'flex'} flexDirection={'column'} borderRight={'1px solid #EEF0F4'}>
                            <Button
                                fullWidth
                                sx={{ justifyContent: 'left', color: '#525F7A' }}
                                onClick={() => {
                                    setDateType(HOM_NAY);
                                    const now = new Date();
                                    setTimeFrom(startOfDay(now));
                                    setTimeTo(endOfDay(now));
                                }}>
                                Hôm nay
                            </Button>
                            <Button
                                fullWidth
                                sx={{ justifyContent: 'left', color: '#525F7A' }}
                                onClick={() => {
                                    setDateType(HOM_QUA);
                                    const today = new Date();
                                    const yesterday = subDays(today, 1);
                                    setTimeFrom(startOfDay(yesterday));
                                    setTimeTo(endOfDay(yesterday));
                                    setDisableSelectDate(true);
                                }}>
                                Hôm qua
                            </Button>
                            <Button
                                fullWidth
                                sx={{ justifyContent: 'left', color: '#525F7A' }}
                                onClick={() => {
                                    setDateType(TUAN_NAY);
                                    setTimeFrom(startOfWeek(new Date(), { weekStartsOn: 1 }));
                                    setTimeTo(endOfWeek(new Date(), { weekStartsOn: 1 }));
                                    setDisableSelectDate(true);
                                }}>
                                Tuần này
                            </Button>
                            <Button
                                fullWidth
                                sx={{ justifyContent: 'left', color: '#525F7A' }}
                                onClick={() => {
                                    setDateType(TUAN_TRUOC);
                                    const today = new Date();
                                    const prevWeek = subDays(today, 7);
                                    setTimeFrom(startOfWeek(prevWeek, { weekStartsOn: 1 }));
                                    setTimeTo(endOfWeek(prevWeek, { weekStartsOn: 1 }));
                                    setDisableSelectDate(true);
                                }}>
                                Tuần trước
                            </Button>
                            <Button
                                fullWidth
                                sx={{ justifyContent: 'left', color: '#525F7A' }}
                                onClick={() => {
                                    setDateType(THANG_NAY);
                                    setTimeFrom(startOfMonth(new Date()));
                                    setTimeTo(endOfMonth(new Date()));
                                    setDisableSelectDate(true);
                                }}>
                                Tháng này
                            </Button>
                            <Button
                                fullWidth
                                sx={{ justifyContent: 'left', color: '#525F7A' }}
                                onClick={() => {
                                    setDateType(THANG_TRUOC);
                                    const today = new Date();
                                    const startOfLastMonth = subDays(startOfMonth(today), 1);
                                    setTimeFrom(startOfMonth(startOfLastMonth));
                                    setTimeTo(endOfMonth(startOfLastMonth));
                                    setDisableSelectDate(true);
                                }}>
                                Tháng trước
                            </Button>
                            <Button
                                fullWidth
                                sx={{ justifyContent: 'left', color: '#525F7A' }}
                                onClick={() => {
                                    setDateType(QUY_NAY);
                                    setTimeFrom(startOfQuarter(new Date()));
                                    setTimeTo(endOfQuarter(new Date()));
                                    setDisableSelectDate(true);
                                }}>
                                Quý này
                            </Button>
                            <Button
                                fullWidth
                                sx={{ justifyContent: 'left', color: '#525F7A' }}
                                onClick={() => {
                                    setDateType(QUY_TRUOC);
                                    const today = new Date();
                                    const prevQuarter = subQuarters(today, 1);
                                    setTimeFrom(startOfQuarter(prevQuarter));
                                    setTimeTo(endOfQuarter(prevQuarter));
                                    setDisableSelectDate(true);
                                }}>
                                Quý trước
                            </Button>
                            <Button
                                fullWidth
                                sx={{ justifyContent: 'left', color: '#525F7A' }}
                                onClick={() => {
                                    setDateType(NAM_NAY);
                                    setTimeFrom(startOfYear(new Date()));
                                    setTimeTo(endOfYear(new Date()));
                                    setDisableSelectDate(true);
                                }}>
                                Năm này
                            </Button>
                            <Button
                                fullWidth
                                sx={{ justifyContent: 'left', color: '#525F7A' }}
                                onClick={() => {
                                    setDateType(NAM_TRUOC);
                                    const today = new Date();
                                    const prevYear = subYears(today, 1);
                                    setTimeFrom(startOfYear(prevYear));
                                    setTimeTo(endOfYear(prevYear));
                                    setDisableSelectDate(true);
                                }}>
                                Năm trước
                            </Button>
                            <Button
                                fullWidth
                                sx={{ justifyContent: 'left', color: '#525F7A' }}
                                onClick={() => {
                                    setDateType(TAT_CA);
                                    setTimeFrom(startOfYear(setYear(new Date(), 1900)));
                                    setTimeTo(endOfDay(new Date()));
                                    setDisableSelectDate(true);
                                }}>
                                Tất cả thời gian
                            </Button>
                            <Button
                                fullWidth
                                sx={{ justifyContent: 'left', color: '#525F7A' }}
                                onClick={async () => {
                                    await setDisableSelectDate(false);
                                    setDateType(TUY_CHON);
                                }}>
                                Tùy chỉnh
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={9}>
                        <Grid item container spacing={2}>
                            <Grid item xs={6}>
                                <LocalizationProvider
                                    dateAdapter={AdapterDateFns}
                                    adapterLocale={vi}
                                    localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
                                    <DatePicker
                                        open={false}
                                        disableOpenPicker={true}
                                        value={timeFrom}
                                        disabled={disableSelectDate}
                                        onChange={(value) => {
                                            setTimeFrom(startOfDay(new Date(value)));
                                        }}
                                        slotProps={{
                                            textField: {
                                                size: 'small',
                                                fullWidth: true,
                                                InputProps: {
                                                    startAdornment: (
                                                        <>
                                                            <DateIcon
                                                                style={{
                                                                    marginRight: '8px'
                                                                }}
                                                            />
                                                        </>
                                                    )
                                                }
                                            }
                                        }}
                                    />
                                    <DateCalendar
                                        value={timeFrom}
                                        sx={{
                                            maxWidth: '240px',
                                            '& .MuiPickersCalendarHeader-label': {
                                                fontSize: '13px'
                                            },
                                            '& .MuiPickersDay-root': {
                                                maxWidth: '32px',
                                                maxHeight: '32px'
                                            }
                                        }}
                                        onChange={(value) => {
                                            setTimeFrom(startOfDay(value));
                                        }}
                                        disabled={disableSelectDate}
                                        dayOfWeekFormatter={(day: string) => {
                                            if (day.length > 2) {
                                                const dayOfWeek = day.substring(day.length - 1);
                                                let sDay = '';
                                                switch (dayOfWeek) {
                                                    case '2':
                                                        sDay = 'T2';
                                                        break;
                                                    case '3':
                                                        sDay = 'T3';
                                                        break;
                                                    case '4':
                                                        sDay = 'T4';
                                                        break;
                                                    case '5':
                                                        sDay = 'T5';
                                                        break;
                                                    case '6':
                                                        sDay = 'T6';
                                                        break;
                                                    case '7':
                                                        sDay = 'T7';
                                                        break;
                                                }
                                                return sDay;
                                            } else {
                                                return day;
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={6}>
                                <LocalizationProvider
                                    dateAdapter={AdapterDateFns}
                                    adapterLocale={vi}
                                    localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
                                    <DatePicker
                                        open={false}
                                        disableOpenPicker={true}
                                        value={timeTo}
                                        disabled={disableSelectDate}
                                        onChange={(value) => {
                                            setTimeTo(endOfDay(new Date(value)));
                                        }}
                                        slotProps={{
                                            textField: {
                                                size: 'small',
                                                fullWidth: true,
                                                InputProps: {
                                                    startAdornment: (
                                                        <>
                                                            <DateIcon
                                                                style={{
                                                                    marginRight: '8px'
                                                                }}
                                                            />
                                                        </>
                                                    )
                                                }
                                            }
                                        }}
                                    />
                                    <DateCalendar
                                        value={timeTo}
                                        sx={{
                                            maxWidth: '240px',
                                            '& .MuiPickersCalendarHeader-label': {
                                                fontSize: '13px'
                                            },
                                            '& .MuiPickersDay-root': {
                                                maxWidth: '32px',
                                                maxHeight: '32px'
                                            }
                                        }}
                                        disabled={disableSelectDate}
                                        onChange={(value) => {
                                            setTimeTo(endOfDay(value));
                                        }}
                                        dayOfWeekFormatter={(day: string) => {
                                            if (day.length > 2) {
                                                const dayOfWeek = day.substring(day.length - 1);
                                                let sDay = '';
                                                switch (dayOfWeek) {
                                                    case '2':
                                                        sDay = 'T2';
                                                        break;
                                                    case '3':
                                                        sDay = 'T3';
                                                        break;
                                                    case '4':
                                                        sDay = 'T4';
                                                        break;
                                                    case '5':
                                                        sDay = 'T5';
                                                        break;
                                                    case '6':
                                                        sDay = 'T6';
                                                        break;
                                                    case '7':
                                                        sDay = 'T7';
                                                        break;
                                                }
                                                return sDay;
                                            } else {
                                                return day;
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                display={'flex'}
                                justifyContent={'end'}
                                gap={'8px'}
                                alignItems={'end'}
                                paddingTop={'22px !important'}
                                borderTop={'1px solid #EEF0F4'}>
                                <Button
                                    variant="outlined"
                                    sx={{ color: '#525F7A', border: '1px solid #C2C9D6' }}
                                    onClick={onClose}>
                                    Hủy
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={async () => {
                                        await setDateTimeType(dateType);
                                        onOk();
                                    }}>
                                    Áp dụng
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </Popover>
    );
};
export default DateTimeFilterCustom;
