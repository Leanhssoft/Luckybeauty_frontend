import { Route, Routes as ReactRoutes, Navigate } from 'react-router-dom';
import { appRouters, userRouter } from './index';
import { ReactNode } from 'react';
import abpCustom from '../abp-custom';
import Cookies from 'js-cookie';
import UserLayout from '../layouts/UserLayout';
import Exception404 from '../../pages/Exception/Exception404';
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
const renderRoutesRecursive = (routes: RouteProps[]) => {
    return routes.map(({ component: Component, path, name, children, permission }, index) => {
        if (children && children.length > 0) {
            const nestedRoutes = renderRoutesRecursive(children);
            return <Route key={index}>{nestedRoutes}</Route>;
        }
        return (
            Component &&
            path && (
                <Route
                    key={name}
                    element={
                        !Cookies.get('authenticated') ? (
                            <Navigate to="/login" />
                        ) : !abpCustom.isGrandPermission(permission) ? (
                            <Navigate to="/exception401" />
                        ) : Component ? (
                            <Component />
                        ) : null
                    }
                    path={path}
                />
            )
        );
    });
};

const renderRoutes = () => {
    return (
        <ReactRoutes>
            {appRouters.mainRoutes.map(({ layout: Layout, routes }, index) => (
                <Route element={<Layout />} key={index}>
                    {renderRoutesRecursive(routes)}
                </Route>
            ))}
            <Route element={<UserLayout />}>
                {userRouter.map((item) => {
                    return <Route key={item.path} path={item.path} element={<item.component />} />;
                })}
            </Route>
            <Route path="*" element={<Navigate to="/exception404" />} />
        </ReactRoutes>
    );
};

export default renderRoutes;
