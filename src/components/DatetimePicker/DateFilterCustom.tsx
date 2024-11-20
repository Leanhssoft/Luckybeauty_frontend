import { Popover, Grid, Box, Button, Typography } from '@mui/material';
import { DateField, LocalizationProvider, viVN } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ReactComponent as DateIcon } from '../../images/calendarMenu.svg';
import { useEffect, useState } from 'react';
import AppConsts, { DateType } from '../../lib/appconst';
import { IList } from '../../services/dto/IList';
import {
    startOfDay,
    endOfDay,
    subDays,
    format,
    addDays,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfQuarter,
    endOfQuarter,
    subQuarters,
    startOfYear,
    endOfYear,
    subYears
} from 'date-fns';
import { vi } from 'date-fns/locale';
import DateCalendarCustom from './DateCalendarCustom';
import utils from '../../utils/utils';

export function DateFieldCustomer({ defaultVal, handleChangeDate, label, disabled }: any) {
    const today = new Date();
    const [value, setValue] = useState<Date | null>(new Date(format(today, 'yyyy-MM-01')));
    const changeDate = (newVal: any) => {
        if (new Date(newVal).toString() === 'Invalid Date') return;
        handleChangeDate(format(new Date(newVal), 'yyyy-MM-dd'));
        setValue(newVal);
    };
    useEffect(() => {
        if (utils.checkNull(defaultVal)) {
            setValue(null);
        } else {
            setValue(new Date(defaultVal));
        }
    }, [defaultVal]);

    return (
        <>
            <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={vi}
                localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
                <DateField
                    label={label ?? ''}
                    value={value}
                    disabled={disabled ?? false}
                    onChange={(newVal) => changeDate(newVal)}
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
            </LocalizationProvider>
        </>
    );
}

export default function DateFilterCustom({
    id,
    open,
    anchorEl,
    onClose,
    onApplyDate,
    isFuture = 0,
    dateTypeDefault
}: any) {
    const today = new Date();
    const [dateTypeText, setDateTypeText] = useState('Tháng này');
    const [dateType, setDateType] = useState(DateType.THANG_NAY);
    const [disableSelectDate, setDisableSelectDate] = useState(true);
    const [dateFrom, setDateFrom] = useState<Date | null>(startOfDay(new Date(today)));
    const [dateTo, setDateTo] = useState<Date | null>(endOfDay(new Date(today)));

    const ListTypeDateTime = isFuture
        ? AppConsts.ListDateType.filter(
              (x: IList) =>
                  ![
                      DateType.HOM_QUA,
                      DateType.TUAN_TRUOC,
                      DateType.THANG_TRUOC,
                      DateType.QUY_TRUOC,
                      DateType.NAM_TRUOC
                  ].includes(x.id)
          )
        : AppConsts.ListDateType.filter(
              (x: IList) =>
                  ![
                      DateType.NGAY_MAI,
                      DateType.TUAN_NAY,
                      DateType.TUAN_TRUOC,
                      DateType.TUAN_TOI,
                      DateType.THANG_TOI
                  ].includes(x.id)
          );

    useEffect(() => {
        if (dateTypeDefault !== undefined) {
            setDateType(dateTypeDefault);
        }
    }, [dateTypeDefault]);

    const changeDateType = async (item: IList) => {
        setDateType(item.id);
        setDateTypeText(item.text);
        setDisableSelectDate(true);

        switch (item.id) {
            case DateType.HOM_NAY:
                {
                    setDateFrom(today);
                    setDateTo(today);
                }
                break;
            case DateType.HOM_QUA:
                {
                    const yesterday = subDays(today, 1);
                    setDateFrom(yesterday);
                    setDateTo(yesterday);
                }
                break;
            case DateType.NGAY_MAI:
                {
                    const yesterday = addDays(today, 1);
                    setDateFrom(yesterday);
                    setDateTo(yesterday);
                }
                break;
            case DateType.TUAN_NAY:
                {
                    setDateFrom(startOfWeek(today, { weekStartsOn: 1 }));
                    setDateTo(endOfWeek(today, { weekStartsOn: 1 }));
                }
                break;
            case DateType.TUAN_TRUOC:
                {
                    const prevWeek = subDays(today, 7);
                    setDateFrom(startOfWeek(prevWeek, { weekStartsOn: 1 }));
                    setDateTo(endOfWeek(prevWeek, { weekStartsOn: 1 }));
                }
                break;
            case DateType.TUAN_TOI:
                {
                    const nextWeek = addDays(today, 7);
                    setDateFrom(startOfWeek(nextWeek, { weekStartsOn: 1 }));
                    setDateTo(endOfWeek(nextWeek, { weekStartsOn: 1 }));
                }
                break;
            case DateType.THANG_NAY:
                {
                    setDateFrom(startOfMonth(today));
                    setDateTo(endOfMonth(today));
                }
                break;
            case DateType.THANG_TRUOC:
                {
                    const lastMonth = subDays(startOfMonth(today), 1);
                    setDateFrom(startOfMonth(lastMonth));
                    setDateTo(endOfMonth(lastMonth));
                }
                break;
            case DateType.THANG_TOI:
                {
                    const nextMonth = addDays(endOfMonth(today), 1);
                    setDateFrom(startOfMonth(nextMonth));
                    setDateTo(endOfMonth(nextMonth));
                }
                break;
            case DateType.QUY_NAY:
                {
                    setDateFrom(startOfQuarter(today));
                    setDateTo(endOfQuarter(today));
                }
                break;
            case DateType.QUY_TRUOC:
                {
                    const prevQuarter = subQuarters(today, 1);
                    setDateFrom(startOfMonth(prevQuarter));
                    setDateTo(endOfMonth(prevQuarter));
                }
                break;
            case DateType.NAM_NAY:
                {
                    setDateFrom(startOfYear(today));
                    setDateTo(endOfYear(today));
                }
                break;
            case DateType.NAM_TRUOC:
                {
                    const prevYear = subYears(today, 1);
                    setDateFrom(startOfYear(prevYear));
                    setDateTo(endOfYear(prevYear));
                }
                break;
            case DateType.TAT_CA:
                {
                    const dateMin = new Date('2023-01-01');
                    setDateFrom(dateMin);
                    setDateTo(endOfDay(today));
                }
                break;
            case DateType.TUY_CHON:
                {
                    setDisableSelectDate(false);
                }
                break;
        }
    };

    const changeDateFrom = (value: string) => {
        setDateFrom(new Date(value));
    };
    const changeDateTo = (value: string) => {
        setDateTo(new Date(value));
    };
    const applyDate = async () => {
        if (dateFrom != null && dateTo != null) {
            const dateFrom_Format = format(dateFrom, 'yyyy-MM-dd');
            const dateTo_Format = format(dateTo, 'yyyy-MM-dd');
            // const text =
            //     dateType == DateType.TUY_CHON
            //         ? `${format(dateFrom, 'dd/MM/yyyy')} - ${format(dateTo, 'dd/MM/yyyy')}`
            //         : dateTypeText;
            onApplyDate(dateFrom_Format, dateTo_Format, dateType, dateTypeText);
        }
    };

    return (
        <>
            <Popover
                id={id ?? 'popover-date-filter'}
                open={open}
                anchorEl={anchorEl}
                onClose={onClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}>
                <div>
                    <Grid container spacing={2} padding={'16px'}>
                        <Grid item xs={3}>
                            <Box display={'flex'} flexDirection={'column'} borderRight={'1px solid #EEF0F4'}>
                                {ListTypeDateTime.map((x) => (
                                    <Button
                                        key={x.id}
                                        fullWidth
                                        sx={{
                                            justifyContent: 'left',
                                            color: '#525F7A',
                                            backgroundColor: x.id == dateType ? 'var(--color-bg)' : '',
                                            '&:hover': {
                                                backgroundColor: 'rgb(246,253,252,1)'
                                            }
                                        }}
                                        onClick={() => {
                                            changeDateType(x);
                                        }}>
                                        {x.text}
                                    </Button>
                                ))}
                            </Box>
                        </Grid>
                        <Grid item xs={9}>
                            <Grid item container spacing={0.5}>
                                <Grid item xs={12} sm={6} md={6}>
                                    <Typography>Từ ngày</Typography>
                                    <DateFieldCustomer
                                        disabled={disableSelectDate}
                                        defaultVal={dateFrom}
                                        handleChangeDate={changeDateFrom}
                                    />
                                    <DateCalendarCustom
                                        defaultVal={dateFrom}
                                        handleChangeDate={changeDateFrom}
                                        disable={disableSelectDate}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                    <Typography>Đến ngày</Typography>
                                    <DateFieldCustomer
                                        disabled={disableSelectDate}
                                        defaultVal={dateTo}
                                        handleChangeDate={changeDateTo}
                                    />
                                    <DateCalendarCustom
                                        defaultVal={dateTo}
                                        handleChangeDate={changeDateTo}
                                        disable={disableSelectDate}
                                    />
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
                                    <Button variant="contained" onClick={applyDate}>
                                        Áp dụng
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </Popover>
        </>
    );
}
