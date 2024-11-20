import { Box, Slider, Stack, TextField, Typography } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Mark } from '@mui/base';
import { useEffect, useState } from 'react';

export type TPropsSliderFilterNumber = {
    lstData: Mark[];
    defaultValue?: number;
    lbl?: string;
    minValueDefault?: number;
    maxValueDefault?: number;
    onChangeMinMax: (minValue: number | null, maxValue: number | null) => void;
};

export default function SliderFilterNumber(props: TPropsSliderFilterNumber) {
    const { lstData, defaultValue, minValueDefault, maxValueDefault, lbl, onChangeMinMax } = props;
    const [minValue, setMinValue] = useState<number | null>(null);
    const [maxValue, setMaxValue] = useState<number | null>(null);
    const [open, setOpen] = useState(false);

    const handleChange = (event: Event, newValue: number | number[]) => {
        setMinValue(newValue as number);
        setMaxValue(null);
        onChangeMinMax(newValue as number, null);
    };

    return (
        <Stack sx={{ width: 300 }}>
            <Stack spacing={2} direction={'row'}>
                <Slider
                    valueLabelDisplay="on"
                    disabled={open}
                    max={maxValueDefault}
                    defaultValue={defaultValue}
                    marks={lstData}
                    onChange={handleChange}></Slider>
                <MoreHorizIcon titleAccess="Tùy chỉnh" onClick={() => setOpen(!open)} />
            </Stack>
            <Stack alignItems={'center'}>
                {open && (
                    <Stack
                        spacing={1}
                        direction={'row'}
                        alignItems={'center'}
                        width={'80%'}
                        marginTop={2}
                        sx={{
                            ' input': {
                                textAlign: 'right'
                            }
                        }}>
                        <TextField
                            size="small"
                            label="Từ"
                            defaultValue={minValueDefault}
                            onChange={(e) => {
                                const newVal = parseFloat(e.target.value);
                                setMinValue(newVal);
                                onChangeMinMax(newVal, maxValue);
                            }}
                        />
                        <Typography variant="body2">{' - '}</Typography>
                        <TextField
                            size="small"
                            label="Đến"
                            defaultValue={maxValueDefault}
                            onChange={(e) => {
                                const newVal = parseFloat(e.target.value);
                                setMaxValue(newVal);
                                onChangeMinMax(minValue, newVal);
                            }}
                        />
                        <Typography variant="body2">{lbl}</Typography>
                    </Stack>
                )}
            </Stack>
        </Stack>
    );
}
