import { Box, Button, ButtonGroup, Grid, SelectChangeEvent, Stack, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
    addDays,
    addMonths,
    differenceInDays,
    endOfMonth,
    endOfWeek,
    format,
    startOfMonth,
    startOfWeek
} from 'date-fns';
import { vi } from 'date-fns/locale';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { FullCalendar_TypeView } from '../../../enum/FullCalendar_TypeView';

type PropHeaderCalendar = {
    defaultFromDate: Date;
    defaultToDate: Date;
    onChangeDate: (romDate: Date, toDate: Date) => void;
    onChangeView: (typeView: FullCalendar_TypeView) => void;
};
const ToolbarHeader = ({ defaultFromDate, defaultToDate, onChangeDate, onChangeView }: PropHeaderCalendar) => {
    const toDay = new Date();
    const arrTypeView = [
        { id: FullCalendar_TypeView.DAY, text: 'Ngày' },
        { id: FullCalendar_TypeView.WEEK, text: 'Tuần' },
        { id: FullCalendar_TypeView.MONTH, text: 'Tháng' }
    ];
    const [typeCalendar, setFullCalendar_TypeView] = useState(FullCalendar_TypeView.WEEK);
    const [lblHeader, setLblHeader] = useState('');
    const [fromDate, setFromDate] = useState<Date>(toDay);
    const [toDate, setToDate] = useState<Date>(toDay);

    useEffect(() => {
        setFromDate(defaultFromDate);
        setToDate(defaultToDate);

        const diff = differenceInDays(new Date(defaultToDate), new Date(defaultFromDate));
        switch (diff) {
            case 0:
                {
                    setFullCalendar_TypeView(FullCalendar_TypeView.DAY);
                }
                break;
            case 6:
                setFullCalendar_TypeView(FullCalendar_TypeView.WEEK);
                break;
            default:
                setFullCalendar_TypeView(FullCalendar_TypeView.MONTH);
                break;
        }
    }, [defaultFromDate]);

    useEffect(() => {
        const diff = differenceInDays(new Date(toDate), new Date(fromDate));

        switch (diff) {
            case 0:
                {
                    const txtDay = format(fromDate, "cccc, dd 'tháng' MM, 'năm' yyyy", {
                        locale: vi
                    });
                    if (format(fromDate, 'yyyy-MM-dd') === format(toDay, 'yyyy-MM-dd')) {
                        setLblHeader(`Hôm nay, ${txtDay}`);
                    } else {
                        setLblHeader(`${txtDay}`);
                    }
                }
                break;
            case 6:
                {
                    const txtFrom = format(new Date(fromDate), 'cccc, dd/MM/yyy', { locale: vi });
                    const txtTo = format(new Date(toDate), 'cccc, dd/MM/yyy', { locale: vi });
                    setLblHeader(`${txtFrom} - ${txtTo}`);
                }
                break;
            default:
                {
                    const txtFrom = format(new Date(fromDate), " 'Tháng' MM, 'Năm' yyyy");
                    setLblHeader(`${txtFrom}`);
                }
                break;
        }
    }, [fromDate]);

    const changeView = (type: FullCalendar_TypeView) => {
        if (type === typeCalendar) return;
        setFullCalendar_TypeView(type);

        let from: Date = new Date(),
            to: Date = new Date();

        switch (type) {
            case FullCalendar_TypeView.DAY:
                {
                    from = to = toDay;
                    const txtDay = format(toDay, "cccc, dd 'tháng' MM, 'năm' yyyy", {
                        locale: vi
                    });
                    setLblHeader(`Hôm nay ${txtDay}`);
                }
                break;
            case FullCalendar_TypeView.WEEK:
                {
                    from = addDays(startOfWeek(toDay), 1);
                    to = addDays(endOfWeek(toDay), 1);
                }
                break;
            case FullCalendar_TypeView.MONTH:
                {
                    from = startOfMonth(toDay);
                    to = endOfMonth(toDay);
                }
                break;
        }
        setFromDate(from);
        setToDate(to);

        onChangeView(type);
        onChangeDate(from, to);
    };

    const handlePrevious = () => {
        let from: Date = new Date(),
            to: Date = new Date();

        switch (typeCalendar) {
            case FullCalendar_TypeView.DAY:
                {
                    from = to = addDays(new Date(fromDate), -1);
                }
                break;
            case FullCalendar_TypeView.WEEK:
                {
                    from = addDays(new Date(fromDate), -7);
                    to = addDays(new Date(toDate), -7);
                }
                break;
            case FullCalendar_TypeView.MONTH:
                {
                    const nextMonth = addMonths(fromDate, -1);
                    from = startOfMonth(nextMonth);
                    to = endOfMonth(nextMonth);
                }
                break;
        }
        setFromDate(from);
        setToDate(to);
        onChangeDate(from, to);
    };
    const handleNext = () => {
        let from: Date = new Date(),
            to: Date = new Date();
        switch (typeCalendar) {
            case FullCalendar_TypeView.DAY:
                {
                    from = to = addDays(new Date(fromDate), 1);
                }
                break;
            case FullCalendar_TypeView.WEEK:
                {
                    from = addDays(new Date(fromDate), 7);
                    to = addDays(new Date(toDate), 7);
                }
                break;
            case FullCalendar_TypeView.MONTH:
                {
                    const nextMonth = addMonths(fromDate, 1);
                    from = startOfMonth(nextMonth);
                    to = endOfMonth(nextMonth);
                }
                break;
        }
        setFromDate(from);
        setToDate(to);
        onChangeDate(from, to);
    };

    return (
        <Grid container sx={{ marginBottom: '16px' }}>
            <Grid item xs={12} sm={2} lg={2}>
                <ButtonGroup>
                    {arrTypeView?.map((x) => (
                        <Button
                            key={x.id}
                            variant={typeCalendar == x.id ? 'contained' : 'outlined'}
                            onClick={() => changeView(x.id)}>
                            {x.text}
                        </Button>
                    ))}
                </ButtonGroup>
            </Grid>
            <Grid item xs={12} sm={7} lg={8}>
                <Box
                    display="flex"
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
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    <Button
                        variant="outlined"
                        sx={{ mr: '16px' }}
                        className="btn-outline-hover"
                        onClick={handlePrevious}>
                        <ChevronLeftIcon />
                    </Button>
                    <Typography fontSize="16px" fontWeight="700">
                        {lblHeader}
                    </Typography>
                    <Button variant="outlined" sx={{ ml: '16px' }} onClick={handleNext}>
                        <ChevronRightIcon />
                    </Button>
                </Box>
            </Grid>
            <Grid item lg={2}></Grid>
        </Grid>
    );
};
export default observer(ToolbarHeader);
