/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEventHandler } from 'react';
import { Button, Box, Typography, Grid, TextField, IconButton, SelectChangeEvent } from '@mui/material';
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';

import roleService from '../../../services/role/roleService';
import AddIcon from '../../../images/add.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { GetAllRoleOutput } from '../../../services/role/dto/getAllRoleOutput';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import CreateOrEditRoleModal from './components/create-or-edit-role';
import { PermissionTree } from '../../../services/role/dto/permissionTree';
import { CreateOrEditRoleDto } from '../../../services/role/dto/createOrEditRoleDto';
import { ReactComponent as SearchIcon } from '../../../images/search-normal.svg';
import { TextTranslate } from '../../../components/TableLanguage';
import ActionMenuTable from '../../../components/Menu/ActionMenuTable';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { observer } from 'mobx-react';
import { enqueueSnackbar } from 'notistack';
import roleStore from '../../../stores/roleStore';
import abpCustom from '../../../components/abp-custom';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRoleProps {}

export interface IRoleState {
    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    roleId: number;
    filter: string;
    listRole: GetAllRoleOutput[];
    totalCount: number;
    permissionTree: PermissionTree[];
    roleEdit: CreateOrEditRoleDto;
    currentPage: number;
    totalPage: number;
    startIndex: number;
    isShowConfirmDelete: boolean;
}
class RoleScreen extends React.Component<IRoleProps> {
    state = {
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        roleId: 0,
        filter: '',
        listRole: [] as GetAllRoleOutput[],
        totalCount: 0,
        permissionTree: [] as PermissionTree[],
        roleEdit: {
            description: '',
            displayName: '',
            name: '',
            grantedPermissions: [],
            id: 0
        } as CreateOrEditRoleDto,
        currentPage: 1,
        totalPage: 0,
        startIndex: 1,
        isShowConfirmDelete: false,
        selectedRowId: 0,
        anchorEl: null,
        rowSelectedModel: [] as GridRowSelectionModel
    };

    async componentDidMount() {
        await this.getAll();
    }

    async getAll() {
        const roles = await roleService.getAll({
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.currentPage,
            keyword: this.state.filter
        });
        const permissionTree = await roleService.getAllPermissionTree();
        this.setState({
            listRole: roles.items,
            totalCount: roles.totalCount,
            permissionTree: permissionTree,
            totalPage: Math.ceil(roles.totalCount / this.state.maxResultCount),
            roleEdit: {
                id: 0,
                name: '',
                displayName: '',
                grandPermissions: [],
                description: ''
            }
        });
    }
    handleSearch: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event: any) => {
        const filter = event.target.value;
        this.setState({ filter: filter }, async () => this.getAll());
    };

    handlePageChange = async (event: any, value: any) => {
        await this.setState({
            currentPage: value,
            skipCount: value
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
    Modal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible
        });
    };

    async createOrUpdateModalOpen(id: number) {
        if (id === 0) {
            const allPermission = await roleService.getAllPermissionTree();
            await roleStore.initCreateOrEditRoleDto();
            await this.setState({
                permissionTree: allPermission,
                roleEdit: roleStore.createOrEditRoleDto
            });
        } else {
            await roleStore.getRoleForEdit(id);
            const roleForEdit = roleStore.createOrEditRoleDto;
            const allPermission = await roleService.getAllPermissionTree();
            this.setState({
                permissionTree: allPermission,
                roleId: id,
                roleEdit: roleForEdit
            });
        }

        this.setState({ roleId: id });
        this.Modal();
    }
    handleCreate = async () => {
        this.getAll();
        await roleStore.initCreateOrEditRoleDto();
        this.setState({ modalVisible: false });
    };
    onShowDelete = () => {
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete
        });
    };
    onOkDelete = () => {
        this.delete(this.state.selectedRowId);
        this.onShowDelete();
    };
    async delete(id: number) {
        const deleteResult = await roleService.delete(id);
        deleteResult != null
            ? enqueueSnackbar('Xóa bản ghi thành công', {
                  variant: 'success',
                  autoHideDuration: 3000
              })
            : enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại sau!', {
                  variant: 'error',
                  autoHideDuration: 3000
              });
        this.getAll();
    }
    handleOpenMenu = (event: any, rowId: any) => {
        this.setState({ anchorEl: event.currentTarget, selectedRowId: rowId });
    };

    handleCloseMenu = async () => {
        await this.setState({ anchorEl: null, selectedRowId: 0 });
        await this.getAll();
    };
    handleEdit = () => {
        // Handle Edit action
        this.createOrUpdateModalOpen(this.state.selectedRowId ?? 0);
        this.handleCloseMenu();
    };
    handleView = () => {
        // Handle View action
        this.handleCloseMenu();
    };
    render() {
        const columns = [
            {
                field: 'name',
                headerName: 'Tên vai trò',
                minWidth: 125,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700', textAlign: 'left' }} title={params.value}>
                        {params.colDef.headerName}
                    </Box>
                ),
                renderCell: (params: any) => (
                    <Box width="100%" textAlign="left" fontSize="13px" fontWeight={400} fontFamily={'Roboto'}>
                        {params.value}
                    </Box>
                )
            },
            {
                field: 'description',
                headerName: 'Mô tả',
                minWidth: 125,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700', textAlign: 'left' }} title={params.colDef.headerName}>
                        {params.colDef.headerName}
                    </Box>
                ),
                renderCell: (params: any) => (
                    <Box
                        sx={{
                            fontSize: '13px',
                            width: '100%',
                            fontWeight: '400',
                            fontFamily: 'Roboto',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        title={params.value}>
                        {params.value}
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
        ];
        return (
            <Box>
                <Box>
                    <Grid container spacing={1} justifyContent="space-between" paddingTop="16px">
                        <Grid item>
                            <div>
                                <Box display="flex" alignItems="center" gap="10px">
                                    <Typography variant="h1" fontSize="16px" color="#333233" fontWeight="700">
                                        Danh sách vai trò
                                    </Typography>
                                    <Box>
                                        <TextField
                                            onChange={this.handleSearch}
                                            size="small"
                                            sx={{
                                                borderColor: '#E6E1E6!important',
                                                bgcolor: '#fff'
                                            }}
                                            placeholder="Tìm kiếm..."
                                            InputProps={{
                                                startAdornment: (
                                                    <SearchIcon
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
                            </div>
                        </Grid>
                        <Grid item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div>
                                <Box>
                                    <Box display="flex" alignItems="center" gap="8px">
                                        <Button
                                            hidden={!abpCustom.isGrandPermission('Pages.Administration.Roles.Create')}
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
                                                fontWeight: '400'
                                            }}
                                            className="btn-container-hover">
                                            Thêm vai trò
                                        </Button>
                                    </Box>
                                </Box>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
                <Box paddingTop="16px" borderRadius="8px">
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
                        rows={this.state.listRole}
                        rowSelectionModel={this.state.rowSelectedModel || undefined}
                        onRowSelectionModelChange={(row) => {
                            this.setState({ rowSelectedModel: row });
                        }}
                        disableRowSelectionOnClick
                        checkboxSelection={false}
                        hideFooter
                        hideFooterPagination
                        localeText={TextTranslate}
                    />
                    <ActionMenuTable
                        selectedRowId={this.state.selectedRowId}
                        anchorEl={this.state.anchorEl}
                        closeMenu={this.handleCloseMenu}
                        handleView={this.handleEdit}
                        permissionView="Pages.Administration.Roles.Edit"
                        handleEdit={this.handleEdit}
                        permissionEdit="Pages.Administration.Roles.Edit"
                        handleDelete={this.onShowDelete}
                        permissionDelete="Pages.Administration.Roles.Delete"
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
                <CreateOrEditRoleModal
                    visible={this.state.modalVisible}
                    onCancel={async () => {
                        this.setState({
                            modalVisible: false
                        });
                        await roleStore.initCreateOrEditRoleDto();
                    }}
                    modalType={this.state.roleId === 0 ? 'Thêm mới quyền' : 'Cập nhật quyền'}
                    onOk={this.handleCreate}
                    permissionTree={this.state.permissionTree}
                    formRef={roleStore.createOrEditRoleDto}
                />
                <ConfirmDelete
                    isShow={this.state.isShowConfirmDelete}
                    onOk={this.onOkDelete}
                    onCancel={this.onShowDelete}></ConfirmDelete>
            </Box>
        );
    }
}

export default observer(RoleScreen);
