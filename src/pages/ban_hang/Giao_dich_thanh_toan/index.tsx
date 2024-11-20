/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState, useContext } from 'react';
import { Box, Grid, TextField, IconButton, Button, SelectChangeEvent, Stack } from '@mui/material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';

import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import { Search } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { ReactComponent as UploadIcon } from '../../../images/upload.svg';
import { TextTranslate } from '../../../components/TableLanguage';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import ThongTinHoaDon from '../Hoa_don/ThongTinHoaDon';
import { AppContext } from '../../../services/chi_nhanh/ChiNhanhContext';
import { ChiNhanhDto } from '../../../services/chi_nhanh/Dto/chiNhanhDto';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import Utils from '../../../utils/utils'; // func common.
import { format, lastDayOfMonth } from 'date-fns';
import PageHoaDonDto from '../../../services/ban_hang/PageHoaDonDto';
import { HoaDonRequestDto } from '../../../services/dto/ParamSearchDto';
import HoaDonService from '../../../services/ban_hang/HoaDonService';
import { PagedResultDto } from '../../../services/dto/pagedResultDto';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import fileDowloadService from '../../../services/file-dowload.service';
import MauInServices from '../../../services/mau_in/MauInServices';
import ActionRowSelect from '../../../components/DataGrid/ActionRowSelect';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import { PropConfirmOKCancel } from '../../../utils/PropParentToChild';
import DataMauIn from '../../admin/settings/mau_in/DataMauIn';
import { KhachHangItemDto } from '../../../services/khach-hang/dto/KhachHangItemDto';
import DateFilterCustom from '../../../components/DatetimePicker/DateFilterCustom';
import AppConsts, { LoaiChungTu, TypeAction } from '../../../lib/appconst';
import abpCustom from '../../../components/abp-custom';
import { IList } from '../../../services/dto/IList';
import { Guid } from 'guid-typescript';
import utils from '../../../utils/utils';
import PopoverFilterHoaDon from './PopoverFilterHoaDon';
import Cookies from 'js-cookie';
import { TrangThaiHoaDon } from '../../../services/ban_hang/HoaDonConst';
import suggestStore from '../../../stores/suggestStore';
import uploadFileService from '../../../services/uploadFileService';
import ButtonOnlyIcon from '../../../components/Button/ButtonOnlyIcon';

const GiaoDichThanhToan: React.FC = () => {
    const today = new Date();
    const firstLoad = useRef(true);
    const firstLoad2 = useRef(true);
    const appContext = useContext(AppContext);
    const chinhanhCurrent = appContext.chinhanhCurrent;
    const idChiNhanhCookies = Cookies.get('IdChiNhanh') ?? '';
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    // khai báo txtSearch này, để gán lại paramSearch.textSearch khi enter/click search
    const [txtSearch, setTxtSearch] = useState('');
    const [idHoadonChosing, setIdHoadonChosing] = useState('');
    const [hoadon, setHoaDon] = useState<PageHoaDonDto>(new PageHoaDonDto({ id: '' }));
    const [inforDelete, setInforDelete] = useState<PropConfirmOKCancel>(new PropConfirmOKCancel({ show: false }));

    const [paramSearch, setParamSearch] = useState<HoaDonRequestDto>({
        textSearch: '',
        idChiNhanhs: [idChiNhanhCookies],
        idLoaiChungTus: [LoaiChungTu.HOA_DON_BAN_LE],
        currentPage: 1,
        pageSize: AppConsts.pageOption[0].value,
        columnSort: 'NgayLapHoaDon',
        typeSort: 'DESC',
        fromDate: format(today, 'yyyy-MM-01'),
        toDate: format(lastDayOfMonth(today), 'yyyy-MM-dd'),
        trangThais: [TrangThaiHoaDon.HOAN_THANH]
    });

    const [pageDataHoaDon, setPageDataHoaDon] = useState<PagedResultDto<PageHoaDonDto>>({
        totalCount: 0,
        totalPage: 0,
        items: []
    });
    const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);
    useEffect(() => {
        const invoiceHubConnection = new HubConnectionBuilder()
            .withUrl(process.env.REACT_APP_REMOTE_SERVICE_BASE_URL + 'invoiceHub')
            .build();

        invoiceHubConnection
            .start()
            .then(() => console.log('Connected to InvoiceHub'))
            .catch((err) => console.error('Error connecting to Hub:', err));

        invoiceHubConnection.on('ReceiveInvoiceListReload', async (tenantId: string) => {
            if (Cookies.get('Abp.TenantId') && Cookies.get('Abp.TenantId') === tenantId) {
                setParamSearch({ ...paramSearch, currentPage: 1 });
                GetListHoaDon();
            }
        });

        return () => {
            invoiceHubConnection.off('ReceiveInvoiceListReload');
            invoiceHubConnection.stop();
        };
    }, []);

    const GetListHoaDon = async () => {
        const data = await HoaDonService.GetListHoaDon(paramSearch);
        if (data?.items.length > 0) {
            const itFirst = data?.items[0];
            const footerRow = new PageHoaDonDto({
                id: Guid.EMPTY,
                maHoaDon: 'Tổng',
                ngayLapHoaDon: '',
                tenKhachHang: '',
                tongTienHang: itFirst?.sumTongTienHang ?? 0,
                daThanhToan: itFirst?.sumDaThanhToan ?? 0,
                maKhachHang: ''
            });
            footerRow.tongThanhToan = itFirst?.sumTongThanhToan ?? 0;
            footerRow.conNo = (itFirst?.sumTongThanhToan ?? 0) - (itFirst?.sumDaThanhToan ?? 0);
            footerRow.txtTrangThaiHD = '';

            setPageDataHoaDon({
                totalCount: data.totalCount,
                totalPage: Utils.getTotalPage(data.totalCount, paramSearch.pageSize),
                items: [...data.items, footerRow]
            });
        } else {
            setPageDataHoaDon({
                totalCount: data.totalCount,
                totalPage: Utils.getTotalPage(data.totalCount, paramSearch.pageSize),
                items: data.items
            });
        }
    };

    const PageLoad = async () => {
        GetListHoaDon();
        GetAllBacnkAccount();
    };

    const GetAllBacnkAccount = async (idChiNhanh?: string) => {
        if (utils.checkNull(idChiNhanh)) {
            idChiNhanh = idChiNhanhCookies;
        }
        await suggestStore.GetAllBankAccount(idChiNhanh ?? '');
    };

    useEffect(() => {
        PageLoad();
    }, []);

    // avoid call multiple GetListHoaDon
    const [prevItems, setPrevItems] = useState(paramSearch);
    if (paramSearch !== prevItems) {
        setPrevItems(paramSearch);
    }

    useEffect(() => {
        if (firstLoad2.current) {
            firstLoad2.current = false;
            return;
        }
        setParamSearch({
            ...paramSearch,
            idChiNhanhs: chinhanhCurrent?.id === '' ? [idChiNhanhCookies] : [chinhanhCurrent?.id]
        });
        GetAllBacnkAccount(chinhanhCurrent?.id);
    }, [chinhanhCurrent?.id]);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        GetListHoaDon();
    }, [prevItems]);

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

    const [openDetail, setOpenDetail] = useState(false);

    const choseRow = (param: any) => {
        setIdHoadonChosing(param.id);
        setHoaDon(param.row);
        setOpenDetail(true);
    };

    const childGotoBack = (hoadonAfterChange: PageHoaDonDto, typeAction = 0) => {
        setOpenDetail(false);
        setIdHoadonChosing('');

        switch (typeAction) {
            case TypeAction.UPDATE:
                if (hoadonAfterChange.idChiNhanh !== hoadon?.idChiNhanh) {
                    // remove if huyhoadon or change chinhanh
                    setPageDataHoaDon({
                        ...pageDataHoaDon,
                        items: pageDataHoaDon.items.filter((x: any) => x.id !== hoadonAfterChange.id)
                    });
                } else {
                    setPageDataHoaDon({
                        ...pageDataHoaDon,
                        items: pageDataHoaDon.items.map((itemHD: PageHoaDonDto) => {
                            if (itemHD.id === hoadonAfterChange.id) {
                                return hoadonAfterChange;
                            } else {
                                return itemHD;
                            }
                        })
                    });
                }
                break;
            case TypeAction.DELETE:
                setPageDataHoaDon({
                    ...pageDataHoaDon,
                    items: pageDataHoaDon.items.map((itemHD: PageHoaDonDto) => {
                        if (itemHD.id === hoadonAfterChange.id) {
                            return { ...itemHD, trangThai: 0, txtTrangThaiHD: 'Đã hủy' };
                        } else {
                            return itemHD;
                        }
                    })
                });
                setObjAlert({ ...objAlert, show: true, mes: 'Hủy hóa đơn thành công' });
                break;
            default:
                break;
        }
    };
    const exportToExcel = async () => {
        const data = await HoaDonService.ExportToExcel(paramSearch);
        fileDowloadService.downloadExportFile(data);
    };

    const DataGrid_handleAction = async (item: any) => {
        switch (parseInt(item.id)) {
            case 1:
                setInforDelete({
                    ...inforDelete,
                    show: true,
                    mes: 'Bạn có chắc chắn muốn xóa những hóa đơn này không?'
                });
                break;
            case 2:
                {
                    let htmlPrint = '';
                    for (let i = 0; i < rowSelectionModel.length; i++) {
                        const idHoaDon = rowSelectionModel[i].toString();
                        const dataHoaDon = await HoaDonService.GetInforHoaDon_byId(idHoaDon);
                        const dataCTHD = await HoaDonService.GetChiTietHoaDon_byIdHoaDon(idHoaDon);

                        if (dataHoaDon.length > 0) {
                            DataMauIn.hoadon = dataHoaDon[0];
                            DataMauIn.hoadonChiTiet = dataCTHD;
                            DataMauIn.khachhang = {
                                maKhachHang: dataHoaDon[0]?.maKhachHang,
                                tenKhachHang: dataHoaDon[0]?.tenKhachHang,
                                soDienThoai: hoadon?.soDienThoai
                            } as KhachHangItemDto;
                            DataMauIn.chinhanh = {
                                tenChiNhanh: hoadon?.tenChiNhanh
                            } as ChiNhanhDto;
                            DataMauIn.congty = appContext.congty;
                            DataMauIn.congty.logo = uploadFileService.GoogleApi_NewLink(DataMauIn.congty?.logo);
                            const tempMauIn = await MauInServices.GetContentMauInMacDinh(1, 1);
                            let newHtml = DataMauIn.replaceChiTietHoaDon(tempMauIn);
                            newHtml = DataMauIn.replaceChiNhanh(newHtml);
                            newHtml = DataMauIn.replaceHoaDon(newHtml);
                            newHtml = await DataMauIn.replacePhieuThuChi(newHtml);
                            if (i < rowSelectionModel.length - 1) {
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

    const Delete_MultipleHoaDon = async () => {
        await HoaDonService.Delete_MultipleHoaDon(rowSelectionModel);
        setInforDelete({ ...inforDelete, show: false });
        setObjAlert({ show: true, mes: 'Xóa thành công', type: 1 });

        setPageDataHoaDon({
            ...pageDataHoaDon,
            items: pageDataHoaDon.items.map((itemHD: PageHoaDonDto) => {
                if (rowSelectionModel.toString().indexOf(itemHD.id) > -1) {
                    return { ...itemHD, trangThai: 0, txtTrangThaiHD: 'Đã hủy' };
                } else {
                    return itemHD;
                }
            })
        });
    };

    const [anchorDateEl, setAnchorDateEl] = useState<HTMLDivElement | null>(null);
    const openDateFilter = Boolean(anchorDateEl);

    const onApplyFilterDate = async (from: string, to: string, txtShow: string) => {
        setAnchorDateEl(null);
        setParamSearch({ ...paramSearch, fromDate: from, toDate: to, currentPage: 1 });
    };

    const columns: GridColDef[] = [
        {
            field: 'maHoaDon',
            headerName: 'Mã hóa đơn',
            minWidth: 100,
            flex: 0.8,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box component="span" title={params.value}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'ngayLapHoaDon',
            headerName: 'Ngày bán',
            headerAlign: 'center',
            align: 'center',
            minWidth: 130,
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Box title={params.value}>
                    {utils?.checkNull(params.value) ? '' : format(new Date(params.value), 'dd/MM/yyyy HH:mm')}
                </Box>
            )
        },
        {
            field: 'tenKhachHang',
            headerName: 'Tên khách hàng',
            minWidth: 140,
            flex: 1.5,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box title={params.value} component="span" textOverflow={'ellipsis'}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'tongTienHang',
            headerName: 'Tổng tiền hàng',
            headerAlign: 'right',
            align: 'right',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box title={params.value}>{new Intl.NumberFormat('vi-VN').format(params.value)}</Box>
            )
        },
        // {
        //     field: 'tongGiamGiaHD',
        //     headerName: 'Tổng giảm giá', // bỏ bớt cột cho gọn
        //     headerAlign: 'center',
        //     align: 'center',
        //     minWidth: 118,
        //     flex: 1,
        //     renderHeader: (params: any) => (
        //         <Box title={params.value}>
        //             {params.colDef.headerName}
        //             <IconSorting />{' '}
        //         </Box>
        //     ),
        //     renderCell: (params: any) => (
        //         <Box title={params.value}>
        //             {' '}
        //             {new Intl.NumberFormat('vi-VN').format(params.value)}
        //         </Box>
        //     )
        // },
        {
            field: 'tongThanhToan',
            headerName: 'Tổng phải trả',
            headerAlign: 'right',
            align: 'right',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box title={params.value}>{new Intl.NumberFormat('vi-VN').format(params.value)}</Box>
            )
        },
        {
            field: 'daThanhToan',
            headerName: 'Khách đã trả',
            headerAlign: 'right',
            align: 'right',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box title={params.value}>{new Intl.NumberFormat('vi-VN').format(params.value)}</Box>
            )
        },
        {
            field: 'conNo',
            headerName: 'Còn nợ',
            headerAlign: 'right',
            align: 'right',
            minWidth: 100,
            flex: 0.5,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box title={params.value} component={'span'}>
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'txtTrangThaiHD',
            headerAlign: 'center',
            align: 'center',
            headerName: 'Trạng thái',
            minWidth: 118,
            flex: 1,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box
                    title={params.value}
                    className={
                        params.row.trangThai === 3
                            ? 'data-grid-cell-trangthai-active'
                            : 'data-grid-cell-trangthai-notActive'
                    }>
                    {params.value}
                </Box>
            )
        }
    ];

    const [anchorElFilter, setAnchorElFilter] = useState<SVGSVGElement | null>(null);
    const ApplyFilter = (paramFilter: HoaDonRequestDto) => {
        setAnchorElFilter(null);
        setParamSearch({
            ...paramSearch,
            currentPage: 1,
            trangThaiNos: paramFilter.trangThaiNos,
            trangThais: paramFilter.trangThais,
            idChiNhanhs: paramFilter.idChiNhanhs
        });
    };

    return (
        <>
            <ThongTinHoaDon
                idHoaDon={idHoadonChosing}
                hoadon={hoadon}
                open={openDetail}
                handleGotoBack={childGotoBack}
            />

            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>

            <ConfirmDelete
                isShow={inforDelete.show}
                title={inforDelete.title}
                mes={inforDelete.mes}
                onOk={Delete_MultipleHoaDon}
                onCancel={() => setInforDelete({ ...inforDelete, show: false })}></ConfirmDelete>

            <Box paddingTop={2}>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} md={12} lg={6} alignItems="center" gap="10px">
                        <Grid container spacing={1} alignItems="center">
                            <Grid item xs={12} sm={6} md={4}>
                                <span className="page-title"> Giao dịch thanh toán</span>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    className="text-search"
                                    variant="outlined"
                                    type="search"
                                    placeholder="Tìm kiếm"
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
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '8px',
                                justifyContent: { lg: 'end' }
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
                                    display: abpCustom.isGrandPermission('Pages.HoaDon.Export') ? '' : 'none'
                                }}
                                className="btn-outline-hover">
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
                                style={{ width: 40, backgroundColor: 'white' }}
                            />
                            <PopoverFilterHoaDon
                                anchorEl={anchorElFilter}
                                paramFilter={paramSearch}
                                handleClose={() => setAnchorElFilter(null)}
                                handleApply={ApplyFilter}
                            />
                        </Box>
                    </Grid>
                </Grid>

                {rowSelectionModel.length > 0 && (
                    <div style={{ marginTop: '24px' }}>
                        <ActionRowSelect
                            lstOption={
                                [
                                    {
                                        id: '1',
                                        text: 'Xóa hóa đơn',
                                        isShow: abpCustom.isGrandPermission('Pages.HoaDon.Delete'),
                                        icon: <DeleteSweepOutlinedIcon sx={{ width: '1rem', height: '1rem' }} />
                                    },
                                    {
                                        id: '2',
                                        text: 'In hóa đơn',
                                        isShow: abpCustom.isGrandPermission('Pages.HoaDon.Print'),
                                        icon: <PrintOutlinedIcon sx={{ width: '1rem', height: '1rem' }} />
                                    }
                                ] as IList[]
                            }
                            countRowSelected={rowSelectionModel.length}
                            title="hóa đơn"
                            choseAction={DataGrid_handleAction}
                            removeItemChosed={() => {
                                setRowSelectionModel([]);
                            }}
                        />
                    </div>
                )}

                <Stack marginTop={rowSelectionModel.length > 0 ? 1 : 5} className="page-box-right" spacing={1}>
                    <DataGrid
                        disableRowSelectionOnClick
                        className={rowSelectionModel.length > 0 ? 'data-grid-row-chosed' : 'data-grid-row'}
                        rowHeight={40}
                        autoHeight={pageDataHoaDon.items.length === 0}
                        columns={columns}
                        rows={pageDataHoaDon.items}
                        hideFooter
                        checkboxSelection
                        onRowClick={(item) => choseRow(item)}
                        localeText={TextTranslate}
                        onRowSelectionModelChange={(newRowSelectionModel) => {
                            setRowSelectionModel(newRowSelectionModel);
                        }}
                        rowSelectionModel={rowSelectionModel}
                        sx={{
                            ' & .MuiDataGrid-row--lastVisible': {
                                fontWeight: 600,
                                backgroundColor: 'var(--color-header-table)'
                            }
                        }}
                    />
                    <CustomTablePagination
                        currentPage={paramSearch.currentPage ?? 1}
                        rowPerPage={paramSearch.pageSize ?? 10}
                        totalRecord={pageDataHoaDon.totalCount}
                        totalPage={pageDataHoaDon.totalPage}
                        handlePerPageChange={handlePerPageChange}
                        handlePageChange={handleChangePage}
                    />
                </Stack>
            </Box>
        </>
    );
};
export default GiaoDichThanhToan;
