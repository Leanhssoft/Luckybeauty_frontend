import {
    Avatar,
    Badge,
    Button,
    debounce,
    Grid,
    Pagination,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import React, { useEffect, useRef, useState } from 'react';
import { PagedKhachHangResultRequestDto } from '../../services/khach-hang/dto/PagedKhachHangResultRequestDto';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import khachHangService from '../../services/khach-hang/khachHangService';
import { LabelDisplayedRows } from '../../components/Pagination/LabelDisplayedRows';
import { LoaiChungTu, TrangThaiCheckin } from '../../lib/appconst';
import CreateOrEditCustomerDialog from '../customer/components/create-or-edit-customer-modal';
import { CreateOrEditKhachHangDto } from '../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import { Guid } from 'guid-typescript';
import { KhachHangDto } from '../../services/khach-hang/dto/KhachHangDto';
import Loading from '../../components/Loading';
import { KHCheckInDto } from '../../services/check_in/CheckinDto';
import CheckinService from '../../services/check_in/CheckinService';

export type IPropsTabKhachHangNoBooking = {
    txtSearch: string;
    idChiNhanhChosed: string;
    isShowModalAddCustomer?: boolean;
    onClickAddHoaDon: (customerId: string, loaiHoaDon: number, idCheckIn?: string) => void;
    onCloseModalAddCutomer: () => void;
};

export default function TabKhachHangNoBooking(props: IPropsTabKhachHangNoBooking) {
    const { txtSearch, idChiNhanhChosed, onClickAddHoaDon, isShowModalAddCustomer, onCloseModalAddCutomer, ...other } =
        props;
    const firstLoad = useRef(true);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isShowModalAddCus, setIsShowModalAddCus] = useState(false);
    const [newCus, setNewCus] = useState<CreateOrEditKhachHangDto>({} as CreateOrEditKhachHangDto);

    useEffect(() => {
        if (isShowModalAddCus) {
            console.log('isshow ', isShowModalAddCus);
            showModalAddCustomer();
        }
        setIsShowModalAddCus(isShowModalAddCustomer ?? false);
    }, [isShowModalAddCustomer ?? false]);

    const [paramSearchCus, setParamSearchCus] = useState<PagedKhachHangResultRequestDto>({
        skipCount: 1,
        maxResultCount: 16
    } as PagedKhachHangResultRequestDto);
    const [lstCustomerNoBooking, setLstCustomerNoBooking] = useState<PagedResultDto<KhachHangItemDto>>({
        items: [],
        totalCount: 0,
        totalPage: 0
    });

    const GetKhachHang_noBooking = async (txtSearch: string) => {
        paramSearchCus.keyword = txtSearch;
        const data = await khachHangService.GetKhachHang_noBooking(paramSearchCus);
        setLstCustomerNoBooking({
            ...lstCustomerNoBooking,
            items: data?.items,
            totalCount: data?.totalCount,
            totalPage: Math.ceil(data?.totalCount / paramSearchCus?.maxResultCount)
        });
        setIsLoadingData(false);
    };

    const debounceCustomer = useRef(
        debounce(async (txt) => {
            await GetKhachHang_noBooking(txt);
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
        GetKhachHang_noBooking(txtSearch);
    }, [paramSearchCus?.skipCount]);

    const addHoaDon = async (cusItem: KhachHangItemDto, loaiHoaDon: number) => {
        // save to check in
        const newObjCheckin: KHCheckInDto = new KHCheckInDto({
            idKhachHang: cusItem.id.toString(),
            idChiNhanh: idChiNhanhChosed,
            trangThai: TrangThaiCheckin.WAITING
        });
        const dataCheckIn = await CheckinService.InsertCustomerCheckIn(newObjCheckin);
        onClickAddHoaDon(cusItem.id.toString(), loaiHoaDon, dataCheckIn?.id);
    };

    const showModalAddCustomer = () => {
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
            moTa: '',
            idLoaiKhach: 1
        } as CreateOrEditKhachHangDto);
    };

    const saveOKCustomer_fromModalAdd = (newCus: KhachHangDto) => {
        onCloseModalAddCutomer();
        const newObj: KhachHangItemDto = {
            id: newCus?.id,
            maKhachHang: newCus?.maKhachHang ?? '',
            tenKhachHang: newCus?.tenKhachHang ?? '',
            avatar: newCus?.avatar ?? '',
            soDienThoai: newCus?.soDienThoai ?? '',
            diaChi: newCus?.diaChi ?? '',
            tongChiTieu: 0,
            conNo: 0,
            cuocHenGanNhat: new Date(),
            tongTichDiem: 0,
            soLanCheckIn: 0,
            trangThaiCheckIn: 1,
            zoaUserId: ''
        };

        setLstCustomerNoBooking({
            ...lstCustomerNoBooking,
            totalCount: (lstCustomerNoBooking?.totalCount ?? 0) + 1,
            items: [newObj, ...(lstCustomerNoBooking?.items ?? [])]
        });
    };

    const closeModalAddCustomer = () => {
        onCloseModalAddCutomer();
    };

    if (isLoadingData) {
        return <Loading />;
    }

    return (
        <Grid container spacing={2.5}>
            <CreateOrEditCustomerDialog
                visible={isShowModalAddCus ?? false}
                onCancel={closeModalAddCustomer}
                onOk={saveOKCustomer_fromModalAdd}
                title="Thêm mới khách hàng"
                formRef={newCus}
            />
            {lstCustomerNoBooking?.items?.map((cusItem, index) => (
                <Grid item key={index} xs={12} sm={4} md={4} lg={3}>
                    <Stack
                        padding={2}
                        border={'1px solid #cccc'}
                        borderRadius={1}
                        sx={{
                            boxShadow: '0px 2px 5px 0px #c6bdd1',
                            backgroundColor: '#fff',
                            '&:hover': {
                                borderColor: 'var(--color-main)',
                                cursor: 'pointer'
                            }
                        }}>
                        <Stack minHeight={100} justifyContent={'space-between'} spacing={1}>
                            <Stack direction={'row'} justifyContent={'space-between'}>
                                <Stack spacing={2} direction={'row'}>
                                    <Stack>
                                        <Avatar src={cusItem?.avatar} />
                                    </Stack>
                                    <Stack spacing={1}>
                                        <Typography
                                            variant="body2"
                                            fontWeight={500}
                                            className="lableOverflow"
                                            title={cusItem?.tenKhachHang}>
                                            {cusItem?.tenKhachHang}
                                        </Typography>
                                        <Typography variant="caption" color={'var( --color-text-blur)'}>
                                            {cusItem?.soDienThoai}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                            {index == 0 ? (
                                <Stack alignItems={'center'} justifyContent={'center'}>
                                    <Typography fontWeight={500}>200.000.000</Typography>
                                </Stack>
                            ) : null}

                            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                <Badge badgeContent={index == 0 ? 1 : 0} color="primary">
                                    <Stack
                                        direction={'row'}
                                        spacing={1}
                                        onClick={() => addHoaDon(cusItem, LoaiChungTu.HOA_DON_BAN_LE)}
                                        sx={{
                                            color: '#1976d2',
                                            '&:hover': {
                                                color: '#3c9977',
                                                cursor: 'pointer'
                                            }
                                        }}>
                                        <AddCircleOutlineOutlinedIcon />
                                        <Typography>Hóa đơn</Typography>
                                    </Stack>
                                </Badge>

                                <Badge>
                                    <Stack
                                        direction={'row'}
                                        spacing={1}
                                        sx={{
                                            color: 'var(--color-second)',
                                            '&:hover': {
                                                color: '#c32b2b',
                                                cursor: 'pointer'
                                            }
                                        }}
                                        onClick={() => addHoaDon(cusItem, LoaiChungTu.GOI_DICH_VU)}>
                                        <AddCircleOutlineOutlinedIcon />
                                        <Typography> Gói dịch vụ</Typography>
                                    </Stack>
                                </Badge>
                            </Stack>
                        </Stack>
                    </Stack>
                </Grid>
            ))}

            <Grid item xs={12} position={'absolute'} bottom={'10px'} width={'100%'}>
                <Stack direction={'row'} spacing={2} justifyContent={'center'} marginTop={2}>
                    <LabelDisplayedRows
                        currentPage={paramSearchCus?.skipCount}
                        pageSize={paramSearchCus?.maxResultCount}
                        totalCount={lstCustomerNoBooking?.totalCount}
                    />
                    <Pagination
                        shape="circular"
                        count={lstCustomerNoBooking?.totalPage}
                        page={paramSearchCus?.skipCount}
                        defaultPage={paramSearchCus?.skipCount}
                        onChange={(e, value) =>
                            setParamSearchCus({
                                ...paramSearchCus,
                                skipCount: value
                            })
                        }
                    />
                </Stack>
            </Grid>
        </Grid>
    );
}
