import * as React from 'react';
import { Autocomplete, Grid, TextField, Typography, Box } from '@mui/material';
import { useState, useRef } from 'react';
import { debounce } from '@mui/material/utils';
import utils from '../../utils/utils';
import { Guid } from 'guid-typescript';
import { IDataAutocomplete } from '../../services/dto/IDataAutocomplete';
import { RequestFromToDto } from '../../services/dto/ParamSearchDto';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { LoaiTin, TrangThaiSMS } from '../../lib/appconst';
import khachHangService from '../../services/khach-hang/khachHangService';
import HeThongSMSServices from '../../services/sms/gui_tin_nhan/he_thong_sms_services';
import { PagedKhachHangResultRequestDto } from '../../services/khach-hang/dto/PagedKhachHangResultRequestDto';

export default function AutocompleteMultipleCustomerFromDB({
    paramFilter,
    arrIdChosed,
    handleChoseItem,
    label,
    helperText = '',
    err = false
}: any) {
    const [lstOption, setLstOption] = useState<IDataAutocomplete[]>([]);
    const [lstChosed, setLstChosed] = useState<IDataAutocomplete[]>([]);
    const [textSearch, setTextSearch] = useState('');

    const getInforCustomerFromDB = async () => {
        if (arrIdChosed !== undefined && arrIdChosed != null) {
            const arr: IDataAutocomplete[] = [];
            for (let index = 0; index < arrIdChosed.length; index++) {
                const element = arrIdChosed[index];
                const customer = await khachHangService.getKhachHang(element);
                arr.push({
                    id: customer.id,
                    text1: customer.tenKhachHang,
                    text2: customer.soDienThoai
                } as IDataAutocomplete);
            }
            setLstChosed(arr);
            handleChoseItem(arr);
        } else {
            setLstChosed([]);
        }
    };

    const debounceDropDown = useRef(
        debounce(async (paramFilter, textSearch) => {
            paramFilter.textSearch = textSearch; // txtSearch
            switch (paramFilter?.idLoaiTin) {
                case LoaiTin.TIN_THUONG:
                    {
                        // only search by textsearch
                        const param = {
                            keyword: textSearch,
                            loaiDoiTuong: 1,
                            skipCount: 0,
                            maxResultCount: 50
                        } as PagedKhachHangResultRequestDto;
                        const data = await khachHangService.jqAutoCustomer(param);
                        if (data !== null) {
                            setLstOption(
                                data.map((x: any) => {
                                    return {
                                        id: x.id,
                                        text1: x.tenKhachHang,
                                        text2: x.soDienThoai
                                    };
                                })
                            );
                        }
                    }
                    break;
                case LoaiTin.TIN_SINH_NHAT:
                case LoaiTin.TIN_LICH_HEN:
                case LoaiTin.TIN_GIAO_DICH:
                    {
                        paramFilter.isFilterCustomer = true;
                        paramFilter.trangThais = [TrangThaiSMS.DRAFT, TrangThaiSMS.CHUA_GUI];
                        const data = await HeThongSMSServices.JqAutoCustomer_byIdLoaiTin(
                            paramFilter,
                            paramFilter?.idLoaiTin
                        );
                        if (data !== null) {
                            setLstOption(
                                data?.map((x: any) => {
                                    return {
                                        id: x.idKhachHang,
                                        text1: x.tenKhachHang,
                                        text2: x.soDienThoai
                                    } as IDataAutocomplete;
                                })
                            );
                        }
                    }
                    break;
            }
        }, 500)
    ).current;

    React.useEffect(() => {
        debounceDropDown(paramFilter, textSearch);
    }, [paramFilter?.fromDate, paramFilter?.toDate, paramFilter?.idChiNhanhs, textSearch, paramFilter?.idLoaiTin]);

    React.useEffect(() => {
        getInforCustomerFromDB();
    }, [arrIdChosed]);

    const choseItem = (item: any) => {
        setLstChosed(item);
        handleChoseItem(item);
    };
    const handleInputChange = (newInputValue: any) => {
        setTextSearch(newInputValue);
    };

    return (
        <>
            <Autocomplete
                size="small"
                fullWidth
                disablePortal
                autoComplete
                multiple={true}
                filterSelectedOptions
                value={lstChosed}
                filterOptions={(x) => x}
                onChange={(event: any, newValue: any) => choseItem(newValue)}
                onInputChange={(event, newInputValue) => {
                    handleInputChange(newInputValue);
                }}
                options={lstOption}
                getOptionLabel={(option: IDataAutocomplete) => (option?.text1 ? option.text1 : '')}
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
                                    <Typography style={{ fontSize: '13px' }}>{option?.text1}</Typography>
                                    <Box
                                        component="span"
                                        style={{
                                            fontWeight: 500,
                                            color: '#acaca5',
                                            fontSize: '12px'
                                        }}>
                                        {option?.text2}
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
