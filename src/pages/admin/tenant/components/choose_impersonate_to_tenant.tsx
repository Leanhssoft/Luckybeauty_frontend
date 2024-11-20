import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    IconButton,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Divider,
    SelectChangeEvent,
    TextField
} from '@mui/material';
import { ReactComponent as CloseIcon } from '../../../../images/close-square.svg';
import { ReactComponent as ArrowSquareRightIcon } from '../../../../images/arrow-square-right.svg';
import React, { FC, useEffect, useState } from 'react';
import { INameValue } from '../../../../lib/abp';
import http from '../../../../services/httpService';
import CustomTablePagination from '../../../../components/Pagination/CustomTablePagination';
import { ReactComponent as SearchIcon } from '../../../../images/search-normal.svg';
import impersonationService from '../../../../services/impersonation/impersonationService';
interface IProps {
    visible: boolean;
    onCancel: () => void;
    tenantId: number;
}
const ChooseImpersonateToTenant: FC<IProps> = ({ visible, tenantId, onCancel }) => {
    const [listUser, setListUser] = useState<INameValue[]>([]);
    const [skipCount, setSkipCount] = useState(1);
    const [maxResultCount, setMaxResultCount] = useState(5);
    const [filter, setFilter] = useState('');
    const [totalPage, setTotalPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const getData = () => {
        http.post('api/services/app/CommonLookup/FindUsers', {
            tenantId: tenantId || 1,
            skipCount: skipCount,
            maxResultCount: maxResultCount,
            keyword: filter,
            excludeCurrentUser: false
        })
            .then((response) => {
                setListUser(response.data.result.items);
                setTotalCount(response.data.result.totalCount);
                setTotalPage(Math.ceil(response.data.result.totalCount / maxResultCount));
            })
            .catch((ex) => {
                setListUser([]);
            });
    };
    useEffect(() => {
        getData();
    }, [tenantId, skipCount, maxResultCount]);
    const handlePageChange = async (event: any, value: any) => {
        setSkipCount(value);
    };
    const handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        setMaxResultCount(parseInt(event.target.value.toString(), 10));
        setSkipCount(1);
    };
    return (
        <Dialog open={visible} onClose={onCancel} fullWidth maxWidth="sm">
            <DialogTitle
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 24px' }}>
                <Typography fontSize="18px" color="rgb(51, 50, 51)" fontWeight="700">
                    Chọn người dùng
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
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ padding: '16px 8px' }}>Lựa chọn</TableCell>
                            <TableCell sx={{ padding: '16px 8px' }}>Tài khoản</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listUser.map((item, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <IconButton>
                                            <ArrowSquareRightIcon
                                                onClick={async () => {
                                                    impersonationService.impersonate(item.value, tenantId);
                                                }}
                                            />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'start' }}>{item.name}</TableCell>
                                </TableRow>
                            );
                        })}
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

export default ChooseImpersonateToTenant;
