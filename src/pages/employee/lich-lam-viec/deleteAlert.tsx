import React, { useState } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { Dialog, Button, Typography, MenuItem, Select, Box, SelectChangeEvent } from '@mui/material';
import viLocale from 'date-fns/locale/vi';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import { ReactComponent as ArrowDown } from '../../../images/arow-down.svg';
interface DialogComponentProps {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
}
const Delete: React.FC<DialogComponentProps> = ({ open, onClose, onDelete }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <Box
                sx={{
                    width: '100vw',
                    maxWidth: '448px',
                    '& button': {
                        textTransform: 'unset!important',
                        fontSize: '14px',
                        minWidth: 'unset',
                        bgcolor: '#fff'
                    },
                    padding: '28px 24px'
                }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography
                        fontSize="24px"
                        //color="#4C4B4C"
                        fontWeight="700"
                        variant="h2">
                        Xóa tất cả ca làm việc
                    </Typography>
                    <Button
                        sx={{
                            bgcolor: 'transparent!important',
                            minWidth: 'unset',
                            '&:hover svg': {
                                filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                            }
                        }}
                        onClick={onClose}>
                        <CloseIcon />
                    </Button>
                </Box>
                <Box display="flex" justifyContent="end" mt={3}>
                    Bạn có chắc muốn xóa lịch làm việc của ca này không?
                </Box>
                <Box display="flex" justifyContent="end" gap="8px" mt="24px">
                    <Button
                        onClick={onDelete}
                        variant="contained"
                        sx={{ bgcolor: 'var(--color-main)!important' }}
                        className="btn-container-hover">
                        Xoá
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{ color: 'var(--color-main)!important' }}
                        className="btn-outline-hover">
                        Hủy
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};
export default Delete;
