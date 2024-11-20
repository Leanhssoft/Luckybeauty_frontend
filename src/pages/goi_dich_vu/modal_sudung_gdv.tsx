import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Tab,
    Tabs,
    Stack,
    Checkbox,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    TextField,
    Typography,
    debounce
} from '@mui/material';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useEffect, useRef, useState } from 'react';
import TabPanel from '../../components/TabPanel/TabPanel';
import { IPropModal } from '../../services/dto/IPropsComponent';
import HoaDonService from '../../services/ban_hang/HoaDonService';
import { RdoTrangThaiFilter } from '../../enum/TrangThaiFilter';
import ParamSearchChiTietSuDungGDVDto from '../../services/ban_hang/ParamSearchChiTietSuDungGDVDto';
import ChiTietSuDungGDVDto, { GroupChiTietSuDungGDVDto } from '../../services/ban_hang/ChiTietSuDungGDVDto';
import { format } from 'date-fns';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import DialogButtonClose from '../../components/Dialog/ButtonClose';
import utils from '../../utils/utils';
import TabNhatKySuDungGDV from './tab_nhat_ky_su_dung_gdv';
enum TabMain {
    GOI_DICH_VU = 1,
    NHAT_KY_SU_DUNG = 2
}

export default function ModalSuDungGDV({ isShowModal, idUpdate, onClose, onOK }: IPropModal<ChiTietSuDungGDVDto[]>) {
    const firstLoad = useRef(true);
    const [tabActive, settabActive] = useState(TabMain.GOI_DICH_VU);
    const [lstChiTietGDV, setLstChiTietGDV] = useState<GroupChiTietSuDungGDVDto[]>();
    const [ctChosed, setCTChosed] = useState<ChiTietSuDungGDVDto[]>([]);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const [paramSearch, setParamSearch] = useState<ParamSearchChiTietSuDungGDVDto>({
        idCustomer: '',
        idChiNhanhs: [],
        trangThais: [RdoTrangThaiFilter.CO]
    });
    const arrTrangThai = [
        { text: 'Tất cả', value: RdoTrangThaiFilter.TAT_CA },
        { text: 'Còn buổi', value: RdoTrangThaiFilter.CO },
        { text: 'Hết buổi', value: RdoTrangThaiFilter.KHONG }
    ];

    const GetChiTiet_SuDungGDV_ofCustomer = async (txtSearch: string | null) => {
        const param = { ...paramSearch };
        param.idCustomer = idUpdate ?? '';
        param.textSearch = txtSearch ?? '';
        const data = await HoaDonService.GetChiTiet_SuDungGDV_ofCustomer(param);
        setLstChiTietGDV([...data]);
    };

    const debounSearch = useRef(
        debounce(async (txtSearch: string) => {
            GetChiTiet_SuDungGDV_ofCustomer(txtSearch);
        }, 500)
    ).current;

    useEffect(() => {
        setCTChosed([]);
        setParamSearch({ ...paramSearch, textSearch: '', trangThais: [RdoTrangThaiFilter.CO] });
    }, [isShowModal]);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        if (isShowModal) {
            debounSearch(paramSearch?.textSearch ?? '');
        }
    }, [paramSearch?.textSearch]);

    useEffect(() => {
        if (isShowModal) {
            // show: run this
            GetChiTiet_SuDungGDV_ofCustomer(paramSearch?.textSearch ?? '');
        }
    }, [paramSearch?.trangThais]);

    const arrIdChiTietChosed = ctChosed?.map((x) => {
        return x?.idChiTietHoaDon;
    });

    const changeCheckAll = (isCheck: boolean) => {
        let arrIdSearch = lstChiTietGDV?.flatMap((x) => x?.chitiets?.map((o) => o?.idChiTietHoaDon));
        arrIdSearch = arrIdSearch ?? [];

        const arrConLai = ctChosed?.filter((x) => !arrIdSearch?.includes(x?.idChiTietHoaDon ?? ''));
        if (isCheck) {
            const arrChosed = lstChiTietGDV?.flatMap((x) => x?.chitiets?.map((o) => o));
            setCTChosed([...arrConLai, ...(arrChosed ?? [])]);
        } else {
            setCTChosed([...arrConLai]);
        }
    };

    const choseItem = (isCheck: boolean, itemChosed: ChiTietSuDungGDVDto) => {
        if (itemChosed?.soLuongConLai === 0) {
            setObjAlert({
                ...objAlert,
                show: true,
                mes: `Dịch vụ ${itemChosed?.tenHangHoa} đã hết số buổi dùng`,
                type: 2
            });
            return;
        }
        const lstOld = ctChosed?.filter((x) => x?.idChiTietHoaDon !== itemChosed?.idChiTietHoaDon);
        if (isCheck) {
            setCTChosed([itemChosed, ...(lstOld ?? [])]);
        } else {
            setCTChosed([...(lstOld ?? [])]);
        }
    };

    const onAgree = () => {
        if (ctChosed) {
            if (ctChosed?.length === 0) {
                setObjAlert({
                    ...objAlert,
                    show: true,
                    type: 2,
                    mes: `Vui lòng chọn dịch vụ để sử dụng`
                });
                return;
            }
            let tenDV = '';
            for (let index = 0; index < ctChosed?.length; index++) {
                const element = ctChosed[index];
                if (element?.soLuongConLai === 0) {
                    tenDV += ` ${element?.tenHangHoa} ,`;
                }
            }
            if (!utils.checkNull(tenDV)) {
                setObjAlert({
                    ...objAlert,
                    show: true,
                    type: 2,
                    mes: `Dịch vụ ${utils.Remove_LastComma(tenDV)} đã dùng hết số buổi`
                });
                return;
            }
            onOK(1, ctChosed);
        }
    };

    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}
            />
            <Dialog open={isShowModal} fullWidth maxWidth="lg" onClose={onClose}>
                <DialogTitle className="modal-title">Sử dụng gói dịch vụ</DialogTitle>
                <DialogButtonClose onClose={onClose} />
                <DialogContent>
                    <Tabs value={tabActive} onChange={(event, newVal) => settabActive(newVal)}>
                        <Tab label="Gói dịch vụ" value={TabMain.GOI_DICH_VU} />
                        <Tab label="Nhật ký sử dụng" value={TabMain.NHAT_KY_SU_DUNG} />
                    </Tabs>
                    <TabPanel value={tabActive} index={TabMain.GOI_DICH_VU}>
                        <Grid container>
                            <Grid item xs={12}>
                                <RadioGroup
                                    row
                                    value={paramSearch?.trangThais?.[0]}
                                    onChange={(e) =>
                                        setParamSearch({ ...paramSearch, trangThais: [parseInt(e.target.value)] })
                                    }>
                                    {arrTrangThai?.map((x, index) => (
                                        <FormControlLabel
                                            key={index}
                                            label={x.text}
                                            value={x.value}
                                            control={<Radio />}></FormControlLabel>
                                    ))}
                                </RadioGroup>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    size="small"
                                    variant="outlined"
                                    placeholder="Tìm kiếm mã gói dịch vụ, tên dịch vụ"
                                    fullWidth
                                    InputProps={{ startAdornment: <SearchOutlinedIcon /> }}
                                    onChange={(e) => setParamSearch({ ...paramSearch, textSearch: e.target.value })}
                                />
                            </Grid>
                            <Grid
                                container
                                sx={{
                                    backgroundColor: ' var(--color-header-table)'
                                }}
                                className="grid-table grid-table-header">
                                <Grid item xs={1.5}>
                                    <Typography variant="body2">Mã DV</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="body2">Tên dịch vụ</Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    <Typography variant="body2">Số lượng</Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    <Typography variant="body2">Đơn giá</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="body2">Thành tiền</Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    <Typography variant="body2">Sử dụng</Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    <Typography variant="body2">Còn lại</Typography>
                                </Grid>
                                <Grid item xs={0.5}>
                                    <Checkbox onChange={(e) => changeCheckAll(e.target.checked)} />
                                </Grid>
                            </Grid>
                            <Grid container style={{ overflow: 'auto', maxHeight: '60vh' }}>
                                {lstChiTietGDV?.map((x, index) => (
                                    <Grid item xs={12} key={index}>
                                        <Grid container sx={{ backgroundColor: 'var(--color-bg)' }}>
                                            <Grid item xs={12} padding={1}>
                                                <Stack
                                                    spacing={2}
                                                    direction="row"
                                                    alignItems="center"
                                                    justifyContent={'center'}>
                                                    <Typography> {x?.maHoaDon}</Typography>
                                                    <Typography>
                                                        {' - '}
                                                        {format(new Date(x?.ngayLapHoaDon), 'dd/MM/yyyy')}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                        {x?.chitiets?.map((ct, index) => (
                                            <div key={index}>
                                                <Grid container className="grid-table grid-content">
                                                    <Grid item xs={1.5} textAlign={'center'}>
                                                        <Typography variant="body2"> {ct?.maHangHoa}</Typography>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Typography variant="body2"> {ct?.tenHangHoa}</Typography>
                                                    </Grid>
                                                    <Grid item xs={1} textAlign={'center'}>
                                                        <Typography variant="body2"> {ct?.soLuongMua}</Typography>
                                                    </Grid>
                                                    <Grid item xs={1} textAlign={'center'}>
                                                        <Typography variant="body2">
                                                            {' '}
                                                            {new Intl.NumberFormat('vi-VN').format(
                                                                ct?.donGiaSauCK ?? 0
                                                            )}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={2} textAlign={'center'}>
                                                        <Typography variant="body2">
                                                            {new Intl.NumberFormat('vi-VN').format(
                                                                ct?.thanhTienSauCK ?? 0
                                                            )}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={1} textAlign={'center'}>
                                                        <Typography variant="body2"> {ct?.soLuongDung}</Typography>
                                                    </Grid>
                                                    <Grid item xs={1} textAlign={'center'}>
                                                        <Typography variant="body2"> {ct?.soLuongConLai}</Typography>
                                                    </Grid>
                                                    <Grid item xs={0.5} textAlign={'center'}>
                                                        <Checkbox
                                                            onChange={(e) => choseItem(e.target.checked, ct)}
                                                            checked={arrIdChiTietChosed?.includes(ct?.idChiTietHoaDon)}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        ))}
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={tabActive} index={TabMain.NHAT_KY_SU_DUNG}>
                        <TabNhatKySuDungGDV idCustomer={idUpdate ?? ''} />
                    </TabPanel>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="error" startIcon={<BlockOutlinedIcon />} onClick={onClose}>
                        Hủy bỏ
                    </Button>
                    <Button variant="outlined" startIcon={<CheckOutlinedIcon />} onClick={onAgree}>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
