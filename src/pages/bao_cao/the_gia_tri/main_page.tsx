import { Grid, Stack, Tab, TextField, Button, Tabs } from '@mui/material';
import { Search } from '@mui/icons-material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

import abpCustom from '../../../components/abp-custom';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { AppContext } from '../../../services/chi_nhanh/ChiNhanhContext';
import AppConsts, { LoaiBaoCao, LoaiChungTu } from '../../../lib/appconst';
import DateFilterCustom from '../../../components/DatetimePicker/DateFilterCustom';
import { addDays, format, lastDayOfMonth, startOfMonth } from 'date-fns';
import fileDowloadService from '../../../services/file-dowload.service';
import { useContext, useState } from 'react';
import TabPanel from '../../../components/TabPanel/TabPanel';
import ButtonOnlyIcon from '../../../components/Button/ButtonOnlyIcon';
import PageBCNhatKySuDungTGTTGT from './nhat_ky_su_dung';
import BaoCaoTGTService from '../../../services/bao_cao/bao_cao_the_gia_tri/BaoCaoTGTService';
import { BaoCaoTGT_DataContextFilter } from '../../../services/bao_cao/bao_cao_the_gia_tri/BaoCaoTGT_DataContextFilter';
import { ParamSearchBaoCaoTGT } from '../../../services/bao_cao/bao_cao_the_gia_tri/ParamSearchBaoCaoTGT';
import PopoverFilterBaoCaoTGT from './PopoverFilter';

export default function MainpageBaoCaoTheGiaTri() {
    const appContext = useContext(AppContext);
    const chiNhanhCurrent = appContext.chinhanhCurrent;
    const idChiNhanh = chiNhanhCurrent.id;
    const [anchorDateEl, setAnchorDateEl] = useState<HTMLDivElement | null>(null);
    const openDateFilter = Boolean(anchorDateEl);

    const [anchorElFilter, setAnchorElFilter] = useState<SVGSVGElement | null>(null);

    const [tabActive, setTabActive] = useState(parseInt(LoaiBaoCao.CHI_TIET));
    const [countClickSearch, setCountClickSearch] = useState(0);
    const [paramSearch, setParamSearch] = useState<ParamSearchBaoCaoTGT>(
        new ParamSearchBaoCaoTGT({
            textSearch: '',
            currentPage: 1,
            pageSize: AppConsts.pageOption[0].value,
            fromDate: format(startOfMonth(new Date()), 'yyyy-MM-01') as unknown as undefined,
            toDate: format(lastDayOfMonth(new Date()), 'yyyy-MM-dd') as unknown as undefined,
            idChiNhanhs: [idChiNhanh],
            idLoaiChungTus: [
                LoaiChungTu.HOA_DON_BAN_LE,
                LoaiChungTu.GOI_DICH_VU,
                LoaiChungTu.THE_GIA_TRI,
                LoaiChungTu.PHIEU_DIEU_CHINH_TGT
            ]
        })
    );

    const role_BaoCaoTGT_NhatKySuDung = abpCustom.isGrandPermission('Pages.BaoCao.TheGiaTri.NhatKySuDung');
    const role_BaoCaoTGT_SoDu = abpCustom.isGrandPermission('Pages.BaoCao.TheGiaTri.SoDu');
    const roleExport = tabActive == parseInt(LoaiBaoCao.CHI_TIET) ? role_BaoCaoTGT_NhatKySuDung : role_BaoCaoTGT_SoDu;

    const onApplyFilterDate = async (from: string, to: string, txtShow: string) => {
        setAnchorDateEl(null);
        setParamSearch({
            ...paramSearch,
            currentPage: 1,
            fromDate: from,
            toDate: to
        });
    };

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
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

    const handleKeyDownTextSearch = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
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
        if (tabActive === parseInt(LoaiBaoCao.CHI_TIET)) {
            const data = await BaoCaoTGTService.ExportToExcel_BaoCaoSuDungTGTChiTiet(dataFilter);
            fileDowloadService.downloadExportFile(data);
        } else {
            // const data = await BaoCaoGDVServices.ExportToExcel_BaoCaoGoiDVChiTiet(dataFilter);
            // fileDowloadService.downloadExportFile(data);
        }
    };

    const ApplyFilter = (paramFilter: ParamSearchBaoCaoTGT) => {
        setAnchorElFilter(null);
        setParamSearch({
            ...paramSearch,
            currentPage: 1,
            idLoaiChungTus: paramFilter?.idLoaiChungTus ?? [],
            idChiNhanhs: paramFilter?.idChiNhanhs
        });
    };

    return (
        <>
            <BaoCaoTGT_DataContextFilter.Provider
                value={{ loaiBaoCao: tabActive, countClick: countClickSearch, filter: paramSearch }}>
                <Grid container paddingTop={2}>
                    <Grid item xs={12} sm={12} md={6} lg={5}>
                        <Tabs value={tabActive} onChange={handleChangeTab}>
                            <Tab
                                label="Nhật ký sử dụng thẻ giá trị"
                                value={parseInt(LoaiBaoCao.CHI_TIET)}
                                sx={{
                                    display: role_BaoCaoTGT_NhatKySuDung ? '' : 'none'
                                }}
                            />
                        </Tabs>
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
                                                display: roleExport ? '' : 'none'
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
                                        <PopoverFilterBaoCaoTGT
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
                        <TabPanel value={parseInt(LoaiBaoCao.TONG_HOP)} index={tabActive}></TabPanel>

                        <TabPanel value={parseInt(LoaiBaoCao.CHI_TIET)} index={tabActive}>
                            <PageBCNhatKySuDungTGTTGT
                                onChangePage={handlePageChange}
                                onChangePageSize={changePageSize}
                            />
                        </TabPanel>
                    </Grid>
                </Grid>
            </BaoCaoTGT_DataContextFilter.Provider>
        </>
    );
}
