import {
    Grid,
    SelectChangeEvent,
    TableBody,
    TableCell,
    TableContainer,
    Stack,
    TableHead,
    TableRow,
    Table
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import baoCaoService from '../../../../services/bao_cao/bao_cao_ban_hang/baoCaoService';
import { BaoCaoBanHangTongHopDto } from '../../../../services/bao_cao/bao_cao_ban_hang/dto/BaoCaoBanHangTongHopDto';
import CustomTablePagination from '../../../../components/Pagination/CustomTablePagination';
import { BaoCaoBanHangDatataFilterContext } from '../../../../services/bao_cao/bao_cao_ban_hang/dto/BaoCaoDataContext';
import { PagedResultDto } from '../../../../services/dto/pagedResultDto';
import { LoaiBaoCao } from '../../../../lib/appconst';
import { IHeaderTable, MyHeaderTable } from '../../../../components/Table/MyHeaderTable';

export default function BaoCaoBanHangTongHop({ onChangePage, onChangePageSize }: any) {
    const dataFilterContext = useContext(BaoCaoBanHangDatataFilterContext);

    const [columSort, setColumSort] = useState('tenNhomHang');
    const [typeSort, setTypeSort] = useState('asc');
    const [pageDataBaoCaoBanHangTongHop, setPageDataBaoCaoBanHangTongHop] = useState<
        PagedResultDto<BaoCaoBanHangTongHopDto>
    >({
        items: [],
        totalCount: 0,
        totalPage: 0
    });

    useEffect(() => {
        if (dataFilterContext.loaiBaoCao === LoaiBaoCao.TONG_HOP) {
            GetBaoCaoBanHangTongHop();
        }
    }, [
        dataFilterContext?.countClick,
        dataFilterContext?.filter?.currentPage,
        dataFilterContext?.filter?.pageSize,
        dataFilterContext?.filter?.fromDate,
        dataFilterContext?.filter?.toDate,
        dataFilterContext?.filter?.idChiNhanhs,
        dataFilterContext?.filter?.idNhomHangHoa,
        columSort,
        typeSort
    ]);

    const GetBaoCaoBanHangTongHop = async () => {
        const prSearch = { ...dataFilterContext.filter };
        prSearch.columnSort = columSort;
        prSearch.typeSort = typeSort;
        const data = await baoCaoService.getBaoCaoBanHangTongHop(prSearch);
        setPageDataBaoCaoBanHangTongHop({
            ...pageDataBaoCaoBanHangTongHop,
            items: data?.items,
            totalCount: data?.totalCount,
            totalPage: Math.ceil(data?.totalCount / (dataFilterContext?.filter?.pageSize ?? 10))
        });
    };
    const handlePageChange = async (event: any, value: number) => {
        onChangePage(value);
    };
    const changePageSize = async (event: SelectChangeEvent<number>) => {
        const pageSizeNew = parseInt(event.target.value.toString());
        onChangePageSize(pageSizeNew);
    };

    const onSortTable = (columnSort: string) => {
        setColumSort(columnSort);
        setTypeSort(typeSort == '' ? 'asc' : typeSort == 'desc' ? 'asc' : 'desc');
    };

    const listColumnHeader: IHeaderTable[] = [
        { columnId: 'tenNhomHang', columnText: 'Tên nhóm DV' },
        { columnId: 'maHangHoa', columnText: 'Mã dịch vụ' },
        { columnId: 'tenHangHoa', columnText: 'Tên dịch vụ' },
        { columnId: 'soLuong', columnText: 'Số lượng', align: 'center' },
        { columnId: 'thanhTienTruocCK', columnText: 'Thành tiền (trước CK)', align: 'right' },
        { columnId: 'chietKhau', columnText: 'Chiết khấu', align: 'right' },
        { columnId: 'doanhThu', columnText: 'Doanh thu', align: 'right' }
    ];
    return (
        <>
            <Grid container>
                <Grid item xs={12}>
                    <Stack className="page-box-right">
                        <TableContainer className="data-grid-row">
                            <Table>
                                <TableHead>
                                    <MyHeaderTable
                                        showAction={false}
                                        isShowCheck={false}
                                        isCheckAll={false}
                                        sortBy={columSort}
                                        sortType={typeSort}
                                        onRequestSort={onSortTable}
                                        // onSelectAllClick={onClickCheckAll}
                                        listColumnHeader={listColumnHeader}
                                    />
                                </TableHead>
                                <TableBody>
                                    {pageDataBaoCaoBanHangTongHop?.totalCount > 0 ? (
                                        <TableRow
                                            sx={{
                                                backgroundColor: 'var(--color-bg)',
                                                fontStyle: 'bold',
                                                '& td': {
                                                    fontWeight: 600
                                                }
                                            }}>
                                            <TableCell colSpan={3}>Tổng cộng</TableCell>
                                            <TableCell align="center">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    pageDataBaoCaoBanHangTongHop?.items[0]?.sumSoLuong ?? 0
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    pageDataBaoCaoBanHangTongHop?.items[0]?.sumThanhTienTruocCK ?? 0
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    pageDataBaoCaoBanHangTongHop?.items[0]?.sumTienChietKhau ?? 0
                                                )}
                                            </TableCell>

                                            <TableCell align="right">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    pageDataBaoCaoBanHangTongHop?.items[0]?.sumThanhTienSauCK ?? 0
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        <TableRow className="table-empty">
                                            <TableCell colSpan={20} align="center">
                                                Báo cáo không có dữ liệu
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {pageDataBaoCaoBanHangTongHop?.items?.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="lableOverflow" sx={{ maxWidth: 150 }}>
                                                {row?.tenNhomHang}
                                            </TableCell>
                                            <TableCell sx={{ maxWidth: 150 }} title={row?.maHangHoa}>
                                                {row?.maHangHoa}
                                            </TableCell>
                                            <TableCell
                                                title={row?.tenHangHoa}
                                                className="lableOverflow"
                                                sx={{ maxWidth: 150 }}>
                                                {row?.tenHangHoa}
                                            </TableCell>
                                            <TableCell align="center" className="table-cell-border">
                                                {new Intl.NumberFormat('vi-VN').format(row?.soLuong ?? 0)}
                                            </TableCell>
                                            <TableCell align="right" className="table-cell-border">
                                                {new Intl.NumberFormat('vi-VN').format(row?.thanhTienTruocCK ?? 0)}
                                            </TableCell>
                                            <TableCell align="right" className="table-cell-border">
                                                {new Intl.NumberFormat('vi-VN').format(row?.tienChietKhau ?? 0)}
                                            </TableCell>
                                            <TableCell align="right" className="table-cell-border">
                                                {new Intl.NumberFormat('vi-VN').format(row?.thanhTienSauCK ?? 0)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <CustomTablePagination
                            currentPage={dataFilterContext?.filter?.currentPage ?? 1}
                            rowPerPage={dataFilterContext?.filter?.pageSize ?? 10}
                            totalPage={pageDataBaoCaoBanHangTongHop?.totalPage}
                            totalRecord={pageDataBaoCaoBanHangTongHop?.totalCount}
                            handlePerPageChange={changePageSize}
                            handlePageChange={handlePageChange}
                        />
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}
