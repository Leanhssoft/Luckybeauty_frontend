import * as React from 'react';
import { useState } from 'react';
import { Autocomplete, Grid, TextField, Typography, Box } from '@mui/material';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import { GetAllUserOutput } from '../../services/user/dto/getAllUserOutput';
import NhanSuItemDto from '../../services/nhan-vien/dto/nhanSuItemDto';

export default function AutocompleteNhanVien({ handleChoseItem, idChosed, dataNhanVien, label, helperText }: any) {
    const [itemChosed, setItemChosed] = useState<NhanSuItemDto | null>(null);
    React.useEffect(() => {
        const item = dataNhanVien.filter((x: NhanSuItemDto) => x.id == idChosed);
        if (item.length > 0) {
            setItemChosed(item[0]);
        } else {
            setItemChosed(null);
        }
    }, [idChosed]);

    const choseItem = (item: any) => {
        handleChoseItem(item);
    };

    return (
        <>
            <Autocomplete
                size="small"
                fullWidth
                disablePortal
                autoComplete
                multiple={false}
                value={itemChosed}
                onChange={(event: any, newValue: any) => choseItem(newValue)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={dataNhanVien}
                getOptionLabel={(option: any) => (option.tenNhanVien ? option.tenNhanVien : '')}
                renderInput={(params) => <TextField {...params} label={label ?? 'Tìm kiếm'} helperText={helperText} />}
                renderOption={(props, option) => {
                    return (
                        <li {...props}>
                            <Grid container alignItems="center" spacing={1}>
                                <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                                    <Typography style={{ fontSize: '14px' }}>{option.tenNhanVien}</Typography>
                                    <Box
                                        component="span"
                                        style={{
                                            fontWeight: 500,
                                            color: '#acaca5',
                                            fontSize: '12px'
                                        }}>
                                        {option.maNhanVien}
                                    </Box>
                                </Grid>
                            </Grid>
                        </li>
                    );
                }}
            />
        </>
    );
}
