import React from 'react';
import { Box, Dialog, Typography, Button } from '@mui/material';
import { ReactComponent as WarningIcon } from '../../../images/warning.svg';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
interface DialogComponentProps {
    open: boolean;
    onClose: () => void;
    onOK: () => void;
}

const ModalWarning: React.FC<DialogComponentProps> = ({ open, onClose, onOK }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <Box
                sx={{
                    borderRadius: '12px',
                    bgcolor: '#fff',
                    maxWidth: '500px',
                    padding: '24px',
                    position: 'relative'
                }}>
                <Button
                    onClick={onClose}
                    sx={{
                        padding: '0',
                        position: 'absolute',
                        right: '16px',
                        top: '16px',
                        minWidth: 'unset'
                    }}>
                    <CloseIcon />
                </Button>
                <Typography variant="h3" color="#333233" fontWeight="700" fontSize="24px">
                    Hủy hóa đơn ?
                </Typography>
                <Typography variant="body1" fontSize="14px" color="#666466" marginY="24px">
                    Bạn có chắc chắn hủy hóa đơn này không? Sau khi Hủy, thông tin hóa đơn của bạn sẽ bị xóa vĩnh viễn.
                    Bạn không thể khôi phục lại .
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        borderLeft: '6px solid #FF9900',
                        padding: '24px',
                        bgcolor: '#FFF8DD',
                        borderTopLeftRadius: '8px',
                        borderBottomLeftRadius: '8px'
                    }}>
                    <Box pr="24px">
                        <WarningIcon width="31px" height="31px" />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontSize="16px" fontWeight="700" color="#9D5425">
                            Cuộc hẹn sẽ bị hủy
                        </Typography>
                        <Typography variant="body1" fontSize="16px" color="#D0915C" mt="8px">
                            Trong trường hợp có hẹn, cuộc hẹn sẽ bị đánh dấu là{' '}
                            <span style={{ color: '#F1416C' }}>Hủy</span>
                        </Typography>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        borderLeft: '6px solid #FF9900',
                        padding: '24px',
                        bgcolor: '#FFF8DD',
                        borderTopLeftRadius: '8px',
                        borderBottomLeftRadius: '8px',
                        mt: '24px'
                    }}>
                    <Box pr="24px">
                        <WarningIcon width="31px" height="31px" />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontSize="16px" fontWeight="700" color="#9D5425">
                            Hoàn tác các dữ liệu liên quan
                        </Typography>
                        <Typography variant="body1" fontSize="16px" color="#D0915C" mt="8px">
                            Tất cả dịch vụ, gói, sản phẩm, thẻ quà tặng, tư cách thành viên, hàng tồn kho sẽ được cập
                            nhật lại và tất cả các giao dịch sẽ bị hoàn tác.
                        </Typography>
                    </Box>
                </Box>
                <Box display="flex" gap="8px" marginTop="40px" justifyContent="end">
                    <Button
                        onClick={onOK}
                        variant="contained"
                        sx={{
                            bgcolor: '#F1416C',
                            '&:hover': {
                                bgcolor: 'red'
                            }
                        }}>
                        Đồng ý
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{ borderColor: '#E6E1E6', color: '#666466!important' }}
                        className="btn-outline-hover">
                        Huỷ
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};
export default ModalWarning;
