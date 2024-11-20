import { observer } from 'mobx-react';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Component, ReactNode } from 'react';
import { CreateOrEditChietKhauHoaDonDto } from '../../../../../services/hoa_hong/chiet_khau_hoa_don/Dto/CreateOrEditChietKhauHoaDonDto';
import chietKhauHoaDonStore from '../../../../../stores/chietKhauHoaDonStore';
import AppConsts from '../../../../../lib/appconst';
import SearchIcon from '../../../../../images/search-normal.svg';
import { TextTranslate } from '../../../../../components/TableLanguage';
import { ReactComponent as IconSorting } from '../.././../../../images/column-sorting.svg';
import ClearIcon from '@mui/icons-material/Clear';
import { ExpandMoreOutlined } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import {
    Box,
    Button,
    IconButton,
    TextField,
    Grid,
    SelectChangeEvent,
    Checkbox,
    Typography,
    ButtonGroup
} from '@mui/material';
import CreateOrEditChietKhauHoaDonModal from './components/create-or-edit-chiet-khau-hd';
import Cookies from 'js-cookie';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CustomTablePagination from '../../../../../components/Pagination/CustomTablePagination';
import suggestStore from '../../../../../stores/suggestStore';
import ActionMenuTable from '../../../../../components/Menu/ActionMenuTable';
import ConfirmDelete from '../../../../../components/AlertDialog/ConfirmDelete';
import abpCustom from '../../../../../components/abp-custom';
import chietKhauDichVuStore from '../../../../../stores/chietKhauDichVuStore';
class ChietKhauHoaDonScreen extends Component {
    state = {
        idChietKhauHD: AppConsts.guidEmpty,
        visited: false,
        isShowConfirmDelete: false,
        keyword: '',
        sortBy: '',
        sortType: 'desc',
        skipCount: 1,
        maxResultCount: 10,
        anchorEl: null,
        totalCount: 0,
        totalPage: 0,
        createOrEditModel: {
            id: AppConsts.guidEmpty,
            idChiNhanh: Cookies.get('IdChiNhanh') ?? AppConsts.guidEmpty,
            chungTuApDung: '',
            giaTriChietKhau: 0,
            loaiChietKhau: 0,
            idNhanViens: [],
            ghiChu: ''
        } as CreateOrEditChietKhauHoaDonDto,
        checkAllRow: false,
        listItemSelectedModel: [] as string[]
    };
    componentDidMount(): void {
        this.getAll();
    }
    getAll = async () => {
        await chietKhauHoaDonStore.getAll({
            keyword: this.state.keyword,
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.skipCount,
            sortBy: this.state.sortBy,
            sortType: this.state.sortType
        });
        await suggestStore.getSuggestChucVu();
        await suggestStore.getSuggestNhanVien();
        await chietKhauHoaDonStore.createModel();
        await suggestStore.getSuggestLoaiChungTu();
    };
    Modal = () => {
        this.setState({ visited: !this.state.visited, idChietKhauHD: '' });
    };
    createOrEditShowModal = async (id: string) => {
        if (id === '') {
            const newModel = await chietKhauHoaDonStore.createModel();
            this.setState({ createOrEditModel: newModel });
        } else {
            const model = await chietKhauHoaDonStore.getForEdit(id);
            this.setState({ createOrEditModel: model });
        }
        this.setState({ idChietKhauHD: id });
        this.Modal();
    };
    handleCreate = async () => {
        await this.getAll();
        await chietKhauHoaDonStore.createModel();
        this.Modal();
    };
    delete = async (id: string) => {
        await chietKhauHoaDonStore.delete(id);
        this.setState({ idChietKhauHD: '' });

        this.getAll();
    };
    onShowDeleteConfirm = () => {
        this.setState({ isShowConfirmDelete: !this.state.isShowConfirmDelete });
    };
    onOkDelete = async () => {
        this.delete(this.state.idChietKhauHD);
        this.onShowDeleteConfirm();
    };
    onCancelDelete = () => {
        this.setState({ isShowConfirmDelete: false });
    };
    handlePageChange = async (event: any, value: any) => {
        await this.setState({
            skipCount: value,
            checkAllRow: false
        });
        this.getAll();
    };
    handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await this.setState({
            maxResultCount: parseInt(event.target.value.toString(), 10),
            currentPage: 1,
            skipCount: 1,
            checkAllRow: false
        });
        this.getAll();
    };
    onSort = async (sortType: string, sortBy: string) => {
        const type = sortType === 'desc' ? 'asc' : 'desc';
        await this.setState({
            sortType: type,
            sortBy: sortBy
        });
        this.getAll();
    };
    handleOpenMenu = (event: any, rowId: any) => {
        this.setState({ anchorEl: event.currentTarget, idChietKhauHD: rowId });
    };
    handleCloseMenu = async () => {
        await this.setState({ anchorEl: null, idChietKhauHD: '' });
        //await this.getData();
    };
    handleEdit = () => {
        // Handle Edit action
        this.createOrEditShowModal(this.state.idChietKhauHD ?? '');
        this.handleCloseMenu();
    };
    handleDelete = () => {
        // Handle Delete action
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete,
            anchorEl: null
        });
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
            const allRowRemove = chietKhauHoaDonStore.chietKhauHoaDons?.items.map((row) => row.id);
            const newRows = this.state.listItemSelectedModel.filter((item) => !allRowRemove.includes(item));
            this.setState({ listItemSelectedModel: newRows });
        } else {
            const allRowIds = chietKhauHoaDonStore.chietKhauHoaDons?.items.map((row) => row.id);
            const mergeRowId = new Set([...this.state.listItemSelectedModel, ...allRowIds]);
            this.setState({
                listItemSelectedModel: Array.from(mergeRowId)
            });
        }
        this.setState({ checkAllRow: !this.state.checkAllRow });
    };
    render(): ReactNode {
        const { chietKhauHoaDons } = chietKhauHoaDonStore;
        const columns: GridColDef[] = [
            // {
            //     field: 'checkBox',
            //     sortable: false,
            //     filterable: false,
            //     disableColumnMenu: true,
            //     width: 65,
            //     renderHeader: (params) => {
            //         return (
            //             <Checkbox
            //                 onClick={this.handleSelectAllGridRowClick}
            //                 checked={this.state.checkAllRow}
            //             />
            //         );
            //     },
            //     renderCell: (params) => (
            //         <Checkbox
            //             onClick={() => this.handleCheckboxGridRowClick(params)}
            //             checked={this.state.listItemSelectedModel.includes(params.row.id)}
            //         />
            //     )
            // },
            {
                field: 'giaTriChietKhau',
                headerName: 'Hoa hồng',
                minWidth: 112,
                flex: 1,
                renderHeader: (params) => <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
            },
            {
                field: 'chungTuApDung',
                headerName: 'Chứng từ áp dụng',
                minWidth: 120,
                flex: 1,
                renderHeader: (params) => <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
            },
            {
                field: 'ghiChu',
                headerName: 'Ghi chú',
                minWidth: 150,
                flex: 1,
                renderHeader: (params) => <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
            },
            {
                field: 'actions',
                headerName: 'Hành động',
                maxWidth: 48,
                flex: 1,
                disableColumnMenu: true,
                renderCell: (params) => (
                    <Box>
                        <IconButton
                            aria-label="Actions"
                            aria-controls={`actions-menu-${params.row.id}`}
                            aria-haspopup="true"
                            onClick={(event: any) => {
                                this.handleOpenMenu(event, params.row.id);
                            }}>
                            <MoreHorizIcon />
                        </IconButton>
                    </Box>
                ),
                renderHeader: (params) => <Box sx={{ display: 'none' }}>{params.colDef.headerName}</Box>
            }
        ];
        return (
            <Box>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} paddingBottom={'16px'}>
                    <Typography fontWeight="700" fontFamily={'Roboto'} fontSize="18px">
                        Hoa hồng theo hóa đơn
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => {
                            this.createOrEditShowModal('');
                        }}
                        sx={{
                            height: 40,
                            color: '#FFFAFF',
                            display: abpCustom.isGrandPermission('Pages.ChietKhauHoaDon.Create') ? '' : 'none'
                        }}
                        startIcon={<AddOutlinedIcon sx={{ color: '#FFFAFF' }} />}
                        className="btn-container-hover">
                        Thêm mới
                    </Button>
                </Box>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
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
                            }}>
                            <Button
                                variant={'outlined'}
                                sx={{
                                    fontSize: '16px',
                                    textTransform: 'unset',
                                    color: '#8492AE',
                                    backgroundColor: '#FFF',
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
                                onClick={async () => {
                                    await chietKhauDichVuStore.changeViewHoaHong(true);
                                }}>
                                Theo dịch vụ
                            </Button>
                            <Button
                                variant={'outlined'}
                                sx={{
                                    fontSize: '16px',
                                    textTransform: 'unset',
                                    color: '#319DFF',
                                    backgroundColor: '#FFF',
                                    border: 'none !important',
                                    borderBottom: '2px outset #319DFF !important',
                                    boxShadow: 'none!important'
                                }}>
                                Theo hóa đơn
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
                <Box paddingTop={'8px'}>
                    {this.state.listItemSelectedModel.length > 0 ? (
                        <Box mb={1}>
                            <Button variant="contained" color="secondary">
                                Xóa {this.state.listItemSelectedModel.length} bản ghi đã chọn
                            </Button>
                        </Box>
                    ) : null}
                    <DataGrid
                        rowHeight={46}
                        columns={columns}
                        rows={chietKhauHoaDons === undefined ? [] : chietKhauHoaDons.items}
                        localeText={TextTranslate}
                        disableRowSelectionOnClick
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
                        hideFooter
                    />
                    <ActionMenuTable
                        selectedRowId={this.state.idChietKhauHD}
                        anchorEl={this.state.anchorEl}
                        closeMenu={this.handleCloseMenu}
                        handleView={this.handleEdit}
                        permissionView="Pages.ChietKhauHoaDon.Edit"
                        handleEdit={this.handleEdit}
                        permissionEdit="Pages.ChietKhauHoaDon.Edit"
                        handleDelete={this.handleDelete}
                        permissionDelete="Pages.ChietKhauHoaDon.Delete"
                    />
                    <ConfirmDelete
                        isShow={this.state.isShowConfirmDelete}
                        onOk={this.onOkDelete}
                        onCancel={this.onShowDeleteConfirm}></ConfirmDelete>
                    <CustomTablePagination
                        currentPage={this.state.skipCount}
                        rowPerPage={this.state.maxResultCount}
                        totalRecord={chietKhauHoaDons === undefined ? 0 : chietKhauHoaDons.totalCount}
                        totalPage={
                            chietKhauHoaDons === undefined
                                ? 0
                                : Math.ceil(chietKhauHoaDons.totalCount / this.state.maxResultCount)
                        }
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageChange={this.handlePageChange}
                    />
                    <CreateOrEditChietKhauHoaDonModal
                        formRef={this.state.createOrEditModel}
                        onClose={this.Modal}
                        onSave={this.handleCreate}
                        visited={this.state.visited}
                        title={
                            this.state.idChietKhauHD === '' || this.state.idChietKhauHD === AppConsts.guidEmpty
                                ? 'Thêm mới hoa hồng theo hóa đơn'
                                : 'Cập nhật hoa hồng theo hóa đơn'
                        }
                    />
                </Box>
            </Box>
        );
    }
}
export default observer(ChietKhauHoaDonScreen);
