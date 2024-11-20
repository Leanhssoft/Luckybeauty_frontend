import * as React from 'react';
import {
    DataGrid,
    GridCellParams,
    GridColDef,
    GridColumnVisibilityModel,
    GridRenderCellParams,
    GridRowParams,
    GridRowSelectionModel
} from '@mui/x-data-grid';
import { TextTranslate } from '../../components/TableLanguage';
import {
    Button,
    ButtonGroup,
    Typography,
    Grid,
    Box,
    Stack,
    TextField,
    IconButton,
    Avatar,
    SelectChangeEvent,
    Checkbox
} from '@mui/material';
import { Add } from '@mui/icons-material';
import './customerPage.css';
import DownloadIcon from '../../images/download.svg';
import UploadIcon from '../../images/upload.svg';
import AddIcon from '../../images/add.svg';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SearchIcon from '@mui/icons-material/Search';
import { ReactComponent as FilterIcon } from '../../images/icons/i-filter.svg';
import khachHangService from '../../services/khach-hang/khachHangService';
import fileDowloadService from '../../services/file-dowload.service';
import CreateOrEditCustomerDialog from './components/create-or-edit-customer-modal';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import CustomTablePagination from '../../components/Pagination/CustomTablePagination';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';
import { observer } from 'mobx-react';
import khachHangStore from '../../stores/khachHangStore';
import { enqueueSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import CustomerInfo from './components/CustomerInfo';
import ImportExcel from '../../components/ImportComponent/ImportExcel';
import { FileUpload } from '../../services/dto/FileUpload';
import uploadFileService from '../../services/uploadFileService';
import abpCustom from '../../components/abp-custom';
import suggestStore from '../../stores/suggestStore';
import CreateOrEditNhomKhachModal from './components/create-nhom-khach-modal';
import AccordionNhomKhachHang from '../../components/Accordion/NhomKhachHang';
import { SuggestNhomKhachDto } from '../../services/suggests/dto/SuggestNhomKhachDto';
import utils from '../../utils/utils';
import ActionRowSelect from '../../components/DataGrid/ActionRowSelect';
import BangBaoLoiFileImport from '../../components/ImportComponent/BangBaoLoiFileImport';
import { BangBaoLoiFileimportDto } from '../../services/dto/BangBaoLoiFileimportDto';
import { ModalChuyenNhom } from '../../components/Dialog/modal_chuyen_nhom';
import { IList } from '../../services/dto/IList';
import { format } from 'date-fns';
import { Guid } from 'guid-typescript';
import CustomerFilterDrawer from './components/CustomerFilterDrawer';
import CustomerInfor2 from './components/customer_infor2';
import ActionRow2Button from '../../components/DataGrid/ActionRow2Button';
import { TypeAction } from '../../lib/appconst';
import ZaloService from '../../services/zalo/ZaloService';
import ModalGuiTinNhanZalo from '../zalo/modal_gui_tin_zalo';
import { TypeErrorImport } from '../../enum/TypeErrorImport';
interface CustomerScreenState {
    rowTable: KhachHangItemDto[];
    toggle: boolean;
    idkhachHang: string;
    rowPerPage: number;
    currentPage: number;
    keyword: string;
    sortBy: string;
    sortType: string;
    timeFrom?: Date;
    timeTo?: Date;
    tongChiTieuTu?: number;
    tongChiTieuDen?: number;
    gioiTinh?: boolean;
    totalItems: number;
    totalPage: number;
    isShowConfirmDelete: boolean;
    importShow: boolean;
    moreOpen: boolean;
    anchorEl: any;
    selectedRowId: any;
    visibilityColumn: any;
    information: boolean;
    idNhomKhach: string;
    isShowNhomKhachModal: boolean;
    listAllNhomKhach: SuggestNhomKhachDto[];
    listNhomKhachSearch: SuggestNhomKhachDto[];
    rowSelectionModel: GridRowSelectionModel;
    isShowModalChuyenNhom: boolean;
    expendActionSelectedRow: boolean;
    listItemSelectedModel: Guid[];
    checkAllRow: boolean;
    lstErrImport: BangBaoLoiFileimportDto[];
    anchorElFilter: any;
    isShowModalGuiTinZalo?: boolean;
}
class CustomerScreen extends React.Component<any, CustomerScreenState> {
    constructor(props: any) {
        super(props);

        this.state = {
            rowTable: [],
            toggle: false,
            idkhachHang: '',
            rowPerPage: 10,
            currentPage: 1,
            keyword: '',
            sortBy: 'createTime',
            sortType: 'desc',
            timeFrom: undefined,
            timeTo: undefined,
            tongChiTieuDen: undefined,
            tongChiTieuTu: undefined,
            gioiTinh: undefined,
            importShow: false,
            totalItems: 0,
            totalPage: 0,
            isShowConfirmDelete: false,
            moreOpen: false,
            anchorEl: null,
            selectedRowId: null,
            visibilityColumn: {},
            information: false,
            idNhomKhach: '',
            isShowNhomKhachModal: false,
            listAllNhomKhach: [],
            listNhomKhachSearch: [],
            rowSelectionModel: [],
            isShowModalChuyenNhom: false,
            checkAllRow: false,
            expendActionSelectedRow: false,
            listItemSelectedModel: [],
            lstErrImport: [],
            anchorElFilter: false,
            isShowModalGuiTinZalo: false
        };
    }
    componentDidMount(): void {
        this.getData();
        const visibilityColumn = localStorage.getItem('visibilityColumn') ?? {};
        this.setState({
            visibilityColumn: visibilityColumn
        });

        this.getSuggest();
    }
    async getSuggest() {
        await suggestStore.getSuggestNhomKhach();
        await suggestStore.Zalo_GetAccessToken();
    }
    async getData() {
        const khachHangs = await khachHangService.getAll({
            keyword: this.state.keyword,
            maxResultCount: this.state.rowPerPage,
            skipCount: this.state.currentPage,
            loaiDoiTuong: 0,
            sortBy: this.state.sortBy,
            sortType: this.state.sortType,
            timeFrom: this.state.timeFrom,
            timeTo: this.state.timeTo,
            gioiTinh: this.state.gioiTinh,
            tongChiTieuDen: this.state.tongChiTieuDen,
            tongChiTieuTu: this.state.tongChiTieuTu,
            idChiNhanh: Cookies.get('IdChiNhanh') ?? undefined,
            idNhomKhach: this.state.idNhomKhach == '' ? undefined : this.state.idNhomKhach
        });
        await this.setState({
            rowTable: khachHangs.items,
            totalItems: khachHangs.totalCount,
            totalPage: Math.ceil(khachHangs.totalCount / this.state.rowPerPage)
        });

        this.setState((prev) => {
            return {
                ...prev,
                listAllNhomKhach: suggestStore.suggestNhomKhach,
                listNhomKhachSearch: suggestStore.suggestNhomKhach
            };
        });
    }
    handleChange = (event: any) => {
        //const { name, value } = event.target;
        // this.setState({
        //     createOrEditKhachHang: {
        //         ...this.state.createOrEditKhachHang,
        //         [name]: value
        //     }
        // });
    };
    handleSubmit = () => {
        this.getData();
        this.handleToggle();
    };
    async createOrUpdateModalOpen(id: string) {
        if (id === '') {
            await khachHangStore.createKhachHangDto();
        } else {
            await khachHangStore.getForEdit(id ?? '');
        }
        this.setState({ idkhachHang: id ?? '' }, () => {
            this.handleToggle();
        });
    }
    onNhomKhachModal = async () => {
        await khachHangStore.createNewNhomKhachDto();
        this.setState({
            isShowNhomKhachModal: !this.state.isShowNhomKhachModal,
            listNhomKhachSearch: suggestStore.suggestNhomKhach
        });
    };
    onEditNhomKhach = async (isEdit: boolean, item: any) => {
        if (isEdit) {
            await khachHangStore.getNhomKhachForEdit(item.id);
            this.setState({
                isShowNhomKhachModal: !this.state.isShowNhomKhachModal
            });
        } else {
            // filer
            if (item != null) {
                this.setState(
                    {
                        idNhomKhach: item.id
                    },
                    () => {
                        this.getData();
                    }
                );
            } else {
                this.setState(
                    {
                        idNhomKhach: ''
                    },
                    () => {
                        this.getData();
                    }
                );
            }
        }
    };

    async delete(id: string) {
        const deleteReult = await khachHangService.delete(id);
        deleteReult != null
            ? enqueueSnackbar('Xóa bản ghi thành công', {
                  variant: 'success',
                  autoHideDuration: 3000
              })
            : enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại sau!', {
                  variant: 'error',
                  autoHideDuration: 3000
              });
    }
    handleToggle = () => {
        this.setState({
            toggle: !this.state.toggle
        });
    };
    exportToExcel = async () => {
        const result = await khachHangService.exportDanhSach({
            keyword: this.state.keyword,
            maxResultCount: this.state.rowPerPage,
            skipCount: this.state.currentPage,
            idChiNhanh: Cookies.get('IdChiNhanh'),
            loaiDoiTuong: 0,
            sortBy: '',
            sortType: 'desc'
        });
        fileDowloadService.downloadExportFile(result);
    };
    onImportShow = async () => {
        await this.setState({
            importShow: !this.state.importShow
        });
        this.getData();
    };
    handleImportData = async (input: FileUpload) => {
        const result = await khachHangService.checkData_FileImportKhachHang(input);
        if (result.length === 0) {
            const dataImport = await khachHangService.importKhachHang(input);
            if (dataImport?.result > 0) {
                this.setState({ lstErrImport: dataImport });
            } else {
                enqueueSnackbar('Import khách hàng thành công', {
                    variant: 'success',
                    autoHideDuration: 3000
                });
            }
        } else {
            this.setState({ lstErrImport: result });
            const errImport = result.filter(
                (x: BangBaoLoiFileimportDto) => x.loaiErr === TypeErrorImport.IMPORT
            ).length;
            if (errImport > 0) {
                // import 1 số thành côg, 1 số thất bại
                enqueueSnackbar(`Import thành công,  ${errImport} thất bại`, {
                    variant: result.status == 'success' ? 'success' : result.status,
                    autoHideDuration: 3000
                });
            }
        }
        this.onImportShow();
    };
    downloadImportTemplate = async () => {
        const result = await uploadFileService.downloadImportTemplate('KhachHang_ImportTemplate.xlsx');
        fileDowloadService.downloadExportFile(result);
    };
    handlePageChange = async (event: any, newPage: number) => {
        await this.setState({ currentPage: newPage });
        await this.getData();
    };
    handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await this.setState({
            rowPerPage: parseInt(event.target.value.toString(), 10),
            currentPage: 1
        });
        this.getData();
    };

    handleOpenMenu = (event: any, rowId: any) => {
        this.setState({ anchorEl: event.currentTarget, selectedRowId: rowId });
    };

    handleCloseMenu = async () => {
        await this.setState({ anchorEl: null, selectedRowId: null });
        await this.getData();
    };

    handleView = (param: GridRowParams) => {
        // Handle View action
        // this.handleCloseMenu();
        // window.location.href = `/khach-hang-chi-tiet/${param.id}`;
        this.setState({ information: true, idkhachHang: param.id.toString() });
    };
    handleCellClick = (param: GridCellParams) => {
        if (param.field == 'checkBox' || param.field == 'action') {
            return;
        }
        this.setState({ information: true, idkhachHang: param.id.toString() });
    };
    handleClickAction = async (type: number, param: GridCellParams) => {
        this.setState({ selectedRowId: param.id.toString() });
        switch (type) {
            case TypeAction.DELETE:
                {
                    const role = abpCustom.isGrandPermission('Pages.KhachHang.Delete');
                    if (!role) {
                        enqueueSnackbar('Không có quyền xóa khách hàng', {
                            variant: 'error',
                            autoHideDuration: 3000
                        });
                        return;
                    }
                    this.setState({ isShowConfirmDelete: true });
                }
                break;
            case TypeAction.UPDATE:
                {
                    const role = abpCustom.isGrandPermission('Pages.KhachHang.Delete');
                    if (!role) {
                        enqueueSnackbar('Không có quyền cập nhật khách hàng', {
                            variant: 'error',
                            autoHideDuration: 3000
                        });
                        return;
                    }
                    this.createOrUpdateModalOpen(param.id.toString());
                }
                break;
        }
    };

    handleEdit = () => {
        // Handle Edit action
        this.createOrUpdateModalOpen(this.state.selectedRowId ?? '');
        this.handleCloseMenu();
    };
    onOkDelete = async () => {
        if (this.state.listItemSelectedModel.length > 0) {
            const ok = await khachHangService.DeleteMultipleCustomer(this.state.listItemSelectedModel);
            ok
                ? enqueueSnackbar('Xóa khách hàng thành công', {
                      variant: 'success',
                      autoHideDuration: 3000
                  })
                : enqueueSnackbar('Xóa khách hàng thất bại', {
                      variant: 'error',
                      autoHideDuration: 3000
                  });
            this.getData();
        } else {
            await this.delete(this.state.selectedRowId ?? '');
            this.handleCloseMenu();
        }
        this.showConfirmDelete();
    };
    showConfirmDelete = () => {
        // Handle Delete action
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete
        });
    };
    toggleColumnVisibility = (column: GridColumnVisibilityModel) => {
        localStorage.setItem('visibilityColumn', JSON.stringify(column));
        this.setState({ visibilityColumn: column });
    };
    onSort = async (sortType: string, sortBy: string) => {
        await this.setState((prev: any) => {
            return {
                ...prev,
                sortBy: sortBy,
                sortType: sortType
            };
        });
        this.getData();
    };
    handleOpenInfor = () => {
        // if (params.column.field !== 'actions') {
        this.setState({ information: true });
        // }
    };
    handleCloseInfor = () => {
        this.setState({ information: false });
    };
    searchNhomKhach = (textSearch: string) => {
        let txt = textSearch;
        let txtUnsign = '';
        if (!utils.checkNull(txt)) {
            txt = txt.trim();
            txtUnsign = utils.strToEnglish(txt);
        }
        const arr = this.state.listAllNhomKhach.filter(
            (x: SuggestNhomKhachDto) =>
                (x.tenNhomKhach ?? '').indexOf(txt) > -1 ||
                utils.strToEnglish(x.tenNhomKhach ?? '').indexOf(txtUnsign) > -1
        );
        this.setState({ listNhomKhachSearch: arr });
    };
    onShowChuyenNhomKhach = () => {
        this.setState({
            isShowModalChuyenNhom: true
        });
    };
    exportSelectedRow = async () => {
        const result = await khachHangService.exportSelectedDanhSach(this.state.listItemSelectedModel);
        fileDowloadService.downloadExportFile(result);
        this.setState({ listItemSelectedModel: [] });
    };
    DataGrid_handleAction = async (item: any) => {
        switch (parseInt(item.id)) {
            case 1: // chuyennhom
                this.setState({
                    isShowModalChuyenNhom: true
                });
                break;
            case 2:
                {
                    this.setState({ isShowConfirmDelete: true });
                }
                break;
            case 3:
                {
                    await this.exportSelectedRow();
                }
                break;
            case 4:
                {
                    this.setState({ isShowModalGuiTinZalo: true });
                }
                break;
        }
    };
    saveSMSOK = (typeAction: number) => {
        this.setState({ isShowModalGuiTinZalo: false });
    };
    chuyenNhomKhach = async (itemChosed: IList) => {
        const ok = await khachHangService.ChuyenNhomKhachHang(this.state.rowSelectionModel, itemChosed.id);
        this.setState({ isShowModalChuyenNhom: false });
        ok
            ? enqueueSnackbar('Chuyển nhóm khách hàng  thành công', {
                  variant: 'success',
                  autoHideDuration: 3000
              })
            : enqueueSnackbar('Chuyển nhóm khách hàng thất bại', {
                  variant: 'error',
                  autoHideDuration: 3000
              });
        this.getData();
    };
    handleCheckboxGridRowClick = (params: GridRenderCellParams) => {
        const { id } = params.row;
        const selectedIndex = this.state.listItemSelectedModel.indexOf(id);
        let newSelectedRows = [];

        if (selectedIndex === -1) {
            newSelectedRows = [...this.state.listItemSelectedModel, id];
        } else {
            newSelectedRows = [
                ...this.state.listItemSelectedModel.slice(0, selectedIndex),
                ...this.state.listItemSelectedModel.slice(selectedIndex + 1)
            ];
        }

        this.setState({ listItemSelectedModel: newSelectedRows });
    };
    handleSelectAllGridRowClick = () => {
        if (this.state.checkAllRow) {
            const allRowRemove = this.state.rowTable.map((row) => row.id);
            const newRows = this.state.listItemSelectedModel.filter((item) => !allRowRemove.includes(item));
            this.setState({ listItemSelectedModel: newRows });
        } else {
            const allRowIds = this.state.rowTable.map((row) => row.id);
            const mergeRowId = new Set([...this.state.listItemSelectedModel, ...allRowIds]);
            this.setState({
                listItemSelectedModel: Array.from(mergeRowId)
            });
        }
        this.setState({ checkAllRow: !this.state.checkAllRow });
    };
    render(): React.ReactNode {
        // const apiRef = useGridApiRef();
        const columns: GridColDef[] = [
            {
                field: 'checkBox',
                sortable: false,
                filterable: false,
                disableColumnMenu: true,
                flex: 0.2,
                renderHeader: (params) => {
                    return <Checkbox onClick={this.handleSelectAllGridRowClick} checked={this.state.checkAllRow} />;
                },
                renderCell: (params) => (
                    <Checkbox
                        onClick={() => this.handleCheckboxGridRowClick(params)}
                        checked={this.state.listItemSelectedModel.includes(params.row.id)}
                    />
                )
            },
            {
                field: 'maKhachHang',
                headerName: 'Mã khách',
                minWidth: 120,
                maxWidth: 120,
                flex: 1,
                renderCell: (params) => (
                    <Box
                        style={{
                            display: 'flex',
                            alignItems: 'center',

                            width: '100%'
                        }}
                        title={params.value}>
                        <Avatar
                            src={uploadFileService.GoogleApi_NewLink(params.row.avatar)}
                            alt="Avatar"
                            style={{ width: 24, height: 24, marginRight: 8 }}
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                width: '100%'
                            }}>
                            {params.value}
                        </Typography>
                    </Box>
                ),
                renderHeader: (params) => <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
            },
            {
                field: 'tenKhachHang',
                headerName: 'Tên khách hàng',
                minWidth: 170,
                maxWidth: 200,
                flex: 1.5,
                renderCell: (params) => (
                    <Box
                        style={{
                            display: 'flex',
                            alignItems: 'center',

                            width: '100%'
                        }}
                        title={params.value}>
                        <Typography
                            variant="body2"
                            sx={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                width: '100%'
                            }}>
                            {params.value}
                        </Typography>
                    </Box>
                ),
                renderHeader: (params) => <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
            },
            {
                field: 'soDienThoai',
                headerName: 'Số điện thoại',
                minWidth: 120,
                flex: 1,
                renderHeader: (params) => <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
            },
            {
                field: 'ngaySinh',
                headerName: 'Ngày sinh',
                minWidth: 120,
                flex: 1,
                renderHeader: (params) => <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>,
                renderCell: (params) => (
                    <Typography variant="body2">
                        {params.value ? format(new Date(params.value), 'dd/MM/yyyy') : ''}
                    </Typography>
                )
            },
            {
                field: 'tenNhomKhach',
                minWidth: 150,
                headerName: 'Nhóm khách',
                flex: 1,
                renderHeader: (params) => <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
            },
            {
                field: 'tongChiTieu',
                minWidth: 150,
                headerName: 'Tổng mua',
                headerAlign: 'right',
                align: 'right',
                flex: 1,
                renderHeader: (params) => <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>,
                renderCell: (params) => (
                    <Box title={params.value} fontSize={'var(--font-size-main)'} textAlign="right" width="100%">
                        {new Intl.NumberFormat('vi-VN').format(params.value)}
                    </Box>
                )
            },
            {
                field: 'conNo',
                headerName: 'Còn nợ',
                headerAlign: 'right',
                minWidth: 150,
                align: 'right',
                flex: 1,
                renderHeader: (params) => <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>,
                renderCell: (params) => (
                    <Box title={params.value} color={params.value > 0 ? 'red' : ''}>
                        {new Intl.NumberFormat('vi-VN').format(params.value)}
                    </Box>
                )
            },

            {
                field: 'action',
                headerName: '#',
                flex: 0.5,
                align: 'center',
                headerAlign: 'center',
                disableColumnMenu: true,
                sortable: false,
                renderCell: (params) => (
                    <ActionRow2Button handleClickAction={(type: number) => this.handleClickAction(type, params)} />
                ),
                renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
            }
        ];

        return (
            <>
                {this.state.information === false ? (
                    <Grid className="customer-page" container paddingTop={2}>
                        <ModalGuiTinNhanZalo
                            isShowModal={this.state.isShowModalGuiTinZalo ?? false}
                            idUpdate={''}
                            onClose={() => this.setState({ isShowModalGuiTinZalo: false })}
                            onOK={this.saveSMSOK}
                        />
                        <BangBaoLoiFileImport
                            isOpen={this.state.lstErrImport.length > 0}
                            lstError={this.state.lstErrImport}
                            onClose={() => this.setState({ lstErrImport: [] })}
                            clickImport={() => console.log(this.state.lstErrImport)}
                        />
                        <ModalChuyenNhom
                            title="Chuyển nhóm khách hàng"
                            icon={<PersonOutlineIcon />}
                            isOpen={this.state.isShowModalChuyenNhom}
                            lstData={this.state.listAllNhomKhach
                                ?.filter((x) => !utils.checkNull(x.id))
                                .map((item: any, index: number) => {
                                    return {
                                        id: item.id,
                                        text: item.tenNhomKhach,
                                        color: index % 3 == 1 ? '#5654A8' : index % 3 == 2 ? '#d525a1' : '#FF5677'
                                    };
                                })}
                            onClose={() => this.setState({ isShowModalChuyenNhom: false })}
                            agreeChuyenNhom={this.chuyenNhomKhach}
                        />
                        <Grid container spacing={1} alignItems="center">
                            <Grid item xs={12} md={6} lg={6}>
                                <Grid container alignItems="center">
                                    <Grid item xs={6} sm={6} lg={4}>
                                        <span className="page-title">Danh sách khách hàng</span>
                                    </Grid>
                                    <Grid item xs={6} sm={6} lg={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={this.state.keyword}
                                            sx={{
                                                backgroundColor: '#fff',
                                                borderColor: '#CDC9CD'
                                            }}
                                            variant="outlined"
                                            onChange={async (e) => {
                                                await this.setState({ keyword: e.target.value });
                                            }}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') {
                                                    this.getData();
                                                }
                                            }}
                                            placeholder="Tìm kiếm"
                                            InputProps={{
                                                startAdornment: (
                                                    <IconButton
                                                        onClick={() => {
                                                            this.setState({ currentPage: 1 });
                                                            this.getData();
                                                        }}>
                                                        <SearchIcon />
                                                    </IconButton>
                                                )
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid xs={12} md={6} lg={6} item display="flex" gap="8px" justifyContent="end">
                                <ButtonGroup
                                    variant="contained"
                                    sx={{ gap: '8px' }}
                                    className="rounded-4px resize-height">
                                    <Button
                                        className="border-color btn-outline-hover"
                                        variant="outlined"
                                        onClick={this.onImportShow}
                                        startIcon={<img src={DownloadIcon} />}
                                        sx={{
                                            textTransform: 'capitalize',
                                            fontWeight: '400',
                                            color: '#666466',
                                            bgcolor: '#fff!important',
                                            display: abpCustom.isGrandPermission('Pages.KhachHang.Import') ? '' : 'none'
                                        }}>
                                        Nhập
                                    </Button>
                                    <Button
                                        className="border-color btn-outline-hover"
                                        variant="outlined"
                                        onClick={() => {
                                            this.exportToExcel();
                                        }}
                                        startIcon={<img src={UploadIcon} />}
                                        sx={{
                                            textTransform: 'capitalize',
                                            fontWeight: '400',
                                            color: '#666466',
                                            padding: '10px 16px',
                                            borderColor: '#E6E1E6',
                                            bgcolor: '#fff!important',
                                            display: abpCustom.isGrandPermission('Pages.KhachHang.Export') ? '' : 'none'
                                        }}>
                                        Xuất
                                    </Button>
                                    <Button
                                        className="border-color btn-outline-hover"
                                        aria-describedby="popover-filter"
                                        variant="outlined"
                                        sx={{
                                            textTransform: 'capitalize',
                                            fontWeight: '400',
                                            color: '#666466',
                                            padding: '10px 16px',
                                            borderColor: '#E6E1E6',
                                            bgcolor: '#fff!important'
                                        }}
                                        onClick={(e) => {
                                            this.setState({ anchorElFilter: e.currentTarget });
                                        }}>
                                        <FilterIcon />
                                    </Button>
                                    <Button
                                        className=" btn-container-hover"
                                        onClick={() => {
                                            this.createOrUpdateModalOpen('');
                                        }}
                                        variant="contained"
                                        startIcon={<img src={AddIcon} />}
                                        sx={{
                                            textTransform: 'capitalize',
                                            fontWeight: '400',
                                            minWidth: '173px',
                                            display: abpCustom.isGrandPermission('Pages.KhachHang.Create') ? '' : 'none'
                                        }}>
                                        Thêm khách hàng
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} marginTop={3} columns={13}>
                            <Grid
                                item
                                lg={3}
                                md={3}
                                sm={3}
                                xs={13}
                                display={window.screen.width < 768 ? 'none' : 'block'}>
                                <Box className="page-box-left">
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        borderBottom="1px solid #E6E1E6"
                                        borderRadius={'4px'}
                                        sx={{ backgroundColor: 'var(--color-header-table)' }}
                                        padding="12px">
                                        <Typography fontSize="14px" fontWeight="700">
                                            Nhóm khách hàng
                                        </Typography>

                                        <Add
                                            sx={{
                                                // color: '#fff',
                                                transition: '.4s',
                                                height: '32px',
                                                cursor: 'pointer',
                                                width: '32px',
                                                borderRadius: '4px',
                                                padding: '4px 0px',
                                                border: '1px solid #cccc'
                                            }}
                                            onClick={this.onNhomKhachModal}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            overflow: 'auto',
                                            maxHeight: '66vh',
                                            '&::-webkit-scrollbar': {
                                                width: '7px'
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                bgcolor: 'rgba(0,0,0,0.1)',
                                                borderRadius: '8px'
                                            },
                                            '&::-webkit-scrollbar-track': {
                                                bgcolor: 'var(--color-bg)'
                                            }
                                        }}>
                                        <Stack spacing={1} paddingTop={1}>
                                            <TextField
                                                variant="standard"
                                                fullWidth
                                                placeholder="Tìm kiếm nhóm"
                                                InputProps={{ startAdornment: <SearchIcon /> }}
                                                onChange={(e) => this.searchNhomKhach(e.target.value)}
                                            />
                                            <AccordionNhomKhachHang
                                                dataNhomKhachHang={this.state.listNhomKhachSearch}
                                                clickTreeItem={this.onEditNhomKhach}
                                            />
                                        </Stack>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item lg={10} md={10} sm={10} xs={13}>
                                {this.state.listItemSelectedModel.length > 0 && (
                                    <ActionRowSelect
                                        lstOption={
                                            [
                                                {
                                                    id: '1',
                                                    text: 'Chuyển nhóm khách',
                                                    isShow: abpCustom.isGrandPermission('Pages.KhachHang.Edit')
                                                },
                                                {
                                                    id: '2',
                                                    text: 'Xóa khách hàng',
                                                    isShow: abpCustom.isGrandPermission('Pages.KhachHang.Delete')
                                                },
                                                {
                                                    id: '4',
                                                    text: 'Gửi tin zalo',
                                                    isShow: abpCustom.isGrandPermission('Pages.KhachHang.Delete')
                                                },
                                                {
                                                    id: '3',
                                                    text: 'Xuất danh sách',
                                                    isShow: abpCustom.isGrandPermission('Pages.KhachHang.Export')
                                                }
                                            ] as IList[]
                                        }
                                        countRowSelected={this.state.listItemSelectedModel.length}
                                        title="khách hàng"
                                        choseAction={this.DataGrid_handleAction}
                                        removeItemChosed={() => {
                                            this.setState({
                                                listItemSelectedModel: [],
                                                checkAllRow: false
                                            });
                                        }}
                                    />
                                )}
                                <div
                                    className="page-box-right"
                                    style={{
                                        marginTop: this.state.listItemSelectedModel.length > 0 ? '8px' : 0
                                    }}>
                                    <DataGrid
                                        disableRowSelectionOnClick
                                        rowHeight={42}
                                        autoHeight={this.state.totalItems === 0}
                                        className={
                                            this.state.listItemSelectedModel.length > 0
                                                ? 'data-grid-row-chosed'
                                                : 'data-grid-row'
                                        }
                                        rows={this.state.rowTable}
                                        columns={columns}
                                        // onRowClick={(item) => this.handleView(item)}
                                        onCellClick={this.handleCellClick}
                                        hideFooter
                                        onColumnVisibilityModelChange={this.toggleColumnVisibility}
                                        columnVisibilityModel={this.state.visibilityColumn}
                                        checkboxSelection={false}
                                        localeText={TextTranslate}
                                        sortingOrder={['desc', 'asc']}
                                        sortModel={[
                                            {
                                                field: this.state.sortBy,
                                                sort: this.state.sortType == 'desc' ? 'desc' : 'asc'
                                            }
                                        ]}
                                        onSortModelChange={(newSortModel) => {
                                            if (newSortModel.length > 0) {
                                                this.onSort(
                                                    newSortModel[0].sort?.toString() ?? 'creationTime',
                                                    newSortModel[0].field ?? 'desc'
                                                );
                                            }
                                        }}
                                        onRowSelectionModelChange={(newRowSelectionModel) => {
                                            this.setState({
                                                rowSelectionModel: newRowSelectionModel
                                            });
                                        }}
                                        rowSelectionModel={this.state.rowSelectionModel}
                                    />
                                    {/* <ActionMenuTable
                                        selectedRowId={this.state.selectedRowId}
                                        anchorEl={this.state.anchorEl}
                                        closeMenu={this.handleCloseMenu}
                                        handleView={this.handleOpenInfor}
                                        permissionView=""
                                        handleEdit={this.handleEdit}
                                        permissionEdit="Pages.KhachHang.Edit"
                                        handleDelete={this.showConfirmDelete}
                                        permissionDelete="Pages.KhachHang.Delete"
                                    /> */}

                                    <CustomTablePagination
                                        currentPage={this.state.currentPage}
                                        rowPerPage={this.state.rowPerPage}
                                        totalRecord={this.state.totalItems}
                                        totalPage={this.state.totalPage}
                                        handlePerPageChange={this.handlePerPageChange}
                                        handlePageChange={this.handlePageChange}
                                    />

                                    <CreateOrEditCustomerDialog
                                        visible={this.state.toggle}
                                        onCancel={this.handleToggle}
                                        onOk={this.handleSubmit}
                                        title={
                                            this.state.idkhachHang == ''
                                                ? 'Thêm mới khách hàng'
                                                : 'Cập nhật thông tin khách hàng'
                                        }
                                        formRef={khachHangStore.createEditKhachHangDto}
                                    />
                                </div>
                                <div
                                    className={this.state.toggle ? 'show customer-overlay' : 'customer-overlay'}
                                    onClick={this.handleToggle}></div>
                            </Grid>
                        </Grid>
                        <CreateOrEditNhomKhachModal
                            visiable={this.state.isShowNhomKhachModal}
                            handleClose={this.onNhomKhachModal}
                        />
                        <ConfirmDelete
                            isShow={this.state.isShowConfirmDelete}
                            onOk={this.onOkDelete}
                            onCancel={this.showConfirmDelete}></ConfirmDelete>
                        <ImportExcel
                            tieude={'Nhập file khách hàng'}
                            isOpen={this.state.importShow}
                            onClose={this.onImportShow}
                            downloadImportTemplate={this.downloadImportTemplate}
                            importFile={this.handleImportData}
                        />
                        <CustomerFilterDrawer
                            id={'popover-filter'}
                            anchorEl={this.state.anchorElFilter}
                            handleClose={() => {
                                this.setState({ anchorElFilter: null });
                            }}
                            handleChangeNhomKhach={(idNhomKhach: string) => {
                                this.setState({ idNhomKhach: idNhomKhach });
                            }}
                            handleChangeTongChiTieuTu={(value: any) => {
                                this.setState({ tongChiTieuTu: value });
                            }}
                            handleChangeTongChiTieuDen={(value: any) => {
                                this.setState({ tongChiTieuDen: value });
                            }}
                            handleChangeGioiTinh={(value: any) => {
                                this.setState({ gioiTinh: value });
                            }}
                            handleOk={() => {
                                this.setState({ anchorElFilter: null });
                                this.getData();
                            }}
                        />
                    </Grid>
                ) : (
                    <CustomerInfor2
                        khachHangId={this.state.idkhachHang}
                        onClose={() => {
                            this.setState({ information: false });
                            this.getData();
                        }}
                    />
                )}
            </>
        );
    }
}
export default observer(CustomerScreen);
