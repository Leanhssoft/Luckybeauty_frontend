import * as React from 'react';
import { useState } from 'react';
import { Autocomplete, Button, Grid, TextField, Typography, Box, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { TaiKhoanNganHangDto } from '../../services/so_quy/Dto/TaiKhoanNganHangDto';

export default function AutocompleteAccountBank({
    handleChoseItem,
    idChosed,
    listOption = [],
    handleClickBtnAdd,
    roleAdd = false
}: any) {
    const [itemChosed, setItemChosed] = useState<TaiKhoanNganHangDto | null>(null);
    React.useEffect(() => {
        const item = listOption?.filter((x: TaiKhoanNganHangDto) => x.id == idChosed);
        if (item.length > 0) {
            setItemChosed(item[0]);
        } else {
            setItemChosed(null);
        }
    }, [idChosed]);

    const choseItem = (item: TaiKhoanNganHangDto) => {
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
                onChange={(event, newValue) => choseItem(newValue)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={[{ id: '', soTaiKhoan: '' } as TaiKhoanNganHangDto, ...listOption]}
                getOptionLabel={(option) =>
                    option.tenChuThe ? option.tenRutGon.concat(` - `, option.soTaiKhoan, ` - `, option.tenChuThe) : ''
                }
                renderInput={(params) => <TextField {...params} label="Chọn tài khoản" />}
                renderOption={(props, option) => {
                    return (
                        <li {...props} key={option.id == '' ? 0 : option.id}>
                            {option.id == '' && roleAdd && (
                                <Button
                                    key={0}
                                    sx={{
                                        color: 'var(--color-main)'
                                    }}
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    fullWidth
                                    onClick={handleClickBtnAdd}>
                                    Thêm mới
                                </Button>
                            )}
                            {option.id != '' && (
                                <Stack direction={'row'} spacing={2} key={option?.id}>
                                    <Stack
                                        sx={{
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            width: 135,
                                            height: 50
                                        }}
                                        alignItems={'center'}>
                                        <img src={option?.logoNganHang} style={{ width: 135, height: 50 }} />
                                    </Stack>
                                    <Stack alignItems={'center'}>
                                        <Typography style={{ fontSize: '14px', fontWeight: 500 }}>
                                            {option.tenChuThe.toString().concat(` (`, `${option.soTaiKhoan}`, `)`)}
                                        </Typography>
                                        <Box
                                            component="span"
                                            style={{
                                                fontWeight: 500,
                                                color: '#acaca5',
                                                fontSize: '12px'
                                            }}>
                                            {option.tenNganHang.toString().concat(` ${option.maNganHang}`)}
                                        </Box>
                                    </Stack>
                                </Stack>
                            )}
                        </li>
                    );
                }}
            />
        </>
    );
}
