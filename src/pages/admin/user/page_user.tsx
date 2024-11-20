import { Grid, Box, Stack, Typography, SelectChangeEvent, Avatar } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useEffect, useRef, useState } from 'react';
import { Edit, DeleteForever } from '@mui/icons-material';
import { TextTranslate } from '../../../components/TableLanguage';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { ParamSearchDto } from '../../../services/dto/ParamSearchDto';
import ModalAddUser from './components/modal_add_user';
import { SuggestNhanSuDto } from '../../../services/suggests/dto/SuggestNhanSuDto';
import { ChiNhanhDto } from '../../../services/chi_nhanh/Dto/chiNhanhDto';
import { GetRoles } from '../../../services/user/dto/getRolesOuput';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import { PropConfirmOKCancel } from '../../../utils/PropParentToChild';
import chiNhanhService from '../../../services/chi_nhanh/chiNhanhService';
import { PagedRequestDto } from '../../../services/dto/pagedRequestDto';
import userService from '../../../services/user/userService';
import SuggestService from '../../../services/suggests/SuggestService';
import ActionViewEditDelete from '../../../components/Menu/ActionViewEditDelete';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import { IUserProfileDto } from '../../../services/user/dto/ProfileDto';
import utils from '../../../utils/utils';
import { IOSSwitch } from '../../../components/Switch/IOSSwitch';
import nhanVienService from '../../../services/nhan-vien/nhanVienService';
import { Guid } from 'guid-typescript';
import { IList } from '../../../services/dto/IList';
import abpCustom from '../../../components/abp-custom';

export default function PageUser({ isShowModalAdd, txtSearch, onCloseModal }: any) {
    const firstLoad = useRef(true);
    const [userId, setUserId] = useState(0);
    const [avatar, setAvatar] = useState('');
    const [isShowModalAddUser, setIsShowModalAddUser] = useState(false);
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const [allUser, setAllUser] = useState<IUserProfileDto[]>([]);
    const [userUpdate, setUserUpdate] = useState<IUserProfileDto>({} as IUserProfileDto);
    const [listSearchUser, setListSearchUser] = useState<IUserProfileDto[]>([]);
    const [allNhanVien, setAllNhanVien] = useState<SuggestNhanSuDto[]>([]);
    const [allChiNhanh, setAllChiNhanh] = useState<ChiNhanhDto[]>([]);
    const [allRole, setAllRole] = useState<GetRoles[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [objConfirmDelete, setObjConfirmDelete] = useState<PropConfirmOKCancel>(
        new PropConfirmOKCancel({ show: false })
    );
    const [paramSearch, setParamSearch] = useState<ParamSearchDto>(
        new ParamSearchDto({ textSearch: '', currentPage: 1, pageSize: 10 })
    );

    useEffect(() => {
        setParamSearch({
            ...paramSearch,
            textSearch: txtSearch
        });
    }, [txtSearch]);

    useEffect(() => {
        setUserId(0);
        setIsShowModalAddUser(isShowModalAdd);
        setUserUpdate({} as IUserProfileDto);
    }, [isShowModalAdd]);

    const getAllChiNhanh = async () => {
        const data = await chiNhanhService.GetAll({
            keyword: '',
            maxResultCount: 100,
            skipCount: 0
        } as PagedRequestDto);
        if (data) {
            setAllChiNhanh(data.items);
        }
    };

    const getAllRole = async () => {
        const allRole = await userService.getRoles();
        setAllRole(allRole);
    };

    const getAllNhanVien = async () => {
        const allRole = await SuggestService.SuggestNhanSu();
        setAllNhanVien(allRole);
    };

    const getAllUser = async () => {
        // get all user && paging at client
        const data = await userService.GetAllUser({
            maxResultCount: 500,
            skipCount: paramSearch?.currentPage ?? 1,
            keyword: paramSearch?.textSearch ?? ''
        });
        setAllUser([...data.items]);
        setListSearchUser([...data.items]);
        setTotalCount(data.totalCount);
        setTotalPage(data.totalPage);
    };

    const PageLoad = async () => {
        await getAllChiNhanh();
        await getAllRole();
        await getAllNhanVien();
        await getAllUser();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    const SearchUser_atClient = (txtSearch: string) => {
        let arr = [];
        if (!utils.checkNull(txtSearch)) {
            const txt = txtSearch?.trim()?.toLocaleLowerCase() ?? '';
            const txtUnsign = utils.strToEnglish(txt);
            arr = allUser.filter(
                (x) =>
                    (x.userName !== null && x.userName.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.name !== null && x.name.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.surname !== null && x.surname.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.roleNames !== null && x.roleNames.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.emailAddress !== null && x.emailAddress.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.tenNhanVien !== null && x.tenNhanVien.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.tenChiNhanh !== null && x.tenChiNhanh.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.userName !== null && utils.strToEnglish(x.userName).indexOf(txtUnsign) > -1) ||
                    (x.name !== null && utils.strToEnglish(x.name).indexOf(txtUnsign) > -1) ||
                    (x.surname !== null && utils.strToEnglish(x.surname).indexOf(txtUnsign) > -1) ||
                    (x.tenNhanVien !== null && utils.strToEnglish(x.tenNhanVien).indexOf(txtUnsign) > -1) ||
                    (x.tenChiNhanh !== null && utils.strToEnglish(x.tenChiNhanh).indexOf(txtUnsign) > -1) ||
                    (x.roleNames !== null && utils.strToEnglish(x.roleNames).indexOf(txtUnsign) > -1) ||
                    (x.emailAddress !== null && utils.strToEnglish(x.emailAddress).indexOf(txtUnsign) > -1)
            );
        } else {
            arr = [...allUser];
        }
        setListSearchUser([...arr]);

        // search: alway reset currentPage to 0
        setTotalCount(arr.length);
        setTotalPage(Math.ceil(arr.length / (paramSearch?.pageSize ?? 10)));
    };

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        SearchUser_atClient(paramSearch?.textSearch ?? '');
    }, [paramSearch.textSearch]);

    const currentPageClient = (paramSearch?.currentPage ?? 0) > 0 ? (paramSearch?.currentPage ?? 0) - 1 : 0;
    const fromItem = totalCount == 0 ? 0 : currentPageClient * (paramSearch?.pageSize ?? 0);
    const toItem = totalCount == 0 ? 0 : fromItem + (paramSearch?.pageSize ?? 0);

    const handlePageChange = async (event: any, value: number) => {
        setParamSearch({
            ...paramSearch,
            currentPage: value
        });
    };
    const changePageSize = async (event: SelectChangeEvent<number>) => {
        const pageSizeNew = parseInt(event.target.value.toString());
        setParamSearch({
            ...paramSearch,
            currentPage: 1,
            pageSize: pageSizeNew
        });
        setTotalPage(Math.ceil(listSearchUser.length / pageSizeNew));
    };

    const changeTrangThai = async (userId: number, nhanSuId: string | null, e: React.ChangeEvent<HTMLInputElement>) => {
        const check = e.target.checked;
        const roleActive = abpCustom.isGrandPermission('Pages.Administration.Users.Unlock');
        if (!roleActive) {
            setObjAlert({
                ...objAlert,
                show: true,
                mes: `Bạn không có quyền ${check ? 'kích hoạt' : 'ngừng kích hoạt'} nhân viên`,
                type: 2
            });
            return;
        }

        let data = false;
        let mes = '';
        if (check) {
            // check nhanvien was delete
            if (!utils.checkNull(nhanSuId)) {
                const nvien = await nhanVienService.getNhanSu(nhanSuId as string);
                if (!nvien?.id || nvien?.id === Guid.EMPTY) {
                    setObjAlert({
                        ...objAlert,
                        show: true,
                        mes: 'Nhân viên đã ngừng hoạt động. Vui lòng kích hoạt lại nhân viên',
                        type: 2
                    });
                    return;
                }
            }

            data = await userService.ActiveUser(userId);
            mes = 'Kích hoạt';
        } else {
            data = await userService.DeActivateUser(userId);
            mes = 'Ngừng kích hoạt';
        }

        if (data) {
            setObjAlert({ ...objAlert, show: true, mes: mes, type: 1 });
        } else {
            setObjAlert({ ...objAlert, show: true, mes: 'Xóa thành công', type: 1 });
        }
        setAllUser(
            allUser.map((x) => {
                if (x.id === userId) {
                    return { ...x, isActive: check };
                } else {
                    return x;
                }
            })
        );
        setListSearchUser(
            listSearchUser.map((x) => {
                if (x.id === userId) {
                    return { ...x, isActive: check };
                } else {
                    return x;
                }
            })
        );
    };

    const doActionRow = (action: number, item: IUserProfileDto) => {
        setUserId(item.id);
        switch (action) {
            case 1:
                {
                    setIsShowModalAddUser(true);
                    setAvatar(item?.avatar);
                    setUserUpdate(item);
                }
                break;
            case 2:
                setObjConfirmDelete({
                    ...objConfirmDelete,
                    show: true,
                    mes: `Bạn có chắc chắn muốn xóa user ${item.userName} không?`
                });
                break;
        }
    };

    const deleteUser = async () => {
        const deleteResult = await userService.delete(userId);
        if (deleteResult.success) {
            setObjAlert({ ...objAlert, show: true, mes: 'Xóa thành công', type: 1 });
        } else {
            setObjAlert({ ...objAlert, show: true, mes: 'Xóa thất bại', type: 2 });
        }
        setObjConfirmDelete({ ...objConfirmDelete, show: false });

        const lstSearchNew = listSearchUser.filter((x) => x.id !== userId);
        setAllUser(allUser.filter((x) => x.id !== userId));
        setListSearchUser([...lstSearchNew]);
        setTotalCount(totalCount - 1);
        setTotalPage(Math.ceil(lstSearchNew.length / (paramSearch?.pageSize ?? 10)));
    };

    const saveUserOK = () => {
        setIsShowModalAddUser(false);
        getAllUser();
        onCloseModal();
    };

    const columns = [
        {
            field: 'userName',
            headerName: 'Tên đăng nhập',
            minWidth: 120,
            flex: 0.8,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Stack direction={'row'} spacing={1}>
                    <Avatar src={params.row.avatar} alt="Avatar" style={{ width: 24, height: 24, marginRight: 8 }} />
                    <Typography
                        variant="body2"
                        sx={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            width: '100%'
                        }}>
                        {params.value}
                    </Typography>
                </Stack>
            )
        },
        {
            field: 'tenNhanVien',
            minWidth: 170,
            headerName: 'Tên nhân viên',
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{params.value}</Box>
        },
        {
            field: 'roleNames',
            headerName: 'Vai trò',
            minWidth: 100,
            flex: 0.8,
            renderHeader: (params) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{utils.Remove_LastComma(params.value)}</Box>
        },
        {
            field: 'emailAddress',
            headerName: 'Địa chỉ email',
            minWidth: 150,
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{params.value}</Box>
        },
        {
            field: 'tenChiNhanh',
            headerName: 'Chi nhánh mặc định',
            minWidth: 120,
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{params.value}</Box>
        },
        {
            field: 'isActive',
            headerName: 'Kích hoạt',
            headerAlign: 'center',
            align: 'center',
            flex: 0.8,
            minWidth: 80,
            renderCell: (params) => (
                <IOSSwitch
                    disabled={params.row.userName === 'admin' || params.row.isAdmin === true ? true : false}
                    value={params.row?.isActive}
                    checked={params.row?.isActive}
                    onChange={(e) => changeTrangThai(params.row.id, params.row.nhanSuId, e)}
                />
            ),
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
        },
        {
            field: 'creationTime',
            headerName: 'Ngày tạo',
            headerAlign: 'center',
            minWidth: 120,
            flex: 0.6,
            renderHeader: (params) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        justifyContent: 'center'
                    }}>
                    <Typography variant="body2">{new Date(params.value).toLocaleDateString('en-GB')}</Typography>
                </Box>
            )
        },
        {
            field: 'action',
            headerName: '#',
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            disableColumnMenu: true,
            flex: 0.5,
            renderCell: (params) => (
                <ActionViewEditDelete
                    lstOption={
                        [
                            {
                                id: '1',
                                text: 'Sửa',
                                color: '#009EF7',
                                isShow: abpCustom.isGrandPermission('Pages.Administration.Users.Edit'),
                                icon: <Edit sx={{ color: '#009EF7' }} />
                            },
                            {
                                id: '2',
                                text: 'Xóa',
                                color: '#F1416C',
                                isShow:
                                    params.row.isAdmin === true ||
                                    params.row.userName === 'admin' ||
                                    !abpCustom.isGrandPermission('Pages.Administration.Users.Delete')
                                        ? false
                                        : true,
                                icon: <DeleteForever sx={{ color: '#F1416C' }} />
                            }
                        ] as IList[]
                    }
                    handleAction={(action: number) => doActionRow(action, params.row)}
                />
            ),
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
        }
    ] as GridColDef[];

    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <ConfirmDelete
                isShow={objConfirmDelete.show}
                onOk={deleteUser}
                mes={objConfirmDelete.mes}
                onCancel={() => setObjConfirmDelete({ ...objConfirmDelete, show: false })}></ConfirmDelete>
            <ModalAddUser
                isShowModal={isShowModalAddUser}
                objUserUpdate={userUpdate}
                onCancel={() => {
                    setIsShowModalAddUser(false);
                    onCloseModal();
                }}
                dataNhanVien={allNhanVien}
                // chỉ lấy nhân viên chưa có tk đăng nhập
                // dataNhanVien={allNhanVien.filter(
                //     (xOut: SuggestNhanSuDto) =>
                //         !allUser
                //             ?.map((x: IUserProfileDto) => {
                //                 // get list nhansuId from allUser
                //                 return x.nhanSuId;
                //             })
                //             .includes(xOut.id)
                // )}
                dataChiNhanh={allChiNhanh}
                userId={userId}
                avatarNV={avatar}
                allRoles={allRole}
                onOk={saveUserOK}
            />
            <Grid container paddingTop={2} spacing={1}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box className="page-box-right">
                        <Box>
                            <DataGrid
                                rowHeight={46}
                                autoHeight={totalCount === 0}
                                className="data-grid-row"
                                columns={columns}
                                rows={listSearchUser.slice(fromItem, toItem)}
                                rowSelectionModel={rowSelectionModel || undefined}
                                onRowSelectionModelChange={(row) => {
                                    setRowSelectionModel(row);
                                }}
                                disableRowSelectionOnClick
                                checkboxSelection={false}
                                hideFooterPagination
                                hideFooter
                                localeText={TextTranslate}
                            />
                        </Box>
                        <CustomTablePagination
                            currentPage={paramSearch?.currentPage ?? 1}
                            rowPerPage={paramSearch?.pageSize ?? 10}
                            totalPage={totalPage}
                            totalRecord={totalCount}
                            handlePerPageChange={changePageSize}
                            handlePageChange={handlePageChange}
                        />
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}
