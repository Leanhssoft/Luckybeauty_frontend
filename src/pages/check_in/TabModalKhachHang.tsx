import { useState, useEffect, useRef } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    InputAdornment,
    Avatar,
    debounce,
    Stack,
    Pagination
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { ReactComponent as AddIcon } from '../../images/add.svg';
import '../../pages/customer/customerPage.css';

import useWindowWidth from '../../components/StateWidth';
import CreateOrEditCustomerDialog from '../customer/components/create-or-edit-customer-modal';
import { CreateOrEditKhachHangDto } from '../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import { Guid } from 'guid-typescript';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';
import khachHangService from '../../services/khach-hang/khachHangService';
import { PagedKhachHangResultRequestDto } from '../../services/khach-hang/dto/PagedKhachHangResultRequestDto';
import { format } from 'date-fns';
import BadgeFistCharOfName from '../../components/Badge/FistCharOfName';
import utils from '../../utils/utils';
import abpCustom from '../../components/abp-custom';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import { KhachHangDto } from '../../services/khach-hang/dto/KhachHangDto';
import { LabelDisplayedRows } from '../../components/Pagination/LabelDisplayedRows';
const TabKhachHang = ({ handleChoseCus, isShowKhachLe = false }: any) => {
    const firsLoad = useRef(true);
    const windowWidth = useWindowWidth();

    const [isShowModalAddCus, setIsShowModalAddCus] = useState(false);
    const [newCus, setNewCus] = useState<CreateOrEditKhachHangDto>({} as CreateOrEditKhachHangDto);
    const [pageDataCustomer, setPageDataCustomer] = useState<PagedResultDto<KhachHangItemDto>>();

    const [paramSearch, setParamSearch] = useState<PagedKhachHangResultRequestDto>({
        keyword: '',
        maxResultCount: isShowKhachLe ? 8 : 9, // nếu hiện khachle --> get 8 khachhang
        skipCount: 1
    } as PagedKhachHangResultRequestDto);

    const GetKhachHang_noBooking = async (paramSearch: PagedKhachHangResultRequestDto) => {
        const data = await khachHangService.GetKhachHang_noBooking(paramSearch);
        setPageDataCustomer({
            ...pageDataCustomer,
            items: data?.items,
            totalCount: data?.totalCount,
            totalPage: Math.ceil(data?.totalCount / paramSearch?.maxResultCount)
        });
    };

    const handleChangePage = (event: any, value: number) => {
        setParamSearch({ ...paramSearch, skipCount: value });
    };

    const debounceDropDown = useRef(
        debounce(async (paramSearch) => {
            await GetKhachHang_noBooking(paramSearch);
        }, 500)
    ).current;

    useEffect(() => {
        if (firsLoad.current) {
            firsLoad.current = false;
            return;
        }
        paramSearch.skipCount = 1;
        debounceDropDown(paramSearch);
    }, [paramSearch.keyword]);

    useEffect(() => {
        if (firsLoad.current) {
            firsLoad.current = false;
            return;
        }
        GetKhachHang_noBooking(paramSearch);
    }, [paramSearch.skipCount]);

    const changeCustomer = (dataSave: KhachHangItemDto | null) => {
        setIsShowModalAddCus(false);
        handleChoseCus(dataSave, 0);
    };

    const saveOKCustomer = (cusNew: KhachHangDto) => {
        setIsShowModalAddCus(false);

        const data: KhachHangItemDto = {
            id: cusNew?.id,
            maKhachHang: cusNew?.maKhachHang,
            tenKhachHang: cusNew?.tenKhachHang,
            avatar: cusNew?.avatar,
            soDienThoai: cusNew?.soDienThoai,
            diaChi: cusNew?.diaChi,
            tongTichDiem: 0,
            cuocHenGanNhat: new Date()
        };

        handleChoseCus(data, 0);
    };

    const showModalAddCus = () => {
        setIsShowModalAddCus(true);
        setNewCus({
            id: Guid.EMPTY,
            maKhachHang: '',
            tenKhachHang: '',
            soDienThoai: '',
            diaChi: '',
            idNhomKhach: '',
            idNguonKhach: '',
            gioiTinhNam: false,
            moTa: ''
        } as CreateOrEditKhachHangDto);
    };

    return (
        <Box>
            <CreateOrEditCustomerDialog
                visible={isShowModalAddCus}
                onCancel={() => setIsShowModalAddCus(false)}
                onOk={saveOKCustomer}
                title="Thêm mới khách hàng"
                formRef={newCus}
            />
            <Grid container rowGap={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        size="small"
                        fullWidth
                        sx={{ maxWidth: '375px' }}
                        placeholder="Tìm kiếm"
                        value={paramSearch.keyword}
                        onChange={(e) => setParamSearch({ ...paramSearch, keyword: e.target.value })}
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
                            display: abpCustom.isGrandPermission('Pages.KhachHang.Create') ? '' : 'none'
                        }}
                        startIcon={<AddIcon />}
                        className="btn-container-hover"
                        onClick={showModalAddCus}>
                        Thêm khách hàng mới
                    </Button>
                </Grid>
            </Grid>

            <Grid container spacing={2} mt="0">
                {isShowKhachLe && (
                    <Grid item sm={6} md={4} xs={12}>
                        <Stack
                            onClick={() => changeCustomer(null)}
                            justifyContent="space-between"
                            height={'100%'}
                            spacing={1}
                            sx={{
                                padding: '18px',
                                border: '1px solid #E6E1E6',
                                borderRadius: '8px',
                                boxShadow: '1px 4px 40px #28293D14',
                                transition: '.4s',
                                cursor: 'pointer',
                                '&:hover': {
                                    borderColor: 'var(--color-main)'
                                }
                            }}>
                            <Stack spacing={2} direction={'row'}>
                                <Avatar sx={{ width: 40, height: 40 }} />
                                <Stack justifyContent={'space-evenly'} maxWidth={'calc(100% - 44px)'}>
                                    <Typography variant="subtitle2" className="lableOverflow">
                                        {'Khách lẻ'}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Grid>
                )}

                {pageDataCustomer?.items?.map((item, index) => (
                    <Grid item key={index} sm={6} md={4} xs={12}>
                        <Stack
                            onClick={() => changeCustomer(item)}
                            justifyContent="space-between"
                            height={'100%'}
                            spacing={1}
                            sx={{
                                padding: '18px',
                                border: '1px solid #E6E1E6',
                                borderRadius: '8px',
                                boxShadow: '1px 4px 4px #28293D14',
                                transition: '.4s',
                                cursor: 'pointer',
                                '&:hover': {
                                    borderColor: 'var(--color-main)'
                                }
                            }}>
                            <Stack spacing={2} direction={'row'}>
                                {utils.checkNull(item.avatar) ? (
                                    <BadgeFistCharOfName firstChar={utils.getFirstLetter(item?.tenKhachHang ?? '')} />
                                ) : (
                                    <Avatar src={item.avatar} sx={{ width: 40, height: 40 }} />
                                )}
                                <Stack justifyContent={'space-evenly'} maxWidth={'calc(100% - 44px)'}>
                                    <Typography variant="subtitle2" className="lableOverflow" title={item.tenKhachHang}>
                                        {item.tenKhachHang}
                                    </Typography>
                                    <Typography variant="caption" color="#999699">
                                        {item.soDienThoai}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Stack direction={'row'} spacing={2}>
                                <Stack>
                                    <Typography variant="body2">Checkin</Typography>
                                    <Typography variant="body2" mt={'2px'}>
                                        Gần nhất
                                    </Typography>
                                </Stack>
                                <Stack>
                                    <Typography variant="body2" fontWeight={700}>
                                        {item.soLanCheckIn} lần
                                    </Typography>
                                    <Typography variant="body2" mt={'2px'}>
                                        {format(new Date(item.cuocHenGanNhat), 'dd/MM/yyyy HH:mm')}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Grid>
                ))}
            </Grid>
            <Grid container mt={2}>
                <Grid item xs={12}>
                    <Stack spacing={1} direction={'row'} justifyContent={'center'}>
                        <LabelDisplayedRows
                            currentPage={paramSearch?.skipCount ?? 0}
                            pageSize={paramSearch?.maxResultCount}
                            totalCount={pageDataCustomer?.totalCount}
                        />
                        <Pagination
                            shape="circular"
                            count={pageDataCustomer?.totalPage}
                            page={paramSearch?.skipCount}
                            defaultPage={1}
                            onChange={handleChangePage}
                        />
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};
export default TabKhachHang;
