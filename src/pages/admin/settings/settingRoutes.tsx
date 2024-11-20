import LoadableComponent from '../../../components/Loadable';
import { ReactComponent as SettingIcon } from '../../../images/settingIcon.svg';
import { ReactComponent as SetingActive } from '../../../images/settingActive.svg';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import { RouteProps } from '../../../components/routers';
const SettingRoutes: RouteProps[] = [
    {
        path: '/settings',
        permission: 'Pages.CongTy',
        title: 'Cài đặt',
        name: 'caidat',
        icon: <SettingIcon width="20px" />,
        iconActive: <SetingActive width="20px" />,
        showInMenu: true,
        isLayout: false,
        children: [],
        component: LoadableComponent(() => import('../../../pages/admin/settings'))
    },
    {
        path: '/settings/cua-hang',
        permission: 'Pages.CongTy',
        title: 'Cửa hàng',
        name: 'caidat',
        icon: <SettingIcon width="20px" />,
        iconActive: <SetingActive width="20px" />,
        showInMenu: false,
        isLayout: false,
        children: [],
        component: LoadableComponent(() => import('../../../pages/admin/settings/cua-hang/index'))
    },
    {
        path: '/settings/chi-nhanhs',
        permission: 'Pages.CongTy',
        title: 'Chi nhánh',
        name: 'caidat',
        icon: <SettingIcon width="20px" />,
        iconActive: <SetingActive width="20px" />,
        showInMenu: false,
        isLayout: false,
        children: [],
        component: LoadableComponent(() => import('../../../pages/admin/settings/chi-nhanh'))
    },
    {
        path: '/settings/dat-lich',
        permission: 'Pages.CongTy',
        title: 'Đặt lịch',
        name: 'caidat',
        icon: <SettingIcon width="20px" />,
        iconActive: <SetingActive width="20px" />,
        showInMenu: false,
        isLayout: false,
        children: [],
        component: LoadableComponent(() => import('../../../pages/admin/settings/Booking'))
    },
    {
        path: '/settings/ket-noi-zalo-gmail',
        permission: 'Pages.CongTy',
        title: 'Kết nối zalo - gmail',
        name: 'caidat',
        icon: <SettingIcon width="20px" />,
        iconActive: <SetingActive width="20px" />,
        showInMenu: false,
        isLayout: false,
        children: [],
        component: LoadableComponent(() => import('../../../pages/admin/settings/ket-noi-zalo-gmail/index'))
    },
    {
        path: '/settings/hoa-hong',
        permission: 'Pages.CongTy',
        title: 'Hoa hồng',
        name: 'caidat',
        icon: <SettingIcon width="20px" />,
        iconActive: <SetingActive width="20px" />,
        showInMenu: false,
        isLayout: false,
        children: [],
        component: LoadableComponent(() => import('../../../pages/admin/settings/hoa-hong-nhan-vien'))
    },
    {
        path: '/settings/mau-in',
        permission: 'Pages.CongTy',
        title: 'Hoa hồng',
        name: 'caidat',
        icon: <SettingIcon width="20px" />,
        iconActive: <SetingActive width="20px" />,
        showInMenu: false,
        isLayout: false,
        children: [],
        component: LoadableComponent(() => import('../../../pages/admin/settings/mau_in/page_mau_in'))
    },
    {
        path: '/settings/voucher',
        permission: 'Pages.CongTy',
        title: 'Hoa hồng',
        name: 'caidat',
        icon: <SettingIcon width="20px" />,
        iconActive: <SetingActive width="20px" />,
        showInMenu: false,
        isLayout: false,
        children: [],
        component: LoadableComponent(() => import('../../../pages/admin/settings/khuyen_mai'))
    },
    {
        path: '/settings/nhac_nho_tu_dong',
        permission: 'Pages',
        title: 'Email',
        name: 'email',
        icon: <SettingIcon width="20px" />,
        iconActive: <SetingActive width="20px" />,
        showInMenu: false,
        isLayout: false,
        children: [],
        component: LoadableComponent(() => import('../../../pages/admin/settings/nhac_nho_tu_dong'))
    },
    {
        path: '/settings/email',
        permission: 'Pages.CongTy',
        title: 'Email',
        name: 'email',
        icon: <SettingIcon width="20px" />,
        iconActive: <SetingActive width="20px" />,
        showInMenu: false,
        isLayout: false,
        children: [],
        component: LoadableComponent(() => import('../../../pages/admin/settings/Email'))
    },
    {
        path: '/settings/tai-khoan-ngan-hang',
        permission: 'Pages.Administration',
        title: 'Tài khoản ngân hàng',
        name: 'taiKhoanNganHang',
        icon: <SettingIcon width="20px" />,
        iconActive: <SetingActive width="20px" />,
        showInMenu: false,
        isLayout: false,
        children: [],
        component: LoadableComponent(() => import('../../../pages/tai_khoan_ngan_hang/index'))
    }
];
export default SettingRoutes;
