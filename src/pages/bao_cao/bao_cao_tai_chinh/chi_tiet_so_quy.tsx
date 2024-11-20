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
import { IBaoCaoTaiChinh_ChiTietSoQuy } from '../../../services/bao_cao/bao_cao_tai_chinh/BaoCaoTaiChinhDto';
import { BaoCaoTaiChinhDatataFilterContext } from '../../../services/bao_cao/bao_cao_ban_hang/dto/BaoCaoDataContext';
import { useContext, useEffect, useState } from 'react';
import { BaoCaoTaiChinh_TabActive } from './main_page';
import { PagedResultDto } from '../../../services/dto/pagedResultDto';
import BaoCaoTaiChinhService from '../../../services/bao_cao/bao_cao_tai_chinh/BaoCaoTaiChinhService';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { format } from 'date-fns';
import utils from '../../../utils/utils';

export default function BaoCaoTaiChinhChiTietSoQuy({ onChangePage, onChangePageSize }: any) {
    const dataFilterContext = useContext(BaoCaoTaiChinhDatataFilterContext);
    const [pageDataBaoCaoTaiChinh_ChiTietSoQuy, setPageDataBaoCaoTaiChinh_ChiTietSoQuy] = useState<
        PagedResultDto<IBaoCaoTaiChinh_ChiTietSoQuy>
    >({
        items: [],
        totalCount: 0,
        totalPage: 0
    });

    useEffect(() => {
        if (dataFilterContext.loaiBaoCao === BaoCaoTaiChinh_TabActive.TONG_QUY) {
            GetBaoCaoTaichinh_ChiTietSoQuy();
        }
    }, [
        dataFilterContext?.countClick,
        dataFilterContext?.filter?.currentPage,
        dataFilterContext?.filter?.pageSize,
        dataFilterContext?.filter?.fromDate,
        dataFilterContext?.filter?.toDate,
        dataFilterContext?.filter?.idChiNhanhs
    ]);

    const GetBaoCaoTaichinh_ChiTietSoQuy = async () => {
        const data = await BaoCaoTaiChinhService.GetBaoCaoTaichinh_ChiTietSoQuy(dataFilterContext.filter);
        setPageDataBaoCaoTaiChinh_ChiTietSoQuy({
            ...pageDataBaoCaoTaiChinh_ChiTietSoQuy,
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
                                        <TableCell rowSpan={2}>Mã phiếu</TableCell>
                                        <TableCell rowSpan={2}>Ngày lập</TableCell>
                                        <TableCell rowSpan={2}>Người nhận/nộp</TableCell>
                                        <TableCell rowSpan={2}>Mã HĐ</TableCell>
                                        <TableCell
                                            colSpan={3}
                                            sx={{ maxWidth: 300, borderTop: 'none!important' }}
                                            align="center"
                                            className="table-cell-border">
                                            TIỀN THU
                                        </TableCell>
                                        <TableCell
                                            colSpan={3}
                                            sx={{ maxWidth: 300, borderTop: 'none!important' }}
                                            align="center"
                                            className="table-cell-border">
                                            TIỀN CHI
                                        </TableCell>
                                        <TableCell
                                            rowSpan={2}
                                            sx={{ minWidth: 80, maxWidth: 100, borderTop: 'none!important' }}
                                            className="table-cell-border">
                                            Tiền thu
                                        </TableCell>
                                        <TableCell
                                            rowSpan={2}
                                            sx={{ minWidth: 90, maxWidth: 100, borderTop: 'none!important' }}
                                            className="table-cell-border">
                                            Tiền chi
                                        </TableCell>
                                        <TableCell
                                            rowSpan={2}
                                            sx={{ maxWidth: 100, borderTop: 'none!important' }}
                                            className="table-cell-border">
                                            Tổng
                                        </TableCell>
                                        <TableCell rowSpan={2}>Nội dung thu/chi</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="table-cell-border" align="center" sx={{ minWidth: 90 }}>
                                            Mặt
                                        </TableCell>
                                        <TableCell className="table-cell-border" align="center" sx={{ minWidth: 90 }}>
                                            CK
                                        </TableCell>
                                        <TableCell className="table-cell-border" align="center" sx={{ minWidth: 90 }}>
                                            POS
                                        </TableCell>
                                        <TableCell className="table-cell-border" align="center" sx={{ minWidth: 90 }}>
                                            Mặt
                                        </TableCell>
                                        <TableCell className="table-cell-border" align="center" sx={{ minWidth: 90 }}>
                                            CK
                                        </TableCell>
                                        <TableCell className="table-cell-border" align="center" sx={{ minWidth: 90 }}>
                                            POS
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pageDataBaoCaoTaiChinh_ChiTietSoQuy?.totalCount > 0 ? (
                                        <TableRow
                                            sx={{
                                                backgroundColor: 'var(--color-bg)',
                                                fontStyle: 'bold',
                                                '& td': {
                                                    fontWeight: 600
                                                }
                                            }}>
                                            <TableCell colSpan={4}>Tổng cộng</TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    pageDataBaoCaoTaiChinh_ChiTietSoQuy?.items[0]?.sum_ThuTienMat
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    pageDataBaoCaoTaiChinh_ChiTietSoQuy?.items[0]
                                                        ?.sum_ThuTienChuyenKhoan
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    pageDataBaoCaoTaiChinh_ChiTietSoQuy?.items[0]?.sum_ThuTienQuyetThe
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    pageDataBaoCaoTaiChinh_ChiTietSoQuy?.items[0]?.sum_ChiTienMat
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    pageDataBaoCaoTaiChinh_ChiTietSoQuy?.items[0]
                                                        ?.sum_ChiTienChuyenKhoan
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    pageDataBaoCaoTaiChinh_ChiTietSoQuy?.items[0]?.sum_ChiTienQuyetThe
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    pageDataBaoCaoTaiChinh_ChiTietSoQuy?.items[0]?.sumTienThu
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    pageDataBaoCaoTaiChinh_ChiTietSoQuy?.items[0]?.sumTienChi
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat('vi-VN').format(
                                                    pageDataBaoCaoTaiChinh_ChiTietSoQuy?.items[0]?.sumTongThuChi
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
                                    {pageDataBaoCaoTaiChinh_ChiTietSoQuy?.items?.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={{ minWidth: 100, maxWidth: 150 }}>
                                                {row?.maPhieuThuChi}
                                            </TableCell>
                                            <TableCell sx={{ maxWidth: 150 }}>
                                                {format(new Date(row?.ngayLapPhieu), 'dd/MM/yyyy')}
                                            </TableCell>
                                            <TableCell
                                                className="lableOverflow"
                                                sx={{ maxWidth: 200 }}
                                                title={row?.tenNguoiNopTien}>
                                                {row?.tenNguoiNopTien}
                                            </TableCell>
                                            <TableCell sx={{ minWidth: 80 }}>
                                                {utils.Remove_LastComma(row?.maHoaDonLienQuans)}
                                            </TableCell>
                                            <TableCell align="right" className="table-cell-border">
                                                {new Intl.NumberFormat('vi-VN').format(row?.thu_TienMat ?? 0)}
                                            </TableCell>
                                            <TableCell align="right" className="table-cell-border">
                                                {new Intl.NumberFormat('vi-VN').format(row?.thu_TienChuyenKhoan ?? 0)}
                                            </TableCell>
                                            <TableCell align="right" className="table-cell-border">
                                                {new Intl.NumberFormat('vi-VN').format(row?.thu_TienQuyetThe ?? 0)}
                                            </TableCell>
                                            <TableCell align="right" className="table-cell-border">
                                                {new Intl.NumberFormat('vi-VN').format(row?.chi_TienMat ?? 0)}
                                            </TableCell>
                                            <TableCell align="right" className="table-cell-border">
                                                {new Intl.NumberFormat('vi-VN').format(row?.chi_TienChuyenKhoan ?? 0)}
                                            </TableCell>
                                            <TableCell align="right" className="table-cell-border">
                                                {new Intl.NumberFormat('vi-VN').format(row?.chi_TienQuyetThe ?? 0)}
                                            </TableCell>
                                            <TableCell align="right" className="table-cell-border">
                                                {new Intl.NumberFormat('vi-VN').format(row?.tienThu ?? 0)}
                                            </TableCell>
                                            <TableCell align="right" className="table-cell-border">
                                                {new Intl.NumberFormat('vi-VN').format(row?.tienChi ?? 0)}
                                            </TableCell>
                                            <TableCell align="right" className="table-cell-border">
                                                {new Intl.NumberFormat('vi-VN').format(row?.tongThuChi ?? 0)}
                                            </TableCell>
                                            <TableCell
                                                className="lableOverflow"
                                                title={row?.noiDungThu}
                                                sx={{ minWidth: 100, maxWidth: 250 }}>
                                                {row?.noiDungThu}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <CustomTablePagination
                            currentPage={dataFilterContext?.filter?.currentPage ?? 1}
                            rowPerPage={dataFilterContext?.filter?.pageSize ?? 10}
                            totalPage={pageDataBaoCaoTaiChinh_ChiTietSoQuy?.totalPage}
                            totalRecord={pageDataBaoCaoTaiChinh_ChiTietSoQuy?.totalCount}
                            handlePerPageChange={changePageSize}
                            handlePageChange={handlePageChange}
                        />
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}
