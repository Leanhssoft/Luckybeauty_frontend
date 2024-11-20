import { debounce, ListSubheader, Menu, MenuItem, Stack, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { IList } from '../../services/dto/IList';
import { CSSProperties } from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import khachHangService from '../../services/khach-hang/khachHangService';
import { PagedKhachHangResultRequestDto } from '../../services/khach-hang/dto/PagedKhachHangResultRequestDto';
import { TypeSearchfromDB } from '../../enum/TypeSearch_fromDB';

type IPropsMenu = {
    open: boolean;
    typeSearch: number; // 1.customer
    anchorEl: HTMLElement | null;
    handleChoseItem: (item: IList) => void;
    handleClose: () => void;
    style?: CSSProperties;
};

export default function MenuWithDataFromDB({ open, typeSearch, anchorEl, handleChoseItem, handleClose }: IPropsMenu) {
    const [txtSearch, setTxtSearch] = useState<string>('');
    const [lstOption, setLstOption] = useState<IList[]>([]);

    const debounceDropDown = useRef(
        debounce(async (txt: string) => {
            switch (typeSearch) {
                case TypeSearchfromDB.CUSTOMER:
                    {
                        const param = {
                            keyword: txt,
                            skipCount: 0,
                            maxResultCount: 50
                        } as PagedKhachHangResultRequestDto;
                        const data = await khachHangService.jqAutoCustomer(param);
                        const arrCus = data?.map((x) => {
                            return {
                                id: x.id.toString(),
                                text: x.tenKhachHang,
                                text2: x.soDienThoai,
                                icon: x.avatar
                            } as IList;
                        });
                        setLstOption([...arrCus]);
                    }
                    break;
            }
        }, 500)
    ).current;

    useEffect(() => {
        debounceDropDown(txtSearch);
    }, [txtSearch]);

    return (
        <Menu
            id="menu-with-data-from-db"
            anchorEl={anchorEl}
            open={open}
            autoFocus={false} /* !important: disable cái này để focus vào txtSearch */
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button'
            }}>
            <MenuItem
                disableRipple={true} /* !important: vô hiệu hóa gợn sóng khi click */
                sx={{
                    cursor: 'none',
                    '&:hover': {
                        backgroundColor: 'transparent' // Vô hiệu hóa hover
                    },
                    '&.Mui-focusVisible': {
                        backgroundColor: 'transparent' // Vô hiệu hóa focus
                    }
                }}>
                <TextField
                    onKeyDown={(e) => e.stopPropagation()}
                    autoFocus
                    fullWidth
                    size="small"
                    InputProps={{ startAdornment: <SearchIcon /> }}
                    variant="standard"
                    onChange={(e) => setTxtSearch(e.target.value)}
                />
            </MenuItem>

            {lstOption?.map((x, index) => (
                <MenuItem
                    key={index}
                    onClick={() => handleChoseItem(x)}
                    style={{
                        borderBottom: index == (lstOption?.length ?? 0) - 1 ? 'none' : '1px solid #ccc'
                    }}>
                    <Stack spacing={1}>
                        <Typography> {x.text}</Typography>
                        <Typography sx={{ color: '#acaca5', fontSize: '12px' }}> {x.text2}</Typography>
                    </Stack>
                </MenuItem>
            ))}
        </Menu>
    );
}
