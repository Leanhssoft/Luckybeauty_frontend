import { Menu, MenuItem, Typography } from '@mui/material';
import { Component, ReactNode } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import abpCustom from '../abp-custom';
interface MenuProps {
    selectedRowId: any;
    anchorEl: any;
    closeMenu: () => void;
    handleView: () => void;
    permissionView?: string;
    handleEdit: () => void;
    permissionEdit?: string;
    handleDelete: () => void;
    permissionDelete?: string;
}

class ActionMenuTable extends Component<MenuProps> {
    render(): ReactNode {
        const {
            selectedRowId,
            anchorEl,
            closeMenu,
            handleView,
            handleDelete,
            handleEdit,
            permissionDelete,
            permissionEdit,
            permissionView
        } = this.props;
        return (
            <Menu
                id={`actions-menu-${selectedRowId}`}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={closeMenu}
                sx={{ minWidth: '120px' }}>
                <MenuItem
                    onClick={handleView}
                    hidden={!abpCustom.isGrandPermission(permissionView ?? 'notHavePermission')}>
                    <Typography
                        color="#009EF7"
                        fontSize="12px"
                        variant="button"
                        textTransform="unset"
                        width="64px"
                        fontWeight="400"
                        marginRight="8px">
                        Xem
                    </Typography>
                    <InfoIcon sx={{ color: '#009EF7' }} />
                </MenuItem>
                <MenuItem
                    onClick={handleEdit}
                    hidden={!abpCustom.isGrandPermission(permissionEdit ?? 'notHavePermission')}>
                    <Typography
                        color="#009EF7"
                        fontSize="12px"
                        variant="button"
                        textTransform="unset"
                        width="64px"
                        fontWeight="400"
                        marginRight="8px">
                        Sửa
                    </Typography>
                    <EditIcon sx={{ color: '#009EF7' }} />
                </MenuItem>
                <MenuItem
                    onClick={handleDelete}
                    hidden={!abpCustom.isGrandPermission(permissionDelete ?? 'notHavePermission')}>
                    <Typography
                        color="#F1416C"
                        fontSize="12px"
                        variant="button"
                        textTransform="unset"
                        width="64px"
                        fontWeight="400"
                        marginRight="8px">
                        Xóa
                    </Typography>
                    <DeleteForeverIcon sx={{ color: '#F1416C' }} />
                </MenuItem>
            </Menu>
        );
    }
}
export default ActionMenuTable;
