import { useRef, useState, useContext, useEffect } from 'react';
import { format, lastDayOfMonth } from 'date-fns';
import Cookies from 'js-cookie';

import {
    Grid,
    Box,
    Stack,
    TextField,
    IconButton,
    Button,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Checkbox,
    TableFooter,
    SelectChangeEvent,
    Tab
} from '@mui/material';
import { Search } from '@mui/icons-material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { PropConfirmOKCancel } from '../../../utils/PropParentToChild';
import ActionRowSelect from '../../../components/DataGrid/ActionRowSelect';
import { IHeaderTable, MyHeaderTable } from '../../../components/Table/MyHeaderTable';

import { PagedResultDto } from '../../../services/dto/pagedResultDto';
import abpCustom from '../../../components/abp-custom';
import DateFilterCustom from '../../../components/DatetimePicker/DateFilterCustom';
import { IList } from '../../../services/dto/IList';
import { ISelect, LoaiSoSanh_Number, LoaiTin, SMS_HinhThucGuiTin } from '../../../lib/appconst';
import { AppContext } from '../../../services/chi_nhanh/ChiNhanhContext';
import suggestStore from '../../../stores/suggestStore';

import PopoverFilterBaoCaoCheckIn from './PopoverFilterBaoCaoCheckIn';
import {
    IBaoCaoKhachHangCheckIn,
    ParamSearchBaoCaoCheckIn
} from '../../../services/bao_cao/bao_cao_check_in/baoCaoCheckInDto';
import BaoCaoCheckInService from '../../../services/bao_cao/bao_cao_check_in/BaoCaoCheckInService';
import utils from '../../../utils/utils';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import fileDowloadService from '../../../services/file-dowload.service';
import ModalGuiTinNhanZalo from '../../zalo/modal_gui_tin_zalo';
import ModalGuiTinNhan from '../../sms/components/modal_gui_tin_nhan';
import { BrandnameDto } from '../../../services/sms/brandname/BrandnameDto';
import { MauTinSMSDto } from '../../../services/sms/mau_tin_sms/mau_tin_dto';
import ButtonOnlyIcon from '../../../components/Button/ButtonOnlyIcon';

export default function BaoCaoKhachHangCheckIn() {
    const today = new Date();
    const firstLoad = useRef(true);
    const firstLoad2 = useRef(true);
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;
    const idChiNhanhCookies = Cookies.get('IdChiNhanh') ?? '';
    const [txtSearch, setTxtSearch] = useState('');
    const [arrIdChosed, setArrIdChosed] = useState<string[]>([]);
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isShowModalGuiTinZalo, setIsShowModalGuiTinZalo] = useState(false);
    const [isShowModalGuiTinSMS, setIsShowModalGuiTinSMS] = useState(false);
    const [lstAllMauTinSMS, setLstAllMauTinSMS] = useState<MauTinSMSDto[]>([]);

    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [paramSearch, setParamSearch] = useState<ParamSearchBaoCaoCheckIn>({
        textSearch: '',
        currentPage: 1,
        columnSort: 'tenKhachHang',
        typeSort: 'asc',
        idChiNhanhs: [idChiNhanhCookies],
        // mặc định: full thời gian
        fromDate: null,
        toDate: null,
        // mặc định: chỉ lấy khách hàng đã checkin
        soLanCheckIn_From: 1,
        soLanCheckIn_LoaiSoSanh: LoaiSoSanh_Number.GREATER_THAN_OR_EQUALS,
        // mặc định: chỉ lấy khách hàng chưa quay lại
        soNgayChuaCheckIn_From: 7,
        soNgayChuaCheckIn_To: 7,
        soNgayChuaCheckIn_LoaiSoSanh: LoaiSoSanh_Number.EQUALS
    } as ParamSearchBaoCaoCheckIn);
    const [pageDataBaoCao, setPageDataBaoCao] = useState<PagedResultDto<IBaoCaoKhachHangCheckIn>>(
        {} as PagedResultDto<IBaoCaoKhachHangCheckIn>
    );

    const [tabActive, setTabActive] = useState('7');
    const arrTab: ISelect[] = [
        { value: '7', text: '7 ngày' },
        { value: '10', text: '10 ngày' },
        { value: '30', text: '30 ngày' },
        { value: '90', text: '90 ngày' },
        { value: '-1', text: 'Tùy chỉnh' }
    ];

    const [prevParamSearch, setPrevParamSearch] = useState<ParamSearchBaoCaoCheckIn>(paramSearch);
    if (paramSearch !== prevParamSearch) {
        setPrevParamSearch(paramSearch);
    }

    const PageLoad = async () => {
        await suggestStore.getSuggestNhomKhach();
        await suggestStore.Zalo_GetAccessToken();
        await GetBaoCaoKhachHangCheckIn();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    useEffect(() => {
        if (firstLoad2.current) {
            firstLoad2.current = false;
            return;
        }
        setParamSearch({
            ...paramSearch,
            currentPage: 1,
            idChiNhanhs: chinhanh?.id === '' ? [idChiNhanhCookies] : [chinhanh.id]
        });
    }, [chinhanh.id]);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        GetBaoCaoKhachHangCheckIn();
    }, [prevParamSearch]);

    const GetBaoCaoKhachHangCheckIn = async () => {
        const data = await BaoCaoCheckInService.GetBaoCaoKhachHang_CheckIn(prevParamSearch);
        setPageDataBaoCao({
            ...pageDataBaoCao,
            items: data?.items,
            totalCount: data?.totalCount,
            totalPage: Math.ceil(data?.totalCount / (prevParamSearch?.pageSize ?? 10))
        });
    };

    const handleChangeTab = async (event: React.SyntheticEvent, newValue: string) => {
        const soNgay = parseInt(newValue);
        setTabActive(newValue);

        if (soNgay == -1) {
            //
        } else {
            setParamSearch({
                ...paramSearch,
                soNgayChuaCheckIn_From: soNgay,
                soNgayChuaCheckIn_To: soNgay,
                soNgayChuaCheckIn_LoaiSoSanh: LoaiSoSanh_Number.EQUALS
            });
        }
    };

    const handleKeyDownTextSearch = (event: any) => {
        if (event.keyCode === 13) {
            hanClickIconSearch();
        }
    };

    const hanClickIconSearch = () => {
        setParamSearch({
            ...paramSearch,
            currentPage: 1,
            textSearch: txtSearch
        });
    };

    const [anchorDateEl, setAnchorDateEl] = useState<HTMLDivElement | null>(null);
    const openDateFilter = Boolean(anchorDateEl);

    const onApplyFilterDate = async (from: string, to: string, txtShow: string) => {
        setAnchorDateEl(null);
        setParamSearch({ ...paramSearch, fromDate: from, toDate: to, currentPage: 1 });
        setArrIdChosed([]);
    };

    const onSortTable = (columnSort: string) => {
        setParamSearch({
            ...paramSearch,
            columnSort: columnSort,
            typeSort: paramSearch.typeSort == '' ? 'desc' : paramSearch.typeSort == 'asc' ? 'desc' : 'asc'
        });
    };

    const onClickCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isCheck = event.currentTarget.checked;
        setIsCheckAll(isCheck);

        const arrIdThisPage = pageDataBaoCao?.items?.map((x) => {
            return x.idKhachHang;
        });
        const arrIdNotThisPage = arrIdChosed.filter((x) => !arrIdThisPage.includes(x));
        if (isCheck) {
            setArrIdChosed([...arrIdNotThisPage, ...arrIdThisPage]);
        } else {
            setArrIdChosed([...arrIdNotThisPage]);
        }
    };

    const onClickCheckOne = (event: React.ChangeEvent<HTMLInputElement>, rowId: string) => {
        const isCheck = event.currentTarget.checked;
        if (isCheck) {
            setArrIdChosed([...arrIdChosed, rowId]);

            const arrIdThisPage = pageDataBaoCao?.items?.map((x) => {
                return x.idKhachHang;
            });
            const arrExist = arrIdChosed?.filter((x) => arrIdThisPage.includes(x));
            setIsCheckAll(arrIdThisPage.length === arrExist.length + 1);
        } else {
            setArrIdChosed(arrIdChosed.filter((x) => x !== rowId));
            setIsCheckAll(false);
        }
    };
    const [anchorElFilter, setAnchorElFilter] = useState<SVGSVGElement | null>(null);
    const ApplyFilter = (paramFilter: ParamSearchBaoCaoCheckIn) => {
        setAnchorElFilter(null);
        setParamSearch({
            ...paramSearch,
            currentPage: 1,
            idNhomKhachs: paramFilter?.idNhomKhachs,
            idChiNhanhs: paramFilter?.idChiNhanhs,
            soNgayChuaCheckIn_From: paramFilter?.soNgayChuaCheckIn_From,
            soNgayChuaCheckIn_To: paramFilter?.soNgayChuaCheckIn_To,
            soLanCheckIn_From: paramFilter?.soLanCheckIn_From,
            soLanCheckIn_To: paramFilter?.soLanCheckIn_To,
            soLanDatHen_From: paramFilter?.soLanDatHen_From,
            soLanDatHen_To: paramFilter?.soLanDatHen_To
        });
    };

    const DataGrid_handleAction = async (item: any) => {
        switch (parseInt(item.id)) {
            case SMS_HinhThucGuiTin.ZALO:
                {
                    // gui tin zalo
                    setIsShowModalGuiTinZalo(true);
                }
                break;
            case SMS_HinhThucGuiTin.SMS:
                {
                    // gui tin sms
                    setIsShowModalGuiTinSMS(true);
                }
                break;
        }
    };

    const handleChangePage = (event: any, value: number) => {
        setParamSearch({
            ...paramSearch,
            currentPage: value
        });
    };
    const handlePerPageChange = (event: SelectChangeEvent<number>) => {
        setParamSearch({
            ...paramSearch,
            currentPage: 1,
            pageSize: parseInt(event.target.value.toString(), 10)
        });
    };

    const exportToExcel = async () => {
        const param = { ...paramSearch };
        param.pageSize = pageDataBaoCao.totalCount;
        param.currentPage = 1;
        const data = await BaoCaoCheckInService.ExportToExcel_BaoCaoKhachHang_CheckIn(param);
        fileDowloadService.downloadExportFile(data);
    };

    const saveSMSOK = (type: number) => {
        setIsShowModalGuiTinZalo(false);
        setIsShowModalGuiTinSMS(false);
    };

    const listColumnHeader: IHeaderTable[] = [
        { columnId: 'maKhachHang', columnText: 'Mã khách' },
        { columnId: 'tenKhachHang', columnText: 'Tên khách' },
        { columnId: 'soDienThoai', columnText: 'Số điện thoại' },
        { columnId: 'soLanCheckIn', columnText: 'Số lần checkin', align: 'right' },
        { columnId: 'ngayCheckInGanNhat', columnText: 'Checkin gần nhất', align: 'center' },
        { columnId: 'soNgaychuaCheckIn', columnText: 'Số ngày chưa checkin', align: 'right' }
        // { columnId: 'soLanDatHen', columnText: 'Số lần đặt hẹn', align: 'right' },
        // { columnId: 'soLanHuyHen', columnText: 'Số lần hủy hẹn', align: 'right' }
    ];

    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <ModalGuiTinNhanZalo
                isShowModal={isShowModalGuiTinZalo}
                idUpdate={''}
                arrIdCustomerChosed={arrIdChosed}
                onClose={() => setIsShowModalGuiTinZalo(false)}
                onOK={saveSMSOK}
            />
            <ModalGuiTinNhan
                isShowModal={isShowModalGuiTinSMS}
                idUpdate={''}
                onClose={() => setIsShowModalGuiTinSMS(false)}
                onOK={saveSMSOK}
                arrIdCustomerChosed={arrIdChosed}
                idLoaiTin={LoaiTin.TIN_THUONG}
            />
            <Box paddingTop={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} lg={12} md={12}>
                        <Grid container alignItems="baseline" spacing={2} justifyContent={'space-between'}>
                            <Grid item xs={12} sm={6} md={5} lg={4}>
                                <span className="page-title"> Báo cáo khách hàng chưa quay lại</span>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={4.5}>
                                <Stack direction={'row'} justifyContent={'end'} spacing={1}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        onChange={(e) => {
                                            setTxtSearch(e.target.value);
                                        }}
                                        onKeyDown={handleKeyDownTextSearch}
                                        className="text-search"
                                        variant="outlined"
                                        type="search"
                                        placeholder="Tìm kiếm"
                                        InputProps={{
                                            startAdornment: (
                                                <IconButton onClick={hanClickIconSearch}>
                                                    <Search />
                                                </IconButton>
                                            )
                                        }}
                                    />
                                    <Button
                                        variant="outlined"
                                        onClick={exportToExcel}
                                        startIcon={<FileUploadIcon />}
                                        sx={{
                                            borderColor: '#CDC9CD!important',
                                            bgcolor: '#fff!important',
                                            color: '#333233',
                                            fontSize: '14px',
                                            display: abpCustom.isGrandPermission('Pages.QuyHoaDon.Export') ? '' : 'none'
                                        }}>
                                        Xuất
                                    </Button>

                                    <ButtonOnlyIcon
                                        icon={
                                            <FilterAltOutlinedIcon
                                                titleAccess="Lọc nâng cao"
                                                sx={{ width: 20 }}
                                                onClick={(event) => setAnchorElFilter(event.currentTarget)}
                                            />
                                        }
                                        style={{ width: 50, backgroundColor: 'white' }}
                                    />
                                    <PopoverFilterBaoCaoCheckIn
                                        anchorEl={anchorElFilter}
                                        paramFilter={paramSearch}
                                        handleClose={() => setAnchorElFilter(null)}
                                        handleApply={ApplyFilter}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>

                        <Grid container paddingTop={1} spacing={2} alignItems={'baseline'}>
                            <Grid item xs={0} md={0} lg={3}></Grid>
                            <Grid item xs={12} md={7.5} lg={4.5}>
                                <TabContext value={tabActive}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <TabList onChange={handleChangeTab}>
                                            {arrTab?.map((x) => (
                                                <Tab key={x.value} label={x.text} value={x.value} />
                                            ))}
                                        </TabList>
                                    </Box>
                                </TabContext>
                            </Grid>
                            <Grid item xs={12} md={3.5} lg={2}>
                                {tabActive === '-1' && (
                                    <Stack
                                        spacing={1}
                                        direction={'row'}
                                        fontStyle={'italic'}
                                        sx={{
                                            input: {
                                                textAlign: 'center',
                                                fontWeight: 500
                                            }
                                        }}>
                                        <Typography variant="body2">Từ</Typography>
                                        <TextField
                                            size="small"
                                            variant="standard"
                                            value={paramSearch?.soNgayChuaCheckIn_From ?? ''}
                                            onChange={(e) =>
                                                setParamSearch({
                                                    ...paramSearch,
                                                    soNgayChuaCheckIn_From: parseInt(e.target.value)
                                                })
                                            }
                                        />
                                        <Typography variant="body2">đến</Typography>
                                        <TextField
                                            size="small"
                                            variant="standard"
                                            value={paramSearch?.soNgayChuaCheckIn_To ?? ''}
                                            onChange={(e) =>
                                                setParamSearch({
                                                    ...paramSearch,
                                                    soNgayChuaCheckIn_To: parseInt(e.target.value)
                                                })
                                            }
                                        />
                                        <Typography variant="body2">ngày</Typography>
                                    </Stack>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={12} md={12}>
                        <Stack
                            direction={'row'}
                            spacing={1}
                            justifyContent={'flex-end'}
                            sx={{
                                '& button': {
                                    height: '40px'
                                }
                            }}>
                            <Stack sx={{ display: 'none' }}>
                                <TextField
                                    label="Thời gian check-in"
                                    size="small"
                                    fullWidth
                                    variant="outlined"
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            height: '40px!important'
                                        },
                                        backgroundColor: 'white'
                                    }}
                                    onClick={(event) => setAnchorDateEl(event.currentTarget)}
                                    value={`${format(
                                        new Date(paramSearch.fromDate as string),
                                        'dd/MM/yyyy'
                                    )} - ${format(new Date(paramSearch.toDate as string), 'dd/MM/yyyy')}`}
                                />
                                <DateFilterCustom
                                    id="popover-date-filter"
                                    open={openDateFilter}
                                    anchorEl={anchorDateEl}
                                    onClose={() => setAnchorDateEl(null)}
                                    onApplyDate={onApplyFilterDate}
                                />
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>

                <Grid container style={{ marginTop: '24px', paddingRight: '8px' }}>
                    <Grid item xs={8}>
                        {arrIdChosed?.length > 0 && (
                            <ActionRowSelect
                                lstOption={
                                    [
                                        {
                                            id: SMS_HinhThucGuiTin.ZALO.toString(),
                                            text: 'Gửi tin zalo',
                                            isShow: abpCustom.isGrandPermission('Pages.QuyHoaDon.Delete')
                                        },
                                        {
                                            id: SMS_HinhThucGuiTin.SMS.toString(),
                                            text: 'Gửi tin SMS',
                                            isShow: abpCustom.isGrandPermission('Pages.QuyHoaDon.Print')
                                        }
                                    ] as IList[]
                                }
                                countRowSelected={arrIdChosed.length}
                                title="khách hàng"
                                choseAction={DataGrid_handleAction}
                                removeItemChosed={() => {
                                    setArrIdChosed([]);
                                    setIsCheckAll(false);
                                }}
                            />
                        )}
                    </Grid>
                </Grid>

                <Box marginTop={arrIdChosed.length > 0 ? 1 : 2}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Stack className="page-box-right">
                                <TableContainer className="data-grid-row">
                                    <Table>
                                        <TableHead>
                                            <MyHeaderTable
                                                showAction={false}
                                                isCheckAll={isCheckAll}
                                                sortBy={paramSearch?.columnSort ?? ''}
                                                sortType={paramSearch?.typeSort ?? 'asc'}
                                                onRequestSort={onSortTable}
                                                onSelectAllClick={onClickCheckAll}
                                                listColumnHeader={listColumnHeader}
                                            />
                                        </TableHead>
                                        <TableBody>
                                            {pageDataBaoCao?.items?.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell align="center" className="td-check-box">
                                                        <Checkbox
                                                            checked={arrIdChosed.includes(row.idKhachHang)}
                                                            onChange={(event) =>
                                                                onClickCheckOne(event, row.idKhachHang)
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 100, maxWidth: 100 }}>
                                                        {row?.maKhachHang}
                                                    </TableCell>
                                                    <TableCell className="lableOverflow" title={row?.tenKhachHang}>
                                                        {row?.tenKhachHang}
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 100, maxWidth: 100 }}>
                                                        {row?.soDienThoai}
                                                    </TableCell>

                                                    <TableCell align="right" sx={{ minWidth: 100, maxWidth: 100 }}>
                                                        {new Intl.NumberFormat('vi-VN').format(row?.soLanCheckIn ?? 0)}
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ minWidth: 100, maxWidth: 100 }}>
                                                        {utils.checkNull(row?.ngayCheckInGanNhat)
                                                            ? ''
                                                            : format(
                                                                  new Date(row?.ngayCheckInGanNhat ?? new Date()),
                                                                  'dd/MM/yyyy'
                                                              )}
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ minWidth: 100, maxWidth: 100 }}>
                                                        {row?.soNgayChuaCheckIn == -1
                                                            ? ''
                                                            : new Intl.NumberFormat('vi-VN').format(
                                                                  row?.soNgayChuaCheckIn ?? 0
                                                              )}
                                                    </TableCell>
                                                    {/* <TableCell align="right">
                                                        {new Intl.NumberFormat('vi-VN').format(row?.soLanDatHen ?? 0)}
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        {new Intl.NumberFormat('vi-VN').format(row?.soLanHuyHen ?? 0)}
                                                    </TableCell> */}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        {pageDataBaoCao?.totalCount == 0 && (
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
                            </Stack>
                        </Grid>
                    </Grid>

                    <CustomTablePagination
                        currentPage={paramSearch.currentPage ?? 0}
                        rowPerPage={paramSearch.pageSize ?? 10}
                        totalRecord={pageDataBaoCao.totalCount ?? 0}
                        totalPage={pageDataBaoCao.totalPage}
                        handlePerPageChange={handlePerPageChange}
                        handlePageChange={handleChangePage}
                    />
                </Box>
            </Box>
        </>
    );
}
