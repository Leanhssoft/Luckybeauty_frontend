import { Box, Grid, MenuItem, Pagination, Select, SelectChangeEvent, Typography, FormControl } from '@mui/material';
import { Component, ReactNode } from 'react';
import AppConsts from '../../lib/appconst';

interface TablePaginationProps {
    totalRecord: number;
    totalPage: number;
    currentPage: number;
    handlePageChange: (e: any, page: number) => void;
    handlePerPageChange: (event: SelectChangeEvent<number>) => void;
    rowPerPage: number;
}

class CustomTablePagination extends Component<TablePaginationProps> {
    render(): ReactNode {
        const { totalPage, totalRecord, currentPage, rowPerPage, handlePageChange, handlePerPageChange } = this.props;
        return (
            <Grid container sx={{ display: totalRecord > 0 ? '' : 'none', backgroundColor: '#fff' }} padding="0px 16px">
                <Grid item xs={12} sm={12} md={3}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            height: 48
                        }}>
                        <FormControl variant="standard">
                            <Select sx={{ height: '32px' }} onChange={handlePerPageChange} value={rowPerPage}>
                                {AppConsts.pageOption.map((item: any) => (
                                    <MenuItem key={item.value} value={item.value}>
                                        <Typography variant="body2"> {item.text}</Typography>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={9}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            height: 48
                        }}>
                        <Typography variant="body2">
                            Hiển thị {(currentPage - 1) * rowPerPage + 1} -{' '}
                            {rowPerPage * currentPage > totalRecord ? totalRecord : rowPerPage * currentPage} của{' '}
                            {totalRecord} mục
                        </Typography>
                        <Pagination
                            count={totalPage}
                            page={currentPage}
                            onChange={handlePageChange}
                            sx={{
                                '& button': {
                                    display: 'inline-block',
                                    borderRadius: '4px',
                                    lineHeight: '1'
                                },
                                '& .Mui-selected': {
                                    backgroundColor: 'var(--color-main)!important',
                                    color: '#fff'
                                }
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
        );
    }
}
export default CustomTablePagination;
