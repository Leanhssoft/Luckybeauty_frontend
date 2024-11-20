import * as React from 'react';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { Info, Edit, DeleteForever, MoreHoriz } from '@mui/icons-material';
import { IList } from '../../services/dto/IList';

export default function ActionViewEditDelete({ handleAction, lstOption }: any) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClickAction = (type: number) => {
        setAnchorEl(null);
        handleAction(type);
    };

    return (
        <div>
            <IconButton
                id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}>
                <MoreHoriz />
            </IconButton>

            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}>
                {lstOption && lstOption.length > 0 ? (
                    <div>
                        {lstOption?.map((item: IList, index: number) => (
                            <MenuItem
                                onClick={() => handleClickAction(parseInt(item.id))}
                                key={index}
                                sx={{
                                    display: item?.isShow ? 'flex' : 'none',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                <Typography
                                    color={item?.color}
                                    fontSize="12px"
                                    variant="button"
                                    textTransform="unset"
                                    width="100%"
                                    fontWeight="400"
                                    marginRight="8px">
                                    {item.text}
                                </Typography>
                                {item.icon}
                            </MenuItem>
                        ))}
                    </div>
                ) : (
                    <div>
                        <MenuItem
                            onClick={() => handleClickAction(0)}
                            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography
                                color="#009EF7"
                                fontSize="12px"
                                variant="button"
                                textTransform="unset"
                                width="100%"
                                fontWeight="400"
                                marginRight="8px">
                                Xem
                            </Typography>
                            <Info sx={{ color: '#009EF7' }} />
                        </MenuItem>
                        <MenuItem
                            onClick={() => handleClickAction(1)}
                            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography
                                color="#009EF7"
                                fontSize="12px"
                                variant="button"
                                textTransform="unset"
                                width="100%"
                                fontWeight="400"
                                marginRight="8px">
                                Sửa
                            </Typography>
                            <Edit sx={{ color: '#009EF7' }} />
                        </MenuItem>
                        <MenuItem
                            onClick={() => handleClickAction(2)}
                            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography
                                color="#F1416C"
                                fontSize="12px"
                                variant="button"
                                textTransform="unset"
                                width="100%"
                                fontWeight="400"
                                marginRight="8px">
                                Xóa
                            </Typography>
                            <DeleteForever sx={{ color: '#F1416C' }} />
                        </MenuItem>
                    </div>
                )}
            </Menu>
        </div>
    );
}
