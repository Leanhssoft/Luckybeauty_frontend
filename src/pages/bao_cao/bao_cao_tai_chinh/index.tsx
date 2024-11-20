import { Box } from '@mui/material';
import { observer } from 'mobx-react';
import { useState } from 'react';
import BaoCaoThuChiTienMat from './components/baoCaoThuChiTienMat';
import BaoCaoThuChiNganHang from './components/baoCaoThuChiNganHang';
import BaoCaoTongQuy from './components/baoCaoTongQuy';
import BaoCaoThuChiChiNhanh from './components/baoCaoThuChiChiNhanh';

const TIEN_MAT = 1;
const NGAN_HANG = 2;
const TONG_QUY = 3;
const CHI_NHANH = 4;
const BaoCaoTaiChinhPage = () => {
    const [tabIndex, setTabIndex] = useState<number>(TIEN_MAT);
    const handleChangeTab = (tabIndex: number) => {
        setTabIndex(tabIndex);
    };
    return (
        <Box>
            {tabIndex === TIEN_MAT && <BaoCaoThuChiTienMat handleChangeTab={handleChangeTab} />}
            {tabIndex === NGAN_HANG && <BaoCaoThuChiNganHang handleChangeTab={handleChangeTab} />}
            {tabIndex === TONG_QUY && <BaoCaoTongQuy handleChangeTab={handleChangeTab} />}
            {tabIndex === CHI_NHANH && <BaoCaoThuChiChiNhanh handleChangeTab={handleChangeTab} />}
        </Box>
    );
};
export default observer(BaoCaoTaiChinhPage);
