import { useNavigate, Route, Navigate } from 'react-router-dom';
import { isGranted } from '../../../lib/abpUtility';
import { ReactNode } from 'react';
import Cookies from 'js-cookie';

type RouteProps = {
    path: string;
    name: string;
    permission: string;
    title: string;
    icon: ReactNode;
    iconActive: ReactNode;
    children: RouteProps[];
    showInMenu: boolean;
    isLayout: boolean;
    component: any;
};
const ProtectedRoute = ({ path, component: Component, permission }: any) => {
    const navigate = useNavigate();

    return (
        <Route
            key={path}
            path={path}
            element={
                !Cookies.get('authenticated') ? (
                    <Navigate to="/user/login" />
                ) : permission && !isGranted(permission) ? (
                    <Navigate to="/exception?type=401" />
                ) : Component ? (
                    <Component />
                ) : null
            }
        />
    );
};

export default ProtectedRoute;
