import {
    Grid,
    Stack,
    TextField,
    Typography,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableFooter,
    Pagination,
    IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { FC, useEffect, useRef, useState } from 'react';
import { IHeaderTable, MyHeaderTable } from '../../components/Table/MyHeaderTable';
import { LabelDisplayedRows } from '../../components/Pagination/LabelDisplayedRows';
import INhatKySuDungGDVDto from '../../services/ban_hang/NhatKySuDungGDVDto';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import HoaDonService from '../../services/ban_hang/HoaDonService';
import ParamSearchChiTietSuDungGDVDto from '../../services/ban_hang/ParamSearchChiTietSuDungGDVDto';
import { format } from 'date-fns';
import { OptionPage } from '../../components/Pagination/OptionPage';

const TabNhatKySuDungGDV: FC<{ idHoaDon?: string; idCustomer: string }> = ({ idHoaDon, idCustomer }) => {
    const firstLoad = useRef(true);
    const [txtSearch, setTxtSearch] = useState('');

    const [paramSearch, setParamSearch] = useState<ParamSearchChiTietSuDungGDVDto>({
        currentPage: 1,
        pageSize: 10
    } as ParamSearchChiTietSuDungGDVDto);
    const [pageChiTietSuDungGDV, setPageChiTietSuDungGDV] = useState<PagedResultDto<INhatKySuDungGDVDto>>({
        items: [],
        totalCount: 0,
        totalPage: 0
    });

    const GetNhatKySuDungGDV_ofKhachHang = async () => {
        const param = { ...paramSearch };
        param.textSearch = txtSearch;
        param.idGoiDichVu = idHoaDon;
        param.idCustomer = idCustomer;
        const data = await HoaDonService.GetNhatKySuDungGDV_ofKhachHang(param);
        setPageChiTietSuDungGDV({
            ...pageChiTietSuDungGDV,
            items: data?.items,
            totalCount: data?.totalCount ?? 0,
            totalPage: Math.ceil((data?.totalCount ?? 0) / (paramSearch?.pageSize ?? 10))
        });
    };

    useEffect(() => {
        GetNhatKySuDungGDV_ofKhachHang();
    }, [idHoaDon ?? null]);

    useEffect(() => {
        if (firstLoad?.current) {
            firstLoad.current = false;
            return;
        }
        GetNhatKySuDungGDV_ofKhachHang();
    }, [paramSearch]);

    const changeNumberOfpage = (pageSize: number) => {
        setParamSearch({
            ...paramSearch,
            pageSize: pageSize
        });
    };

    const handleChangePage = (value: number) => {
        setParamSearch({
            ...paramSearch,
            currentPage: value
        });
    };

    const onClickSearchGDV = () => {
        setParamSearch({
            ...paramSearch,
            textSearch: txtSearch,
            currentPage: 1
        });
    };

    const listColumnHeader: IHeaderTable[] = [
        { columnId: 'ngayLapHoaDon', columnText: 'Ngày sử dụng' },
        { columnId: 'maHoaDon', columnText: 'Mã hóa đơn' },
        { columnId: 'maHangHoa', columnText: 'Mã dịch vụ' },
        { columnId: 'tenHangHoa', columnText: 'Tên dịch vụ' },
        { columnId: 'soLuong', columnText: 'Số lượng', align: 'center' },
        { columnId: 'thanhTienSauCK', columnText: 'Giá trị sử dụng', align: 'right' }
        // { columnId: 'nvThucHiens', columnText: 'Thành tiền', align: 'right' }
    ];

    return (
        <>
            <Grid container spacing={2}>
                <Grid item lg={7}>
                    <Stack spacing={1} direction={'row'} alignItems={'center'}>
                        <TextField
                            size="small"
                            fullWidth
                            sx={{ flex: 3 }}
                            value={txtSearch}
                            placeholder="Gõ tìm dịch vụ và nhấn enter (hoặc click vào icon)"
                            InputProps={{
                                startAdornment: (
                                    <IconButton type="button" onClick={onClickSearchGDV}>
                                        <SearchIcon />
                                    </IconButton>
                                )
                            }}
                            onChange={(e) => setTxtSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onClickSearchGDV();
                                }
                            }}
                        />
                    </Stack>
                </Grid>
                <Grid item lg={5}></Grid>

                <Grid item lg={12}>
                    <TableContainer sx={{ overflow: 'auto', maxHeight: 420 }}>
                        <Table>
                            <TableHead>
                                <MyHeaderTable
                                    showAction={false}
                                    isCheckAll={false}
                                    isShowCheck={false}
                                    sortBy=""
                                    sortType="stt"
                                    onRequestSort={() => console.log('sort')}
                                    listColumnHeader={listColumnHeader}
                                />
                            </TableHead>
                            <TableBody>
                                {pageChiTietSuDungGDV?.items?.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            {format(new Date(row?.ngayLapHoaDonSD), 'dd/MM/yyyy HH:mm')}
                                        </TableCell>
                                        <TableCell>{row?.maHoaDonSD}</TableCell>
                                        <TableCell>{row?.maHangHoa}</TableCell>
                                        <TableCell>{row?.tenHangHoa}</TableCell>
                                        <TableCell align="center">
                                            {new Intl.NumberFormat('vi-VN').format(row?.soLuongSD ?? 0)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {new Intl.NumberFormat('vi-VN').format(row?.giaTriSuDung ?? 0)}
                                        </TableCell>
                                        <TableCell>{row?.nvthucHiens}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            {pageChiTietSuDungGDV?.totalCount === 0 && (
                                <TableFooter>
                                    <TableRow className="table-empty">
                                        <TableCell colSpan={10} align="center">
                                            Không có dữ liệu
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            )}
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12}>
                    <Grid container paddingLeft={1} paddingRight={1}>
                        <Grid item lg={6}>
                            {pageChiTietSuDungGDV?.totalCount > 10 && (
                                <OptionPage changeNumberOfpage={changeNumberOfpage} />
                            )}
                        </Grid>
                        <Grid item lg={6}>
                            <Stack direction="row" justifyContent={'end'}>
                                <LabelDisplayedRows
                                    currentPage={paramSearch?.currentPage ?? 1}
                                    pageSize={paramSearch?.pageSize ?? 0}
                                    totalCount={pageChiTietSuDungGDV?.totalCount ?? 0}
                                />
                                {pageChiTietSuDungGDV?.totalCount > 10 && (
                                    <Pagination
                                        shape="circular"
                                        count={pageChiTietSuDungGDV.totalPage}
                                        page={paramSearch?.currentPage ?? 1}
                                        defaultPage={paramSearch.pageSize}
                                        onChange={(e, newVal) => handleChangePage(newVal)}
                                    />
                                )}
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default TabNhatKySuDungGDV;
