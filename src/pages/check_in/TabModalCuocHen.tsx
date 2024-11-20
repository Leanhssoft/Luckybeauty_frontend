import React, { useEffect, useRef, useState } from 'react';
import { Box, TextField, Button, Typography, Grid, InputAdornment, Stack, debounce, Pagination } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';
import { ReactComponent as AddIcon } from '../../images/add.svg';
import { ReactComponent as ClockIcon } from '../../images/clock.svg';
import useWindowWidth from '../../components/StateWidth';
import { BookingDetailDto, BookingDetail_ofCustomerDto } from '../../services/dat-lich/dto/BookingGetAllItemDto';
import CreateOrEditLichHenModal from '../appoinments/components/create-or-edit-lich-hen';
import datLichService from '../../services/dat-lich/datLichService';
import { BookingRequestDto } from '../../services/dat-lich/dto/PagedBookingResultRequestDto';
import { format } from 'date-fns';
import suggestStore from '../../stores/suggestStore';
import BadgeFistCharOfName from '../../components/Badge/FistCharOfName';
import utils from '../../utils/utils';
import abpCustom from '../../components/abp-custom';
import TrangThaiBooking from '../../enum/TrangThaiBooking';
import { LabelDisplayedRows } from '../../components/Pagination/LabelDisplayedRows';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import PageEmpty from '../../components/PageEmpty';
import Loading from '../../components/Loading';
const TabCuocHen = ({ handleChoseCusBooking }: any) => {
    const arrTrangThaiBook = [
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

    const isFirstLoad = useRef(true);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isShowModalLichHen, setIsShowModalLichHen] = useState(false);
    const [listCusBooking, setListCusBooking] = useState<PagedResultDto<BookingDetail_ofCustomerDto>>({
        items: [],
        totalCount: 0,
        totalPage: 0
    });
    const [paramSearch, setParamSearch] = useState<BookingRequestDto>(
        new BookingRequestDto(
            { currentPage: 0, trangThaiBook: 3, pageSize: 1000 } // 0.xoa 1.chua xacnhan, 2.da xacnhan, 3.all
        )
    );

    const GetListCustomer_wasBooking = async (paramSearch: BookingRequestDto) => {
        setIsLoadingData(true);
        const data = await datLichService.GetKhachHang_Booking(paramSearch);
        setListCusBooking({
            ...listCusBooking,
            items: data?.items,
            totalCount: data?.totalCount,
            totalPage: Math.ceil(data?.totalCount / (paramSearch?.pageSize ?? 16))
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
    useEffect(() => {
        // khachhang, nvien, dichvu: mục đích chỉ để get thông tin cho form them lich hen
        GetAllListCustomer();
        GetAllDichVu();
        GetAllKyThuatVien();
    }, []);

    const choseBooking = async (itemBook: BookingDetail_ofCustomerDto) => {
        const dataCus = { ...itemBook };
        handleChoseCusBooking(dataCus, 1);
    };

    const debounceCustomer = useRef(
        debounce(async (paramSearch) => {
            await GetListCustomer_wasBooking(paramSearch);
        }, 500)
    ).current;

    useEffect(() => {
        debounceCustomer(paramSearch);
    }, [paramSearch.textSearch]);

    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            return;
        }
        GetListCustomer_wasBooking(paramSearch);
    }, [paramSearch.trangThaiBook, paramSearch.currentPage]);

    const showModalAddLichHen = () => {
        setIsShowModalLichHen(true);
    };

    const saveLichHenOK = async (idBooking = '') => {
        setIsShowModalLichHen(false);
        const newBooking = await datLichService.GetInforBooking_byID(idBooking);
        if (newBooking != null && newBooking.length > 0) {
            // nếu trạng thái = checkin: đóng modal checkin và thêm vào thungan
            if (newBooking[0].trangThai === TrangThaiBooking.CheckIn) {
                choseBooking(newBooking[0]);
            } else {
                setListCusBooking({
                    ...listCusBooking,
                    items: [newBooking[0], ...(listCusBooking?.items ?? [])],
                    totalCount: listCusBooking?.totalCount + 1
                });
            }
        }
    };

    const windowWidth = useWindowWidth();

    if (isLoadingData) return <Loading />;

    return (
        <>
            <CreateOrEditLichHenModal
                visible={isShowModalLichHen}
                onCancel={() => {
                    setIsShowModalLichHen(false);
                }}
                onOk={saveLichHenOK}
                idLichHen=""
            />
            <Grid container rowSpacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        size="small"
                        fullWidth
                        sx={{ maxWidth: '375px' }}
                        placeholder="Tìm kiếm"
                        value={paramSearch.textSearch}
                        onChange={(e) => setParamSearch({ ...paramSearch, textSearch: e.target.value })}
                        InputProps={{
                            startAdornment: (
                                <>
                                    <InputAdornment position="start">
                                        <SearchOutlinedIcon />
                                    </InputAdornment>
                                </>
                            )
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        fullWidth={window.screen.width < 768 ? true : false}
                        variant="contained"
                        sx={{
                            bgcolor: 'var(--color-main)',
                            marginLeft: windowWidth > 600 ? 'auto' : '0',
                            height: 'fit-content',
                            display: abpCustom.isGrandPermission('Pages.Booking.Create') ? '' : 'none'
                        }}
                        startIcon={<AddIcon />}
                        className="btn-container-hover"
                        onClick={showModalAddLichHen}>
                        Thêm cuộc hẹn mới
                    </Button>
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', gap: '24px', marginY: '16px' }}>
                {arrTrangThaiBook.map((item, index) => (
                    <Button
                        onClick={() => setParamSearch({ ...paramSearch, trangThaiBook: item.id })}
                        key={index}
                        variant="outlined"
                        sx={{
                            padding: '4px 8px',
                            borderRadius: '100px',
                            transition: '.4s',
                            minWidth: 'unset',
                            color: 'var(--font-color-main)',
                            fontSize: '12px',
                            border: `1px solid ${
                                paramSearch.trangThaiBook === item.id ? 'transparent' : '#E6E1E6'
                            }!important`,
                            bgcolor:
                                paramSearch.trangThaiBook === item.id ? 'var(--color-bg)!important' : '#fff!important'
                        }}>
                        {item.text}
                    </Button>
                ))}
            </Box>
            {listCusBooking?.totalCount == 0 ? (
                <PageEmpty style={{ height: '60vh' }} />
            ) : (
                <>
                    <Grid container spacing={2}>
                        {listCusBooking?.items?.map((item, indexBooking) => (
                            <Grid item key={indexBooking} sm={6} md={4} xs={12}>
                                <Stack
                                    spacing={1}
                                    sx={{
                                        padding: '16px',
                                        border: '1px solid #E6E1E6',
                                        borderRadius: '8px',
                                        boxShadow: '1px 4px 4px #28293D14',
                                        transition: '.4s',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            borderColor: 'var(--color-main)'
                                        },
                                        '& p': {
                                            mb: '0'
                                        },
                                        height: '100%',
                                        justifyContent: 'space-between'
                                    }}
                                    onClick={() => choseBooking(item)}>
                                    <Box
                                        sx={{
                                            display: 'flex'
                                        }}>
                                        <Stack
                                            spacing={2}
                                            direction={'row'}
                                            sx={{ width: '100%' }}
                                            title={item.tenKhachHang}>
                                            {utils.checkNull(item.avatar) ? (
                                                <BadgeFistCharOfName
                                                    firstChar={utils.getFirstLetter(item?.tenKhachHang ?? '')}
                                                />
                                            ) : (
                                                // <Avatar src={item.avatar} sx={{ width: 40, height: 40 }} />
                                                <img
                                                    src={item.avatar}
                                                    style={{ width: 40, height: 40, borderRadius: '100%' }}
                                                />
                                            )}
                                            <Stack sx={{ width: 'calc(100% - 40px)' }} justifyContent={'space-evenly'}>
                                                <Typography
                                                    variant="subtitle2"
                                                    className="lableOverflow"
                                                    maxWidth={250}>
                                                    {item.tenKhachHang}
                                                </Typography>
                                                <Typography fontSize="12px" color="#999699">
                                                    {item.soDienThoai}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Box>
                                    <Stack paddingTop={'4px'}>
                                        {item.details.map((ct: BookingDetailDto, index2) => (
                                            <Stack
                                                direction={'row'}
                                                key={index2}
                                                mt={'2px'}
                                                sx={{
                                                    justifyContent: 'space-between'
                                                }}>
                                                <Typography
                                                    maxWidth={'70%'}
                                                    title={ct.tenHangHoa}
                                                    variant="body2"
                                                    className="lableOverflow">
                                                    {ct.tenHangHoa}
                                                </Typography>

                                                <Typography variant="body2" fontWeight={600}>
                                                    {new Intl.NumberFormat('vi-VN').format(ct.giaBan)}
                                                </Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Stack
                                            direction={'row'}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontSize: '14px',
                                                color: '#666466'
                                            }}>
                                            <Box marginRight="4px">
                                                <ClockIcon />
                                            </Box>
                                            <Typography variant="caption">
                                                {format(new Date(item.startTime), 'HH:mm')}
                                            </Typography>
                                        </Stack>
                                        <Box>
                                            <Typography
                                                variant="caption"
                                                className={
                                                    item.trangThai == TrangThaiBooking.Wait
                                                        ? 'data-grid-cell-trangthai-notActive'
                                                        : 'data-grid-cell-trangthai-active'
                                                }>
                                                {item.txtTrangThaiBook}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Stack>
                            </Grid>
                        ))}
                    </Grid>
                    <Grid container mt={2}>
                        <Grid item xs={12}>
                            <Stack spacing={1} direction={'row'} justifyContent={'center'}>
                                <LabelDisplayedRows
                                    currentPage={(paramSearch?.currentPage ?? 0) + 1}
                                    pageSize={paramSearch?.pageSize}
                                    totalCount={listCusBooking?.totalCount}
                                />
                                <Pagination
                                    shape="circular"
                                    count={listCusBooking?.totalPage}
                                    page={(paramSearch?.currentPage ?? 0) + 1}
                                    defaultPage={1}
                                    onChange={(e, value) =>
                                        setParamSearch({
                                            ...paramSearch,
                                            currentPage: value
                                        })
                                    }
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </>
            )}
        </>
    );
};
export default TabCuocHen;
