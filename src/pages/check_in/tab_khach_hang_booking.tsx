import {
    Avatar,
    Button,
    CircularProgress,
    debounce,
    FormControlLabel,
    Grid,
    Pagination,
    Radio,
    RadioGroup,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import React, { useEffect, useRef, useState } from 'react';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import datLichService from '../../services/dat-lich/datLichService';
import { BookingDetail_ofCustomerDto } from '../../services/dat-lich/dto/BookingGetAllItemDto';
import { BookingRequestDto } from '../../services/dat-lich/dto/PagedBookingResultRequestDto';
import { LabelDisplayedRows } from '../../components/Pagination/LabelDisplayedRows';
import PageEmpty from '../../components/PageEmpty';
import { DateType, LoaiChungTu, TrangThaiCheckin } from '../../lib/appconst';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';
import CreateOrEditLichHenModal from '../appoinments/components/create-or-edit-lich-hen';
import TrangThaiBooking from '../../enum/TrangThaiBooking';
import { addDays, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns';
import suggestStore from '../../stores/suggestStore';
import Loading from '../../components/Loading';

export type IPropsTabKhachHangBooking = {
    txtSearch: string;
    isShowModalAdd?: boolean;
    idChiNhanhChosed: string;
    onCloseModalAddLichHen: () => void;
    onClickAddHoaDon: (customerId: string, loaiHoaDon: number, bookingId?: string) => void;
};

const arrFilterTrangThaiBook = [
    {
        id: 3,
        text: 'Tất cả'
    },
    {
        id: 1,
        text: 'Chưa xác nhận'
    },
    {
        id: 2,
        text: 'Đã xác nhận'
    }
];
const arrFilterDateType = [
    {
        value: DateType.HOM_NAY,
        text: 'Hôm nay'
    },
    {
        value: DateType.NGAY_MAI,
        text: 'Ngày mai'
    },
    {
        value: DateType.TUAN_NAY,
        text: 'Tuần này'
    },
    {
        value: DateType.THANG_NAY,
        text: 'Tháng này'
    },
    {
        value: DateType.TUY_CHON,
        text: 'Tùy chỉnh'
    }
];

const TabKhachHangBooking = (props: IPropsTabKhachHangBooking) => {
    const { txtSearch, idChiNhanhChosed, onClickAddHoaDon, isShowModalAdd, onCloseModalAddLichHen, ...other } = props;
    const firstLoad = useRef(true);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isShowModalLichHen, setIsShowModalLichHen] = useState(false);
    const [dateTypeChosed, setDateTypeChosed] = useState<string>(DateType.HOM_NAY);
    const [paramSearchCus, setParamSearchCus] = useState<BookingRequestDto>({
        currentPage: 0,
        pageSize: 10,
        trangThaiBook: 3, // all
        fromDate: format(new Date(), 'yyyy-MM-dd'),
        toDate: format(addDays(new Date(), 1), 'yyyy-MM-dd')
    } as BookingRequestDto);
    const [listCusBooking, setListCusBooking] = useState<PagedResultDto<BookingDetail_ofCustomerDto>>({
        items: [],
        totalCount: 0,
        totalPage: 0
    });

    useEffect(() => {
        setIsShowModalLichHen(isShowModalAdd ?? false);
    }, [isShowModalAdd]);

    useEffect(() => {
        //setParamSearchCus({ ...paramSearchCus, idChiNhanhs: [idChiNhanhChosed ?? ''] });
    }, [idChiNhanhChosed]);

    const GetListCustomer_wasBooking = async (txtSearch: string) => {
        setIsLoadingData(true);
        paramSearchCus.textSearch = txtSearch;
        const data = await datLichService.GetKhachHang_Booking(paramSearchCus);
        console.log('paramSearchCus ', paramSearchCus, data);
        setListCusBooking({
            ...listCusBooking,
            items: data?.items,
            totalCount: data?.totalCount,
            totalPage: Math.ceil(data?.totalCount / (paramSearchCus?.pageSize ?? 16))
        });
        setIsLoadingData(false);
    };

    const GetAllDichVu = async () => {
        await suggestStore.getSuggestDichVu();
    };

    const GetAllListCustomer = async () => {
        await suggestStore.getSuggestKhachHang();
    };
    const GetAllKyThuatVien = async () => {
        await suggestStore.getSuggestKyThuatVien();
    };

    const PageLoad = async () => {
        await GetAllDichVu();
        await GetAllListCustomer();
        await GetAllKyThuatVien();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    const debounceCustomer = useRef(
        debounce(async (txt) => {
            await GetListCustomer_wasBooking(txt);
        }, 500)
    ).current;

    useEffect(() => {
        debounceCustomer(txtSearch);
    }, [txtSearch]);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        GetListCustomer_wasBooking(txtSearch);
    }, [paramSearchCus]);

    const handleChangeTabFilterDate = (event: React.SyntheticEvent, tabNew: string) => {
        setDateTypeChosed(tabNew);
        let fromDate = paramSearchCus?.fromDate,
            toDate = paramSearchCus?.toDate;
        switch (tabNew) {
            case DateType.HOM_NAY:
                {
                    fromDate = format(new Date(), 'yyyy-MM-dd');
                    toDate = fromDate;
                }
                break;
            case DateType.NGAY_MAI:
                {
                    fromDate = format(addDays(new Date(), 1), 'yyyy-MM-dd');
                    toDate = fromDate;
                }
                break;
            case DateType.TUAN_NAY:
                {
                    fromDate = format(startOfWeek(new Date()), 'yyyy-MM-dd');
                    toDate = format(endOfWeek(new Date()), 'yyyy-MM-dd');
                }
                break;
            case DateType.THANG_NAY:
                {
                    fromDate = format(startOfMonth(new Date()), 'yyyy-MM-dd');
                    toDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');
                }
                break;
        }
        if (toDate) {
            toDate = format(addDays(new Date(toDate), 1), 'yyyy-MM-dd');
        }
        setParamSearchCus({ ...paramSearchCus, fromDate: fromDate, toDate: toDate });
    };

    const addHoaDon = (cusItem: BookingDetail_ofCustomerDto, loaiHoaDon: number) => {
        onClickAddHoaDon(cusItem.idKhachHang, loaiHoaDon, cusItem.idBooking);
    };

    const saveLichHenOK = async (bookingId: string) => {
        const newBooking = await datLichService.GetInforBooking_byID(bookingId);
        if (newBooking != null && newBooking.length > 0) {
            setListCusBooking({
                ...listCusBooking,
                items: [newBooking[0], ...(listCusBooking?.items ?? [])],
                totalCount: (listCusBooking?.totalCount ?? 0) + 1
            });
        }
        onCloseModalAddLichHen();
    };
    if (isLoadingData) {
        return <Loading />;
    }

    return (
        <>
            <Grid container alignItems={'center'}>
                <Grid item lg={3}></Grid>
                <Grid item lg={5}>
                    <Tabs value={dateTypeChosed} onChange={handleChangeTabFilterDate}>
                        {arrFilterDateType.map((item, index) => (
                            <Tab key={index} label={item.text} value={item.value}></Tab>
                        ))}
                    </Tabs>
                </Grid>
                <Grid item lg={4}>
                    <Stack direction={'row'} spacing={1} justifyContent={'end'} alignItems={'center'}>
                        <Typography variant="body2">Trạng thái</Typography>
                        <RadioGroup
                            row
                            value={paramSearchCus?.trangThaiBook}
                            onChange={(e) =>
                                setParamSearchCus({
                                    ...paramSearchCus,
                                    trangThaiBook: parseInt(e.target.value)
                                })
                            }>
                            {arrFilterTrangThaiBook?.map((x) => (
                                <FormControlLabel
                                    sx={{
                                        fontSize: 'var(--font-size-main)'
                                    }}
                                    key={x.id}
                                    value={x.id}
                                    label={x.text}
                                    control={<Radio />}></FormControlLabel>
                            ))}
                        </RadioGroup>
                    </Stack>
                </Grid>
            </Grid>
            {listCusBooking?.totalCount == 0 ? (
                <PageEmpty
                    style={{ height: '80vh' }}
                    icon={<AccessTimeOutlinedIcon style={{ width: 100, height: 100 }} />}
                    text={'Không có khách hàng đặt hẹn'}
                />
            ) : (
                <Grid container spacing={2.5} paddingTop={1}>
                    <CreateOrEditLichHenModal
                        visible={isShowModalLichHen}
                        onCancel={() => onCloseModalAddLichHen()}
                        onOk={saveLichHenOK}
                        idLichHen=""
                    />
                    {listCusBooking?.items?.map((cusItem, index) => (
                        <Grid item key={index} xs={12} sm={4} md={4} lg={3}>
                            <Stack
                                onClick={() => addHoaDon(cusItem, LoaiChungTu.HOA_DON_BAN_LE)}
                                padding={1.5}
                                border={'1px solid transparent'}
                                borderRadius={1}
                                sx={{
                                    transition: '.4s',
                                    boxShadow: '0px 2px 5px 0px #c6bdd1',
                                    backgroundColor: '#fff',
                                    '&:hover': {
                                        borderColor: 'var(--color-main)',
                                        cursor: 'pointer'
                                    }
                                }}>
                                <Stack minHeight={100} justifyContent={'space-between'} spacing={1.5}>
                                    <Stack direction={'row'} padding={1} justifyContent={'space-between'}>
                                        <Stack spacing={2} direction={'row'}>
                                            <Stack>
                                                <Avatar src={cusItem?.avatar} />
                                            </Stack>
                                            <Stack spacing={1}>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={500}
                                                    className="lableOverflow"
                                                    maxWidth={280}
                                                    title={cusItem?.tenKhachHang}>
                                                    {cusItem?.tenKhachHang}
                                                </Typography>
                                                <Typography variant="caption" color={'var( --color-text-blur)'}>
                                                    {cusItem?.soDienThoai}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                    <Stack spacing={1}>
                                        {cusItem?.details?.map((ctLichHen, index) => (
                                            <Stack
                                                key={index}
                                                direction={'row'}
                                                alignItems={'center'}
                                                justifyContent={'space-between'}>
                                                <Typography
                                                    className="lableOverflow"
                                                    variant="body2"
                                                    maxWidth={260}
                                                    title={ctLichHen?.tenHangHoa}>
                                                    {ctLichHen?.tenHangHoa}
                                                </Typography>
                                                <Typography fontWeight={500}>
                                                    {new Intl.NumberFormat('vi-VN').format(ctLichHen?.giaBan ?? 0)}
                                                </Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                        <Stack direction={'row'} spacing={1}>
                                            <ScheduleOutlinedIcon />
                                            <Typography color={'rgb(102, 100, 102)'} variant="body2">
                                                {format(new Date(cusItem?.startTime), 'HH:mm')}
                                            </Typography>
                                        </Stack>
                                        <Stack>
                                            <Typography
                                                variant="body2"
                                                className={
                                                    cusItem?.trangThai === TrangThaiBooking.Wait
                                                        ? 'data-grid-cell-trangthai-notActive'
                                                        : 'data-grid-cell-trangthai-active'
                                                }>
                                                {cusItem?.txtTrangThaiBook}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Grid>
                    ))}
                    <Grid item xs={12} position={'absolute'} bottom={'10px'} width={'100%'}>
                        <Stack direction={'row'} spacing={2} justifyContent={'center'} marginTop={2}>
                            <LabelDisplayedRows
                                currentPage={(paramSearchCus?.currentPage ?? 0) + 1}
                                pageSize={paramSearchCus?.pageSize}
                                totalCount={listCusBooking?.totalCount}
                            />
                            <Pagination
                                shape="circular"
                                sx={{ backgroundColor: 'white' }}
                                count={listCusBooking?.totalPage}
                                page={(paramSearchCus?.currentPage ?? 0) + 1}
                                defaultPage={(paramSearchCus?.currentPage ?? 0) + 1}
                                onChange={(e, value) =>
                                    setParamSearchCus({
                                        ...paramSearchCus,
                                        currentPage: value
                                    })
                                }
                            />
                        </Stack>
                    </Grid>
                </Grid>
            )}
        </>
    );
};
export default TabKhachHangBooking;
