import * as React from 'react';
import { useState } from 'react';
import { Autocomplete, Grid, TextField, Typography } from '@mui/material';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import { ChiNhanhDto } from '../../services/chi_nhanh/Dto/chiNhanhDto';

export default function AutocompleteChiNhanh({
    handleChoseItem,
    idChosed,
    dataChiNhanh,
    label,
    error,
    helperText
}: any) {
    const [itemChosed, setItemChosed] = useState<ChiNhanhDto | null>(null);
    React.useEffect(() => {
        const item = dataChiNhanh?.filter((x: ChiNhanhDto) => x.id == idChosed);
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
                options={dataChiNhanh}
                getOptionLabel={(option: any) => (option.tenChiNhanh ? option.tenChiNhanh : '')}
                renderInput={(params) => (
                    <TextField {...params} error={error} helperText={helperText} label={label ?? 'Tìm kiếm'} />
                )}
                renderOption={(props, option) => {
                    return (
                        <li {...props}>
                            <Grid container alignItems="center">
                                {/* <Grid item sx={{ display: 'flex', width: 44 }}>
                                    <CenterFocusWeakIcon sx={{ color: 'text.secondary' }} />
                                </Grid> */}
                                <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                                    <Typography style={{ fontSize: '14px' }}>{option.tenChiNhanh}</Typography>
                                </Grid>
                            </Grid>
                        </li>
                    );
                }}
            />
        </>
    );
}
