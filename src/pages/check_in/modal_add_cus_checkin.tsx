import { Button, Dialog, DialogContent, DialogTitle, Stack, Box, IconButton } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import CheckinService from '../../services/check_in/CheckinService';
import { ICheckInHoaDonto, KHCheckInDto, PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';

import { ReactComponent as CloseIcon } from '../../images/close-square.svg';
import { Guid } from 'guid-typescript';
import TabKhachHang from './TabModalKhachHang';
import TabCuocHen from './TabModalCuocHen';
import { PropConfirmOKCancel } from '../../utils/PropParentToChild';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import Cookies from 'js-cookie';
import { BookingDetail_ofCustomerDto } from '../../services/dat-lich/dto/BookingGetAllItemDto';
import { dbDexie } from '../../lib/dexie/dexieDB';
import PageHoaDonChiTietDto from '../../services/ban_hang/PageHoaDonChiTietDto';
import PageHoaDonDto from '../../services/ban_hang/PageHoaDonDto';
import { TrangThaiCheckin, TypeAction } from '../../lib/appconst';
import utils from '../../utils/utils';
import DialogDraggable from '../../components/Dialog/DialogDraggable';
import { IPropModal } from '../../services/dto/IPropsComponent';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';
import { format } from 'date-fns';

export const CheckIn_TabName = {
    CUSTOMER: 0,
    BOOKING: 1
};
export const ModalCheckin_FormType = {
    CHECK_IN: 1,
    OTHER: 0
};

export interface IPropModalCheckIn extends IPropModal<PageKhachHangCheckInDto> {
    isNew: boolean; // dùng ở Thu ngân: khi muốn thay đổi khách hàng (vì: idChekIn của khách lẻ = empty)
    idChiNhanh?: string;
}

export default function ModalAddCustomerCheckIn(props: IPropModalCheckIn) {
    const { idChiNhanh, idUpdate, isShowModal, typeForm, isNew, onClose, onOK } = props;
    const [currentTab, setCurrentTab] = useState(CheckIn_TabName.BOOKING);
    const [objAlert, setObjAlert] = useState<PropConfirmOKCancel>(new PropConfirmOKCancel({ show: false }));
    const [objCheckIn, setObjCheckIn] = useState<KHCheckInDto>({} as KHCheckInDto);

    useEffect(() => {
        if (isShowModal) {
            // nếu thay đổi khách hàng (từ A -->B)
            if (isNew) {
                setCurrentTab(CheckIn_TabName.BOOKING);
            } else {
                setCurrentTab(CheckIn_TabName.CUSTOMER);
                getInforCheckIn();
            }
        }
    }, [isShowModal]);

    const getInforCheckIn = async () => {
        const dataCheckInDB = await CheckinService.GetInforCheckIn_byId(idUpdate ?? '');
        setObjCheckIn(dataCheckInDB);
    };

    const checkSaveCheckin = async (idCus: string) => {
        if (typeForm == ModalCheckin_FormType.CHECK_IN) {
            const exists = await CheckinService.CheckExistCusCheckin(idCus);
            if (exists) {
                setObjAlert({ ...objAlert, show: true, mes: 'Khách hàng đang check in' });
                return false;
            }
        }

        return true;
    };

    const choseCustomer_fromBooking = async (itemBook: BookingDetail_ofCustomerDto) => {
        const dataChosed: PageKhachHangCheckInDto = new PageKhachHangCheckInDto({
            idCheckIn: '',
            idChiNhanh: idChiNhanh as unknown as null,
            idKhachHang: itemBook?.idKhachHang,
            maKhachHang: itemBook?.maKhachHang,
            tenKhachHang: itemBook?.tenKhachHang,
            soDienThoai: itemBook.soDienThoai,
            tongTichDiem: 0,
            txtTrangThaiCheckIn: 'Đang thực hiện',
            dateTimeCheckIn: format(new Date(), 'yyyy-MM-dd')
        });

        const idCheckIn = await saveCheckIn(dataChosed, CheckIn_TabName.BOOKING);
        await CheckinService.InsertCheckInHoaDon({
            idCheckIn: idCheckIn,
            idBooking: itemBook?.idBooking
        } as ICheckInHoaDonto);
        // save to cache hdDB
        await addDataBooking_toCacheHD(itemBook, idCheckIn);
        dataChosed.idCheckIn = idCheckIn;
        onOK(isNew ? TypeAction.INSEART : TypeAction.UPDATE, dataChosed);
    };

    const choseCustomer_fromTabKhachHang = async (cusChosed: KhachHangItemDto) => {
        const idKhachHang = cusChosed?.id.toString() ?? '';
        const check = await checkSaveCheckin(idKhachHang);
        if (!check) {
            return;
        }

        const dataChosed: PageKhachHangCheckInDto = new PageKhachHangCheckInDto({
            idKhachHang: idKhachHang,
            idChiNhanh: idChiNhanh as unknown as null,
            idCheckIn: '',
            dateTimeCheckIn: format(new Date(), 'yyyy-MM-dd'),
            maKhachHang: 'KL',
            tenKhachHang: 'Khách lẻ',
            soDienThoai: '',
            tongTichDiem: 0,
            ghiChu: '',
            txtTrangThaiCheckIn: 'Đang chờ'
        });

        // if change customer --> khachle
        if (cusChosed === null) {
            if (!utils.checkNull_OrEmpty(idUpdate)) {
                // remove checkin
                await CheckinService.UpdateTrangThaiCheckin(idUpdate ?? '', TrangThaiCheckin.DELETED);
                // const hdCache = dbDexie.hoaDon.where('idCheckIn').equals(idUpdate).delete();
            }
            dataChosed.idKhachHang = Guid.EMPTY;
            dataChosed.idCheckIn = Guid.EMPTY;

            // remove cache
        } else {
            dataChosed.idKhachHang = cusChosed?.id.toString();
            dataChosed.maKhachHang = cusChosed?.maKhachHang;
            dataChosed.tenKhachHang = cusChosed?.tenKhachHang;
            dataChosed.soDienThoai = cusChosed?.soDienThoai;
            const idCheckIn = await saveCheckIn(dataChosed, CheckIn_TabName.CUSTOMER);
            dataChosed.idCheckIn = idCheckIn;
        }
        onOK(isNew ? TypeAction.INSEART : TypeAction.UPDATE, dataChosed);
    };

    const saveCheckIn = async (cusChosed: PageKhachHangCheckInDto, tabActive = 0): Promise<string> => {
        const idKhachHang = cusChosed.idKhachHang ?? '';
        // vì trangthaiCheckin: đang tính theo tổng số dịch vụ đang có (hoaDonChiTiet.length)
        // nên: nếu khách hàng có lịch hẹn và checkin: auto set trạng thái = Đang thực hiện
        // ngược lại: nếu chọn check in từ tab khách hàng: trạng thái = Đang chờ
        const newObjCheckin: KHCheckInDto = new KHCheckInDto({
            idKhachHang: idKhachHang,
            idChiNhanh: idChiNhanh,
            trangThai: tabActive === CheckIn_TabName.BOOKING ? TrangThaiCheckin.DOING : TrangThaiCheckin.WAITING
        });

        if (utils.checkNull_OrEmpty(idUpdate)) {
            const dataCheckIn = await CheckinService.InsertCustomerCheckIn(newObjCheckin);
            return dataCheckIn.id;
        } else {
            // only change customer
            newObjCheckin.id = objCheckIn.id;
            newObjCheckin.idKhachHang = cusChosed?.idKhachHang ?? '';
            newObjCheckin.dateTimeCheckIn = objCheckIn.dateTimeCheckIn;
            newObjCheckin.idChiNhanh = objCheckIn.idChiNhanh;
            newObjCheckin.ghiChu = objCheckIn.ghiChu;
            await CheckinService.UpdateCustomerCheckIn(newObjCheckin);
            return idUpdate ?? '';
        }
    };

    const addDataBooking_toCacheHD = async (itemBook: BookingDetail_ofCustomerDto, idCheckIn: string) => {
        // always add new cache hoadon
        const hoadonCT = [];
        let tongTienHang = 0;

        for (let i = 0; i < itemBook?.details?.length; i++) {
            const itFor = itemBook?.details[i];
            const newCT = new PageHoaDonChiTietDto({
                idDonViQuyDoi: itFor.idDonViQuyDoi as unknown as null,
                maHangHoa: itFor.maHangHoa,
                tenHangHoa: itFor.tenHangHoa,
                giaBan: itFor.giaBan,
                idNhomHangHoa: itFor.idNhomHangHoa as unknown as null,
                idHangHoa: itFor.idHangHoa as unknown as null,
                soLuong: 1
            });
            hoadonCT.push(newCT);
            tongTienHang += itFor.giaBan;
        }
        // create cache hd with new id
        const hoadon = new PageHoaDonDto({
            idChiNhanh: idChiNhanh,
            idKhachHang: itemBook?.idKhachHang as unknown as null,
            maKhachHang: itemBook?.maKhachHang,
            tenKhachHang: itemBook?.tenKhachHang,
            soDienThoai: itemBook?.soDienThoai,
            tongTienHang: tongTienHang
        });
        hoadon.idCheckIn = idCheckIn;
        hoadon.tongTienHangChuaChietKhau = tongTienHang;
        hoadon.tongTienHDSauVAT = tongTienHang;
        hoadon.tongThanhToan = tongTienHang;
        hoadon.hoaDonChiTiet = hoadonCT;
        await dbDexie.hoaDon.add(hoadon);
    };

    const handleChangeTab = (value: number) => {
        setCurrentTab(value);
    };
    return (
        <>
            <Dialog
                open={isShowModal}
                onClose={onClose}
                fullWidth
                maxWidth="lg"
                aria-labelledby="dialogIdTitle"
                //PaperComponent={DialogDraggable}
                sx={{
                    '& .MuiDialog-paperScrollPaper': {
                        overflowX: 'hidden'
                    }
                }}>
                <SnackbarAlert
                    showAlert={objAlert.show}
                    type={objAlert.type}
                    title={objAlert.mes}
                    handleClose={() =>
                        setObjAlert({ show: false, mes: '', type: 1 } as PropConfirmOKCancel)
                    }></SnackbarAlert>
                <DialogTitle
                    id="dialogIdTitle"
                    sx={{
                        display: 'flex',
                        position: 'sticky',
                        top: '0',
                        left: '0',
                        bgcolor: '#fff',
                        zIndex: '5',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%'
                    }}>
                    <Box fontWeight="700!important" fontSize="24px">
                        {isNew ? 'Thêm khách check-in' : 'Thay đổi khách hàng'}
                    </Box>
                    <IconButton
                        onClick={onClose}
                        sx={{
                            '&:hover svg': {
                                filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                            }
                        }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ overflow: 'visible' }}>
                    {/* thu ngân: nếu thay đổi khách hàng --> ẩn tab */}
                    {isNew && (
                        <Stack
                            direction="row"
                            gap="32px"
                            sx={{
                                '& button': {
                                    minWidth: 'unset',
                                    padding: '0',
                                    transition: '.4s'
                                }
                            }}>
                            <Button
                                sx={{
                                    color: currentTab === 1 ? 'var(--color-main)' : '#999699',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: '-5px',
                                        transition: '.4s',
                                        left: currentTab === 1 ? '0' : 'calc(100% + 32px)',
                                        width: currentTab === 1 ? '100%' : '77.2px',
                                        borderTop: '2px solid var(--color-main)'
                                    }
                                }}
                                variant="text"
                                onClick={() => handleChangeTab(1)}>
                                Cuộc hẹn
                            </Button>
                            <Button
                                sx={{ color: currentTab === 2 ? 'var(--color-main)' : '#999699' }}
                                variant="text"
                                onClick={() => handleChangeTab(2)}>
                                Khách hàng
                            </Button>
                        </Stack>
                    )}

                    <Box sx={{ marginTop: '20px' }}>
                        {currentTab === CheckIn_TabName.BOOKING ? (
                            <TabCuocHen handleChoseCusBooking={choseCustomer_fromBooking} />
                        ) : (
                            <TabKhachHang handleChoseCus={choseCustomer_fromTabKhachHang} isShowKhachLe={!isNew} />
                        )}
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
