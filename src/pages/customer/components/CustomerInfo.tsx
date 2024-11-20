import React, { useEffect, useState } from 'react';
import { Box, Tab, Typography, Button, IconButton, Tabs, Avatar, Stack } from '@mui/material';

import { ReactComponent as ExportIcon } from '../../../images/download.svg';
import { ReactComponent as PrintIcon } from '../../../images/printer.svg';
import { ReactComponent as EditIcon } from '../../../images/pencil-fiiled.svg';
import { ReactComponent as DeleteIcon } from '../../../images/the-bin.svg';
import { ReactComponent as EditUserIcon } from '../../../images/edituser.svg';
import TabInfor from './TabInfor';
import TabCuocHen from './TabCuocHen';
import TabMuaHang from './TabMuaHang';
import { ReactComponent as ArrowLeft } from '../../../images/arrow_back.svg';
import { useParams } from 'react-router-dom';
import khachHangStore from '../../../stores/khachHangStore';
import AppConsts from '../../../lib/appconst';
import { observer } from 'mobx-react';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import CreateOrEditCustomerDialog from '../components/create-or-edit-customer-modal';
import khachHangService from '../../../services/khach-hang/khachHangService';
import { enqueueSnackbar } from 'notistack';
import utils from '../../../utils/utils';
interface Custom {
    onClose: () => void;
}
const CustomerInfo: React.FC<Custom> = ({ onClose }) => {
    const { khachHangId } = useParams();
    const [isShowEditKhachHang, setIsShowEditKhachHang] = useState(false);
    const [isShowDeleteKhachHang, setIsShowDeleteKhachHang] = useState(false);
    interface TabPanelProps {
        children?: React.ReactNode;
        value: number;
        index: number;
    }
    useEffect(() => {
        getKhachHangInfo();
    }, [khachHangId]);
    const getKhachHangInfo = async () => {
        await khachHangStore.getDetail(khachHangId ?? AppConsts.guidEmpty);
        //await khachHangStore.getLichSuDatLich(khachHangId ?? AppConsts.guidEmpty);
        //await khachHangStore.getLichSuGiaoDich(khachHangId ?? AppConsts.guidEmpty);
    };
    const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
        return (
            <div role="tabpanel" hidden={value !== index}>
                {value === index && <Box>{children}</Box>}
            </div>
        );
    };
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };
    return (
        <Box paddingTop="16px" sx={{ height: 'calc(100vh - 90px)', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography fontWeight="700" fontSize="16px" color="#333233">
                    Khách hàng
                </Typography>
                <Box
                    sx={{
                        '& button': {
                            minWidth: 'unset'
                        },
                        '& .btn-outline-hover': {
                            bgcolor: '#fff'
                        },
                        display: 'flex',
                        gap: '8px'
                    }}>
                    <Button
                        variant="outlined"
                        sx={{ color: '#666466' }}
                        className="btn-outline-hover"
                        startIcon={<PrintIcon />}>
                        In
                    </Button>
                    <Button
                        className="btn-outline-hover"
                        startIcon={<ExportIcon />}
                        variant="outlined"
                        sx={{ color: '#666466' }}>
                        Xuất
                    </Button>
                    <Button className="btn-container-hover" variant="contained" sx={{ bgcolor: '#7C3367' }}>
                        Sao chép
                    </Button>
                </Box>
            </Box>
            <Box
                sx={{
                    bgcolor: '#fff',
                    padding: '24px',
                    pb: '0',
                    borderRadius: '12px',
                    boxShadow: '0px 4px 20px 0px #AAA9B81A',
                    mt: '16px'
                }}>
                <Box sx={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                    <Box>
                        {khachHangStore.khachHangDetail.avatar ? (
                            <Box
                                sx={{
                                    '& img': {
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        height: '100px',
                                        width: '100px',
                                        objectFit: 'cover',
                                        borderRadius: '6px'
                                    }
                                }}>
                                <img src={khachHangStore.khachHangDetail.avatar} alt="avatar" />
                            </Box>
                        ) : (
                            <Avatar
                                sx={{
                                    width: 100,
                                    height: 100,
                                    backgroundColor: 'var(--color-bg)',
                                    color: 'var(--color-main)',
                                    fontSize: '18px'
                                }}>
                                {utils.getFirstLetter(khachHangStore.khachHangDetail.tenKhachHang, 3)}
                            </Avatar>
                        )}
                    </Box>
                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                '& button': {
                                    padding: '4px'
                                }
                            }}>
                            <Typography variant="h3" color="#3B4758" fontWeight="700" fontSize="24px" mr="12px">
                                {khachHangStore.khachHangDetail.tenKhachHang}
                            </Typography>
                            <IconButton>
                                <EditIcon
                                    onClick={async () => {
                                        await khachHangStore.getForEdit(khachHangStore.khachHangDetail.id);
                                        setIsShowEditKhachHang(true);
                                    }}
                                />
                            </IconButton>
                            <IconButton>
                                <EditUserIcon />
                            </IconButton>
                            <IconButton>
                                <DeleteIcon
                                    onClick={() => {
                                        setIsShowDeleteKhachHang(true);
                                    }}
                                />
                            </IconButton>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                marginTop: '12px',
                                '& p': {
                                    color: '#333233',
                                    fontSize: 'var(--font-size-main)',
                                    mt: '4px'
                                },
                                flexDirection: 'column'
                            }}>
                            <Stack spacing={1} direction={'row'} alignItems={'center'}>
                                <Typography sx={{ mt: '0' }} variant="body1">
                                    Nhóm khách
                                </Typography>
                                <Typography sx={{ mt: '0' }} variant="body1">
                                    {khachHangStore.khachHangDetail.tenNhomKhach}
                                </Typography>
                            </Stack>
                            <Stack spacing={1} direction={'row'} alignItems={'center'}>
                                <Typography variant="body1">Số điện thoại </Typography>
                                <Typography variant="body1">{khachHangStore.khachHangDetail.soDienThoai}</Typography>
                            </Stack>
                            <Stack spacing={1} direction={'row'} alignItems={'center'}>
                                <Typography variant="body1">Địa chỉ </Typography>
                                <Typography variant="body1"> {khachHangStore.khachHangDetail.diaChi}</Typography>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    sx={{
                        mt: '20px',
                        '& button': {
                            textTransform: 'unset',
                            color: '#4C4B4C',
                            padding: '0',
                            pb: '12px',
                            minWidth: 'unset',
                            fontWeight: '400'
                        },
                        '& button.Mui-selected': {
                            color: '#7C3367'
                        },
                        '& .MuiTabs-indicator': {
                            bgcolor: '#7C3367'
                        },
                        '& .MuiTabs-flexContainer': {
                            gap: '32px'
                        }
                    }}>
                    <Tab label="Thông tin" />
                    <Tab label="Cuộc hẹn" />
                    <Tab label="Mua hàng" />
                </Tabs>
            </Box>
            <TabPanel value={selectedTab} index={0}>
                <TabInfor />
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
                <TabCuocHen />
            </TabPanel>
            <TabPanel value={selectedTab} index={2}>
                <TabMuaHang />
            </TabPanel>
            <Box
                sx={{
                    bgcolor: '#fff',
                    mt: 'auto',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    marginX: '-2.2222222222222223vw'
                }}>
                <Button
                    onClick={() => {
                        window.location.replace('/khach-hangs');
                    }}
                    sx={{ color: '#666466', ml: '32px' }}
                    className="btn-outline-hover"
                    variant="outlined"
                    startIcon={<ArrowLeft />}>
                    Quay trở lại
                </Button>
            </Box>
            <CreateOrEditCustomerDialog
                visible={isShowEditKhachHang}
                onCancel={() => {
                    setIsShowEditKhachHang(!isShowEditKhachHang);
                }}
                onOk={async () => {
                    setIsShowEditKhachHang(!isShowEditKhachHang);
                    await khachHangStore.getDetail(khachHangId ?? AppConsts.guidEmpty);
                }}
                title={'Cập nhật thông tin khách hàng'}
                formRef={khachHangStore.createEditKhachHangDto}
            />
            <ConfirmDelete
                isShow={isShowDeleteKhachHang}
                onOk={async () => {
                    const deleteReult = await khachHangService.delete(khachHangStore.khachHangDetail.id);
                    deleteReult != null
                        ? enqueueSnackbar('Xóa bản ghi thành công', {
                              variant: 'success',
                              autoHideDuration: 3000
                          })
                        : enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại sau!', {
                              variant: 'error',
                              autoHideDuration: 3000
                          });
                    setIsShowDeleteKhachHang(!isShowDeleteKhachHang);
                    window.location.href = '/khach-hangs';
                }}
                onCancel={() => {
                    setIsShowDeleteKhachHang(!isShowDeleteKhachHang);
                }}></ConfirmDelete>
        </Box>
    );
};
export default observer(CustomerInfo);
