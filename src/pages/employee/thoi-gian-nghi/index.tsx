import { Component, ReactNode } from 'react';
import '../../employee/employee.css';
import React from 'react';
import { NgayNghiLeDto } from '../../../services/ngay_nghi_le/dto/NgayNghiLeDto';
import ngayNghiLeService from '../../../services/ngay_nghi_le/ngayNghiLeService';
import { CreateOrEditNgayNghiLeDto } from '../../../services/ngay_nghi_le/dto/createOrEditNgayNghiLe';
import {
    Box,
    Button,
    Checkbox,
    Grid,
    IconButton,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import CreateOrEditThoiGianNghi from './create-or-edit-thoi-gian-nghi';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import AddIcon from '../../../images/add.svg';
import SearchIcon from '../../../images/search-normal.svg';
import DownloadIcon from '../../../images/download.svg';
import UploadIcon from '../../../images/upload.svg';
import ClearIcon from '@mui/icons-material/Clear';
import { ExpandMoreOutlined } from '@mui/icons-material';
import { ReactComponent as DateIcon } from '../../../images/calendar-5.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import AppConsts from '../../../lib/appconst';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import { TextTranslate } from '../../../components/TableLanguage';
import ActionMenuTable from '../../../components/Menu/ActionMenuTable';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { enqueueSnackbar } from 'notistack';
import { FileUpload } from '../../../services/dto/FileUpload';
import uploadFileService from '../../../services/uploadFileService';
import fileDowloadService from '../../../services/file-dowload.service';
import abpCustom from '../../../components/abp-custom';
class EmployeeHoliday extends Component {
    state = {
        IdHoliday: '',
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        filter: '',
        sortBy: 'createTime',
        moreOpen: false,
        importShow: false,
        anchorEl: null,
        selectedRowId: null,
        checkAllRow: false,
        listHoliday: [] as NgayNghiLeDto[],
        createOrEditNgayNghiLe: {
            id: AppConsts.guidEmpty,
            tenNgayLe: '',
            tuNgay: new Date(),
            denNgay: new Date()
        } as CreateOrEditNgayNghiLeDto,
        listItemSelectedModel: [] as string[],
        expendActionSelectedRow: false,
        totalCount: 0,
        currentPage: 1,
        totalPage: 1,
        startIndex: 0,
        isShowConfirmDelete: false,
        sortColumn: null,
        sortType: 'desc'
    };
    async componentDidMount() {
        this.getData();
        this.getListHoliday();
    }
    async getData() {
        if (this.state.IdHoliday !== '') {
            const holiday = await ngayNghiLeService.getForEdit(this.state.IdHoliday);
            this.setState({ createOrEditNgayNghiLe: holiday });
        }
        //this.getListHoliday();
    }
    async getListHoliday() {
        const data = await ngayNghiLeService.getAll({
            keyword: this.state.filter,
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.currentPage,
            sortBy: this.state.sortBy,
            sortType: this.state.sortType
        });
        await this.setState({
            listHoliday: data.items,
            totalCount: data.totalCount,
            totalPage: Math.ceil(data.totalCount / this.state.maxResultCount)
        });
    }
    handlePageChange = async (event: React.ChangeEvent<unknown>, value: number) => {
        await this.setState({
            currentPage: value,
            skipCount: value,
            checkAllRow: false
        });
        this.getListHoliday();
    };
    handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await this.setState({
            maxResultCount: parseInt(event.target.value.toString(), 10),
            currentPage: 1,
            skipCount: 1,
            checkAllRow: false
        });
        this.getListHoliday();
    };
    handleChange = (event: any): void => {
        const { name, value } = event.target;
        this.setState({
            createOrEditNhanSu: {
                ...this.state.createOrEditNgayNghiLe,
                [name]: value
            }
        });
    };

    Modal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible,
            IdHoliday: ''
        });
        this.getData();
        this.getListHoliday();
    };
    createOrUpdateModalOpen = async (id: string) => {
        this.setState({
            IdHoliday: id
        });
        if (id !== '') {
            const holiday = await ngayNghiLeService.getForEdit(id);
            this.setState({ createOrEditNgayNghiLe: holiday });
        } else {
            this.setState({
                createOrEditNgayNghiLe: {
                    id: AppConsts.guidEmpty,
                    tenNgayLe: '',
                    tuNgay: new Date(),
                    denNgay: new Date()
                }
            });
        }
        this.Modal();
    };
    onSort = async (sortType: string, sortBy: string) => {
        //const type = sortType === 'desc' ? 'asc' : 'desc';
        await this.setState({
            sortBy: sortBy,
            sortType: sortType
        });
        this.getListHoliday();
    };
    handleOpenMenu = (event: any, rowId: any) => {
        this.setState({ anchorEl: event.currentTarget, selectedRowId: rowId });
    };

    handleCloseMenu = async () => {
        await this.setState({ anchorEl: null, selectedRowId: null });
        await this.getListHoliday();
    };

    handleView = () => {
        // Handle View action
        this.handleCloseMenu();
    };
    delete = async (id: string) => {
        const deleteResult = await ngayNghiLeService.delete(id);
        deleteResult != null
            ? enqueueSnackbar('Xóa bản ghi thành công', {
                  variant: 'success',
                  autoHideDuration: 3000
              })
            : enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại sau!', {
                  variant: 'error',
                  autoHideDuration: 3000
              });
    };
    deleteMany = async () => {
        const result = await ngayNghiLeService.deleteMany(this.state.listItemSelectedModel);
        enqueueSnackbar(result.message, {
            variant: result.status,
            autoHideDuration: 3000
        });
    };
    onOkDelete = async () => {
        await this.delete(this.state.selectedRowId ?? '');
        this.showConfirmDelete();
        await this.handleCloseMenu();
    };
    handleEdit = () => {
        // Handle Edit action
        this.createOrUpdateModalOpen(this.state.selectedRowId ?? '');
        this.handleCloseMenu();
    };

    showConfirmDelete = () => {
        // Handle Delete action
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete,
            IdHoliday: ''
        });
    };
    exportToExcel = async () => {
        const result = await ngayNghiLeService.exportToExcel({
            keyword: this.state.filter,
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.currentPage,
            sortBy: this.state.sortBy,
            sortType: this.state.sortType
        });
        fileDowloadService.downloadExportFile(result);
    };
    exportSelectedRow = async () => {
        const result = await ngayNghiLeService.exportSelectedItemToExcel(this.state.listItemSelectedModel);
        fileDowloadService.downloadExportFile(result);
    };
    onImportShow = () => {
        this.setState({
            importShow: !this.state.importShow
        });
        this.getData();
    };
    handleImportData = async (input: FileUpload) => {
        const result = await ngayNghiLeService.importExcel(input);
        enqueueSnackbar(result.message, {
            variant: result.status == 'success' ? 'success' : 'error',
            autoHideDuration: 3000
        });
    };
    downloadImportTemplate = async () => {
        const result = await uploadFileService.downloadImportTemplate('NghiLe_ImportTemplate.xlsx');
        fileDowloadService.downloadExportFile(result);
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
            const allRowRemove = this.state.listHoliday.map((row) => row.id);
            const newRows = this.state.listItemSelectedModel.filter((item) => !allRowRemove.includes(item));
            this.setState({ listItemSelectedModel: newRows });
        } else {
            const allRowIds = this.state.listHoliday.map((row) => row.id);
            const mergeRowId = new Set([...this.state.listItemSelectedModel, ...allRowIds]);
            this.setState({
                listItemSelectedModel: Array.from(mergeRowId)
            });
        }
        this.setState({ checkAllRow: !this.state.checkAllRow });
    };
    render() {
        const columns: GridColDef[] = [
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
                field: 'tenNgayLe',
                headerName: 'Tên ngày lễ',
                flex: 1,
                renderHeader: (params) => <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>,
                renderCell: (params) => (
                    <Box
                        sx={{
                            overflow: 'hidden',
                            width: '100%',
                            textOverflow: 'ellipsis',
                            fontSize: '13px',
                            fontWeight: '400',
                            fontFamily: 'Roboto',
                            color: '#3D475C',
                            textAlign: 'left'
                        }}>
                        {params.value}
                    </Box>
                )
            },
            {
                field: 'tuNgay',
                headerName: 'Ngày bắt đầu',
                // width: 200,
                flex: 1,
                renderCell: (params) => (
                    <Box
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            justifyContent: 'start'
                        }}>
                        <DateIcon style={{ marginRight: 4 }} />
                        <Typography
                            fontSize="13px"
                            fontWeight="400"
                            fontFamily={'Roboto'}
                            color="#3D475C"
                            lineHeight="16px">
                            {new Date(params.value).toLocaleDateString('en-GB')}
                        </Typography>
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
            },
            {
                field: 'denNgay',
                headerName: 'Ngày kết thúc',
                sortable: false,
                // width: 200,
                flex: 1,
                renderCell: (params) => (
                    <Box
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            justifyContent: 'start'
                        }}>
                        <DateIcon style={{ marginRight: 4 }} />
                        <Typography
                            fontSize="13px"
                            fontWeight="400"
                            fontFamily={'Roboto'}
                            color="#3D475C"
                            lineHeight="16px">
                            {new Date(params.value).toLocaleDateString('en-GB')}
                        </Typography>
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
            },
            {
                field: 'tongSoNgay',
                headerName: 'Tổng số ngày',
                // width: 150,
                flex: 1,
                renderCell: (params) => (
                    <Box
                        sx={{
                            width: '100%',
                            textAlign: 'left'
                        }}>
                        <Typography
                            fontSize="13px"
                            fontWeight="400"
                            fontFamily={'Roboto'}
                            color="#3D475C"
                            lineHeight="16px">
                            {params.value} ngày
                        </Typography>
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
            },
            {
                field: 'actions',
                headerName: 'Hành động',
                // width: 48,
                flex: 0.3,
                disableColumnMenu: true,

                renderCell: (params) => (
                    <IconButton
                        aria-label="Actions"
                        aria-controls={`actions-menu-${params.row.id}`}
                        aria-haspopup="true"
                        onClick={(event) => this.handleOpenMenu(event, params.row.id)}>
                        <MoreHorizIcon />
                    </IconButton>
                ),
                renderHeader: (params) => <Box sx={{ display: 'none' }}>{params.colDef.headerName}</Box>
            }
        ];
        return (
            <Box paddingTop="16px" className="thoi-gian-nghi-page">
                <Grid container alignItems="center" spacing={1} justifyContent="space-between">
                    <Grid item xs={12} md="auto" display="flex" gap="10px" alignItems="center">
                        <Typography color="#333233" variant="h1" fontSize="16px" fontWeight="700">
                            Quản lý thời gian nghỉ
                        </Typography>
                        <Box className="form-search">
                            <TextField
                                size="small"
                                sx={{
                                    backgroundColor: '#fff',
                                    borderColor: '#CDC9CD!important',
                                    '& .MuiInputBase-root': {
                                        pl: '0'
                                    }
                                }}
                                onChange={(e) => {
                                    this.setState({ filter: e.target.value });
                                }}
                                onKeyDown={(e) => {
                                    if (e.key == 'Enter') {
                                        this.getListHoliday();
                                    }
                                }}
                                className="search-field"
                                variant="outlined"
                                type="search"
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    startAdornment: (
                                        <IconButton
                                            type="button"
                                            onClick={() => {
                                                this.getListHoliday();
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
                            //hidden={!abpCustom.isGrandPermission('Pages.NhanSu_NgayNghiLe.Import')}
                            hidden
                            size="small"
                            onClick={this.onImportShow}
                            variant="outlined"
                            startIcon={<img src={DownloadIcon} />}
                            sx={{
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                color: '#666466',
                                height: '40px',
                                backgroundColor: '#fff!important',
                                borderColor: '#E6E1E6!important'
                            }}
                            className="btn-outline-hover">
                            Nhập
                        </Button>
                        <Button
                            hidden={!abpCustom.isGrandPermission('Pages.NhanSu_NgayNghiLe.Export')}
                            size="small"
                            onClick={this.exportToExcel}
                            variant="outlined"
                            startIcon={<img src={UploadIcon} />}
                            sx={{
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                color: '#666466',
                                backgroundColor: '#fff!important',
                                padding: '10px 16px',
                                borderColor: '#E6E1E6!important',
                                height: '40px'
                            }}
                            className="btn-outline-hover">
                            Xuất
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            onClick={() => {
                                this.createOrUpdateModalOpen('');
                            }}
                            hidden={!abpCustom.isGrandPermission('Pages.NhanSu_NgayNghiLe.Create')}
                            startIcon={<img src={AddIcon} />}
                            sx={{
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                minWidth: '173px',
                                height: '40px',
                                fontSize: '14px'
                            }}
                            className="btn-container-hover">
                            Thêm ngày nghỉ
                        </Button>
                    </Grid>
                </Grid>
                <Box paddingTop="16px">
                    {this.state.listItemSelectedModel.length > 0 ? (
                        <Stack spacing={1} marginBottom={2} direction={'row'} alignItems={'center'}>
                            <Box
                                sx={{ position: 'relative' }}
                                onMouseLeave={() => {
                                    this.setState({
                                        expendActionSelectedRow: false
                                    });
                                }}>
                                <Button
                                    variant="contained"
                                    endIcon={<ExpandMoreOutlined />}
                                    onClick={() =>
                                        this.setState({
                                            expendActionSelectedRow: !this.state.expendActionSelectedRow
                                        })
                                    }>
                                    Thao tác
                                </Button>

                                <Box
                                    sx={{
                                        display: this.state.expendActionSelectedRow ? '' : 'none',
                                        zIndex: 1,
                                        position: 'absolute',
                                        borderRadius: '4px',
                                        border: '1px solid #cccc',
                                        minWidth: 150,
                                        backgroundColor: 'rgba(248,248,248,1)',
                                        '& .MuiStack-root .MuiStack-root:hover': {
                                            backgroundColor: '#cccc'
                                        }
                                    }}>
                                    <Stack
                                        alignContent={'center'}
                                        justifyContent={'start'}
                                        textAlign={'left'}
                                        spacing={0.5}>
                                        <Button
                                            startIcon={'Xóa ngày nghỉ lễ'}
                                            sx={{
                                                color: 'black',
                                                '&:hover': {
                                                    backgroundColor: '#E6E6E6',
                                                    boxShadow: 'none'
                                                }
                                            }}
                                            onClick={this.showConfirmDelete}></Button>
                                        <Button
                                            startIcon={'Xuất danh sách'}
                                            sx={{
                                                color: 'black',
                                                '&:hover': {
                                                    backgroundColor: '#E6E6E6',
                                                    boxShadow: 'none'
                                                }
                                            }}
                                            onClick={this.exportSelectedRow}></Button>
                                    </Stack>
                                </Box>
                            </Box>
                            <Stack direction={'row'}>
                                <Typography variant="body2" color={'red'}>
                                    {this.state.listItemSelectedModel.length}&nbsp;
                                </Typography>
                                <Typography variant="body2">bản ghi được chọn</Typography>
                            </Stack>
                            <ClearIcon
                                color="error"
                                onClick={() => {
                                    this.setState({
                                        listItemSelectedModel: [],
                                        checkAllRow: false
                                    });
                                }}
                            />
                        </Stack>
                    ) : null}
                    <DataGrid
                        disableRowSelectionOnClick
                        rowHeight={46}
                        rows={this.state.listHoliday}
                        columns={columns}
                        checkboxSelection={false}
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
                        sx={{
                            '& .MuiDataGrid-columnHeader': {
                                background: '#EEF0F4'
                            }
                        }}
                        hideFooter
                        localeText={TextTranslate}
                    />
                    <ActionMenuTable
                        selectedRowId={this.state.selectedRowId}
                        anchorEl={this.state.anchorEl}
                        closeMenu={this.handleCloseMenu}
                        handleView={this.handleEdit}
                        permissionView="Pages.NhanSu_NgayNghLe.Edit"
                        handleEdit={this.handleEdit}
                        permissionEdit="Pages.NhanSu_NgayNghiLe.Edit"
                        handleDelete={this.showConfirmDelete}
                        permissionDelete="Pages.NhanSu_NgayNghiLe.Delete"
                    />
                    <CustomTablePagination
                        currentPage={this.state.currentPage}
                        rowPerPage={this.state.maxResultCount}
                        totalRecord={this.state.totalCount}
                        totalPage={this.state.totalPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageChange={this.handlePageChange}
                    />
                </Box>
                <ConfirmDelete
                    isShow={this.state.isShowConfirmDelete}
                    onOk={this.onOkDelete}
                    onCancel={this.showConfirmDelete}></ConfirmDelete>
                <CreateOrEditThoiGianNghi
                    visible={this.state.modalVisible}
                    title={this.state.IdHoliday == '' ? 'Thêm mới ngày lễ' : 'Cập nhật này lễ'}
                    onCancel={() => {
                        this.Modal();
                    }}
                    createOrEditDto={this.state.createOrEditNgayNghiLe}></CreateOrEditThoiGianNghi>
            </Box>
        );
    }
}
export default EmployeeHoliday;
