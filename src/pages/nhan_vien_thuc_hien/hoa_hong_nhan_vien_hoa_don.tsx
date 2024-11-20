import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    Grid,
    TextField,
    Stack,
    Avatar,
    DialogActions,
    Button,
    Radio,
    Popover
} from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import DialogButtonClose from '../../components/Dialog/ButtonClose';
import nhanVienService from '../../services/nhan-vien/nhanVienService';
import { PagedNhanSuRequestDto } from '../../services/nhan-vien/dto/PagedNhanSuRequestDto';
import { useContext, useEffect, useState, useRef } from 'react';
import NhanSuItemDto from '../../services/nhan-vien/dto/nhanSuItemDto';
import NhanVienThucHienDto from '../../services/nhan_vien_thuc_hien/NhanVienThucHienDto';
import { Search } from '@mui/icons-material';
import utils from '../../utils/utils';
import chietKhauHoaDonService from '../../services/hoa_hong/chiet_khau_hoa_don/chietKhauHoaDonService';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import { NumericFormat } from 'react-number-format';
import NhanVienThucHienServices from '../../services/nhan_vien_thuc_hien/NhanVienThucHienServices';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';

export default function HoaHongNhanVienHoaDon({
    iShow,
    onClose,
    doanhThu = 0,
    thucThu = 0,
    idHoaDon = '',
    idQuyHoaDon = ''
}: any) {
    const appContext = useContext(AppContext);
    const chinhanhCurrent = appContext.chinhanhCurrent;
    const idChiNhanh = chinhanhCurrent?.id;
    const [txtSearch, setTxtSearch] = useState('');
    const [lstNhanVien, setLstNhanVien] = useState<NhanSuItemDto[]>([]);
    const [allNhanVien, setAllNhanVien] = useState<NhanSuItemDto[]>([]);
    const [lstNVThucHien, setLstNhanVienChosed] = useState<NhanVienThucHienDto[]>([]);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [itemNVienFocus, setItemNVienFocus] = useState<NhanVienThucHienDto>({} as NhanVienThucHienDto);

    const GetListNhanVien = async () => {
        const data = await nhanVienService.getAll({
            filter: txtSearch,
            skipCount: 0,
            maxResultCount: 100
        } as PagedNhanSuRequestDto);
        setAllNhanVien([...data.items]);
        setLstNhanVien([...data.items]);
    };

    const GetNhanVienThucHien_byIdHoaDon = async () => {
        const data = await NhanVienThucHienServices.GetNhanVienThucHien_byIdHoaDon(idHoaDon, idQuyHoaDon);
        console.log('GetNhanVienThucHien_byIdHoaDon ', data);
        if (data != null && data.length > 0) {
            setLstNhanVienChosed(data);
        } else {
            setLstNhanVienChosed([]);
        }
    };

    useEffect(() => {
        GetListNhanVien();
    }, []);

    useEffect(() => {
        // get hoahongHD from db
        GetNhanVienThucHien_byIdHoaDon();
    }, [iShow]);

    const SearchNhanVienClient = () => {
        if (!utils.checkNull(txtSearch)) {
            const txt = txtSearch.trim().toLowerCase();
            const txtUnsign = utils.strToEnglish(txt);
            const data = allNhanVien.filter(
                (x) =>
                    (x.maNhanVien !== null && x.maNhanVien.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.tenNhanVien !== null && x.tenNhanVien.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.soDienThoai !== null && x.soDienThoai.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.maNhanVien !== null && utils.strToEnglish(x.maNhanVien).indexOf(txtUnsign) > -1) ||
                    (x.tenNhanVien !== null && utils.strToEnglish(x.tenNhanVien).indexOf(txtUnsign) > -1) ||
                    (x.soDienThoai !== null && utils.strToEnglish(x.soDienThoai).indexOf(txtUnsign) > -1) ||
                    (x.tenChucVu !== null && utils.strToEnglish(x.tenChucVu).indexOf(txtUnsign) > -1)
            );
            setLstNhanVien(data);
        } else {
            setLstNhanVien([...allNhanVien]);
        }
    };

    useEffect(() => {
        SearchNhanVienClient();
    }, [txtSearch]);

    const ChoseNhanVien = async (item: NhanSuItemDto) => {
        const nvEX = lstNVThucHien.filter((x) => x.idNhanVien === item.id);
        if (nvEX.length > 0) {
            setObjAlert({ ...objAlert, show: true, mes: `Nhân viên ${item.tenNhanVien} đã được chọn` });
            return;
        }

        const newNV = new NhanVienThucHienDto({
            idNhanVien: item.id,
            maNhanVien: item.maNhanVien,
            tenNhanVien: item.tenNhanVien,
            soDienThoai: item.soDienThoai,
            gioiTinh: item.gioiTinh,
            avatar: item.avatar,
            loaiChietKhau: 1,
            ptChietKhau: 0,
            tienChietKhau: 0
        });
        const ckSetup = await chietKhauHoaDonService.GetHoaHongNVienSetup_theoLoaiChungTu(idChiNhanh, item.id, '1');
        if (ckSetup != null && ckSetup.length > 0) {
            const gtriSetup = ckSetup[0].giaTriCHietKhau ?? 0;
            switch (ckSetup[0].loaiChietKhau) {
                case 1: // % thucthu
                    {
                        newNV.ptChietKhau = gtriSetup;
                        newNV.tienChietKhau = (gtriSetup * thucThu) / 100;
                    }
                    break;
                case 2: // % doanhthu
                    {
                        newNV.ptChietKhau = gtriSetup;
                        newNV.tienChietKhau = (gtriSetup * doanhThu) / 100;
                    }
                    break;
                case 3: // vnd
                    {
                        newNV.ptChietKhau = 0;
                        newNV.tienChietKhau = gtriSetup;
                    }
                    break;
            }
            newNV.loaiChietKhau = ckSetup[0].loaiChietKhau;
        }
        setLstNhanVienChosed([newNV, ...lstNVThucHien]);
    };

    const removeNVienChosed = (nv: NhanVienThucHienDto) => {
        setLstNhanVienChosed(lstNVThucHien.filter((x: NhanVienThucHienDto) => x.idNhanVien !== nv.idNhanVien));
    };

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const openDivChietKhau = Boolean(anchorEl);
    const handleClick = (event: any, nvien: NhanVienThucHienDto) => {
        setAnchorEl(event.currentTarget);
        setItemNVienFocus(nvien);
    };

    const changeLoaiChietKhau = (loaiChietKhau: number) => {
        setLstNhanVienChosed(
            lstNVThucHien.map((x: NhanVienThucHienDto) => {
                if (x.idNhanVien === itemNVienFocus.idNhanVien) {
                    let ckNew = x.tienChietKhau;
                    let ptChietKhau = x.ptChietKhau;
                    switch (loaiChietKhau) {
                        case 1:
                            {
                                // chuyen tu vnd -->% thucthu
                                if (x.loaiChietKhau === 3) {
                                    ptChietKhau = (ckNew / thucThu) * 100;
                                } else {
                                    ckNew = (x.ptChietKhau * thucThu) / 100;
                                }
                            }
                            break;
                        case 2: // chuyen tu vnd -->% doanhthu
                            {
                                if (x.loaiChietKhau === 3) {
                                    ptChietKhau = (ckNew / doanhThu) * 100;
                                } else {
                                    ckNew = (x.ptChietKhau * doanhThu) / 100;
                                }
                            }
                            break;
                        case 3:
                            ckNew = x.tienChietKhau;
                            break;
                    }
                    setItemNVienFocus({
                        ...itemNVienFocus,
                        loaiChietKhau: loaiChietKhau,
                        ptChietKhau: ptChietKhau,
                        tienChietKhau: ckNew
                    });
                    return { ...x, loaiChietKhau: loaiChietKhau, ptChietKhau: ptChietKhau, tienChietKhau: ckNew };
                } else {
                    return x;
                }
            })
        );
    };

    const changePTramChietKhau = (gtriNew: string) => {
        let gtriPtram = utils.formatNumberToFloat(gtriNew);

        setLstNhanVienChosed(
            lstNVThucHien.map((x: NhanVienThucHienDto) => {
                if (x.idNhanVien === itemNVienFocus.idNhanVien) {
                    let ckNew = x.tienChietKhau;
                    switch (x.loaiChietKhau) {
                        case 1:
                            ckNew = (gtriPtram * thucThu) / 100;
                            break;
                        case 2:
                            ckNew = (gtriPtram * doanhThu) / 100;
                            break;
                        case 3:
                            {
                                ckNew = gtriPtram;
                                gtriPtram = 0;
                            }
                            break;
                    }
                    setItemNVienFocus({ ...itemNVienFocus, ptChietKhau: gtriPtram, tienChietKhau: ckNew });
                    return { ...x, ptChietKhau: gtriPtram, tienChietKhau: ckNew };
                } else {
                    return x;
                }
            })
        );
    };

    const changeTienChietKhau = (gtriNew: string, nv: NhanVienThucHienDto) => {
        const tienCK = utils.formatNumberToFloat(gtriNew);
        setLstNhanVienChosed(
            lstNVThucHien.map((x: NhanVienThucHienDto) => {
                if (x.idNhanVien === nv.idNhanVien) {
                    let ptCK = 0;
                    switch (x.loaiChietKhau) {
                        case 1:
                            ptCK = (tienCK / thucThu) * 100;
                            break;
                        case 2:
                            ptCK = (tienCK / doanhThu) * 100;
                            break;
                        case 3:
                            ptCK = 0;
                            break;
                    }
                    setItemNVienFocus({ ...itemNVienFocus, ptChietKhau: ptCK, tienChietKhau: tienCK });
                    return { ...x, ptChietKhau: ptCK, tienChietKhau: tienCK };
                } else {
                    return x;
                }
            })
        );
    };

    const removeAllNVienChosed = () => {
        setLstNhanVienChosed([]);
    };
    const refTienChietKhau: any = useRef([]);
    const gotoNextTienChietKhau = (e: React.KeyboardEvent<HTMLDivElement>, targetElem: any) => {
        if (e.key === 'Enter' && targetElem) {
            targetElem.focus();
        }
    };

    const saveHoaHongHD = async () => {
        if (utils.checkNull(idQuyHoaDon)) {
            await NhanVienThucHienServices.UpdateNhanVienThucHienn_byIdHoaDon(idHoaDon, lstNVThucHien);
        } else {
            await NhanVienThucHienServices.UpdateNVThucHien_byIdQuyHoaDon(idHoaDon, idQuyHoaDon, lstNVThucHien);
        }
        setObjAlert({ ...objAlert, mes: 'Cập nhật hoa hồng hóa đơn thành công', show: true, type: 1 });
        onClose();
    };

    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Dialog open={iShow} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Typography className="modal-title">Hoa hồng theo hóa đơn</Typography>
                    <DialogButtonClose onClose={onClose} />
                </DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={8}>
                            <Stack flex={4} fontSize={14}>
                                <Stack
                                    direction={'row'}
                                    justifyContent={'center'}
                                    sx={{
                                        // background: 'antiquewhite',
                                        padding: '10px',
                                        borderRadius: '4px'
                                    }}>
                                    <Stack direction={'row'} spacing={1} flex={1}>
                                        <Stack>Doanh thu</Stack>
                                        <Stack sx={{ fontWeight: '600' }}>
                                            {new Intl.NumberFormat('vi-VN').format(doanhThu)}
                                        </Stack>
                                    </Stack>
                                    <Stack direction={'row'} spacing={1} flex={1}>
                                        <Stack>Thực thu</Stack>
                                        <Stack sx={{ fontWeight: '600' }}>
                                            {new Intl.NumberFormat('vi-VN').format(thucThu)}
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Stack spacing={1}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    label="Tìm kiếm"
                                    value={txtSearch}
                                    onChange={(event) => {
                                        setTxtSearch(event.target.value);
                                    }}
                                    InputProps={{
                                        startAdornment: <Search />
                                    }}
                                />
                                <Stack sx={{ overflow: 'auto', maxHeight: 400 }}>
                                    {lstNhanVien?.map((nvien: NhanSuItemDto, index: number) => (
                                        <Stack
                                            direction={'row'}
                                            spacing={1}
                                            key={index}
                                            sx={{ borderBottom: '1px dashed #cccc', padding: '8px' }}
                                            onClick={() => ChoseNhanVien(nvien)}>
                                            <Stack>
                                                {/* {utils.checkNull(nvien?.avatar) ? (
                                                    <BadgeFistCharOfName
                                                        firstChar={utils.getFirstLetter(nvien?.tenNhanVien ?? '')}
                                                    />
                                                ) : (
                                                    <Avatar sx={{ width: 40, height: 40 }} src={nvien?.avatar} />
                                                )} */}
                                                <Avatar
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        backgroundColor: 'var(--color-bg)',
                                                        color: 'var(--color-main)',
                                                        fontSize: '14px'
                                                    }}>
                                                    {utils.getFirstLetter(nvien?.tenNhanVien ?? '')}
                                                </Avatar>
                                            </Stack>
                                            <Stack justifyContent={'center'} spacing={1}>
                                                <Stack sx={{ fontSize: '14px', fontWeight: 500 }}>
                                                    {nvien?.tenNhanVien}
                                                </Stack>
                                                <Stack sx={{ fontSize: '12px', color: '#839bb1' }}>
                                                    {nvien?.tenChucVu}
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={8} sx={{ fontSize: '14px' }}>
                            <Stack>
                                <Stack
                                    direction={'row'}
                                    spacing={1}
                                    sx={{
                                        fontWeight: '600',
                                        padding: '10px',
                                        background: 'var(--color-header-table)'
                                    }}>
                                    <Stack flex={1}>STT</Stack>
                                    <Stack flex={5}>Nhân viên</Stack>
                                    <Stack flex={3}>Chiết khấu</Stack>
                                    <Stack flex={3}>Tiền được nhận</Stack>
                                    <Stack flex={1} alignItems={'end'}>
                                        <ClearOutlinedIcon sx={{ color: 'red' }} onClick={removeAllNVienChosed} />
                                    </Stack>
                                </Stack>
                                {lstNVThucHien?.map((nv: NhanVienThucHienDto, index: number) => (
                                    <Stack direction={'row'} spacing={1} padding={'10px'} key={index}>
                                        <Stack flex={1} alignItems={'center'}>
                                            {index + 1}
                                        </Stack>
                                        <Stack flex={5}>{nv.tenNhanVien}</Stack>
                                        <Stack flex={3} alignItems={'center'} sx={{ cursor: 'pointer' }}>
                                            <Stack sx={{ color: 'var(--color-main)' }}>
                                                <NumericFormat
                                                    fullWidth
                                                    size="small"
                                                    variant="standard"
                                                    thousandSeparator={'.'}
                                                    decimalSeparator={','}
                                                    onClick={(e: any) => handleClick(e, nv)}
                                                    value={nv.loaiChietKhau !== 3 ? nv.ptChietKhau : nv.tienChietKhau}
                                                    customInput={TextField}
                                                    InputProps={{
                                                        inputProps: {
                                                            style: { textAlign: 'right' }
                                                        }
                                                    }}
                                                    onChange={(e) => changePTramChietKhau(e.target.value)}
                                                />
                                            </Stack>

                                            <Popover
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'left'
                                                }}
                                                open={openDivChietKhau}
                                                anchorEl={anchorEl}
                                                onClose={() => setAnchorEl(null)}>
                                                <Stack padding={1}>
                                                    <Stack direction={'row'} padding={'8px'} alignItems={'center'}>
                                                        <Typography flex={4} fontSize={'13px'} fontWeight={600}>
                                                            Chiết khấu
                                                        </Typography>
                                                        <Stack flex={6}>
                                                            <NumericFormat
                                                                fullWidth
                                                                autoFocus
                                                                size="small"
                                                                variant="standard"
                                                                thousandSeparator={'.'}
                                                                decimalSeparator={','}
                                                                value={
                                                                    itemNVienFocus.loaiChietKhau !== 3
                                                                        ? itemNVienFocus.ptChietKhau
                                                                        : itemNVienFocus.tienChietKhau
                                                                }
                                                                customInput={TextField}
                                                                InputProps={{
                                                                    inputProps: {
                                                                        style: { textAlign: 'right' }
                                                                    }
                                                                }}
                                                                onChange={(e) => changePTramChietKhau(e.target.value)}
                                                            />
                                                        </Stack>
                                                    </Stack>
                                                    <Stack direction={'row'} spacing={1} fontSize={'13px'}>
                                                        <Stack direction={'row'} alignItems={'center'}>
                                                            <Radio
                                                                size="small"
                                                                checked={itemNVienFocus.loaiChietKhau === 1}
                                                                onClick={() => changeLoaiChietKhau(1)}
                                                            />
                                                            <Typography fontSize={'13px'} fontWeight={600}>
                                                                % Thực thu
                                                            </Typography>
                                                        </Stack>
                                                        <Stack direction={'row'} alignItems={'center'}>
                                                            <Radio
                                                                size="small"
                                                                checked={itemNVienFocus.loaiChietKhau === 2}
                                                                onClick={() => changeLoaiChietKhau(2)}
                                                            />
                                                            <Typography fontSize={'13px'} fontWeight={600}>
                                                                % Doanh thu
                                                            </Typography>
                                                        </Stack>
                                                        <Stack direction={'row'} alignItems={'center'}>
                                                            <Radio
                                                                size="small"
                                                                checked={itemNVienFocus.loaiChietKhau === 3}
                                                                onClick={() => changeLoaiChietKhau(3)}
                                                            />
                                                            <Typography fontSize={'13px'} fontWeight={600}>
                                                                VND
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                            </Popover>
                                        </Stack>
                                        <Stack flex={3} alignItems={'end'}>
                                            <NumericFormat
                                                fullWidth
                                                size="small"
                                                variant="standard"
                                                thousandSeparator={'.'}
                                                decimalSeparator={','}
                                                value={nv.tienChietKhau}
                                                customInput={TextField}
                                                InputProps={{
                                                    inputProps: {
                                                        style: { textAlign: 'right' }
                                                    }
                                                }}
                                                onChange={(e: any) => {
                                                    changeTienChietKhau(e.target.value, nv);
                                                }}
                                                inputRef={(el: any) => (refTienChietKhau.current[index] = el)}
                                                onKeyUp={(e: React.KeyboardEvent<HTMLDivElement>) =>
                                                    gotoNextTienChietKhau(
                                                        e,
                                                        refTienChietKhau.current[
                                                            index === lstNVThucHien.length - 1 ? 0 : index + 1
                                                        ]
                                                    )
                                                }
                                            />
                                        </Stack>
                                        <Stack flex={1} alignItems={'end'}>
                                            <ClearOutlinedIcon
                                                sx={{ color: 'red' }}
                                                onClick={() => removeNVienChosed(nv)}
                                            />
                                        </Stack>
                                    </Stack>
                                ))}
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ paddingBottom: '20px' }}>
                    <Button variant="outlined" onClick={onClose}>
                        Bỏ qua
                    </Button>
                    <Button variant="contained" onClick={saveHoaHongHD}>
                        Cập nhật
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
