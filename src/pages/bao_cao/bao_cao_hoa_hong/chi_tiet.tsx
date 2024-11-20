import {
    Grid,
    Box,
    Stack,
    Typography,
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
import { useContext, useEffect, useRef, useState } from 'react';
import { PageBaoCaoHoaHongChiTiet } from '../../../services/bao_cao/bao_cao_hoa_hong/BaoCaoHoaHongDto';
import { PagedResultDto } from '../../../services/dto/pagedResultDto';
import { BaoCaoHoaHongDataContextFilter } from '../../../services/bao_cao/bao_cao_hoa_hong/BaoCaoHoaHongContext';
import { LoaiBaoCao } from '../../../lib/appconst';
import BaoCaoHoaHongServices from '../../../services/bao_cao/bao_cao_hoa_hong/BaoCaoHoaHongServices';
import { format } from 'date-fns';

export default function PageBaoCaoHoaHongNhanVienChiTiet({ onChangePage, onChangePageSize }: any) {
    const dataFilterContext = useContext(BaoCaoHoaHongDataContextFilter);
    const [pageDataBaoCaoChiTiet, setPageDataBaoCaoChiTiet] = useState<PagedResultDto<PageBaoCaoHoaHongChiTiet>>({
        items: [],
        totalCount: 0,
        totalPage: 0
    });

    useEffect(() => {
        if (dataFilterContext.loaiBaoCao === LoaiBaoCao.CHI_TIET) {
            GetBaoCaoHoaHongChiTiet();
        }
    }, [
        dataFilterContext?.countClick,
        dataFilterContext?.filter?.currentPage,
        dataFilterContext?.filter?.pageSize,
        dataFilterContext?.filter?.fromDate,
        dataFilterContext?.filter?.toDate,
        dataFilterContext?.filter?.idChiNhanhs
    ]);

    const GetBaoCaoHoaHongChiTiet = async () => {
        const data = await BaoCaoHoaHongServices.GetBaoCaoHoaHongChiTiet(dataFilterContext.filter);
        setPageDataBaoCaoChiTiet({
            ...pageDataBaoCaoChiTiet,
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
            <Grid container paddingTop={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box className="page-box-right">
                        <Box>
                            <TableContainer className="data-grid-row">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Mã HĐ</TableCell>
                                            <TableCell align="center">Ngày lập</TableCell>
                                            <TableCell align="center">Tên khách hàng</TableCell>
                                            <TableCell align="center">Tên dịch vụ</TableCell>
                                            <TableCell align="center">SL</TableCell>
                                            <TableCell align="center">Giá trị tính</TableCell>
                                            <TableCell align="center">Tên nhân viên</TableCell>
                                            <TableCell align="center">
                                                <Stack
                                                    sx={{
                                                        ' & .MuiTypography-root': {
                                                            fontWeight: 500,
                                                            fontSize: 'var(--font-size-main)'
                                                        }
                                                    }}>
                                                    <Typography>Hoa hồng thực hiện</Typography>
                                                    <Stack direction={'row'} justifyContent={'space-evenly'}>
                                                        <Typography>%</Typography>
                                                        <Typography>vnd</Typography>
                                                    </Stack>
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack
                                                    sx={{
                                                        ' & .MuiTypography-root': {
                                                            fontWeight: 500,
                                                            fontSize: 'var(--font-size-main)'
                                                        }
                                                    }}>
                                                    <Typography>Hoa hồng tư vấn</Typography>
                                                    <Stack direction={'row'} justifyContent={'space-evenly'}>
                                                        <Typography flex={1}>%</Typography>
                                                        <Typography flex={1}>vnd</Typography>
                                                    </Stack>
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="center">Tổng hoa hồng</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {pageDataBaoCaoChiTiet?.items?.map((row, index) => (
                                        <TableBody key={index}>
                                            <TableRow>
                                                <TableCell rowSpan={row?.rowSpan + 1} sx={{ maxWidth: 100 }}>
                                                    {`${row?.maHoaDon}`}
                                                </TableCell>
                                                <TableCell rowSpan={row?.rowSpan + 1} sx={{ maxWidth: 100 }}>
                                                    {format(new Date(row?.ngayLapHoaDon), 'dd/MM/yyyy')}
                                                </TableCell>
                                                <TableCell
                                                    rowSpan={row?.rowSpan + 1}
                                                    sx={{ maxWidth: 200 }}
                                                    className="lableOverflow">
                                                    {row?.tenKhachHang}
                                                </TableCell>
                                                <TableCell
                                                    rowSpan={row?.rowSpan + 1}
                                                    sx={{ maxWidth: 200 }}
                                                    className="lableOverflow">
                                                    {row?.tenHangHoa}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    rowSpan={row?.rowSpan + 1}
                                                    sx={{ maxWidth: 100 }}>
                                                    {row?.soLuong}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    rowSpan={row?.rowSpan + 1}
                                                    sx={{ maxWidth: 100 }}>
                                                    {new Intl.NumberFormat('vi-VN').format(row?.thanhTienSauCK ?? 0)}
                                                </TableCell>
                                            </TableRow>

                                            {row?.lstDetail?.map((rowDetail, index2) => (
                                                <TableRow key={index2}>
                                                    <TableCell sx={{ maxWidth: 200 }} className="lableOverflow">
                                                        {rowDetail?.tenNhanVien}
                                                    </TableCell>

                                                    <TableCell align="right" sx={{ maxWidth: 200 }}>
                                                        <Stack direction={'row'} textAlign={'center'}>
                                                            <Typography variant="body2" flex={1}>
                                                                {(rowDetail.hoaHongThucHien_TienChietKhau > 0 &&
                                                                    rowDetail?.hoaHongThucHien_PTChietKhau == 0) ||
                                                                rowDetail?.hoaHongTuVan_TienChietKhau > 0
                                                                    ? '_'
                                                                    : rowDetail?.hoaHongThucHien_PTChietKhau}
                                                            </Typography>
                                                            <Typography variant="body2" flex={1}>
                                                                {rowDetail?.hoaHongTuVan_TienChietKhau > 0
                                                                    ? '_'
                                                                    : new Intl.NumberFormat('vi-VN').format(
                                                                          rowDetail?.hoaHongThucHien_TienChietKhau ?? 0
                                                                      )}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ maxWidth: 200 }}>
                                                        <Stack direction={'row'} textAlign={'center'}>
                                                            <Typography variant="body2" flex={1}>
                                                                {(rowDetail.hoaHongTuVan_TienChietKhau > 0 &&
                                                                    rowDetail?.hoaHongTuVan_PTChietKhau == 0) ||
                                                                rowDetail?.hoaHongThucHien_TienChietKhau > 0
                                                                    ? '_'
                                                                    : rowDetail?.hoaHongTuVan_PTChietKhau}
                                                            </Typography>
                                                            <Typography variant="body2" flex={1}>
                                                                {rowDetail?.hoaHongThucHien_TienChietKhau > 0
                                                                    ? '_'
                                                                    : new Intl.NumberFormat('vi-VN').format(
                                                                          rowDetail?.hoaHongTuVan_TienChietKhau ?? 0
                                                                      )}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ maxWidth: 150 }}>
                                                        {new Intl.NumberFormat('vi-VN').format(
                                                            rowDetail?.tongHoaHong ?? 0
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    ))}

                                    <TableFooter>
                                        {pageDataBaoCaoChiTiet?.items?.length > 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4}>Tổng</TableCell>
                                                <TableCell align="right">
                                                    {pageDataBaoCaoChiTiet?.items[0]?.sumSoLuong}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {new Intl.NumberFormat('vi-VN').format(
                                                        pageDataBaoCaoChiTiet?.items[0]?.sumThanhTienSauCK ?? 0
                                                    )}
                                                </TableCell>
                                                <TableCell align="right"></TableCell>
                                                <TableCell align="center">
                                                    {new Intl.NumberFormat('vi-VN').format(
                                                        pageDataBaoCaoChiTiet?.items[0]?.sumHoaHongThucHien ?? 0
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {new Intl.NumberFormat('vi-VN').format(
                                                        pageDataBaoCaoChiTiet?.items[0]?.sumHoaHongTuVan ?? 0
                                                    )}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {new Intl.NumberFormat('vi-VN').format(
                                                        pageDataBaoCaoChiTiet?.items[0]?.sumTongHoaHong ?? 0
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
                                    </TableFooter>
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
}
