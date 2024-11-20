import {
    Grid,
    Box,
    SelectChangeEvent,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableFooter
} from '@mui/material';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { FC, useContext, useEffect, useState } from 'react';
import { PagedResultDto } from '../../../services/dto/pagedResultDto';
import { LoaiBaoCao } from '../../../lib/appconst';
import { format } from 'date-fns';
import { IGroupChiTietNhatKySuDungGDVDto } from '../../../services/ban_hang/NhatKySuDungGDVDto';
import BaoCaoGDVServices from '../../../services/bao_cao/bao_cao_goi_dich_vu/BaoCaoGDVServices';
import { BaoCaoGoiDVDataContextFilter } from '../../../services/bao_cao/bao_cao_goi_dich_vu/BaoCaoGDVContext';

const PageBCChiTietNhatKySuDungGDV: FC<{
    onChangePage: (currentPage: number) => void;
    onChangePageSize: (pageSize: number) => void;
}> = ({ onChangePage, onChangePageSize }) => {
    const dataFilterContext = useContext(BaoCaoGoiDVDataContextFilter);
    const [pageDataBaoCaoChiTiet, setPageDataBaoCaoChiTiet] = useState<PagedResultDto<IGroupChiTietNhatKySuDungGDVDto>>(
        {
            items: [],
            totalCount: 0,
            totalPage: 0
        }
    );

    useEffect(() => {
        if (dataFilterContext.loaiBaoCao === parseInt(LoaiBaoCao.CHI_TIET)) {
            GetBaoCaoSuDungGDV_ChiTiet();
        }
    }, [
        dataFilterContext?.countClick,
        dataFilterContext?.filter?.currentPage,
        dataFilterContext?.filter?.pageSize,
        dataFilterContext?.filter?.fromDate,
        dataFilterContext?.filter?.toDate,
        dataFilterContext?.filter?.idChiNhanhs
    ]);

    const GetBaoCaoSuDungGDV_ChiTiet = async () => {
        const data = await BaoCaoGDVServices.GetBaoCaoSuDungGDV_ChiTiet(dataFilterContext.filter);
        if (data !== null && data?.length > 0) {
            const totalCount = data[0]?.totalCount ?? 0;
            setPageDataBaoCaoChiTiet({
                ...pageDataBaoCaoChiTiet,
                items: data,
                totalCount: totalCount,
                totalPage: Math.ceil(totalCount / (dataFilterContext?.filter?.pageSize ?? 10))
            });
        } else {
            setPageDataBaoCaoChiTiet({
                ...pageDataBaoCaoChiTiet,
                items: [],
                totalCount: 0,
                totalPage: 0
            });
        }
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
            <Grid container paddingTop={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box className="page-box-right">
                        <Box>
                            <TableContainer className="data-grid-row">
                                <Table>
                                    <TableHead className="table-head-has-colspan">
                                        <TableRow>
                                            <TableCell
                                                colSpan={9}
                                                sx={{ maxWidth: 300, borderTop: 'none!important' }}
                                                align="center"
                                                className="table-cell-border">
                                                GÓI DỊCH VỤ
                                            </TableCell>
                                            <TableCell
                                                colSpan={3}
                                                sx={{ maxWidth: 200, borderTop: 'none!important' }}
                                                align="center"
                                                className="table-cell-border">
                                                HÓA ĐƠN SỬ DỤNG
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="table-cell-border" align="center">
                                                Tên khách hàng
                                            </TableCell>
                                            <TableCell className="table-cell-border" align="center">
                                                Số điện thoại
                                            </TableCell>
                                            <TableCell className="table-cell-border" align="center">
                                                Mã GDV
                                            </TableCell>
                                            <TableCell className="table-cell-border" align="center">
                                                Ngày mua
                                            </TableCell>
                                            <TableCell className="table-cell-border" align="center">
                                                Mã dịch vụ
                                            </TableCell>
                                            <TableCell className="table-cell-border" align="center">
                                                Tên dịch vụ
                                            </TableCell>
                                            <TableCell
                                                className="table-cell-border"
                                                align="center"
                                                sx={{ minWidth: 50 }}>
                                                SL
                                            </TableCell>
                                            <TableCell
                                                className="table-cell-border"
                                                align="center"
                                                sx={{ minWidth: 90 }}>
                                                Đơn giá
                                            </TableCell>
                                            <TableCell
                                                className="table-cell-border"
                                                align="center"
                                                sx={{ minWidth: 90 }}>
                                                Thành tiền
                                            </TableCell>
                                            <TableCell className="table-cell-border" align="center">
                                                Mã hóa đơn
                                            </TableCell>
                                            <TableCell className="table-cell-border" align="center">
                                                Ngày sử dụng
                                            </TableCell>

                                            <TableCell
                                                className="table-cell-border"
                                                align="center"
                                                sx={{ minWidth: 50 }}>
                                                SL
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {pageDataBaoCaoChiTiet?.items?.map((row, index) => (
                                        <TableBody key={index}>
                                            <TableRow>
                                                <TableCell
                                                    rowSpan={row?.rowSpan + 1}
                                                    sx={{ maxWidth: 150 }}
                                                    title={row?.tenKhachHang}
                                                    className="lableOverflow">
                                                    {row?.tenKhachHang}
                                                </TableCell>
                                                <TableCell rowSpan={row?.rowSpan + 1}>
                                                    {`${row?.soDienThoai}`}
                                                </TableCell>
                                                <TableCell rowSpan={row?.rowSpan + 1} sx={{ fontWeight: 500 }}>
                                                    {`${row?.maGoiDichVu}`}
                                                </TableCell>
                                                <TableCell rowSpan={row?.rowSpan + 1}>
                                                    {format(new Date(row?.ngayMuaGDV), 'dd/MM/yyyy')}
                                                </TableCell>
                                            </TableRow>
                                            {row?.chitiets?.map((rowDetail, index2) => (
                                                <TableRow key={index2}>
                                                    <TableCell>{rowDetail?.maHangHoa}</TableCell>
                                                    <TableCell
                                                        sx={{ maxWidth: 200 }}
                                                        title={rowDetail?.tenHangHoa}
                                                        className="lableOverflow">
                                                        {rowDetail?.tenHangHoa}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {rowDetail?.soLuongMua == 0 ? '' : rowDetail?.soLuongMua}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {rowDetail.soLuongMua == 0
                                                            ? ''
                                                            : new Intl.NumberFormat('vi-VN').format(
                                                                  rowDetail.donGiaSauCK
                                                              )}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {rowDetail?.soLuongMua == 0
                                                            ? ''
                                                            : new Intl.NumberFormat('vi-VN').format(
                                                                  rowDetail.thanhTienSauCK
                                                              )}
                                                    </TableCell>

                                                    <TableCell>{rowDetail?.maHoaDonSD}</TableCell>
                                                    <TableCell>
                                                        {rowDetail?.ngayLapHoaDonSD != null
                                                            ? format(
                                                                  new Date(rowDetail?.ngayLapHoaDonSD),
                                                                  'dd/MM/yyyy HH:mm'
                                                              )
                                                            : ''}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {rowDetail?.soLuongSD == 0 ? '' : rowDetail?.soLuongSD}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    ))}
                                    {pageDataBaoCaoChiTiet?.totalCount === 0 && (
                                        <TableFooter>
                                            <TableRow className="table-empty">
                                                <TableCell colSpan={20} align="center">
                                                    Báo cáo không có dữ liệu
                                                </TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    )}
                                </Table>
                            </TableContainer>
                        </Box>
                        <CustomTablePagination
                            currentPage={dataFilterContext?.filter?.currentPage ?? 1}
                            rowPerPage={dataFilterContext?.filter?.pageSize ?? 10}
                            totalPage={pageDataBaoCaoChiTiet?.totalPage}
                            totalRecord={pageDataBaoCaoChiTiet?.totalCount}
                            handlePerPageChange={changePageSize}
                            handlePageChange={handlePageChange}
                        />
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};
export default PageBCChiTietNhatKySuDungGDV;
