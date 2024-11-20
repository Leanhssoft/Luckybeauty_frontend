/* eslint-disable @typescript-eslint/no-explicit-any */
import { Grid, Box, Typography, SelectChangeEvent } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useEffect, useState, useRef } from 'react';
import { Edit, DeleteForever } from '@mui/icons-material';
import { TextTranslate } from '../../../components/TableLanguage';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { ParamSearchDto } from '../../../services/dto/ParamSearchDto';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import { PropConfirmOKCancel } from '../../../utils/PropParentToChild';
import ModalChuyenTienSMS from './components/modal_chuyen_tien_sms';
import LichSuNap_ChuyenTienService from '../../../services/sms/lich_su_nap_tien/LichSuNap_ChuyenTienService';
import { INhatKyChuyenTienDto } from '../../../services/sms/lich_su_nap_tien/ILichSuNap_ChuyenTienDto';
import { format } from 'date-fns';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import utils from '../../../utils/utils';
import ActionViewEditDelete from '../../../components/Menu/ActionViewEditDelete';
import { IList } from '../../../services/dto/IList';
import abpCustom from '../../../components/abp-custom';

export default function PageNhatKyChuyenTien({ isShowModalAdd, txtSearch, onCloseModal }: any) {
    const firstLoad = useRef(true);

    const [idNhatKyNapTien, setIdNhatKyNapTien] = useState('');
    const [isShowModalChuyenTien, setIsShowModalChuyenTien] = useState(false);
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPage, setTotalPage] = useState(0);

    const [allNhatKy, setAllNhatKy] = useState<INhatKyChuyenTienDto[]>([]);
    const [lstSearch, setLstSearch] = useState<INhatKyChuyenTienDto[]>([]);

    const [paramSearch, setParamSearch] = useState<ParamSearchDto>(new ParamSearchDto({ currentPage: 1 }));
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const [objConfirmDelete, setObjConfirmDelete] = useState<PropConfirmOKCancel>(
        new PropConfirmOKCancel({ show: false })
    );

    useEffect(() => {
        setParamSearch({
            ...paramSearch,
            textSearch: txtSearch
        });
    }, [txtSearch]);

    useEffect(() => {
        setIdNhatKyNapTien('');
        setIsShowModalChuyenTien(isShowModalAdd);
    }, [isShowModalAdd]);

    const GetAllNhatKyChuyenTien = async () => {
        const data = await LichSuNap_ChuyenTienService.GetAllNhatKyChuyenTien({
            currentPage: 0,
            pageSize: 500,
            textSearch: ''
        } as ParamSearchDto);
        setAllNhatKy(data.items);
        setLstSearch(data.items);
        setTotalCount(data.totalCount);
        setTotalPage(data.totalPage);
    };

    const SearchPage_atClient = (txtSearch: string) => {
        let arr = [];
        if (!utils.checkNull(txtSearch)) {
            const txt = txtSearch?.trim()?.toLocaleLowerCase() ?? '';
            const txtUnsign = utils.strToEnglish(txt);
            arr = allNhatKy.filter(
                (x) =>
                    (x.userNhanTien !== null && x.userNhanTien.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.userChuyenTien !== null && x.userChuyenTien.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.loaiPhieu !== null && x.loaiPhieu.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.noiDungChuyen_Nhan !== null && x.noiDungChuyen_Nhan.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.soTienChuyen_Nhan !== null && x.soTienChuyen_Nhan.toString().indexOf(txt) > -1) ||
                    (x.userNhanTien !== null && utils.strToEnglish(x.userNhanTien).indexOf(txtUnsign) > -1) ||
                    (x.userChuyenTien !== null && utils.strToEnglish(x.userChuyenTien).indexOf(txtUnsign) > -1) ||
                    (x.loaiPhieu !== null && utils.strToEnglish(x.loaiPhieu).indexOf(txtUnsign) > -1) ||
                    (x.noiDungChuyen_Nhan !== null && utils.strToEnglish(x.noiDungChuyen_Nhan).indexOf(txtUnsign) > -1)
            );
        } else {
            arr = [...allNhatKy];
        }
        setLstSearch([...arr]);

        setTotalCount(arr.length);
        setTotalPage(Math.ceil(arr.length / (paramSearch?.pageSize ?? 10)));
    };

    const PageLoad = async () => {
        await GetAllNhatKyChuyenTien();
        console.log('pagethutien');
    };

    useEffect(() => {
        PageLoad();
    }, []);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        SearchPage_atClient(paramSearch?.textSearch ?? '');
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
    const handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        const pageSizeNew = parseInt(event.target.value.toString());

        setParamSearch({
            ...paramSearch,
            currentPage: 1,
            pageSize: pageSizeNew
        });
        setTotalPage(Math.ceil(lstSearch.length / pageSizeNew));
    };

    const doActionRow = (action: number, item: INhatKyChuyenTienDto) => {
        setIdNhatKyNapTien(item.id);
        switch (action) {
            case 1:
                {
                    setIsShowModalChuyenTien(true);
                }
                break;
            case 2:
                setObjConfirmDelete({
                    ...objConfirmDelete,
                    show: true,
                    mes: `Bạn có chắc chắn muốn xóa phiếu ${item.loaiPhieu} này không?`
                });
                break;
        }
    };

    const deleteUser = async () => {
        const data = await LichSuNap_ChuyenTienService.XoaLichSuNapTien_byId(idNhatKyNapTien);
        if (data) {
            setObjAlert({ ...objAlert, show: true, mes: 'Xóa thành công', type: 1 });
        }
        setObjConfirmDelete({
            ...objConfirmDelete,
            show: false
        });
        const lstSearchNew = lstSearch.filter((x) => x.id !== idNhatKyNapTien);
        setAllNhatKy(allNhatKy.filter((x) => x.id !== idNhatKyNapTien));
        setLstSearch([...lstSearchNew]);

        setTotalCount(totalCount - 1);
        setTotalPage(Math.ceil(lstSearchNew.length / (paramSearch?.pageSize ?? 10)));
    };

    const saveChuyenTienOK = async () => {
        setIsShowModalChuyenTien(false);
        await GetAllNhatKyChuyenTien();
        onCloseModal();
    };

    const columns = [
        {
            field: 'userChuyenTien',
            headerName: 'User chuyển tiền',
            flex: 1,
            renderHeader: (params) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{params.value}</Box>
        },
        {
            field: 'userNhanTien',
            headerName: 'User nhận tiền',
            flex: 1,
            renderHeader: (params) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{params.value}</Box>
        },
        {
            field: 'soTienChuyen_Nhan',
            headerName: 'Số tiền',
            headerAlign: 'right',
            align: 'right',
            flex: 0.6,
            renderHeader: (params) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{new Intl.NumberFormat('vi-VN').format(params.value)}</Box>
        },
        {
            field: 'loaiPhieu',
            headerName: 'Loại phiếu',
            flex: 1,
            renderHeader: (params) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{params.value}</Box>
        },
        {
            field: 'noiDungChuyen_Nhan',
            headerName: 'Ghi chú',
            flex: 1,
            renderHeader: (params) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
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
            field: 'creationTime',
            headerName: 'Ngày tạo',
            headerAlign: 'center',
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
                    <Typography variant="body2">{format(new Date(params.value), 'dd/MM/yyyy HH:mm')}</Typography>
                </Box>
            )
        },
        {
            field: '#',
            headerName: '#',
            headerAlign: 'center',
            align: 'center',
            flex: 0.4,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) =>
                params.row.idPhieuNapTien == null && (
                    <ActionViewEditDelete
                        lstOption={
                            [
                                {
                                    id: '1',
                                    text: 'Sửa',
                                    isShow: abpCustom.isGrandPermission('Pages.Brandname.ChuyenTien.Edit'),
                                    icon: <Edit sx={{ color: '#009EF7' }} />
                                },
                                {
                                    id: '2',
                                    text: 'Xóa',
                                    color: '#F1416C',
                                    isShow: abpCustom.isGrandPermission('Pages.Brandname.ChuyenTien.Delete'),
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
            <ModalChuyenTienSMS
                visiable={isShowModalChuyenTien}
                idNhatKyNapTien={idNhatKyNapTien}
                onClose={() => {
                    setIsShowModalChuyenTien(false);
                    onCloseModal();
                }}
                onOk={saveChuyenTienOK}
            />
            <Grid container paddingTop={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box className="page-box-right">
                        <Box>
                            <DataGrid
                                rowHeight={46}
                                autoHeight={totalCount === 0}
                                className="data-grid-row"
                                columns={columns}
                                rows={lstSearch.slice(fromItem, toItem)}
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
                            handlePerPageChange={handlePerPageChange}
                            handlePageChange={handlePageChange}
                        />
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}
