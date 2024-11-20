import * as React from 'react';
import { useState } from 'react';
import { Autocomplete, Grid, TextField, Typography, Stack } from '@mui/material';
import { IDataAutocomplete } from '../../services/dto/IDataAutocomplete';
import { CSSProperties } from 'styled-components';

export interface IPropsAutocompleteWithData {
    label?: string;
    helperText?: string;
    idChosed: string | null;
    lstData: IDataAutocomplete[];
    optionLabel?: { label1?: string; label2?: string };
    handleChoseItem: (item: IDataAutocomplete) => void;
    style?: CSSProperties;
}

export default function AutocompleteWithData(props: IPropsAutocompleteWithData) {
    const { label, helperText, style, idChosed, lstData, optionLabel, handleChoseItem } = props;

    const [itemChosed, setItemChosed] = useState<IDataAutocomplete | null>(null);
    React.useEffect(() => {
        const item = lstData?.filter((x: IDataAutocomplete) => x.id == idChosed);
        if (item?.length > 0) {
            setItemChosed(item[0]);
        } else {
            setItemChosed(null);
        }
    }, [idChosed]);

    const choseItem = (item: IDataAutocomplete) => {
        handleChoseItem(item);
    };

    return (
        <Stack style={style}>
            <Autocomplete
                size="small"
                fullWidth
                disablePortal
                autoComplete
                multiple={false}
                value={itemChosed}
                onChange={(event: any, newValue: any) => choseItem(newValue)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={lstData}
                getOptionLabel={(option: IDataAutocomplete) => (option.text1 ? option.text1 : '')}
                renderInput={(params) => <TextField {...params} label={label ?? 'Tìm kiếm'} helperText={helperText} />}
                renderOption={(props, option) => {
                    return (
                        <li {...props} style={{ borderBottom: '1px dashed var(--border-color)' }}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Stack
                                        direction={'row'}
                                        justifyContent={'space-between'}
                                        paddingLeft={0}
                                        marginLeft={0}>
                                        <Stack spacing={1} alignItems={'center'} direction={'row'}>
                                            {option?.imgUrl && (
                                                <img
                                                    width={40}
                                                    height={40}
                                                    src={option?.imgUrl}
                                                    style={{ borderRadius: '100%' }}
                                                />
                                            )}
                                            <Stack direction={'row'} spacing={1}>
                                                <Typography style={{ fontSize: '13px' }} color={'#acaca5'}>
                                                    {optionLabel?.label1}
                                                </Typography>
                                                <Typography style={{ fontSize: '13px', fontWeight: 500 }}>
                                                    {option.text1}
                                                </Typography>
                                            </Stack>
                                        </Stack>

                                        {option.text2 && (
                                            <Stack
                                                direction={'row'}
                                                spacing={1}
                                                style={{
                                                    fontSize: '13px',
                                                    float: 'right'
                                                }}>
                                                <span style={{ color: '#acaca5' }}>{optionLabel?.label2}</span>
                                                <span> {option.text2}</span>
                                            </Stack>
                                        )}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </li>
                    );
                }}
            />
        </Stack>
    );
}
