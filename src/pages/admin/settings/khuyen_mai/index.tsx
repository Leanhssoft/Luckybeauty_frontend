/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    Grid,
    IconButton,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '../../../../images/add.svg';
import SearchIcon from '../../../../images/search-normal.svg';
import abpCustom from '../../../../components/abp-custom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { TextTranslate } from '../../../../components/TableLanguage';
import CustomTablePagination from '../../../../components/Pagination/CustomTablePagination';
import { useEffect, useState } from 'react';
import CreateOrEditVoucher from './components/create-or-edit-voucher';
import suggestStore from '../../../../stores/suggestStore';
import khuyenMaiStore from '../../../../stores/khuyenMaiStore';
import AppConsts from '../../../../lib/appconst';
import { format as formatDate } from 'date-fns';
import { observer } from 'mobx-react';
import ActionMenuTable from '../../../../components/Menu/ActionMenuTable';
import ConfirmDelete from '../../../../components/AlertDialog/ConfirmDelete';
const KhuyenMaiPage: React.FC = () => {
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [maxResultCount, setMaxResultCount] = useState(10);
    const [sortBy, setSortBy] = useState('desc');
    const [sortType, setSortType] = useState('createionTime');
    const [isShowCreate, setIsShowCreate] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState('');
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [isShowConfirmDelete, setIsShowConfirmDelete] = useState(false);
    useEffect(() => {
        initSuggest();
        //getAll();
    }, []);
    const getAll = async () => {
        await khuyenMaiStore.getAll({
            keyword: filter,
            maxResultCount: maxResultCount,
            skipCount: currentPage,
            sortBy: sortBy,
            sortType: sortType
        });
    };
    useEffect(() => {
        getAll();
    }, [currentPage, maxResultCount, sortBy, sortType]);
    const initSuggest = async () => {
        await suggestStore.getSuggestNhanVien();
        await suggestStore.getSuggestDichVu();
        await suggestStore.getSuggestNhomKhach();
        await suggestStore.getSuggestChiNhanh();
        await suggestStore.getSuggestDonViQuiDoi();
    };
    const handlePageChange = async (event: any, value: number) => {
        await setCurrentPage(value);
    };
    const handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await setMaxResultCount(parseInt(event.target.value.toString(), 10));
        setCurrentPage(1);
    };
    const Modal = () => {
        setIsShowCreate(!isShowCreate);
    };
    const onCreateOrEditVoucherModal = async (id: string) => {
        if (id === '' || id === AppConsts.guidEmpty) {
            await khuyenMaiStore.createNewModel();
        } else {
            await khuyenMaiStore.GetForEdit(id);
        }
        Modal();
    };
    const handleOpenMenu = (event: any, rowId: any) => {
        setAnchorEl(event.currentTarget);
        setSelectedRowId(rowId);
    };

    const handleCloseMenu = async () => {
        setAnchorEl(null);
        setSelectedRowId('');
    };
    const handleEdit = () => {
        // Handle Edit action
        onCreateOrEditVoucherModal(selectedRowId ?? '');
        handleCloseMenu();
    };
    const handleDelete = () => {
        // Handle Delete action
        setIsShowConfirmDelete(!isShowConfirmDelete);
        //getData();
    };
    const showConfirmDelete = () => {
        setIsShowConfirmDelete(!isShowConfirmDelete);
    };
    const deleteKhuyenMai = async (id: string) => {
        await khuyenMaiStore.delete(id);
    };
    const onOkDelete = async () => {
        deleteKhuyenMai(selectedRowId ?? AppConsts.guidEmpty);
        handleCloseMenu();
        showConfirmDelete();
        await getAll();
    };
    const onSort = async (sortType: string, sortBy: string) => {
        setSortBy(sortBy);
        setSortType(sortType);
    };
    const columns = [
        {
            field: 'checkBox',
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            width: 65,
            renderHeader: (params) => {
                return (
                    <Checkbox
                    //onClick={this.handleSelectAllGridRowClick}
                    //checked={this.state.checkAllRow}
                    />
                );
            },
            renderCell: (params) => (
                <Checkbox
                //onClick={() => this.handleCheckboxGridRowClick(params)}
                //checked={this.state.listItemSelectedModel.includes(params.row.id)}
                />
            )
        },
        {
            field: 'maKhuyenMai',
            headerName: 'Mã khuyễn mại',
            minWidth: 90,
            flex: 1,
            renderHeader: (params) => (
                <Box
                    sx={{ fontWeight: '700', textOverflow: 'ellipsis', overflow: 'hidden' }}
                    title={params.colDef.headerName}
                    width="100%">
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params) => (
                <Box
                    sx={{
                        fontSize: '13px',
                        width: '100%',
                        textAlign: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                    title={params.value}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'tenKhuyenMai',
            headerName: 'Tên khuyễn mại',
            minWidth: 125,
            flex: 1,
            renderHeader: (params) => (
                <Box
                    sx={{ fontWeight: '700', textOverflow: 'ellipsis', overflow: 'hidden' }}
                    title={params.colDef.headerName}
                    width="100%">
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params) => (
                <Box
                    sx={{
                        fontSize: '13px',
                        width: '100%',
                        textAlign: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                    title={params.value}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'hinhThucKM',
            headerName: 'Hình thức khuyễn mại',
            minWidth: 125,
            flex: 1,
            renderHeader: (params) => (
                <Box
                    sx={{ fontWeight: '700', textOverflow: 'ellipsis', overflow: 'hidden' }}
                    title={params.colDef.headerName}
                    width="100%">
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params) => (
                <Box
                    sx={{
                        fontSize: '13px',
                        width: '100%',
                        textAlign: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                    title={params.value}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'thoiGianApDung',
            headerName: 'Ngày bắt đầu',
            minWidth: 125,
            flex: 1,
            renderHeader: (params) => (
                <Box
                    sx={{ fontWeight: '700', textOverflow: 'ellipsis', overflow: 'hidden' }}
                    title={params.colDef.headerName}
                    width="100%">
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params) => (
                <Box
                    sx={{
                        fontSize: '13px',
                        width: '100%',
                        textAlign: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                    title={formatDate(new Date(params.value), 'dd/MM/yyyy')}>
                    {formatDate(new Date(params.value), 'dd/MM/yyyy')}
                </Box>
            )
        },
        {
            field: 'thoiGianKetThuc',
            headerName: 'Ngày hết hạn',
            minWidth: 125,
            flex: 1,
            renderHeader: (params) => (
                <Box
                    sx={{ fontWeight: '700', textOverflow: 'ellipsis', overflow: 'hidden' }}
                    title={params.colDef.headerName}
                    width="100%">
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params) => (
                <Box
                    sx={{
                        fontSize: '13px',
                        width: '100%',
                        textAlign: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                    {params.value !== null && params.value !== '' && params.value != undefined
                        ? formatDate(new Date(params.value), 'dd/MM/yyyy')
                        : ''}
                </Box>
            )
        },
        {
            field: 'trangThai',
            headerName: 'Trạng thái',
            minWidth: 100,
            flex: 1,
            headerAlign: 'center',
            renderHeader: (params) => (
                <Box
                    sx={{ fontWeight: '700', textOverflow: 'ellipsis', overflow: 'hidden' }}
                    title={params.colDef.headerName}
                    width="100%">
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params) => (
                <Typography
                    variant="body2"
                    alignItems={'center'}
                    borderRadius="12px"
                    padding={'4px 8px'}
                    sx={{
                        margin: 'auto',
                        backgroundColor:
                            params.row.trangThai === 1 ? '#E8FFF3' : params.row.trangThai === 0 ? '#FFF8DD' : '#FFF5F8',
                        color:
                            params.row.trangThai === 1 ? '#50CD89' : params.row.trangThai === 0 ? '#FF9900' : '#F1416C'
                    }}
                    fontSize="13px"
                    fontWeight="400"
                    textAlign={'center'}
                    color="#009EF7">
                    {params.value === 1 ? 'Hoạt động' : 'Ngừng hoạt động'}
                </Typography>
            )
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
                <IconButton
                    aria-label="Actions"
                    aria-controls={`actions-menu-${params.row.id}`}
                    aria-haspopup="true"
                    onClick={(event) => {
                        handleOpenMenu(event, params.row.id);
                    }}>
                    <MoreHorizIcon />
                </IconButton>
            ),
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
        }
    ] as GridColDef[];
    return (
        <Box paddingTop={2}>
            <Grid container alignItems="center" spacing={1} justifyContent="space-between">
                <Grid item xs={12} sm={6} md="auto" display="flex" alignItems="center" gap="10px">
                    <Typography variant="h1" fontSize="16px" fontWeight="700" color="#333233">
                        Voucher
                    </Typography>
                    <Box className="form-search">
                        <TextField
                            sx={{
                                backgroundColor: '#fff',
                                borderColor: '#CDC9CD',
                                height: '40px',
                                '& .MuiInputBase-root': {
                                    pl: '0'
                                }
                            }}
                            onChange={(e) => {
                                setFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            onKeyDown={(e) => {
                                if (e.key == 'Enter') {
                                    getAll();
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
                                            getAll();
                                        }}>
                                        <img src={SearchIcon} />
                                    </IconButton>
                                )
                            }}
                        />
                    </Box>
                    {window.screen.width < 768 ? (
                        <ButtonGroup
                            variant="contained"
                            sx={{ gap: '8px', height: '40px', boxShadow: 'unset!important' }}>
                            <Button
                                size="small"
                                hidden={!abpCustom.isGrandPermission('Pages.KhuyenMai.Create')}
                                onClick={() => {
                                    onCreateOrEditVoucherModal('');
                                }}
                                title="Thêm voucher"
                                variant="contained"
                                sx={{
                                    textTransform: 'capitalize',
                                    fontWeight: '400',
                                    minWidth: '173px',
                                    fontSize: '14px',
                                    borderRadius: '4px!important',
                                    backgroundColor: 'var(--color-main)!important'
                                }}
                                className="btn-container-hover">
                                <img src={AddIcon} />
                            </Button>
                        </ButtonGroup>
                    ) : null}
                </Grid>
                {window.screen.width >= 768 ? (
                    <Grid item xs={12} sm={6} md="auto" display="flex" gap="8px" justifyContent="end">
                        <ButtonGroup
                            variant="contained"
                            sx={{ gap: '8px', height: '40px', boxShadow: 'unset!important' }}>
                            <Button
                                size="small"
                                hidden={!abpCustom.isGrandPermission('Pages.KhuyenMai.Create')}
                                onClick={() => {
                                    onCreateOrEditVoucherModal('');
                                }}
                                variant="contained"
                                startIcon={<img src={AddIcon} />}
                                sx={{
                                    textTransform: 'capitalize',
                                    fontWeight: '400',
                                    minWidth: '173px',
                                    fontSize: '14px',
                                    borderRadius: '4px!important',
                                    backgroundColor: 'var(--color-main)!important'
                                }}
                                className="btn-container-hover">
                                Thêm voucher
                            </Button>
                        </ButtonGroup>
                    </Grid>
                ) : null}
            </Grid>
            <Box padding={'16px 0px'}>
                <DataGrid
                    columns={columns}
                    rows={khuyenMaiStore.listKhuyenMai?.items ?? []}
                    rowHeight={46}
                    disableRowSelectionOnClick
                    checkboxSelection={false}
                    hideFooterPagination
                    hideFooter
                    localeText={TextTranslate}
                    sortingOrder={['desc', 'asc']}
                    sortModel={[
                        {
                            field: sortBy,
                            sort: sortType == 'desc' ? 'desc' : 'asc'
                        }
                    ]}
                    onSortModelChange={(newSortModel) => {
                        if (newSortModel.length > 0) {
                            onSort(newSortModel[0].sort?.toString() ?? 'creationTime', newSortModel[0].field ?? 'desc');
                        }
                    }}
                />
            </Box>
            <ActionMenuTable
                selectedRowId={selectedRowId}
                anchorEl={anchorEl}
                closeMenu={handleCloseMenu}
                handleView={handleEdit}
                permissionView="Pages.KhuyenMai.Edit"
                handleEdit={handleEdit}
                permissionEdit="Pages.KhuyenMai.Edit"
                handleDelete={handleDelete}
                permissionDelete="Pages.KhuyenMai.Delete"
            />
            <ConfirmDelete isShow={isShowConfirmDelete} onOk={onOkDelete} onCancel={showConfirmDelete}></ConfirmDelete>
            <CustomTablePagination
                currentPage={currentPage}
                rowPerPage={maxResultCount}
                totalPage={Math.ceil(khuyenMaiStore.listKhuyenMai?.totalCount / maxResultCount)}
                totalRecord={khuyenMaiStore.listKhuyenMai?.totalCount}
                handlePerPageChange={handlePerPageChange}
                handlePageChange={handlePageChange}
            />
            <CreateOrEditVoucher
                visiable={isShowCreate}
                handleClose={Modal}
                onOk={async () => {
                    Modal();
                    await getAll();
                }}
            />
        </Box>
    );
};
export default observer(KhuyenMaiPage);
