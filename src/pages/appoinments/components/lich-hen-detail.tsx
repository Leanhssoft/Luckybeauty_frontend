import { FC, useEffect, useState } from 'react';
import AppConsts, { TrangThaiCheckin } from '../../../lib/appconst';
import bookingStore from '../../../stores/bookingStore';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';
import CoPresentOutlinedIcon from '@mui/icons-material/CoPresentOutlined';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import {
    Avatar,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    Step,
    Stepper,
    StepLabel,
    Typography
} from '@mui/material';
import { observer } from 'mobx-react';
import { format as formatDate } from 'date-fns';
import { vi } from 'date-fns/locale';
import datLichService from '../../../services/dat-lich/datLichService';
import { enqueueSnackbar } from 'notistack';
import utils from '../../../utils/utils';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { ICheckInHoaDonto, KHCheckInDto } from '../../../services/check_in/CheckinDto';
import CheckinService from '../../../services/check_in/CheckinService';
import Cookies from 'js-cookie';
import TrangThaiBooking from '../../../enum/TrangThaiBooking';
import { dbDexie } from '../../../lib/dexie/dexieDB';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import { PropConfirmOKCancel } from '../../../utils/PropParentToChild';

const LichHenDetail: FC = () => {
    const [firstCharCustomer, setfirstCharCustomer] = useState('');
    const [trangThaiBook, setTrangThaiBook] = useState(0);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const [inforDelete, setinforDelete] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });

    useEffect(() => {
        if (bookingStore.bookingInfoDto?.tenKhachHang !== undefined) {
            const allChar = utils.getFirstLetter(bookingStore.bookingInfoDto?.tenKhachHang);
            if (allChar != undefined) {
                if (allChar.length > 2) {
                    setfirstCharCustomer(allChar.substring(0, 2));
                } else {
                    setfirstCharCustomer(allChar);
                }
            } else {
                setfirstCharCustomer('');
            }
        }
    }, [bookingStore.bookingInfoDto?.tenKhachHang]);

    const onClickEditLichHen = async () => {
        bookingStore.isShowCreateOrEdit = true;
        await bookingStore.getForEditBooking(bookingStore.bookingInfoDto?.id);
    };

    const onCloseThisForm = async () => {
        await bookingStore.onShowBookingInfo();
        bookingStore.idBooking = AppConsts.guidEmpty;
    };

    const huyLichHen = async () => {
        const arrIdCheckin = await CheckinService.GetArrIdChecking_fromIdBooking(bookingStore?.bookingInfoDto.id);
        if (arrIdCheckin != null && arrIdCheckin.length > 0) {
            const idCheckIn = arrIdCheckin[0];
            await CheckinService.UpdateTrangThaiCheckin(idCheckIn, TrangThaiCheckin.DELETED);

            const dataCheckIn_Dexie = await dbDexie.hoaDon.where('idCheckIn').equals(idCheckIn).toArray();
            if (dataCheckIn_Dexie.length > 0) {
                await dbDexie.hoaDon.delete(dataCheckIn_Dexie[0].id);
            }
        }
        setinforDelete(
            new PropConfirmOKCancel({
                show: false,
                title: '',
                mes: ''
            })
        );
        setObjAlert({
            ...objAlert,
            mes: 'Hủy khách hàng checkin thành công',
            show: true,
            type: 1
        });

        // update trangThaiBooking
        const result = await datLichService.UpdateTrangThaiBooking(bookingStore.bookingInfoDto?.id, trangThaiBook);
        enqueueSnackbar(result.message, {
            variant: result.status,
            autoHideDuration: 3000
        });
        await bookingStore.onShowBookingInfo();
        await bookingStore.getData();
    };

    const updateTrangThai = async (trangThai: number) => {
        const trangThaiOld = bookingStore?.bookingInfoDto.trangThai;
        if (trangThai === trangThaiOld) return;
        setTrangThaiBook(trangThai);

        if (trangThaiOld === TrangThaiBooking.Success) {
            setObjAlert({
                ...objAlert,
                mes: 'Lịch hẹn đã hoàn thành. Không cập nhật lại trạng thái',
                show: true,
                type: 2
            });
            return;
        }
        // insert to kh_checkin (thungan)
        switch (trangThai) {
            case TrangThaiBooking.CheckIn:
                {
                    const idBooking = bookingStore?.bookingInfoDto?.id;
                    const itemBooking = await datLichService.GetInforBooking_byID(idBooking);
                    if (itemBooking.length > 0) {
                        const idChiNhanh = Cookies.get('IdChiNhanh')?.toString() as string;
                        const objCheckIn: KHCheckInDto = new KHCheckInDto({
                            idKhachHang: itemBooking[0].idKhachHang,
                            idChiNhanh: idChiNhanh,
                            trangThai: TrangThaiCheckin.WAITING
                        });
                        const dataCheckIn = await CheckinService.InsertCustomerCheckIn(objCheckIn);
                        // save to Booking_Checkin_HD
                        await CheckinService.InsertCheckInHoaDon({
                            idCheckIn: dataCheckIn.id,
                            idBooking: itemBooking[0].idBooking
                        } as ICheckInHoaDonto);

                        // save to cache HoaDon (indexDB)
                        await bookingStore.addDataBooking_toCacheHD(itemBooking[0], dataCheckIn.id);
                    }
                }
                break;
            case TrangThaiBooking.Success:
                {
                    setObjAlert({
                        ...objAlert,
                        mes: 'Trạng thái này được cập nhật tự động Hoàn thành hóa đơn',
                        show: true,
                        type: 2
                    });
                    return;
                }
                break;
            case TrangThaiBooking.Wait:
            case TrangThaiBooking.Confirm:
                {
                    // if trangThaiOld = checkin --> remove checkin at thungan
                    if (trangThaiOld === TrangThaiBooking.CheckIn) {
                        setinforDelete(
                            new PropConfirmOKCancel({
                                show: true,
                                title: 'Hủy khách hàng check in',
                                mes: `Khách hàng đang checkin. Bạn có muốn hủy checkin không?`
                            })
                        );
                        return;
                    }
                }
                break;
        }
        const result = await datLichService.UpdateTrangThaiBooking(bookingStore.bookingInfoDto?.id, trangThai);
        enqueueSnackbar(result.message, {
            variant: result.status,
            autoHideDuration: 3000
        });
        await bookingStore.onShowBookingInfo();
        await bookingStore.getData();
    };

    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <ConfirmDelete
                isShow={inforDelete.show}
                title={inforDelete.title}
                mes={inforDelete.mes}
                onOk={huyLichHen}
                onCancel={() => setinforDelete({ ...inforDelete, show: false })}></ConfirmDelete>
            <Dialog open={bookingStore.isShowBookingInfo} maxWidth="sm" fullWidth onClose={onCloseThisForm}>
                <DialogTitle sx={{ backgroundColor: bookingStore?.bookingInfoDto?.color, color: 'white' }}>
                    <Stack direction={'row'} spacing={1}>
                        <span>Thông tin cuộc hẹn</span>
                        <CreateOutlinedIcon titleAccess="Chỉnh sửa lịch hẹn" onClick={onClickEditLichHen} />
                    </Stack>

                    <CloseOutlinedIcon
                        onClick={onCloseThisForm}
                        sx={{
                            position: 'absolute',
                            right: '16px',
                            top: '16px',
                            minWidth: 35,
                            minHeight: 35,
                            '&:hover': {
                                filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                            }
                        }}
                    />
                </DialogTitle>
                <DialogContent sx={{ fontSize: '15px' }}>
                    <Grid container spacing={2} marginTop={0}>
                        <Grid item xs={12}>
                            <Grid container padding={'16px 16px 0px 0px'} spacing={2} alignItems={'center'}>
                                <Grid item xs={2} sm={3} md={3}>
                                    <Typography
                                        sx={{ fontSize: '15px', display: { xs: 'none', md: 'block', sm: '', lg: '' } }}>
                                        Thời gian
                                    </Typography>
                                    <QueryBuilderOutlinedIcon
                                        sx={{ display: { xs: '', md: 'none', sm: 'none', lg: 'none' } }}
                                    />
                                </Grid>
                                <Grid item xs={10} sm={9} md={9} lg={9}>
                                    <Stack spacing={1} direction={'row'}>
                                        <Stack>
                                            {formatDate(
                                                new Date(bookingStore.bookingInfoDto.bookingDate),
                                                'iii, dd/MM/yyyy',
                                                {
                                                    locale: vi
                                                }
                                            )}
                                        </Stack>
                                        <Stack>
                                            {bookingStore.bookingInfoDto.startTime} -{' '}
                                            {bookingStore.bookingInfoDto.endTime}
                                        </Stack>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container padding={'16px 16px 0px 0px'} alignItems={'center'} spacing={2}>
                                <Grid item xs={2} sm={3} md={3} lg={3}>
                                    <Typography
                                        sx={{ fontSize: '15px', display: { xs: 'none', md: 'block', sm: '', lg: '' } }}>
                                        Khách hàng
                                    </Typography>
                                    <CoPresentOutlinedIcon
                                        sx={{ display: { xs: '', md: 'none', sm: 'none', lg: 'none' } }}
                                    />
                                </Grid>

                                <Grid item xs={10} sm={9} md={9} lg={9}>
                                    <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                        <Stack>
                                            {bookingStore.bookingInfoDto?.avatarKhachHang ? (
                                                <Avatar
                                                    src={bookingStore.bookingInfoDto?.avatarKhachHang}
                                                    sx={{ width: 24, height: 24 }}
                                                />
                                            ) : (
                                                <Avatar
                                                    sx={{
                                                        width: 30,
                                                        height: 30,
                                                        fontSize: '12px',
                                                        color: 'white',
                                                        backgroundColor: bookingStore.bookingInfoDto?.color
                                                    }}>
                                                    {firstCharCustomer}
                                                </Avatar>
                                            )}
                                        </Stack>
                                        <Stack spacing={1}>
                                            <Stack sx={{ fontWeight: 600 }}>
                                                {bookingStore?.bookingInfoDto?.tenKhachHang}
                                            </Stack>
                                            <Stack sx={{ fontSize: '12px', color: '#a7b2bb' }}>
                                                {bookingStore.bookingInfoDto?.soDienThoai}
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container padding={'16px 16px 0px 0px'} spacing={2} alignItems={'center'}>
                                <Grid item xs={2} sm={3} md={3} lg={3}>
                                    <Typography
                                        sx={{ fontSize: '15px', display: { xs: 'none', md: 'block', sm: '', lg: '' } }}>
                                        Dịch vụ
                                    </Typography>
                                    <SpaOutlinedIcon sx={{ display: { xs: '', md: 'none', sm: 'none', lg: 'none' } }} />
                                </Grid>
                                <Grid item xs={10} sm={9} md={9} lg={9}>
                                    {bookingStore.bookingInfoDto.tenDichVu}
                                </Grid>
                            </Grid>
                        </Grid>

                        {bookingStore.bookingInfoDto.trangThai === 0 ? (
                            <Grid item xs={12}>
                                <Grid container padding={'16px 16px 0px 0px'} spacing={2} alignItems={'center'}>
                                    <Grid item xs={2} sm={3} md={3} lg={3}>
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                display: { xs: 'none', md: 'block', sm: '', lg: '' }
                                            }}>
                                            Trạng thái
                                        </Typography>
                                        <SpaOutlinedIcon
                                            sx={{ display: { xs: '', md: 'none', sm: 'none', lg: 'none' } }}
                                        />
                                    </Grid>
                                    <Grid item xs={10} sm={9} md={9} lg={9} style={{ fontWeight: 600 }}>
                                        Đã hủy
                                    </Grid>
                                </Grid>
                            </Grid>
                        ) : (
                            <Grid item xs={12}>
                                <Stepper
                                    activeStep={bookingStore.bookingInfoDto?.trangThai - 1}
                                    alternativeLabel
                                    sx={{ paddingTop: '16px', paddingBottom: '16px' }}>
                                    {AppConsts.trangThaiBooking
                                        .filter((x) => x.value !== 0)
                                        .map((item) => (
                                            <Step
                                                key={item.value}
                                                sx={{
                                                    '& .MuiSvgIcon-root ': {
                                                        width: 30,
                                                        height: 30
                                                    },
                                                    '& .MuiStepIcon-root': {
                                                        cursor: 'pointer'
                                                    },
                                                    '& .MuiStepIcon-root:hover': {
                                                        color: 'var(--color-bg)'
                                                    },
                                                    ' & .MuiStepIcon-root.Mui-active': {
                                                        color: bookingStore?.bookingInfoDto?.color
                                                    }
                                                }}
                                                onClick={() => updateTrangThai(item.value)}>
                                                <StepLabel title="Click vào đây để cập nhật trạng thái">
                                                    {item.name}
                                                </StepLabel>
                                            </Step>
                                        ))}
                                </Stepper>
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <Stack direction={'row'} spacing={1} justifyContent={'flex-end'} paddingTop={3}>
                                <Button variant="outlined" onClick={onCloseThisForm} startIcon={<BlockOutlinedIcon />}>
                                    Đóng
                                </Button>
                                {bookingStore.bookingInfoDto.trangThai !== 0 && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DeleteOutlinedIcon />}
                                        onClick={() => {
                                            setinforDelete({
                                                ...inforDelete,
                                                show: true,
                                                title: 'Xác nhận hủy',
                                                mes: `Bạn có chắc chắn muốn hủy lịch hẹn ${bookingStore?.bookingInfoDto?.tenDichVu} của khách ${bookingStore?.bookingInfoDto?.tenKhachHang} không?`
                                            });
                                        }}>
                                        Hủy lịch hẹn
                                    </Button>
                                )}
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
};
export default observer(LichHenDetail);
