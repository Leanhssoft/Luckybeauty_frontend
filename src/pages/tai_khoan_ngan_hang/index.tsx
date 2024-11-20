import { Box, Stack, Grid, Button, Typography, IconButton, SelectChangeEvent, TextField } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CreateOrEditTaiKhoanNganHangModal from './components/create-or-edit-tai-khoan-ngan-hang';
import { useContext, useEffect, useState } from 'react';
import suggestStore from '../../stores/suggestStore';
import { observer } from 'mobx-react';
import { CreateOrEditTaiKhoanNganHangDto } from '../../services/tai_khoan_ngan_hang/Dto/createOrEditTaiKhoanNganHangDto';
import AppConsts from '../../lib/appconst';
import Cookies from 'js-cookie';
import { TaiKhoanNganHangDto } from '../../services/so_quy/Dto/TaiKhoanNganHangDto';
import taiKhoanNganHangService from '../../services/tai_khoan_ngan_hang/taiKhoanNganHangService';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ActionMenuTable from '../../components/Menu/ActionMenuTable';
import CustomTablePagination from '../../components/Pagination/CustomTablePagination';
import { TextTranslate } from '../../components/TableLanguage';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import { enqueueSnackbar } from 'notistack';
import abpCustom from '../../components/abp-custom';
import { ButtonNavigate } from '../../components/Button/ButtonNavigate';
const TaiKhoanNganHangPage = () => {
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [maxResultCount, setMaxResultCount] = useState(10);
    const [sortBy, setSortBy] = useState('');
    const [sortType, setSortType] = useState('');
    const [totalPage, setTotalPage] = useState(1);
    const [totalRow, setTotalRow] = useState(1);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRowId, setSelectedRowId] = useState('');
    const [isShowModal, setIsShowModal] = useState(false);
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;
    const [formRef, setFormRef] = useState<CreateOrEditTaiKhoanNganHangDto>({
        id: AppConsts.guidEmpty,
        idChiNhanh: chinhanh.id ?? AppConsts.guidEmpty,
        idNganHang: '',
        soTaiKhoan: '',
        tenChuThe: '',
        ghiChu: '',
        trangThai: 1,
        isDefault: false
    });
    const [isShowConfirmDelete, setIsShowConfirmDelete] = useState(false);
    const [dataRow, setDataRow] = useState<TaiKhoanNganHangDto[]>([]);
    useEffect(() => {
        suggestData();
    }, []);
    useEffect(() => {
        getData();
    }, [chinhanh.id, currentPage, maxResultCount, sortBy, sortType]);
    const getData = async () => {
        const data = await taiKhoanNganHangService.getAll({
            keyword: filter,
            maxResultCount: maxResultCount,
            skipCount: currentPage,
            idChiNhanh: Cookies.get('IdChiNhanh') ?? AppConsts.guidEmpty
        });
        setTotalRow(data.totalCount);
        setTotalPage(Math.ceil(data.totalCount / maxResultCount));
        setDataRow(data.items);
    };
    const onModal = () => {
        setIsShowModal(!isShowModal);
    };
    const handleClose = () => {
        setIsShowModal(false);
    };
    const handleSubmit = async () => {
        await getData();
        onModal();
    };
    const onConfirmDelete = () => {
        setIsShowConfirmDelete(!isShowConfirmDelete);
    };
    const deleteRow = async (id: string) => {
        const deleteReult = await taiKhoanNganHangService.delete(id);
        enqueueSnackbar(deleteReult.message, {
            variant: deleteReult.status,
            autoHideDuration: 3000
        });
        await getData();
        onConfirmDelete();
    };
    const onOkDelete = () => {
        deleteRow(selectedRowId ?? AppConsts.guidEmpty);
        handleCloseMenu();
    };
    const onCreateOrEditModal = async (id: string) => {
        if (id != '') {
            const data = await taiKhoanNganHangService.getForEdit(id);
            setFormRef(data);
        } else {
            setFormRef({
                id: AppConsts.guidEmpty,
                idChiNhanh: Cookies.get('IdChiNhanh') ?? AppConsts.guidEmpty,
                idNganHang: '',
                soTaiKhoan: '',
                tenChuThe: '',
                ghiChu: '',
                trangThai: 1,
                isDefault: false
            });
        }
        onModal();
    };
    const handleEdit = () => {
        // Handle Edit action
        onCreateOrEditModal(selectedRowId ?? '');
        handleCloseMenu();
    };
    const suggestData = async () => {
        await suggestStore.getSuggestNganHang();
    };
    const handleOpenMenu = (event: any, rowId: any) => {
        setAnchorEl(event.currentTarget);
        setSelectedRowId(rowId);
    };

    const handleCloseMenu = async () => {
        setAnchorEl(null);
        setSelectedRowId('');
    };
    const handlePageChange = async (event: any, value: number) => {
        await setCurrentPage(value);
    };
    const handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await setMaxResultCount(parseInt(event.target.value.toString(), 10));
        setCurrentPage(1);
    };

    const hanClickIconSearch = () => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            getData();
        }
    };

    const handleKeyDownTextSearch = (event: any) => {
        if (event.keyCode === 13) {
            hanClickIconSearch();
        }
    };
    const columns: GridColDef[] = [
        {
            field: 'maNganHang',
            headerName: 'Mã ngân hàng',
            minWidth: 90,
            maxWidth: 150,
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
            field: 'tenNganHang',
            headerName: 'Tên ngân hàng',
            minWidth: 180,
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
            field: 'soTaiKhoan',
            headerName: 'Số tài khoản',
            minWidth: 90,
            maxWidth: 200,
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
            field: 'tenChuThe',
            headerName: 'Tên chủ thẻ',
            minWidth: 90,
            maxWidth: 300,
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
            field: 'trangThai',
            headerName: 'Trạng thái',
            headerAlign: 'center',
            align: 'center',
            minWidth: 90,
            maxWidth: 120,
            flex: 1,
            renderHeader: (params) => (
                <Box
                    sx={{
                        fontWeight: '700',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        justifyContent: 'center',
                        display: 'flex'
                    }}
                    title={params.colDef.headerName}
                    width="100%">
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params) => (
                <Typography
                    variant="body2"
                    className={
                        params.row.trangThai === 1
                            ? 'data-grid-cell-trangthai-active'
                            : 'data-grid-cell-trangthai-notActive'
                    }>
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
            maxWidth: 48,
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
            renderHeader: (params) => <Box title="Thao tác">{params.colDef.headerName}</Box>
        }
    ];
    return (
        <Box paddingTop={2}>
            <Grid container spacing={1}>
                <Grid item xs={12} md={5} sm={6} lg={6}>
                    <Typography fontSize={'18px'} fontWeight={700} fontFamily={'Roboto'}>
                        Tài khoản ngân hàng
                    </Typography>
                </Grid>
                <Grid item xs={12} md={7} sm={6} lg={6}>
                    <Grid container spacing={1}>
                        <Grid item lg={7} md={12} xs={12} sm={12}>
                            <TextField
                                size="small"
                                fullWidth
                                placeholder="Tìm kiếm"
                                sx={{ backgroundColor: '#fff' }}
                                value={filter}
                                onChange={(e) => setFilter(e.currentTarget.value)}
                                InputProps={{
                                    startAdornment: <SearchOutlinedIcon onClick={hanClickIconSearch} />
                                }}
                                onKeyDown={(event) => {
                                    handleKeyDownTextSearch(event);
                                }}
                            />
                        </Grid>
                        <Grid item lg={5} md={12} xs={12} sm={12}>
                            <Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<AddOutlinedIcon />}
                                    sx={{
                                        display: abpCustom.isGrandPermission('Pages.TaiKhoanNganHang.Create')
                                            ? ''
                                            : 'none'
                                    }}
                                    onClick={() => {
                                        onCreateOrEditModal('');
                                    }}>
                                    Thêm tài khoản
                                </Button>

                                <ButtonNavigate navigateTo="/settings" btnText="Quay lại" />
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Box marginTop={2} className="page-box-right">
                <DataGrid
                    rows={dataRow}
                    columns={columns}
                    hideFooterPagination
                    hideFooter
                    localeText={TextTranslate}
                    className="data-grid-row"
                />
            </Box>
            <ActionMenuTable
                selectedRowId={selectedRowId}
                anchorEl={anchorEl}
                closeMenu={handleCloseMenu}
                handleView={handleEdit}
                permissionView="Pages.Administration"
                handleEdit={handleEdit}
                permissionEdit="Pages.Administration"
                handleDelete={onConfirmDelete}
                permissionDelete="Pages.Administration"
            />
            <CustomTablePagination
                currentPage={currentPage}
                rowPerPage={maxResultCount}
                totalPage={totalPage}
                totalRecord={totalRow}
                handlePerPageChange={handlePerPageChange}
                handlePageChange={handlePageChange}
            />
            <CreateOrEditTaiKhoanNganHangModal
                onCancel={handleClose}
                onOk={handleSubmit}
                visiable={isShowModal}
                formRef={formRef}
            />
            <ConfirmDelete isShow={isShowConfirmDelete} onOk={onOkDelete} onCancel={onConfirmDelete}></ConfirmDelete>
        </Box>
    );
};
export default observer(TaiKhoanNganHangPage);
