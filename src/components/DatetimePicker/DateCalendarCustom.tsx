import { useEffect, useState } from 'react';
import { DateCalendar, LocalizationProvider, viVN } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';
import utils from '../../utils/utils';

export default function DateCalendarCustom({ defaultVal, handleChangeDate, disable = false }: any) {
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
                <DateCalendar
                    value={value}
                    sx={{
                        minWidth: '200px',
                        maxWidth: '100%',
                        '& .MuiPickersCalendarHeader-root': {
                            paddingRight: 0,
                            paddingLeft: '12px'
                        },
                        '& .MuiPickersCalendarHeader-label': {
                            fontSize: '13px'
                        },
                        '& .MuiDayCalendar-weekDayLabel': {
                            width: '32px'
                        },

                        '& .MuiPickersDay-root': {
                            width: '32px',
                            height: '32px'
                        }
                    }}
                    onChange={(value) => {
                        changeDate(value);
                    }}
                    disabled={disable}
                    dayOfWeekFormatter={(day: string) => {
                        return utils.Mui_GetDayOfWeekFormatter(day);
                    }}
                />
            </LocalizationProvider>
        </>
    );
}
