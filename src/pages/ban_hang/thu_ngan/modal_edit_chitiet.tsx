import * as React from 'react';
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    Typography,
    DialogContent,
    TextField,
    Grid,
    Stack,
    Button,
    Box,
    Link,
    IconButton,
    ButtonGroup
} from '@mui/material';
import { Add, Remove, ExpandMore, ExpandLess, Close } from '@mui/icons-material';
import PageHoaDonChiTietDto from '../../../services/ban_hang/PageHoaDonChiTietDto';
import Utils from '../../../utils/utils'; // func common
import { NumericFormat } from 'react-number-format';
import HoaDonService from '../../../services/ban_hang/HoaDonService';
import ModalSearchProduct from '../../product/modal_search_product';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import ButtonOnlyIcon from '../../../components/Button/ButtonOnlyIcon';
import utils from '../../../utils/utils';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import nhatKyHoatDongService from '../../../services/nhat_ky_hoat_dong/nhatKyHoatDongService';
import { CreateNhatKyThaoTacDto } from '../../../services/nhat_ky_hoat_dong/dto/CreateNhatKyThaoTacDto';
import Cookies from 'js-cookie';
import { LoaiNhatKyThaoTac } from '../../../lib/appconst';
import { ModelHangHoaDto } from '../../../services/product/dto';
import HoaDonChiTietDto from '../../../services/ban_hang/HoaDonChiTietDto';
import NhanVienThucHienServices from '../../../services/nhan_vien_thuc_hien/NhanVienThucHienServices';

export const ConstFormNumber = {
    BAN_HANG: 1,
    CHI_TIET_GDV: 2,
    OTHER: 0
};

const ModalEditChiTietGioHang: React.FC<{
    maHoaDon?: string;
    isAddNewProduct?: boolean;
    isShow: boolean;
    formType: number;
    hoadonChiTiet: PageHoaDonChiTietDto[];
    handleSave: (lstCTAfter: PageHoaDonChiTietDto[]) => void;
    handleClose: () => void;
}> = ({
    maHoaDon = '', // used to save diary
    isAddNewProduct = false,
    isShow,
    formType = ConstFormNumber.BAN_HANG, // 1.form banhang, 0.other, 2. chitiet GDV
    hoadonChiTiet,
    handleSave,
    handleClose
}) => {
    const [isSave, setIsSave] = useState(false);

    const [lstCTHoaDon, setLstCTHoaDon] = useState<PageHoaDonChiTietDto[]>([]);
    const displayComponent =
        formType === ConstFormNumber.BAN_HANG || formType === ConstFormNumber.CHI_TIET_GDV ? false : true;

    const [itemVisibility, setItemVisibility] = useState<boolean[]>(lstCTHoaDon.map(() => false)); //expaned cthd
    const [showModalSeachProduct, setShowModalSeachProduct] = useState(false);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const toggleVisibility = (index: number) => {
        const updatedVisibility = [...itemVisibility];
        updatedVisibility[index] = !updatedVisibility[index];
        setItemVisibility(updatedVisibility);
    };

    useEffect(() => {
        setIsSave(false);
        const arr = hoadonChiTiet.map((ct: PageHoaDonChiTietDto) => {
            return {
                ...ct,
                laPTChietKhau: (ct?.ptChietKhau ?? 0) > 0 || (ct?.tienChietKhau ?? 0) === 0
            };
        });
        setLstCTHoaDon([...arr]);

        if (formType === ConstFormNumber.OTHER) {
            setLstCTHoaDon(
                hoadonChiTiet.map((item: PageHoaDonChiTietDto) => {
                    return {
                        ...item,
                        expanded: true
                    };
                })
            );
        } else {
            setItemVisibility([true]);
        }
    }, [isShow]);

    const handleChangeGiaBan = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
        setLstCTHoaDon(
            lstCTHoaDon.map((item) => {
                if (item.id === id) {
                    const giaBanNew = Utils.formatNumberToFloat(event.target.value);
                    let dongiaSauCK = item.donGiaSauCK;
                    let tienCK = item.tienChietKhau;
                    if ((item?.ptChietKhau ?? 0) > 0) {
                        tienCK = ((item?.ptChietKhau ?? 0) * giaBanNew) / 100;
                        dongiaSauCK = giaBanNew - tienCK;
                    } else {
                        tienCK = 0; // reset tienCK if change dongia
                        dongiaSauCK = giaBanNew;
                    }

                    return {
                        ...item,
                        tienChietKhau: tienCK,
                        donGiaSauCK: dongiaSauCK,
                        donGiaTruocCK: giaBanNew,
                        donGiaSauVAT: dongiaSauCK,
                        thanhTienTruocCK: giaBanNew * item.soLuong,
                        thanhTienSauCK: dongiaSauCK * item.soLuong,
                        thanhTienSauVAT: dongiaSauCK * item.soLuong
                    };
                } else {
                    return item;
                }
            })
        );
    };

    const handleChangeSoLuong = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        itemCTHD: PageHoaDonChiTietDto
    ) => {
        const sluongNew = Utils.formatNumberToFloat(event.target.value);
        const checkGDV = CheckGDV_SuDungQuaBuoi(itemCTHD, sluongNew);
        if (!checkGDV) {
            return;
        }

        setLstCTHoaDon(
            lstCTHoaDon.map((item) => {
                if (item.id === itemCTHD.id) {
                    const isSuDungDV = !utils.checkNull_OrEmpty(item?.idChiTietHoaDon ?? '');
                    return {
                        ...item,
                        soLuong: sluongNew,
                        thanhTienTruocCK: isSuDungDV ? 0 : sluongNew * item.donGiaTruocCK,
                        thanhTienSauCK: isSuDungDV ? 0 : sluongNew * (item?.donGiaSauCK ?? 0),
                        thanhTienSauVAT: isSuDungDV ? 0 : sluongNew * (item?.donGiaSauVAT ?? 0)
                    };
                } else {
                    return item;
                }
            })
        );
    };

    const CheckGDV_SuDungQuaBuoi = (itemCTHD: PageHoaDonChiTietDto, slNew: number) => {
        if (formType === ConstFormNumber.BAN_HANG && !utils.checkNull_OrEmpty(itemCTHD?.idChiTietHoaDon ?? '')) {
            if (slNew > (itemCTHD?.soLuongConLai ?? 0)) {
                setObjAlert({
                    ...objAlert,
                    show: true,
                    type: 2,
                    mes: `Dịch vụ ${itemCTHD.tenHangHoa} đã dùng đủ số buổi`
                });
                return false;
            }
        }
        return true;
    };

    const tangSoLuong = (itemCTHD: PageHoaDonChiTietDto) => {
        const checkGDV = CheckGDV_SuDungQuaBuoi(itemCTHD, itemCTHD.soLuong + 1);
        if (!checkGDV) {
            return;
        }

        setLstCTHoaDon(
            lstCTHoaDon.map((item) => {
                if (item.id === itemCTHD.id) {
                    const isSuDungDV = !utils.checkNull_OrEmpty(item?.idChiTietHoaDon ?? '');
                    const sluongNew = item.soLuong + 1;
                    return {
                        ...item,
                        soLuong: sluongNew,
                        thanhTienTruocCK: isSuDungDV ? 0 : sluongNew * (item?.donGiaTruocCK ?? 0),
                        thanhTienSauCK: isSuDungDV ? 0 : sluongNew * (item?.donGiaSauCK ?? 0),
                        thanhTienSauVAT: isSuDungDV ? 0 : sluongNew * (item?.donGiaSauVAT ?? 0)
                    };
                } else {
                    return item;
                }
            })
        );
    };
    const giamSoLuong = (id: string) => {
        setLstCTHoaDon(
            lstCTHoaDon.map((item) => {
                if (item.id === id) {
                    const sluongNew = item.soLuong > 0 ? item.soLuong - 1 : 0;
                    const isSuDungDV = !utils.checkNull_OrEmpty(item?.idChiTietHoaDon ?? '');
                    return {
                        ...item,
                        soLuong: sluongNew,
                        thanhTienTruocCK: isSuDungDV ? 0 : sluongNew * (item?.donGiaTruocCK ?? 0),
                        thanhTienSauCK: isSuDungDV ? 0 : sluongNew * (item?.donGiaSauCK ?? 0),
                        thanhTienSauVAT: isSuDungDV ? 0 : sluongNew * (item?.donGiaSauVAT ?? 0)
                    };
                } else {
                    return item;
                }
            })
        );
    };

    const changeLoaiChietKhau = (laPhanTramNew: boolean, idCTHD: string) => {
        setLstCTHoaDon(
            lstCTHoaDon.map((item: PageHoaDonChiTietDto) => {
                if (item.id === idCTHD) {
                    const laPhanTramOld = item?.laPTChietKhau;
                    const giaBan = item?.donGiaTruocCK ?? 0;

                    let ptCKNew = 0,
                        tienCKNew = item?.tienChietKhau ?? 0;
                    if (laPhanTramOld) {
                        if (!laPhanTramNew) {
                            // % to vnd
                            tienCKNew = ((item?.ptChietKhau ?? 0) * giaBan) / 100;
                        } else {
                            // keep %
                            ptCKNew = item?.ptChietKhau ?? 0;
                        }
                    } else {
                        if (laPhanTramNew) {
                            // vnd to %
                            ptCKNew = giaBan > 0 ? ((item?.tienChietKhau ?? 0) / giaBan) * 100 : 0;
                        }
                    }
                    const dongiasauCK = giaBan - tienCKNew;
                    return {
                        ...item,
                        laPTChietKhau: laPhanTramNew,
                        ptChietKhau: ptCKNew,
                        tienChietKhau: tienCKNew,
                        donGiaSauCK: dongiasauCK,
                        thanhTienSauCK: dongiasauCK * item.soLuong,
                        donGiaSauVAT: dongiasauCK,
                        thanhTienSauVAT: dongiasauCK * item.soLuong
                    };
                } else {
                    return item;
                }
            })
        );
    };

    const changeGtriChietKhau = (gtriCK: string, idCTHD: string) => {
        const gtriCKNew = Utils.formatNumberToFloat(gtriCK);
        setLstCTHoaDon(
            lstCTHoaDon.map((item: PageHoaDonChiTietDto) => {
                if (item.id === idCTHD) {
                    const laPtram = item.laPTChietKhau;
                    let tienCK = gtriCKNew;
                    if (laPtram) {
                        tienCK = (gtriCKNew * item.donGiaTruocCK) / 100;
                    }

                    const dongiasauCK = item.donGiaTruocCK - tienCK;
                    return {
                        ...item,
                        ptChietKhau: laPtram ? gtriCKNew : 0,
                        tienChietKhau: tienCK,
                        donGiaSauCK: dongiasauCK,
                        donGiaSauVAT: dongiasauCK,
                        thanhTienSauCK: dongiasauCK * item.soLuong,
                        thanhTienSauVAT: dongiasauCK * item.soLuong
                    };
                } else {
                    return item;
                }
            })
        );
    };

    const xoaChiTietHoaDon = (item: PageHoaDonChiTietDto) => {
        setLstCTHoaDon(lstCTHoaDon.filter((x: PageHoaDonChiTietDto) => x.id !== item.id));
    };

    const addNewChiTiet = (item: ModelHangHoaDto) => {
        const ctNew = new PageHoaDonChiTietDto({
            maHangHoa: item?.maHangHoa,
            tenHangHoa: item.tenHangHoa,
            idDonViQuyDoi: item.idDonViQuyDoi as undefined,
            idHangHoa: item.idHangHoa as undefined,
            idNhomHangHoa: item.idNhomHangHoa as undefined,
            giaBan: item.giaBan
        });
        const checkCT = lstCTHoaDon.filter((x: PageHoaDonChiTietDto) => x.idDonViQuyDoi === item.idDonViQuyDoi);
        if (checkCT.length === 0) {
            // unshift
            setLstCTHoaDon([ctNew, ...lstCTHoaDon]);
        } else {
            const sluongNew = checkCT[0].soLuong + 1;
            // don't remove: keep id at db
            setLstCTHoaDon(
                lstCTHoaDon.map((itemCT: PageHoaDonChiTietDto) => {
                    if (itemCT.id === checkCT[0].id) {
                        return {
                            ...itemCT,
                            soLuong: sluongNew,
                            thanhTienSauCK: (itemCT.donGiaSauCK ?? 0) * sluongNew,
                            thanhTienSauVAT: (itemCT.donGiaSauVAT ?? 0) * sluongNew
                        };
                    } else {
                        return itemCT;
                    }
                })
            );
        }
        setShowModalSeachProduct(false);
    };

    const closeModal = () => {
        setIsSave(false);
        handleClose();
    };

    const saveDiaryCTHD = async () => {
        let sDetailsOld = ' ';
        for (let i = 0; i < hoadonChiTiet?.length; i++) {
            const itFor = hoadonChiTiet[i];
            sDetailsOld += ` <br /> ${i + 1}. ${itFor?.tenHangHoa} (${itFor?.maHangHoa}): ${
                itFor?.soLuong
            } x  ${Intl.NumberFormat('vi-VN').format(itFor?.donGiaTruocCK)}  =  ${Intl.NumberFormat('vi-VN').format(
                itFor?.thanhTienSauCK ?? 0
            )}`;
        }
        sDetailsOld = '<br /> <b> Thông tin cũ: </b> ' + sDetailsOld;
        let sDetailsNew = '';
        for (let i = 0; i < lstCTHoaDon?.length; i++) {
            const itFor = lstCTHoaDon[i];
            sDetailsNew += ` <br /> ${i + 1}. ${itFor?.tenHangHoa} (${itFor?.maHangHoa}): ${
                itFor?.soLuong
            } x  ${Intl.NumberFormat('vi-VN').format(itFor?.donGiaTruocCK)}  =  ${Intl.NumberFormat('vi-VN').format(
                itFor?.thanhTienSauCK ?? 0
            )}`;
        }

        const diary = {
            idChiNhanh: Cookies.get('IdChiNhanh') ?? null,
            chucNang: `Danh mục hóa đơn`,
            noiDung: `${isAddNewProduct ? 'Thêm mới' : 'Cập nhật'} chi tiết hóa đơn ${maHoaDon}`,
            noiDungChiTiet: `<b> Thông tin mới: </b>  ${sDetailsNew} ${isAddNewProduct ? '' : `${sDetailsOld}`}`,
            loaiNhatKy: LoaiNhatKyThaoTac.UPDATE
        } as CreateNhatKyThaoTacDto;
        await nhatKyHoatDongService.createNhatKyThaoTac(diary);
    };

    const agrreGioHang = async () => {
        setIsSave(true);

        switch (formType) {
            case ConstFormNumber.BAN_HANG:
                handleSave(lstCTHoaDon);
                break;
            case ConstFormNumber.CHI_TIET_GDV:
                {
                    // only update/add 1 row
                    const objCT = { ...lstCTHoaDon[0] } as HoaDonChiTietDto;
                    const data = await HoaDonService.CreateOrUpdateCTHD_byIdChiTiet(objCT);
                    if (data != null) {
                        lstCTHoaDon[0].id = data.id;
                        await saveDiaryCTHD();

                        if (!isAddNewProduct) {
                            // update nvth
                            const ctOld = hoadonChiTiet[0];
                            if (
                                ctOld.soLuong !== objCT.soLuong ||
                                ctOld?.donGiaTruocCK !== objCT.donGiaTruocCK ||
                                ctOld?.donGiaSauCK !== objCT.donGiaSauCK
                            ) {
                                await NhanVienThucHienServices.UpdateTienChietKhau_forNhanVien_whenUpdateCTHD(
                                    hoadonChiTiet[0]?.id,
                                    hoadonChiTiet[0]?.soLuong
                                );
                            }
                        }
                        handleSave(lstCTHoaDon);
                    }
                }
                break;
            case ConstFormNumber.OTHER:
                {
                    // update all cthd + nvth
                    const dataSave = [...lstCTHoaDon];
                    dataSave.map((x: PageHoaDonChiTietDto, index: number) => {
                        x.stt = index + 1;
                    });
                    await HoaDonService.Update_ChiTietHoaDon(lstCTHoaDon, hoadonChiTiet[0]?.idHoaDon);
                    await saveDiaryCTHD();
                    handleSave(lstCTHoaDon);
                }
                break;
        }
    };

    return (
        <>
            <ModalSearchProduct
                isShow={showModalSeachProduct}
                handlClose={() => setShowModalSeachProduct(false)}
                handleChoseProduct={addNewChiTiet}
            />
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Dialog open={isShow} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle className="modal-title">
                    {isAddNewProduct ? 'Thêm chi tiết mới' : 'Chỉnh sửa giỏ hàng'}
                </DialogTitle>
                <IconButton
                    onClick={closeModal}
                    sx={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        '&:hover svg': {
                            filter: 'brightness(0) saturate(100%) invert(36%) sepia(74%) saturate(1465%) hue-rotate(318deg) brightness(94%) contrast(100%)'
                        }
                    }}>
                    <CloseIcon />
                </IconButton>
                <DialogContent sx={{ paddingTop: 0 }}>
                    {/* 1 row */}
                    {lstCTHoaDon?.map((ct: PageHoaDonChiTietDto, index: number) => (
                        <Grid
                            container
                            key={index}
                            padding="16px 0px"
                            borderBottom={!displayComponent ? '' : '1px dashed green'}
                            borderRadius={1}
                            marginBottom={!displayComponent ? 0 : '10px'}>
                            <Grid
                                item
                                xs={!displayComponent ? 0 : 2}
                                sm={!displayComponent ? 0 : 1}
                                md={!displayComponent ? 0 : 1}
                                lg={!displayComponent ? 0 : 1}
                                sx={{
                                    display: displayComponent ? '' : 'none'
                                }}>
                                <Close
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        color: 'red',
                                        padding: '8px',
                                        marginTop: '-10px'
                                    }}
                                    onClick={() => xoaChiTietHoaDon(ct)}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={!displayComponent ? 12 : 10}
                                sm={!displayComponent ? 12 : 11}
                                md={!displayComponent ? 12 : 11}
                                lg={!displayComponent ? 12 : 11}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={9} md={9} lg={9}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>
                                            <Typography
                                                title={ct?.tenHangHoa}
                                                sx={{
                                                    fontWeight: 600,
                                                    color: '#3B4758',
                                                    maxWidth: 'calc(100% - 48px)',
                                                    textOverflow: 'ellipsis',
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                {ct?.tenHangHoa}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={!displayComponent ? 12 : 10}
                                        sm={!displayComponent ? 3 : 1}
                                        md={!displayComponent ? 3 : 2}
                                        lg={!displayComponent ? 3 : 2}>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            justifyContent="end"
                                            height="100%"
                                            alignItems="center">
                                            <Typography
                                                sx={{
                                                    fontWeight: 500,
                                                    textAlign: 'right',
                                                    color: 'var(--color-main)'
                                                }}>
                                                {new Intl.NumberFormat('vi-VN').format(ct?.thanhTienSauCK ?? 0)}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    {/* // man hinh thu ngan: khong hien icon toogle  */}
                                    {displayComponent && (
                                        <Grid item xs={2} sm={1} md={1} lg={1}>
                                            <Box onClick={() => toggleVisibility(index)} sx={{ cursor: 'pointer' }}>
                                                <ExpandMore
                                                    sx={{
                                                        display: !itemVisibility[index] ? '' : 'none'
                                                    }}
                                                />
                                                <ExpandLess
                                                    sx={{
                                                        display: itemVisibility[index] ? '' : 'none'
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                    )}

                                    <Grid item xs={12} sm={7} md={7} lg={7}>
                                        <Stack direction="column" spacing={1}>
                                            <Typography variant="body2">Giá bán</Typography>

                                            <NumericFormat
                                                size="small"
                                                fullWidth
                                                disabled={!utils.checkNull_OrEmpty(ct?.idChiTietHoaDon ?? '')}
                                                value={ct.donGiaTruocCK}
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                customInput={TextField}
                                                onChange={(event) => handleChangeGiaBan(event, ct.id)}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={5} md={5} lg={5}>
                                        <Stack direction="column" spacing={1}>
                                            <Typography
                                                sx={{
                                                    textAlign: {
                                                        lg: 'center',
                                                        md: 'center',
                                                        xs: 'left'
                                                    }
                                                }}
                                                variant="body2">
                                                Số lượng
                                            </Typography>
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                sx={{ '& .btnIcon': { cursor: 'pointer' } }}>
                                                <ButtonOnlyIcon
                                                    icon={<Remove onClick={() => giamSoLuong(ct.id)} />}
                                                    style={{ width: 60, height: 37 }}
                                                />
                                                <TextField
                                                    size="small"
                                                    sx={{
                                                        ' input': {
                                                            textAlign: 'center'
                                                        }
                                                    }}
                                                    fullWidth
                                                    value={ct.soLuong}
                                                    onChange={(event) => handleChangeSoLuong(event, ct)}></TextField>
                                                <ButtonOnlyIcon
                                                    icon={<Add onClick={() => tangSoLuong(ct)} />}
                                                    style={{ width: 60, height: 37 }}
                                                />
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                    <Grid
                                        item
                                        lg={7}
                                        sm={7}
                                        md={7}
                                        xs={12}
                                        sx={{
                                            display: itemVisibility[index] ? '' : 'none'
                                        }}>
                                        <Stack direction="column" spacing={1}>
                                            <Stack direction="row" spacing={2} alignContent={'center'}>
                                                <Typography variant="body2">Chiết khấu</Typography>
                                                <Typography
                                                    variant="caption"
                                                    style={{
                                                        color: 'red',
                                                        display: (ct?.tienChietKhau ?? 0) > 0 ? '' : 'none'
                                                    }}>
                                                    -{new Intl.NumberFormat('vi-VN').format(ct?.tienChietKhau ?? 0)}
                                                </Typography>
                                            </Stack>

                                            <Stack direction={'row'} alignItems={'center'} spacing={1}>
                                                <NumericFormat
                                                    size="small"
                                                    fullWidth
                                                    disabled={!utils.checkNull_OrEmpty(ct?.idChiTietHoaDon ?? '')}
                                                    value={
                                                        (ct.ptChietKhau ?? 0) > 0 ? ct.ptChietKhau : ct.tienChietKhau
                                                    }
                                                    decimalSeparator=","
                                                    thousandSeparator="."
                                                    customInput={TextField}
                                                    onChange={(event) => changeGtriChietKhau(event.target.value, ct.id)}
                                                />
                                                <ButtonGroup>
                                                    <Button
                                                        disabled={!utils.checkNull_OrEmpty(ct?.idChiTietHoaDon)}
                                                        sx={{
                                                            bgcolor: ct.laPTChietKhau ? 'var(--color-main)' : '',
                                                            color: ct.laPTChietKhau ? 'white' : 'var(--color-main)',
                                                            '&:hover ': {
                                                                bgcolor: 'var(--color-main)',
                                                                color: 'white'
                                                            }
                                                        }}
                                                        onClick={() => changeLoaiChietKhau(true, ct.id)}>
                                                        %
                                                    </Button>
                                                    <Button
                                                        disabled={!utils.checkNull_OrEmpty(ct?.idChiTietHoaDon)}
                                                        sx={{
                                                            bgcolor: !ct.laPTChietKhau ? ' var(--color-main)' : '',
                                                            color: !ct.laPTChietKhau ? 'white' : 'var(--color-main)',
                                                            '&:hover ': {
                                                                bgcolor: 'var(--color-main)',
                                                                color: 'white'
                                                            }
                                                        }}
                                                        onClick={() => changeLoaiChietKhau(false, ct.id)}>
                                                        đ
                                                    </Button>
                                                </ButtonGroup>
                                            </Stack>
                                        </Stack>
                                    </Grid>

                                    <Grid
                                        item
                                        lg={5}
                                        sm={5}
                                        md={5}
                                        xs={12}
                                        sx={{
                                            display: itemVisibility[index] ? '' : 'none'
                                        }}>
                                        <Stack direction="column" spacing={1}>
                                            <Typography variant="body2">Giá bán mới</Typography>
                                            <NumericFormat
                                                size="small"
                                                disabled
                                                fullWidth
                                                sx={{
                                                    '& input': {
                                                        fontWeight: 500
                                                    }
                                                }}
                                                value={ct?.donGiaSauCK ?? 0}
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                customInput={TextField}
                                            />
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    ))}
                    <Grid container paddingTop={2}>
                        <Grid item xs={1} />
                        <Grid item xs={11}>
                            <Stack
                                style={{ display: displayComponent ? '' : 'none' }}
                                sx={{
                                    '& a': {
                                        color: 'var(--color-main)'
                                    }
                                }}>
                                <Link
                                    sx={{
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                    onClick={() => setShowModalSeachProduct(true)}>
                                    <Add />
                                    Thêm dịch vụ
                                </Link>
                            </Stack>
                        </Grid>
                    </Grid>

                    {/* end 1 row */}

                    <Grid item xs={12} md={12}>
                        <Stack spacing={1} direction={'row'} justifyContent={'flex-end'}>
                            <Button variant="outlined" className="button-outline" onClick={closeModal}>
                                Hủy
                            </Button>
                            <Button variant="contained" className="button-container" onClick={agrreGioHang}>
                                {formType === ConstFormNumber.BAN_HANG ? 'Đồng ý' : 'Lưu'}
                            </Button>
                        </Stack>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
};
export default ModalEditChiTietGioHang;
