import { useEffect, useRef, useState } from 'react';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import { PropConfirmOKCancel } from '../../../utils/PropParentToChild';
import { Button, Grid, IconButton, Stack, TextField, Typography, Box, SelectChangeEvent } from '@mui/material';
import { Add, DeleteSweepOutlined, PrintOutlined, Search } from '@mui/icons-material';
import { FileUploadOutlined, Edit, DeleteForever, PaidOutlined } from '@mui/icons-material';

import { DataGrid, GridColDef, GridColumnHeaderParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { format } from 'date-fns';

import { PagedRequestDto } from '../../../services/dto/pagedRequestDto';
import ActionRowSelect from '../../../components/DataGrid/ActionRowSelect';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { TextTranslate } from '../../../components/TableLanguage';
import {
    BrandnameDto,
    IParamSearchBrandname,
    PagedResultBrandnameDto
} from '../../../services/sms/brandname/BrandnameDto';
import BrandnameService from '../../../services/sms/brandname/BrandnameService';
import ModalCreateOrEditBrandname from './modal_create_or_edit_brandname';
import ActionViewEditDelete from '../../../components/Menu/ActionViewEditDelete';
import utils from '../../../utils/utils';
import fileDowloadService from '../../../services/file-dowload.service';
import NapTienBrandname from './nap_tien_brandname';
import AppConsts from '../../../lib/appconst';
import QuyHoaDonDto from '../../../services/so_quy/QuyHoaDonDto';
import abpCustom from '../../../components/abp-custom';
import { IList } from '../../../services/dto/IList';

export default function PageBrandname() {
    const firstLoad = useRef(true);
    const [isShowModalAdd, setIsShowModalAdd] = useState(false);
    const [isShowModalNapTien, setIsShowModalNapTien] = useState(false);
    const [brandChosed, setBrandChosed] = useState<BrandnameDto>({ id: '' } as BrandnameDto);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const [dataGrid_typeAction, setDataGrid_typeAction] = useState(0);
    const [inforDelete, setInforDelete] = useState<PropConfirmOKCancel>(new PropConfirmOKCancel({ show: false }));
    const [paramSearch, setParamSearch] = useState<IParamSearchBrandname>({
        keyword: '',
        skipCount: 1,
        maxResultCount: AppConsts.pageOption[0].value,
        sortBy: 'creationTime',
        sortType: 'DESC'
    } as IParamSearchBrandname);

    const [pageDataBrandname, setPageDataBrandname] = useState<PagedResultBrandnameDto>({
        items: [] as BrandnameDto[]
    } as PagedResultBrandnameDto);

    useEffect(() => {
        GetListBrandname();
    }, []);

    const handleKeyDownTextSearch = (event: any) => {
        if (event.keyCode === 13) {
            hanClickIconSearch();
        }
    };

    const hanClickIconSearch = () => {
        if (paramSearch.skipCount !== 1) {
            setParamSearch({
                ...paramSearch,
                skipCount: 1
            });
        } else {
            GetListBrandname();
        }
    };

    const GetListBrandname = async () => {
        const data = await BrandnameService.SMS_GetTongSuDung_AllBrandname(paramSearch);

        if (data !== null) {
            setPageDataBrandname({
                items: data.items,
                totalCount: data.totalCount,
                totalPage: Math.ceil(data.totalCount / paramSearch.maxResultCount)
            });
        }
    };

    const exportToExcel = async () => {
        const param = { ...paramSearch };
        param.maxResultCount = pageDataBrandname.totalCount;
        param.skipCount = 1;
        const data = await BrandnameService.ExportToExcel_ListBrandname(param);
        fileDowloadService.downloadExportFile(data);
    };

    const choseRow = (item: any) => {
        setBrandChosed(item?.row);
    };

    const handleChangePage = (event: any, value: number) => {
        setParamSearch({
            ...paramSearch,
            skipCount: value
        });
    };
    const handlePerPageChange = (event: SelectChangeEvent<number>) => {
        setParamSearch({
            ...paramSearch,
            skipCount: 1, //reset currentpage
            maxResultCount: parseInt(event.target.value.toString(), 10)
        });
    };

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        GetListBrandname();
    }, [paramSearch.skipCount, paramSearch.maxResultCount]);

    const DataGrid_handleAction = async (item: any) => {
        switch (parseInt(item.id)) {
            case 1:
                setInforDelete({
                    ...inforDelete,
                    show: true,
                    title: 'Thông báo xóa',
                    mes: `Bạn có chắc chắn muốn xóa ${rowSelectionModel.length} brandname này không?`
                });
                break;
            case 2:
                {
                    setInforDelete({
                        ...inforDelete,
                        show: true,
                        title: 'Kích hoạt',
                        mes: `Bạn có chắc chắn muốn kích hoạt ${rowSelectionModel.length} brandname này không?`
                    });
                }
                break;
        }
        setDataGrid_typeAction(parseInt(item.id));
    };

    const doActionRow = (action: number, item: any) => {
        switch (action) {
            case 1:
                {
                    setIsShowModalAdd(true);
                    setBrandChosed(item);
                }
                break;
            case 2:
                setInforDelete({
                    ...inforDelete,
                    show: true,
                    mes: `Bạn có chắc chắn muốn xóa brandname ${item.brandname} này không?`
                });
                break;
        }
    };

    const Delete_MultipleBrandname = async () => {
        if (rowSelectionModel.length > 0) {
            switch (dataGrid_typeAction) {
                case 1:
                    {
                        const data = await BrandnameService.DeleteMultiple_Brandname(rowSelectionModel);
                        if (data) {
                            setObjAlert({
                                show: true,
                                type: 1,
                                mes: `Xóa ${rowSelectionModel.length} brandname thành công`
                            });
                        } else {
                            setObjAlert({
                                show: true,
                                type: 2,
                                mes: `Xóa ${rowSelectionModel.length} brandname thất bại`
                            });
                        }
                    }
                    break;
                case 2:
                    {
                        const data = await BrandnameService.ActiveMultiple_Brandname(rowSelectionModel);
                        if (data) {
                            setObjAlert({
                                show: true,
                                type: 1,
                                mes: `Kích hoạt ${rowSelectionModel.length} brandname thành công`
                            });
                        } else {
                            setObjAlert({
                                show: true,
                                type: 2,
                                mes: `Kích hoạt ${rowSelectionModel.length} brandname thất bại`
                            });
                        }
                    }
                    break;
            }
            await GetListBrandname();
        } else {
            // only
            const data = await BrandnameService.XoaBrandname(brandChosed.id);
            if (utils.checkNull(data)) {
                setObjAlert({
                    show: true,
                    type: 1,
                    mes: `Xóa ${brandChosed.brandname} brandname thành công`
                });
                setPageDataBrandname({
                    ...pageDataBrandname,
                    items: pageDataBrandname.items.filter((x: BrandnameDto) => x.id !== brandChosed.id),
                    totalCount: pageDataBrandname.totalCount - 1
                });
            } else {
                setObjAlert({
                    show: true,
                    type: 2,
                    mes: `Xóa ${brandChosed.brandname} brandname thất bại`
                });
            }
        }
        setInforDelete({ ...inforDelete, show: false });
    };

    const onSaveBrandname = (dataSave: BrandnameDto) => {
        setIsShowModalAdd(false);
        if (utils.checkNull(brandChosed.id)) {
            setPageDataBrandname({
                ...pageDataBrandname,
                items: [dataSave, ...pageDataBrandname.items],
                totalCount: pageDataBrandname.totalCount + 1
            });
        } else {
            // update
            setPageDataBrandname({
                ...pageDataBrandname,
                items: pageDataBrandname.items.map((x: BrandnameDto) => {
                    if (x.id === dataSave.id) {
                        return {
                            ...x,
                            tenantId: dataSave.tenantId,
                            brandname: dataSave.brandname,
                            sdtCuaHang: dataSave.sdtCuaHang,
                            tenantName: '',
                            displayTenantName: dataSave.displayTenantName,
                            ngayKichHoat: dataSave.ngayKichHoat,
                            trangThai: dataSave.trangThai,
                            txtTrangThai: dataSave.txtTrangThai
                        };
                    } else {
                        return x;
                    }
                })
            });
        }
    };

    const saveNapTienBrandname = async (dataSave: QuyHoaDonDto) => {
        setIsShowModalNapTien(false);

        const tongThu = utils.formatNumberToFloat(dataSave.tongTienThu);
        // update
        setPageDataBrandname({
            ...pageDataBrandname,
            items: pageDataBrandname.items.map((x: BrandnameDto) => {
                if (x.id === dataSave.idBrandname) {
                    return {
                        ...x,
                        tongTienNap: x.tongTienNap + tongThu,
                        conLai: x.conLai + tongThu
                    };
                } else {
                    return x;
                }
            })
        });
    };

    const columns: GridColDef[] = [
        {
            field: 'brandname',
            headerName: 'Tên brandname',
            flex: 0.8,
            renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>
        },
        {
            field: 'displayTenantName',
            headerName: 'Tên cửa hàng',
            flex: 1.5,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
        },
        {
            field: 'sdtCuaHang',
            headerName: 'SDT cửa hàng',
            flex: 0.8,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
        },
        {
            field: 'ngayKichHoat',
            headerName: 'Ngày kích hoạt',
            headerAlign: 'center',
            align: 'center',
            flex: 0.8,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => <Box title={params.value}>{format(new Date(params.value), 'dd/MM/yyyy')}</Box>
        },
        {
            field: 'tongTienNap',
            headerName: 'Tổng tiền nạp',
            headerAlign: 'right',
            align: 'right',
            flex: 0.8,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box title={params.value}>{new Intl.NumberFormat('vi-VN').format(params.value)}</Box>
            )
        },
        {
            field: 'daSuDung',
            headerName: 'Đã sử dụng',
            headerAlign: 'right',
            align: 'right',
            flex: 0.8,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box title={params.value}>{new Intl.NumberFormat('vi-VN').format(params.value)}</Box>
            )
        },
        {
            field: 'conLai',
            headerName: 'Còn lại',
            headerAlign: 'right',
            align: 'right',
            flex: 0.8,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params: any) => (
                <Box title={params.value}>{new Intl.NumberFormat('vi-VN').format(params.value)}</Box>
            )
        },
        {
            field: 'txtTrangThai',
            headerAlign: 'center',
            headerName: 'Trạng thái',
            align: 'center',
            flex: 0.8,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
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
            field: 'Thao tác',
            headerName: '#',
            headerAlign: 'center',
            align: 'center',
            flex: 0.2,
            disableColumnMenu: true,
            sortable: false,
            renderHeader: (params: GridColumnHeaderParams) => (
                <Box title={params.field}>{params.colDef.headerName}</Box>
            ),
            renderCell: (params) => (
                <ActionViewEditDelete
                    lstOption={[
                        {
                            id: '1',
                            text: 'Sửa',
                            color: '#009EF7',
                            icon: <Edit sx={{ color: '#009EF7' }} />
                        },
                        {
                            id: '2',
                            text: 'Xóa',
                            color: '#F1416C',
                            icon: <DeleteForever sx={{ color: '#F1416C' }} />
                        }
                    ]}
                    handleAction={(action: any) => doActionRow(action, params.row)}
                />
            )
        }
    ];

    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>

            <ConfirmDelete
                isShow={inforDelete.show}
                title={inforDelete.title}
                mes={inforDelete.mes}
                onOk={Delete_MultipleBrandname}
                onCancel={() => setInforDelete({ ...inforDelete, show: false })}></ConfirmDelete>
            <ModalCreateOrEditBrandname
                isShow={isShowModalAdd}
                onClose={() => setIsShowModalAdd(false)}
                idBrandname={brandChosed.id}
                objUpdate={brandChosed}
                onSave={onSaveBrandname}
            />
            <NapTienBrandname
                visiable={isShowModalNapTien}
                idQuyHD={''}
                onClose={() => setIsShowModalNapTien(false)}
                onOk={saveNapTienBrandname}
            />

            <Grid container paddingTop={2} spacing={2}>
                <Grid item xs={12} md={6}>
                    <Grid container alignItems={'center'} spacing={1}>
                        <Grid item lg={4}>
                            <Typography className="page-title">Danh mục brandname</Typography>
                        </Grid>
                        <Grid item xs={6}>
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
                                onChange={(event) =>
                                    setParamSearch({
                                        ...paramSearch,
                                        keyword: event.target.value
                                    })
                                }
                                onKeyDown={(event) => {
                                    handleKeyDownTextSearch(event);
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Stack direction={'row'} spacing={1} justifyContent={'end'}>
                        <Button
                            size="small"
                            onClick={exportToExcel}
                            variant="outlined"
                            startIcon={<FileUploadOutlined />}
                            className="btnNhapXuat btn-outline-hover"
                            sx={{
                                bgcolor: '#fff!important',
                                color: '#666466',
                                display: abpCustom.isGrandPermission('Pages.Brandname.Export') ? '' : 'none'
                            }}>
                            Xuất
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setIsShowModalAdd(true);
                                setBrandChosed({ id: '' } as BrandnameDto);
                            }}
                            startIcon={<Add />}
                            sx={{ display: abpCustom.isGrandPermission('Pages.Brandname.Create') ? '' : 'none' }}>
                            Thêm mới
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setIsShowModalNapTien(true);
                            }}
                            startIcon={<PaidOutlined />}
                            sx={{ display: abpCustom.isGrandPermission('Pages.Brandname.NopTien') ? '' : 'none' }}>
                            Nạp tiền
                        </Button>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    {rowSelectionModel.length > 0 && (
                        <div style={{ marginTop: '24px' }}>
                            <ActionRowSelect
                                lstOption={
                                    [
                                        {
                                            id: '1',
                                            text: 'Xóa brandname',
                                            isShow: abpCustom.isGrandPermission('Pages.Brandname.Delete'),
                                            icon: <DeleteSweepOutlined sx={{ width: '1rem', height: '1rem' }} />
                                        },
                                        {
                                            id: '2',
                                            text: 'Kích hoạt',
                                            isShow: abpCustom.isGrandPermission('Pages.Brandname.Unlock'),
                                            icon: <PrintOutlined sx={{ width: '1rem', height: '1rem' }} />
                                        }
                                    ] as IList[]
                                }
                                countRowSelected={rowSelectionModel.length}
                                title="brandname"
                                choseAction={DataGrid_handleAction}
                                removeItemChosed={() => {
                                    setRowSelectionModel([]);
                                }}
                            />
                        </div>
                    )}

                    <Stack marginTop={2} className="page-box-right" spacing={1}>
                        <DataGrid
                            disableRowSelectionOnClick
                            className={rowSelectionModel.length > 0 ? 'data-grid-row-chosed' : 'data-grid-row'}
                            rowHeight={46}
                            autoHeight={pageDataBrandname.items.length === 0}
                            columns={columns}
                            rows={pageDataBrandname.items}
                            hideFooter
                            checkboxSelection
                            onRowClick={(item: any) => choseRow(item)}
                            localeText={TextTranslate}
                            onRowSelectionModelChange={(newRowSelectionModel) => {
                                setRowSelectionModel(newRowSelectionModel);
                            }}
                            rowSelectionModel={rowSelectionModel}
                        />
                        <CustomTablePagination
                            currentPage={paramSearch.skipCount ?? 1}
                            rowPerPage={paramSearch.maxResultCount ?? 10}
                            totalRecord={pageDataBrandname.totalCount}
                            totalPage={pageDataBrandname.totalPage}
                            handlePerPageChange={handlePerPageChange}
                            handlePageChange={handleChangePage}
                        />
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}
