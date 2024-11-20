import * as React from 'react';
import { useState } from 'react';
import { Autocomplete, Grid, TextField, Typography } from '@mui/material';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import { NganHangDto } from '../../services/so_quy/Dto/TaiKhoanNganHangDto';

export default function AutocompleteBank({ handleChoseItem, idChosed, listOption }: any) {
    const [itemChosed, setItemChosed] = useState<NganHangDto | null>(null);
    React.useEffect(() => {
        const item = listOption.filter((x: NganHangDto) => x.id == idChosed);
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
                options={listOption}
                getOptionLabel={(option: any) => (option.tenNganHang ? option.tenNganHang : '')}
                renderInput={(params) => <TextField {...params} label="Tìm kiếm" />}
                renderOption={(props, option) => {
                    return (
                        <>
                            <li {...props}>
                                {option.id != '' && (
                                    <Grid container alignItems="center">
                                        <Grid item sx={{ display: 'flex', width: 44 }}>
                                            <CenterFocusWeakIcon sx={{ color: 'text.secondary' }} />
                                        </Grid>
                                        <Grid
                                            item
                                            sx={{
                                                width: 'calc(100% - 44px)',
                                                wordWrap: 'break-word'
                                            }}>
                                            <Typography style={{ fontSize: '14px' }}>{option.tenNganHang}</Typography>
                                        </Grid>
                                    </Grid>
                                )}
                            </li>
                        </>
                    );
                }}
            />
        </>
    );
}
