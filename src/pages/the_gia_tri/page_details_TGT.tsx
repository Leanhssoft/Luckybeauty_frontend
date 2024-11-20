import { Button, Grid, Stack, Tab, Tabs } from '@mui/material';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import TabPanel from '../../components/TabPanel/TabPanel';
import { FC, useState } from 'react';
import PageHoaDonDto from '../../services/ban_hang/PageHoaDonDto';
import TabThongTinHoaDon from '../goi_dich_vu/tab_thong_tin_hoa_don';
import TabNhatKyThanhToan from '../goi_dich_vu/tab_nhat_ky_thanh_toan';

enum DetailGDV_tabList {
    NHAT_KY_THANH_TOAN = 1
}

const PageDetailsTGT: FC<{ itemHD: PageHoaDonDto | null; gotoBack: () => void }> = ({ itemHD, gotoBack }) => {
    const [tabActive, setTabActive] = useState(DetailGDV_tabList.NHAT_KY_THANH_TOAN);
    const [sumCTHD_ThanhtienSauVAT, setSumCTHD_ThanhtienSauVAT] = useState(0);

    return (
        <Grid container paddingTop={2}>
            <Grid item lg={12} xs={12}>
                <Grid container spacing={2}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <TabThongTinHoaDon itemHD={itemHD} tongThanhToanNew={sumCTHD_ThanhtienSauVAT} />
                    </Grid>
                    <Grid item lg={8} md={6} sm={6} xs={12}>
                        <Stack
                            className="page-full"
                            border={'1px solid #ccc'}
                            borderRadius={'4px'}
                            zIndex={5}
                            overflow={'auto'}>
                            <Stack
                                direction={{ lg: 'row', md: 'column', sm: 'column', xs: 'column' }}
                                justifyContent={'space-between'}
                                spacing={1}>
                                <Tabs value={tabActive} onChange={(e, value) => setTabActive(value)}>
                                    <Tab label="Nhật ký thanh toán" value={DetailGDV_tabList.NHAT_KY_THANH_TOAN}></Tab>
                                </Tabs>
                                <Stack padding={1}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<KeyboardDoubleArrowLeftIcon />}
                                        onClick={gotoBack}>
                                        Quay trở lại
                                    </Button>
                                </Stack>
                            </Stack>

                            <TabPanel
                                value={DetailGDV_tabList.NHAT_KY_THANH_TOAN}
                                index={tabActive}
                                style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                                <TabNhatKyThanhToan idHoaDon={itemHD?.id ?? ''} />
                            </TabPanel>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};
export default PageDetailsTGT;
