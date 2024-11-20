import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { MauInDto } from '../../services/mau_in/MauInDto';
export default function SelectMauIn({ idChosed, data, handleChange }: any) {
    const changeItem = (item: MauInDto) => {
        handleChange(item);
    };
    return (
        <>
            <FormControl fullWidth size="small" sx={{ backgroundColor: 'white' }}>
                <Select labelId="demo-simple-select-label" id="demo-simple-select" value={idChosed} label="Age">
                    {data.map((item: MauInDto, index: number) => (
                        <MenuItem key={index} value={item.id} onClick={() => changeItem(item)}>
                            {item.tenMauIn}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    );
}
