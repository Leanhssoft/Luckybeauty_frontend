import { Checkbox, Menu, MenuItem, Stack, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { IList } from '../../services/dto/IList';
import { CSSProperties } from 'styled-components';

type IPropsMenu = {
    open: boolean;
    hasCheckBox?: boolean;
    lstData: IList[];
    anchorEl: HTMLElement | null;
    handleChoseItem?: (item: IList) => void;
    handleClose: () => void;
    style?: CSSProperties;
};
export default function MenuWithDataHasSearch({
    open,
    hasCheckBox,
    lstData,
    anchorEl,
    handleChoseItem,
    handleClose
}: IPropsMenu) {
    return (
        <Menu
            id="menu-with-data-has-search"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button'
            }}>
            <TextField size="small" InputProps={{ startAdornment: <SearchIcon /> }} variant="standard" />
            {lstData?.map((x, index) => (
                <MenuItem
                    key={index}
                    onClick={() => {
                        if (handleChoseItem) handleChoseItem(x);
                    }}>
                    <Stack direction="row" spacing={1} alignItems={'center'}>
                        {hasCheckBox && (
                            <Checkbox
                                sx={{
                                    '&.MuiCheckbox-root': {
                                        paddingLeft: 0
                                    }
                                }}
                            />
                        )}
                        <Typography variant="body1"> {x.text}</Typography>
                    </Stack>
                </MenuItem>
            ))}
        </Menu>
    );
}
