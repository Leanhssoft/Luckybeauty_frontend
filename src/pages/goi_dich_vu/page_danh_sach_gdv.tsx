import {
    Button,
    Checkbox,
    Grid,
    IconButton,
    Pagination,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    TextField
} from '@mui/material';
import { Search } from '@mui/icons-material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import DateFilterCustom from '../../components/DatetimePicker/DateFilterCustom';
import { format, lastDayOfMonth } from 'date-fns';
import { HoaDonRequestDto } from '../../services/dto/ParamSearchDto';
import { useContext, useEffect, useRef, useState } from 'react';
import AppConsts, { LoaiChungTu, LoaiNhatKyThaoTac } from '../../lib/appconst';
import { TrangThaiHoaDon } from '../../services/ban_hang/HoaDonConst';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import PageHoaDonDto from '../../services/ban_hang/PageHoaDonDto';
import ButtonOnlyIcon from '../../components/Button/ButtonOnlyIcon';
import { IHeaderTable, MyHeaderTable } from '../../components/Table/MyHeaderTable';
import utils from '../../utils/utils';
import HoaDonService from '../../services/ban_hang/HoaDonService';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import PopoverFilterHoaDon from '../ban_hang/Giao_dich_thanh_toan/PopoverFilterHoaDon';
import { OptionPage } from '../../components/Pagination/OptionPage';
import { LabelDisplayedRows } from '../../components/Pagination/LabelDisplayedRows';
import fileDowloadService from '../../services/file-dowload.service';
import PageDetailGDV from './page_detail_gdv';
import abpCustom from '../../components/abp-custom';
import ActionRowSelect from '../../components/DataGrid/ActionRowSelect';
import { IList } from '../../services/dto/IList';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import { PropConfirmOKCancel } from '../../utils/PropParentToChild';
import { CreateNhatKyThaoTacDto } from '../../services/nhat_ky_hoat_dong/dto/CreateNhatKyThaoTacDto';
import nhatKyHoatDongService from '../../services/nhat_ky_hoat_dong/nhatKyHoatDongService';
import DataMauIn from '../admin/settings/mau_in/DataMauIn';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';
import { ChiNhanhDto } from '../../services/chi_nhanh/Dto/chiNhanhDto';
import uploadFileService from '../../services/uploadFileService';
import MauInServices from '../../services/mau_in/MauInServices';
import { BangBaoLoiFileimportDto } from '../../services/dto/BangBaoLoiFileimportDto';
import { FileUpload } from '../../services/dto/FileUpload';
import ImportExcel from '../../components/ImportComponent/ImportExcel';
import BangBaoLoiFileImport from '../../components/ImportComponent/BangBaoLoiFileImport';

export default function PageDanhSachGDV() {
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;

    const firstLoad = useRef(true);
    const [anchorDateEl, setAnchorDateEl] = useState<HTMLDivElement | null>(null);
    const openDateFilter = Boolean(anchorDateEl);
    const [txtSearch, setTxtSearch] = useState('');
    const [arrIdChosed, setArrIdChosed] = useState<string[]>([]);
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [footerTable_TongThanhToan, setFooterTable_TongThanhToan] = useState(0);
    const [footerTable_DaThanhToan, setFooterTable_DaThanhToan] = useState(0);
    const [footerTable_ConNo, setFooterTable_ConNo] = useState(0);
    const [isOpenFormDetail, setIsOpenFormDetail] = useState(false);
    const [invoiceChosing, setInvoiceChosing] = useState<PageHoaDonDto | null>(null);
    const roleXemDanhSach = abpCustom.isGrandPermission('Pages.GoiDichVu.XemDanhSach');
    const [isImporting, setIsImporting] = useState<boolean>(false);
    const [isShowImport, setShowImport] = useState<boolean>(false);
    const [lstErrImport, setLstErrImport] = useState<BangBaoLoiFileimportDto[]>([]);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [confirmDialog, setConfirmDialog] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });
    const [paramSearch, setParamSearch] = useState<HoaDonRequestDto>({
        textSearch: '',
        idChiNhanhs: [chinhanh?.id],
        idLoaiChungTus: [LoaiChungTu.GOI_DICH_VU],
        currentPage: 1,
        pageSize: AppConsts.pageOption[0].value,
        columnSort: 'NgayLapHoaDon',
        typeSort: 'DESC',
        fromDate: format(new Date(), 'yyyy-MM-01'),
        toDate: format(lastDayOfMonth(new Date()), 'yyyy-MM-dd'),
        trangThais: [TrangThaiHoaDon.HOAN_THANH]
    });

    const [pageDataHoaDon, setPageDataHoaDon] = useState<PagedResultDto<PageHoaDonDto>>({
        totalCount: 0,
        totalPage: 0,
        items: []
    });

    const GetListGoiDichVu = async () => {
        if (!roleXemDanhSach) return;
        const param = { ...paramSearch };
        param.textSearch = txtSearch;
        const data = await HoaDonService.GetListHoaDon(paramSearch);
        setPageDataHoaDon({
            ...pageDataHoaDon,
            items: data?.items,
            totalCount: data?.totalCount ?? 0,
            totalPage: utils.getTotalPage(data?.totalCount, paramSearch?.pageSize)
        });

        if (data?.items?.length > 0) {
            const firstRow = data?.items[0];
            setFooterTable_TongThanhToan(firstRow?.sumTongThanhToan ?? 0);
            setFooterTable_DaThanhToan(firstRow?.sumDaThanhToan ?? 0);
            setFooterTable_ConNo((firstRow?.sumTongThanhToan ?? 0) - (firstRow?.sumDaThanhToan ?? 0));
        } else {
            setFooterTable_TongThanhToan(0);
            setFooterTable_DaThanhToan(0);
            setFooterTable_ConNo(0);
        }
    };

    const PageLoad = async () => {
        await GetListGoiDichVu();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        GetListGoiDichVu();
    }, [paramSearch]);

    const handleKeyDownTextSearch = (event: any) => {
        if (event.keyCode === 13) {
            hanClickIconSearch();
        }
    };
    const hanClickIconSearch = () => {
        setParamSearch({
            ...paramSearch,
            textSearch: txtSearch,
            currentPage: 1
        });
    };
    const onApplyFilterDate = async (from: string, to: string, txtShow: string) => {
        setAnchorDateEl(null);
        setParamSearch({ ...paramSearch, fromDate: from, toDate: to, currentPage: 1 });
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

        const arrIdThisPage = pageDataHoaDon?.items?.map((x) => {
            return x.id;
        });
        if (isCheck) {
            setArrIdChosed([...arrIdChosed, ...arrIdThisPage]);
        } else {
            setArrIdChosed(arrIdChosed.filter((x) => !arrIdThisPage.includes(x)));
        }
    };

    const onClickCheckOne = (event: React.ChangeEvent<HTMLInputElement>, rowId: string) => {
        const isCheck = event.currentTarget.checked;
        if (isCheck) {
            setArrIdChosed([...arrIdChosed, rowId]);

            const arrIdThisPage = pageDataHoaDon?.items?.map((x) => {
                return x.id;
            });
            const arrExist = arrIdChosed?.filter((x) => arrIdThisPage.includes(x));
            setIsCheckAll(arrIdThisPage.length === arrExist.length + 1);
        } else {
            setArrIdChosed(arrIdChosed.filter((x) => x !== rowId));
            setIsCheckAll(false);
        }
    };

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

    const [anchorElFilter, setAnchorElFilter] = useState<SVGSVGElement | null>(null);
    const ApplyFilter = (paramFilter: HoaDonRequestDto) => {
        setAnchorElFilter(null);
        setParamSearch({
            ...paramSearch,
            currentPage: 1,
            idLoaiChungTus: [LoaiChungTu.GOI_DICH_VU],
            trangThais: paramFilter?.trangThais,
            trangThaiNos: paramFilter?.trangThaiNos,
            idChiNhanhs: paramFilter?.idChiNhanhs
        });
    };

    const ExportToExcel = async () => {
        const param = { ...paramSearch };
        param.textSearch = txtSearch;
        param.currentPage = 1;
        param.pageSize = pageDataHoaDon?.totalCount ?? 0;
        const data = await HoaDonService.ExportToExcel(param);
        fileDowloadService.downloadExportFile(data);
    };

    const OpenFormDetail = (item: PageHoaDonDto) => {
        setIsOpenFormDetail(true);
        setInvoiceChosing(item);
    };

    const gotoPageList = () => {
        setIsOpenFormDetail(false);
    };
    const DataGrid_handleAction = async (item: any) => {
        switch (item.id) {
            case '1':
                {
                    setConfirmDialog({
                        ...confirmDialog,
                        show: true,
                        mes: `Bạn có chắc chắn muốn xóa ${arrIdChosed.length} gói dịch vụ này không?`
                    });
                }
                break;
            case '2':
                {
                    let htmlPrint = '';
                    for (let i = 0; i < arrIdChosed.length; i++) {
                        const idHoaDon = arrIdChosed[i].toString();
                        const dataHoaDon = await HoaDonService.GetInforHoaDon_byId(idHoaDon);
                        const dataCTHD = await HoaDonService.GetChiTietHoaDon_byIdHoaDon(idHoaDon);

                        if (dataHoaDon.length > 0) {
                            DataMauIn.hoadon = dataHoaDon[0];
                            DataMauIn.hoadonChiTiet = dataCTHD;
                            DataMauIn.khachhang = {
                                maKhachHang: dataHoaDon[0]?.maKhachHang,
                                tenKhachHang: dataHoaDon[0]?.tenKhachHang,
                                soDienThoai: DataMauIn.hoadon?.soDienThoai
                            } as KhachHangItemDto;
                            DataMauIn.chinhanh = {
                                tenChiNhanh: DataMauIn.hoadon?.tenChiNhanh
                            } as ChiNhanhDto;
                            DataMauIn.congty = appContext.congty;
                            DataMauIn.congty.logo = uploadFileService.GoogleApi_NewLink(DataMauIn.congty?.logo);
                            const tempMauIn = await MauInServices.GetContentMauInMacDinh(1, LoaiChungTu.GOI_DICH_VU);
                            let newHtml = DataMauIn.replaceChiTietHoaDon(tempMauIn);
                            newHtml = DataMauIn.replaceChiNhanh(newHtml);
                            newHtml = DataMauIn.replaceHoaDon(newHtml);
                            newHtml = await DataMauIn.replacePhieuThuChi(newHtml);
                            if (i < arrIdChosed?.length - 1) {
                                htmlPrint = htmlPrint.concat(newHtml, `<p style="page-break-before:always;"></p>`);
                            } else {
                                htmlPrint = htmlPrint.concat(newHtml);
                            }
                        }
                    }
                    DataMauIn.Print(htmlPrint);
                }
                break;
        }
    };

    const onAgreeRemoveInvoice = async () => {
        setArrIdChosed([]);
        setIsCheckAll(false);

        await HoaDonService.Delete_MultipleHoaDon(arrIdChosed);
        setConfirmDialog({ ...confirmDialog, show: false });
        setObjAlert({ show: true, mes: `Xóa thành công ${arrIdChosed?.length} hóa đơn`, type: 1 });

        setPageDataHoaDon({
            ...pageDataHoaDon,
            items: pageDataHoaDon?.items?.filter((x) => !arrIdChosed.includes(x.id)),
            totalCount: pageDataHoaDon?.totalCount - arrIdChosed?.length
        });

        const diary = {
            idChiNhanh: chinhanh.id,
            chucNang: `Danh mục gói dịch vụ`,
            noiDung: `Xóa ${arrIdChosed?.length} hóa đơn`,
            noiDungChiTiet: `Xóa ${arrIdChosed?.length} hóa đơn `,
            loaiNhatKy: LoaiNhatKyThaoTac.DELETE
        } as CreateNhatKyThaoTacDto;
        await nhatKyHoatDongService.createNhatKyThaoTac(diary);
    };

    const onImportShow = () => {
        setShowImport(!isShowImport);
        setIsImporting(false);
        setLstErrImport([]);
    };
    const downloadImportTemplate = async () => {
        const result = await uploadFileService.downloadImportTemplate('FileImport_TonDauGoiDichVu.xlsx');
        fileDowloadService.downloadExportFile(result);
    };
    const handleImportData = async (input: FileUpload) => {
        setIsImporting(true);
        const lstErr = await HoaDonService.CheckData_FileImportTonDauGDV(input);
        if (lstErr?.length > 0) {
            setLstErrImport([...lstErr]);
        } else {
            const data = await HoaDonService.ImportFileTonDauGDV(input, chinhanh.id);
            if (data?.length > 0) {
                setLstErrImport([...data]);
            } else {
                setObjAlert({ ...objAlert, show: true, mes: 'Import thành công' });
                await GetListGoiDichVu();
            }
        }
        setIsImporting(false);
        setShowImport(false);
    };

    const listColumnHeader: IHeaderTable[] = [
        { columnId: 'maHoaDon', columnText: 'Mã hóa đơn' },
        { columnId: 'ngayLapHoaDon', columnText: 'Ngày lập' },
        { columnId: 'tenKhachHang', columnText: 'Tên khách hàng' },
        { columnId: 'tongThanhToan', columnText: 'Tổng phải trả', align: 'right' },
        { columnId: 'khachDaTra', columnText: 'Khách đã trả', align: 'right' },
        { columnId: 'conNo', columnText: 'Còn nợ', align: 'right' },
        { columnId: 'ghiChuHD', columnText: 'Ghi chú' }
    ];

    if (isOpenFormDetail) return <PageDetailGDV itemHD={invoiceChosing} gotoBack={gotoPageList} />;

    return (
        <>
            <ConfirmDelete
                isShow={confirmDialog.show}
                title={confirmDialog.title}
                mes={confirmDialog.mes}
                onOk={onAgreeRemoveInvoice}
                onCancel={() => setConfirmDialog({ ...confirmDialog, show: false })}></ConfirmDelete>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <ImportExcel
                tieude={'Nhập file tồn đầu gói dịch vụ'}
                isOpen={isShowImport}
                isImporting={isImporting}
                onClose={onImportShow}
                downloadImportTemplate={downloadImportTemplate}
                importFile={handleImportData}
            />
            <BangBaoLoiFileImport
                isOpen={lstErrImport.length > 0}
                lstError={lstErrImport}
                onClose={() => setLstErrImport([])}
                clickImport={() => console.log(lstErrImport)}
            />

            <Grid container paddingTop={2}>
                <Grid item lg={12} md={12} sm={12} width={'100%'}>
                    <Grid container>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <span className="page-title"> Danh sách gói dịch vụ</span>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12} marginTop={3}>
                            <Grid container justifyContent={'space-between'}>
                                <Grid item lg={5} md={6} sm={7} xs={12}>
                                    <Stack direction={'row'} spacing={1}>
                                        {abpCustom.isGrandPermission('Pages.GoiDichVu') && (
                                            <Button
                                                variant="outlined"
                                                className="btn-outline-hover"
                                                onClick={onImportShow}
                                                startIcon={<FileDownloadIcon />}>
                                                Import tồn đầu
                                            </Button>
                                        )}
                                        <Button
                                            variant="outlined"
                                            className="btn-outline-hover"
                                            onClick={ExportToExcel}
                                            sx={{
                                                display: abpCustom.isGrandPermission('Pages.GoiDichVu.Export')
                                                    ? ''
                                                    : 'none'
                                            }}
                                            startIcon={<FileUploadIcon />}>
                                            Xuất file
                                        </Button>
                                    </Stack>
                                </Grid>
                                <Grid item lg={6} md={6} sm={5} xs={12} display={'flex'} justifyContent={'end'}>
                                    <Grid container spacing={1}>
                                        <Grid item lg={8} md={6} sm={12} xs={12}>
                                            <TextField
                                                size="small"
                                                placeholder="Tìm kiếm"
                                                sx={{ backgroundColor: 'white' }}
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: (
                                                        <IconButton type="button" onClick={hanClickIconSearch}>
                                                            <Search />
                                                        </IconButton>
                                                    )
                                                }}
                                                onChange={(event) => {
                                                    setTxtSearch(event.target.value);
                                                }}
                                                onKeyDown={(event) => {
                                                    handleKeyDownTextSearch(event);
                                                }}
                                            />
                                        </Grid>
                                        <Grid item lg={4} md={6} sm={12} xs={12}>
                                            <Stack spacing={1} direction={'row'}>
                                                <Stack>
                                                    <TextField
                                                        label="Thời gian"
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
                                                        )} - ${format(
                                                            new Date(paramSearch.toDate as string),
                                                            'dd/MM/yyyy'
                                                        )}`}
                                                    />
                                                    <DateFilterCustom
                                                        id="popover-date-filter"
                                                        open={openDateFilter}
                                                        anchorEl={anchorDateEl}
                                                        onClose={() => setAnchorDateEl(null)}
                                                        onApplyDate={onApplyFilterDate}
                                                    />
                                                </Stack>
                                                <ButtonOnlyIcon
                                                    icon={
                                                        <FilterAltOutlinedIcon
                                                            titleAccess="Lọc nâng cao"
                                                            sx={{ width: 20 }}
                                                            onClick={(event) => setAnchorElFilter(event.currentTarget)}
                                                        />
                                                    }
                                                    style={{
                                                        width: 40,
                                                        border: '1px solid #ccc',
                                                        backgroundColor: 'white'
                                                    }}></ButtonOnlyIcon>
                                                <PopoverFilterHoaDon
                                                    anchorEl={anchorElFilter}
                                                    paramFilter={paramSearch}
                                                    handleClose={() => setAnchorElFilter(null)}
                                                    handleApply={ApplyFilter}
                                                />
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        {arrIdChosed?.length > 0 && (
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <ActionRowSelect
                                    lstOption={
                                        [
                                            {
                                                id: '1',
                                                text: 'Xóa hóa đơn',
                                                isShow: abpCustom.isGrandPermission('Pages.GoiDichVu.Delete')
                                            },
                                            {
                                                id: '2',
                                                text: 'In hóa đơn',
                                                isShow: abpCustom.isGrandPermission('Pages.GoiDichVu.Print')
                                            }
                                        ] as IList[]
                                    }
                                    countRowSelected={arrIdChosed.length}
                                    title="gói dịch vụ"
                                    choseAction={DataGrid_handleAction}
                                    removeItemChosed={() => {
                                        setArrIdChosed([]);
                                        setIsCheckAll(false);
                                    }}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Grid>
                <Grid item lg={12} md={12} sm={12} paddingTop={2} width={'100%'}>
                    <Stack className="page-box-right">
                        <TableContainer className="data-grid-row">
                            <Table>
                                <TableHead>
                                    <MyHeaderTable
                                        showAction={false}
                                        isCheckAll={isCheckAll}
                                        sortBy={paramSearch?.columnSort ?? ''}
                                        sortType={paramSearch?.typeSort ?? 'desc'}
                                        onRequestSort={onSortTable}
                                        onSelectAllClick={onClickCheckAll}
                                        listColumnHeader={listColumnHeader}
                                    />
                                </TableHead>

                                <TableBody>
                                    {pageDataHoaDon?.items?.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center" className="td-check-box">
                                                <Checkbox
                                                    checked={arrIdChosed.includes(row.id)}
                                                    onChange={(event) => onClickCheckOne(event, row.id)}
                                                />
                                            </TableCell>
                                            <TableCell
                                                sx={{ minWidth: 100, maxWidth: 100 }}
                                                onClick={() => OpenFormDetail(row)}>
                                                {row?.maHoaDon}
                                            </TableCell>
                                            <TableCell sx={{ maxWidth: 150 }} onClick={() => OpenFormDetail(row)}>
                                                {format(new Date(row?.ngayLapHoaDon), 'dd/MM/yyyy')}
                                            </TableCell>
                                            <TableCell
                                                className="lableOverflow"
                                                sx={{ maxWidth: 200 }}
                                                title={row?.tenKhachHang}
                                                onClick={() => OpenFormDetail(row)}>
                                                {row?.tenKhachHang}
                                            </TableCell>
                                            <TableCell align="right" onClick={() => OpenFormDetail(row)}>
                                                {new Intl.NumberFormat('vi-VN').format(row?.tongThanhToan ?? 0)}
                                            </TableCell>
                                            <TableCell align="right" onClick={() => OpenFormDetail(row)}>
                                                {new Intl.NumberFormat('vi-VN').format(row?.daThanhToan ?? 0)}
                                            </TableCell>
                                            <TableCell align="right" onClick={() => OpenFormDetail(row)}>
                                                {new Intl.NumberFormat('vi-VN').format(row?.conNo ?? 0)}
                                            </TableCell>
                                            <TableCell
                                                className="lableOverflow"
                                                title={row?.ghiChuHD}
                                                sx={{ minWidth: 150, maxWidth: 200 }}
                                                onClick={() => OpenFormDetail(row)}>
                                                {row?.ghiChuHD}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                {roleXemDanhSach ? (
                                    <TableFooter>
                                        {pageDataHoaDon?.totalCount > 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4}>Tổng cộng</TableCell>
                                                <TableCell align="right">
                                                    {new Intl.NumberFormat('vi-VN').format(footerTable_TongThanhToan)}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {new Intl.NumberFormat('vi-VN').format(footerTable_DaThanhToan)}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {new Intl.NumberFormat('vi-VN').format(footerTable_ConNo)}
                                                </TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        ) : (
                                            <TableRow className="table-empty">
                                                <TableCell colSpan={20} align="center">
                                                    Không có dữ liệu
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableFooter>
                                ) : (
                                    <TableFooter>
                                        <TableCell colSpan={20} align="center">
                                            Không có quyền xem danh sách
                                        </TableCell>
                                    </TableFooter>
                                )}
                            </Table>
                        </TableContainer>
                    </Stack>
                </Grid>

                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={4} md={4} lg={4} sm={4}>
                            <OptionPage changeNumberOfpage={changeNumberOfpage} />
                        </Grid>
                        <Grid item xs={8} md={8} lg={8} sm={8}>
                            <Stack direction="row" style={{ float: 'right' }}>
                                <LabelDisplayedRows
                                    currentPage={paramSearch.currentPage}
                                    pageSize={paramSearch.pageSize}
                                    totalCount={pageDataHoaDon.totalCount}
                                />
                                <Pagination
                                    shape="rounded"
                                    count={pageDataHoaDon.totalPage}
                                    page={paramSearch.currentPage}
                                    defaultPage={paramSearch.pageSize}
                                    onChange={(e, newVal) => handleChangePage(newVal)}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}
