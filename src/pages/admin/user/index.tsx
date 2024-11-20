import React, { ChangeEventHandler } from 'react';
import AppComponentBase from '../../../components/AppComponentBase';
import { Box, Grid, TextField, Button, Typography, IconButton, SelectChangeEvent } from '@mui/material';
import { ReactComponent as DateIcon } from '../../../images/calendar-5.svg';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import userService from '../../../services/user/userService';

import { ReactComponent as SearchIcon } from '../../../images/search-normal.svg';
import AddIcon from '../../../images/add.svg';
import '../../../custom.css';
import { GetAllUserOutput } from '../../../services/user/dto/getAllUserOutput';
import CreateOrEditUser from './components/create-or-edit-user';
import { CreateOrUpdateUserInput } from '../../../services/user/dto/createOrUpdateUserInput';
import SuggestService from '../../../services/suggests/SuggestService';
import { GetRoles } from '../../../services/user/dto/getRolesOuput';
import { SuggestNhanSuDto } from '../../../services/suggests/dto/SuggestNhanSuDto';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import { TextTranslate } from '../../../components/TableLanguage';
import ActionMenuTable from '../../../components/Menu/ActionMenuTable';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { enqueueSnackbar } from 'notistack';
import abpCustom from '../../../components/abp-custom';
import ModalAddUser from './components/modal_add_user';
import { ChiNhanhDto } from '../../../services/chi_nhanh/Dto/chiNhanhDto';
import chiNhanhService from '../../../services/chi_nhanh/chiNhanhService';
import { PagedRequestDto } from '../../../services/dto/pagedRequestDto';
import ModalChuyenTienSMS from './components/modal_chuyen_tien_sms';

class UserScreen extends AppComponentBase {
    state = {
        modalVisible: false,
        maxResultCount: 10,
        userId: 0,
        filter: '',
        listUser: [] as GetAllUserOutput[],
        totalCount: 0,
        currentPage: 1,
        totalPage: 0,
        startIndex: 1,
        userEdit: {
            userName: '',
            name: '',
            surname: '',
            emailAddress: '',
            phoneNumber: '',
            isActive: false,
            roleNames: [],
            password: '',
            id: 0,
            nhanSuId: '',
            isAdmin: false
        } as CreateOrUpdateUserInput,
        isShowConfirmDelete: false,
        roles: [] as GetRoles[],
        suggestNhanSu: [] as SuggestNhanSuDto[],
        anchorEl: null,
        selectedRowId: 0,
        rowSelectedModel: [] as GridRowSelectionModel,
        allChiNhanh: [] as ChiNhanhDto[],

        isShowModalChuyenTienSMS: false,
        idNhatKyNapTien: ''
    };

    async componentDidMount() {
        await this.getAll();
        await this.getAllChiNhanh();
        await this.getAllRole();
    }

    async getAllChiNhanh() {
        const data = await chiNhanhService.GetAll({
            keyword: '',
            maxResultCount: 100,
            skipCount: 0
        } as PagedRequestDto);
        this.setState({ allChiNhanh: data.items });
    }

    async getAllRole() {
        const allRole = await userService.getRoles();
        this.setState({ roles: allRole });
    }

    async getAll() {
        const users = await userService.getAll({
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.currentPage,
            keyword: this.state.filter
        });

        const suggestNhanSu = await SuggestService.SuggestNhanSu();
        this.setState({
            listUser: users.items,
            totalCount: users.totalCount,
            totalPage: Math.ceil(users.totalCount / this.state.maxResultCount),
            suggestNhanSu: suggestNhanSu
        });
    }

    handlePageChange = async (event: any, value: number) => {
        await this.setState({
            currentPage: value
        });
        this.getAll();
    };
    handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await this.setState({
            maxResultCount: parseInt(event.target.value.toString(), 10),
            currentPage: 1,
            skipCount: 1
        });
        this.getAll();
    };
    handleSearchChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event: any) => {
        const filter = event.target.value;
        this.setState({ filter: filter });
    };
    Modal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible
        });
    };

    handleCreate = () => {
        this.getAll();
        this.Modal();
    };
    onShowDelete = () => {
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete
        });
    };
    onOkDelete = () => {
        this.delete(this.state.selectedRowId);
        this.onShowDelete();
        this.handleCloseMenu();
    };
    async delete(input: number) {
        const deleteResult = await userService.delete(input);
        deleteResult != null
            ? enqueueSnackbar('Xóa bản ghi thành công', {
                  variant: 'success',
                  autoHideDuration: 3000
              })
            : enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại sau!', {
                  variant: 'error',
                  autoHideDuration: 3000
              });
        await this.getAll();
    }

    handleOpenMenu = (event: any, rowId: any) => {
        this.setState({ anchorEl: event.currentTarget, selectedRowId: rowId });
    };

    handleCloseMenu = async () => {
        await this.setState({ anchorEl: null, selectedRowId: 0 });
        await this.getAll();
    };

    handleView = () => {
        // Handle View action
        this.handleCloseMenu();
    };
    async createOrUpdateModalOpen(entityDto: number) {
        // if (entityDto === 0) {
        //     this.setState({
        //         userEdit: {
        //             userName: '',
        //             name: '',
        //             surname: '',
        //             emailAddress: '',
        //             phoneNumber: '',
        //             isActive: false,
        //             roleNames: [],
        //             password: '',
        //             id: 0,
        //             nhanSuId: '',
        //             isAdmin: false
        //         }
        //     });
        // } else {
        //     const user = await userService.get(entityDto);
        //     this.setState({
        //         userEdit: user
        //     });
        // }

        this.setState({ userId: entityDto });
        this.Modal();
    }
    handleEdit = () => {
        // Handle Edit action
        this.createOrUpdateModalOpen(this.state.selectedRowId ?? 0);
        this.handleCloseMenu();
    };

    // chuyen tien SMS

    // end chuyen tien
    render(): React.ReactNode {
        const columns = [
            {
                field: 'userName',
                headerName: 'Tên đăng nhập',
                minWidth: 125,
                flex: 1,
                renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
                renderCell: (params: any) => (
                    <Box
                        sx={{
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
                field: 'fullName',
                headerName: 'Họ và tên',
                minWidth: 170,
                flex: 1,
                renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
                renderCell: (params: any) => (
                    <Box
                        sx={{
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
                field: 'roleNames',
                headerName: 'Vai trò',
                minWidth: 100,
                flex: 1,
                renderHeader: (params: any) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
                renderCell: (params: any) => (
                    <Box
                        sx={{
                            width: '100%',
                            textAlign: 'left',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        title={params.value.join(', ')}>
                        {params.value.join(', ')}
                    </Box>
                )
            },
            {
                field: 'emailAddress',
                headerName: 'Địa chỉ email',
                minWidth: 150,
                flex: 1,
                renderHeader: (params: any) => <Box title={params.value}>{params.colDef.headerName}</Box>,
                renderCell: (params: any) => (
                    <Box
                        sx={{
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
                field: 'isActive',
                headerName: 'Trạng thái',
                headerAlign: 'center',
                minWidth: 120,
                flex: 0.8,
                renderCell: (params) => (
                    <Typography
                        variant="body2"
                        alignItems={'center'}
                        borderRadius="12px"
                        padding={'4px 8px'}
                        sx={{
                            margin: 'auto',
                            backgroundColor: params.row.isActive === true ? '#E8FFF3' : '#FFF8DD',
                            color: params.row.isActive === true ? '#50CD89' : '#FF9900'
                        }}
                        fontSize="13px"
                        fontWeight="400">
                        {params.value === true ? 'Hoạt động' : 'Ngừng hoạt động'}
                    </Typography>
                ),
                renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
            },
            {
                field: 'creationTime',
                headerName: 'Thời gian tạo',
                minWidth: 150,
                headerAlign: 'center',
                flex: 1,
                renderHeader: (params: any) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
                renderCell: (params: any) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            justifyContent: 'center'
                        }}>
                        <DateIcon style={{ marginRight: 4 }} />
                        <Typography variant="body2">{new Date(params.value).toLocaleDateString('en-GB')}</Typography>
                    </Box>
                )
            },
            {
                field: 'action',
                headerName: 'Hành động',
                maxWidth: 60,
                flex: 1,
                disableColumnMenu: true,
                renderCell: (params: any) => (
                    <Box>
                        <IconButton
                            aria-label="Actions"
                            aria-controls={`actions-menu-${params.row.id}`}
                            aria-haspopup="true"
                            onClick={(event) => {
                                this.handleOpenMenu(event, params.row.id);
                            }}>
                            <MoreHorizIcon />
                        </IconButton>
                    </Box>
                ),
                renderHeader: (params: any) => <Box sx={{ display: 'none' }}>{params.colDef.headerName}</Box>
            }
        ] as GridColDef[];

        return (
            <Box
                sx={{
                    paddingTop: '16px'
                }}>
                <ModalChuyenTienSMS
                    visiable={this.state.isShowModalChuyenTienSMS}
                    idNhatKyNapTien={this.state.idNhatKyNapTien}
                    onClose={() => this.setState({ isShowModalChuyenTienSMS: false })}
                    onOk={() => this.setState({ isShowModalChuyenTienSMS: false })}
                />
                <Box>
                    <Grid container justifyContent="space-between" alignItems="center" rowGap="16px">
                        <Grid item xs="auto">
                            <Box display="flex" gap="10px" alignItems="center">
                                <Typography variant="h1" fontWeight="700" fontSize="16px" color="#333233">
                                    Danh sách người dùng
                                </Typography>
                                <Box>
                                    <TextField
                                        onKeyDown={(e) => {
                                            if (e.key == 'Enter') {
                                                this.getAll();
                                            }
                                        }}
                                        onChange={this.handleSearchChange}
                                        size="small"
                                        sx={{
                                            borderColor: '#E6E1E6!important',
                                            bgcolor: '#fff'
                                        }}
                                        placeholder="Tìm kiếm..."
                                        InputProps={{
                                            startAdornment: (
                                                <SearchIcon
                                                    onClick={() => {
                                                        this.getAll();
                                                    }}
                                                    style={{
                                                        marginRight: '8px',
                                                        color: 'gray'
                                                    }}
                                                />
                                            )
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs="auto" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div>
                                <Box display="flex" alignItems="center">
                                    <Box display="flex" gap="8px">
                                        <Button
                                            hidden={!abpCustom.isGrandPermission('Pages.Administration.Users.Create')}
                                            variant="contained"
                                            startIcon={<img src={AddIcon} />}
                                            size="small"
                                            onClick={() => {
                                                this.createOrUpdateModalOpen(0);
                                            }}
                                            sx={{
                                                height: '40px',
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                fontWeight: '400',
                                                backgroundColor: 'var(--color-main)!important'
                                            }}>
                                            Thêm người dùng
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                this.setState({ isShowModalChuyenTienSMS: true, idNhatKyNapTien: '' });
                                            }}
                                            startIcon={<PaidOutlinedIcon />}>
                                            Chuyển tiền SMS
                                        </Button>
                                    </Box>
                                </Box>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
                <Box className="page-content" sx={{ paddingTop: '16px', borderRadius: '8px' }}>
                    <Box>
                        {this.state.rowSelectedModel.length > 0 ? (
                            <Box mb={1}>
                                <Button variant="contained" color="secondary">
                                    Xóa {this.state.rowSelectedModel.length} bản ghi đã chọn
                                </Button>
                            </Box>
                        ) : null}
                        <DataGrid
                            rowHeight={46}
                            columns={columns}
                            rows={this.state.listUser}
                            rowSelectionModel={this.state.rowSelectedModel || undefined}
                            onRowSelectionModelChange={(row) => {
                                this.setState({ rowSelectedModel: row });
                            }}
                            disableRowSelectionOnClick
                            checkboxSelection={false}
                            sx={{
                                '& .MuiDataGrid-columnHeader': {
                                    background: '#EEF0F4'
                                }
                            }}
                            hideFooterPagination
                            hideFooter
                            localeText={TextTranslate}
                        />
                    </Box>
                    <CustomTablePagination
                        currentPage={this.state.currentPage}
                        rowPerPage={this.state.maxResultCount}
                        totalPage={this.state.totalPage}
                        totalRecord={this.state.totalCount}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageChange={this.handlePageChange}
                    />
                    {/* <CreateOrEditUser
                        visible={this.state.modalVisible}
                        modalType={
                            this.state.userId === 0 ? 'Thêm mới tài khoản' : 'Cập nhật tài khoản'
                        }
                        formRef={this.state.userEdit}
                        onCancel={() =>
                            this.setState({
                                modalVisible: false
                            })
                        }
                        roles={this.state.roles}
                        suggestNhanSu={this.state.suggestNhanSu}
                        userId={this.state.userId}
                        onOk={this.handleCreate}
                    /> */}
                    <ModalAddUser
                        isShowModal={this.state.modalVisible}
                        onCancel={() => {
                            this.setState({
                                modalVisible: false
                            });
                        }}
                        // chỉ lấy nhân viên chưa có tk đăng nhập
                        dataNhanVien={this.state.suggestNhanSu.filter(
                            (xOut: SuggestNhanSuDto) =>
                                !this.state.listUser
                                    ?.map((x: GetAllUserOutput) => {
                                        // get list nhansuId from listUser
                                        return x.nhanSuId;
                                    })
                                    .includes(xOut.id)
                        )}
                        dataChiNhanh={this.state.allChiNhanh}
                        userId={this.state.userId}
                        allRoles={this.state.roles}
                        onOk={this.handleCreate}
                    />
                    <ConfirmDelete
                        isShow={this.state.isShowConfirmDelete}
                        onOk={this.onOkDelete}
                        onCancel={this.onShowDelete}></ConfirmDelete>
                    <ActionMenuTable
                        anchorEl={this.state.anchorEl}
                        selectedRowId={this.state.selectedRowId}
                        closeMenu={this.handleCloseMenu}
                        handleView={this.handleEdit}
                        permissionView="Pages.Administration.Users.Edit"
                        handleEdit={this.handleEdit}
                        permissionEdit="Pages.Administration.Users.Edit"
                        handleDelete={this.onShowDelete}
                        permissionDelete="Pages.Administration.Users.Delete"
                    />
                </Box>
            </Box>
        );
    }
}

export default UserScreen;
