import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ISelect } from '../../lib/appconst';

// export interface IPropsSelectWithData {

// }

export default function SelectWithData({ idChosed, data, handleChange, label }: any) {
    const changeItem = (item: ISelect) => {
        handleChange(item);
    };
    return (
        <>
            <FormControl fullWidth size="small">
                <InputLabel
                    sx={{
                        fontSize: '15px'
                    }}>
                    {label}
                </InputLabel>
                <Select value={idChosed} label={label}>
                    {data?.map((item: ISelect, index: number) => (
                        <MenuItem key={index} value={item.value} onClick={() => changeItem(item)}>
                            {item.text}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    );
}
