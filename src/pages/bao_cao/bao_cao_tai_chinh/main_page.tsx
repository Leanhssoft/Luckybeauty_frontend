import { useContext, useEffect, useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { Grid, Box, Stack, Tab, TextField, Button, SelectChangeEvent } from '@mui/material';
import { Search } from '@mui/icons-material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

import abpCustom from '../../../components/abp-custom';
import TabPanel from '@mui/lab/TabPanel';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { AppContext } from '../../../services/chi_nhanh/ChiNhanhContext';
import AppConsts, { LoaiBaoCao } from '../../../lib/appconst';
import DateFilterCustom from '../../../components/DatetimePicker/DateFilterCustom';
import { format, lastDayOfMonth, startOfDay } from 'date-fns';
import fileDowloadService from '../../../services/file-dowload.service';
import { ParamSearchBaoCaoTaiChinh } from '../../../services/bao_cao/bao_cao_tai_chinh/BaoCaoTaiChinhDto';
import { BaoCaoTaiChinhDatataFilterContext } from '../../../services/bao_cao/bao_cao_ban_hang/dto/BaoCaoDataContext';
import BaoCaoTaiChinhChiTietSoQuy from './chi_tiet_so_quy';
import BaoCaoChiTietCongNo from './chi_tiet_cong_no';
import BaoCaoTaiChinhService from '../../../services/bao_cao/bao_cao_tai_chinh/BaoCaoTaiChinhService';
import ButtonOnlyIcon from '../../../components/Button/ButtonOnlyIcon';

export const BaoCaoTaiChinh_TabActive = {
    TONG_QUY: '1',
    CONGNO_KHACHHANG: '2'
};

export default function MainPageBaoCaoTaiChinh() {
    const appContext = useContext(AppContext);
    const chiNhanhCurrent = appContext.chinhanhCurrent;
    const idChiNhanh = chiNhanhCurrent.id;
    const [anchorDateEl, setAnchorDateEl] = useState<HTMLDivElement | null>(null);
    const openDateFilter = Boolean(anchorDateEl);

    const role_BaoCaoTaiChinh_ChiTietQuy = abpCustom.isGrandPermission('Pages.BaoCao.TaiChinh.ChiTietSoQuy');
    const role_BaoCaoTaiChinh_ChiTietCongNo = abpCustom.isGrandPermission('Pages.BaoCao.TaiChinh.ChiTietCongNo');

    const [tabActive, setTabActive] = useState(BaoCaoTaiChinh_TabActive.TONG_QUY);
    const [countClickSearch, setCountClickSearch] = useState(0);
    const [paramSearch, setParamSearch] = useState<ParamSearchBaoCaoTaiChinh>(
        new ParamSearchBaoCaoTaiChinh({
            textSearch: '',
            currentPage: 1,
            pageSize: AppConsts.pageOption[0].value,
            fromDate: format(startOfDay(new Date()), 'yyyy-MM-01') as unknown as undefined,
            toDate: format(lastDayOfMonth(new Date()), 'yyyy-MM-dd') as unknown as undefined,
            idChiNhanhs: [idChiNhanh]
        })
    );

    const onApplyFilterDate = async (from: string, to: string, txtShow: string) => {
        setAnchorDateEl(null);
        setParamSearch({ ...paramSearch, currentPage: 1, fromDate: from, toDate: to });
    };

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setTabActive(newValue);
        setCountClickSearch(0);
        setParamSearch({ ...paramSearch, currentPage: 1 });
    };

    const handlePageChange = async (currentPage: number) => {
        setParamSearch({
            ...paramSearch,
            currentPage: currentPage
        });
    };
    const changePageSize = async (pageSizeNew: number) => {
        setParamSearch({
            ...paramSearch,
            currentPage: 1,
            pageSize: pageSizeNew
        });
    };

    const handleKeyDownTextSearch = (event: any) => {
        if (event.keyCode === 13) {
            hanClickIconSearch();
        }
    };

    const hanClickIconSearch = () => {
        if (paramSearch?.currentPage !== 1) {
            setParamSearch({
                ...paramSearch,
                currentPage: 1
            });
        } else {
            setCountClickSearch(() => countClickSearch + 1);
        }
    };

    const exportExcel = async () => {
        const dataFilter = { ...paramSearch };
        dataFilter.currentPage = 1;
        dataFilter.pageSize = 1000000;
        if (tabActive === BaoCaoTaiChinh_TabActive.TONG_QUY) {
            const data = await BaoCaoTaiChinhService.ExportToExcel_BaoCaoTaichinh_ChiTietSoQuy(dataFilter);
            fileDowloadService.downloadExportFile(data);
        } else {
            const data = await BaoCaoTaiChinhService.ExportToExcel_BaoCaoChiTietCongNo(dataFilter);
            fileDowloadService.downloadExportFile(data);
        }
    };

    return (
        <>
            <BaoCaoTaiChinhDatataFilterContext.Provider
                value={{ loaiBaoCao: tabActive, countClick: countClickSearch, filter: paramSearch }}>
                <Grid container spacing={2} paddingTop={2}>
                    <Grid item xs={12} sm={12} md={6} lg={5}>
                        <TabContext value={tabActive}>
                            <Box>
                                <TabList onChange={handleChangeTab}>
                                    <Tab
                                        label="Chi tiết sổ quỹ"
                                        value={BaoCaoTaiChinh_TabActive.TONG_QUY}
                                        sx={{ display: role_BaoCaoTaiChinh_ChiTietQuy ? '' : 'none' }}
                                    />
                                    <Tab
                                        label="Công nợ khách hàng"
                                        value={BaoCaoTaiChinh_TabActive.CONGNO_KHACHHANG}
                                        sx={{ display: role_BaoCaoTaiChinh_ChiTietCongNo ? '' : 'none' }}
                                    />
                                </TabList>
                            </Box>
                        </TabContext>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={7}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                            <Stack flex={{ xs: 12, sm: 6, lg: 6, md: 5 }}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    sx={{
                                        backgroundColor: '#fff',
                                        '& .MuiInputBase-root': {
                                            height: '40px!important'
                                        }
                                    }}
                                    placeholder={'Tìm kiếm'}
                                    InputProps={{
                                        startAdornment: <Search />
                                    }}
                                    value={paramSearch.textSearch}
                                    onChange={(event) => {
                                        setParamSearch({ ...paramSearch, textSearch: event.target.value });
                                    }}
                                    onKeyDown={(event) => {
                                        handleKeyDownTextSearch(event);
                                    }}
                                />
                            </Stack>
                            <Stack flex={{ xs: 12, sm: 6, lg: 6, md: 7 }}>
                                <Stack direction={{ xs: 'column', sm: 'row', lg: 'row' }} spacing={1}>
                                    <Stack flex={{ xs: 6, sm: 6, lg: 6.5, md: 5 }}>
                                        <TextField
                                            label="Thời gian"
                                            size="small"
                                            fullWidth
                                            variant="outlined"
                                            style={{ background: 'white' }}
                                            sx={{
                                                '& .MuiInputBase-root': {
                                                    height: '40px!important'
                                                }
                                            }}
                                            onClick={(event) => setAnchorDateEl(event.currentTarget)}
                                            value={`${format(
                                                new Date(paramSearch.fromDate as string),
                                                'dd/MM/yyyy'
                                            )} - ${format(new Date(paramSearch.toDate as string), 'dd/MM/yyyy')}`}
                                        />
                                        <DateFilterCustom
                                            id="popover-date-filter"
                                            open={openDateFilter}
                                            anchorEl={anchorDateEl}
                                            onClose={() => setAnchorDateEl(null)}
                                            onApplyDate={onApplyFilterDate}
                                        />
                                    </Stack>
                                    <Stack flex={{ xs: 12, sm: 6, lg: 5.5, md: 7 }} direction={'row'} spacing={1}>
                                        <Button
                                            fullWidth
                                            className="btnNhapXuat"
                                            sx={{
                                                whiteSpace: 'nowrap',
                                                display:
                                                    tabActive == '1'
                                                        ? abpCustom.isGrandPermission(
                                                              'Pages.BaoCao.TaiChinh.ChiTietSoQuy'
                                                          )
                                                            ? ''
                                                            : 'none'
                                                        : abpCustom.isGrandPermission(
                                                              'Pages.BaoCao.TaiChinh.ChiTietCongNo'
                                                          )
                                                        ? ''
                                                        : 'none'
                                            }}
                                            variant="outlined"
                                            startIcon={<FileUploadOutlinedIcon />}
                                            onClick={exportExcel}>
                                            Xuất file
                                        </Button>
                                        <ButtonOnlyIcon
                                            icon={
                                                <FilterAltOutlinedIcon
                                                    sx={{ width: 20 }}
                                                    titleAccess="Lọc nâng cao"
                                                    //onClick={(event) => setAnchorElFilter(event.currentTarget)}
                                                />
                                            }
                                            style={{ width: 50, backgroundColor: 'white' }}
                                        />
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <TabContext value={tabActive}>
                            <TabPanel value={LoaiBaoCao.TONG_HOP} sx={{ padding: 0 }}>
                                <BaoCaoTaiChinhChiTietSoQuy
                                    onChangePage={handlePageChange}
                                    onChangePageSize={changePageSize}
                                />
                            </TabPanel>
                            <TabPanel value={LoaiBaoCao.CHI_TIET} sx={{ padding: 0 }}>
                                <BaoCaoChiTietCongNo
                                    onChangePage={handlePageChange}
                                    onChangePageSize={changePageSize}
                                />
                            </TabPanel>
                        </TabContext>
                    </Grid>
                </Grid>
            </BaoCaoTaiChinhDatataFilterContext.Provider>
        </>
    );
}
