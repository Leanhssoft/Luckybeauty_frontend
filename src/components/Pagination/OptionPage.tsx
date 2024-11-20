import { useState } from 'react';
import { Box, FormControl, Select, MenuItem } from '@mui/material';
import AppConsts from '../../lib/appconst';

export const OptionPage = ({ changeNumberOfpage }: any) => {
    const [value, setValue] = useState(AppConsts.pageOption[0].value);
    const [text, setText] = useState(AppConsts.pageOption[0].text);
    const handleChange = (event: any, item: any) => {
        setValue(event.target.value);
        setText(item.props.children);
        changeNumberOfpage(event.target.value);
    };
    return (
        <>
            <Box sx={{ minWidth: 120 }}>
                <FormControl variant="standard">
                    <Select value={value} onChange={handleChange}>
                        {AppConsts.pageOption.map((item: any, index: number) => (
                            <MenuItem key={item.value} value={item.value}>
                                {item.text}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </>
    );
};
