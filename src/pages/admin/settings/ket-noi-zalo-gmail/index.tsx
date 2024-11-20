import React, { useEffect, useState } from 'react';
import { Grid, Stack, Box, Tab, Tabs, Button, Typography, Link } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { ReactComponent as ZaloIcon } from '../../../../images/icons/zalo-icon-nen-trang.svg';
import { ReactComponent as ZaloIconOffical } from '../../../../images/icons/zalo-icon-nen-xanh.svg';
import ZaloService from '../../../../services/zalo/ZaloService';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import { InforZOA, ZaloAuthorizationDto } from '../../../../services/zalo/zalo_dto';
import utils from '../../../../utils/utils';
import { Guid } from 'guid-typescript';
import SnackbarAlert from '../../../../components/AlertDialog/SnackbarAlert';
import { ButtonNavigate } from '../../../../components/Button/ButtonNavigate';
import EmailSetting from '../Email';
import { isGranted } from '../../../../lib/abpUtility';
import abpCustom from '../../../../components/abp-custom';

export default function ThietLapKetNoiZaloGmail() {
    const [tabActive, setTabActive] = useState('2');
    const [inforZOA, setInforZOA] = useState<InforZOA>({} as InforZOA);
    const [zaloToken, setZaloToken] = useState<ZaloAuthorizationDto>(new ZaloAuthorizationDto({ id: Guid.EMPTY }));
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    useEffect(() => {
        GetTokenfromDB();
    }, []);

    const GetTokenfromDB = async () => {
        const objAuthen = await ZaloService.Innit_orGetToken();
        if (objAuthen !== null) {
            setZaloToken(objAuthen);
            if (utils.checkNull(objAuthen?.accessToken)) {
                await GetAuthenCode(objAuthen.codeVerifier, objAuthen);
            } else {
                const newOA = await ZaloService.GetInfor_ZaloOfficialAccount(objAuthen?.accessToken);
                setInforZOA(newOA);
            }
        }
    };

    const urltes = `https://oauth.zaloapp.com/v4/oa/permission?app_id=1575833233908225704&redirect_uri=https%3A%2F%2Flogin.luckybeauty.vn%2Fsettings%2Fket-noi-zalo-gmail`;
    const urlPermissionOA = `https://oauth.zaloapp.com/v4/oa/permission?app_id=${process.env.REACT_APP_ZALO_APP_ID}&redirect_uri=${process.env.REACT_APP_APP_BASE_URL}/settings/ket-noi-zalo-gmail`;

    const GetAuthenCode = async (codeVerifier: string, zaloToken: ZaloAuthorizationDto) => {
        // check exist db or create new
        const params = new URLSearchParams(window.location.search);
        if (params.size > 0) {
            const authenCode = params.get('code');
            const oa_id = params.get('oa_id');
            console.log('oa_id ', oa_id);
            if (authenCode !== null) {
                if (!utils.checkNull(codeVerifier)) {
                    const dataAccessToken = await ZaloService.GetAccessToken_fromAuthorizationCode(
                        authenCode,
                        codeVerifier
                    );

                    // update authenCode if is first connect
                    const objUpdate = { ...zaloToken };
                    objUpdate.authorizationCode = authenCode;
                    objUpdate.accessToken = dataAccessToken?.access_token;
                    objUpdate.refreshToken = dataAccessToken?.refresh_token;
                    objUpdate.expiresToken = dataAccessToken?.expires_in;
                    if (utils.checkNull(zaloToken.refreshToken)) {
                        setZaloToken({
                            ...zaloToken,
                            authorizationCode: authenCode,
                            accessToken: dataAccessToken?.access_token,
                            refreshToken: dataAccessToken?.refresh_token,
                            expiresToken: dataAccessToken?.expires_in
                        });
                        await ZaloService.UpdateZaloToken(objUpdate);
                    }

                    if (dataAccessToken != null) {
                        const newOA = await ZaloService.GetInfor_ZaloOfficialAccount(dataAccessToken?.access_token);
                        setInforZOA(newOA);
                    }
                }
            }
        } else {
            const newOA = await ZaloService.GetInfor_ZaloOfficialAccount(zaloToken?.accessToken);
            setInforZOA(newOA);
        }
    };

    const onClickXoaKetNoi = async () => {
        setZaloToken({ ...zaloToken, authorizationCode: '', accessToken: '' });
        await ZaloService.XoaKetNoi(zaloToken?.id);
        setObjAlert({ ...objAlert, show: true, mes: 'Bạn vừa ngắt kết nối tới Zalo' });
    };

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabActive(newValue);
        switch (newValue) {
            case '1':
                {
                    //setListMauInHoaDon(allMauIn);
                }
                break;
            default:
                //setListMauInHoaDon(allMauIn);
                break;
        }
    };

    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Grid container>
                <Grid item xs={12}>
                    <TabContext value={tabActive}>
                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'end'}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange}>
                                    <Tab label="Zalo" value="2" />
                                    {abpCustom.isGrandPermission('Pages.Tenants') ? (
                                        <Tab label="Email" value="3" />
                                    ) : null}
                                </TabList>
                            </Box>
                            <Stack>
                                <ButtonNavigate navigateTo="/settings" btnText="Trở về cài đặt" />
                            </Stack>
                        </Stack>

                        <TabPanel value="2">
                            {!zaloToken?.accessToken && (
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={5}></Grid>
                                    <Grid item xs={12} md={2}>
                                        <Box alignItems={'center'}>
                                            <Link underline="none" variant="body2" href={urlPermissionOA}>
                                                <Button
                                                    startIcon={<ZaloIcon style={{ height: '30px' }} />}
                                                    variant="contained"
                                                    fullWidth
                                                    sx={{ height: 50, fontSize: '18px', borderRadius: '20px' }}>
                                                    Thêm kết nối
                                                </Button>
                                            </Link>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={5}></Grid>

                                    <Grid item xs={12}>
                                        <Stack spacing={2} alignItems={'center'}>
                                            <Typography variant="body2">
                                                Kết nối với Zalo để thiết lập gửi tin nhắn tự động qua hệ thống Lucky
                                                beauty
                                            </Typography>
                                            {/* <Route path="https://id.zalo.me/account" /> */}
                                            <Typography variant="body2">
                                                Chỉ áp dụng cho tài khoản ZOA được phép tích hợp API.{' '}
                                                <Link
                                                    href="https://developers.zalo.me/docs/official-account/bat-dau/kham-pha"
                                                    underline="hover">
                                                    {'Xem chi tiết'}
                                                </Link>
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            )}

                            {zaloToken?.accessToken && (
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                            <ZaloIconOffical style={{ height: '40px' }} />
                                            <Typography
                                                fontSize={'14px'}
                                                fontWeight={500}
                                                color={'#0180c7'}
                                                sx={{
                                                    fontFamily: 'var(--font-family-main) !important'
                                                }}>
                                                Official Account
                                            </Typography>
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Stack
                                            direction={'row'}
                                            spacing={1}
                                            justifyContent={'end'}
                                            alignItems={'center'}>
                                            <img src={inforZOA?.avatar} width={50} height={50} />
                                            <Typography fontSize={'14px'} fontWeight={600}>
                                                {inforZOA?.name}
                                            </Typography>
                                            <Button
                                                startIcon={<LinkOutlinedIcon />}
                                                variant="contained"
                                                onClick={onClickXoaKetNoi}>
                                                Xóa kết nối
                                            </Button>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            )}
                        </TabPanel>
                        {abpCustom.isGrandPermission('Pages.Tenants') ? (
                            <TabPanel value="3">
                                <EmailSetting />
                            </TabPanel>
                        ) : null}
                    </TabContext>
                </Grid>
            </Grid>
        </>
    );
}
