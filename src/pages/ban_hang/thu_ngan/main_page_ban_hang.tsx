import { Grid, Button, IconButton, Stack, Tab, Tabs, TextField, Typography, Badge } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { IList } from '../../../services/dto/IList';
import React, { useEffect, useState } from 'react';
import TabPanel from '../../../components/TabPanel/TabPanel';
import '../style.css';
import '../../../App.css';

import { useNavigate } from 'react-router-dom';
import { LoaiChungTu, TrangThaiCheckin } from '../../../lib/appconst';
import { dbDexie } from '../../../lib/dexie/dexieDB';
import utils from '../../../utils/utils';
import Cookies from 'js-cookie';
import PageHoaDonDto from '../../../services/ban_hang/PageHoaDonDto';
import { Guid } from 'guid-typescript';
import ModalFilterNhomHangHoa from '../../../components/Dialog/modal_filter_nhom_hang_hoa';
import { SuggestChiNhanhDto } from '../../../services/suggests/dto/SuggestChiNhanhDto';
import chiNhanhService from '../../../services/chi_nhanh/chiNhanhService';
import MenuWithDataHasSearch from '../../../components/Menu/MenuWithData_HasSearch';
import { handleClickOutside } from '../../../utils/customReactHook';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import { PropConfirmOKCancel } from '../../../utils/PropParentToChild';
import CheckinService from '../../../services/check_in/CheckinService';
import ThuNganTabLeft from './thu_ngan_tab_left';
import TabKhachHangChecking2 from '../../check_in/tab_khach_hang_checking2';
import ThuNganTabRight from './thu_ngan_tab_right';
import { ModelHangHoaDto } from '../../../services/product/dto';
import ModalAddCustomerCheckIn from '../../check_in/modal_add_cus_checkin';
import PaymentsForm from './PaymentsForm';

const TabMain = {
    CHECK_IN: 1,
    THU_NGAN: 2
};

type IPropDropdownChiNhanh = {
    idChosed: string;
    handleChoseChiNhanh: (itemChosed: IList) => void;
};

export const ThuNganSetting = ({ idChosed, handleChoseChiNhanh }: IPropDropdownChiNhanh) => {
    const [lblChiNhanh, setLblChiNhanh] = useState('');
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const expandDropdownChiNhanh = Boolean(anchorEl);
    const [allChiNhanh_byUser, setAllChiNhanh_byUser] = useState<SuggestChiNhanhDto[]>([]);

    const GetChiNhanhByUser = async () => {
        const data = await chiNhanhService.GetChiNhanhByUser();
        setAllChiNhanh_byUser(data);

        if (utils.checkNull_OrEmpty(idChosed)) {
            const itemCN = data?.filter((x) => x.id === idChosed);
            if (itemCN?.length > 0) {
                setLblChiNhanh(itemCN[0]?.tenChiNhanh);

                const itemChosed: IList = {
                    id: itemCN[0]?.id,
                    text: itemCN[0]?.tenChiNhanh
                };
                handleChoseChiNhanh(itemChosed);
            }
        } else {
            setLblChiNhanh(data[0]?.tenChiNhanh);
        }
    };

    useEffect(() => {
        GetChiNhanhByUser();
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const choseChiNhanh = (item: IList) => {
        setAnchorEl(null);
        setLblChiNhanh(item?.text);
        handleChoseChiNhanh(item);
    };

    return (
        <Stack direction={'row'} alignItems={'center'} spacing={1} display={{ xs: 'none', lg: 'flex', md: 'flex' }}>
            <LocationOnOutlinedIcon />
            <Stack>
                <Typography variant="body1" onClick={handleClick}>
                    {lblChiNhanh}
                </Typography>
                <MenuWithDataHasSearch
                    open={expandDropdownChiNhanh}
                    lstData={allChiNhanh_byUser?.map((x) => {
                        return {
                            id: x.id,
                            text: x.tenChiNhanh
                        } as IList;
                    })}
                    anchorEl={anchorEl}
                    handleClose={() => setAnchorEl(null)}
                    handleChoseItem={choseChiNhanh}
                />
            </Stack>
            <SettingsOutlinedIcon />
        </Stack>
    );
};

export const InvoiceWaiting = ({ idChiNhanh, idLoaiChungTu, onChose, isAddNewHD }: any) => {
    const [isExpandShoppingCart, setIsExpandShoppingCart] = useState(false);
    const [txtSearchInvoiceWaiting, setTxtSearchInvoiceWaiting] = useState<string>('');
    const [countInvoice, setCountInvoice] = useState<number>(0);
    const [invoiceChosing, setInvoiceChosing] = useState<PageHoaDonDto | null>(null);
    const [allInvoiceWaiting, setAllInvoiceWaiting] = useState<PageHoaDonDto[]>([]);
    const [lstSearchInvoiceWaiting, setLstSearchInvoiceWaiting] = useState<PageHoaDonDto[]>([]);
    const ref = handleClickOutside(() => setIsExpandShoppingCart(false));

    const [confirmDialog, setConfirmDialog] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });

    useEffect(() => {
        if (isAddNewHD !== 0) {
            setCountInvoice(() => countInvoice + 1);
        }
    }, [isAddNewHD]);

    const GetAllInvoiceWaiting = async () => {
        const allHD = await dbDexie.hoaDon
            .where('idChiNhanh')
            .equals(idChiNhanh ?? '')
            // .and((x) => x.idLoaiChungTu === idLoaiChungTu)
            .sortBy('ngayLapHoaDon');
        setAllInvoiceWaiting([...allHD]);
        setLstSearchInvoiceWaiting([...allHD]);
        setCountInvoice(allHD?.length ?? 0);
    };

    useEffect(() => {
        GetAllInvoiceWaiting();
    }, [idChiNhanh, idLoaiChungTu]);

    const showAllInvoiceWaiting = async () => {
        setIsExpandShoppingCart(true);
        setTxtSearchInvoiceWaiting('');
        await GetAllInvoiceWaiting();
    };

    const RemoveAllInvoiceWaiting = async () => {
        setConfirmDialog({
            ...confirmDialog,
            show: true,
            title: 'Xác nhận xóa',
            mes: 'Bạn có chắc chắn muốn xóa tất cả hóa đơn chờ không?'
        });
        setInvoiceChosing(null);
    };

    const RemoveInvoiceWaitingById = async (item: PageHoaDonDto) => {
        setInvoiceChosing({ ...item });
        setConfirmDialog({
            ...confirmDialog,
            show: true,
            title: 'Xác nhận xóa',
            mes: `Bạn có chắc chắn muốn xóa hóa đơn chờ của khách hàng ${item?.tenKhachHang} không?`
        });
    };

    const choseItemInvoice = async (item: PageHoaDonDto) => {
        setInvoiceChosing({ ...item });
        setIsExpandShoppingCart(false);
        onChose(item?.id);
    };

    const onClickConfirmDelete = async () => {
        setConfirmDialog({
            ...confirmDialog,
            show: false
        });
        if (utils.checkNull(invoiceChosing?.id)) {
            setAllInvoiceWaiting([]);
            await dbDexie.hoaDon.toCollection().delete();

            for (let index = 0; index < allInvoiceWaiting?.length; index++) {
                const element = allInvoiceWaiting[index];
                if (!utils.checkNull_OrEmpty(element?.idCheckIn ?? '')) {
                    await CheckinService.UpdateTrangThaiCheckin(element?.idCheckIn ?? '', TrangThaiCheckin.DELETED);
                }
            }
            onChose(Guid.EMPTY);
        } else {
            setAllInvoiceWaiting(allInvoiceWaiting?.filter((x) => x.id !== invoiceChosing?.id));
            await dbDexie.hoaDon.delete(invoiceChosing?.id ?? '');

            if (!utils.checkNull_OrEmpty(invoiceChosing?.idCheckIn ?? '')) {
                await CheckinService.UpdateTrangThaiCheckin(invoiceChosing?.idCheckIn ?? '', TrangThaiCheckin.DELETED);
            }

            const arrConLai = allInvoiceWaiting?.filter((x) => x.id !== invoiceChosing?.id);
            if (arrConLai?.length > 0) {
                onChose(arrConLai[0]?.id);
            }
        }
    };

    return (
        <div ref={ref}>
            <ConfirmDelete
                isShow={confirmDialog.show}
                title={confirmDialog.title}
                mes={confirmDialog.mes}
                onOk={onClickConfirmDelete}
                onCancel={() => setConfirmDialog({ ...confirmDialog, show: false })}></ConfirmDelete>
            <Badge badgeContent={countInvoice} color="secondary" sx={{ position: 'relative' }}>
                <ShoppingCartIcon sx={{ color: '#1976d2' }} titleAccess="Hóa đơn chờ" onClick={showAllInvoiceWaiting} />

                <Stack
                    width={300}
                    spacing={1}
                    overflow={'auto'}
                    maxHeight={500}
                    zIndex={4}
                    sx={{
                        display: isExpandShoppingCart ? '' : 'none',
                        position: 'absolute',
                        marginLeft: '-160px',
                        backgroundColor: 'white',
                        border: '1px solid #cccc',
                        borderRadius: '4px',
                        top: '20px'
                    }}>
                    <Stack sx={{ backgroundColor: 'antiquewhite' }}>
                        <Typography
                            variant="body2"
                            sx={{
                                textAlign: 'center',
                                borderBottom: '1px solid #cccc',
                                padding: '8px'
                            }}>
                            Hóa đơn chờ
                        </Typography>
                        <CloseOutlinedIcon
                            titleAccess="Xóa tất cả"
                            onClick={RemoveAllInvoiceWaiting}
                            sx={{
                                position: 'absolute',
                                right: '8px',
                                top: '8px',
                                width: 16,
                                height: 16,
                                color: 'red',
                                '&:hover': {
                                    filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                                }
                            }}
                        />
                    </Stack>

                    <TextField
                        fullWidth
                        size="small"
                        variant="standard"
                        placeholder="Tìm hóa đơn"
                        value={txtSearchInvoiceWaiting}
                        onChange={(e) => setTxtSearchInvoiceWaiting(e.target.value)}
                        InputProps={{ startAdornment: <SearchIcon /> }}
                    />
                    <Stack>
                        {lstSearchInvoiceWaiting?.map((item: PageHoaDonDto, index: number) => (
                            <Stack
                                sx={{
                                    position: 'relative',
                                    '&:hover': {
                                        backgroundColor: 'var(--color-bg)',
                                        cursor: 'pointer'
                                    }
                                }}
                                key={index}>
                                <CloseOutlinedIcon
                                    onClick={() => RemoveInvoiceWaitingById(item)}
                                    sx={{
                                        position: 'absolute',
                                        right: '8px',
                                        top: '8px',
                                        width: 16,
                                        height: 16,
                                        color: 'red'
                                    }}
                                />
                                <Stack
                                    sx={{
                                        padding: '10px',
                                        borderBottom: '1px solid #ccc'
                                    }}
                                    onClick={() => choseItemInvoice(item)}>
                                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                        <AssignmentIndOutlinedIcon
                                            sx={{
                                                color: '#cccc',
                                                width: '18px',
                                                height: '18px'
                                            }}
                                        />
                                        <Typography variant="subtitle2" title={item?.tenKhachHang}>
                                            {item.tenKhachHang}
                                        </Typography>
                                    </Stack>
                                    {item?.soDienThoai && (
                                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                            <PhoneOutlinedIcon
                                                sx={{
                                                    color: '#cccc',
                                                    width: '18px',
                                                    height: '18px'
                                                }}
                                            />
                                            <Typography color="#999699" variant="caption">
                                                {item?.soDienThoai}
                                            </Typography>
                                        </Stack>
                                    )}
                                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                        {item?.idLoaiChungTu === LoaiChungTu.HOA_DON_BAN_LE ? (
                                            <ReceiptOutlinedIcon color="success" />
                                        ) : (
                                            <SpaOutlinedIcon color="secondary" />
                                        )}
                                        <Typography variant="body2" fontWeight="600" color={'#d39987'}>
                                            {Intl.NumberFormat('vi-VN').format(item?.tongThanhToan)}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
            </Badge>
        </div>
    );
};
export default function MainPageBanHang() {
    const navigation = useNavigate();
    const [txtSearch, setTextSearch] = useState('');
    const [isShowModalAdd, setIsShowModalAdd] = useState(false);
    const [isThanhToanTienMat, setIsThanhToanTienMat] = useState(true);
    const [tabMainActive, setTabMainActive] = useState(TabMain.CHECK_IN);
    const [isShowModalFilterNhomHangHoa, setIsShowModalFilterNhomHangHoa] = useState(false);
    const [arrIdNhomHangFilter, setArrIdNhomHangFilter] = useState<string[]>([]);
    const [isAddInvoiceToCache, setIsAddInvoiceToCache] = useState<number>(0);

    const [idChiNhanhChosed, setIdChiNhanhChosed] = useState<string>(Cookies.get('IdChiNhanh') ?? '');
    const [customerIdChosed, setCustomerIdChosed] = useState<string>('');

    const [pageThuNgan_idChecking, setPageThuNgan_idChecking] = useState<string>(Guid.EMPTY);

    const [isChoseProduct, setIsChoseProduct] = useState(0);
    const [productChosed, setProductChosed] = useState<ModelHangHoaDto>({} as ModelHangHoaDto);

    const changeActiveTabMain = async (event: React.SyntheticEvent, tabNew: number) => {
        setTabMainActive(tabNew);
        setIsShowModalAdd(false);
        setArrIdNhomHangFilter([]);
        setIsChoseProduct(0);
    };

    const onAgreeFilterNhomHang = (arrIdNhomHang: string[]) => {
        setArrIdNhomHangFilter([...arrIdNhomHang]);
        setIsShowModalFilterNhomHangHoa(false);
    };

    const onClickAddHoaDon = (customerId: string, idCheckIn?: string, isAddNew?: boolean) => {
        setCustomerIdChosed(customerId);
        setPageThuNgan_idChecking(idCheckIn ?? '');
        if (isAddNew ?? false) {
            setIsShowModalAdd(false); // nếu thêm khách check-in new: close modal + add new hoadon
        } else {
            setTabMainActive(TabMain.THU_NGAN);
        }
    };

    const choseProduct = (item: ModelHangHoaDto) => {
        setIsChoseProduct(isChoseProduct + 1);
        setProductChosed(item);
    };

    const changeChiNhanh = (idChiNhanh: string) => {
        setIdChiNhanhChosed(idChiNhanh);
    };

    const ThuNgan_ChangeHinhThucThanhToan = (isTienMat: boolean) => {
        setIsThanhToanTienMat(isTienMat);
    };

    return (
        <Grid container className="main_page_thu_ngan" padding={1} position={'relative'} height={'100vh'}>
            <ModalFilterNhomHangHoa
                isShow={isShowModalFilterNhomHangHoa}
                onClose={() => setIsShowModalFilterNhomHangHoa(false)}
                onAgree={onAgreeFilterNhomHang}
            />

            <Grid container spacing={1}>
                <Grid item xs={12} sm={3} lg={7} md={6} borderRight={'1px solid rgb(224, 228, 235)'} padding={1}>
                    <Grid container spacing={1}>
                        <Grid item lg={4} md={5}>
                            <Stack direction={'row'} alignItems={'center'} spacing={1}>
                                <HomeOutlinedIcon
                                    titleAccess="Đi đến trang chủ"
                                    onClick={() => navigation('/home')}
                                    sx={{ color: 'var(--color-main)', '&:hover': { cursor: 'pointer' } }}
                                />
                                <Tabs
                                    value={tabMainActive}
                                    onChange={changeActiveTabMain}
                                    aria-label="nav tabs example">
                                    <Tab label="Check in" value={TabMain.CHECK_IN} />
                                    <Tab label="Hàng hóa" value={TabMain.THU_NGAN} />
                                </Tabs>
                            </Stack>
                        </Grid>
                        <Grid item lg={8} md={7}>
                            {tabMainActive == TabMain.CHECK_IN ? (
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Tìm kiếm khách hàng"
                                    onChange={(e) => setTextSearch(e.target.value)}
                                    InputProps={{
                                        startAdornment: <SearchIcon />,
                                        endAdornment: (
                                            <IconButton
                                                sx={{ cursor: 'pointer' }}
                                                aria-label="Thêm khách hàng check-in"
                                                title="Thêm khách hàng check-in"
                                                onClick={() => setIsShowModalAdd(true)}>
                                                <AddOutlinedIcon />
                                            </IconButton>
                                        )
                                    }}
                                />
                            ) : (
                                <TextField
                                    size="small"
                                    placeholder="Tìm kiếm dịch vụ"
                                    fullWidth
                                    onChange={(e) => setTextSearch(e.target.value)}
                                    InputProps={{
                                        startAdornment: <SearchIcon />,
                                        endAdornment: (
                                            <IconButton
                                                sx={{ cursor: 'pointer' }}
                                                aria-label="Lọc sản phẩm theo nhóm"
                                                title="Lọc sản phẩm theo nhóm"
                                                onClick={() => setIsShowModalFilterNhomHangHoa(true)}>
                                                <FilterAltOutlinedIcon />
                                            </IconButton>
                                        )
                                    }}
                                />
                            )}
                        </Grid>
                    </Grid>
                    <TabPanel value={tabMainActive} index={TabMain.CHECK_IN}>
                        <TabKhachHangChecking2
                            txtSearch={txtSearch}
                            idChiNhanhChosed={idChiNhanhChosed}
                            onClickAddHoaDon={onClickAddHoaDon}
                            isShowModalAddCheckin={tabMainActive == TabMain.CHECK_IN ? isShowModalAdd : false}
                            onCloseModalAddCheckin={() => setIsShowModalAdd(false)}
                        />
                    </TabPanel>
                    <TabPanel value={tabMainActive} index={TabMain.THU_NGAN}>
                        <ThuNganTabLeft txtSearch={txtSearch} onChoseProduct={choseProduct} />
                    </TabPanel>
                </Grid>

                <Grid item xs={12} sm={9} lg={5} md={6}>
                    <ThuNganTabRight
                        isChoseProduct={isChoseProduct}
                        productChosed={productChosed}
                        customerIdChosed={customerIdChosed}
                        idCheckIn={pageThuNgan_idChecking}
                        onChangeChiNhanh={changeChiNhanh}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}
