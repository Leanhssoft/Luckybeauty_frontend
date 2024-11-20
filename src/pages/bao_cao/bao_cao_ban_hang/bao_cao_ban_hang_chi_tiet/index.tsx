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
import CustomTablePagination from '../../../../components/Pagination/CustomTablePagination';
import { BaoCaoBanHangDatataFilterContext } from '../../../../services/bao_cao/bao_cao_ban_hang/dto/BaoCaoDataContext';
import { PagedResultDto } from '../../../../services/dto/pagedResultDto';
import { LoaiBaoCao } from '../../../../lib/appconst';
import { IHeaderTable, MyHeaderTable } from '../../../../components/Table/MyHeaderTable';
import { BaoCaoBanHangChiTietDto } from '../../../../services/bao_cao/bao_cao_ban_hang/dto/BaoCaoBanHangChiTiet';
import { format } from 'date-fns';

export default function BaoCaoBanHangChiTiet({ onChangePage, onChangePageSize }: any) {
    const dataFilterContext = useContext(BaoCaoBanHangDatataFilterContext);
    const [columSort, setColumSort] = useState('ngayLapHoaDon');
    const [typeSort, setTypeSort] = useState('desc');
    const [pageDataBaoCaoBanHangChiTiet, setPageDataBaoCaoBanHangChiTiet] = useState<
        PagedResultDto<BaoCaoBanHangChiTietDto>
    >({
        items: [],
        totalCount: 0,
        totalPage: 0
    });

    useEffect(() => {
        if (dataFilterContext.loaiBaoCao === LoaiBaoCao.CHI_TIET) {
            GetBaoCaoBanHangChiTiet();
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

    const GetBaoCaoBanHangChiTiet = async () => {
        const prSearch = { ...dataFilterContext.filter };
        prSearch.columnSort = columSort;
        prSearch.typeSort = typeSort;
        const data = await baoCaoService.getBaoCaoBanHangChiTiet(prSearch);
        setPageDataBaoCaoBanHangChiTiet({
            ...pageDataBaoCaoBanHangChiTiet,
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
        { columnId: 'maHoaDon', columnText: 'Mã HĐ' },
        { columnId: 'ngayLapHoaDon', columnText: 'Ngày lập' },
        { columnId: 'tenKhachHang', columnText: 'Tên khách hàng' },
        { columnId: 'soDienThoai', columnText: 'Số điện thoại' },
        { columnId: 'tenNhomHang', columnText: 'Tên nhóm DV' },
        { columnId: 'maHangHoa', columnText: 'Mã dịch vụ' },
        { columnId: 'tenHangHoa', columnText: 'Tên dịch vụ' },
        { columnId: 'soLuong', columnText: 'Số lượng', align: 'center' },
        { columnId: 'donGiaTruocCK', columnText: 'Đơn giá', align: 'right' },
        { columnId: 'thanhTienTruocCK', columnText: 'Thành tiền', align: 'right' },
        { columnId: 'tienChietKhau', columnText: 'Chiết khấu', align: 'right' },
        { columnId: 'thanhTienSauCK', columnText: 'Doanh thu', align: 'right' }
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
                                        isCheckAll={false}
                                        isShowCheck={false}
                                        sortBy={columSort}
                                        sortType={typeSort}
                                        onRequestSort={onSortTable}
                                        listColumnHeader={listColumnHeader}
                                    />
                                </TableHead>
                                <TableBody>
                                    {pageDataBaoCaoBanHangChiTiet?.totalCount > 0 ? (
                                        <TableRow
                                            sx={{
                                                backgroundColor: 'var(--color-bg)',
                                                fontStyle: 'bold',
                                                '& td': {
                                                    fontWeight: 600
                                                }
                                            }}>
                                            <TableCell colSpan={7}>Tổng cộng</TableCell>
                                            <TableCell align="center">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    pageDataBaoCaoBanHangChiTiet?.items[0]?.sumSoLuong ?? 0
                                                )}
                                            </TableCell>
                                            <TableCell></TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    pageDataBaoCaoBanHangChiTiet?.items[0]?.sumThanhTienTruocCK ?? 0
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    pageDataBaoCaoBanHangChiTiet?.items[0]?.sumTienChietKhau ?? 0
                                                )}
                                            </TableCell>

                                            <TableCell align="right">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    pageDataBaoCaoBanHangChiTiet?.items[0]?.sumThanhTienSauCK ?? 0
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
                                    {pageDataBaoCaoBanHangChiTiet?.items?.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={{ maxWidth: 150 }}>{row?.maHoaDon}</TableCell>
                                            <TableCell sx={{ maxWidth: 150 }}>
                                                {format(new Date(row?.ngayLapHoaDon ?? ''), 'dd/MM/yyyy HH:mm')}
                                            </TableCell>
                                            <TableCell
                                                className="lableOverflow"
                                                sx={{ maxWidth: 150 }}
                                                title={row?.tenKhachHang}>
                                                {row?.tenKhachHang}
                                            </TableCell>
                                            <TableCell sx={{ maxWidth: 150 }}>{row?.soDienThoai}</TableCell>
                                            <TableCell
                                                className="lableOverflow"
                                                sx={{ maxWidth: 150 }}
                                                title={row?.tenNhomHang}>
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
                                                {new Intl.NumberFormat('vi-VN').format(row?.donGiaTruocCK ?? 0)}
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
                            totalPage={pageDataBaoCaoBanHangChiTiet?.totalPage}
                            totalRecord={pageDataBaoCaoBanHangChiTiet?.totalCount}
                            handlePerPageChange={changePageSize}
                            handlePageChange={handlePageChange}
                        />
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}
