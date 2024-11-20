import {
    Button,
    FormControlLabel,
    Grid,
    IconButton,
    Pagination,
    Radio,
    RadioGroup,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import { Search } from '@mui/icons-material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import AddIcon from '@mui/icons-material/Add';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ClearIcon from '@mui/icons-material/Clear';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { format, lastDayOfMonth } from 'date-fns';
import { HoaDonRequestDto } from '../../services/dto/ParamSearchDto';
import { useContext, useEffect, useRef, useState } from 'react';
import AppConsts, { DateType, LoaiChungTu, LoaiHoaHongHoaDon, LoaiNhatKyThaoTac, TypeAction } from '../../lib/appconst';
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
import ModalNapTheGiaTri from './modal_nap_the';
import { IPropModal } from '../../services/dto/IPropsComponent';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import { PropConfirmOKCancel } from '../../utils/PropParentToChild';
import ImportExcel from '../../components/ImportComponent/ImportExcel';
import { BangBaoLoiFileimportDto } from '../../services/dto/BangBaoLoiFileimportDto';
import uploadFileService from '../../services/uploadFileService';
import { FileUpload } from '../../services/dto/FileUpload';
import BangBaoLoiFileImport from '../../components/ImportComponent/BangBaoLoiFileImport';
import PageDetailsTGT from './page_details_TGT';
import ModalDieuChinhSoDuTGT from './modal_dieu_chinh_so_du';
import { CreateNhatKyThaoTacDto } from '../../services/nhat_ky_hoat_dong/dto/CreateNhatKyThaoTacDto';
import nhatKyHoatDongService from '../../services/nhat_ky_hoat_dong/nhatKyHoatDongService';
import abpCustom from '../../components/abp-custom';

export default function PageDanhSachTGT() {
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;

    const firstLoad = useRef(true);
    const firstLoad_changeLoaiChungTu = useRef(true);
    const [anchorDateEl, setAnchorDateEl] = useState<HTMLDivElement | null>(null);
    const openDateFilter = Boolean(anchorDateEl);
    const [txtSearch, setTxtSearch] = useState('');
    const [loaiChungTuFilter, setLoaiChungTuFilter] = useState(LoaiChungTu.THE_GIA_TRI);
    const [arrIdChosed, setArrIdChosed] = useState<string[]>([]);
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [footerTable_TongThanhToan, setFooterTable_TongThanhToan] = useState(0);
    const [footerTable_DaThanhToan, setFooterTable_DaThanhToan] = useState(0);
    const [footerTable_ConNo, setFooterTable_ConNo] = useState(0);
    const [isOpenFormDetail, setIsOpenFormDetail] = useState(false);
    const [invoiceChosing, setInvoiceChosing] = useState<PageHoaDonDto | null>(null);
    const [isShowImport, setShowImport] = useState<boolean>(false);
    const [isImporting, setIsImporting] = useState<boolean>(false);
    const [lstErrImport, setLstErrImport] = useState<BangBaoLoiFileimportDto[]>([]);
    const [propModalNapThe, setPropModalNapThe] = useState<IPropModal<PageHoaDonDto>>({
        isShowModal: false
    } as IPropModal<PageHoaDonDto>);
    const [propModalDieuChinhSoDu, setPropModalDieuChinhSoDu] = useState<IPropModal<PageHoaDonDto>>({
        isShowModal: false
    } as IPropModal<PageHoaDonDto>);
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
        idLoaiChungTus: [LoaiChungTu.THE_GIA_TRI],
        currentPage: 1,
        pageSize: AppConsts.pageOption[0].value,
        columnSort: 'NgayLapHoaDon',
        typeSort: 'DESC',
        fromDate: format(new Date(), 'yyyy-MM-01'),
        toDate: format(lastDayOfMonth(new Date()), 'yyyy-MM-dd'),
        dateType: DateType.THANG_NAY,
        trangThais: [TrangThaiHoaDon.HOAN_THANH]
    });

    const [pageDataHoaDon, setPageDataHoaDon] = useState<PagedResultDto<PageHoaDonDto>>({
        totalCount: 0,
        totalPage: 0,
        items: []
    });

    const roleXemDanhSach =
        loaiChungTuFilter === LoaiChungTu.THE_GIA_TRI
            ? abpCustom.isGrandPermission('Pages.TheGiaTri.XemDanhSach')
            : abpCustom.isGrandPermission('Pages.PhieuDieuChinh.XemDanhSach');
    const roleExport =
        loaiChungTuFilter === LoaiChungTu.THE_GIA_TRI
            ? abpCustom.isGrandPermission('Pages.TheGiaTri.Export')
            : abpCustom.isGrandPermission('Pages.PhieuDieuChinh.Export');
    const roleEditPhieuDieuChinh = abpCustom.isGrandPermission('Pages.PhieuDieuChinh.Edit');
    const roleDeletePhieuDieuChinh = abpCustom.isGrandPermission('Pages.PhieuDieuChinh.Delete');

    const GetListTheGiaTri = async () => {
        if (!roleXemDanhSach) return;
        const param = { ...paramSearch };
        param.textSearch = txtSearch;
        param.idLoaiChungTus = [loaiChungTuFilter];
        const data = await HoaDonService.GetListHoaDon(param);
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
        await GetListTheGiaTri();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        GetListTheGiaTri();
    }, [paramSearch]);

    useEffect(() => {
        if (firstLoad_changeLoaiChungTu.current) {
            firstLoad_changeLoaiChungTu.current = false;
            return;
        }
        GetListTheGiaTri();
    }, [loaiChungTuFilter]);

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

    const phieuDieuChinh_doActionRow = async (typeAction: number, item: PageHoaDonDto) => {
        switch (typeAction) {
            case TypeAction.UPDATE:
                {
                    setPropModalDieuChinhSoDu({
                        ...propModalDieuChinhSoDu,
                        isShowModal: true,
                        isNew: false,
                        idUpdate: item?.id,
                        objUpDate: item
                    });
                }
                break;
            case TypeAction.DELETE:
                {
                    const check = await HoaDonService.CheckTheGiaTri_DaSuDung(item?.id ?? '');
                    if (check) {
                        setObjAlert({
                            ...objAlert,
                            show: true,
                            mes: `Số dư của Phiếu điều chỉnh ${item.maHoaDon} đã được sử dụng. Không thể hủy`,
                            type: 2
                        });
                        return;
                    }
                    setInvoiceChosing({ ...item });
                    setConfirmDialog({
                        ...confirmDialog,
                        show: true,
                        title: 'Xác nhận xóa',
                        mes: `Bạn có chắc chắn muốn hủy Phiếu điều chỉnh ${item.maHoaDon} không?`
                    });
                }
                break;
        }
    };

    const [anchorElFilter, setAnchorElFilter] = useState<SVGSVGElement | null>(null);
    const ApplyFilter = (paramFilter: HoaDonRequestDto) => {
        setAnchorElFilter(null);
        setParamSearch({
            ...paramSearch,
            currentPage: 1,
            trangThais: paramFilter?.trangThais,
            trangThaiNos: paramFilter?.trangThaiNos,
            idChiNhanhs: paramFilter?.idChiNhanhs,
            fromDate: paramFilter?.fromDate,
            toDate: paramFilter?.toDate,
            dateType: paramFilter?.dateType
        });
    };

    const ExportToExcel = async () => {
        const param = { ...paramSearch };
        param.textSearch = txtSearch;
        param.currentPage = 1;
        param.pageSize = pageDataHoaDon?.totalCount ?? 0;
        if (loaiChungTuFilter === LoaiChungTu.THE_GIA_TRI) {
            const data = await HoaDonService.ExportDanhSach_TheGiaTri(param);
            fileDowloadService.downloadExportFile(data);
        } else {
            const data = await HoaDonService.ExportDanhSach_PhieuDieuChinh(param);
            fileDowloadService.downloadExportFile(data);
        }
    };

    const OpenFormDetail = (item: PageHoaDonDto) => {
        setIsOpenFormDetail(true);
        setInvoiceChosing(item);
    };

    const gotoPageList = () => {
        setIsOpenFormDetail(false);
    };

    const showModalNapThe = () => {
        setPropModalNapThe({ ...propModalNapThe, isShowModal: true, isNew: true });
    };
    const showModalDieuChinhSoDu = () => {
        setPropModalDieuChinhSoDu({ ...propModalDieuChinhSoDu, isShowModal: true, isNew: true });
    };

    const changeLoaiChungTu = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = parseInt(e.target.value);
        setLoaiChungTuFilter(newVal);
        setParamSearch({
            ...paramSearch,
            idLoaiChungTus: [newVal]
        });
    };

    const saveOKTheNap = async (typeAction: number, dataSave: PageHoaDonDto | undefined) => {
        setPropModalNapThe({ ...propModalNapThe, isShowModal: false });
        setObjAlert({
            ...objAlert,
            show: true,
            mes: `${typeAction === TypeAction.INSEART ? 'Thêm mới' : 'Cập nhật'} thẻ giá trị thành công`
        });
        if (dataSave && loaiChungTuFilter === LoaiChungTu.THE_GIA_TRI) {
            switch (typeAction) {
                case TypeAction.INSEART:
                    {
                        setPageDataHoaDon({
                            ...pageDataHoaDon,
                            items: [dataSave, ...(pageDataHoaDon?.items ?? [])]
                        });
                    }
                    break;
            }
        }
    };
    const saveOKPhieuDieuChinh = async (typeAction: number, dataSave: PageHoaDonDto | undefined) => {
        setPropModalDieuChinhSoDu({ ...propModalDieuChinhSoDu, isShowModal: false });
        setObjAlert({
            ...objAlert,
            show: true,
            mes: `${typeAction === TypeAction.INSEART ? 'Thêm mới' : 'Cập nhật'} phiếu điều chỉnh thành công`
        });

        // chỉ thêm/xóa vào danh sách: nếu bộ lọc đang lọc cả phiếu điều chỉnh

        if (dataSave && loaiChungTuFilter === LoaiChungTu.PHIEU_DIEU_CHINH_TGT) {
            switch (typeAction) {
                case TypeAction.INSEART:
                    {
                        setPageDataHoaDon({
                            ...pageDataHoaDon,
                            items: [dataSave, ...(pageDataHoaDon?.items ?? [])]
                        });
                    }
                    break;
                case TypeAction.UPDATE:
                    {
                        setPageDataHoaDon({
                            ...pageDataHoaDon,
                            items: pageDataHoaDon?.items?.map((x) => {
                                if (x.id === invoiceChosing?.id) {
                                    return {
                                        ...x,
                                        idKhachHang: dataSave?.idKhachHang,
                                        tenKhachHang: dataSave?.tenKhachHang,
                                        soDienThoai: dataSave?.soDienThoai,
                                        tongTienHang: dataSave?.tongTienHang,
                                        tongThanhToan: dataSave?.tongThanhToan,
                                        tongTienHangChuaChietKhau: dataSave?.tongTienHangChuaChietKhau,
                                        tongTienHDSauVAT: dataSave?.tongTienHDSauVAT,
                                        ghiChuHD: dataSave?.ghiChuHD
                                    };
                                } else {
                                    return x;
                                }
                            })
                        });
                    }
                    break;
            }
        }
    };

    const onXoaPhieuDieuChinh = async () => {
        await HoaDonService.DeleteHoaDon(invoiceChosing?.id ?? '');
        setConfirmDialog({ ...confirmDialog, show: false });
        setObjAlert({ ...objAlert, show: true, mes: `Hủy phiếu điều chỉnh thành công` });

        setPageDataHoaDon({
            ...pageDataHoaDon,
            items: pageDataHoaDon?.items?.filter((x) => x.id !== invoiceChosing?.id),
            totalCount: pageDataHoaDon?.totalCount - 1
        });

        const diary = {
            idChiNhanh: chinhanh?.id,
            chucNang: `Danh mục phiếu điều chỉnh`,
            noiDung: `Xóa phiếu điều chỉnh`,
            noiDungChiTiet: `Xóa phiếu điều chỉnh ${invoiceChosing?.maHoaDon} của khách hàng ${invoiceChosing?.tenKhachHang}`,
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
        const result = await uploadFileService.downloadImportTemplate('FileImport_TonDauTGT.xlsx');
        fileDowloadService.downloadExportFile(result);
    };
    const handleImportData = async (input: FileUpload) => {
        setIsImporting(true);
        const lstErr = await HoaDonService.CheckData_FileImportTonDauTGT(input);
        if (lstErr?.length > 0) {
            setLstErrImport([...lstErr]);
        } else {
            const data = await HoaDonService.ImportFileImportTonDauTGT(input, chinhanh.id);
            if (data?.length > 0) {
                setLstErrImport([...data]);
            } else {
                setObjAlert({ ...objAlert, show: true, mes: 'Import thành công' });
                await GetListTheGiaTri();
            }
        }
        setShowImport(false);
        setIsImporting(false);
    };

    const listColumnHeader: IHeaderTable[] = [
        { columnId: 'maHoaDon', columnText: 'Mã thẻ' },
        { columnId: 'ngayLapHoaDon', columnText: 'Ngày lập' },
        { columnId: 'tenKhachHang', columnText: 'Tên khách hàng' },
        { columnId: 'soDienThoai', columnText: 'Số điện thoại' },
        { columnId: 'tongTienHang', columnText: 'Tổng tiền nạp', align: 'right' },
        { columnId: 'tongGiamGiaHD', columnText: 'Giảm giá', align: 'right' },
        { columnId: 'tongThanhToan', columnText: 'Phải thanh toán', align: 'right' },
        { columnId: 'khachDaTra', columnText: 'Đã thanh toán', align: 'right' },
        { columnId: 'conNo', columnText: 'Còn nợ', align: 'right' },
        // { columnId: 'nvthucHiens', columnText: 'Chiết khấu Nhân viên' },
        { columnId: 'ghiChuHD', columnText: 'Ghi chú' }
    ];
    const listColumnHeader_PhieuDC: IHeaderTable[] = [
        { columnId: 'maHoaDon', columnText: 'Mã phiếu' },
        { columnId: 'ngayLapHoaDon', columnText: 'Ngày điều chỉnh' },
        { columnId: 'tenKhachHang', columnText: 'Tên khách hàng' },
        { columnId: 'soDienThoai', columnText: 'Số điện thoại' },
        { columnId: 'tongTienHang', columnText: 'Giá trị điều chỉnh', align: 'right' },
        { columnId: 'ghiChuHD', columnText: 'Ghi chú' }
    ];

    if (isOpenFormDetail) return <PageDetailsTGT itemHD={invoiceChosing} gotoBack={gotoPageList} />;

    return (
        <>
            <ModalNapTheGiaTri
                isShowModal={propModalNapThe?.isShowModal ?? false}
                isNew={propModalNapThe.isNew}
                onClose={() => setPropModalNapThe({ ...propModalNapThe, isShowModal: false })}
                onOK={saveOKTheNap}
            />
            <ModalDieuChinhSoDuTGT
                isShowModal={propModalDieuChinhSoDu?.isShowModal ?? false}
                isNew={propModalDieuChinhSoDu.isNew}
                objUpDate={propModalDieuChinhSoDu?.objUpDate}
                onClose={() => setPropModalDieuChinhSoDu({ ...propModalDieuChinhSoDu, isShowModal: false })}
                onOK={saveOKPhieuDieuChinh}
            />
            <ImportExcel
                tieude={'Nhập file tồn đầu thẻ giá trị'}
                isOpen={isShowImport}
                onClose={onImportShow}
                isImporting={isImporting}
                downloadImportTemplate={downloadImportTemplate}
                importFile={handleImportData}
            />
            <BangBaoLoiFileImport
                isOpen={lstErrImport.length > 0}
                lstError={lstErrImport}
                onClose={() => setLstErrImport([])}
                clickImport={() => console.log(lstErrImport)}
            />
            <ConfirmDelete
                isShow={confirmDialog.show}
                title={confirmDialog.title}
                mes={confirmDialog.mes}
                onOk={onXoaPhieuDieuChinh}
                onCancel={() => setConfirmDialog({ ...confirmDialog, show: false })}
            />
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}
            />
            <Grid container paddingTop={2} spacing={2}>
                <Grid item lg={12} md={12} sm={12}>
                    <Grid container>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Stack
                                direction={{ lg: 'row', md: 'row', sm: 'row', xs: 'column' }}
                                justifyContent={'space-between'}>
                                <Typography variant="body1" fontWeight={500}>
                                    {loaiChungTuFilter === LoaiChungTu.THE_GIA_TRI
                                        ? 'Danh sách thẻ giá trị'
                                        : 'Danh sách phiếu điều chỉnh'}
                                </Typography>
                                <RadioGroup row value={loaiChungTuFilter} onChange={changeLoaiChungTu}>
                                    <FormControlLabel
                                        value={LoaiChungTu.THE_GIA_TRI}
                                        label="Thẻ giá tri"
                                        control={<Radio size="small" />}
                                    />
                                    <FormControlLabel
                                        value={LoaiChungTu.PHIEU_DIEU_CHINH_TGT}
                                        label="Phiếu điều chỉnh"
                                        control={<Radio size="small" />}
                                    />
                                </RadioGroup>
                            </Stack>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12} paddingTop={2}>
                            <Grid container spacing={2} justifyContent={'space-between'}>
                                <Grid item lg={7} md={12} sm={12} xs={12} display={'flex'} gap="8px">
                                    {abpCustom.isGrandPermission('Pages.TheGiaTri.Create') && (
                                        <Button variant="contained" onClick={showModalNapThe} startIcon={<AddIcon />}>
                                            Nạp thẻ
                                        </Button>
                                    )}

                                    {abpCustom.isGrandPermission('Pages.PhieuDieuChinh.Import') && (
                                        <Button
                                            variant="outlined"
                                            sx={{ backgroundColor: 'white', color: 'black' }}
                                            onClick={onImportShow}
                                            startIcon={<FileDownloadIcon />}>
                                            Import tồn đầu
                                        </Button>
                                    )}
                                    {abpCustom.isGrandPermission('Pages.PhieuDieuChinh.Create') && (
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            sx={{ backgroundColor: 'white' }}
                                            startIcon={<CurrencyExchangeIcon />}
                                            onClick={showModalDieuChinhSoDu}>
                                            Điều chỉnh số dư
                                        </Button>
                                    )}

                                    {roleExport && (
                                        <Button
                                            variant="outlined"
                                            sx={{ backgroundColor: 'white', color: 'black' }}
                                            onClick={ExportToExcel}
                                            startIcon={<FileUploadIcon />}>
                                            Xuất file
                                        </Button>
                                    )}
                                </Grid>
                                <Grid item lg={5} md={12} sm={12} xs={12}>
                                    <Stack spacing={1} direction={'row'}>
                                        <TextField
                                            size="small"
                                            placeholder="Tìm kiếm"
                                            fullWidth
                                            sx={{ backgroundColor: 'white' }}
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
                                        <ButtonOnlyIcon
                                            icon={
                                                <FilterAltOutlinedIcon
                                                    sx={{ width: 20 }}
                                                    titleAccess="Lọc nâng cao"
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
                <Grid item lg={12} md={12} sm={12} paddingTop={3} width={'100%'}>
                    <Stack className="page-box-right">
                        <TableContainer className="data-grid-row">
                            {loaiChungTuFilter === LoaiChungTu.THE_GIA_TRI ? (
                                <Table>
                                    <TableHead>
                                        <MyHeaderTable
                                            showAction={false}
                                            isCheckAll={isCheckAll}
                                            isShowCheck={false}
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
                                                <TableCell onClick={() => OpenFormDetail(row)}>
                                                    {row?.soDienThoai}
                                                </TableCell>
                                                <TableCell align="right" onClick={() => OpenFormDetail(row)}>
                                                    {new Intl.NumberFormat('vi-VN').format(row?.tongTienHang ?? 0)}
                                                </TableCell>
                                                <TableCell align="right" onClick={() => OpenFormDetail(row)}>
                                                    {new Intl.NumberFormat('vi-VN').format(row?.tongGiamGiaHD ?? 0)}
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
                                                    <TableCell colSpan={6}>Tổng cộng</TableCell>
                                                    <TableCell align="right">
                                                        {new Intl.NumberFormat('vi-VN').format(
                                                            footerTable_TongThanhToan
                                                        )}
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
                                            <TableRow className="table-empty">
                                                <TableCell colSpan={20} align="center">
                                                    Không có quyền xem danh sách thẻ
                                                </TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    )}
                                </Table>
                            ) : (
                                <Table>
                                    <TableHead>
                                        <MyHeaderTable
                                            showAction={roleEditPhieuDieuChinh || roleDeletePhieuDieuChinh}
                                            isCheckAll={false}
                                            isShowCheck={false}
                                            sortBy={paramSearch?.columnSort ?? ''}
                                            sortType={paramSearch?.typeSort ?? 'desc'}
                                            onRequestSort={onSortTable}
                                            onSelectAllClick={onClickCheckAll}
                                            listColumnHeader={listColumnHeader_PhieuDC}
                                        />
                                    </TableHead>
                                    <TableBody>
                                        {pageDataHoaDon?.items?.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell sx={{ minWidth: 100, maxWidth: 100 }}>
                                                    {row?.maHoaDon}
                                                </TableCell>
                                                <TableCell sx={{ maxWidth: 150 }}>
                                                    {format(new Date(row?.ngayLapHoaDon), 'dd/MM/yyyy')}
                                                </TableCell>
                                                <TableCell
                                                    className="lableOverflow"
                                                    sx={{ maxWidth: 200 }}
                                                    title={row?.tenKhachHang}>
                                                    {row?.tenKhachHang}
                                                </TableCell>
                                                <TableCell>{row?.soDienThoai}</TableCell>
                                                <TableCell align="right">
                                                    {new Intl.NumberFormat('vi-VN').format(row?.tongThanhToan ?? 0)}
                                                </TableCell>
                                                <TableCell
                                                    className="lableOverflow"
                                                    title={row?.ghiChuHD}
                                                    sx={{ minWidth: 150, maxWidth: 200 }}>
                                                    {row?.ghiChuHD}
                                                </TableCell>
                                                <TableCell sx={{ minWidth: 40 }}>
                                                    <Stack spacing={1} direction={'row'}>
                                                        <OpenInNewOutlinedIcon
                                                            titleAccess="Cập nhật"
                                                            className="only-icon"
                                                            sx={{
                                                                width: '16px',
                                                                color: '#7e7979',
                                                                display: roleEditPhieuDieuChinh ? '' : 'none'
                                                            }}
                                                            onClick={() =>
                                                                phieuDieuChinh_doActionRow(TypeAction.UPDATE, row)
                                                            }
                                                        />
                                                        <ClearIcon
                                                            titleAccess="Xóa"
                                                            sx={{
                                                                ' &:hover': {
                                                                    color: 'red',
                                                                    cursor: 'pointer'
                                                                },
                                                                display: roleDeletePhieuDieuChinh ? '' : 'none'
                                                            }}
                                                            style={{ width: '16px', color: 'red' }}
                                                            onClick={() =>
                                                                phieuDieuChinh_doActionRow(TypeAction.DELETE, row)
                                                            }
                                                        />
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>

                                    {pageDataHoaDon?.totalCount == 0 && (
                                        <TableFooter>
                                            <TableRow className="table-empty">
                                                <TableCell colSpan={20} align="center">
                                                    {roleXemDanhSach
                                                        ? 'Không có dữ liệu'
                                                        : 'Không có quyền xem danh sách phiếu điều chỉnh'}
                                                </TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    )}
                                </Table>
                            )}
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
