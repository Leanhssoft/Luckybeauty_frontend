import {
    Autocomplete,
    Box,
    Button,
    ButtonGroup,
    Grid,
    IconButton,
    InputAdornment,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import { observer } from 'mobx-react';
import { TextTranslate } from '../../../../components/TableLanguage';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import suggestStore from '../../../../stores/suggestStore';
import UploadIcon from '../../../../images/upload.svg';
import SearchIcon from '../../../../images/search-normal.svg';
import { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { format as formatDate, startOfMonth, endOfMonth } from 'date-fns';
import baoCaoService from '../../../../services/bao_cao/bao_cao_ban_hang/baoCaoService';
import fileDowloadService from '../../../../services/file-dowload.service';
import DateTimeFilterCustom from '../../components/DateTimeFilterCustom';
import CustomTablePagination from '../../../../components/Pagination/CustomTablePagination';
import { BaoCaoSoQuyDto } from '../../../../services/bao_cao/bao_cao_ban_hang/dto/BaoCaoSoQuyDto';
import { AppContext } from '../../../../services/chi_nhanh/ChiNhanhContext';
const TIEN_MAT = 1;
const NGAN_HANG = 2;
const TONG_QUY = 3;
const CHI_NHANH = 4;

const BaoCaoSoQuy_HinhThucThanhToanTienMat = ({ handleChangeTab }: any) => {
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [maxResultCount, setMaxResultCount] = useState<number>(10);
    const [sortBy, setSortBy] = useState('tenHangHoa');
    const [sortType, setSortType] = useState('desc');
    const [timeFrom, setTimeFrom] = useState<Date>(startOfMonth(new Date()));
    const [timeTo, setTimeTo] = useState<Date>(endOfMonth(new Date()));
    const [dateTimeType, setDateTimeType] = useState('Tháng này');
    const [idDichVu, setIdDichVu] = useState('');
    const [dataRow, setDataRow] = useState<BaoCaoSoQuyDto[]>([]);
    const [totalPage, setTotalPage] = useState(0);
    const [totalDataRow, setTotalDataRow] = useState(0);
    const [anchorDateEl, setAnchorDateEl] = useState<HTMLButtonElement | null>(null);
    const [disableSelectDate, setDisableSelectDate] = useState(true);
    const getData = async () => {
        const result = await baoCaoService.getBaoCaoTaiChinh_ThuChiTienMat({
            filter: filter,
            idChiNhanh: chinhanh.id,
            maxResultCount: maxResultCount,
            skipCount: currentPage,
            timeFrom: formatDate(timeFrom, 'yyyy/MM/dd HH:mm:ss'),
            timeTo: formatDate(timeTo, 'yyyy/MM/dd HH:mm:ss'),
            sortBy: sortBy,
            sortType: sortType
        });
        setDataRow(result.items);
        setTotalDataRow(result.totalCount);
        setTotalPage(Math.ceil(result.totalCount / maxResultCount));
    };
    useEffect(() => {
        getData();
    }, [currentPage, maxResultCount, sortBy, sortType, idDichVu, chinhanh.id]);
    const handlePageChange = async (event: any, value: number) => {
        setCurrentPage(value);
    };
    const handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        setMaxResultCount(parseInt(event.target.value.toString(), 10));
        setCurrentPage(1);
    };
    const handleCloseDateSelect = () => {
        setAnchorDateEl(null);
    };
    const handOpenDateSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorDateEl(event.currentTarget);
    };
    const onSort = async (sortType: string, sortBy: string) => {
        setSortBy(sortBy);
        setSortType(sortType);
    };
    const exportToExcel = async () => {
        const result = await baoCaoService.exportBaoCaoTaiChinh_ThuChiTienMat({
            filter: filter,
            idChiNhanh: Cookies.get('IdChiNhanh') ?? undefined,
            maxResultCount: maxResultCount,
            skipCount: currentPage,
            timeFrom: formatDate(timeFrom, 'yyyy/MM/dd HH:mm:ss'),
            timeTo: formatDate(timeTo, 'yyyy/MM/dd HH:mm:ss'),
            sortBy: sortBy,
            sortType: sortType
        });
        fileDowloadService.downloadExportFile(result);
    };
    const columns: GridColDef[] = [
        {
            field: 'maHoaDon',
            headerName: 'Mã phiếu',
            minWidth: 100,
            flex: 0.8,
            renderHeader: (params) => <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Typography
                    fontSize="13px"
                    fontWeight="400"
                    sx={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'ngayLapHoaDon',
            headerName: 'Thời gian',
            minWidth: 150,
            flex: 0.8,
            renderCell: (params) => (
                <Typography
                    fontSize="13px"
                    fontWeight="400"
                    sx={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {formatDate(new Date(params.value), 'dd/MM/yyyy HH:mm')}
                </Typography>
            ),
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
        },
        {
            field: 'tienThu',
            headerName: 'Tiền thu',
            minWidth: 90,
            flex: 0.7,
            renderCell: (params) => (
                <Typography
                    fontSize="13px"
                    fontWeight="400"
                    sx={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Typography>
            ),
            renderHeader: (params) => (
                <Box
                    sx={{
                        fontWeight: '500',
                        fontSize: '13px',
                        fontFamily: 'Roboto'
                    }}>
                    {params.colDef.headerName}
                </Box>
            )
        },
        {
            field: 'tienChi',
            headerName: 'Tiền chi',
            minWidth: 150,
            flex: 1,
            renderHeader: (params) => (
                <Box
                    sx={{
                        fontWeight: '500',
                        fontSize: '13px',
                        fontFamily: 'Roboto'
                    }}>
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params) => (
                <Typography
                    fontSize="13px"
                    fontWeight="400"
                    sx={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Typography>
            )
        },
        {
            field: 'tonLuyKe',
            headerName: 'Lũy kế',
            minWidth: 150,
            flex: 1,
            renderCell: (params) => {
                return (
                    <Typography
                        fontSize="13px"
                        fontWeight="400"
                        sx={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {params.value}
                    </Typography>
                );
            },
            renderHeader: (params) => (
                <Box
                    sx={{
                        fontWeight: '500',
                        color: '#525F7A',
                        fontSize: '13px',
                        fontFamily: 'Roboto'
                    }}>
                    {params.colDef.headerName}
                </Box>
            )
        },
        {
            field: 'ghiChu',
            headerName: 'Ghi chú',
            minWidth: 120,
            flex: 1,
            renderCell: (params) => (
                <Box width="100%" textAlign="left" fontSize="13px">
                    {params.value}
                </Box>
            ),
            renderHeader: (params) => (
                <Box
                    sx={{
                        fontWeight: '500',
                        color: '#525F7A',
                        fontSize: '13px',
                        fontFamily: 'Roboto'
                    }}>
                    {params.colDef.headerName}
                </Box>
            )
        }
    ];
    const openDateSelect = Boolean(anchorDateEl);
    const idDateSelect = openDateSelect ? 'simple-popover' : undefined;
    return (
        <Box paddingTop={'16px'}>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={12} md="auto" display="flex" alignItems="center" gap="10px">
                    <Typography variant="h1" fontSize="16px" fontWeight="700" color="#333233">
                        Báo cáo sổ quỹ tiền mặt
                    </Typography>
                    <Box className="form-search">
                        <TextField
                            sx={{
                                backgroundColor: '#fff',
                                borderColor: '#CDC9CD',
                                height: '40px',
                                '& .MuiInputBase-root': {
                                    pl: '0'
                                }
                            }}
                            onChange={(e: any) => {
                                setFilter(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key == 'Enter') {
                                    getData();
                                }
                            }}
                            size="small"
                            className="search-field"
                            variant="outlined"
                            placeholder="Tìm kiếm"
                            InputProps={{
                                startAdornment: (
                                    <IconButton
                                        type="button"
                                        onClick={() => {
                                            getData();
                                        }}>
                                        <img src={SearchIcon} />
                                    </IconButton>
                                )
                            }}
                        />
                    </Box>
                </Grid>

                <Grid xs={12} md="auto" item display="flex" gap="8px" justifyContent="end">
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{
                            backgroundColor: '#fff!important',
                            textTransform: 'capitalize',
                            fontWeight: '400',
                            color: '#666466',
                            padding: '10px 16px',
                            height: '40px',
                            borderRadius: '4px!important'
                        }}
                        onClick={handOpenDateSelect}
                        className="btn-outline-hover">
                        {dateTimeType}
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        //hidden={!abpCustom.isGrandPermission('Pages.NhanSu.Export')}
                        startIcon={<img src={UploadIcon} />}
                        sx={{
                            backgroundColor: '#fff!important',
                            textTransform: 'capitalize',
                            fontWeight: '400',
                            color: '#666466',
                            padding: '10px 16px',
                            height: '40px',
                            borderRadius: '4px!important'
                        }}
                        onClick={exportToExcel}
                        className="btn-outline-hover">
                        Xuất
                    </Button>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="space-between" marginTop={2} marginBottom={2}>
                <Grid item xs={6} display="flex" alignItems="center" gap="10px">
                    <ButtonGroup
                        sx={{
                            height: '40px',
                            bottom: '24px',
                            right: '50px',
                            float: 'right',
                            gap: '8px',
                            '& button': {
                                padding: '8px 10px!important',
                                lineHeight: '24px'
                            }
                        }}
                        tabIndex={1}>
                        <Button
                            variant={'outlined'}
                            sx={{
                                fontSize: '16px',
                                textTransform: 'unset',
                                color: '#319DFF',
                                border: 'none !important',
                                borderBottom: '2px outset #319DFF !important',
                                boxShadow: 'none!important'
                            }}
                            onClick={() => {
                                handleChangeTab(TIEN_MAT);
                            }}>
                            Tiền mặt
                        </Button>
                        <Button
                            variant={'outlined'}
                            sx={{
                                fontSize: '16px',
                                textTransform: 'unset',
                                color: '#8492AE',

                                borderColor: 'transparent!important',
                                boxShadow: 'none!important',
                                '&:hover': {
                                    color: '#319DFF',
                                    backgroundColor: '#FFF',
                                    border: 'none !important',
                                    borderBottom: '2px outset #319DFF !important',
                                    boxShadow: 'none!important'
                                }
                            }}
                            onClick={() => {
                                handleChangeTab(NGAN_HANG);
                            }}>
                            Ngân hàng
                        </Button>
                        <Button
                            variant={'outlined'}
                            sx={{
                                fontSize: '16px',
                                textTransform: 'unset',
                                color: '#8492AE',

                                borderColor: 'transparent!important',
                                boxShadow: 'none!important',
                                '&:hover': {
                                    color: '#319DFF',
                                    backgroundColor: '#FFF',
                                    border: 'none !important',
                                    borderBottom: '2px outset #319DFF !important',
                                    boxShadow: 'none!important'
                                }
                            }}
                            onClick={() => {
                                handleChangeTab(TONG_QUY);
                            }}>
                            Tổng quỹ
                        </Button>
                        <Button
                            variant={'outlined'}
                            sx={{
                                fontSize: '16px',
                                textTransform: 'unset',
                                color: '#8492AE',

                                borderColor: 'transparent!important',
                                boxShadow: 'none!important',
                                '&:hover': {
                                    color: '#319DFF',
                                    backgroundColor: '#FFF',
                                    border: 'none !important',
                                    borderBottom: '2px outset #319DFF !important',
                                    boxShadow: 'none!important'
                                }
                            }}
                            onClick={() => {
                                handleChangeTab(CHI_NHANH);
                            }}>
                            Chi nhánh
                        </Button>
                    </ButtonGroup>
                </Grid>

                <Grid xs={12} md={6} item display="flex" gap="8px" justifyContent="end">
                    <Autocomplete
                        options={suggestStore.suggestDichVu || []}
                        getOptionLabel={(option) => `${option.tenDichVu}`}
                        onChange={(event, value) => {
                            setIdDichVu(value?.id ?? '');
                        }}
                        size="small"
                        fullWidth
                        sx={{ width: '35%' }}
                        renderInput={(params) => (
                            <TextField
                                sx={{ bgcolor: '#fff' }}
                                {...params}
                                placeholder="Tìm tên"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <>
                                            {params.InputProps.startAdornment}
                                            <InputAdornment position="start">
                                                <img src={SearchIcon} />
                                            </InputAdornment>
                                        </>
                                    )
                                }}
                            />
                        )}
                    />
                </Grid>
            </Grid>
            <DataGrid
                disableRowSelectionOnClick
                rowHeight={46}
                rows={dataRow}
                columns={columns}
                checkboxSelection={false}
                hideFooter
                localeText={TextTranslate}
                sortingOrder={['desc', 'asc']}
                onSortModelChange={(newSortModel) => {
                    if (newSortModel.length > 0) {
                        onSort(newSortModel[0].sort?.toString() ?? '', newSortModel[0].field ?? '');
                    }
                }}
            />

            <CustomTablePagination
                currentPage={currentPage}
                rowPerPage={maxResultCount}
                totalPage={totalPage}
                totalRecord={totalDataRow}
                handlePerPageChange={handlePerPageChange}
                handlePageChange={handlePageChange}
            />
            <DateTimeFilterCustom
                open={openDateSelect}
                anchorEl={anchorDateEl}
                onClose={handleCloseDateSelect}
                id={idDateSelect}
                dateTimeType={dateTimeType}
                setDateTimeType={setDateTimeType}
                timeFrom={timeFrom}
                timeTo={timeTo}
                setTimeFrom={setTimeFrom}
                setTimeTo={setTimeTo}
                disableSelectDate={disableSelectDate}
                setDisableSelectDate={setDisableSelectDate}
                onOk={async () => {
                    await getData();
                    handleCloseDateSelect();
                }}
            />
        </Box>
    );
};
export default observer(BaoCaoSoQuy_HinhThucThanhToanTienMat);
