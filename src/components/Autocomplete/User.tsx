import * as React from 'react';
import { useState } from 'react';
import { Autocomplete, Grid, TextField, Typography } from '@mui/material';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import { GetAllUserOutput } from '../../services/user/dto/getAllUserOutput';

export default function AutocompleteUser({ handleChoseItem, idChosed, dataUser }: any) {
    const [itemChosed, setItemChosed] = useState<GetAllUserOutput>({
        id: 0,
        userName: ''
    } as GetAllUserOutput);
    React.useEffect(() => {
        const item = dataUser.filter((x: GetAllUserOutput) => x.id == idChosed);
        if (item.length > 0) {
            setItemChosed(item[0]);
        } else {
            setItemChosed({ id: 0, userName: '' } as GetAllUserOutput);
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
                filterOptions={(x) => x}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={dataUser}
                getOptionLabel={(option: any) => (option.userName ? option.userName : '')}
                renderInput={(params) => <TextField {...params} label="Tìm kiếm" />}
                renderOption={(props, option) => {
                    return (
                        <li {...props}>
                            <Grid container alignItems="center">
                                <Grid item sx={{ display: 'flex', width: 44 }}>
                                    <CenterFocusWeakIcon sx={{ color: 'text.secondary' }} />
                                </Grid>
                                <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                                    <Typography style={{ fontSize: '14px' }}>{option.userName}</Typography>
                                </Grid>
                            </Grid>
                        </li>
                    );
                }}
            />
        </>
    );
}
