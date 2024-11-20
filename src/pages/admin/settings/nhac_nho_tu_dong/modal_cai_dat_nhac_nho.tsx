import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Box,
    TextField,
    Typography,
    Stack
} from '@mui/material';
import AppConsts, {
    ISelect,
    LoaiTin,
    TypeAction,
    TimeType,
    SMS_HinhThucGuiTin,
    TrangThaiActive
} from '../../../../lib/appconst';
import { IOSSwitch } from '../../../../components/Switch/IOSSwitch';
import { useEffect, useState } from 'react';
import utils from '../../../../utils/utils';
import SnackbarAlert from '../../../../components/AlertDialog/SnackbarAlert';
import DialogButtonClose from '../../../../components/Dialog/ButtonClose';
import { Guid } from 'guid-typescript';
import SelectWithData from '../../../../components/Select/SelectWithData';
import CaiDatNhacNhoService from '../../../../services/sms/cai_dat_nhac_nho/CaiDatNhacNhoService';
import { ICaiDatNhacNhoDto } from '../../../../services/sms/cai_dat_nhac_nho/cai_dat_nhac_nho_dto';
import { IPropModal } from '../../../../services/dto/IPropsComponent';
import ZaloService from '../../../../services/zalo/ZaloService';
import MauTinSMSService from '../../../../services/sms/mau_tin_sms/MauTinSMSService';
import { IDataAutocomplete } from '../../../../services/dto/IDataAutocomplete';
import AutocompleteWithData from '../../../../components/Autocomplete/AutocompleteWithData';
import { ZaloTemplateView } from '../../../zalo/zalo_template_view';
import {
    IZaloButtonDetail,
    IZaloElement,
    IZaloTableDetail,
    IZaloTemplate
} from '../../../../services/zalo/ZaloTemplateDto';
import { ZaloConst } from '../../../../lib/zaloConst';
import suggestStore from '../../../../stores/suggestStore';
import { ITemplateZNS } from '../../../../services/zalo/zalo_dto';

const ModalCaiDatNhacNho = (props: IPropModal<ICaiDatNhacNhoDto>) => {
    const { idUpdate, isShowModal, objUpDate, onClose, onOK } = props;

    const [allMauTin, setAllMauTin] = useState<IDataAutocomplete[]>([]);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [titleDialog, setTitleDialog] = useState('');
    const [noiDungXemTruoc, setNoiDungXemTruoc] = useState('');
    const [idMauTinChosed, setIdMauTinChosed] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [objSetup, setObjSetup] = useState<ICaiDatNhacNhoDto>({
        id: Guid.EMPTY,
        trangThai: TrangThaiActive.NOT_ACTIVE
    } as ICaiDatNhacNhoDto);

    const [imageUrl, setImageUrl] = useState(''); // url of imge
    const [lstButton, setLstButton] = useState<IZaloButtonDetail[]>([]);
    const [tblDetail, setTblDetail] = useState<IZaloTableDetail[]>([]);
    const [headerElm, setHeaderElm] = useState<IZaloElement | null>();
    const [textElm, setTextElm] = useState<IZaloElement | null>();

    const [itemMauTinZNS, setItemMauTinZNS] = useState<ITemplateZNS | null>();

    useEffect(() => {
        ResetDataModal();
        if (isShowModal) {
            const idLoaiTin = objUpDate?.idLoaiTin ?? 0;
            if (utils.checkNull(idUpdate) || idUpdate === Guid.EMPTY) {
                switch (idLoaiTin) {
                    case LoaiTin.TIN_SINH_NHAT:
                    case LoaiTin.TIN_GIAO_DICH:
                    case LoaiTin.XAC_NHAN_LICH_HEN:
                        {
                            setObjSetup({
                                ...objSetup,
                                idLoaiTin: idLoaiTin,
                                idMauTin: '',
                                loaiThoiGian: 0,
                                trangThai: TrangThaiActive.NOT_ACTIVE,
                                nhacTruocKhoangThoiGian: 0,
                                hinhThucGui: objUpDate?.hinhThucGui
                            });
                        }
                        break;
                    case LoaiTin.NHAC_LICH_HEN:
                        {
                            setObjSetup({
                                ...objSetup,
                                idLoaiTin: idLoaiTin,
                                idMauTin: '',
                                trangThai: TrangThaiActive.NOT_ACTIVE,
                                loaiThoiGian: TimeType.HOUR,
                                nhacTruocKhoangThoiGian: 0,
                                hinhThucGui: objUpDate?.hinhThucGui
                            });
                        }
                        break;
                }
                GetAllMauTin(objUpDate?.hinhThucGui);
            } else {
                GetSetData_CaiDatNhacNho(objUpDate ?? null);
            }

            switch (idLoaiTin) {
                case LoaiTin.TIN_SINH_NHAT:
                    {
                        setTitleDialog('Cài đặt chúc mừng sinh nhật');
                    }
                    break;
                case LoaiTin.TIN_LICH_HEN:
                    {
                        setTitleDialog('Cài đặt nhắc nhở cuộc hẹn');
                    }
                    break;
                case LoaiTin.NHAC_LICH_HEN:
                    {
                        setTitleDialog('Cài đặt nhắc nhở cuộc hẹn');
                    }
                    break;
                case LoaiTin.XAC_NHAN_LICH_HEN:
                    {
                        setTitleDialog('Cài đặt xác nhận lịch hẹn');
                    }
                    break;
                case LoaiTin.TIN_GIAO_DICH:
                    {
                        setTitleDialog('Cài đặt thông báo giao dịch');
                    }
                    break;
            }
        }
    }, [isShowModal]);

    const ResetDataModal = () => {
        setIsSaving(false);
        setNoiDungXemTruoc('');
        setImageUrl('');
        setLstButton([]);
        setTblDetail([]);
        setHeaderElm(null);
        setTextElm(null);
    };

    const GetSetData_CaiDatNhacNho = async (objUpdate: ICaiDatNhacNhoDto | null) => {
        await GetAllMauTin(objUpdate?.hinhThucGui);
        await GetInforCaiDatNhacNho_byId(idUpdate as string);
    };

    const GetInforCaiDatNhacNho_byId = async (idUpdate: string) => {
        const data = await CaiDatNhacNhoService.GetInforCaiDatNhacNho_byId(idUpdate);
        if (data != null) {
            setObjSetup({
                ...objSetup,
                id: idUpdate,
                idLoaiTin: data?.idLoaiTin,
                idMauTin: data?.idMauTin,
                hinhThucGui: data?.hinhThucGui,
                trangThai: data?.trangThai,
                loaiThoiGian: data?.loaiThoiGian,
                nhacTruocKhoangThoiGian: data?.nhacTruocKhoangThoiGian
            });

            if (!utils.checkNull(data?.idMauTin)) {
                await BindNoiDungMauTin(data?.idMauTin ?? '');
            }
        }
    };

    const getMauTinZaLo = async (idMauTin: string) => {
        setIdMauTinChosed(idMauTin);
        if (idMauTin?.length < 36) {
            // get mautin ZNS
            const dataMauTin = await ZaloService.GetZNSTemplate_byId(suggestStore?.zaloAccessToken ?? '', idMauTin);
            if (dataMauTin !== null) {
                setItemMauTinZNS(dataMauTin);
            } else {
                setItemMauTinZNS(null);
            }
        } else {
            // get from db
            const itemDefault = await ZaloService.GetZaloTemplate_byId(idMauTin);

            if (itemDefault != null && itemDefault != undefined) {
                if (itemDefault?.elements !== undefined) {
                    const banner = itemDefault?.elements?.filter(
                        (x) => x.elementType === ZaloConst.ElementType.BANNER || ZaloConst.ElementType.IMAGE
                    );
                    if (banner !== undefined && banner.length > 0) {
                        if (banner[0].isImage) {
                            setImageUrl(banner[0].content);
                        } else {
                            setImageUrl('');
                        }
                    } else {
                        setImageUrl('');
                    }
                    const header = itemDefault?.elements?.filter((x) => x.elementType === ZaloConst.ElementType.HEADER);
                    if (header !== undefined && header.length > 0) {
                        setHeaderElm(header[0]);
                    } else {
                        setHeaderElm(null);
                    }
                    const text = itemDefault?.elements?.filter((x) => x.elementType === ZaloConst.ElementType.TEXT);
                    if (text !== undefined && text.length > 0) {
                        setTextElm(text[0]);
                    } else {
                        setTextElm(null);
                    }

                    const tbl = itemDefault?.elements
                        ?.filter((x) => x.elementType === ZaloConst.ElementType.TABLE)
                        ?.map((x) => {
                            return x?.tables;
                        });
                    if (tbl !== undefined && tbl?.length > 0) {
                        setTblDetail(tbl[0]);
                    } else {
                        setTblDetail([]);
                    }
                }
                if (itemDefault?.buttons !== undefined) {
                    setLstButton(itemDefault?.buttons);
                } else {
                    setLstButton([]);
                }
            }
        }
    };

    const BindNoiDungMauTin = async (idMauTin: string) => {
        switch (objUpDate?.hinhThucGui) {
            case SMS_HinhThucGuiTin.SMS:
                {
                    const data = await MauTinSMSService.GetMauTinSMS_byId(idMauTin);
                    if (data !== undefined && data != null) {
                        setNoiDungXemTruoc(CaiDatNhacNhoService.ReplaceBienSMS(data?.noiDungTinMau as string));
                    }
                }
                break;
            case SMS_HinhThucGuiTin.ZALO:
                {
                    await getMauTinZaLo(idMauTin);
                }
                break;
        }
    };

    const changeMauTin = async (item: IDataAutocomplete) => {
        setObjSetup({
            ...objSetup,
            idMauTin: item?.id
        });
        await BindNoiDungMauTin(item?.id);
    };

    const GetAllMauTin = async (hinhThucGui = 0) => {
        if (hinhThucGui === SMS_HinhThucGuiTin.SMS) {
            const data = await MauTinSMSService.GetAllMauTinSMS();
            setAllMauTin(
                data?.map((x) => {
                    return { id: x.id, text1: x.tenMauTin, text2: x.noiDungTinMau } as IDataAutocomplete;
                })
            );
        } else {
            const lstMauTinDB = await ZaloService.GetAllZaloTemplate_fromDB();
            const mauTinZNS = await ZaloService.GetList_TempFromZNS(suggestStore?.zaloAccessToken ?? '', 1);

            let arr2: IDataAutocomplete[] = [];
            if (mauTinZNS !== undefined) {
                arr2 = mauTinZNS?.map((x) => {
                    return {
                        id: x.templateId.toString(),
                        text1: x.templateName,
                        text2: 'ZNS' // mẫu của zalo
                    } as IDataAutocomplete;
                });
            }
            const arr1 = lstMauTinDB?.map((x) => {
                return {
                    id: x.id,
                    text1: x.tenMauTin,
                    text2: ''
                } as IDataAutocomplete;
            });
            setAllMauTin([...arr1, ...arr2]);
        }
    };

    const saveCaiDatNhacNho = async () => {
        if (isSaving) return;
        setIsSaving(true);

        if (utils.checkNull(idUpdate) || idUpdate === Guid.EMPTY) {
            await CaiDatNhacNhoService.CreateCaiDatNhacNho(objSetup);
            onOK(TypeAction.INSEART);
        } else {
            await CaiDatNhacNhoService.UpdateCaiDatNhacNho(objSetup);
            onOK(TypeAction.UPDATE);
        }
        setObjAlert({ ...objAlert, show: true, mes: `${titleDialog} thành công` });
    };

    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>

            <Dialog open={isShowModal} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography className="modal-title">
                            {objUpDate?.hinhThucGui === SMS_HinhThucGuiTin.SMS ? 'SMS: ' : 'Zalo: '}
                            {titleDialog}
                        </Typography>
                        <DialogButtonClose onClose={onClose}></DialogButtonClose>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ overflow: 'hidden' }}>
                    <Grid container spacing={2} paddingTop={1}>
                        <Grid item xs={12}>
                            <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                <Typography variant="body2">Kích hoạt</Typography>
                                <IOSSwitch
                                    sx={{ m: 1 }}
                                    value={objSetup?.trangThai}
                                    checked={objSetup?.trangThai == TrangThaiActive.ACTIVE ? true : false}
                                    onChange={() => {
                                        const newVal =
                                            objSetup?.trangThai == TrangThaiActive.ACTIVE
                                                ? TrangThaiActive.NOT_ACTIVE
                                                : TrangThaiActive.ACTIVE;
                                        setObjSetup({ ...objSetup, trangThai: newVal });
                                    }}
                                />
                            </Stack>
                        </Grid>
                        {objUpDate?.idLoaiTin === LoaiTin.NHAC_LICH_HEN && (
                            <Grid item xs={12}>
                                <Grid container spacing={1}>
                                    <Grid item xs={9}>
                                        <TextField
                                            name="nhacTruocKhoangThoiGian"
                                            label="Gửi trước"
                                            value={objSetup?.nhacTruocKhoangThoiGian}
                                            onChange={(event) =>
                                                setObjSetup({
                                                    ...objSetup,
                                                    nhacTruocKhoangThoiGian: parseInt(event.target.value)
                                                })
                                            }
                                            size="small"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <SelectWithData
                                            label="Loại thời gian"
                                            data={AppConsts.ListTimeType}
                                            idChosed={objSetup?.loaiThoiGian}
                                            handleChange={(item: ISelect) => {
                                                setObjSetup({
                                                    ...objSetup,
                                                    loaiThoiGian: item?.value as number
                                                });
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <AutocompleteWithData
                                idChosed={objSetup?.idMauTin ?? ''}
                                label="Mẫu tin"
                                lstData={allMauTin}
                                handleChoseItem={changeMauTin}
                            />
                        </Grid>
                        {objUpDate?.hinhThucGui == SMS_HinhThucGuiTin.SMS && (
                            <Grid item xs={12}>
                                <Stack padding={2} spacing={2} sx={{ border: '1px dashed #ccc' }} alignItems={'center'}>
                                    <Typography fontSize={16} fontWeight={600} color={'#525F7A'}>
                                        Xem trước tin nhắn
                                    </Typography>
                                    <Stack
                                        sx={{
                                            width: '100%',
                                            backgroundColor: '#EEF0F4',
                                            borderRadius: '4px',
                                            alignItems: 'center'
                                        }}>
                                        <Typography fontSize={14} padding={1}>
                                            {noiDungXemTruoc}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Grid>
                        )}
                        {objUpDate?.hinhThucGui === SMS_HinhThucGuiTin.ZALO ? (
                            idMauTinChosed?.length < 36 ? (
                                <iframe
                                    src={itemMauTinZNS?.previewUrl}
                                    width={'100%'}
                                    height={'100%'}
                                    style={{ minHeight: '380px' }}
                                    name={itemMauTinZNS?.templateName}></iframe>
                            ) : (
                                <ZaloTemplateView
                                    logoBanner={imageUrl}
                                    headerText={headerElm?.content ?? ''}
                                    contentText={textElm?.content ?? ''}
                                    tables={tblDetail}
                                    buttons={lstButton}
                                />
                            )
                        ) : null}
                    </Grid>
                    <DialogActions sx={{ padding: '16px 0px 0px !important' }}>
                        <Button
                            onClick={onClose}
                            variant="outlined"
                            sx={{
                                fontSize: '14px',
                                textTransform: 'unset',
                                color: 'var(--color-main)'
                            }}
                            className="btn-outline-hover">
                            Hủy
                        </Button>
                        {!isSaving ? (
                            <Button
                                variant="contained"
                                onClick={saveCaiDatNhacNho}
                                sx={{
                                    fontSize: '14px',
                                    textTransform: 'unset',
                                    color: '#fff',

                                    border: 'none'
                                }}
                                className="btn-container-hover">
                                Lưu
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                sx={{
                                    fontSize: '14px',
                                    textTransform: 'unset',
                                    color: '#fff',

                                    border: 'none'
                                }}
                                className="btn-container-hover">
                                Đang lưu
                            </Button>
                        )}
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </>
    );
};
export default ModalCaiDatNhacNho;
