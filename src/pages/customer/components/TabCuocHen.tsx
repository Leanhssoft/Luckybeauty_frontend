import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, SelectChangeEvent } from '@mui/material';
import { TextTranslate } from '../../../components/TableLanguage';
import { observer } from 'mobx-react';
import khachHangStore from '../../../stores/khachHangStore';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { format as formatDate } from 'date-fns';
const TabCuocHen = ({ khachHangId }: any) => {
    // const { khachHangId } = useParams();
    const [curentPage, setCurrentPage] = useState<number>(1);
    const [maxResultCount, setMaxResultCount] = useState<number>(10);
    const [sortBy, setSortBy] = useState('creationTime');
    const [sortType, setSortType] = useState('desc');
    useEffect(() => {
        getLichSuDatLich();
    }, [curentPage, maxResultCount, sortBy, sortType]);
    const getLichSuDatLich = async () => {
        await khachHangStore.getLichSuDatLich(khachHangId, {
            keyword: '',
            maxResultCount: maxResultCount,
            skipCount: curentPage,
            sortBy: sortBy,
            sortType: sortType
        });
    };
    const handlePageChange = async (event: any, newPage: number) => {
        setCurrentPage(newPage);
    };
    const handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        setCurrentPage(1);
        setMaxResultCount(parseInt(event.target.value.toString(), 10));
    };
    const onSort = async (sortType: string, sortBy: string) => {
        setSortType(sortType);
        setSortBy(sortBy);
    };
    const columns = [
        {
            field: 'bookingDate',
            headerName: 'Ngày hẹn',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box title={params.value}>{formatDate(new Date(params.value), 'dd/MM/yyyy')}</Box>
        },
        {
            field: 'thoiGianHen',
            headerName: 'Thời gian hẹn',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'tenHangHoa',
            headerName: 'Dịch vụ',
            flex: 2,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Box title={params.value} sx={{ textOverflow: 'ellipsis', overflow: 'hidden', width: '100%' }}>
                    {params.value}
                </Box>
            )
        },
        // {
        //     field: 'giaBan',
        //     headerName: 'Đơn giá',
        //     flex: 0.5,
        //     headerAlign: 'right',
        //     align: 'right',
        //     renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
        //     renderCell: (params) => (
        //         <Box title={params.value}>{new Intl.NumberFormat('vi-VN').format(params.value)}</Box>
        //     )
        // },
        {
            field: 'nvBook',
            headerName: 'Nhân viên',
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        },
        // {
        //     field: 'nvThucHiens',
        //     headerName: 'Nhân viên TH',
        //     flex: 1,
        //     renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
        //     renderCell: (params) => <Box title={params.value}>{utils.Remove_LastComma(params.value)}</Box>
        // },
        {
            field: 'txtTrangThai',
            headerName: 'Trạng thái',
            flex: 0.8,
            headerAlign: 'center',
            align: 'center',
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Box
                    color={
                        params.row.trangThai == 1
                            ? '#FF9900'
                            : params.row.trangThai == 2
                            ? '#7DC1FF'
                            : params.row.trangThai == 3
                            ? '#009EF7'
                            : params.row.trangThai == 4
                            ? '#50CD89'
                            : '#F1416C'
                    }>
                    {params.value}
                </Box>
            )
        }
    ] as GridColDef[];
    return (
        <>
            <Box mt="24px" className="page-box-right">
                <DataGrid
                    disableRowSelectionOnClick
                    hideFooter
                    autoHeight
                    className="data-grid-row-full"
                    columns={columns}
                    rows={khachHangStore.lichSuDatLich === undefined ? [] : khachHangStore.lichSuDatLich.items}
                    getRowId={(row) => row.bookingDate}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 }
                        }
                    }}
                    pageSizeOptions={[5, 10, 20, 50, 100]}
                    localeText={TextTranslate}
                    sortingOrder={['desc', 'asc']}
                    // sortModel={[
                    //     {
                    //         field: sortBy,
                    //         sort: sortType == 'desc' ? 'desc' : 'asc'
                    //     }
                    // ]}
                    onSortModelChange={(newSortModel) => {
                        if (newSortModel.length > 0) {
                            onSort(newSortModel[0].sort?.toString() ?? 'creationTime', newSortModel[0].field ?? 'desc');
                        }
                    }}
                />
            </Box>
            <CustomTablePagination
                currentPage={curentPage}
                rowPerPage={maxResultCount}
                totalRecord={khachHangStore.lichSuDatLich === undefined ? 0 : khachHangStore.lichSuDatLich.totalCount}
                totalPage={
                    khachHangStore.lichSuDatLich === undefined
                        ? 0
                        : Math.ceil(khachHangStore.lichSuDatLich.totalCount / maxResultCount)
                }
                handlePerPageChange={handlePerPageChange}
                handlePageChange={handlePageChange}
            />
        </>
    );
};
export default observer(TabCuocHen);
