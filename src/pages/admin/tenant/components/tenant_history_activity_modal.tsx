import React, { useEffect, useState } from 'react';
import { TenantHistoryActivityDto } from '../../../../services/tenant/dto/tenantHistoryActivityDto';
import CustomTablePagination from '../../../../components/Pagination/CustomTablePagination';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import htmlParse from 'html-react-parser';
import { format as formatDate } from 'date-fns';
import { ReactComponent as CloseIcon } from '../../../../images/close-square.svg';
import { ReactComponent as SearchIcon } from '../../../../images/search-normal.svg';
import tenantService from '../../../../services/tenant/tenantService';
interface IProps {
    visible: boolean;
    onCancel: () => void;
    tenantId: number;
    tenantName: string;
}
const TenantHistoryActivityModal = ({ visible, onCancel, tenantId, tenantName }: IProps) => {
    const [listData, setListData] = useState<TenantHistoryActivityDto[]>([]);
    const [skipCount, setSkipCount] = useState(1);
    const [maxResultCount, setMaxResultCount] = useState(5);
    const [filter, setFilter] = useState('');
    const [totalPage, setTotalPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const getData = async () => {
        const result = await tenantService.getTenantHistoryActivity(
            {
                keyword: filter,
                skipCount: skipCount,
                maxResultCount: maxResultCount,
                sortBy: '',
                sortType: ''
            },
            tenantId
        );
        setListData(result.items);
        setTotalCount(result.totalCount);
        setTotalPage(Math.ceil(result.totalCount / maxResultCount));
    };
    useEffect(() => {
        getData();
        setSelectedRow(null);
    }, [skipCount, maxResultCount, tenantId]);
    const handlePageChange = async (event: any, value: any) => {
        setSkipCount(value);
    };
    const handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        setMaxResultCount(parseInt(event.target.value.toString(), 10));
        setSkipCount(1);
    };
    const handleRowClick = (index: number) => {
        setSelectedRow(index === selectedRow ? null : index); // Nếu dòng được chọn đã được chọn trước đó, hủy chọn
    };
    return (
        <Dialog open={visible} onClose={onCancel} fullWidth maxWidth="sm">
            <DialogTitle
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 24px' }}>
                <Typography fontSize="18px" color="rgb(51, 50, 51)" fontWeight="700">
                    Lịch sử hoạt động Tenant: {tenantName}
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onCancel}
                    sx={{
                        '&:hover svg': {
                            filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                        }
                    }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.5)' }} />
            <DialogContent>
                <TextField
                    fullWidth
                    value={filter}
                    size="small"
                    sx={{ mb: 2, borderColor: '#E6E1E6!important', bgcolor: '#fff' }}
                    placeholder="Tìm kiếm..."
                    InputProps={{
                        startAdornment: (
                            <SearchIcon
                                style={{
                                    marginRight: '8px',
                                    color: 'gray'
                                }}
                                onClick={() => getData()}
                            />
                        )
                    }}
                    onKeyDown={(e) => {
                        if (e.key == 'Enter') {
                            getData();
                        }
                    }}
                    onChange={(event) => {
                        setFilter(event.target.value);
                    }}
                />
                <Table sx={{ mb: 2 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ padding: '16px 8px' }}>Tên nhân viên</TableCell>
                            <TableCell sx={{ padding: '16px 8px' }}>Chức năng</TableCell>
                            <TableCell sx={{ padding: '16px 8px' }}>Thời gian</TableCell>
                            <TableCell sx={{ padding: '16px 8px' }}>Nội dung</TableCell>
                            <TableCell sx={{ padding: '16px 8px' }}>Chi nhánh</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listData.map((item, index) => (
                            <React.Fragment key={index}>
                                <TableRow onClick={() => handleRowClick(index)}>
                                    <TableCell>{item.tenNguoiThaoTac}</TableCell>
                                    <TableCell>{item.chucNang}</TableCell>
                                    <TableCell>{formatDate(new Date(item.creationTime), 'dd/MM/yyyy HH:mm')}</TableCell>
                                    <TableCell>{item.noiDung}</TableCell>
                                    <TableCell>{item.chiNhanh}</TableCell>
                                </TableRow>
                                {selectedRow === index && ( // Hiển thị TableRow phụ nếu dòng được chọn
                                    <TableRow style={{ background: '#e6e6e6' }}>
                                        <TableCell colSpan={4} sx={{ padding: '8px 16px !important' }}>
                                            {htmlParse(item.noiDungChiTiet ?? '')}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
                <CustomTablePagination
                    currentPage={skipCount}
                    rowPerPage={maxResultCount}
                    totalRecord={totalCount}
                    totalPage={totalPage}
                    handlePerPageChange={handlePerPageChange}
                    handlePageChange={handlePageChange}
                />
            </DialogContent>
            <DialogActions style={{ padding: '16px 24px' }}>
                <Button variant="contained" color="error" onClick={onCancel}>
                    Hủy
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TenantHistoryActivityModal;
