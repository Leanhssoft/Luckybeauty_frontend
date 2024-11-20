import * as React from 'react';
import { Autocomplete, Grid, TextField, Typography, Box, Stack } from '@mui/material';
import { useState, useRef } from 'react';
import { debounce } from '@mui/material/utils';
import utils from '../../utils/utils';
import { Guid } from 'guid-typescript';
import { IDataAutocomplete } from '../../services/dto/IDataAutocomplete';
import { PagedRequestDto } from '../../services/dto/pagedRequestDto';
import BrandnameService from '../../services/sms/brandname/BrandnameService';
import tenantService from '../../services/tenant/tenantService';

export default function AutocompleteFromDB({
    type,
    idChosed,
    handleChoseItem,
    label, // label at textsearch
    helperText = '',
    err = false,
    optionLabel = { label1: '', label2: '' }
}: any) {
    const [lstOption, setLstOption] = useState<IDataAutocomplete[]>([]);
    const [itemChosed, setItemChosed] = useState<IDataAutocomplete | null>(null);
    const [paramSearch, setParamSearch] = useState<PagedRequestDto>({
        keyword: '',
        maxResultCount: 50,
        skipCount: 0,
        sortBy: '',
        sortType: ''
    });

    const getInforDatafromDB = async () => {
        if (!utils.checkNull(idChosed) && idChosed !== Guid.EMPTY) {
            switch (type) {
                case 'tenant':
                    {
                        console.log('idChosed');
                        if (idChosed !== 0) {
                            const data = await tenantService.get(idChosed);
                            if (data !== null) {
                                setItemChosed({
                                    ...itemChosed,
                                    id: data.id.toString(),
                                    text1: data.name,
                                    text2: data.tenancyName
                                });
                            }
                        } else {
                            setItemChosed(null);
                        }
                    }
                    break;
                case 'brandname':
                    {
                        const data = await BrandnameService.GetInforBrandnamebyID(idChosed);
                        if (data !== null) {
                            setItemChosed({
                                ...itemChosed,
                                id: data.id,
                                text1: data.brandname,
                                text2: data.tenancyName
                            });
                        }
                    }
                    break;
            }
        } else {
            setItemChosed(() => null);
        }
    };

    const debounceDropDown = useRef(
        debounce(async (paramSearch: any) => {
            switch (type) {
                case 'tenant':
                    {
                        const data = await tenantService.getAll(paramSearch);
                        if (data !== null) {
                            const dataMap = data.items
                                // .filter((x: any) => x.tenancyName !== 'Default')
                                .map((xx: any) => {
                                    return {
                                        id: xx.id,
                                        text1: xx.name,
                                        text2: xx.tenancyName
                                    };
                                });
                            setLstOption(dataMap);
                        }
                    }
                    break;
                case 'brandname':
                    {
                        paramSearch.trangThais = [1];
                        const data = await BrandnameService.GetListBandname(paramSearch);
                        if (data !== null) {
                            const dataMap = data.items.map((xx: any) => {
                                return {
                                    id: xx.id,
                                    text1: xx.brandname,
                                    text2: xx.tenancyName
                                };
                            });
                            setLstOption(dataMap);
                        }
                    }
                    break;
            }
        }, 500)
    ).current;

    React.useEffect(() => {
        debounceDropDown(paramSearch);
    }, [paramSearch.keyword]);

    React.useEffect(() => {
        getInforDatafromDB();
    }, [idChosed]);

    const choseItem = (item: any) => {
        handleChoseItem(item);
    };
    const handleInputChange = (newInputValue: any) => {
        setParamSearch({ ...paramSearch, keyword: newInputValue });
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
                onChange={(event: any, newValue: IDataAutocomplete | null) => choseItem(newValue)}
                onInputChange={(event, newInputValue) => {
                    handleInputChange(newInputValue);
                }}
                filterOptions={(x) => x}
                options={lstOption}
                getOptionLabel={(option: any) => (option.text1 ? option.text1 : '')}
                renderInput={(params) => (
                    <TextField {...params} label={label ?? 'Tìm kiếm'} helperText={helperText} error={err} />
                )}
                renderOption={(props, option) => {
                    return (
                        <li
                            {...props}
                            key={option.id}
                            style={{
                                borderBottom: '1px dashed var(--border-color)'
                            }}>
                            <Grid container alignItems="center">
                                <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                                    <Stack direction={'row'} spacing={0.5}>
                                        <Typography style={{ fontSize: '12px' }} color={'#acaca5'}>
                                            {optionLabel?.label1}
                                        </Typography>
                                        <Typography style={{ fontSize: '13px' }}>{option.text1}</Typography>
                                    </Stack>
                                    <Stack
                                        direction={'row'}
                                        spacing={0.5}
                                        style={{
                                            fontWeight: 500,
                                            color: '#acaca5',
                                            fontSize: '12px'
                                        }}>
                                        <span>{optionLabel?.label2}</span>
                                        <span> {option.text2}</span>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </li>
                    );
                }}
            />
        </>
    );
}
