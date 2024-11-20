import { Box, Button, Grid, Stack, Tab, Typography } from '@mui/material';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import ModalSmsTemplate from './modal_sms_template';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import { useContext, useEffect, useState } from 'react';
import { GroupMauTinSMSDto, MauTinSMSDto } from '../../../services/sms/mau_tin_sms/mau_tin_dto';
import MauTinSMSService from '../../../services/sms/mau_tin_sms/MauTinSMSService';
import abpCustom from '../../../components/abp-custom';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Cookies from 'js-cookie';
import { AppContext } from '../../../services/chi_nhanh/ChiNhanhContext';
import { Add } from '@mui/icons-material';
import TabPanel from '@mui/lab/TabPanel';
import { IZaloTemplate, IZaloTemplate_GroupLoaiTin } from '../../../services/zalo/ZaloTemplateDto';
import ZaloService from '../../../services/zalo/ZaloService';
import { LoaiTin } from '../../../lib/appconst';
import { ZaloConst } from '../../../lib/zaloConst';
import ModalZaloTemplate from '../../zalo/modal_zalo_template';
import PageEmpty from '../../../components/PageEmpty';

export const PageMauTin_TabActive = {
    ZALO: '1',
    SMS: '2'
};

const MauTinNhan = () => {
    const [visiable, setVisiable] = useState(false);
    const [idMauTin, setIdMauTin] = useState('');
    const [tabActive, setTabActive] = useState(PageMauTin_TabActive.ZALO);
    const [dataGroupMauTin, setDataGroupMauTin] = useState<GroupMauTinSMSDto[]>([]);
    const [objMauTin, setObjMauTin] = useState<MauTinSMSDto>({} as MauTinSMSDto);
    const [allMauTinDB, setAllMauTinDB] = useState<IZaloTemplate_GroupLoaiTin[]>([]);
    const [zaloLstTemplateDefault, setZaloLstTemplateDefault] = useState<IZaloTemplate[]>([]);

    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const appContext = useContext(AppContext);
    const chiNhanhCurrent = appContext.chinhanhCurrent;
    const idChiNhanhCookies = Cookies.get('IdChiNhanh') ?? '';

    const role_MauTin_Zalo = abpCustom.isGrandPermission('Pages.BaoCao.BanHang.TongHop');
    const role_MauTin_SMS = abpCustom.isGrandPermission('Pages.BaoCao.BanHang.ChiTiet');

    useEffect(() => {
        GetAllMauTinZalo_groupLoaiTin();
        InnitData_TempZalo();
    }, []);

    const GetAllMauTinSMS = async () => {
        const data = await MauTinSMSService.GetAllMauTinSMS_GroupLoaiTin();
        if (data !== null) {
            setDataGroupMauTin(data);
        }
    };

    const GetAllMauTinZalo_groupLoaiTin = async () => {
        const data = await ZaloService.GetAllMauTinZalo_groupLoaiTin();
        setAllMauTinDB(data);
    };

    const InnitData_TempZalo = async () => {
        const data = await ZaloService.InnitData_TempZalo();
        setZaloLstTemplateDefault(data);
    };

    const editMauTinZalo = (idMauTin: string) => {
        // const roleEdit = abpCustom.isGrandPermission('"Pages.SMS_Template.Create');
        // if (roleEdit) {
        //     setObjAlert({ mes: `Không có quyền chỉnh sửa mẫu tin`, show: true, type: 2 });
        //     return;
        // }
        setIdMauTin(idMauTin);
        setVisiable(true);
    };

    const showModalAddMauTin = () => {
        setVisiable(true);
        setIdMauTin('');
        setObjMauTin({} as MauTinSMSDto);
    };

    const editMauTin = async (item: MauTinSMSDto) => {
        const roleEdit = abpCustom.isGrandPermission('"Pages.SMS_Template.Create');
        if (roleEdit) {
            setObjAlert({ mes: `Không có quyền chỉnh sửa mẫu tin`, show: true, type: 2 });
            return;
        }
        setVisiable(true);
        setIdMauTin(item.id);
        setObjMauTin(item);
    };

    const saveMauTinOK = async (objMauTin: MauTinSMSDto, type: number) => {
        GetAllMauTinSMS();
        setVisiable(false);
    };
    const saveMauTinZaloOK = async (typeAction: number) => {
        GetAllMauTinZalo_groupLoaiTin();
        setVisiable(false);
    };

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setTabActive(newValue);

        if (newValue === PageMauTin_TabActive.ZALO) {
            GetAllMauTinZalo_groupLoaiTin();
        } else {
            GetAllMauTinSMS();
        }
    };

    return (
        <>
            <ModalSmsTemplate
                visiable={visiable && tabActive === PageMauTin_TabActive.SMS}
                idMauTin={idMauTin}
                objMauTinOld={objMauTin}
                onCancel={() => setVisiable(false)}
                onOK={saveMauTinOK}
            />
            <ModalZaloTemplate
                isShowModal={visiable && tabActive === PageMauTin_TabActive.ZALO}
                idUpdate={idMauTin}
                lstData={zaloLstTemplateDefault}
                onClose={() => setVisiable(false)}
                onOK={saveMauTinZaloOK}
            />
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>

            <Box padding={2} paddingRight={0} className={'page-zalo-template'}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TabContext value={tabActive}>
                            <Stack
                                justifyContent={'space-between'}
                                spacing={2}
                                direction={window.screen.width >= 768 ? 'row' : 'column'}>
                                <Stack>
                                    <TabList onChange={handleChangeTab}>
                                        <Tab
                                            label="Mẫu tin zalo"
                                            value={PageMauTin_TabActive.ZALO}
                                            sx={{ display: role_MauTin_Zalo ? '' : 'none' }}
                                        />
                                        <Tab
                                            label="Mẫu tin SMS"
                                            value={PageMauTin_TabActive.SMS}
                                            sx={{ display: role_MauTin_SMS ? '' : 'none' }}
                                        />
                                    </TabList>
                                </Stack>
                                <Stack>
                                    <Button variant="contained" startIcon={<Add />} onClick={showModalAddMauTin}>
                                        Thêm mẫu tin
                                    </Button>
                                </Stack>
                            </Stack>
                        </TabContext>
                    </Grid>

                    <Grid item xs={12} className="page-full">
                        <TabContext value={tabActive}>
                            <TabPanel value={PageMauTin_TabActive.ZALO} sx={{ padding: 0 }}>
                                {allMauTinDB?.length == 0 ? (
                                    <PageEmpty style={{ height: '75vh' }} />
                                ) : (
                                    <Stack spacing={2}>
                                        {allMauTinDB?.map((item, index) => (
                                            <Stack spacing={2} key={index}>
                                                <Stack spacing={2} direction={'row'}>
                                                    {item.idLoaiTinZalo === ZaloConst.LoaiTin.PROMOTION ? (
                                                        <CampaignOutlinedIcon sx={{ color: 'rgb(128, 10, 199)' }} />
                                                    ) : item.idLoaiTinZalo === ZaloConst.LoaiTin.TRANSACTION ? (
                                                        <ReceiptOutlinedIcon sx={{ color: 'rgb(80, 205, 137)' }} />
                                                    ) : item.idLoaiTinZalo === ZaloConst.LoaiTin.MESSAGE ? (
                                                        <LibraryBooksOutlinedIcon />
                                                    ) : (
                                                        <LibraryBooksOutlinedIcon />
                                                    )}
                                                    <Typography fontWeight={500}>{item.tenLoaiTinZalo}</Typography>
                                                </Stack>
                                                <Stack paddingLeft={2}>
                                                    {item?.lstDetail?.map((detail) => (
                                                        <Stack
                                                            spacing={1}
                                                            key={detail?.id}
                                                            className="details-mau-tin"
                                                            padding={1}
                                                            onClick={() => editMauTinZalo(detail?.id)}>
                                                            <Stack spacing={1} direction={'row'} flex={12}>
                                                                <Typography variant="body2" fontWeight={500} flex={2}>
                                                                    {detail?.tenMauTin}
                                                                </Typography>
                                                                <Stack flex={10}>
                                                                    {detail?.elements?.map((elm) => (
                                                                        <Stack key={elm?.id}>
                                                                            {elm.elementType ===
                                                                            ZaloConst.ElementType.TEXT ? (
                                                                                <Typography variant="body2">
                                                                                    {elm.content}
                                                                                </Typography>
                                                                            ) : elm.elementType ===
                                                                              ZaloConst.ElementType.HEADER ? (
                                                                                <Typography variant="body2">
                                                                                    {elm.content}
                                                                                </Typography>
                                                                            ) : null}
                                                                        </Stack>
                                                                    ))}
                                                                </Stack>
                                                            </Stack>
                                                        </Stack>
                                                    ))}
                                                </Stack>
                                            </Stack>
                                        ))}
                                    </Stack>
                                )}
                            </TabPanel>
                            <TabPanel value={PageMauTin_TabActive.SMS} sx={{ padding: 0 }}>
                                {dataGroupMauTin?.length == 0 ? (
                                    <PageEmpty style={{ height: '75vh' }} />
                                ) : (
                                    <Stack spacing={2}>
                                        {dataGroupMauTin?.map((item, index) => (
                                            <Stack spacing={2} key={index}>
                                                <Stack spacing={2} direction={'row'}>
                                                    {item.idLoaiTin === LoaiTin.TIN_SINH_NHAT ? (
                                                        <CakeOutlinedIcon sx={{ color: 'rgb(128, 10, 199)' }} />
                                                    ) : item.idLoaiTin === LoaiTin.TIN_LICH_HEN ? (
                                                        <NotificationsNoneOutlinedIcon
                                                            sx={{ color: 'rgb(255, 125, 161)' }}
                                                        />
                                                    ) : item.idLoaiTin === LoaiTin.TIN_GIAO_DICH ? (
                                                        <ReceiptOutlinedIcon sx={{ color: 'rgb(80, 205, 137)' }} />
                                                    ) : (
                                                        <LibraryBooksOutlinedIcon />
                                                    )}
                                                    <Typography fontWeight={500}>{item.loaiTin}</Typography>
                                                </Stack>
                                                <Stack paddingLeft={2}>
                                                    {item?.lstDetail?.map((detail) => (
                                                        <Stack
                                                            spacing={1}
                                                            key={detail?.id}
                                                            className="details-mau-tin"
                                                            padding={1}
                                                            onClick={() => editMauTin(detail)}>
                                                            <Stack spacing={1} direction={'row'} flex={12}>
                                                                <Typography variant="body2" fontWeight={500} flex={2}>
                                                                    {detail?.tenMauTin}
                                                                </Typography>
                                                                <Typography variant="body2" flex={10}>
                                                                    {detail?.noiDungTinMau}
                                                                </Typography>
                                                            </Stack>
                                                        </Stack>
                                                    ))}
                                                </Stack>
                                            </Stack>
                                        ))}
                                    </Stack>
                                )}
                            </TabPanel>
                        </TabContext>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};
export default MauTinNhan;
