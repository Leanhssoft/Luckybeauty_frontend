import {
    Grid,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow
} from '@mui/material';
import { Stack } from '@mui/system';
import { IBaoCaoChiTietCongNo } from '../../../services/bao_cao/bao_cao_tai_chinh/BaoCaoTaiChinhDto';
import { BaoCaoTaiChinhDatataFilterContext } from '../../../services/bao_cao/bao_cao_ban_hang/dto/BaoCaoDataContext';
import { useContext, useEffect, useState } from 'react';
import { BaoCaoTaiChinh_TabActive } from './main_page';
import { PagedResultDto } from '../../../services/dto/pagedResultDto';
import BaoCaoTaiChinhService from '../../../services/bao_cao/bao_cao_tai_chinh/BaoCaoTaiChinhService';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { format } from 'date-fns';
import utils from '../../../utils/utils';

export default function BaoCaoChiTietCongNo({ onChangePage, onChangePageSize }: any) {
    const dataFilterContext = useContext(BaoCaoTaiChinhDatataFilterContext);
    const [pageDataBaoCaoChiTietCongNo, setPageDataBaoCaoChiTietCongNo] = useState<
        PagedResultDto<IBaoCaoChiTietCongNo>
    >({
        items: [],
        totalCount: 0,
        totalPage: 0
    });

    useEffect(() => {
        if (dataFilterContext.loaiBaoCao === BaoCaoTaiChinh_TabActive.CONGNO_KHACHHANG) {
            GetBaoCaoChiTietCongNo();
        }
    }, [
        dataFilterContext?.countClick,
        dataFilterContext?.filter?.currentPage,
        dataFilterContext?.filter?.pageSize,
        dataFilterContext?.filter?.fromDate,
        dataFilterContext?.filter?.toDate,
        dataFilterContext?.filter?.idChiNhanhs
    ]);

    const GetBaoCaoChiTietCongNo = async () => {
        const data = await BaoCaoTaiChinhService.GetBaoCaoChiTietCongNo(dataFilterContext.filter);
        setPageDataBaoCaoChiTietCongNo({
            ...pageDataBaoCaoChiTietCongNo,
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
    return (
        <>
            <Grid container>
                <Grid item xs={12}>
                    <Stack className="page-box-right">
                        <TableContainer className="data-grid-row">
                            <Table>
                                <TableHead className="table-head-has-colspan">
                                    <TableRow>
                                        <TableCell rowSpan={2} sx={{ minWidth: 100, maxWidth: 150 }}>
                                            Mã khách
                                        </TableCell>
                                        <TableCell rowSpan={2}>Tên khách</TableCell>
                                        <TableCell rowSpan={2} sx={{ maxWidth: 200 }}>
                                            Mã HĐ
                                        </TableCell>
                                        <TableCell rowSpan={2} sx={{ minWidth: 80 }}>
                                            Ngày lập
                                        </TableCell>
                                        <TableCell
                                            colSpan={4}
                                            sx={{ maxWidth: 300, borderTop: 'none!important' }}
                                            align="center"
                                            className="table-cell-border">
                                            CHI TIẾT MUA
                                        </TableCell>
                                        <TableCell
                                            rowSpan={2}
                                            sx={{ maxWidth: 200, borderTop: 'none!important' }}
                                            align="center"
                                            className="table-cell-border">
                                            Tổng phải trả
                                        </TableCell>
                                        <TableCell
                                            rowSpan={2}
                                            sx={{ minWidth: 100, maxWidth: 200, borderTop: 'none!important' }}
                                            className="table-cell-border">
                                            Đã thanh toán
                                        </TableCell>
                                        <TableCell
                                            rowSpan={2}
                                            sx={{ minWidth: 90, maxWidth: 200, borderTop: 'none!important' }}
                                            className="table-cell-border">
                                            Còn nợ
                                        </TableCell>
                                        <TableCell rowSpan={2} sx={{ minWidth: 100, maxWidth: 250 }}>
                                            Chi chú hóa đơn
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="table-cell-border" align="center">
                                            Tên dịch vụ
                                        </TableCell>
                                        <TableCell className="table-cell-border" align="center" sx={{ minWidth: 50 }}>
                                            SL
                                        </TableCell>
                                        <TableCell className="table-cell-border" align="center" sx={{ minWidth: 90 }}>
                                            Giá bán
                                        </TableCell>
                                        <TableCell className="table-cell-border" align="center" sx={{ minWidth: 90 }}>
                                            Thành tiền
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pageDataBaoCaoChiTietCongNo?.totalCount > 0 ? (
                                        <TableRow
                                            sx={{
                                                backgroundColor: 'var(--color-bg)',
                                                fontStyle: 'bold',
                                                '& td': {
                                                    fontWeight: 600
                                                }
                                            }}>
                                            <TableCell colSpan={5}>Tổng cộng</TableCell>
                                            <TableCell align="center">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    pageDataBaoCaoChiTietCongNo?.items[0]?.sumSoLuong
                                                )}
                                            </TableCell>
                                            <TableCell></TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    pageDataBaoCaoChiTietCongNo?.items[0]?.sumThanhTienSauVAT
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    pageDataBaoCaoChiTietCongNo?.items[0]?.sumTongThanhToan
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    pageDataBaoCaoChiTietCongNo?.items[0]?.sumKhachDaTra
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    pageDataBaoCaoChiTietCongNo?.items[0]?.sumConNo
                                                )}
                                            </TableCell>

                                            <TableCell></TableCell>
                                        </TableRow>
                                    ) : (
                                        <TableRow className="table-empty">
                                            <TableCell colSpan={20} align="center">
                                                Báo cáo không có dữ liệu
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {pageDataBaoCaoChiTietCongNo?.items?.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{row?.maKhachHang}</TableCell>
                                            <TableCell
                                                className="lableOverflow"
                                                sx={{ maxWidth: 150 }}
                                                title={row?.tenKhachHang}>
                                                {row?.tenKhachHang}
                                            </TableCell>
                                            <TableCell>{row?.maHoaDon}</TableCell>
                                            <TableCell>{format(new Date(row?.ngayLapHoaDon), 'dd/MM/yyyy')}</TableCell>
                                            <TableCell
                                                sx={{ minWidth: 100, maxWidth: 200 }}
                                                title={row?.tenHangHoa}
                                                className="lableOverflow table-cell-border">
                                                {row?.tenHangHoa}
                                            </TableCell>
                                            <TableCell align="center" className="table-cell-border">
                                                {new Intl.NumberFormat('vi-VN').format(row?.soLuong ?? 0)}
                                            </TableCell>
                                            <TableCell align="right" className="table-cell-border">
                                                {new Intl.NumberFormat('vi-VN').format(row?.donGiaSauVAT ?? 0)}
                                            </TableCell>
                                            <TableCell align="right" className="table-cell-border">
                                                {new Intl.NumberFormat('vi-VN').format(row?.thanhTienSauVAT ?? 0)}
                                            </TableCell>
                                            <TableCell align="right" className="table-cell-border">
                                                {new Intl.NumberFormat('vi-VN').format(row?.tongThanhToan ?? 0)}
                                            </TableCell>
                                            <TableCell align="right" className="table-cell-border">
                                                {new Intl.NumberFormat('vi-VN').format(row?.khachDaTra ?? 0)}
                                            </TableCell>
                                            <TableCell align="right" className="table-cell-border">
                                                {new Intl.NumberFormat('vi-VN').format(row?.conNo ?? 0)}
                                            </TableCell>
                                            <TableCell align="right" className="table-cell-border">
                                                {row?.ghiChuHD}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <CustomTablePagination
                            currentPage={dataFilterContext?.filter?.currentPage ?? 1}
                            rowPerPage={dataFilterContext?.filter?.pageSize ?? 10}
                            totalPage={pageDataBaoCaoChiTietCongNo?.totalPage}
                            totalRecord={pageDataBaoCaoChiTietCongNo?.totalCount}
                            handlePerPageChange={changePageSize}
                            handlePageChange={handlePageChange}
                        />
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}
