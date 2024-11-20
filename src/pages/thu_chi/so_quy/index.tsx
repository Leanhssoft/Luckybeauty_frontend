/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Box,
    Grid,
    Stack,
    TextField,
    IconButton,
    Button,
    SelectChangeEvent,
    Typography,
    TableBody,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Checkbox,
    TableFooter
} from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { ReactComponent as UploadIcon } from '../../../images/upload.svg';
import ClearIcon from '@mui/icons-material/Clear';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { AppContext } from '../../../services/chi_nhanh/ChiNhanhContext';
import { format, lastDayOfMonth } from 'date-fns';
import { GridColDef, GridSortModel, GridRowSelectionModel } from '@mui/x-data-grid';
import SoQuyServices from '../../../services/so_quy/SoQuyServices';
import utils from '../../../utils/utils';
import ActionViewEditDelete from '../../../components/Menu/ActionViewEditDelete';
import { PropConfirmOKCancel } from '../../../utils/PropParentToChild';
import { Add, DeleteForever, Edit, Info, Search } from '@mui/icons-material';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import fileDowloadService from '../../../services/file-dowload.service';
import abpCustom from '../../../components/abp-custom';
import ActionRowSelect from '../../../components/DataGrid/ActionRowSelect';
import DataMauIn from '../../admin/settings/mau_in/DataMauIn';
import { KhachHangItemDto } from '../../../services/khach-hang/dto/KhachHangItemDto';
import MauInServices from '../../../services/mau_in/MauInServices';
import chiNhanhService from '../../../services/chi_nhanh/chiNhanhService';
import QuyHoaDonDto from '../../../services/so_quy/QuyHoaDonDto';
import NapTienBrandname from '../../sms/brandname/nap_tien_brandname';
import DateFilterCustom from '../../../components/DatetimePicker/DateFilterCustom';
import ModalPhieuThuHoaDon from './components/modal_phieu_thu_hoa_don';
import { IList } from '../../../services/dto/IList';
import { ParamSearchSoQuyDto } from '../../../services/so_quy/Dto/ParamSearchSoQuyDto';
import { HINH_THUC_THANH_TOAN, LoaiChungTu, LoaiMauIn, TrangThaiActive, TypeAction } from '../../../lib/appconst';
import { IHeaderTable, MyHeaderTable } from '../../../components/Table/MyHeaderTable';
import QuyChiTietDto from '../../../services/so_quy/QuyChiTietDto';
import { IPagedResultSoQuyDto } from '../../../services/so_quy/Dto/IPagedResultSoQuyDto';
import Cookies from 'js-cookie';
import PopoverFilterSoQuy from './components/PopoverFilterSoQuy';
import suggestStore from '../../../stores/suggestStore';
import CreateOrEditSoQuyDialog from './components/CreateOrEditSoQuyDialog';
import ButtonOnlyIcon from '../../../components/Button/ButtonOnlyIcon';

const PageSoQuy = () => {
    const today = new Date();
    const firstLoad = useRef(true);
    const firstLoad2 = useRef(true);
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;
    const idChiNhanhCookies = Cookies.get('IdChiNhanh') ?? '';
    const [isShowModal, setisShowModal] = useState(false);
    const [isShowModalNapTienBrannName, setIsShowModalNapTienBrannName] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState('');
    const [inforDelete, setinforDelete] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    // khai báo txtSearch này, để gán lại paramSearch.textSearch khi enter/click search
    const [txtSearch, setTxtSearch] = useState('');
    const [paramSearch, setParamSearch] = useState<ParamSearchSoQuyDto>({
        textSearch: '',
        currentPage: 1,
        columnSort: 'ngayLapHoaDon',
        typeSort: 'desc',
        idChiNhanhs: [idChiNhanhCookies],
        fromDate: format(today, 'yyyy-MM-01'),
        toDate: format(lastDayOfMonth(today), 'yyyy-MM-dd'),
        idLoaiChungTus: [LoaiChungTu.PHIEU_THU, LoaiChungTu.PHIEU_CHI],
        idLoaiChungTuLienQuan: LoaiChungTu.ALL,
        trangThais: [TrangThaiActive.ACTIVE]
    });
    const [prevParamSearch, setPrevParamSearch] = useState<ParamSearchSoQuyDto>(paramSearch);
    if (paramSearch !== prevParamSearch) {
        setPrevParamSearch(paramSearch);
    }
    const [pageDataSoQuy, setPageDataSoQuy] = useState<IPagedResultSoQuyDto<QuyHoaDonDto>>({
        totalCount: 0,
        totalPage: 0,
        items: []
    });
    const [quyHDOld, setQuyHDOld] = useState<QuyHoaDonDto>({} as QuyHoaDonDto);
    const [sortModel, setSortModel] = useState<GridSortModel>([
        {
            field: 'ngayLapHoaDon',
            sort: 'desc'
        }
    ]);
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const [isShowThanhToanHD, setIsShowThanhToanHD] = useState(false);
    const [tonDauKy, setTonDauKy] = useState(0);
    const [tonCuoiKy, setTonCuoiKy] = useState(0);
    const [thuTrongKy, setThuTrongKy] = useState(0);
    const [chiTrongKy, setChiTrongKy] = useState(0);

    const [arrIdChosed, setArrIdChosed] = useState<string[]>([]);
    const [isCheckAll, setIsCheckAll] = useState(false);

    const GetListSoQuy = async () => {
        const data = await SoQuyServices.getAll(paramSearch);

        let sumTienMat = 0,
            sumCK = 0,
            sumPos = 0,
            sumThuChi = 0;
        if (data?.items?.length > 0) {
            sumTienMat = data?.items[0].sumTienMat ?? 0;
            sumCK = data?.items[0].sumTienChuyenKhoan ?? 0;
            sumPos = data?.items[0].sumTienQuyetThe ?? 0;
            sumThuChi = data?.items[0].sumTongThuChi ?? 0;
        }

        setPageDataSoQuy({
            totalCount: data.totalCount,
            totalPage: utils.getTotalPage(data.totalCount, paramSearch.pageSize),
            items: data.items,
            sumTienMat: sumTienMat,
            sumTienChuyenKhoan: sumCK,
            sumTienQuyetThe: sumPos,
            sumTongThuChi: sumThuChi
        });

        const arrIdThisPage = data.items?.map((x) => {
            return x.id;
        });

        const arrExist = arrIdChosed?.filter((x) => arrIdThisPage.includes(x));
        if (arrIdThisPage.length == 0) {
            setIsCheckAll(false);
            setArrIdChosed([]);
        } else {
            setIsCheckAll(arrIdThisPage.length === arrExist.length);
        }
    };

    const GetThuChi_DauKyCuoiKy = async () => {
        const data = await SoQuyServices.GetThuChi_DauKyCuoiKy(paramSearch);
        setTonDauKy(data?.tonDauKy ?? 0);
        setTonCuoiKy(data?.tonCuoiKy ?? 0);
        setThuTrongKy(data?.thuTrongKy ?? 0);
        setChiTrongKy(data?.chiTrongKy ?? 0);
    };
    const PageLoad = async () => {
        await GetListSoQuy();
        await GetThuChi_DauKyCuoiKy();
        await suggestStore.GetAllBankAccount(idChiNhanhCookies);
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
        GetListSoQuy();
        GetThuChi_DauKyCuoiKy();
    }, [prevParamSearch]);

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
    const exportToExcel = async () => {
        const param = { ...paramSearch };
        param.pageSize = pageDataSoQuy.totalCount;
        param.currentPage = 1;
        const data = await SoQuyServices.ExportToExcel(param);
        fileDowloadService.downloadExportFile(data);
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

    const doActionRow = (action: number, itemSQ: QuyHoaDonDto) => {
        setSelectedRowId(itemSQ?.id);
        setQuyHDOld(itemSQ);
        if (action < TypeAction.DELETE) {
            if (!utils.checkNull(itemSQ?.idBrandname)) {
                setIsShowModalNapTienBrannName(true);
            } else {
                if (utils.checkNull(itemSQ?.idHoaDonLienQuan)) {
                    setisShowModal(true);
                } else {
                    setIsShowThanhToanHD(true);
                }
            }
        } else {
            setinforDelete(
                new PropConfirmOKCancel({
                    show: true,
                    title: 'Xác nhận xóa',
                    mes: `Bạn có chắc chắn muốn xóa ${itemSQ?.loaiPhieu ?? ' '}  ${itemSQ?.maHoaDon ?? ' '} không?`
                })
            );
        }
    };

    const deleteSoQuy = async () => {
        // todo caculator sum
        if (arrIdChosed.length > 0) {
            const ok = await SoQuyServices.DeleteMultiple_QuyHoaDon(arrIdChosed);
            if (ok) {
                setObjAlert({
                    show: true,
                    type: 1,
                    mes: `Hủy ${arrIdChosed.length} sổ quỹ thành công`
                });
                setPageDataSoQuy({
                    ...pageDataSoQuy,
                    items: pageDataSoQuy.items.filter((x: any) => !arrIdChosed.toString().includes(x.id)),
                    totalCount: pageDataSoQuy.totalCount - arrIdChosed.length,
                    totalPage: utils.getTotalPage(pageDataSoQuy.totalCount - arrIdChosed.length, paramSearch.pageSize)
                });
                setRowSelectionModel([]);
                setArrIdChosed([]);
            } else {
                setObjAlert({
                    show: true,
                    type: 2,
                    mes: `Hủy ${arrIdChosed.length} sổ quỹ thất bại`
                });
            }
        } else {
            await SoQuyServices.DeleteSoQuy(selectedRowId);
            setPageDataSoQuy({
                ...pageDataSoQuy,
                items: pageDataSoQuy.items.filter((x: any) => x.id !== selectedRowId),
                totalCount: pageDataSoQuy.totalCount - 1,
                totalPage: utils.getTotalPage(pageDataSoQuy.totalCount - 1, paramSearch.pageSize),
                sumTienMat: (pageDataSoQuy?.sumTienMat ?? 0) - (quyHDOld?.tienMat ?? 0),
                sumTienChuyenKhoan: (pageDataSoQuy?.sumTienMat ?? 0) - (quyHDOld?.tienChuyenKhoan ?? 0),
                sumTienQuyetThe: (pageDataSoQuy?.sumTienMat ?? 0) - (quyHDOld?.tienQuyetThe ?? 0),
                sumTongThuChi: (pageDataSoQuy?.sumTienMat ?? 0) - (quyHDOld?.tongTienThu ?? 0)
            });
            setObjAlert({
                show: true,
                type: 1,
                mes: 'Hủy thành công'
            });
        }
        setinforDelete(
            new PropConfirmOKCancel({
                show: false,
                title: '',
                mes: ''
            })
        );
    };

    const saveSoQuy = async (dataSave: QuyHoaDonDto, type: number) => {
        setisShowModal(false);
        setIsShowThanhToanHD(false);

        // get thông tin các hình thức thanh toán để bind lại phần Tổng
        const quyCT = dataSave?.quyHoaDon_ChiTiet;
        let tienMat = 0,
            tienCK = 0,
            tienPos = 0,
            tongThu = dataSave?.tongTienThu;
        if (quyCT != undefined && quyCT.length > 0) {
            tienMat = quyCT
                ?.filter((x) => x.hinhThucThanhToan === HINH_THUC_THANH_TOAN.TIEN_MAT)
                .reduce((currentValue: number, item: QuyChiTietDto) => {
                    return item.tienThu + currentValue;
                }, 0);
            tienCK = quyCT
                ?.filter((x) => x.hinhThucThanhToan === HINH_THUC_THANH_TOAN.CHUYEN_KHOAN)
                .reduce((currentValue: number, item: QuyChiTietDto) => {
                    return item.tienThu + currentValue;
                }, 0);
            tienPos = quyCT
                ?.filter((x) => x.hinhThucThanhToan === HINH_THUC_THANH_TOAN.QUYET_THE)
                .reduce((currentValue: number, item: QuyChiTietDto) => {
                    return item.tienThu + currentValue;
                }, 0);
        }
        if (dataSave?.idLoaiChungTu == LoaiChungTu.PHIEU_CHI) {
            tienMat = tienMat > 0 ? -tienMat : 0;
            tienCK = tienCK > 0 ? -tienCK : 0;
            tienPos = tienPos > 0 ? -tienPos : 0;
            tongThu = tongThu > 0 ? -tongThu : 0;

            if (type === TypeAction.INSEART) {
                setChiTrongKy(() => chiTrongKy - tongThu);
            } else {
                setChiTrongKy(() => chiTrongKy + (quyHDOld?.tongTienThu ?? 0) - tongThu);
            }
        } else {
            if (type === TypeAction.INSEART) {
                setThuTrongKy(() => thuTrongKy + tongThu);
            } else {
                setChiTrongKy(() => thuTrongKy - (quyHDOld?.tongTienThu ?? 0) + tongThu);
            }
        }

        dataSave.tienMat = tienMat;
        dataSave.tienChuyenKhoan = tienCK;
        dataSave.tienQuyetThe = tienPos;
        dataSave.tongTienThu = tongThu;

        switch (type) {
            case TypeAction.INSEART: // insert
                {
                    // phải gán lại ngày lập: để chèn dc dòng mới thêm lên trên cùng
                    // dataSave.ngayLapHoaDon = new Date(dataSave.ngayLapHoaDon);
                    setPageDataSoQuy({
                        ...pageDataSoQuy,
                        items: [dataSave, ...pageDataSoQuy.items],
                        totalCount: pageDataSoQuy.totalCount + 1,
                        totalPage: utils.getTotalPage(pageDataSoQuy.totalCount + 1, paramSearch.pageSize),
                        sumTienMat: (pageDataSoQuy?.sumTienMat ?? 0) + tienMat,
                        sumTienChuyenKhoan: (pageDataSoQuy?.sumTienChuyenKhoan ?? 0) + tienCK,
                        sumTienQuyetThe: (pageDataSoQuy?.sumTienQuyetThe ?? 0) + tienPos,
                        sumTongThuChi: (pageDataSoQuy?.sumTongThuChi ?? 0) + tongThu
                    });
                    setObjAlert({
                        show: true,
                        type: 1,
                        mes: 'Thêm ' + dataSave.loaiPhieu + ' thành công'
                    });
                }
                break;
            case TypeAction.UPDATE:
                setPageDataSoQuy({
                    ...pageDataSoQuy,
                    sumTienMat: (pageDataSoQuy?.sumTienMat ?? 0) + tienMat - (quyHDOld?.tienMat ?? 0),
                    sumTienChuyenKhoan:
                        (pageDataSoQuy?.sumTienChuyenKhoan ?? 0) + tienCK - (quyHDOld?.tienChuyenKhoan ?? 0),
                    sumTienQuyetThe: (pageDataSoQuy?.sumTienQuyetThe ?? 0) + tienPos - (quyHDOld?.tienQuyetThe ?? 0),
                    sumTongThuChi: (pageDataSoQuy?.sumTongThuChi ?? 0) + tongThu - (quyHDOld?.tongTienThu ?? 0),
                    items: pageDataSoQuy.items.map((item) => {
                        if (item.id === selectedRowId) {
                            return {
                                ...item,
                                maHoaDon: dataSave.maHoaDon,
                                ngayLapHoaDon: dataSave.ngayLapHoaDon,
                                idLoaiChungTu: dataSave.idLoaiChungTu,
                                loaiPhieu: dataSave.loaiPhieu,
                                hinhThucThanhToan: dataSave.hinhThucThanhToan,
                                sHinhThucThanhToan: dataSave.sHinhThucThanhToan,
                                tongTienThu: dataSave.tongTienThu,
                                maNguoiNop: dataSave.maNguoiNop,
                                tenNguoiNop: dataSave.tenNguoiNop,
                                idKhoanThuChi: dataSave.idKhoanThuChi,
                                tenKhoanThuChi: dataSave.tenKhoanThuChi,
                                txtTrangThai: dataSave.txtTrangThai,
                                trangThai: dataSave.trangThai,
                                noiDungThu: dataSave?.noiDungThu ?? '',
                                tienMat: dataSave.tienMat,
                                tienChuyenKhoan: dataSave.tienChuyenKhoan,
                                tienQuyetThe: dataSave.tienQuyetThe
                            };
                        } else {
                            return item;
                        }
                    })
                });
                setObjAlert({
                    show: true,
                    type: 1,
                    mes: 'Cập nhật ' + dataSave.loaiPhieu + ' thành công'
                });
                break;
            case TypeAction.DELETE:
                await deleteSoQuy();
                break;
            case TypeAction.RESTORE:
                {
                    setPageDataSoQuy({
                        ...pageDataSoQuy,
                        sumTienMat: (pageDataSoQuy?.sumTienMat ?? 0) + tienMat,
                        sumTienChuyenKhoan: (pageDataSoQuy?.sumTienChuyenKhoan ?? 0) + tienCK,
                        sumTienQuyetThe: (pageDataSoQuy?.sumTienQuyetThe ?? 0) + tienPos,
                        sumTongThuChi: (pageDataSoQuy?.sumTongThuChi ?? 0) + tongThu,
                        items: pageDataSoQuy.items.map((item) => {
                            if (item.id === selectedRowId) {
                                return {
                                    ...item,
                                    txtTrangThai: dataSave.txtTrangThai,
                                    trangThai: dataSave.trangThai
                                };
                            } else {
                                return item;
                            }
                        })
                    });
                }
                break;
        }
    };

    const saveNapTienBrandname = async () => {
        setIsShowModalNapTienBrannName(false);
    };

    const DataGrid_handleAction = async (item: any) => {
        switch (parseInt(item.id)) {
            case 1:
                setinforDelete({
                    ...inforDelete,
                    show: true,
                    mes: `Bạn có chắc chắn muốn xóa ${arrIdChosed.length} sổ quỹ này không?`
                });
                break;
            case 2:
                {
                    let htmlPrint = '';
                    for (let i = 0; i < arrIdChosed.length; i++) {
                        const idSoquy = arrIdChosed[i].toString();
                        // select dataQuyHoaDon from page
                        const quyHD = pageDataSoQuy.items.filter((x: any) => x.id === idSoquy);
                        const quyCT = await SoQuyServices.GetQuyChiTiet_byIQuyHoaDon(idSoquy);

                        if (quyHD.length > 0) {
                            DataMauIn.congty = appContext.congty;
                            const chinhanhPrint = await await chiNhanhService.GetDetail(quyHD[0]?.idChiNhanh ?? '');
                            DataMauIn.chinhanh = chinhanhPrint;
                            DataMauIn.khachhang = {
                                maKhachHang: quyHD[0]?.maNguoiNop,
                                tenKhachHang: quyHD[0].tenNguoiNop,
                                soDienThoai: quyHD[0]?.sdtNguoiNop
                            } as KhachHangItemDto;
                            DataMauIn.phieuthu = quyHD[0];
                            DataMauIn.phieuthu.quyHoaDon_ChiTiet = quyCT;

                            const tempMauIn = await MauInServices.GetContentMauInMacDinh(
                                LoaiMauIn.K80,
                                quyHD[0].idLoaiChungTu
                            );
                            let newHtml = DataMauIn.replaceChiNhanh(tempMauIn);
                            newHtml = await DataMauIn.replacePhieuThuChi(newHtml);
                            if (i < arrIdChosed.length - 1) {
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

        const arrIdThisPage = pageDataSoQuy?.items?.map((x) => {
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

            const arrIdThisPage = pageDataSoQuy?.items?.map((x) => {
                return x.id;
            });
            const arrExist = arrIdChosed?.filter((x) => arrIdThisPage.includes(x));
            setIsCheckAll(arrIdThisPage.length === arrExist.length + 1);
        } else {
            setArrIdChosed(arrIdChosed.filter((x) => x !== rowId));
            setIsCheckAll(false);
        }
    };
    const [anchorElFilter, setAnchorElFilter] = useState<SVGSVGElement | null>(null);
    const ApplyFilter = (paramFilter: ParamSearchSoQuyDto) => {
        setAnchorElFilter(null);
        setParamSearch({
            ...paramSearch,
            currentPage: 1,
            idTaiKhoanNganHang: paramFilter?.idTaiKhoanNganHang,
            idLoaiChungTus: paramFilter?.idLoaiChungTus,
            idLoaiChungTuLienQuan: paramFilter?.idLoaiChungTuLienQuan,
            trangThais: paramFilter?.trangThais,
            idChiNhanhs: paramFilter?.idChiNhanhs
        });
    };

    const columns: GridColDef[] = [
        {
            field: 'loaiPhieu',
            headerName: 'Loại phiếu',
            flex: 0.8,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Box title={params.value} width="100%">
                    {params.value}
                </Box>
            )
        },
        {
            field: 'maHoaDon',
            headerName: 'Mã phiếu',
            minWidth: 118,
            flex: 0.8,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'ngayLapHoaDon',
            headerName: 'Ngày lập',
            headerAlign: 'center',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box title={params.value} width="100%" textAlign="center">
                    {format(new Date(params.value), 'dd/MM/yyyy HH:mm')}
                </Box>
            )
        },
        {
            field: 'tenNguoiNop',
            headerName: 'Người nộp',
            // minWidth: 118,
            flex: 1.5,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'tongTienThu',
            headerName: 'Tổng tiền',
            headerAlign: 'right',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box title={params.value} width="100%" textAlign="end">
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'sHinhThucThanhToan',
            headerName: 'Hình thức',
            minWidth: 150,
            flex: 1.2,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box title={params.value} width="100%">
                    {params.value}
                </Box>
            )
        },
        {
            field: 'txtTrangThai',
            headerName: 'Trạng thái',
            headerAlign: 'center',
            align: 'center',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box
                    title={params.value}
                    className={
                        params.row.trangThai === 1
                            ? 'data-grid-cell-trangthai-active'
                            : 'data-grid-cell-trangthai-notActive'
                    }>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'actions',
            headerName: '#',
            headerAlign: 'center',
            width: 48,
            flex: 0.4,
            disableColumnMenu: true,
            renderCell: (params) => (
                <ActionViewEditDelete
                    lstOption={
                        [
                            {
                                id: '0',
                                icon: <Info sx={{ color: '#009EF7' }} />,
                                text: 'Xem',
                                isShow: true
                            },
                            {
                                id: '1',
                                text: 'Sửa',
                                icon: <Edit sx={{ color: '#009EF7' }} />,
                                isShow: abpCustom.isGrandPermission('Pages.QuyHoaDon.Edit')
                            },
                            {
                                id: '2',
                                text: 'Xóa',
                                icon: <DeleteForever sx={{ color: '#F1416C' }} />,
                                isShow: abpCustom.isGrandPermission('Pages.QuyHoaDon.Delete')
                            }
                        ] as IList[]
                    }
                    handleAction={(action: any) => doActionRow(action, params.row)}
                />
            ),
            renderHeader: (params) => <Box component={'span'}>{params.colDef.headerName}</Box>
        }
    ];

    const listColumnHeader: IHeaderTable[] = [
        { columnId: 'loaiPhieu', columnText: 'Loại phiếu' },
        { columnId: 'maHoaDon', columnText: 'Mã phiếu' },
        { columnId: 'ngayLapHoaDon', columnText: 'Ngày lập' },
        { columnId: 'tenNguoiNop', columnText: 'Người nhận/nộp' },
        { columnId: 'maHoaDonLienQuans', columnText: 'Mã HĐ' },
        { columnId: 'tienMat', columnText: 'Tiền mặt', align: 'right' },
        { columnId: 'tienChuyenKhoan', columnText: 'Chuyển khoản', align: 'right' },
        { columnId: 'tienQuetThe', columnText: 'Quyẹt thẻ', align: 'right' },
        { columnId: 'tongTienThu', columnText: 'Tổng thu/chi', align: 'right' },
        { columnId: 'noiDungThu', columnText: 'Nội dung thu/chi' }
    ];

    return (
        <>
            <ModalPhieuThuHoaDon
                isShow={isShowThanhToanHD}
                idQuyHD={selectedRowId}
                onClose={() => setIsShowThanhToanHD(false)}
                onOk={saveSoQuy}
            />
            <CreateOrEditSoQuyDialog
                onClose={() => {
                    setisShowModal(false);
                }}
                onOk={saveSoQuy}
                visiable={isShowModal}
                idQuyHD={selectedRowId}
            />
            <NapTienBrandname
                visiable={isShowModalNapTienBrannName}
                idQuyHD={selectedRowId}
                onClose={() => setIsShowModalNapTienBrannName(false)}
                onOk={saveNapTienBrandname}
            />
            <ConfirmDelete
                isShow={inforDelete.show}
                title={inforDelete.title}
                mes={inforDelete.mes}
                onOk={deleteSoQuy}
                onCancel={() => setinforDelete({ ...inforDelete, show: false })}></ConfirmDelete>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Box paddingTop={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} lg={5} md={12}>
                        <Grid container alignItems="center">
                            <Grid item xs={4} sm={5} lg={2} md={2}>
                                <span className="page-title"> Sổ quỹ</span>
                            </Grid>
                            <Grid item xs={8} sm={7} lg={6} md={6}>
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
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={7} md={12}>
                        <Stack
                            direction={'row'}
                            spacing={1}
                            justifyContent={'flex-end'}
                            sx={{
                                '& button': {
                                    height: '40px'
                                }
                            }}>
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
                            <Button
                                variant="outlined"
                                onClick={exportToExcel}
                                startIcon={<UploadIcon />}
                                sx={{
                                    borderColor: '#CDC9CD!important',
                                    bgcolor: '#fff!important',
                                    color: '#333233',
                                    fontSize: '14px',
                                    display: abpCustom.isGrandPermission('Pages.QuyHoaDon.Export') ? '' : 'none'
                                }}
                                className="btn-outline-hover">
                                Xuất
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                sx={{
                                    color: '#fff',
                                    fontSize: '14px',
                                    display: abpCustom.isGrandPermission('Pages.QuyHoaDon.Create') ? '' : 'none'
                                }}
                                className="btn-container-hover"
                                onClick={() => {
                                    setisShowModal(true);
                                    setSelectedRowId('');
                                }}>
                                Lập phiếu
                            </Button>
                            <ButtonOnlyIcon
                                icon={
                                    <FilterAltOutlinedIcon
                                        titleAccess="Lọc nâng cao"
                                        sx={{ width: 20 }}
                                        onClick={(event) => setAnchorElFilter(event.currentTarget)}
                                    />
                                }
                                style={{ width: 40, backgroundColor: 'white' }}
                            />
                            <PopoverFilterSoQuy
                                anchorEl={anchorElFilter}
                                paramFilter={paramSearch}
                                handleClose={() => setAnchorElFilter(null)}
                                handleApply={ApplyFilter}
                            />
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
                                            id: '1',
                                            text: 'Xóa sổ quỹ',
                                            isShow: abpCustom.isGrandPermission('Pages.QuyHoaDon.Delete')
                                        },
                                        {
                                            id: '2',
                                            text: 'In sổ quỹ',
                                            isShow: abpCustom.isGrandPermission('Pages.QuyHoaDon.Print')
                                        }
                                    ] as IList[]
                                }
                                countRowSelected={arrIdChosed.length}
                                title="sổ quỹ"
                                choseAction={DataGrid_handleAction}
                                removeItemChosed={() => {
                                    setRowSelectionModel([]);
                                    setArrIdChosed([]);
                                    setIsCheckAll(false);
                                }}
                            />
                        )}
                    </Grid>
                    <Grid item xs={4}>
                        <Stack
                            direction={'row'}
                            justifyContent={'flex-end'}
                            sx={{
                                '& p': {
                                    fontWeight: '600!important'
                                }
                            }}>
                            <Stack spacing={1} flex={10} justifyContent={'end'} direction={'row'}>
                                <Typography variant="body2">Tổng thu:</Typography>
                                <Typography variant="body2">
                                    {new Intl.NumberFormat('vi-VN').format(thuTrongKy)}
                                </Typography>
                            </Stack>
                            <Stack
                                spacing={1}
                                flex={10}
                                justifyContent={'end'}
                                direction={'row'}
                                sx={{ color: 'brown' }}>
                                <Typography variant="body2">Tổng chi:</Typography>
                                <Typography variant="body2">
                                    {new Intl.NumberFormat('vi-VN').format(chiTrongKy)}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>

                <Box marginTop={arrIdChosed.length > 0 ? 1 : 2}>
                    {/* <DataGrid
                        disableRowSelectionOnClick
                        className={rowSelectionModel.length > 0 ? 'data-grid-row-chosed' : 'data-grid-row'}
                        autoHeight={pageDataSoQuy?.totalCount == 0}
                        rowHeight={40}
                        rows={pageDataSoQuy.items}
                        columns={columns}
                        checkboxSelection
                        hideFooter
                        localeText={TextTranslate}
                        sortModel={sortModel}
                        sortingOrder={['desc', 'asc']}
                        onSortModelChange={(newSortModel) => {
                            setSortModel(() => newSortModel);
                            if (newSortModel.length > 0) {
                                setParamSearch({
                                    ...paramSearch,
                                    columnSort: newSortModel[0].field,
                                    typeSort: newSortModel[0].sort?.toString()
                                });
                            } else {
                                // vì fistload: mặc dịnh sort 'ngaylapHoaDon desc'
                                // nên nếu click cột ngaylapHoaDon luôn, thì newSortModel = []
                                setParamSearch({
                                    ...paramSearch,
                                    typeSort: 'asc'
                                });
                            }
                        }}
                        onRowSelectionModelChange={(newRowSelectionModel) => {
                            setRowSelectionModel(newRowSelectionModel);
                        }}
                        rowSelectionModel={rowSelectionModel}
                    /> */}

                    <Grid container>
                        <Grid item xs={12}>
                            <Stack className="page-box-right">
                                <TableContainer className="data-grid-row">
                                    <Table>
                                        <TableHead>
                                            <MyHeaderTable
                                                showAction={true}
                                                isCheckAll={isCheckAll}
                                                sortBy={paramSearch?.columnSort ?? ''}
                                                sortType={paramSearch?.typeSort ?? 'desc'}
                                                onRequestSort={onSortTable}
                                                onSelectAllClick={onClickCheckAll}
                                                listColumnHeader={listColumnHeader}
                                            />
                                        </TableHead>
                                        <TableBody>
                                            {pageDataSoQuy?.items?.map((row, index) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{
                                                        '& .MuiTableCell-root': {
                                                            color:
                                                                row?.idLoaiChungTu == LoaiChungTu.PHIEU_CHI
                                                                    ? 'unset'
                                                                    : 'unset'
                                                        }
                                                    }}>
                                                    <TableCell align="center" className="td-check-box">
                                                        <Checkbox
                                                            checked={arrIdChosed.includes(row.id)}
                                                            onChange={(event) => onClickCheckOne(event, row.id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 100, maxWidth: 100 }}>
                                                        {row?.loaiPhieu}
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 100, maxWidth: 150 }}>
                                                        {row?.maHoaDon}
                                                    </TableCell>
                                                    <TableCell sx={{ maxWidth: 150 }}>
                                                        {format(new Date(row?.ngayLapHoaDon), 'dd/MM/yyyy')}
                                                    </TableCell>
                                                    <TableCell
                                                        className="lableOverflow"
                                                        sx={{ maxWidth: 200 }}
                                                        title={row?.tenNguoiNop}>
                                                        {row?.tenNguoiNop}
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 80 }}>
                                                        {utils.Remove_LastComma(row?.maHoaDonLienQuans)}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {new Intl.NumberFormat('vi-VN').format(row?.tienMat ?? 0)}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {new Intl.NumberFormat('vi-VN').format(
                                                            row?.tienChuyenKhoan ?? 0
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {new Intl.NumberFormat('vi-VN').format(row?.tienQuyetThe ?? 0)}
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        {new Intl.NumberFormat('vi-VN').format(row?.tongTienThu ?? 0)}
                                                    </TableCell>
                                                    <TableCell
                                                        className="lableOverflow"
                                                        title={row?.noiDungThu}
                                                        sx={{ minWidth: 100, maxWidth: 250 }}>
                                                        {row?.noiDungThu}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Stack spacing={1} direction={'row'}>
                                                            <OpenInNewOutlinedIcon
                                                                titleAccess="Cập nhật"
                                                                sx={{ width: '16px', color: '#7e7979' }}
                                                                onClick={() => doActionRow(TypeAction.UPDATE, row)}
                                                            />
                                                            <ClearIcon
                                                                titleAccess="Xóa"
                                                                style={{ width: '16px', color: 'red' }}
                                                                onClick={() => doActionRow(TypeAction.DELETE, row)}
                                                            />
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        <TableFooter>
                                            {pageDataSoQuy?.totalCount > 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6}>Tổng cộng</TableCell>
                                                    <TableCell align="right">
                                                        {new Intl.NumberFormat('vi-VN').format(
                                                            pageDataSoQuy?.sumTienMat ?? 0
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {new Intl.NumberFormat('vi-VN').format(
                                                            pageDataSoQuy?.sumTienChuyenKhoan ?? 0
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {new Intl.NumberFormat('vi-VN').format(
                                                            pageDataSoQuy?.sumTienQuyetThe ?? 0
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {new Intl.NumberFormat('vi-VN').format(
                                                            pageDataSoQuy?.sumTongThuChi ?? 0
                                                        )}
                                                    </TableCell>
                                                    <TableCell colSpan={2}></TableCell>
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
                            </Stack>
                        </Grid>
                    </Grid>

                    <CustomTablePagination
                        currentPage={paramSearch.currentPage ?? 0}
                        rowPerPage={paramSearch.pageSize ?? 10}
                        totalRecord={pageDataSoQuy.totalCount ?? 0}
                        totalPage={pageDataSoQuy.totalPage}
                        handlePerPageChange={handlePerPageChange}
                        handlePageChange={handleChangePage}
                    />
                </Box>
            </Box>
        </>
    );
};

export default PageSoQuy;
