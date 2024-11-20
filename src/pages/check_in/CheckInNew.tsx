import { Box, Button, Grid, Stack, InputAdornment, TextField, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import utils from '../../utils/utils';

import { Add, QueryBuilder } from '@mui/icons-material';
import ModalAddCustomerCheckIn from './modal_add_cus_checkin';
import { PropConfirmOKCancel } from '../../utils/PropParentToChild';
import { PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';
import CloseIcon from '@mui/icons-material/Close';
import CheckinService from '../../services/check_in/CheckinService';

import { dbDexie } from '../../lib/dexie/dexieDB';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import nhanVienService from '../../services/nhan-vien/nhanVienService';
import { PagedNhanSuRequestDto } from '../../services/nhan-vien/dto/PagedNhanSuRequestDto';
import { ListNhanVienDataContext } from '../../services/nhan-vien/dto/NhanVienDataContext';
import NhanSuItemDto from '../../services/nhan-vien/dto/nhanSuItemDto';
import BadgeFistCharOfName from '../../components/Badge/FistCharOfName';
import Cookies from 'js-cookie';
import { TrangThaiCheckin } from '../../lib/appconst';
import abpCustom from '../../components/abp-custom';
import TrangThaiBooking from '../../enum/TrangThaiBooking';

export default function CustomersChecking({ hanleChoseCustomer }: any) {
    const [txtSearch, setTextSeach] = useState('');
    const [allCusChecking, setAllCusChecking] = useState<PageKhachHangCheckInDto[]>([]);
    const [idCheckinDelete, setIdCheckinDelete] = useState('');
    const [isShowModalCheckIn, setIsShowModalCheckIn] = useState(false);
    const [lstNhanVien, setLstNhanVien] = useState<NhanSuItemDto[]>([]);

    const [inforDelete, setinforDelete] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });

    const GetListCustomerChecking = async () => {
        const input = { keyword: '', skipCount: 0, maxResultCount: 50, idChiNhanh: Cookies.get('IdChiNhanh') };
        const list = await CheckinService.GetListCustomerChecking(input);

        // // get data from cache && update to list customer checking
        const arrUpdate = list.map(async (x) => {
            const hdCache = await dbDexie.hoaDon.where('idCheckIn').equals(x.idCheckIn).toArray();
            if (hdCache.length > 0) {
                return { ...x, tongThanhToan: hdCache[0].tongThanhToan } as PageKhachHangCheckInDto;
            } else {
                return { ...x, tongThanhToan: 0 } as PageKhachHangCheckInDto;
            }
        });
        const lstNew = await Promise.all(arrUpdate);
        setAllCusChecking([...lstNew]);
    };

    const GetAllNhanVien = async () => {
        const data = await nhanVienService.getAll({
            skipCount: 0,
            maxResultCount: 100
        } as PagedNhanSuRequestDto);
        setLstNhanVien([...data.items]);
    };

    const PageLoad = () => {
        GetListCustomerChecking();
        GetAllNhanVien();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    const SearhCusChecking = () => {
        if (!utils.checkNull(txtSearch)) {
            const txt = txtSearch.trim().toLowerCase();
            const txtUnsign = utils.strToEnglish(txt);
            const data = allCusChecking.filter(
                (x) =>
                    (x.maKhachHang !== null && x.maKhachHang.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.tenKhachHang !== null && x.tenKhachHang.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.soDienThoai !== null && x.soDienThoai.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.maKhachHang !== null && utils.strToEnglish(x.maKhachHang).indexOf(txtUnsign) > -1) ||
                    (x.tenKhachHang !== null && utils.strToEnglish(x.tenKhachHang).indexOf(txtUnsign) > -1) ||
                    (x.soDienThoai !== null && utils.strToEnglish(x.soDienThoai).indexOf(txtUnsign) > -1)
            );
            return data;
        } else {
            return allCusChecking;
        }
    };

    const deleteCusChecking = async () => {
        setAllCusChecking(allCusChecking.filter((x: PageKhachHangCheckInDto) => x.idCheckIn !== idCheckinDelete));
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
    };

    const listCusChecking = SearhCusChecking();

    const saveCheckInOK = async (typeAction: number, dataCheckIn: PageKhachHangCheckInDto | undefined) => {
        setIsShowModalCheckIn(false);
        const cusChecking: PageKhachHangCheckInDto = new PageKhachHangCheckInDto({
            idKhachHang: dataCheckIn?.idKhachHang ?? '',
            idCheckIn: dataCheckIn?.idCheckIn,
            maKhachHang: dataCheckIn?.maKhachHang,
            tenKhachHang: dataCheckIn?.tenKhachHang,
            soDienThoai: dataCheckIn?.soDienThoai,
            tongTichDiem: dataCheckIn?.tongTichDiem,
            dateTimeCheckIn: dataCheckIn?.dateTimeCheckIn
        });

        // asiign TongThanhToan if checkin from booking
        const hdCache = await dbDexie.hoaDon
            .where('idCheckIn')
            .equals(dataCheckIn?.idCheckIn ?? '')
            .toArray();
        if (hdCache.length > 0) {
            cusChecking.tongThanhToan = hdCache[0].tongThanhToan;
        }
        setAllCusChecking([...allCusChecking, cusChecking]);
    };

    const handleClickCustomer = async (item: PageKhachHangCheckInDto) => {
        hanleChoseCustomer(item);
    };

    return (
        <Box padding={2} width={'100%'}>
            <ListNhanVienDataContext.Provider value={lstNhanVien}>
                <ModalAddCustomerCheckIn
                    typeForm={1}
                    isNew={true}
                    isShowModal={isShowModalCheckIn}
                    onOK={saveCheckInOK}
                    onClose={() => setIsShowModalCheckIn(false)}
                />
            </ListNhanVienDataContext.Provider>
            <ConfirmDelete
                isShow={inforDelete.show}
                title={inforDelete.title}
                mes={inforDelete.mes}
                onOk={deleteCusChecking}
                onCancel={() => setinforDelete({ ...inforDelete, show: false })}></ConfirmDelete>
            <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                <Grid container>
                    <Grid item xs={12}>
                        <Stack
                            //flexWrap="wrap"
                            useFlexGap
                            justifyContent={{
                                md: 'flex-end',
                                lg: 'flex-end',
                                sm: 'flex-start',
                                xs: 'flex-start'
                            }}
                            padding={2}
                            spacing={{ xs: 2, sm: 2, md: 1, lg: 1 }}
                            direction="row"
                            display="flex"
                            alignItems="center">
                            <TextField
                                sx={{
                                    backgroundColor: '#fff',
                                    borderColor: '#CDC9CD!important',
                                    borderWidth: '1px!important',
                                    maxWidth: '300px'
                                }}
                                className="text-search"
                                size="small"
                                variant="outlined"
                                type="search"
                                placeholder="Tìm kiếm"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchOutlinedIcon />
                                        </InputAdornment>
                                    )
                                }}
                                onChange={(event) => {
                                    setTextSeach(event.target.value);
                                }}
                            />
                            {/* <EventIcon
                                sx={{
                                    width: 38,
                                    height: 36.5,
                                    borderRadius: '4px',
                                    border: '1px solid #cccc',
                                    padding: '6px',
                                    display: 'none'
                                }}
                            /> */}

                            <Button
                                className=" btn-container-hover"
                                variant="contained"
                                sx={{
                                    backgroundColor: 'var(--color-main)!important',
                                    display: abpCustom.isGrandPermission('Pages.CheckIn.Create') ? '' : 'none'
                                }}
                                title="Thêm khách"
                                startIcon={window.screen.width < 768 ? null : <Add />}
                                onClick={() => setIsShowModalCheckIn(true)}>
                                {window.screen.width < 768 ? <Add /> : 'Thêm khách'}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container paddingLeft={2} paddingTop={2} columnSpacing={2} rowSpacing={2}>
                {listCusChecking.map((item: PageKhachHangCheckInDto, index: number) => (
                    <Grid item xs={12} sm={4} md={4} lg={3} key={index} sx={{ position: 'relative' }}>
                        <Button
                            sx={{
                                position: 'absolute',
                                top: '16px',
                                right: 0,
                                minWidth: 'unset',
                                borderRadius: '50%!important'
                            }}>
                            <CloseIcon
                                sx={{ color: '#333233' }}
                                onClick={() => {
                                    setIdCheckinDelete(item.idCheckIn);
                                    setinforDelete(
                                        new PropConfirmOKCancel({
                                            show: true,
                                            title: 'Xác nhận xóa',
                                            mes: `Bạn có chắc chắn muốn hủy bỏ khách  ${item?.tenKhachHang}  đang check in không?`
                                        })
                                    );
                                }}
                            />
                        </Button>
                        <Stack
                            padding={3}
                            direction="column"
                            justifyContent={'space-between'}
                            sx={{
                                boxShadow: '0px 7px 20px 0px #28293D14',
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                height: '100%',
                                border: '1px solid transparent',
                                transition: '.4s',
                                cursor: 'pointer',
                                '&:hover': {
                                    borderColor: 'var(--color-main)'
                                }
                            }}
                            onClick={() => {
                                handleClickCustomer(item);
                            }}>
                            <Stack direction={'row'} spacing={2}>
                                {utils.checkNull(item?.avatar) ? (
                                    <BadgeFistCharOfName firstChar={utils.getFirstLetter(item?.tenKhachHang ?? '')} />
                                ) : (
                                    <img src={item.avatar} style={{ width: 40, height: 40, borderRadius: '100%' }} />
                                )}

                                <div>
                                    <Typography variant="subtitle2" title={item.tenKhachHang}>
                                        {item.tenKhachHang}
                                    </Typography>
                                    <Typography color="#999699" variant="caption">
                                        {item.soDienThoai}
                                    </Typography>
                                </div>
                            </Stack>
                            <Stack spacing={2}>
                                <Stack direction={'row'} marginTop="16px" justifyContent={'space-between'}>
                                    <Stack direction={'row'} spacing={1} style={{ display: 'none' }}>
                                        <Typography variant="body2" color={'#3D475C'}>
                                            Điểm tích lũy:
                                        </Typography>
                                        <Typography variant="body2" fontWeight="700">
                                            {item.tongTichDiem}
                                        </Typography>
                                    </Stack>
                                    <Stack direction={'row'} spacing={1}>
                                        <Typography variant="body2" color={'#3D475C'}>
                                            Tổng mua:
                                        </Typography>
                                        <Typography variant="body2" fontWeight="700">
                                            {Intl.NumberFormat('vi-VN').format(item.tongThanhToan ?? 0)}
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Grid container>
                                    <Grid item xs={7} sm={7} md={7}>
                                        <Stack spacing={1} direction={'row'} color={'#3D475C'}>
                                            <Typography variant="body2">{item.dateCheckIn}</Typography>
                                            <Typography display="flex" alignItems="center" variant="body2">
                                                <QueryBuilder
                                                    style={{
                                                        fontSize: '12px',
                                                        marginRight: '5px'
                                                    }}
                                                />
                                                {item.timeCheckIn}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={5} sm={5} md={5}>
                                        <Box
                                            component="span"
                                            sx={{
                                                borderRadius: '20px',
                                                color: item.trangThaiCheckIn === 1 ? '#FFC700' : 'var(--color-main)',
                                                fontSize: '12px',
                                                float: 'right'
                                            }}>
                                            {item.txtTrangThaiCheckIn}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Stack>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
