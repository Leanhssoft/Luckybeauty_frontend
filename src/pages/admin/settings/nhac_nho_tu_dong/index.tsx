import { Button, Grid, Stack, Typography } from '@mui/material';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import { ReactComponentElement, useEffect, useState } from 'react';
import { SvgIconComponent } from '@mui/icons-material';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import { LoaiTin, SMS_HinhThucGuiTin } from '../../../../lib/appconst';
import ModalCaiDatNhacNho from './modal_cai_dat_nhac_nho';
import { Guid } from 'guid-typescript';
import {
    ICaiDatNhacNhoDto,
    IICaiDatNhacNho_GroupLoaiTin
} from '../../../../services/sms/cai_dat_nhac_nho/cai_dat_nhac_nho_dto';
import CaiDatNhacNhoService from '../../../../services/sms/cai_dat_nhac_nho/CaiDatNhacNhoService';
import SnackbarAlert from '../../../../components/AlertDialog/SnackbarAlert';
import { ButtonNavigate } from '../../../../components/Button/ButtonNavigate';
import suggestStore from '../../../../stores/suggestStore';

interface ICaiDatNhacNho {
    id: string;
    type: number;
    icon?: ReactComponentElement<SvgIconComponent>;
    title?: string;
    text: string;
    listButton?: IButtonCaiDatNhacNho[];
}
interface IButtonCaiDatNhacNho {
    id: string;
    text: string;
    value: number;
    trangThai: number;
}

export default function PageCaiDatNhacTuDong() {
    const lstButton: IButtonCaiDatNhacNho[] = [
        {
            id: Guid.EMPTY,
            text: '', // nút xóa
            value: 0,
            trangThai: 0
        },
        {
            id: Guid.EMPTY,
            text: 'Sms',
            value: SMS_HinhThucGuiTin.SMS,
            trangThai: 0 // 1.active, 0.no active
        },
        {
            id: Guid.EMPTY,
            text: 'Zalo',
            value: SMS_HinhThucGuiTin.ZALO,
            trangThai: 0
        }
    ];
    const [arrSetup, setArrSetup] = useState<ICaiDatNhacNho[]>([
        {
            id: LoaiTin.TIN_SINH_NHAT.toString(),
            type: LoaiTin.TIN_SINH_NHAT,
            icon: <CakeOutlinedIcon sx={{ color: '#800AC7' }} />,
            title: 'Sinh nhật',
            text: 'Gửi lời chúc mừng vào ngày sinh nhật của khách hàng',
            listButton: lstButton
        },
        {
            id: LoaiTin.NHAC_LICH_HEN.toString(),
            type: LoaiTin.NHAC_LICH_HEN,
            icon: <NotificationsNoneOutlinedIcon sx={{ color: '#FF7DA1', width: 30, height: 30 }} />,
            title: 'Nhắc nhở cuộc hẹn',
            text: 'Gửi để nhắc nhở khách hàng về cuộc hẹn sắp tới',
            listButton: lstButton
        },
        {
            id: LoaiTin.XAC_NHAN_LICH_HEN.toString(),
            type: LoaiTin.XAC_NHAN_LICH_HEN,
            icon: <TaskAltOutlinedIcon sx={{ color: '#FF7DA1', width: 30, height: 30 }} />,
            title: 'Xác nhận lịch hẹn',
            text: 'Thông báo chi tiết lịch hẹn tới khách hàng',
            listButton: lstButton
        },

        {
            id: LoaiTin.TIN_GIAO_DICH.toString(),
            type: LoaiTin.TIN_GIAO_DICH,
            icon: <ReceiptOutlinedIcon sx={{ color: '#50CD89' }} />,
            title: 'Giao dịch',
            text: 'Gửi thông báo cho khách hàng sau khi thực hiện giao dịch',
            listButton: lstButton
        }
    ]);

    const [isShowModalSetup, setIsShowModalSetup] = useState(false);
    const [idSetup, setIdSetup] = useState('');
    const [objSetUp, setObjSetUp] = useState<ICaiDatNhacNhoDto>({ idLoaiTin: 1 } as ICaiDatNhacNhoDto);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const GetAllCaiDatNhacNho = async () => {
        const data = await CaiDatNhacNhoService.GetAllCaiDatNhacNho_GroupLoaiTin();
        if (data !== null) {
            setArrSetup(
                arrSetup.map((x: ICaiDatNhacNho) => {
                    const itEx = data.filter((o: IICaiDatNhacNho_GroupLoaiTin) => o.idLoaiTin == x.type);
                    if (itEx.length > 0) {
                        return {
                            ...x,
                            id: itEx[0].idLoaiTin.toString(),
                            trangThai: 1,
                            listButton: x.listButton?.map((oo: IButtonCaiDatNhacNho) => {
                                const itHinhThuc = itEx[0].lstDetail?.filter(
                                    (o: ICaiDatNhacNhoDto) => o.hinhThucGui == oo.value
                                );
                                if (itHinhThuc !== undefined && itHinhThuc?.length > 0) {
                                    return { ...oo, id: itHinhThuc[0].id, trangThai: itHinhThuc[0].trangThai };
                                } else {
                                    return oo;
                                }
                            })
                        };
                    } else {
                        return x;
                    }
                })
            );
        }
    };

    const onShowModalCaiDatChiTiet = (idLoaiTin: number, item: IButtonCaiDatNhacNho) => {
        setIdSetup(item.id);
        setIsShowModalSetup(true);
        setObjSetUp({ ...objSetUp, idLoaiTin: idLoaiTin, hinhThucGui: item.value });
    };

    useEffect(() => {
        GetAllCaiDatNhacNho();
        suggestStore.Zalo_GetAccessToken();
    }, []);

    const saveCaiDatOK = (typeAction: number) => {
        GetAllCaiDatNhacNho();
        setIsShowModalSetup(false);
    };

    return (
        <>
            <ModalCaiDatNhacNho
                isShowModal={isShowModalSetup}
                onClose={() => setIsShowModalSetup(false)}
                objUpDate={objSetUp}
                idUpdate={idSetup}
                onOK={saveCaiDatOK}
            />
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Grid container spacing={3} paddingTop={2}>
                <Grid item xs={12}>
                    <Stack justifyContent={'space-between'} direction={'row'}>
                        <Typography fontSize={18} fontWeight={600}>
                            Tin nhắn tự động
                        </Typography>
                        <ButtonNavigate navigateTo="/settings" btnText="Trở về cài đặt" />
                    </Stack>
                </Grid>
                {arrSetup?.map((item: ICaiDatNhacNho, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                        <Stack
                            spacing={4}
                            padding={'20px 24px'}
                            sx={{ border: '1px solid #ccc', borderRadius: '8px', backgroundColor: 'white' }}>
                            <Stack spacing={1.5}>
                                <Stack direction={'row'} justifyContent={'space-between'}>
                                    <Stack spacing={1} direction={'row'} alignItems={'center'}>
                                        {item.icon}

                                        <Typography fontWeight={600} fontSize={16}>
                                            {item?.title}
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Typography fontSize={14}> {item?.text}</Typography>
                            </Stack>

                            <Stack direction={'row'} spacing={1} justifyContent={'end'} alignItems={'center'}>
                                {item.listButton?.map((itemButton: IButtonCaiDatNhacNho, indexButton) => (
                                    <div key={indexButton}>
                                        {itemButton?.text == '' ? (
                                            <div></div>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                onClick={() => onShowModalCaiDatChiTiet(item.type, itemButton)}
                                                startIcon={
                                                    itemButton?.trangThai == 1 ? (
                                                        <CheckOutlinedIcon sx={{ color: '#50CD89' }} />
                                                    ) : (
                                                        <CloseOutlinedIcon sx={{ color: 'red' }} />
                                                    )
                                                }
                                                sx={{ color: 'black', borderColor: '#ccc' }}>
                                                {itemButton.text}
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </Stack>
                        </Stack>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
