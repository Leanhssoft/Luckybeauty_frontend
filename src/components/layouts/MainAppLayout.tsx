import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AppSiderMenu from '../SiderMenu/index';
import Cookies from 'js-cookie';
import LoginAlertDialog from '../AlertDialog/LoginAlert';
import { Container } from '@mui/system';
import Box from '@mui/material/Box';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import { SuggestChiNhanhDto } from '../../services/suggests/dto/SuggestChiNhanhDto';
import http from '../../services/httpService';
import sessionStore from '../../stores/sessionStore';
import ResponsiveDrawer from '../SiderMenu/mobileSideMenu';
import Header from '../Header';
import { CuaHangDto } from '../../services/cua_hang/Dto/CuaHangDto';
import cuaHangService from '../../services/cua_hang/cuaHangService';
import { PagedRequestDto } from '../../services/dto/pagedRequestDto';
import { inject, observer } from 'mobx-react';
import NotificationStore from '../../stores/notificationStore';
import Stores from '../../stores/storeIdentifier';

const isAuthenticated = (): boolean => {
    const accessToken = Cookies.get('Abp.AuthToken');
    if (accessToken && !accessToken.includes('error')) {
        try {
            return true;
        } catch (error) {
            console.log(error);
        }
    }
    return false;
};
interface IMainAppLayout {
    notificationStore: NotificationStore;
}

const MainAppLayout: React.FC<IMainAppLayout> = (props) => {
    const [chinhanhCurrent, setChiNhanhCurrent] = React.useState<SuggestChiNhanhDto>({
        id: '',
        tenChiNhanh: ''
    });
    const { notificationStore } = props;
    const [congty, setCongTy] = useState<CuaHangDto>({} as CuaHangDto);
    const GetAllCongTy = async () => {
        const data = await cuaHangService.GetAllCongTy({} as PagedRequestDto);
        if (data.length > 0) {
            setCongTy(data[0]);
        }
    };
    const getPermissions = () => {
        const userId = Cookies.get('userId');
        const token = Cookies.get('Abp.AuthToken');
        const encryptedAccessToken = Cookies.get('encryptedAccessToken');
        if (userId !== undefined && userId !== null && token !== undefined && token !== null) {
            http.post(`api/services/app/Permission/GetAllPermissionByRole?UserId=${userId}`, {
                headers: {
                    accept: 'text/plain',
                    Authorization: 'Bearer ' + token,
                    'X-XSRF-TOKEN': encryptedAccessToken
                }
            })
                .then((response) => {
                    sessionStore.listPermisson = response.data.result['permissions'];
                    const item = {
                        value: response.data.result['permissions']
                    };
                    localStorage.setItem('permissions', JSON.stringify(item));
                })
                .catch((error) => console.log(error));
        }
    };
    useEffect(() => {
        notificationStore.createHubConnection();
    });
    useEffect(() => {
        // Call API to get list of permissions here
        getPermissions();
        GetAllCongTy();
    }, []);
    const [open, setOpen] = React.useState(!isAuthenticated);
    const navigate = useNavigate();
    useEffect(() => {
        setOpen(!isAuthenticated);
    }, []);

    const confirm = () => {
        setOpen(false);
        navigate('/login');
    };
    const [isChildHovered, setChildHovered] = useState(false);

    const handleChildHoverChange = (isHovered: boolean) => {
        setChildHovered(isHovered);
    };
    const [collapsed, onCollapse] = useState(true);

    const toggle = () => {
        onCollapse(!collapsed);
        handleChildHoverChange(!isChildHovered);
        if (collapsed == false) {
            Cookies.set('sidebar', 'true', { expires: 7 });
        } else {
            Cookies.set('sidebar', 'false');
        }
    };
    const CookieSidebar = Cookies.get('sidebar') === 'true';

    useEffect(() => {
        if (CookieSidebar) {
            onCollapse(true);
            handleChildHoverChange(false);
        } else {
            onCollapse(false);
            handleChildHoverChange(true);
        }
    }, []);

    const changeChiNhanh = (item: SuggestChiNhanhDto) => {
        setChiNhanhCurrent(item);
    };
    return (
        <Container maxWidth={false} disableGutters={true}>
            {window.screen.width > 650 ? (
                <Box>
                    <AppSiderMenu
                        collapsed={!collapsed}
                        toggle={toggle}
                        onHoverChange={handleChildHoverChange}
                        CookieSidebar={CookieSidebar}
                    />
                    <Box
                        sx={{
                            marginLeft: !collapsed ? '240px' : '0px',
                            transition: '.4s'
                        }}>
                        <Header
                            collapsed={collapsed}
                            toggle={toggle}
                            onClick={toggle}
                            isChildHovered={isChildHovered}
                            CookieSidebar={CookieSidebar}
                            handleChangeChiNhanh={changeChiNhanh}
                            notificationStore={notificationStore}
                        />
                        <Box
                            padding={2}
                            paddingTop={0}
                            sx={{
                                borderBottom: 'solid 0.1rem #e6e1e6',
                                borderRight: 'solid 0.1rem #e6e1e6',
                                borderLeft: 'solid 0.1rem #e6e1e6',
                                marginTop: '70px',
                                minHeight: 'calc(100vh - 70px)',
                                bgcolor: 'rgba(248,248,248,1)'
                            }}>
                            <AppContext.Provider value={{ chinhanhCurrent, congty }}>
                                <Outlet />
                            </AppContext.Provider>
                            <LoginAlertDialog open={open} confirmLogin={confirm} />
                        </Box>
                    </Box>
                </Box>
            ) : (
                <Box>
                    <Header
                        collapsed={collapsed}
                        toggle={toggle}
                        onClick={toggle}
                        isChildHovered={isChildHovered}
                        CookieSidebar={CookieSidebar}
                        handleChangeChiNhanh={changeChiNhanh}
                        notificationStore={notificationStore}
                    />
                    <Box>
                        <ResponsiveDrawer isOpen={!collapsed} onOpen={toggle} />
                        <Box
                            padding={2}
                            paddingTop={0}
                            sx={{
                                borderBottom: 'solid 0.1rem #e6e1e6',
                                borderRight: 'solid 0.1rem #e6e1e6',
                                borderLeft: 'solid 0.1rem #e6e1e6',
                                marginTop: '70px',
                                minHeight: 'calc(100vh - 70px)',
                                bgcolor: 'rgba(248,248,248,1)'
                            }}>
                            <AppContext.Provider value={{ chinhanhCurrent, congty }}>
                                <Outlet />
                            </AppContext.Provider>
                            <LoginAlertDialog open={open} confirmLogin={confirm} />
                        </Box>
                    </Box>
                </Box>
            )}
        </Container>
    );
};

export default inject(Stores.NotificationStore)(observer(MainAppLayout));
