import { FC, useEffect, useState } from 'react';
import { IHeaderTable, MyHeaderTable } from '../../components/Table/MyHeaderTable';
import {
    Button,
    Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import SearchIcon from '@mui/icons-material/Search';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import PageHoaDonChiTietDto from '../../services/ban_hang/PageHoaDonChiTietDto';
import utils from '../../utils/utils';
import HoaDonService from '../../services/ban_hang/HoaDonService';
import { LabelDisplayedRows } from '../../components/Pagination/LabelDisplayedRows';
import { TypeAction } from '../../lib/appconst';
import ModalEditChiTietGioHang from '../ban_hang/thu_ngan/modal_edit_chitiet';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import { PropConfirmOKCancel } from '../../utils/PropParentToChild';
import ModalSearchProduct from '../product/modal_search_product';
import { ModelHangHoaDto } from '../../services/product/dto';
import { Guid } from 'guid-typescript';
import fileDowloadService from '../../services/file-dowload.service';
import abpCustom from '../../components/abp-custom';

const TabChiTietHoaDon: FC<{
    idHoaDon: string;
    maHoaDon?: string;
    onChangeCTHD: (thanhTienSauVAT: number) => void;
}> = ({ idHoaDon, maHoaDon, onChangeCTHD }) => {
    const [txtSearchCTHD, setTxtSearchCTHD] = useState('');
    const [isShowEditGioHang, setIsShowEditGioHang] = useState(false);
    const [iShowModalProduct, setIsShowModalProduct] = useState(false);
    const [isAddNewChiTiet, setIsAddNewChiTiet] = useState(false);
    const [lstCTHD, setLstCTHD] = useState<PageHoaDonChiTietDto[]>([]);
    const [lstSearchCTHD, setLstSearchCTHD] = useState<PageHoaDonChiTietDto[]>([]);
    const [ctDoing, setCTDoing] = useState<PageHoaDonChiTietDto>({} as PageHoaDonChiTietDto);

    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [confirmDialog, setConfirmDialog] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1, // 1.remove customer, 2.change tabhoadon
        mes: ''
    });

    const roleEdit = abpCustom.isGrandPermission('Pages.GoiDichVu.EditChiTiet');

    const GetChiTietHoaDon_byIdHoaDon = async () => {
        if (!utils.checkNull(idHoaDon)) {
            const data = await HoaDonService.GetChiTietHoaDon_byIdHoaDon(idHoaDon);
            setLstCTHD(data);
            setLstSearchCTHD([...data]);
        }
    };

    const SearchCTHDClient = () => {
        if (!utils.checkNull(txtSearchCTHD)) {
            const txt = txtSearchCTHD.trim().toLowerCase();
            const txtUnsign = utils.strToEnglish(txt);
            const data = lstCTHD.filter(
                (x) =>
                    (x.maHangHoa !== null && x.maHangHoa.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.tenHangHoa !== null && x.tenHangHoa.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.maHangHoa !== null && utils.strToEnglish(x.maHangHoa).indexOf(txtUnsign) > -1) ||
                    (x.tenHangHoa !== null && utils.strToEnglish(x.tenHangHoa).indexOf(txtUnsign) > -1)
            );
            setLstSearchCTHD([...data]);
        } else {
            setLstSearchCTHD([...lstCTHD]);
        }
    };

    useEffect(() => {
        SearchCTHDClient();
    }, [txtSearchCTHD]);

    useEffect(() => {
        GetChiTietHoaDon_byIdHoaDon();
    }, [idHoaDon]);

    const CheckChiTietGDV_DaSuDung = async (idChiTiet: string) => {
        return await HoaDonService.CheckChiTietGDV_DaSuDung(idChiTiet);
    };
    const doActionRow = async (typeAction: number, item: PageHoaDonChiTietDto) => {
        switch (typeAction) {
            case TypeAction.UPDATE:
                {
                    const ctUpdate = await HoaDonService.GetChiTietHoaDon_byIdChiTiet(item.id);
                    if (ctUpdate != null) {
                        setCTDoing({ ...ctUpdate });
                        setIsShowEditGioHang(true);
                        setIsAddNewChiTiet(false);
                    }
                }
                break;
            case TypeAction.DELETE:
                {
                    const check = await CheckChiTietGDV_DaSuDung(item.id);
                    if (check) {
                        setObjAlert({
                            ...objAlert,
                            type: 2,
                            show: true,
                            mes: `Dịch vụ ${item.tenHangHoa} đã mang đi sử dụng. Không thể hủy`
                        });
                        return;
                    }

                    setCTDoing({ ...item });
                    setConfirmDialog({
                        ...confirmDialog,
                        show: true,
                        title: 'Xác nhận xóa',
                        mes: `Bạn có chắc chắn muốn xóa dịch vụ ${item.tenHangHoa} thuộc hóa đơn này không?`
                    });
                }
                break;
        }
    };

    const AgreeGioHang = async (lstCTAfter: PageHoaDonChiTietDto[]) => {
        setIsShowEditGioHang(false);

        const ctUpdate = lstCTAfter[0];
        if (isAddNewChiTiet) {
            setLstCTHD([...lstCTHD, ctUpdate]);
            setLstSearchCTHD([...lstCTHD, ctUpdate]);
            setObjAlert({ ...objAlert, show: true, mes: 'Thêm mới chi tiết hóa đơn thành công' });
        } else {
            setLstCTHD(
                lstCTHD?.map((x) => {
                    if (x.id === ctDoing.id) {
                        return {
                            ...x,
                            soLuong: ctUpdate.soLuong,
                            donGiaTruocCK: ctUpdate.donGiaTruocCK,
                            ptChietKhau: ctUpdate.ptChietKhau,
                            tienChietKhau: ctUpdate.tienChietKhau,
                            donGiaSauCK: ctUpdate.donGiaSauCK,
                            ptThue: ctUpdate.ptThue,
                            tienThue: ctUpdate.tienThue,
                            donGiaSauVAT: ctUpdate.donGiaSauVAT,
                            thanhTienTruocCK: ctUpdate.thanhTienTruocCK,
                            thanhTienSauCK: ctUpdate.thanhTienSauCK,
                            thanhTienSauVAT: ctUpdate.thanhTienSauVAT
                        };
                    } else {
                        return x;
                    }
                })
            );
            setLstSearchCTHD(
                lstSearchCTHD?.map((x) => {
                    if (x.id === ctDoing.id) {
                        return {
                            ...x,
                            soLuong: ctUpdate.soLuong,
                            donGiaTruocCK: ctUpdate.donGiaTruocCK,
                            ptChietKhau: ctUpdate.ptChietKhau,
                            tienChietKhau: ctUpdate.tienChietKhau,
                            donGiaSauCK: ctUpdate.donGiaSauCK,
                            ptThue: ctUpdate.ptThue,
                            tienThue: ctUpdate.tienThue,
                            donGiaSauVAT: ctUpdate.donGiaSauVAT,
                            thanhTienTruocCK: ctUpdate.thanhTienTruocCK,
                            thanhTienSauCK: ctUpdate.thanhTienSauCK,
                            thanhTienSauVAT: ctUpdate.thanhTienSauVAT
                        };
                    } else {
                        return x;
                    }
                })
            );

            setObjAlert({ ...objAlert, show: true, mes: 'Cập nhật chi tiết hóa đơn thành công' });
        }

        const dataHD = await HoaDonService.UpdateTongTienHoaDon_ifChangeCTHD(ctUpdate.idHoaDon);
        if (dataHD !== null) {
            onChangeCTHD(dataHD?.tongThanhToan);
        }
    };

    const onAgreeRemoveCTHD = async () => {
        const deleteOK = await HoaDonService.DeleteMultipleCTHD([ctDoing.id]);
        if (deleteOK) {
            setLstCTHD(lstCTHD?.filter((x) => x.id !== ctDoing.id));
            setLstSearchCTHD(lstSearchCTHD?.filter((x) => x.id !== ctDoing.id));
            setObjAlert({ ...objAlert, show: true, mes: `Xóa thành công chi tiết hóa đơn` });
            setConfirmDialog({ ...confirmDialog, show: false });

            if ((ctDoing?.thanhTienSauVAT ?? 0) > 0) {
                const dataHD = await HoaDonService.UpdateTongTienHoaDon_ifChangeCTHD(idHoaDon);
                if (dataHD !== null) {
                    onChangeCTHD(dataHD?.tongThanhToan);
                }
            }
        }
    };

    const choseProduct = (product: ModelHangHoaDto) => {
        const newCT = new PageHoaDonChiTietDto({
            id: Guid.create().toString(),
            idDonViQuyDoi: product?.idDonViQuyDoi as undefined,
            idHangHoa: product?.idHangHoa as undefined,
            maHangHoa: product?.maHangHoa ?? '',
            tenHangHoa: product?.tenHangHoa ?? '',
            giaBan: product?.giaBan ?? 0,
            soLuong: 1
        });
        newCT.idHoaDon = idHoaDon;
        newCT.stt = (lstCTHD?.length ?? 0) + 1;
        setCTDoing({ ...newCT });

        setIsShowModalProduct(false);
        setIsShowEditGioHang(true);
        setIsAddNewChiTiet(true);
    };

    const exportExcelHoaDon_byId = async () => {
        const data = await HoaDonService.ExportHoaDon_byId(idHoaDon);
        fileDowloadService.downloadExportFile(data);
    };

    const listColumnHeader: IHeaderTable[] = [
        { columnId: 'maHangHoa', columnText: 'Mã dịch vụ' },
        { columnId: 'tenHangHoa', columnText: 'Tên dịch vụ' },
        { columnId: 'soLuong', columnText: 'Số lượng' },
        { columnId: 'donGiaTruocCK', columnText: 'Đơn giá (trước CK)', align: 'right' },
        { columnId: 'tienChietKhau', columnText: 'Chiết khấu', align: 'right' },
        { columnId: 'thanhTienSauCK', columnText: 'Thành tiền', align: 'right' }
    ];
    return (
        <>
            <ModalEditChiTietGioHang
                maHoaDon={maHoaDon} // used to save diary
                formType={2} // 1.thungan, 0. ds hoason, 2. gdv
                isShow={isShowEditGioHang}
                isAddNewProduct={isAddNewChiTiet}
                hoadonChiTiet={[ctDoing]}
                handleSave={AgreeGioHang}
                handleClose={() => setIsShowEditGioHang(false)}
            />
            <ModalSearchProduct
                isShow={iShowModalProduct}
                handlClose={() => setIsShowModalProduct(false)}
                handleChoseProduct={choseProduct}
            />
            <ConfirmDelete
                isShow={confirmDialog.show}
                title={confirmDialog.title}
                mes={confirmDialog.mes}
                onOk={onAgreeRemoveCTHD}
                onCancel={() => setConfirmDialog({ ...confirmDialog, show: false })}
            />
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}
            />

            <Grid container spacing={2}>
                <Grid item lg={7} md={12} sm={12} xs={12}>
                    <Stack spacing={1} direction={'row'} alignItems={'center'}>
                        <TextField
                            size="small"
                            fullWidth
                            sx={{ flex: 3 }}
                            value={txtSearchCTHD}
                            placeholder="Tìm dịch vụ"
                            InputProps={{
                                startAdornment: <SearchIcon />
                            }}
                            onChange={(e) => setTxtSearchCTHD(e.target.value)}
                        />
                        <Button
                            sx={{
                                flex: 1,
                                display: abpCustom.isGrandPermission('Pages.GoiDichVu.Export') ? '' : 'none'
                            }}
                            variant="outlined"
                            fullWidth
                            startIcon={<FileUploadIcon />}
                            onClick={exportExcelHoaDon_byId}>
                            Xuất file
                        </Button>
                    </Stack>
                </Grid>
                <Grid item lg={5} md={12} sm={0} xs={12}></Grid>

                <Grid item lg={12}>
                    <TableContainer sx={{ overflow: 'auto', maxHeight: 420 }}>
                        <Table>
                            <TableHead>
                                <MyHeaderTable
                                    showAction={roleEdit}
                                    isCheckAll={false}
                                    isShowCheck={false}
                                    sortBy=""
                                    sortType="stt"
                                    onRequestSort={() => console.log('sort')}
                                    listColumnHeader={listColumnHeader}
                                />
                            </TableHead>
                            <TableBody>
                                {lstSearchCTHD?.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row?.maHangHoa}</TableCell>
                                        <TableCell
                                            className="lableOverflow"
                                            sx={{ maxWidth: 250, minWidth: 250 }}
                                            title={row?.tenHangHoa}>
                                            <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                                {/* <PersonAddOutlinedIcon
                                                    className="only-icon"
                                                    titleAccess="Chọn nhân viên thực hiện"
                                                /> */}
                                                <Typography variant="body2"> {row?.tenHangHoa}</Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="right">
                                            {new Intl.NumberFormat('vi-VN').format(row?.soLuong ?? 0)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {new Intl.NumberFormat('vi-VN').format(row?.donGiaTruocCK ?? 0)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {new Intl.NumberFormat('vi-VN').format(row?.tienChietKhau ?? 0)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {new Intl.NumberFormat('vi-VN').format(row?.thanhTienSauCK ?? 0)}
                                        </TableCell>
                                        {roleEdit && (
                                            <TableCell sx={{ minWidth: 40 }}>
                                                <Stack spacing={1} direction={'row'}>
                                                    <OpenInNewOutlinedIcon
                                                        titleAccess="Cập nhật"
                                                        className="only-icon"
                                                        sx={{ width: '16px', color: '#7e7979' }}
                                                        onClick={() => doActionRow(TypeAction.UPDATE, row)}
                                                    />
                                                    <ClearIcon
                                                        titleAccess="Xóa"
                                                        sx={{
                                                            ' &:hover': {
                                                                color: 'red',
                                                                cursor: 'pointer'
                                                            }
                                                        }}
                                                        style={{ width: '16px', color: 'red' }}
                                                        onClick={() => doActionRow(TypeAction.DELETE, row)}
                                                    />
                                                </Stack>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12}>
                    <Grid container paddingLeft={1} paddingRight={1}>
                        <Grid item lg={6}>
                            {roleEdit && (
                                <Stack
                                    direction={'row'}
                                    spacing={1}
                                    alignItems={'center'}
                                    sx={{
                                        textDecoration: 'underline',
                                        color: '#1976d2',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setIsShowModalProduct(true)}>
                                    <ControlPointIcon />
                                    <Typography>Thêm chi tiết mới</Typography>
                                </Stack>
                            )}
                        </Grid>
                        <Grid item lg={6}>
                            <Stack direction="row" justifyContent={'end'}>
                                <LabelDisplayedRows
                                    currentPage={1}
                                    pageSize={lstSearchCTHD?.length ?? 0}
                                    totalCount={lstSearchCTHD?.length ?? 0}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};
export default TabChiTietHoaDon;
