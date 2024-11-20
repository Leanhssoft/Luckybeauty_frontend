import { Avatar, Badge, Button, debounce, Grid, InputLabel, Stack, TextField, Typography } from '@mui/material';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';

import React, { useEffect, useRef, useState } from 'react';
import { LoaiChungTu, TrangThaiCheckin } from '../../lib/appconst';
import Loading from '../../components/Loading';
import { PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';
import CheckinService from '../../services/check_in/CheckinService';
import { PagedRequestDto } from '../../services/dto/pagedRequestDto';
import ModalAddCustomerCheckIn from './modal_add_cus_checkin';
import PageEmpty from '../../components/PageEmpty';
import { PropConfirmOKCancel } from '../../utils/PropParentToChild';
import TrangThaiBooking from '../../enum/TrangThaiBooking';
import { dbDexie } from '../../lib/dexie/dexieDB';
import { Guid } from 'guid-typescript';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import { format } from 'date-fns';

export type IPropsTabKhachHangCheckIn = {
    txtSearch: string;
    idChiNhanhChosed: string;
    isShowModalAddCheckin: boolean;
    onClickAddHoaDon: (customerId: string, idCheckIn?: string, isAddNew?: boolean) => void;
    onCloseModalAddCheckin: () => void;
};

export default function TabKhachHangChecking2(props: IPropsTabKhachHangCheckIn) {
    const { txtSearch, idChiNhanhChosed, onClickAddHoaDon, isShowModalAddCheckin, onCloseModalAddCheckin, ...other } =
        props;
    const firstLoad = useRef(true);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [idCheckinDelete, setIdCheckinDelete] = useState<string>('');
    const [inforDelete, setinforDelete] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });
    const [lstCustomerChecking, setLstCustomerChecking] = useState<PageKhachHangCheckInDto[]>([]);

    const GetListCustomerChecking = async (txtSearch: string) => {
        const param: PagedRequestDto = {
            keyword: txtSearch,
            skipCount: 0,
            maxResultCount: 16,
            idChiNhanh: idChiNhanhChosed
        };
        const data = await CheckinService.GetListCustomerChecking(param);

        const arrUpdate = data?.map(async (x) => {
            const hdCache = await dbDexie.hoaDon.where('idCheckIn').equals(x.idCheckIn).toArray();
            if (hdCache.length > 0) {
                return {
                    ...x,
                    tongThanhToan: hdCache[0].tongThanhToan,
                    loaiHoaDon: hdCache[0]?.idLoaiChungTu
                } as PageKhachHangCheckInDto;
            } else {
                return { ...x, tongThanhToan: 0, loaiHoaDon: -1 } as PageKhachHangCheckInDto;
            }
        });
        const lstNew = await Promise.all(arrUpdate);

        setLstCustomerChecking([...lstNew]);
        setIsLoadingData(false);
    };

    const debounceCustomer = useRef(
        debounce(async (txt) => {
            await GetListCustomerChecking(txt);
        }, 500)
    ).current;

    useEffect(() => {
        debounceCustomer(txtSearch);
    }, [txtSearch]);

    const addHoaDon = async (cusItem: PageKhachHangCheckInDto) => {
        onClickAddHoaDon(cusItem?.idKhachHang ?? '', cusItem?.idCheckIn, false);
    };

    const onRemoveCustomerChecking = (item: PageKhachHangCheckInDto) => {
        setIdCheckinDelete(item?.idCheckIn);
        setinforDelete({
            ...inforDelete,
            show: true,
            title: 'Xác nhận hủy',
            mes: 'Bạn có chắc chắn muốn hủy khách hàng ' + item?.tenKhachHang + ' đang check-in không'
        });
    };

    const deleteCusChecking = async () => {
        setLstCustomerChecking(lstCustomerChecking.filter((x) => x.idCheckIn !== idCheckinDelete));
        await CheckinService.UpdateTrangThaiCheckin(idCheckinDelete, TrangThaiCheckin.DELETED);
        setinforDelete(
            new PropConfirmOKCancel({
                show: false,
                title: '',
                mes: ''
            })
        );

        // update again trangThaiBooking = xác nhận vì không biết trạng thái cũ
        await CheckinService.UpdateTrangThaiBooking_byIdCheckIn(idCheckinDelete, TrangThaiBooking.Confirm);

        const dataCheckIn_Dexie = await dbDexie.hoaDon.where('idCheckIn').equals(idCheckinDelete).toArray();
        if (dataCheckIn_Dexie.length > 0) {
            await dbDexie.hoaDon.delete(dataCheckIn_Dexie[0].id);
        }
        setIdCheckinDelete('');
    };

    const saveCheckInOK = async (typeAction: number, dataCheckIn: PageKhachHangCheckInDto | undefined) => {
        onClickAddHoaDon(dataCheckIn?.idKhachHang ?? '', dataCheckIn?.idCheckIn ?? Guid.EMPTY, true);

        console.log(
            'dataCheckIn?.dateTimeCheckIn  ',
            dataCheckIn?.dateTimeCheckIn,
            new Date(dataCheckIn?.dateTimeCheckIn ?? new Date())
        );
        const cusChecking: PageKhachHangCheckInDto = new PageKhachHangCheckInDto({
            idKhachHang: dataCheckIn?.idKhachHang ?? '',
            idCheckIn: dataCheckIn?.idCheckIn,
            maKhachHang: dataCheckIn?.maKhachHang,
            tenKhachHang: dataCheckIn?.tenKhachHang,
            soDienThoai: dataCheckIn?.soDienThoai,
            tongTichDiem: dataCheckIn?.tongTichDiem,
            dateTimeCheckIn: dataCheckIn?.dateTimeCheckIn
        });
        // getTongThanhToan from cache if booking
        const hdCache = await dbDexie.hoaDon
            .where('idCheckIn')
            .equals(dataCheckIn?.idCheckIn ?? Guid.EMPTY)
            .toArray();
        if (hdCache?.length > 0) {
            cusChecking.tongThanhToan = hdCache[0]?.tongThanhToan;
        }
        setLstCustomerChecking([cusChecking, ...lstCustomerChecking]);
    };

    if (isLoadingData) {
        return <Loading />;
    }

    return (
        <>
            <ModalAddCustomerCheckIn
                typeForm={1}
                isNew={true}
                idChiNhanh={idChiNhanhChosed}
                isShowModal={isShowModalAddCheckin}
                onOK={saveCheckInOK}
                onClose={onCloseModalAddCheckin}
            />
            <ConfirmDelete
                isShow={inforDelete?.show}
                title={inforDelete?.title}
                mes={inforDelete?.mes}
                onOk={deleteCusChecking}
                onCancel={() => setinforDelete({ ...inforDelete, show: false })}
            />
            {(lstCustomerChecking?.length ?? 0) == 0 ? (
                <PageEmpty
                    text="Không có khách hàng check in"
                    style={{ minHeight: '86vh' }}
                    icon={<GroupAddOutlinedIcon sx={{ width: 60, height: 60, color: 'burlywood' }} />}
                />
            ) : (
                <Grid container spacing={1}>
                    {lstCustomerChecking?.map((cusItem, index) => (
                        <Grid item key={index} xs={12} sm={12} md={6} lg={4}>
                            <Stack
                                padding={2}
                                position={'relative'}
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
                                <CloseOutlinedIcon
                                    sx={{ position: 'absolute', width: 25, top: 4, right: 4 }}
                                    onClick={() => onRemoveCustomerChecking(cusItem)}
                                />
                                <Stack
                                    justifyContent={'space-between'}
                                    spacing={1.5}
                                    onClick={() => addHoaDon(cusItem)}>
                                    <Stack minHeight={48} direction={'row'} justifyContent={'space-between'}>
                                        <Stack spacing={2} direction={'row'}>
                                            <Stack>
                                                <Avatar src={cusItem?.avatar} />
                                            </Stack>
                                            <Stack spacing={1}>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={500}
                                                    maxWidth={200}
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

                                    <Stack spacing={1}>
                                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                            {cusItem?.loaiHoaDon !== LoaiChungTu.GOI_DICH_VU ? (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: '#1976d2',
                                                        '&:hover': {
                                                            color: '#3c9977',
                                                            cursor: 'pointer'
                                                        }
                                                    }}>
                                                    Hóa đơn
                                                </Typography>
                                            ) : (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: 'var(--color-second)',
                                                        '&:hover': {
                                                            color: '#c32b2b',
                                                            cursor: 'pointer'
                                                        }
                                                    }}>
                                                    Gói dịch vụ
                                                </Typography>
                                            )}
                                            <Typography
                                                variant="body2"
                                                fontWeight={500}
                                                color={'var(--color-text-secondary)'}>
                                                {cusItem?.dateCheckIn}
                                            </Typography>
                                        </Stack>
                                        <Stack alignItems={'center'} direction={'row'} spacing={1}>
                                            <Typography variant="body2">Tổng mua:</Typography>
                                            <Typography variant="body2" fontWeight={500}>
                                                {new Intl.NumberFormat('vi-VN').format(cusItem?.tongThanhToan ?? 0)}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            )}
        </>
    );
}
