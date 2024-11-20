import * as React from 'react';
import { Autocomplete, Grid, TextField, Typography, Box, Avatar, InputAdornment, Stack } from '@mui/material';
import { useState, useRef } from 'react';
import { debounce } from '@mui/material/utils';
import khachHangService from '../../services/khach-hang/khachHangService';
import { PagedKhachHangResultRequestDto } from '../../services/khach-hang/dto/PagedKhachHangResultRequestDto';
import { CreateOrEditKhachHangDto } from '../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import utils from '../../utils/utils';
import { Guid } from 'guid-typescript';
import BadgeFistCharOfName from '../Badge/FistCharOfName';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { CSSProperties } from 'styled-components';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';

export type IPropAutoComplete = {
    idChosed: string;
    handleChoseItem: (item: any) => void;
    helperText?: string;
    error?: boolean;
    style?: CSSProperties;
};

export default function AutocompleteCustomer(props: IPropAutoComplete) {
    const { idChosed, handleChoseItem, helperText, error, ...other } = props;
    const [listCustomer, setListCustomer] = useState<KhachHangItemDto[]>([]);
    const [cusChosed, setCusChosed] = useState<KhachHangItemDto | null>(null);
    const [paramSearch, setParamSearch] = useState<PagedKhachHangResultRequestDto>({
        keyword: '',
        loaiDoiTuong: 1,
        maxResultCount: 50,
        skipCount: 0,
        sortBy: '',
        sortType: ''
    });

    const getInforCustomerbyID = async () => {
        if (!utils.checkNull(idChosed) && idChosed !== Guid.EMPTY) {
            const data = await khachHangService.getKhachHang(idChosed);
            const cusItem: KhachHangItemDto = {
                id: Guid.parse(data?.id),
                maKhachHang: data?.maKhachHang,
                tenKhachHang: data?.tenKhachHang,
                soDienThoai: data?.soDienThoai,
                avatar: data?.avatar ?? '',
                diaChi: data?.diaChi ?? '',
                tongTichDiem: data?.tongTichDiem ?? 0,
                cuocHenGanNhat: new Date()
            };
            setCusChosed(cusItem);
        } else {
            setCusChosed(() => null);
        }
    };

    const debounceDropDown = useRef(
        debounce(async (paramSearch: any) => {
            const data = await khachHangService.jqAutoCustomer(paramSearch);
            setListCustomer(data);
        }, 500)
    ).current;

    React.useEffect(() => {
        debounceDropDown(paramSearch);
    }, [paramSearch.keyword]);

    React.useEffect(() => {
        getInforCustomerbyID();
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
                value={cusChosed}
                onChange={(event: any, newValue: KhachHangItemDto | null) => choseItem(newValue)}
                onInputChange={(event, newInputValue) => {
                    handleInputChange(newInputValue);
                }}
                filterOptions={(x) => x}
                //isOptionEqualToValue={(option, value) => option.id === value.id}// bi douple 2 dong neu them dong nay
                options={listCustomer}
                getOptionLabel={(option) => (option.tenKhachHang ? option.tenKhachHang : '')}
                renderInput={(params) => (
                    <TextField autoFocus {...params} label="Tìm kiếm" helperText={helperText} error={error} />
                )}
                renderOption={(props, option) => {
                    return (
                        <li
                            {...props}
                            key={option.id.toString()}
                            style={{
                                borderBottom: '1px dashed var(--border-color)'
                            }}>
                            <Grid container alignItems="center">
                                <Grid item sx={{ display: 'flex', width: 44 }}>
                                    {option?.avatar ? (
                                        <Avatar src={option?.avatar} sx={{ width: 24, height: 24 }} />
                                    ) : (
                                        <BadgeFistCharOfName
                                            firstChar={utils.getFirstLetter(option?.tenKhachHang ?? '')}
                                        />
                                    )}
                                </Grid>
                                <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                                    <Typography style={{ fontSize: '13px' }}>{option.tenKhachHang}</Typography>
                                    <Box
                                        component="span"
                                        style={{
                                            fontWeight: 500,
                                            color: '#acaca5',
                                            fontSize: '12px'
                                        }}>
                                        {option.soDienThoai}
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
