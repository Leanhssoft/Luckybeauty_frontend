import { useEffect, useState, useMemo } from 'react';
import { TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateValidationError } from '@mui/x-date-pickers/models';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';

export default function DateTimePickerCustom({ defaultVal, handleChangeDate, labelText, props }: any) {
    const [value, setValue] = useState(new Date());
    const [error, setError] = useState<DateValidationError | null>(null);
    const changeDate = (newVal: any) => {
        if (new Date(newVal).toString() === 'Invalid Date') return;
        handleChangeDate(format(new Date(newVal), 'yyyy-MM-dd HH:mm'));
        setValue(newVal);
    };
    const errorMessage = useMemo(() => {
        switch (error) {
            case 'maxDate': {
                return 'Vượt quá ngày hiện tại';
            }

            case 'invalidDate': {
                return 'Ngày lập không đúng định dạng';
            }
            case 'disableFuture': {
                return 'Vượt quá ngày hiện tại';
            }
            default: {
                return '';
            }
        }
    }, [error]);

    useEffect(() => {
        setValue(new Date(defaultVal));
    }, [defaultVal]);

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <DateTimePicker
                    disableFuture
                    maxDate={new Date()}
                    onError={(newError: any) => setError(newError)}
                    sx={{
                        '& .MuiOutlinedInput-input': {
                            padding: '8.5px 8px'
                        },
                        '& .MuiOutlinedInput-root': {
                            fontSize: 14
                        },
                        '& .MuiSvgIcon-root': {
                            width: 14,
                            height: 14
                        },
                        width: props?.width
                    }}
                    value={value}
                    onChange={(newVal) => changeDate(newVal)}
                    slotProps={{
                        textField: {
                            helperText: errorMessage,
                            label: labelText
                        }
                    }}
                />
            </LocalizationProvider>
        </>
    );
}
