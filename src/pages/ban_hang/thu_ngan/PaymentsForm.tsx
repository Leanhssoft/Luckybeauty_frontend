import React, { useEffect, useRef, useState } from 'react';
import { Stack, Typography, Grid, TextField, CircularProgress, InputAdornment } from '@mui/material';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import { NumericFormat } from 'react-number-format';
import utils from '../../../utils/utils';
import { TaiKhoanNganHangDto } from '../../../services/so_quy/Dto/TaiKhoanNganHangDto';
import TaiKhoanNganHangServices from '../../../services/so_quy/TaiKhoanNganHangServices';
import AutocompleteAccountBank from '../../../components/Autocomplete/AccountBank';
import { FormNumber } from '../../../enum/FormNumber';
import SoQuyServices from '../../../services/so_quy/SoQuyServices';
import { format } from 'date-fns';
import HoaDonService from '../../../services/ban_hang/HoaDonService';
interface ChildComponent {
    tongPhaiTra: number;
    onClose: () => void;
    onSaveHoaDon?: (
        tienTheGiaTri: number,
        tienMat: number,
        tienCK: number,
        tienPOS: number,
        idTaiKhoanPos: string | null,
        idTaiKhoanCK: string | null,
        noiDungThu: string
    ) => void;
    formNumber?: number;
    isShowModal?: boolean;
    inforHD?: { id: string; maHoaDon: string; idKhachHang: string; idChiNhanh: string; tenKhachHang: string };
    onSaveOKQuyHD?: (tongTienThu: number) => void;
}
const PaymentsForm: React.FC<ChildComponent> = ({
    tongPhaiTra = 0,
    onClose,
    onSaveHoaDon,
    formNumber = FormNumber.THU_NGAN,
    isShowModal = false,
    inforHD,
    onSaveOKQuyHD
}) => {
    const [isSaving, setIsSaving] = useState(false);
    const [tienMat, setTienMat] = useState(tongPhaiTra);
    const [tienChuyenKhoan, setTienChuyenKhoan] = useState(0);
    const [tienQuyeThePos, setTienQuyeThePos] = useState(0);
    const [tienTheGiaTri, setTienTheGiaTri] = useState(0);
    const [soDuTheGiaTri, setSoDuTheGiaTri] = useState(0);
    const [noiDungThu, setNoiDungThu] = useState('');
    const [qrCode, setQRCode] = useState('');
    const [allBankAccount, setAllBankAccount] = useState<TaiKhoanNganHangDto[]>([]);

    const [idTaiKhoanChuyenKhoan, setIdTaiKhoanChuyenKhoan] = useState<string | null>('');
    const [idTaiKhoanPOS, setIdTaiKhoanPOS] = useState<string | null>('');

    const refInputTienMat = useRef<HTMLInputElement>(null);
    const refInputTienCK = useRef<HTMLInputElement>(null);
    const refInputTienPOS = useRef<HTMLInputElement>(null);
    const GetAllTaiKhoanNganHang = async () => {
        const data = await TaiKhoanNganHangServices.GetAllBankAccount();
        setAllBankAccount(data);
    };

    useEffect(() => {
        GetAllTaiKhoanNganHang();
    }, []);

    useEffect(() => {
        GetSoDuTheGiaTri_ofKhachHang(inforHD?.idKhachHang ?? '');
    }, [inforHD?.idKhachHang]);

    const GetSoDuTheGiaTri_ofKhachHang = async (idKhachHang: string) => {
        const data = await HoaDonService.GetSoDuTheGiaTri_ofKhachHang(idKhachHang);
        setSoDuTheGiaTri(data);
    };

    const tienKhachDua = tienTheGiaTri + tienMat + tienChuyenKhoan + tienQuyeThePos;
    const tienKhachThieu = tongPhaiTra - tienKhachDua;

    const editTienTheGiaTri = (e: React.ChangeEvent<HTMLInputElement>) => {
        let gtri = utils.formatNumberToFloat(e.target.value);
        if (gtri > soDuTheGiaTri) {
            gtri = soDuTheGiaTri;
        }
        setTienTheGiaTri(gtri);

        let conLai = 0;
        if (gtri < tongPhaiTra) {
            conLai = tongPhaiTra - gtri;
        }
        setTienMat(conLai);
        setTienChuyenKhoan(0);
        setTienQuyeThePos(0);
    };

    const editTienMat = (e: React.ChangeEvent<HTMLInputElement>) => {
        const gtri = utils.formatNumberToFloat(e.target.value);
        setTienMat(gtri);

        const tongThanhToan = gtri + tienTheGiaTri;
        let conLai = 0;
        if (tongThanhToan < tongPhaiTra) {
            conLai = tongPhaiTra - tongThanhToan;
        }
        if (!utils.checkNull_OrEmpty(idTaiKhoanChuyenKhoan)) {
            setTienChuyenKhoan(conLai);
            setTienQuyeThePos(0);
        } else {
            if (!utils.checkNull_OrEmpty(idTaiKhoanPOS)) {
                setTienQuyeThePos(conLai);
            } else {
                setTienQuyeThePos(0);
            }
            setTienChuyenKhoan(0);
        }
    };

    const genarateQrCode = async () => {
        if (!utils.checkNull(idTaiKhoanChuyenKhoan)) {
            const acc = allBankAccount?.find((x) => x.id === idTaiKhoanChuyenKhoan);
            if (acc) {
                const accountBank: TaiKhoanNganHangDto = {
                    id: idTaiKhoanChuyenKhoan,
                    soTaiKhoan: acc?.soTaiKhoan,
                    tenChuThe: acc?.tenChuThe,
                    maPinNganHang: acc?.maPinNganHang
                } as TaiKhoanNganHangDto;
                const qrCode = await TaiKhoanNganHangServices.GetQRCode(accountBank, tienChuyenKhoan);
                setQRCode(qrCode);
            } else {
                setQRCode('');
            }
        } else {
            setQRCode('');
        }
    };

    useEffect(() => {
        genarateQrCode();
    }, [idTaiKhoanChuyenKhoan, tienChuyenKhoan]);

    const changeTaiKhoanChuyenKhoan = async (item: TaiKhoanNganHangDto) => {
        setIdTaiKhoanChuyenKhoan(item?.id);
        if (utils.checkNull_OrEmpty(item?.id)) {
            setTienChuyenKhoan(0);
        }
    };
    const changeTaiKhoanPOS = (item: TaiKhoanNganHangDto) => {
        setIdTaiKhoanPOS(item?.id);
        if (utils.checkNull_OrEmpty(item?.id)) {
            setTienQuyeThePos(0);
        }
    };

    const thanhToan = async () => {
        setIsSaving(true);
        if (formNumber === FormNumber.THU_NGAN || formNumber === FormNumber.THE_GIA_TRI) {
            if (onSaveHoaDon) {
                onSaveHoaDon(
                    tienTheGiaTri,
                    tienMat,
                    tienChuyenKhoan,
                    tienQuyeThePos,
                    idTaiKhoanChuyenKhoan,
                    idTaiKhoanPOS,
                    noiDungThu
                );
            }
        } else {
            const dataQuyHD = await SoQuyServices.savePhieuThu_forHoaDon({
                phaiTT: tongPhaiTra ?? 0,
                idChiNhanh: inforHD?.idChiNhanh ?? '',
                thegiatri: tienTheGiaTri,
                tienmat: tienMat,
                tienCK: tienChuyenKhoan,
                tienPOS: tienQuyeThePos,
                idTaiKhoanChuyenKhoan: idTaiKhoanChuyenKhoan as null,
                idTaiKhoanPOS: idTaiKhoanPOS as null,
                noiDungThu: noiDungThu,
                ngayLapHoaDon: format(new Date(), 'yyyy-MM-dd'),
                hoadon: {
                    maHoaDon: inforHD?.maHoaDon ?? '',
                    id: inforHD?.id as unknown as null,
                    idKhachHang: inforHD?.idKhachHang as unknown as null,
                    tenKhachHang: inforHD?.tenKhachHang ?? ''
                }
            });
            if (dataQuyHD !== null) {
                if (onSaveOKQuyHD) {
                    onSaveOKQuyHD(dataQuyHD?.tongTienThu ?? 0);
                }
            }
        }
        setIsSaving(false);
    };

    return (
        <Grid
            container
            padding={2}
            sx={{
                boxShadow: '1px 5px 10px 4px #00000026',
                borderRadius: '12px',
                bgcolor: '#fff'
            }}>
            <Grid item xs={12} position={'relative'}>
                <Typography fontSize="24px" fontWeight="700">
                    {formNumber === FormNumber.THU_NGAN || formNumber === FormNumber.THE_GIA_TRI
                        ? ' Thông tin thanh toán'
                        : `Thêm mới phiếu thu (${inforHD?.maHoaDon ?? ''})`}
                </Typography>
                <CloseOutlinedIcon
                    sx={{ position: 'absolute', right: 0, top: 0, width: 36, height: 36 }}
                    onClick={onClose}
                />
            </Grid>
            <Grid item xs={12} lg={12}>
                <Grid container padding={2} paddingLeft={0}>
                    <Grid item xs={6} lg={7} md={7} sm={6}>
                        <Typography fontSize={20} fontWeight={500}>
                            {formNumber === FormNumber.THU_NGAN || formNumber === FormNumber.THE_GIA_TRI
                                ? ' Tổng thanh toán'
                                : 'Nợ hóa đơn'}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} lg={5} md={5} sm={6}>
                        <Typography textAlign={'right'} fontSize={20} fontWeight={500}>
                            {new Intl.NumberFormat('vi-VN').format(tongPhaiTra)}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            <Grid
                item
                xs={12}
                padding={2}
                sx={{ backgroundColor: 'rgb(245 241 241)', borderRadius: '8px', paddingTop: '16px' }}
                className="payment-form-hinhthucTT">
                <Grid container display={'none'}>
                    <Grid item lg={2} md={3}>
                        <Typography>Sử dụng điểm</Typography>
                    </Grid>
                    <Grid item lg={10} md={8}>
                        <Grid container spacing={2}>
                            <Grid item lg={7}>
                                <Typography
                                    sx={{
                                        fontSize: '14px!important',
                                        fontWeight: '400!important'
                                    }}>
                                    Tổng điểm: 333
                                </Typography>
                            </Grid>
                            <Grid item lg={5}>
                                <Stack spacing={2} direction={'row'}>
                                    <TextField size="small" />
                                    <TextField size="small" />
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {formNumber !== FormNumber.THE_GIA_TRI && soDuTheGiaTri > 0 && (
                    <Grid container justifyContent={'space-between'}>
                        <Grid item lg={3} md={3} sm={3} xs={6}>
                            <Typography>Thu từ thẻ</Typography>
                        </Grid>
                        <Grid item lg={9} md={9} sm={9} xs={6}>
                            <Grid container spacing={2}>
                                <Grid item lg={9} md={8} sm={9} xs={9}>
                                    <Typography variant="body2">
                                        Số dư thẻ: {new Intl.NumberFormat('vi-VN').format(soDuTheGiaTri)}
                                    </Typography>
                                </Grid>
                                <Grid item lg={3} md={4} sm={3} xs={3}>
                                    <NumericFormat
                                        className="input-number"
                                        size="small"
                                        fullWidth
                                        value={tienTheGiaTri}
                                        decimalSeparator=","
                                        thousandSeparator="."
                                        customInput={TextField}
                                        onChange={editTienTheGiaTri}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                if (refInputTienMat) {
                                                    refInputTienMat?.current?.focus();
                                                }
                                            }
                                        }}
                                        isAllowed={(values) => {
                                            const { floatValue } = values;
                                            return (floatValue ?? 0) >= 0 && (floatValue ?? 0) <= soDuTheGiaTri;
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                )}

                <Grid container justifyContent={'space-between'} paddingTop={1}>
                    <Grid item lg={3} md={3} sm={3} xs={6}>
                        <Typography>Tiền mặt</Typography>
                    </Grid>
                    <Grid item lg={9} md={9} sm={9} xs={6}>
                        <Grid container spacing={2}>
                            <Grid item lg={9} md={8} sm={9}></Grid>
                            <Grid item lg={3} md={4} sm={3}>
                                <NumericFormat
                                    className="input-number"
                                    size="small"
                                    fullWidth
                                    value={tienMat}
                                    decimalSeparator=","
                                    thousandSeparator="."
                                    customInput={TextField}
                                    onChange={editTienMat}
                                    inputRef={refInputTienMat}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !utils.checkNull_OrEmpty(idTaiKhoanChuyenKhoan)) {
                                            if (refInputTienCK) {
                                                refInputTienCK?.current?.focus();
                                            }
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container justifyContent={'space-between'} paddingTop={1}>
                    <Grid item lg={3} md={3} xs={12} sm={3}>
                        <Typography>Chuyển khoản</Typography>
                    </Grid>
                    <Grid item lg={9} md={9} xs={12} sm={9} paddingTop={{ xs: 1, lg: 0, md: 0, sm: 0 }}>
                        <Grid container spacing={2}>
                            <Grid item lg={9} md={8} sm={9} xs={9}>
                                <AutocompleteAccountBank
                                    handleChoseItem={changeTaiKhoanChuyenKhoan}
                                    idChosed={idTaiKhoanChuyenKhoan}
                                    listOption={allBankAccount}
                                />
                            </Grid>
                            <Grid item lg={3} md={4} sm={3} xs={3}>
                                <NumericFormat
                                    size="small"
                                    fullWidth
                                    disabled={utils.checkNull_OrEmpty(idTaiKhoanChuyenKhoan)}
                                    value={tienChuyenKhoan}
                                    decimalSeparator=","
                                    thousandSeparator="."
                                    className="input-number"
                                    customInput={TextField}
                                    onChange={(event) => {
                                        setTienChuyenKhoan(utils.formatNumberToFloat(event.target.value));
                                    }}
                                    inputRef={refInputTienCK}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !utils.checkNull_OrEmpty(idTaiKhoanPOS)) {
                                            if (refInputTienPOS) {
                                                refInputTienPOS?.current?.focus();
                                            }
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container justifyContent={'space-between'} paddingTop={1}>
                    <Grid item lg={3} md={3} xs={12} sm={3}>
                        <Typography>Quyẹt thẻ</Typography>
                    </Grid>
                    <Grid item lg={9} md={9} xs={12} sm={9} paddingTop={{ xs: 1, lg: 0, md: 0, sm: 0 }}>
                        <Grid container spacing={2}>
                            <Grid item lg={9} md={8} sm={9} xs={9}>
                                <AutocompleteAccountBank
                                    handleChoseItem={changeTaiKhoanPOS}
                                    idChosed={idTaiKhoanPOS}
                                    listOption={allBankAccount}
                                />
                            </Grid>
                            <Grid item lg={3} md={4} sm={3} xs={3}>
                                <NumericFormat
                                    size="small"
                                    fullWidth
                                    disabled={utils.checkNull_OrEmpty(idTaiKhoanPOS)}
                                    value={tienQuyeThePos}
                                    decimalSeparator=","
                                    thousandSeparator="."
                                    className="input-number"
                                    customInput={TextField}
                                    onChange={(event) => {
                                        setTienQuyeThePos(utils.formatNumberToFloat(event.target.value));
                                    }}
                                    inputRef={refInputTienPOS}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12} marginTop={1}>
                <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập nội dung thu"
                    value={noiDungThu}
                    onChange={(e) => setNoiDungThu(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <CreateOutlinedIcon />
                            </InputAdornment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Grid container justifyContent={'space-between'} padding={2}>
                    <Grid item lg={3} md={3} sm={3} xs={0}></Grid>
                    <Grid item lg={9} md={9} sm={9} xs={12}>
                        <Grid container spacing={2}>
                            <Grid item lg={4} md={5} sm={4} xs={12}>
                                {qrCode && <img src={qrCode} style={{ width: '100%', height: '100%' }} />}
                            </Grid>
                            <Grid item lg={8} md={7} sm={8} xs={12}>
                                <Grid container justifyContent={'end'}>
                                    <Grid item lg={7} md={12} sm={6} xs={12}>
                                        <Typography textAlign={'right'} fontSize={18} fontWeight={500}>
                                            Tổng khách trả
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={5} md={12} sm={6} xs={12}>
                                        <Typography textAlign={'right'} fontSize={18} fontWeight={500}>
                                            {new Intl.NumberFormat('vi-VN').format(tienKhachDua)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container justifyContent={'end'} paddingTop={2}>
                                    <Grid item lg={7} md={12} sm={6} xs={12}>
                                        <Typography textAlign={'right'} fontSize={16} fontWeight={500}>
                                            {tienKhachThieu >= 0 ? 'Tiền thiếu' : 'Tiền thừa'}
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={5} md={12} sm={6} xs={12}>
                                        <Typography textAlign={'right'} fontSize={16} fontWeight={500}>
                                            {new Intl.NumberFormat('vi-VN').format(Math.abs(tienKhachThieu))}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} marginTop={3}>
                <Grid container>
                    <Grid item lg={3} md={3} sm={3} xs={2}></Grid>
                    <Grid item lg={6} md={6} sm={6} xs={8}>
                        {isSaving ? (
                            <Stack
                                sx={{
                                    backgroundColor: '#1976d2',
                                    borderRadius: '4px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: 'white'
                                }}
                                direction={'row'}
                                spacing={1}>
                                <CircularProgress />
                                <Typography fontSize={'16px'} padding={2} fontWeight={500}>
                                    ĐANG LƯU
                                </Typography>
                            </Stack>
                        ) : (
                            <Stack
                                sx={{
                                    backgroundColor: '#1976d2',
                                    borderRadius: '8px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: 'white'
                                }}
                                direction={'row'}
                                spacing={1}
                                onClick={thanhToan}>
                                <CheckOutlinedIcon />
                                <Typography fontSize={'16px'} padding={2} fontWeight={500}>
                                    {formNumber === FormNumber.THE_GIA_TRI ? 'ĐỒNG Ý' : 'THANH TOÁN'}
                                </Typography>
                            </Stack>
                        )}
                    </Grid>
                    <Grid item lg={3} md={3} sm={3} xs={2}></Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};
export default PaymentsForm;
