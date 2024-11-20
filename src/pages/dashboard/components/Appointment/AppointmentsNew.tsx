import React from 'react';
import clockIcon from '../../../../images/clock.svg';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import './appointmentsNew.css';
import dashboardStore from '../../../../stores/dashboardStore';
import { observer } from 'mobx-react';
import { format } from 'date-fns';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import utils from '../../../../utils/utils';
const AppoimentsNew: React.FC = () => {
    const datas = dashboardStore.danhSachLichHen ?? [];

    return (
        <Box>
            {datas.length > 0 ? (
                datas.map((data, key) => {
                    return (
                        <Box
                            key={key}
                            display={'flex'}
                            padding={1}
                            justifyContent={'space-between'}
                            borderBottom={'1px solid #EEF0F4'}>
                            <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                <Stack>
                                    {data?.avatar ? (
                                        <Avatar src={data?.avatar} sx={{ width: 24, height: 24 }} />
                                    ) : (
                                        <Avatar
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                fontSize: '14px',
                                                color: 'white',
                                                backgroundColor: '#c3c3d5'
                                            }}>
                                            {utils.getFirstLetter(data?.tenKhachHang, 2)}
                                        </Avatar>
                                    )}
                                </Stack>
                                <Stack spacing={1}>
                                    <Typography component={'span'} sx={{ fontWeight: 600, fontSize: '18px' }}>
                                        {data?.tenKhachHang}
                                        {data?.soDienThoai && (
                                            <Stack
                                                spacing={1}
                                                direction={'row'}
                                                color={'#6c6c81'}
                                                alignItems={'center'}>
                                                <LocalPhoneOutlinedIcon sx={{ width: '18px' }} />
                                                <Typography component={'span'} fontSize={'14px'}>
                                                    {' '}
                                                    ({data?.soDienThoai})
                                                </Typography>
                                            </Stack>
                                        )}
                                    </Typography>
                                    <Typography variant="body1" fontSize={'16px'}>
                                        {data?.tenHangHoa}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Stack justifyContent={'end'} alignItems={'end'}>
                                <Stack spacing={1} direction={'row'} color={'#6c6c81'}>
                                    <AccessTimeIcon sx={{ width: 20 }} />
                                    <Typography
                                        sx={{
                                            marginLeft: '4px'
                                        }}>
                                        {data.startTime != undefined ? format(new Date(data.startTime), 'HH:mm') : ''}
                                    </Typography>
                                </Stack>
                                <Typography
                                    sx={{
                                        color: '#009EF7',
                                        fontSize: '12px'
                                    }}>
                                    {data.trangThai}
                                </Typography>
                            </Stack>
                        </Box>
                    );
                })
            ) : (
                <>Không có dữ liệu</>
            )}
            {}
        </Box>
    );
};

export default observer(AppoimentsNew);
