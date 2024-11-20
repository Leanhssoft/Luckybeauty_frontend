import {
    Dialog,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    DialogActions
} from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { BangBaoLoiFileimportDto } from '../../services/dto/BangBaoLoiFileimportDto';

export default function BangBaoLoiFileImport({ isOpen, lstError, onClose, clickImport }: any) {
    return (
        <>
            <Dialog open={isOpen} maxWidth="md" fullWidth onClose={onClose}>
                <DialogTitle className="modal-title">
                    Bảng báo lỗi file import
                    <CloseOutlinedIcon
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: '16px',
                            top: '16px',
                            minWidth: 20,
                            '&:hover': {
                                filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                            }
                        }}
                    />
                </DialogTitle>
                <DialogContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ width: '20%' }}>Tên trường dữ liệu</TableCell>
                                    <TableCell align="center" style={{ width: '15%' }}>
                                        Vị trí
                                    </TableCell>
                                    <TableCell style={{ width: '20%' }}>Giá trị</TableCell>
                                    <TableCell>Diễn giải</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {lstError?.map((item: BangBaoLoiFileimportDto, index: number) => (
                                    <>
                                        <TableRow
                                            key={index}
                                            sx={{
                                                height: '40px',
                                                '& .MuiTableCell-root': {
                                                    padding: '5px'
                                                }
                                            }}>
                                            <TableCell>{item.tenTruongDuLieu}</TableCell>
                                            <TableCell align="center">Dòng số {item.rowNumber}</TableCell>
                                            <TableCell>{item.giaTriDuLieu}</TableCell>
                                            <TableCell>{item.dienGiai}</TableCell>
                                        </TableRow>
                                    </>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>
                        Đóng
                    </Button>
                    {/* <Button variant="contained" onClick={clickImport}>
                        Bỏ qua lỗi và tiếp tục
                    </Button> */}
                </DialogActions>
            </Dialog>
        </>
    );
}
