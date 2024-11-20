import * as React from 'react';
import { Autocomplete, Grid, TextField, Typography, Box, Stack } from '@mui/material';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import { useState, useRef } from 'react';
import { debounce } from '@mui/material/utils';
import ProductService from '../../services/product/ProductService';
import { ModelHangHoaDto, PagedProductSearchDto } from '../../services/product/dto';

export default function AutocompleteProduct({ handleChoseItem, productChosed }: any) {
    const [listProduct, setlistProduct] = useState<ModelHangHoaDto[]>([]);
    const [paramSearch, setParamSearch] = useState<PagedProductSearchDto>({
        idNhomHangHoas: [],
        textSearch: '',
        currentPage: 0,
        pageSize: 1000,
        columnSort: '',
        typeSort: ''
    });

    const debounceDropDown = useRef(
        debounce(async (paramSearch: any) => {
            const data = await ProductService.Get_DMHangHoa(paramSearch);
            setlistProduct(data.items);
        }, 500)
    ).current;

    React.useEffect(() => {
        debounceDropDown(paramSearch);
    }, [paramSearch.textSearch]);

    const choseItem = (item: any) => {
        handleChoseItem(item);
    };
    const handleInputChange = (newInputValue: any) => {
        setParamSearch({ ...paramSearch, textSearch: newInputValue });
    };

    return (
        <>
            <Autocomplete
                size="small"
                fullWidth
                disablePortal
                autoComplete
                multiple={false}
                value={productChosed}
                onChange={(event: any, newValue: any) => choseItem(newValue)}
                onInputChange={(event, newInputValue) => {
                    handleInputChange(newInputValue);
                }}
                filterOptions={(x) => x}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={listProduct}
                getOptionLabel={(option: any) => (option.tenHangHoa ? option.tenHangHoa : '')}
                renderInput={(params) => <TextField {...params} label="Tìm kiếm" />}
                renderOption={(props, option) => {
                    return (
                        <li {...props}>
                            <Grid container alignItems="center">
                                <Grid item sx={{ display: 'flex', width: 44 }}>
                                    <CenterFocusWeakIcon sx={{ color: 'text.secondary' }} />
                                </Grid>
                                <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                                    <Typography style={{ fontSize: '14px' }}>{option.tenHangHoa}</Typography>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        style={{
                                            fontWeight: 500,
                                            color: '#acaca5',
                                            fontSize: '12px'
                                        }}>
                                        <span>{option.maHangHoa}</span>
                                        <span></span>
                                        <span>{new Intl.NumberFormat('vi-VN').format(option.giaBan as number)}</span>
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
