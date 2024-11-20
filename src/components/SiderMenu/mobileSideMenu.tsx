import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { appRouters } from '../routers';
import sessionStore from '../../stores/sessionStore';
import { observer } from 'mobx-react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
interface Props {
    isOpen: boolean;
    onOpen: () => void;
}
interface MenuItem {
    key: React.Key;
    path: string; // Add path property
    icon?: React.ReactNode;
    iconActive?: React.ReactNode;
    children?: MenuItem[];
    label: React.ReactNode;
    type?: 'group';
}

function convertMenuItemsToMenu(menuItems: any[], listPermission: string[]): MenuItem[] {
    const menu: MenuItem[] = [];
    const routerMenu = menuItems.filter((x) => x.showInMenu === true);
    routerMenu.forEach((item) => {
        // Check if item has permission to be added to menu
        if (listPermission.includes(item.permission) || item.permission === '') {
            const menuItem: MenuItem = {
                key: item.path,
                path: item.path, // Add path property
                label:
                    item.children.length > 0 ? (
                        item.title
                    ) : (
                        <Link to={item.path} title={item.title} style={{ textDecoration: 'none' }}>
                            {item.title}
                        </Link>
                    ),
                icon: item.icon,
                iconActive: item.iconActive,
                type: item.isLayout ? 'group' : undefined,
                children: item.children.length > 0 ? convertMenuItemsToMenu(item.children, listPermission) : undefined
            };
            menu.push(menuItem);
        }
    });
    return menu;
}
const RecursiveMenuItem: React.FC<{ route: MenuItem; key: number }> = ({ route, key }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [openMenuItem, setOpenMenuItem] = useState<{ [key: number]: boolean }>({});

    const handleDropdown = (index: number) => {
        setOpenMenuItem((prevOpen) => ({
            ...prevOpen,
            [index]: !prevOpen[index]
        }));
    };
    return (
        <>
            <ListItem
                key={key}
                component={Box as React.ElementType}
                //to={route.children && route.children.length > 0 ? undefined : route.path}
                className={
                    location.pathname === route.path ||
                    route.children?.some((dropdownItem) => location.pathname === dropdownItem.path)
                        ? 'nav-item active'
                        : 'nav-item'
                }
                onClick={() => {
                    route.children && route.children.length > 0 ? undefined : navigate(route.path);
                }}
                selected={location.pathname === route.path}
                sx={{
                    flexWrap: 'wrap',
                    padding: '0'
                }}>
                <Box
                    component="button"
                    sx={{
                        width: '100%',
                        border: '0',
                        display: 'flex',
                        padding: '8px 14px',
                        height: '40px',
                        transition: '.4s',
                        alignItems: 'center',
                        backgroundColor:
                            location.pathname === route.path ||
                            route.children?.some((dropdownItem) => location.pathname === dropdownItem.path)
                                ? 'var(--color-bg)!important'
                                : 'transparent',
                        borderRadius: '8px',
                        ':hover': {
                            backgroundColor: 'var(--color-bg)!important'
                        }
                    }}
                    onClick={route.children ? () => handleDropdown(key) : undefined}>
                    <ListItemIcon
                        sx={{
                            minWidth: '40px',
                            transition: '.4s',
                            filter:
                                location.pathname === route.path ||
                                route.children?.some((dropdownItem) => location.pathname === dropdownItem.key)
                                    ? 'brightness(0) saturate(100%) invert(17%) sepia(0%) saturate(399%) hue-rotate(341deg) brightness(95%) contrast(87%)'
                                    : 'unset'
                        }}>
                        {location.pathname === route.path ||
                        route.children?.some((dropdownItem) => location.pathname === dropdownItem.key)
                            ? route.iconActive
                            : route.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={route.label}
                        sx={{
                            flex: 'unset!important',
                            '& a': {
                                fontSize: '14px',
                                fontFamily: 'Roboto',
                                // color:
                                //     location.pathname === route.path ||
                                //     route.children?.some(
                                //         (dropdownItem) => location.pathname === dropdownItem.key
                                //     )
                                //         ? '#00284C'
                                //         : '#3B4758',
                                color: 'black',
                                fontWeight:
                                    location.pathname === route.path ||
                                    route.children?.some((dropdownItem) => location.pathname === dropdownItem.key)
                                        ? '500'
                                        : '400'
                            },
                            transition: '.4s',
                            left: '20%',
                            position: 'absolute',

                            marginY: 0,
                            paddingY: '4px',
                            '& span': {
                                fontSize: '14px',
                                fontFamily: 'Roboto !important',
                                // color:
                                //     location.pathname === route.path ||
                                //     route.children?.some(
                                //         (dropdownItem) => location.pathname === dropdownItem.path
                                //     )
                                //         ? '#3B4758'
                                //         : '#3D475C',
                                color: 'black',
                                fontWeight:
                                    location.pathname === route.path ||
                                    route.children?.some((dropdownItem) => location.pathname === dropdownItem.path)
                                        ? '500'
                                        : '400'
                            }
                        }}
                    />
                    {route.children &&
                        (openMenuItem[key] ? (
                            <ExpandLessIcon
                                sx={{
                                    color: '#343234!important',
                                    ml: 'auto',
                                    transition: '.4s',
                                    position: 'relative'
                                    //right: collapsed || OpenHover ? '0' : '-30px'
                                }}
                            />
                        ) : (
                            <ExpandMoreIcon
                                sx={{
                                    color: '#343234!important',
                                    ml: 'auto',
                                    transition: '.4s',
                                    position: 'relative'
                                    //right: collapsed || OpenHover ? '0' : '-30px'
                                }}
                            />
                        ))}
                </Box>
            </ListItem>
            {route.children && (
                <Box
                    sx={{
                        overflow: 'hidden',
                        marginLeft: 'auto',
                        width: '100%',
                        position: 'relative',
                        pl: '26px',
                        transition: openMenuItem[key]
                            ? 'max-height 2.5s, left .4s,min-height .4s'
                            : ' max-height 1s,left .4s,min-height .4s',
                        maxHeight: openMenuItem[key] == true ? '400px' : '0px'
                    }}>
                    <List component="div" disablePadding>
                        {route.children.map((dropdownItem) => (
                            <ListItem
                                key={dropdownItem.key}
                                component={Box as React.ElementType}
                                to={dropdownItem.key}
                                onClick={() => {
                                    dropdownItem.children && dropdownItem.children.length > 0
                                        ? undefined
                                        : navigate(dropdownItem.path);
                                }}
                                selected={
                                    location.pathname === dropdownItem.path ||
                                    route.children?.some((dropdownItem) => location.pathname === dropdownItem.path)
                                }
                                sx={{
                                    backgroundColor: 'transparent!important',
                                    padding: '2px'
                                }}>
                                <ListItemIcon
                                    sx={{
                                        '& svg': {
                                            filter:
                                                location.pathname === dropdownItem.path
                                                    ? 'var(--color-hoverIcon)'
                                                    : 'black'
                                        },
                                        minWidth: '20px'
                                    }}>
                                    {dropdownItem.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={dropdownItem.label}
                                    sx={{
                                        '& a': {
                                            fontSize: '14px',
                                            color: location.pathname === dropdownItem.path ? '#319DFF' : '#3D475C'
                                            //color: 'black'
                                        },
                                        ':hover a': {
                                            //color: '#319DFF'
                                            color: 'black'
                                        }
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </>
    );
};
const ResponsiveDrawer: React.FC<Props> = ({ isOpen, onOpen }) => {
    const mainAppRoutes = appRouters.mainRoutes[1].routes.filter(
        (item: { showInMenu: boolean }) => item.showInMenu === true
    );
    const itemMenus = convertMenuItemsToMenu(mainAppRoutes, sessionStore.listPermisson);
    return (
        <Drawer
            variant="temporary"
            sx={{
                '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    width: isOpen ? '0px' : '240px'
                }
            }}
            ModalProps={{
                keepMounted: true // Better open performance on mobile.
            }}
            onClose={onOpen}
            open={!isOpen}>
            <List
                sx={{
                    minWidth: '218px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    '& .Mui-selected': {
                        bgcolor: 'transparent!important'
                    }
                }}>
                {itemMenus.map((item: MenuItem, index: number) => (
                    <RecursiveMenuItem key={index} route={item} />
                ))}
            </List>
        </Drawer>
    );
};

export default observer(ResponsiveDrawer);
