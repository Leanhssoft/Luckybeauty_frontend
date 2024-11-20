import { ReactComponent as DateIcon } from '../../images/calendar-5.svg';
import DownloadIcon from '../../images/download.svg';
import UploadIcon from '../../images/upload.svg';
import AddIcon from '../../images/add.svg';
import { ReactComponent as FilterIcon } from '../../images/icons/i-filter.svg';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';
import { SuggestChucVuDto } from '../../services/suggests/dto/SuggestChucVuDto';
import { CreateOrUpdateNhanSuDto } from '../../services/nhan-vien/dto/createOrUpdateNhanVienDto';
import Cookies from 'js-cookie';
import { Add } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {
    Avatar,
    Box,
    Button,
    ButtonGroup,
    Grid,
    IconButton,
    SelectChangeEvent,
    TextField,
    Checkbox,
    Typography,
    Stack,
    Popover
} from '@mui/material';
import CreateOrEditNhanVienDialog from './components/createOrEditNhanVienDialog';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import { observer } from 'mobx-react';
import NhanVienStore from '../../stores/nhanVienStore';
import { TextTranslate } from '../../components/TableLanguage';
import CustomTablePagination from '../../components/Pagination/CustomTablePagination';
import './employee.css';
import { enqueueSnackbar } from 'notistack';
import nhanVienStore from '../../stores/nhanVienStore';
import { FileUpload } from '../../services/dto/FileUpload';
import fileDowloadService from '../../services/file-dowload.service';
import uploadFileService from '../../services/uploadFileService';
import nhanVienService from '../../services/nhan-vien/nhanVienService';
import ImportExcel from '../../components/ImportComponent/ImportExcel';
import abpCustom from '../../components/abp-custom';
import { AppContext, IAppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import { SuggestChiNhanhDto } from '../../services/suggests/dto/SuggestChiNhanhDto';
import suggestStore from '../../stores/suggestStore';
import AppConsts, { TypeAction } from '../../lib/appconst';
import ActionRowSelect from '../../components/DataGrid/ActionRowSelect';
import AccordionWithData from '../../components/Accordion/AccordionWithData';
import { IList } from '../../services/dto/IList';
import CreateOrEditChucVuModal from './chuc-vu/components/create-or-edit-chuc-vu-modal';
import { Guid } from 'guid-typescript';
import ActionRow2Button from '../../components/DataGrid/ActionRow2Button';
class EmployeeScreen extends React.Component {
    static contextType = AppContext;
    state = {
        idNhanSu: '',
        avatarFile: '',
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        filter: '',
        sortBy: 'createTime',
        sortType: 'desc',
        moreOpen: false,
        importShow: false,
        anchorEl: null,
        selectedRowId: null,
        checkAllRow: false,
        suggestChucVu: [] as SuggestChucVuDto[],
        createOrEditNhanSu: {} as CreateOrUpdateNhanSuDto,
        listItemSelectedModel: [] as string[],
        expendActionSelectedRow: false,
        currentPage: 1,
        totalPage: 1,
        totalCount: 0,
        isShowConfirmDelete: false,
        idChiNhanh: Cookies.get('IdChiNhanh'),
        idChucVu: null,
        chucVuVisiable: false,
        anchorElFilter: null
    };
    async componentDidMount() {
        await this.getData();
    }
    componentDidUpdate(prevProps: any, prevState: any, snapshot?: any): void {
        const appContext = this.context as IAppContext;
        const chiNhanhContext = appContext.chinhanhCurrent;

        if (this.state.idChiNhanh !== chiNhanhContext.id) {
            // ChiNhanhContext has changed, update the component
            this.setState({
                idChiNhanh: chiNhanhContext.id
            });
            this.getData();
        }
    }
    resetData() {
        this.setState({
            idNhanSu: '',
            modalVisible: false,
            maxResultCount: 10,
            skipCount: 0,
            filter: '',
            createOrEditNhanSu: {} as CreateOrUpdateNhanSuDto,
            totalNhanVien: 0,
            currentPage: 1,
            totalPage: 1,
            isShowConfirmDelete: false,
            idChucVu: null
        });
    }
    async getData() {
        const appContext = this.context as IAppContext;
        const chiNhanhContext = appContext.chinhanhCurrent as SuggestChiNhanhDto;
        await suggestStore.getSuggestChucVu();
        this.setState({
            suggestChucVu: suggestStore.suggestChucVu,
            idChiNhanh: chiNhanhContext.id
        });
        await NhanVienStore.createNhanVien();
        await this.getListNhanVien();
    }
    async getListNhanVien() {
        const { filter, maxResultCount, currentPage, sortBy, sortType, idChucVu } = this.state;
        const appContext = this.context as IAppContext;
        const chiNhanhContext = appContext.chinhanhCurrent;
        await NhanVienStore.getAll({
            maxResultCount: maxResultCount,
            skipCount: currentPage,
            filter: filter,
            sortBy: sortBy,
            sortType: sortType,
            idChiNhanh: chiNhanhContext.id,
            idChucVu: idChucVu
        });
        this.setState({
            totalPage: Math.ceil(NhanVienStore.listNhanVien.totalCount / maxResultCount),
            totalCount: NhanVienStore.listNhanVien.totalCount
        });
    }
    async delete(id: string) {
        const deleteResult = NhanVienStore.delete(id);
        deleteResult != null
            ? enqueueSnackbar('Xóa bản ghi thành công', {
                  variant: 'success',
                  autoHideDuration: 3000
              })
            : enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại sau!', {
                  variant: 'error',
                  autoHideDuration: 3000
              });
        this.getListNhanVien();
        this.resetData();
    }
    async deleteMany(ids: string[]) {
        const deleteResult = await nhanVienService.deleteMany(ids);
        enqueueSnackbar(deleteResult.message, {
            variant: deleteResult.status,
            autoHideDuration: 3000
        });
        this.setState({ listItemSelectedModel: [] });
        this.getListNhanVien();
        this.resetData();
    }
    Modal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible
        });
    };

    async createOrUpdateModalOpen(id: string) {
        if (id === '') {
            await NhanVienStore.createNhanVien();
            await this.setState({
                createOrEditNhanSu: NhanVienStore.createEditNhanVien
            });
        } else {
            await NhanVienStore.getForEdit(id);
            await this.setState({
                createOrEditNhanSu: NhanVienStore.createEditNhanVien
            });
        }
        this.setState({ idNhanSu: id });
        this.Modal();
    }
    handleSubmit = async () => {
        await this.getData();
        this.setState({ modalVisible: false });
    };
    handlePageChange = async (event: any, value: any) => {
        await this.setState({
            currentPage: value,
            skipCount: value,
            checkAllRow: false
        });
        this.getListNhanVien();
    };
    handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await this.setState({
            maxResultCount: parseInt(event.target.value.toString(), 10),
            currentPage: 1,
            skipCount: 1,
            checkAllRow: false
        });
        this.getData();
    };
    onOkDelete = () => {
        this.state.listItemSelectedModel.length > 0
            ? this.deleteMany(this.state.listItemSelectedModel)
            : this.delete(this.state.selectedRowId ?? '');
        this.handleDelete;
        this.handleCloseMenu();
    };
    handleKeyDown = async (event: any) => {
        if (event.key === 'Enter') {
            await this.setState({
                currentPage: 1,
                skipCount: 1
            });
            this.getListNhanVien();
        }
    };
    handleOpenMenu = (event: any, rowId: any) => {
        this.setState({ anchorEl: event.currentTarget, selectedRowId: rowId });
    };

    handleCloseMenu = async () => {
        await this.setState({ anchorEl: null, selectedRowId: null });
        //await this.getData();
    };

    handleView = () => {
        // Handle View action
        this.handleCloseMenu();
    };

    handleEdit = () => {
        // Handle Edit action
        this.createOrUpdateModalOpen(this.state.selectedRowId ?? '');
        this.handleCloseMenu();
    };

    handleDelete = () => {
        // Handle Delete action
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete,
            idNhanSu: ''
        });
        this.getData();
    };
    doActionRow = (type: number, rowItem: any) => {
        switch (type) {
            case TypeAction.DELETE:
                {
                    const role = abpCustom.isGrandPermission('Pages.NhanSu.Delete');
                    if (!role) {
                        enqueueSnackbar('Không có quyền xóa nhân viên', {
                            variant: 'error',
                            autoHideDuration: 3000
                        });
                        return;
                    }
                    this.setState({
                        isShowConfirmDelete: true,
                        selectedRowId: rowItem?.id
                    });
                }
                break;
            case TypeAction.UPDATE:
                {
                    const role = abpCustom.isGrandPermission('Pages.NhanSu.Edit');
                    if (!role) {
                        enqueueSnackbar('Không có quyền cập nhật thông tin nhân viên', {
                            variant: 'error',
                            autoHideDuration: 3000
                        });
                        return;
                    }
                    this.createOrUpdateModalOpen(rowItem?.id);
                }
                break;
        }
    };
    exportToExcel = async () => {
        const { filter, maxResultCount, currentPage, sortBy, sortType } = this.state;
        const result = await nhanVienService.exportDanhSachNhanVien({
            maxResultCount: maxResultCount,
            skipCount: currentPage,
            filter: filter,
            sortBy: sortBy,
            sortType: sortType,
            idChiNhanh: Cookies.get('IdChiNhanh')
        });
        fileDowloadService.downloadExportFile(result);
    };
    exportSelectedRow = async () => {
        const result = await nhanVienService.exportDanhSachNhanVienSelected(this.state.listItemSelectedModel);
        fileDowloadService.downloadExportFile(result);
        this.setState({ listItemSelectedModel: [] });
    };
    onImportShow = () => {
        this.setState({
            importShow: !this.state.importShow
        });
        this.getData();
    };
    handleImportData = async (input: FileUpload) => {
        const result = await nhanVienService.importNhanVien(input);
        enqueueSnackbar(result.message, {
            variant: result.status == 'success' ? 'success' : result.status,
            autoHideDuration: 3000
        });
    };
    downloadImportTemplate = async () => {
        const result = await uploadFileService.downloadImportTemplate('NhanVien_ImportTemplate.xlsx');
        fileDowloadService.downloadExportFile(result);
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
            const allRowRemove = NhanVienStore.listNhanVien?.items.map((row) => row.id);
            const newRows = this.state.listItemSelectedModel.filter((item) => !allRowRemove.includes(item));
            this.setState({ listItemSelectedModel: newRows });
        } else {
            const allRowIds = NhanVienStore.listNhanVien?.items.map((row) => row.id);
            const mergeRowId = new Set([...this.state.listItemSelectedModel, ...allRowIds]);
            this.setState({
                listItemSelectedModel: Array.from(mergeRowId)
            });
        }
        this.setState({ checkAllRow: !this.state.checkAllRow });
    };
    onModalChucVu = () => {
        this.setState({ chucVuVisiable: !this.state.chucVuVisiable, idChucVu: Guid.EMPTY });
    };
    handleSubmitChucVu = () => {
        this.onModalChucVu();
        this.setState({ suggestChucVu: suggestStore.suggestChucVu });
    };

    onEditChucVu = async (isEdit?: boolean, itemChosed?: IList | null) => {
        await this.setState({ idChucVu: itemChosed?.id });
        if (isEdit ?? false) {
            this.setState({
                chucVuVisiable: !this.state.chucVuVisiable
            });
        } else {
            await this.getListNhanVien();
        }
    };

    DataGrid_handleAction = async (item: any) => {
        switch (parseInt(item.id)) {
            case 1: // xoanhanvien
                this.handleDelete();
                break;
            case 2: // xuat file DS
                {
                    await this.exportSelectedRow();
                }
                break;
        }
    };

    columns: GridColDef[] = [
        {
            field: 'checkBox',
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            width: 65,
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
            field: 'tenNhanVien',
            headerName: 'Tên nhân viên',
            minWidth: 171,
            flex: 1.5,
            renderCell: (params) => (
                <Box style={{ display: 'flex', alignItems: 'center' }} width="100%">
                    <Avatar src={params.row.avatar} alt="Avatar" style={{ width: 24, height: 24, marginRight: 8 }} />
                    <Typography
                        variant="body2"
                        title={params.value}
                        fontSize="var(--font-size-main)"
                        sx={{ textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' }}>
                        {params.value}
                    </Typography>
                </Box>
            ),
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
        },
        {
            field: 'soDienThoai',
            headerName: 'Số điện thoại',
            minWidth: 120,
            flex: 0.8,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,

            renderCell: (params) => (
                <Box width="100%" textAlign="left" fontSize="var(--font-size-main)">
                    {params.value}
                </Box>
            )
        },
        {
            field: 'ngaySinh',
            headerName: 'Ngày sinh',
            headerAlign: 'center',
            align: 'center',
            minWidth: 112,
            flex: 0.8,
            renderCell: (params) => (
                <Box
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    }}>
                    {params.value != null ? (
                        <>
                            <DateIcon style={{ marginRight: 4 }} />
                            <Typography variant="body2" fontSize="var(--font-size-main)">
                                {new Date(params.value).toLocaleDateString('en-GB')}
                            </Typography>
                        </>
                    ) : null}
                </Box>
            ),
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
        },
        {
            field: 'gioiTinh',
            headerName: 'Giới tính',
            headerAlign: 'center',
            minWidth: 60,
            flex: 0.7,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    }}>
                    <Typography fontSize="var(--font-size-main)" fontWeight="400" lineHeight="16px">
                        {params.value == 0 ? '' : params.value == 1 ? 'Nam' : 'Nữ'}
                    </Typography>
                </Box>
            ),
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
        },
        {
            field: 'diaChi',
            headerName: 'Địa chỉ',
            minWidth: 130,
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Box
                    fontSize="var(--font-size-main)"
                    sx={{
                        width: '100%',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        fontWeight: '400',
                        fontFamily: 'Roboto',
                        textAlign: 'left'
                    }}
                    title={params.value}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'tenChucVu',
            headerName: 'Chức vụ',
            minWidth: 113,
            flex: 1,
            renderCell: (params) => (
                <Typography
                    fontSize="var(--font-size-main)"
                    fontWeight="400"
                    lineHeight="16px"
                    sx={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {params.value}
                </Typography>
            ),
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
        },

        // {
        //     field: 'ngayVaoLam',
        //     headerName: 'Ngày tham gia',
        //     minWidth: 120,
        //     flex: 1,
        //     renderCell: (params) => (
        //         <Box
        //             style={{
        //                 display: 'flex',
        //                 alignItems: 'center',
        //                 justifyContent: 'start',
        //                 width: '100%'
        //             }}>
        //             {/* <DateIcon style={{ marginRight: 4 }} /> */}
        //             <Typography
        //                 fontSize="var(--font-size-main)"
        //                 fontWeight="400"
        //                 fontFamily={'Roboto'}
        //                 color="#3D475C"
        //                 lineHeight="16px">
        //                 {new Date(params.value).toLocaleDateString('en-GB')}
        //             </Typography>
        //         </Box>
        //     ),
        //     renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
        // },
        {
            field: 'trangThai',
            headerName: 'Trạng thái',
            headerAlign: 'center',
            align: 'center',
            minWidth: 116,
            flex: 0.8,
            renderCell: (params) => (
                <Typography
                    variant="body2"
                    alignItems={'center'}
                    className={
                        params.row.trangThai === 'Hoạt động'
                            ? 'data-grid-cell-trangthai-active'
                            : 'data-grid-cell-trangthai-notActive'
                    }>
                    {params.value}
                </Typography>
            ),

            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
        },
        {
            field: 'actions',
            headerName: '#',
            headerAlign: 'center',
            sortable: false,
            width: 48,
            flex: 0.4,
            disableColumnMenu: true,
            renderCell: (params) => (
                // <IconButton
                //     aria-label="Actions"
                //     aria-controls={`actions-menu-${params.row.id}`}
                //     aria-haspopup="true"
                //     onClick={(event: any) => {
                //         params.row.trangThai == 'Hoạt động' ? this.handleOpenMenu(event, params.row.id) : null;
                //     }}>
                //     <MoreHorizIcon />
                // </IconButton>
                <ActionRow2Button handleClickAction={(type: number) => this.doActionRow(type, params.row)} />
            ),
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
        }
    ];

    public render() {
        const { listNhanVien } = NhanVienStore;
        const filterContent = (
            <Box className="page-box-left">
                <Box
                    display="flex"
                    justifyContent="space-between"
                    borderBottom="1px solid #E6E1E6"
                    borderRadius={'4px'}
                    sx={{ backgroundColor: 'var(--color-header-table)' }}
                    padding="12px">
                    <Typography fontSize="14px" fontWeight="700">
                        Chức vụ
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
                        onClick={this.onModalChucVu}
                    />
                </Box>
                <AccordionWithData
                    roleEdit={abpCustom.isGrandPermission('Pages.ChucVu.Edit')}
                    lstData={this.state.suggestChucVu?.map((x) => {
                        return { id: x.idChucVu, text: x.tenChucVu } as IList;
                    })}
                    clickTreeItem={this.onEditChucVu}
                />
            </Box>
        );
        return (
            <>
                <CreateOrEditChucVuModal
                    idChucVu={this.state.idChucVu ?? Guid.EMPTY}
                    visiable={this.state.chucVuVisiable}
                    handleClose={this.onModalChucVu}
                    handleSubmit={this.handleSubmitChucVu}
                />
                <Box className="list-nhan-vien" paddingTop={2}>
                    <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={{ xs: 1, md: 0, lg: 0 }}>
                        <Grid item md={6} xs={12} alignItems="center" gap="10px">
                            <Grid container alignItems="center">
                                <Grid item xs={6} md={4}>
                                    <span className="page-title">Quản lý nhân viên</span>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <TextField
                                        fullWidth
                                        sx={{
                                            backgroundColor: '#fff',
                                            borderColor: '#CDC9CD',
                                            height: '40px'
                                        }}
                                        onChange={(e: any) => {
                                            this.setState({ filter: e.target.value, currentPage: 1 });
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key == 'Enter') {
                                                this.getListNhanVien();
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
                                                        this.getListNhanVien();
                                                    }}>
                                                    <SearchIcon />
                                                </IconButton>
                                            )
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item md={6} xs={12}>
                            <Stack spacing={1} direction={'row'} justifyContent="end">
                                {window.screen.width < 768 ? (
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
                                            bgcolor: '#fff!important',
                                            display: window.screen.width > 500 ? 'none' : 'inherit'
                                        }}
                                        onClick={(e) => {
                                            this.setState({ anchorElFilter: e.currentTarget });
                                        }}>
                                        <FilterIcon />
                                    </Button>
                                ) : null}
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<img src={DownloadIcon} />}
                                    sx={{
                                        backgroundColor: '#fff!important',
                                        textTransform: 'capitalize',
                                        fontWeight: '400',
                                        color: '#666466',
                                        height: '40px',
                                        padding: '10px 16px',
                                        borderRadius: '4px!important',
                                        display: abpCustom.isGrandPermission('Pages.NhanSu.Import') ? '' : 'none'
                                    }}
                                    onClick={this.onImportShow}
                                    className="btn-outline-hover">
                                    Nhập
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<img src={UploadIcon} />}
                                    sx={{
                                        backgroundColor: '#fff!important',
                                        textTransform: 'capitalize',
                                        fontWeight: '400',
                                        color: '#666466',
                                        padding: '10px 16px',
                                        height: '40px',
                                        borderRadius: '4px!important',
                                        display: abpCustom.isGrandPermission('Pages.NhanSu.Export') ? '' : 'none'
                                    }}
                                    onClick={this.exportToExcel}
                                    className="btn-outline-hover">
                                    Xuất
                                </Button>
                                <ButtonGroup
                                    variant="contained"
                                    sx={{ gap: '8px', height: '40px', boxShadow: 'unset!important' }}>
                                    <Button
                                        size="small"
                                        onClick={() => {
                                            this.createOrUpdateModalOpen('');
                                        }}
                                        variant="contained"
                                        startIcon={<img src={AddIcon} />}
                                        sx={{
                                            textTransform: 'capitalize',
                                            fontWeight: '400',
                                            minWidth: '173px',
                                            fontSize: '14px',
                                            borderRadius: '4px!important',
                                            backgroundColor: 'var(--color-main)!important',
                                            display: abpCustom.isGrandPermission('Pages.NhanSu.Create') ? '' : 'none'
                                        }}
                                        className="btn-container-hover">
                                        Thêm nhân viên
                                    </Button>
                                </ButtonGroup>
                            </Stack>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} marginTop={3}>
                        <Grid item xs={12} sm={3} md={3} display={window.screen.width <= 600 ? 'none' : ''}>
                            {filterContent}
                        </Grid>
                        <Grid item xs={12} sm={9} md={9}>
                            <Box>
                                {this.state.listItemSelectedModel.length > 0 && (
                                    <ActionRowSelect
                                        lstOption={[
                                            {
                                                id: '1',
                                                text: 'Xóa nhân viên',
                                                isShow: abpCustom.isGrandPermission('Pages.NhanSu.Delete')
                                            },
                                            {
                                                id: '2',
                                                text: 'Xuất danh sách',
                                                isShow: abpCustom.isGrandPermission('Pages.NhanSu.Export')
                                            }
                                        ]}
                                        countRowSelected={this.state.listItemSelectedModel.length}
                                        title="nhân viên"
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
                                        rowHeight={46}
                                        autoHeight={this.state.totalCount === 0}
                                        className={
                                            this.state.listItemSelectedModel.length > 0
                                                ? 'data-grid-row-chosed'
                                                : 'data-grid-row'
                                        }
                                        rows={listNhanVien === undefined ? [] : listNhanVien.items}
                                        columns={this.columns}
                                        checkboxSelection={false}
                                        hideFooter
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
                                    />
                                </div>

                                {/* <ActionMenuTable
                                    selectedRowId={this.state.selectedRowId}
                                    anchorEl={this.state.anchorEl}
                                    closeMenu={this.handleCloseMenu}
                                    handleView={this.handleEdit}
                                    permissionView="Pages.NhanSu.Edit"
                                    handleEdit={this.handleEdit}
                                    permissionEdit="Pages.NhanSu.Edit"
                                    handleDelete={this.handleDelete}
                                    permissionDelete="Pages.NhanSu.Delete"
                                /> */}
                                <CustomTablePagination
                                    currentPage={this.state.currentPage}
                                    rowPerPage={this.state.maxResultCount}
                                    totalRecord={this.state.totalCount}
                                    totalPage={this.state.totalPage}
                                    handlePerPageChange={this.handlePerPageChange}
                                    handlePageChange={this.handlePageChange}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    <ConfirmDelete
                        isShow={this.state.isShowConfirmDelete}
                        onOk={this.onOkDelete}
                        onCancel={this.handleDelete}></ConfirmDelete>
                    <ImportExcel
                        tieude={'Nhập file nhân viên'}
                        isOpen={this.state.importShow}
                        onClose={this.onImportShow}
                        downloadImportTemplate={this.downloadImportTemplate}
                        importFile={this.handleImportData}
                    />
                    <CreateOrEditNhanVienDialog
                        visible={this.state.modalVisible}
                        onCancel={async () => {
                            this.setState({ modalVisible: false });
                            await this.getListNhanVien();
                        }}
                        onOk={this.handleSubmit}
                        title={
                            this.state.idNhanSu === '' ||
                            this.state.idNhanSu == undefined ||
                            this.state.idNhanSu === AppConsts.guidEmpty
                                ? 'Thêm mới nhân viên'
                                : 'Cập nhật thông tin nhân viên'
                        }
                        formRef={nhanVienStore.createEditNhanVien}></CreateOrEditNhanVienDialog>
                    <Popover
                        id={'popover-filter'}
                        open={Boolean(this.state.anchorElFilter)}
                        anchorEl={this.state.anchorElFilter}
                        onClose={() => {
                            this.setState({ anchorElFilter: null });
                        }}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center'
                        }}
                        sx={{ marginTop: 1 }}>
                        {filterContent}
                    </Popover>
                </Box>
            </>
        );
    }
}

export default observer(EmployeeScreen);
