import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Stack, Button } from '@mui/material';
import { TextTranslate } from '../../../components/TableLanguage';
import { format as formatDate } from 'date-fns';
import { TypeAction } from '../../../lib/appconst';
import AnhLieuTrinhService from '../../../services/anh_lieu_trinh/AnhLieuTrinhService';
import { AnhLieuTrinhDto } from '../../../services/anh_lieu_trinh/AnhLieuTrinhDto';
import ModalAnhLieuTrinh from '../../anh_lieu_trinh/ModalAnhLieuTrinh';
import ActionRow2Button from '../../../components/DataGrid/ActionRow2Button';
import { PropConfirmOKCancel } from '../../../utils/PropParentToChild';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import ImgurAPI from '../../../services/ImgurAPI/ImgurAPI';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';

const TabAnhLieuTrinh: React.FC<{ khachHangId: string }> = (props) => {
    const { khachHangId } = props;
    const [pageDataAnhLieuTrinh, setPageDataAnhLieuTrinh] = useState<AnhLieuTrinhDto[]>([]);
    const [isShowModalAnhLieuTrinh, setIsShowModalAnhLieuTrinh] = useState(false);
    const [albumImg, setAlbumImg] = useState<AnhLieuTrinhDto>({} as AnhLieuTrinhDto);
    const [objDelete, setobjDelete] = useState<PropConfirmOKCancel>(new PropConfirmOKCancel({ show: false }));
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    useEffect(() => {
        GetAllAlbum_ofCustomer();
    }, []);
    const GetAllAlbum_ofCustomer = async () => {
        const data = await AnhLieuTrinhService.GetAllAlbum_ofCustomer(khachHangId);
        if (data != null) setPageDataAnhLieuTrinh(data);
    };

    const columns: GridColDef[] = [
        {
            field: 'albumName',
            headerName: 'Tên album',
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'creationTime',
            headerName: 'Ngày tạo',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Box title={params.value}>{formatDate(new Date(params.value), 'dd/MM/yyyy HH:mm')}</Box>
            )
        },
        {
            field: 'tongSoAnh',
            headerName: 'Tổng số ảnh',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Box title={params.value}>{new Intl.NumberFormat('vi-VN').format(params.value)}</Box>
            )
        },
        {
            field: 'actions',
            headerName: '#',
            headerAlign: 'center',
            maxWidth: 60,
            flex: 1,
            disableColumnMenu: true,
            sortable: false,
            renderCell: (params) => (
                <ActionRow2Button handleClickAction={(type: number) => doActionRow(type, params.row)} />
            ),
            renderHeader: (params) => <Box component={'span'}>{params.colDef.headerName}</Box>
        }
    ];

    const doActionRow = (type: number, rowItem: any) => {
        switch (type) {
            case TypeAction.UPDATE:
                {
                    showModalUpdateAlbum(rowItem);
                }
                break;
            case TypeAction.DELETE:
                {
                    setAlbumImg({ ...albumImg, albumName: rowItem?.albumName, id: rowItem?.id });
                    setobjDelete(
                        new PropConfirmOKCancel({
                            show: true,
                            title: 'Xác nhận xóa',
                            mes: `Bạn có chắc chắn muốn xóa album ${rowItem?.albumName ?? ' '} không?`
                        })
                    );
                }
                break;
        }
    };

    const RemoveAlbum = async () => {
        const allImages = await AnhLieuTrinhService.GetAllImage_inAlbum(albumImg?.id);
        for (let i = 0; i < allImages?.length; i++) {
            // remove from imngur
            const pathUrl = ImgurAPI.GetInforImage_fromDataImage(allImages[i]?.imageUrl);
            if (pathUrl != null) {
                await ImgurAPI.RemoveImage(pathUrl?.id);
            }
        }
        const data = await AnhLieuTrinhService.RemoveAlbum_byId(albumImg?.id);
        setobjDelete({ ...objDelete, show: false });
        if (data) {
            setObjAlert({ show: false, mes: 'Xóa thành công', type: 1 });
            await GetAllAlbum_ofCustomer();
        } else {
            setObjAlert({ show: false, mes: 'Xóa thất bại', type: 2 });
        }
    };

    const showModalUpdateAlbum = (rowItem: any) => {
        setAlbumImg({ ...albumImg, idKhachHang: khachHangId, id: rowItem?.id, albumName: rowItem?.albumName });
        setIsShowModalAnhLieuTrinh(true);
    };

    const showModalUploadImg = () => {
        setAlbumImg({ ...albumImg, idKhachHang: khachHangId, id: '' });
        setIsShowModalAnhLieuTrinh(true);
    };
    const saveOKAnhLieuTrinh = async (typeAction: number) => {
        setIsShowModalAnhLieuTrinh(false);
        await GetAllAlbum_ofCustomer();
    };

    return (
        <>
            <ModalAnhLieuTrinh
                isShowModal={isShowModalAnhLieuTrinh}
                objUpDate={albumImg}
                idUpdate={albumImg?.id}
                onClose={() => setIsShowModalAnhLieuTrinh(false)}
                onOK={saveOKAnhLieuTrinh}
            />
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <ConfirmDelete
                isShow={objDelete.show}
                title={objDelete.title}
                mes={objDelete.mes}
                onOk={RemoveAlbum}
                onCancel={() => setobjDelete({ ...objDelete, show: false })}></ConfirmDelete>
            <Box mt="24px" className="page-box-right">
                <Stack spacing={2}>
                    <Button variant="outlined" onClick={showModalUploadImg}>
                        Import ảnh liệu trình
                    </Button>
                </Stack>
                <Stack>
                    <DataGrid
                        sx={{ paddingTop: '20px' }}
                        disableRowSelectionOnClick
                        hideFooter
                        autoHeight
                        className="data-grid-row-full"
                        columns={columns}
                        rows={pageDataAnhLieuTrinh}
                        localeText={TextTranslate}
                    />
                </Stack>
            </Box>
        </>
    );
};
export default TabAnhLieuTrinh;
