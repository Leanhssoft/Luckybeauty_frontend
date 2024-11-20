import { Button, Grid, Stack, Tab, Tabs } from '@mui/material';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import TabPanel from '../../components/TabPanel/TabPanel';
import { FC, useState } from 'react';
import PageHoaDonDto from '../../services/ban_hang/PageHoaDonDto';
import TabChiTietHoaDon from './tab_chi_tiet_hoa_don';
import TabThongTinHoaDon from './tab_thong_tin_hoa_don';
import TabNhatKyThanhToan from './tab_nhat_ky_thanh_toan';
import TabNhatKySuDungGDV from './tab_nhat_ky_su_dung_gdv';

enum DetailGDV_tabList {
    CHI_TIET_HOA_DON = 1,
    NHAT_KY_THANH_TOAN = 2,
    NHAT_KY_SU_DUNG = 3
}

const PageDetailGDV: FC<{ itemHD: PageHoaDonDto | null; gotoBack: () => void }> = ({ itemHD, gotoBack }) => {
    const [tabActive, setTabActive] = useState(DetailGDV_tabList.CHI_TIET_HOA_DON);
    const [sumCTHD_ThanhtienSauVAT, setSumCTHD_ThanhtienSauVAT] = useState(0);

    const onUpdateHD_ifChangeCTHD = (sumThanhTienSauVAT: number) => {
        setSumCTHD_ThanhtienSauVAT(sumThanhTienSauVAT);
    };
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
                                    <Tab label="Chi tiết hóa đơn" value={DetailGDV_tabList.CHI_TIET_HOA_DON}></Tab>
                                    <Tab label="Nhật ký thanh toán" value={DetailGDV_tabList.NHAT_KY_THANH_TOAN}></Tab>
                                    <Tab label="Nhật ký sử dụng" value={DetailGDV_tabList.NHAT_KY_SU_DUNG}></Tab>
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
                                value={DetailGDV_tabList.CHI_TIET_HOA_DON}
                                index={tabActive}
                                style={{ paddingLeft: '8px', paddingRight: '8px', marginTop: '8px' }}>
                                <TabChiTietHoaDon
                                    idHoaDon={itemHD?.id ?? ''}
                                    maHoaDon={itemHD?.maHoaDon}
                                    onChangeCTHD={onUpdateHD_ifChangeCTHD}
                                />
                            </TabPanel>

                            <TabPanel
                                value={DetailGDV_tabList.NHAT_KY_THANH_TOAN}
                                index={tabActive}
                                style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                                <TabNhatKyThanhToan idHoaDon={itemHD?.id ?? ''} />
                            </TabPanel>
                            <TabPanel
                                value={DetailGDV_tabList.NHAT_KY_SU_DUNG}
                                index={tabActive}
                                style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                                <TabNhatKySuDungGDV
                                    idHoaDon={itemHD?.id ?? ''}
                                    idCustomer={itemHD?.idKhachHang ?? ''}
                                />
                            </TabPanel>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};
export default PageDetailGDV;
