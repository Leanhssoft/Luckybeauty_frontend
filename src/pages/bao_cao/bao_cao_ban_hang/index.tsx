import { Box, Grid, Tab, Stack, TextField, Button } from '@mui/material';
import BaoCaoBanHangChiTietPage from './bao_cao_ban_hang_chi_tiet/index';
import BaoCaoBanHangTongHopPage from './bao_cao_ban_hang_tong_hop/index';
import { Search } from '@mui/icons-material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';

import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../services/chi_nhanh/ChiNhanhContext';
import abpCustom from '../../../components/abp-custom';
import { ParamSearchBaoCaoBanHang } from '../../../services/bao_cao/bao_cao_ban_hang/dto/ParamSearchBaoCaoBanHang';
import AppConsts, { LoaiBaoCao } from '../../../lib/appconst';
import { format, startOfDay, lastDayOfMonth, toDate } from 'date-fns';
import fileDowloadService from '../../../services/file-dowload.service';
import baoCaoService from '../../../services/bao_cao/bao_cao_ban_hang/baoCaoService';
import { BaoCaoBanHangDatataFilterContext } from '../../../services/bao_cao/bao_cao_ban_hang/dto/BaoCaoDataContext';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import DateFilterCustom from '../../../components/DatetimePicker/DateFilterCustom';
import TabPanel from '@mui/lab/TabPanel';
import PopoverFilterBCBanHang from '../components/PopoverFilterBCBanHang';
import Cookies from 'js-cookie';
import ButtonOnlyIcon from '../../../components/Button/ButtonOnlyIcon';

export default function MainPageBaoCaoBanHang() {
    const appContext = useContext(AppContext);
    const chiNhanhCurrent = appContext.chinhanhCurrent;
    const idChiNhanhCookies = Cookies.get('IdChiNhanh') ?? '';
    const [anchorDateEl, setAnchorDateEl] = useState<HTMLDivElement | null>(null);
    const openDateFilter = Boolean(anchorDateEl);

    const role_BaoCaoBanHang_TongHop = abpCustom.isGrandPermission('Pages.BaoCao.BanHang.TongHop');
    const role_BaoCaoBanHang_ChiTiet = abpCustom.isGrandPermission('Pages.BaoCao.BanHang.ChiTiet');

    const [tabActive, setTabActive] = useState(LoaiBaoCao.TONG_HOP);
    const [countClickSearch, setCountClickSearch] = useState(0);
    const [paramSearch, setParamSearch] = useState<ParamSearchBaoCaoBanHang>(
        new ParamSearchBaoCaoBanHang({
            textSearch: '',
            currentPage: 1,
            columnSort: 'tenNhomHang',
            typeSort: 'asc',
            pageSize: AppConsts.pageOption[0].value,
            fromDate: format(startOfDay(new Date()), 'yyyy-MM-01') as unknown as undefined,
            toDate: format(lastDayOfMonth(new Date()), 'yyyy-MM-dd') as unknown as undefined,
            idChiNhanhs: [idChiNhanhCookies]
        })
    );

    useEffect(() => {
        setParamSearch({ ...paramSearch, currentPage: 1, idChiNhanhs: [chiNhanhCurrent?.id ?? idChiNhanhCookies] });
    }, [chiNhanhCurrent?.id]);

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

    const [anchorElFilter, setAnchorElFilter] = useState<SVGSVGElement | null>(null);
    const ApplyFilter = (paramFilter: ParamSearchBaoCaoBanHang) => {
        setAnchorElFilter(null);
        setParamSearch({
            ...paramSearch,
            currentPage: 1,
            idNhomHangHoa: paramFilter?.idNhomHangHoa,
            idChiNhanhs: paramFilter?.idChiNhanhs
        });
    };

    const exportExcel = async () => {
        const dataFilter = { ...paramSearch };
        dataFilter.currentPage = 1;
        dataFilter.pageSize = 1000000;
        dataFilter.reportValueCell = [
            {
                rowIndex: 2,
                columnIndex: 1,
                cellValue: `Thời gian: ${format(new Date(paramSearch?.fromDate ?? ''), 'dd/MM/yyy')} - ${format(
                    new Date(paramSearch?.toDate ?? ''),
                    'dd/MM/yyy'
                )}`
            }
        ];
        if (tabActive === LoaiBaoCao.TONG_HOP) {
            const data = await baoCaoService.exportBaoCaoBanHangTongHop(dataFilter);
            fileDowloadService.downloadExportFile(data);
        } else {
            const data = await baoCaoService.exportBaoCaoBanHangChiTiet(dataFilter);
            fileDowloadService.downloadExportFile(data);
        }
    };

    return (
        <>
            <BaoCaoBanHangDatataFilterContext.Provider
                value={{ loaiBaoCao: tabActive, countClick: countClickSearch, filter: paramSearch }}>
                <Grid container spacing={2} paddingTop={2}>
                    <Grid item xs={12} sm={12} md={6} lg={5}>
                        <TabContext value={tabActive}>
                            <Box>
                                <TabList onChange={handleChangeTab}>
                                    <Tab
                                        label="Bán hàng tổng hợp"
                                        value={LoaiBaoCao.TONG_HOP}
                                        sx={{ display: role_BaoCaoBanHang_TongHop ? '' : 'none' }}
                                    />
                                    <Tab
                                        label="Bán hàng chi tiết"
                                        value={LoaiBaoCao.CHI_TIET}
                                        sx={{ display: role_BaoCaoBanHang_ChiTiet ? '' : 'none' }}
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
                                                        ? role_BaoCaoBanHang_TongHop
                                                            ? ''
                                                            : 'none'
                                                        : role_BaoCaoBanHang_ChiTiet
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
                                                    titleAccess="Lọc nâng cao"
                                                    sx={{ width: 20 }}
                                                    onClick={(event) => setAnchorElFilter(event.currentTarget)}
                                                />
                                            }
                                            style={{ width: 50, backgroundColor: 'white' }}
                                        />
                                        <PopoverFilterBCBanHang
                                            anchorEl={anchorElFilter}
                                            paramFilter={paramSearch}
                                            handleClose={() => setAnchorElFilter(null)}
                                            handleApply={ApplyFilter}
                                        />
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <TabContext value={tabActive}>
                            <TabPanel value={LoaiBaoCao.TONG_HOP} sx={{ padding: 0 }}>
                                <BaoCaoBanHangTongHopPage
                                    onChangePage={handlePageChange}
                                    onChangePageSize={changePageSize}
                                />
                            </TabPanel>
                            <TabPanel value={LoaiBaoCao.CHI_TIET} sx={{ padding: 0 }}>
                                <BaoCaoBanHangChiTietPage
                                    onChangePage={handlePageChange}
                                    onChangePageSize={changePageSize}
                                />
                            </TabPanel>
                        </TabContext>
                    </Grid>
                </Grid>
            </BaoCaoBanHangDatataFilterContext.Provider>
        </>
    );
}
