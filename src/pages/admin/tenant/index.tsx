/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEventHandler } from 'react';
import { Box, Grid, Typography, TextField, Button, SelectChangeEvent } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import AppComponentBase from '../../../components/AppComponentBase';
import tenantService from '../../../services/tenant/tenantService';
import { ReactComponent as DateIcon } from '../../../images/calendar-5.svg';
import AddIcon from '../../../images/add.svg';
import CreateOrEditTenant from './components/create-or-edit-tenant';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import CreateTenantInput from '../../../services/tenant/dto/createTenantInput';
import { ReactComponent as SearchIcon } from '../../../images/search-normal.svg';
import { Info, Edit, DeleteForever } from '@mui/icons-material';
import { TextTranslate } from '../../../components/TableLanguage';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { enqueueSnackbar } from 'notistack';
import abpCustom from '../../../components/abp-custom';
import { format as formatDateFns, differenceInDays } from 'date-fns';
import { IList } from '../../../services/dto/IList';
import ActionViewEditDelete from '../../../components/Menu/ActionViewEditDelete';
import ChooseImpersonateToTenant from './components/choose_impersonate_to_tenant';
import TenantHistoryActivityModal from './components/tenant_history_activity_modal';
import { TenantInfoActivityDto } from '../../../services/tenant/dto/tenantInfoActivityDto';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITenantProps {}

class TenantScreen extends AppComponentBase<ITenantProps> {
    state = {
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        tenantId: 0,
        tenantName: '',
        filter: '',
        listTenant: [] as TenantInfoActivityDto[],
        totalCount: 0,
        currentPage: 1,
        totalPage: 0,
        startIndex: 1,
        createOrEditTenant: {
            isActive: true,
            name: '',
            adminEmailAddress: '',
            connectionString: '',
            tenancyName: '',
            isDefaultPassword: false,
            password: '',
            editionId: 0,
            isTrial: false
        } as CreateTenantInput,
        isShowConfirmDelete: false,
        anchorEl: null,
        selectedRowId: 0,
        rowSelectedModel: [] as GridRowSelectionModel,
        visiableImperonate: false,
        visiableHistoryActivity: false
    };

    componentDidMount() {
        this.getAll();
    }

    async getAll() {
        const tenants = await tenantService.getTenantStatusActivity({
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.currentPage,
            keyword: this.state.filter
        });
        this.setState({
            listTenant: tenants.items,
            totalCount: tenants.totalCount,
            totalPage: Math.ceil(tenants.totalCount / this.state.maxResultCount)
        });
    }

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
    handleSearch: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event: any) => {
        const filter = event.target.value;
        this.setState({ filter: filter }, async () => this.getAll());
    };
    Modal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible
        });
    };

    createOrUpdateModalOpen = async (entityDto: number) => {
        if (entityDto === 0) {
            await this.setState({
                createOrEditTenant: {
                    isActive: true,
                    name: '',
                    adminEmailAddress: '',
                    connectionString: '',
                    tenancyName: '',
                    isDefaultPassword: false,
                    password: '',
                    editionId: 0,
                    isTrial: false
                }
            });
        } else {
            const createOrEdit = await tenantService.getForEdit(entityDto);
            await this.setState({
                createOrEditTenant: {
                    isActive: createOrEdit.isActive,
                    name: createOrEdit.name,
                    tenancyName: createOrEdit.tenancyName,
                    adminEmailAddress: '',
                    connectionString: createOrEdit.connectionString,
                    isDefaultPassword: true,
                    editionId: createOrEdit.editionId,
                    isTrial: createOrEdit.isTrial,
                    subscriptionEndDate: createOrEdit.subscriptionEndDate
                }
            });
        }

        this.setState({ tenantId: entityDto });
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
    };
    async delete(input: number) {
        const deleteResult = await tenantService.delete(input);
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

    handleCreate = () => {
        this.getAll();
        this.Modal();
    };
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
    onShowImpersonate = async () => {
        await this.setState({ visiableImperonate: !this.state.visiableImperonate });
    };
    onShowTenantHistoryActivity = async () => {
        await this.setState({ visiableHistoryActivity: !this.state.visiableHistoryActivity });
    };
    doActionRow = async (action: number, tenantId: number) => {
        this.setState({ tenantId: tenantId, selectedRowId: tenantId });
        switch (action) {
            case 0:
                {
                    this.createOrUpdateModalOpen(tenantId);
                }
                break;
            case 1:
                {
                    this.createOrUpdateModalOpen(tenantId);
                }
                break;
            case 2:
                this.onShowDelete();
                break;
            case 3:
                this.onShowImpersonate();
                break;
            case 4:
                this.onShowTenantHistoryActivity();
                break;
        }
    };
    render(): React.ReactNode {
        const columns: GridColDef[] = [
            {
                field: 'name',
                headerName: 'Tên cửa hàng',
                minWidth: 125,
                flex: 1,
                renderHeader: (params) => <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>,
                renderCell: (params) => (
                    <Box
                        sx={{
                            fontSize: '13px',
                            width: '100%',
                            textAlign: 'left',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontWeight: '400',
                            fontFamily: 'Roboto'
                        }}
                        title={params.value}>
                        {params.value}
                    </Box>
                )
            },
            {
                field: 'tenancyName',
                headerName: 'Tenant Id',
                minWidth: 125,
                flex: 1,
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }} title={params.colDef.headerName}>
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
                            textOverflow: 'ellipsis',
                            fontWeight: '400',
                            fontFamily: 'Roboto'
                        }}
                        title={params.value}>
                        {params.value}
                    </Box>
                )
            },
            {
                field: 'status',
                headerName: 'Trạng thái',
                minWidth: 100,
                flex: 0.7,
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }} title={params.colDef.headerName}>
                        {params.colDef.headerName}
                    </Box>
                ),
                renderCell: (params) => (
                    <Box
                        sx={{
                            fontSize: '13px',
                            fontWeight: '400',
                            fontFamily: 'Roboto',
                            textAlign: 'left',
                            display: 'flex',
                            justifyContent: 'left'
                        }}>
                        {params.row.subscriptionEndDate &&
                            params.value +
                                ' ' +
                                differenceInDays(new Date(params.row.subscriptionEndDate), new Date()) +
                                ' ngày'}
                    </Box>
                )
            },
            {
                field: 'creationTime',
                headerName: 'Ngày bắt đầu',
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
                                    {formatDateFns(new Date(params.value), 'dd/MM/yyyy HH:mm')}
                                </Typography>
                            </>
                        ) : null}
                    </Box>
                ),
                renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
            },
            {
                field: 'subscriptionEndDate',
                headerName: 'Ngày hết hạn',
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
                                    {formatDateFns(new Date(params.value), 'dd/MM/yyyy HH:mm')}
                                </Typography>
                            </>
                        ) : null}
                    </Box>
                ),
                renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
            },
            {
                field: 'lastActivityTime',
                headerName: 'Ngày hoạt động gần nhất',
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
                                    {formatDateFns(new Date(params.value), 'dd/MM/yyyy HH:mm')}
                                </Typography>
                            </>
                        ) : null}
                    </Box>
                ),
                renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
            },
            {
                field: 'action',
                headerName: 'Hành động',
                maxWidth: 60,
                flex: 1,
                disableColumnMenu: true,
                renderCell: (params) => (
                    <ActionViewEditDelete
                        lstOption={
                            [
                                {
                                    id: '0',
                                    text: 'Xem',
                                    color: '#009EF7',
                                    isShow: abpCustom.isGrandPermission('Pages.Tenants'),
                                    icon: <Info sx={{ color: '#009EF7' }} />
                                },
                                {
                                    id: '1',
                                    text: 'Sửa',
                                    color: '#009EF7',
                                    isShow: abpCustom.isGrandPermission('Pages.Tenants.Edit'),
                                    icon: <Edit sx={{ color: '#009EF7' }} />
                                },
                                {
                                    id: '2',
                                    text: 'Xóa',
                                    color: '#F1416C',
                                    isShow:
                                        !abpCustom.isGrandPermission('Pages.Tenants.Delete') ||
                                        params.row.tenancyName === 'Default'
                                            ? false
                                            : true,
                                    icon: <DeleteForever sx={{ color: '#F1416C' }} />
                                },
                                {
                                    id: '3',
                                    text: 'Chuyển đến tenant: ' + params.row.tenancyName,
                                    color: '#009EF7',
                                    isShow: true,
                                    icon: <Info sx={{ color: '#009EF7' }} />
                                },
                                {
                                    id: '4',
                                    text: 'Lịch sử hoạt động',
                                    color: '#009EF7',
                                    isShow: true,
                                    icon: <Info sx={{ color: '#009EF7' }} />
                                }
                            ] as IList[]
                        }
                        handleAction={(action: number) => {
                            this.setState({ tenantName: params.row.tenancyName });
                            this.doActionRow(action, params.row.id);
                        }}
                    />
                ),
                renderHeader: (params) => <Box sx={{ display: 'none' }}>{params.colDef.headerName}</Box>
            }
            // {
            //     field: 'action',
            //     headerName: 'Hành động',
            //     maxWidth: 60,
            //     flex: 1,
            //     disableColumnMenu: true,
            //     renderCell: (params: any) => (
            //         <Box>
            //             <IconButton
            //                 aria-label="Actions"
            //                 aria-controls={`actions-menu-${params.row.id}`}
            //                 aria-haspopup="true"
            //                 onClick={(event) => {
            //                     this.handleOpenMenu(event, params.row.id);
            //                 }}>
            //                 <MoreHorizIcon />
            //             </IconButton>
            //         </Box>
            //     ),
            //     renderHeader: (params: any) => <Box sx={{ display: 'none' }}>{params.colDef.headerName}</Box>
            // }
        ];
        return (
            <Box sx={{ paddingTop: '16px' }}>
                <div>
                    <Grid container justifyContent="space-between" spacing={1} alignItems="center">
                        <Grid item>
                            <div>
                                <Box display="flex" gap="8px" alignItems="center">
                                    <Typography variant="h1" fontWeight="700" fontSize="16px" sx={{ marginTop: '4px' }}>
                                        Danh sách tenant
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
                        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div>
                                <Box display="flex" alignItems="center" gap="8px">
                                    <Button
                                        hidden={!abpCustom.isGrandPermission('Pages.Tenants.Create')}
                                        variant="contained"
                                        startIcon={<img src={AddIcon} />}
                                        size="small"
                                        sx={{
                                            height: '40px',
                                            fontSize: '14px',
                                            textTransform: 'unset',
                                            fontWeight: '400'
                                        }}
                                        onClick={() => {
                                            this.createOrUpdateModalOpen(0);
                                        }}
                                        className="btn-container-hover">
                                        Thêm tenant
                                    </Button>
                                </Box>
                            </div>
                        </Grid>
                    </Grid>
                </div>
                <Box paddingTop="16px" className="page-content " sx={{ borderRadius: '8px' }}>
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
                        rows={this.state.listTenant}
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
                        hideFooter
                        localeText={TextTranslate}
                    />
                    {/* <ActionMenuTable
                        selectedRowId={this.state.selectedRowId}
                        anchorEl={this.state.anchorEl}
                        closeMenu={this.handleCloseMenu}
                        handleView={this.handleView}
                        permissionView=""
                        handleEdit={this.handleEdit}
                        permissionEdit="Pages.Tenants.Edit"
                        handleDelete={this.onShowDelete}
                        permissionDelete="Pages.Tenants.Delete"
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
                <CreateOrEditTenant
                    formRef={this.state.createOrEditTenant}
                    visible={this.state.modalVisible}
                    modalType={this.state.tenantId === 0 ? 'Thêm mới tenant' : 'Cập nhật tenant'}
                    tenantId={this.state.tenantId}
                    onCancel={async () => {
                        this.setState({
                            modalVisible: false
                        });
                        await this.getAll();
                    }}
                    onOk={this.handleCreate}
                />
                <ConfirmDelete
                    isShow={this.state.isShowConfirmDelete}
                    onOk={this.onOkDelete}
                    onCancel={this.onShowDelete}></ConfirmDelete>
                <ChooseImpersonateToTenant
                    tenantId={this.state.selectedRowId}
                    visible={this.state.visiableImperonate}
                    onCancel={() => {
                        this.setState({ visiableImperonate: !this.state.visiableImperonate });
                    }}></ChooseImpersonateToTenant>
                <TenantHistoryActivityModal
                    tenantId={this.state.selectedRowId}
                    tenantName={this.state.tenantName}
                    visible={this.state.visiableHistoryActivity}
                    onCancel={() => {
                        this.onShowTenantHistoryActivity();
                    }}
                />
            </Box>
        );
    }
}

export default TenantScreen;
