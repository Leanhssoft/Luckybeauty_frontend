import React from 'react';
import { Box, Menu, MenuItem } from '@mui/material';
interface DialogComponentProps {
    open: boolean;
    handleClose: () => void;
    selectedRowId: any;
    anchorEl: any;
    handleOpenDelete: () => void;
    handleOpenEdit: () => void;
    handleOpenDialog: () => void;
    handleCloseDialog: () => void;
}

const CustomEmployee: React.FC<DialogComponentProps> = ({
    open,
    handleClose,
    selectedRowId,
    anchorEl,
    handleOpenEdit,
    handleOpenDelete,
    handleOpenDialog
}) => {
    return (
        <Menu
            id={`actions-menu-${selectedRowId}`}
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
                '& .MuiMenuItem-root': {
                    color: '#4C4B4C',
                    fontWeight: '400',
                    fontSize: '14px',

                    justifyContent: 'start'
                },
                padding: '9px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
            <Box
                sx={{
                    '& li:hover': {
                        color: 'var(--color-main)'
                    }
                }}>
                <MenuItem onClick={handleOpenDialog}>Thêm ca làm việc thường xuyên</MenuItem>
                <MenuItem onClick={handleOpenEdit}>Chỉnh sửa lịch làm việc</MenuItem>
                <MenuItem onClick={handleOpenDelete}>Xóa lịch làm việc</MenuItem>
            </Box>
        </Menu>
    );
};
export default CustomEmployee;
