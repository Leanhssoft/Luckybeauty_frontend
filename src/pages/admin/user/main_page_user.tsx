import { Grid, Box, Stack, Button, Tab, TextField } from '@mui/material';
import { Add, Search } from '@mui/icons-material';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useEffect, useState } from 'react';
import abpCustom from '../../../components/abp-custom';
import PageUser from './page_user';
import PageNhatKyChuyenTien from './page_nhat_ky_chuyen_tien';

export default function MainPageUser({ xx }: any) {
    const [tabActive, setTabActive] = useState('1');
    const [isShowModalAdd, setIsShowModalAdd] = useState('0');
    const [txtSearch, setTxtSearch] = useState('');
    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setTabActive(newValue);
        setTxtSearch('');
    };
    useEffect(() => {
        setIsShowModalAdd('0');
    }, []);

    return (
        <>
            <Grid container spacing={2} paddingTop={2}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <TabContext value={tabActive}>
                        <Box>
                            <TabList onChange={handleChangeTab}>
                                <Tab label="Danh sách người dùng" value="1" />
                                <Tab label="Nhật ký chuyển tiền SMS" value="2" />
                            </TabList>
                        </Box>
                    </TabContext>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                        <Stack flex={{ xs: 12, sm: 6, lg: 9, md: 7 }}>
                            <TextField
                                size="small"
                                fullWidth
                                sx={{
                                    backgroundColor: '#fff'
                                }}
                                placeholder={'Tìm kiếm'}
                                InputProps={{
                                    startAdornment: <Search />
                                }}
                                value={txtSearch}
                                onChange={(event) => {
                                    setTxtSearch(event.target.value);
                                }}
                            />
                        </Stack>
                        <Stack flex={{ xs: 12, sm: 6, lg: 3, md: 5 }}>
                            <Button
                                fullWidth
                                sx={{
                                    display:
                                        tabActive == '1'
                                            ? abpCustom.isGrandPermission('Pages.Administration.Users.Create')
                                                ? ''
                                                : 'none'
                                            : abpCustom.isGrandPermission('Pages.Brandname.ChuyenTien.Create')
                                            ? ''
                                            : 'none'
                                }}
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() => {
                                    setIsShowModalAdd(tabActive);
                                }}>
                                Thêm mới
                            </Button>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <TabContext value={tabActive}>
                        <TabPanel value="1" sx={{ padding: 0 }}>
                            <PageUser
                                isShowModalAdd={isShowModalAdd === '1'}
                                txtSearch={tabActive === '1' ? txtSearch : ''}
                                onCloseModal={() => setIsShowModalAdd('0')}
                            />
                        </TabPanel>
                        <TabPanel value="2" sx={{ padding: 0 }}>
                            <PageNhatKyChuyenTien
                                isShowModalAdd={isShowModalAdd === '2'}
                                txtSearch={tabActive === '2' ? txtSearch : ''}
                                onCloseModal={() => setIsShowModalAdd('0')}
                            />
                        </TabPanel>
                    </TabContext>
                </Grid>
            </Grid>
        </>
    );
}
