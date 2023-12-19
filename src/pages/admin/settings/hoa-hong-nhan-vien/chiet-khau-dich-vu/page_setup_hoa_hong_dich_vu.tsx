import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Grid, Box, Stack, Typography, TextField, Button, Pagination, IconButton, Avatar, Link } from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { PropConfirmOKCancel } from '../../../../../utils/PropParentToChild';
import utils from '../../../../../utils/utils';
import fileDowloadService from '../../../../../services/file-dowload.service';
import ConfirmDelete from '../../../../../components/AlertDialog/ConfirmDelete';
import SnackbarAlert from '../../../../../components/AlertDialog/SnackbarAlert';
import { TextTranslate } from '../../../../../components/TableLanguage';
import { OptionPage } from '../../../../../components/Pagination/OptionPage';
import { LabelDisplayedRows } from '../../../../../components/Pagination/LabelDisplayedRows';
import { PagedResultDto } from '../../../../../services/dto/pagedResultDto';
import { ChietKhauDichVuItemDto_TachRiengCot } from '../../../../../services/hoa_hong/chiet_khau_dich_vu/Dto/ChietKhauDichVuItemDto';
import nhanVienService from '../../../../../services/nhan-vien/nhanVienService';
import { PagedNhanSuRequestDto } from '../../../../../services/nhan-vien/dto/PagedNhanSuRequestDto';
import NhanSuItemDto from '../../../../../services/nhan-vien/dto/nhanSuItemDto';
import { PagedRequestDto } from '../../../../../services/dto/pagedRequestDto';
import chietKhauDichVuService from '../../../../../services/hoa_hong/chiet_khau_dich_vu/chietKhauDichVuService';
import Cookies from 'js-cookie';
import { Guid } from 'guid-typescript';
import { NumericFormat } from 'react-number-format';
import ModalSetupHoaHongDichVu from './modal_setup_hoa_hong_dich_vu';
import { debounce } from '@mui/material/utils';
import { CreateOrEditChietKhauDichVuDto } from '../../../../../services/hoa_hong/chiet_khau_dich_vu/Dto/CreateOrEditChietKhauDichVuDto';
import { LoaiHoaHongDichVu } from '../../../../../lib/appconst';

export const PopperApplyNhom = () => {
    return <></>;
};

export default function PageSetupHoaHongDichVu() {
    const [inforDeleteProduct, setInforDeleteProduct] = useState<PropConfirmOKCancel>(
        new PropConfirmOKCancel({ show: false })
    );
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [isShowModalSetup, setIsShowModalSetup] = useState(false);
    const [txtSearchNV, setTxtSearchNV] = useState('');
    const [idNhanVienChosed, setIdNhanVienChosed] = useState<string>(Guid.EMPTY);
    const [lstNhanVien, setLstNhanVien] = useState<NhanSuItemDto[]>([]);
    const [allNhanVien, setAllNhanVien] = useState<NhanSuItemDto[]>([]);
    const [rowChosed, setRowChosed] = useState<ChietKhauDichVuItemDto_TachRiengCot | null>(null);
    const idChiNhanh = Cookies.get('IdChiNhanh') ?? Guid.EMPTY;

    const [pageResultChietKhauDV, setPageResultChietKhauDV] = useState<
        PagedResultDto<ChietKhauDichVuItemDto_TachRiengCot>
    >({
        items: [],
        totalCount: 0,
        totalPage: 1
    } as PagedResultDto<ChietKhauDichVuItemDto_TachRiengCot>);

    const [paramSearch, setParamSearch] = useState<PagedRequestDto>({
        skipCount: 1,
        maxResultCount: 10,
        keyword: '',
        sortBy: 'tenNhanVien'
    } as PagedRequestDto);

    const GetAllNhanVien = async () => {
        const data = await nhanVienService.getAll({
            filter: '',
            skipCount: 1,
            maxResultCount: 100
        } as PagedNhanSuRequestDto);
        setAllNhanVien([...data.items]);
        setLstNhanVien([...data.items]);
    };

    const getListSetupHoaHongDV = async () => {
        const data = await chietKhauDichVuService.GetAllSetup_HoaHongDichVu(paramSearch, idNhanVienChosed, idChiNhanh);
        console.log(' pageResultChietKhauDV', data.items, 'allNhanVien ', allNhanVien);

        setPageResultChietKhauDV({
            items: data.items,
            totalCount: data.totalCount,
            totalPage: Math.ceil(data.totalCount / paramSearch.maxResultCount)
        });
    };

    const PageLoad = async () => {
        await GetAllNhanVien();
        await getListSetupHoaHongDV();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    function showModalAddNhanVien(id = '') {
        //
    }

    function showModalSetup(action?: number, id = '') {
        setIsShowModalSetup(true);
    }

    const searchNhanVien = () => {
        if (!utils.checkNull(txtSearchNV)) {
            const txt = txtSearchNV.trim().toLowerCase();
            const txtUnsign = utils.strToEnglish(txt);
            const data = allNhanVien.filter(
                (x: NhanSuItemDto) =>
                    (x.maNhanVien !== null && x.maNhanVien.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.tenNhanVien !== null && x.tenNhanVien.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.soDienThoai !== null && x.soDienThoai.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.maNhanVien !== null && utils.strToEnglish(x.maNhanVien).indexOf(txtUnsign) > -1) ||
                    (x.tenNhanVien !== null && utils.strToEnglish(x.tenNhanVien).indexOf(txtUnsign) > -1) ||
                    (x.soDienThoai !== null && utils.strToEnglish(x.soDienThoai).indexOf(txtUnsign) > -1) ||
                    (x.tenChucVu !== null && utils.strToEnglish(x.tenChucVu).indexOf(txtUnsign) > -1)
            );
            setLstNhanVien(data);
        } else {
            setLstNhanVien([...allNhanVien]);
        }
    };

    useEffect(() => {
        searchNhanVien();
    }, [txtSearchNV]);

    useEffect(() => {
        getListSetupHoaHongDV();
    }, [paramSearch.skipCount, paramSearch.maxResultCount, idNhanVienChosed]);

    const handleChangePage = (event: any, value: number) => {
        setParamSearch({
            ...paramSearch,
            skipCount: value
        });
    };
    const changeNumberOfpage = (sizePage: number) => {
        setParamSearch({
            ...paramSearch,
            maxResultCount: sizePage
        });
    };

    const handleKeyDownTextSearch = (event: any) => {
        if (event.keyCode === 13) {
            hanClickIconSearch();
        }
    };

    const hanClickIconSearch = () => {
        if (paramSearch.skipCount !== 1) {
            setParamSearch({
                ...paramSearch,
                skipCount: 1
            });
        } else {
            getListSetupHoaHongDV();
        }
    };

    const deleteRow = async () => {
        let arrIdNhanVienDelete: string[] = [],
            arrIdQuyDoiDelete: string[] = [];
        let totalRowDelete = 1;
        if (rowChosed === null) {
            // delete all: get all idNhanVien, idQuyDoi of list
            arrIdNhanVienDelete = pageResultChietKhauDV.items.map((x) => {
                return x.idNhanVien;
            });
            arrIdQuyDoiDelete = pageResultChietKhauDV.items.map((x) => {
                return x.idDonViQuiDoi;
            });
            totalRowDelete = pageResultChietKhauDV.totalCount;
        } else {
            arrIdNhanVienDelete = [rowChosed?.idNhanVien as string];
            arrIdQuyDoiDelete = [rowChosed?.idDonViQuiDoi as string];
        }
        const deleteOK = await chietKhauDichVuService.DeleteSetup_DichVu_ofNhanVien(
            arrIdNhanVienDelete,
            arrIdQuyDoiDelete
        );
        if (deleteOK) {
            setObjAlert({ ...objAlert, show: true, mes: 'Xóa thành công', type: 1 });
        }
        setPageResultChietKhauDV({
            items: pageResultChietKhauDV.items.filter(
                (x) =>
                    !(
                        arrIdNhanVienDelete.includes(x.idNhanVien) &&
                        arrIdQuyDoiDelete.includes(x.idDonViQuiDoi as string)
                    )
            ),
            totalCount: pageResultChietKhauDV.totalCount - totalRowDelete,
            totalPage: Math.ceil((pageResultChietKhauDV.totalCount - totalRowDelete) / paramSearch.maxResultCount)
        });

        setInforDeleteProduct({
            ...inforDeleteProduct,
            show: false
        });
        // reset rowChosed
        setRowChosed(null);
    };

    const onClickDeleteRow = async (rowItem: ChietKhauDichVuItemDto_TachRiengCot) => {
        setRowChosed(rowItem);
        setInforDeleteProduct({
            ...inforDeleteProduct,
            show: true,
            title: 'Thông báo xóa',
            mes: `Bạn có chắc chắn muốn xóa cài đặt dịch vụ ${rowItem.tenDichVu} của nhân viên ${rowItem.tenNhanVien} không?`
        });
    };

    const onClickDeleteAll = async () => {
        setInforDeleteProduct({
            ...inforDeleteProduct,
            show: true,
            title: 'Thông báo xóa',
            mes: `Bạn có chắc chắn muốn xóa tất cả cài đặt này không?`
        });
    };

    const exportToExcel = async () => {
        const param = { ...paramSearch };
        param.skipCount = 1;
        param.maxResultCount = pageResultChietKhauDV.totalCount;
        const result = await chietKhauDichVuService.ExportToExcel_CaiDat_HoaHongDV(
            paramSearch,
            idNhanVienChosed,
            idChiNhanh
        );
        fileDowloadService.downloadExportFile(result);
    };

    const refInputThucHien: any = useRef([]);
    const refInputTuVan: any = useRef([]);
    const gotoNextInputThucHien = (e: React.KeyboardEvent<HTMLDivElement>, targetElem: any) => {
        if (e.key === 'Enter' && targetElem) {
            targetElem.focus();
        }
    };
    const gotoNextInputTuVan = (e: React.KeyboardEvent<HTMLDivElement>, targetElem: any) => {
        if (e.key === 'Enter' && targetElem) {
            targetElem.focus();
        }
    };

    const updateHoaHongDV = useRef(
        debounce(async (input: CreateOrEditChietKhauDichVuDto) => {
            const data = await chietKhauDichVuService.UpdateSetup_HoaHongDichVu_ofNhanVien(input);
            if (data) {
                setObjAlert({ ...objAlert, show: true, mes: 'Cập nhật thành công', type: 1 });
            }
        }, 500)
    ).current;

    const changeGtriChietKhau = async (
        gtriNew: string,
        itemCK: ChietKhauDichVuItemDto_TachRiengCot,
        loaiChietKhau: number
    ) => {
        const gtriCK = utils.formatNumberToFloat(gtriNew);
        // get laPhanTram old: used to update
        let laPhanTram = false;
        switch (loaiChietKhau) {
            case LoaiHoaHongDichVu.THUC_HIEN:
                {
                    laPhanTram = itemCK.laPhanTram_HoaHongThucHien;
                }
                break;
            case LoaiHoaHongDichVu.YEU_CAU_THUC_HIEN:
                {
                    laPhanTram = itemCK.laPhanTram_HoaHongYeuCauThucHien;
                }
                break;
            case LoaiHoaHongDichVu.TU_VAN:
                {
                    laPhanTram = itemCK.laPhanTram_HoaHongTuVan;
                }
                break;
        }
        const objUpdate = {
            idChiNhanh: idChiNhanh,
            idNhanViens: [itemCK.idNhanVien],
            idDonViQuiDoi: itemCK.idDonViQuiDoi,
            loaiChietKhau: loaiChietKhau,
            giaTri: gtriCK,
            laPhanTram: laPhanTram
        } as CreateOrEditChietKhauDichVuDto;
        await updateHoaHongDV(objUpdate);

        setPageResultChietKhauDV({
            ...pageResultChietKhauDV,
            items: pageResultChietKhauDV.items.map((x) => {
                if (x.idNhanVien === itemCK.idNhanVien && x.idDonViQuiDoi === itemCK.idDonViQuiDoi) {
                    if (loaiChietKhau === LoaiHoaHongDichVu.THUC_HIEN) {
                        return { ...x, hoaHongThucHien: gtriCK };
                    } else {
                        if (loaiChietKhau === LoaiHoaHongDichVu.YEU_CAU_THUC_HIEN) {
                            return {
                                ...x,
                                hoaHongYeuCauThucHien: gtriCK
                            };
                        } else {
                            return { ...x, hoaHongTuVan: gtriCK };
                        }
                    }
                } else {
                    return x;
                }
            })
        });
    };
    const onClickPtramVND = async (
        itemCK: ChietKhauDichVuItemDto_TachRiengCot,
        laPhanTram: boolean,
        loaiChietKhau: number
    ) => {
        // get gtriCK old: used to update
        let gtriCKOld = 0;
        switch (loaiChietKhau) {
            case LoaiHoaHongDichVu.THUC_HIEN:
                {
                    gtriCKOld = itemCK.hoaHongThucHien;
                }
                break;
            case LoaiHoaHongDichVu.YEU_CAU_THUC_HIEN:
                {
                    gtriCKOld = itemCK.hoaHongYeuCauThucHien;
                }
                break;
            case LoaiHoaHongDichVu.TU_VAN:
                {
                    gtriCKOld = itemCK.hoaHongTuVan;
                }
                break;
        }

        const objUpdate = {
            idChiNhanh: idChiNhanh,
            idNhanViens: [itemCK.idNhanVien],
            idDonViQuiDoi: itemCK.idDonViQuiDoi,
            loaiChietKhau: loaiChietKhau,
            giaTri: gtriCKOld,
            laPhanTram: laPhanTram
        } as CreateOrEditChietKhauDichVuDto;
        await updateHoaHongDV(objUpdate);

        setPageResultChietKhauDV({
            ...pageResultChietKhauDV,
            items: pageResultChietKhauDV.items.map((x) => {
                if (x.idNhanVien === itemCK.idNhanVien && x.idDonViQuiDoi === itemCK.idDonViQuiDoi) {
                    if (loaiChietKhau === LoaiHoaHongDichVu.THUC_HIEN) {
                        return { ...x, laPhanTram_HoaHongThucHien: laPhanTram };
                    } else {
                        if (loaiChietKhau === LoaiHoaHongDichVu.YEU_CAU_THUC_HIEN) {
                            return {
                                ...x,
                                laPhanTram_HoaHongYeuCauThucHien: laPhanTram
                            };
                        } else {
                            return { ...x, laPhanTram_HoaHongTuVan: laPhanTram };
                        }
                    }
                } else {
                    return x;
                }
            })
        });
    };

    const saveOKHoaHongDV = async () => {
        await getListSetupHoaHongDV();
        setIsShowModalSetup(false);
    };

    const columns: GridColDef[] = [
        {
            field: 'tenNhanVien',
            headerName: 'Nhân viên',
            flex: 0.7,
            renderHeader: (params) => <Box component={'span'}>{params.colDef.headerName}</Box>
        },
        {
            field: 'tenDichVu',
            headerName: 'Tên dịch vụ',
            flex: 1.5,
            renderHeader: (params) => <Box component={'span'}>{params.colDef.headerName}</Box>
        },
        {
            field: 'tenNhomDichVu',
            headerName: 'Nhóm dịch vụ',
            flex: 0.6,
            renderHeader: (params) => <Box component={'span'}>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Link component="button" underline="none">
                    {params.value}
                </Link>
            )
        },
        {
            field: 'giaDichVu',
            headerName: 'Giá bán',
            headerAlign: 'right',
            align: 'right',
            flex: 0.5,
            renderCell: (params) => (
                <Box display="flex" justifyContent="end" width="100%">
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            ),
            renderHeader: (params) => <Box component={'span'}>{params.colDef.headerName}</Box>
        },
        {
            field: 'hoaHongThucHien',
            headerName: 'Thực hiện',
            headerAlign: 'right',
            align: 'right',
            flex: 0.6,
            renderCell: (params) => (
                <Stack direction={'row'} spacing={1}>
                    <NumericFormat
                        fullWidth
                        size="small"
                        variant="standard"
                        thousandSeparator={'.'}
                        decimalSeparator={','}
                        value={params.value}
                        customInput={TextField}
                        InputProps={{
                            inputProps: {
                                style: { textAlign: 'right' }
                            }
                        }}
                        onChange={(e) => changeGtriChietKhau(e.target.value, params.row, LoaiHoaHongDichVu.THUC_HIEN)}
                        inputRef={(el: any) =>
                            (refInputThucHien.current[params.row.idNhanVien + '_' + params.row.idDonViQuiDoi] = el)
                        }
                        onKeyUp={(e: React.KeyboardEvent<HTMLDivElement>) => {
                            // find id of row next
                            const indexCurrent = pageResultChietKhauDV.items.findIndex(
                                (x) =>
                                    x.idNhanVien + '_' + x.idDonViQuiDoi ===
                                    params.row.idNhanVien + '_' + params.row.idDonViQuiDoi
                            );
                            let indexNext = indexCurrent + 1;
                            if (indexNext > pageResultChietKhauDV.items.length - 1) {
                                indexNext = 0;
                            }
                            const rowNext = pageResultChietKhauDV.items.filter(
                                (x: ChietKhauDichVuItemDto_TachRiengCot, index: number) => {
                                    return index === indexNext;
                                }
                            );
                            gotoNextInputThucHien(
                                e,
                                refInputThucHien.current[rowNext[0].idNhanVien + '_' + rowNext[0].idDonViQuiDoi]
                            );
                        }}
                    />
                    <Stack>
                        {params?.row?.laPhanTram_HoaHongThucHien ? (
                            <Avatar
                                style={{
                                    width: 25,
                                    height: 25,
                                    fontSize: '12px',
                                    backgroundColor: 'var(--color-main)'
                                }}
                                onClick={() => onClickPtramVND(params.row, false, LoaiHoaHongDichVu.THUC_HIEN)}>
                                %
                            </Avatar>
                        ) : (
                            <Avatar
                                style={{ width: 25, height: 25, fontSize: '12px' }}
                                onClick={() => onClickPtramVND(params.row, true, LoaiHoaHongDichVu.THUC_HIEN)}>
                                đ
                            </Avatar>
                        )}
                    </Stack>
                </Stack>
            ),
            renderHeader: (params) => <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
        },
        {
            field: 'hoaHongTuVan',
            headerAlign: 'right',
            headerName: 'Tư vấn',
            align: 'right',
            flex: 0.6,
            renderCell: (params) => (
                <Stack direction={'row'} spacing={1}>
                    <NumericFormat
                        fullWidth
                        size="small"
                        variant="standard"
                        thousandSeparator={'.'}
                        decimalSeparator={','}
                        value={params.value}
                        customInput={TextField}
                        InputProps={{
                            inputProps: {
                                style: { textAlign: 'right' }
                            }
                        }}
                        onChange={(e) => changeGtriChietKhau(e.target.value, params.row, LoaiHoaHongDichVu.TU_VAN)}
                        inputRef={(el: any) =>
                            (refInputTuVan.current[params.row.idNhanVien + '_' + params.row.idDonViQuiDoi] = el)
                        }
                        onKeyUp={(e: React.KeyboardEvent<HTMLDivElement>) => {
                            // find id of row next
                            const indexCurrent = pageResultChietKhauDV.items.findIndex(
                                (x) =>
                                    x.idNhanVien + '_' + x.idDonViQuiDoi ===
                                    params.row.idNhanVien + '_' + params.row.idDonViQuiDoi
                            );
                            let indexNext = indexCurrent + 1;
                            if (indexNext > pageResultChietKhauDV.items.length - 1) {
                                indexNext = 0;
                            }
                            const rowNext = pageResultChietKhauDV.items.filter(
                                (x: ChietKhauDichVuItemDto_TachRiengCot, index: number) => {
                                    return index === indexNext;
                                }
                            );
                            gotoNextInputTuVan(
                                e,
                                refInputTuVan.current[rowNext[0].idNhanVien + '_' + rowNext[0].idDonViQuiDoi]
                            );
                        }}
                    />
                    <Stack>
                        {params?.row?.laPhanTram_HoaHongTuVan ? (
                            <Avatar
                                style={{
                                    width: 25,
                                    height: 25,
                                    fontSize: '12px',
                                    backgroundColor: 'var(--color-main)'
                                }}
                                onClick={() => onClickPtramVND(params.row, false, LoaiHoaHongDichVu.TU_VAN)}>
                                %
                            </Avatar>
                        ) : (
                            <Avatar
                                style={{ width: 25, height: 25, fontSize: '12px' }}
                                onClick={() => onClickPtramVND(params.row, true, LoaiHoaHongDichVu.TU_VAN)}>
                                đ
                            </Avatar>
                        )}
                    </Stack>
                </Stack>
            ),
            renderHeader: (params) => <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>
        },
        {
            field: '#',
            headerName: '#',
            flex: 0.2,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            disableColumnMenu: true,
            renderHeader: () => (
                <ClearOutlinedIcon sx={{ color: 'red' }} titleAccess="Xóa tất cả" onClick={onClickDeleteAll} />
            ),
            renderCell: (params) => (
                <ClearOutlinedIcon
                    sx={{ color: 'red' }}
                    titleAccess="Xóa dòng"
                    onClick={() => onClickDeleteRow(params.row)}
                />
            )
        }
    ];

    return (
        <>
            <ConfirmDelete
                isShow={inforDeleteProduct.show}
                title={inforDeleteProduct.title}
                mes={inforDeleteProduct.mes}
                onOk={deleteRow}
                onCancel={() => setInforDeleteProduct({ ...inforDeleteProduct, show: false })}></ConfirmDelete>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <ModalSetupHoaHongDichVu
                isShow={isShowModalSetup}
                allNhanVien={allNhanVien}
                onClose={() => setIsShowModalSetup(false)}
                onSaveOK={saveOKHoaHongDV}
            />
            <Grid container className="dich-vu-page" gap={4} paddingTop={2}>
                <Grid item container alignItems="center" justifyContent="space-between">
                    <Grid container item xs={12} md={6} lg={6} alignItems="center">
                        <Grid container item alignItems="center">
                            <Grid item xs={6} sm={6} lg={4} md={4}>
                                <span className="page-title"> Hoa hồng theo dịch vụ</span>
                            </Grid>
                            <Grid item xs={6} sm={6} lg={6} md={6}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    sx={{
                                        backgroundColor: '#fff'
                                    }}
                                    variant="outlined"
                                    placeholder="Tìm dịch vụ"
                                    InputProps={{
                                        startAdornment: (
                                            <IconButton onClick={hanClickIconSearch}>
                                                <Search />
                                            </IconButton>
                                        )
                                    }}
                                    onChange={(event) =>
                                        setParamSearch({
                                            ...paramSearch,
                                            keyword: event.target.value
                                        })
                                    }
                                    onKeyDown={(event) => {
                                        handleKeyDownTextSearch(event);
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} display="flex" gap="8px" justifyContent="end">
                        <Button
                            size="small"
                            onClick={exportToExcel}
                            variant="outlined"
                            startIcon={<FileUploadOutlinedIcon />}
                            className="btnNhapXuat btn-outline-hover"
                            sx={{ bgcolor: '#fff!important', color: '#666466' }}>
                            Xuất
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            className=" btn-container-hover"
                            sx={{
                                minWidth: '143px',

                                fontSize: '14px'
                            }}
                            startIcon={<Add />}
                            onClick={() => showModalSetup()}>
                            Thêm mới
                        </Button>
                    </Grid>
                </Grid>
                <Grid container item spacing={2} paddingTop={1} columns={13}>
                    <Grid item lg={3} md={3} sm={4} xs={13}>
                        <Box className="page-box-left">
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                borderBottom="1px solid #E6E1E6"
                                padding="12px"
                                borderRadius={'4px'}
                                sx={{ backgroundColor: 'var(--color-header-table)' }}>
                                <Typography fontSize="14px" fontWeight="700">
                                    Nhân viên
                                </Typography>

                                {/* <Add
                                    sx={{
                                        transition: '.4s',
                                        height: '32px',
                                        cursor: 'pointer',
                                        width: '32px',
                                        borderRadius: '4px',
                                        padding: '4px 0px',
                                        border: '1px solid #cccc'
                                    }}
                                    onClick={() => showModalAddNhanVien()}
                                /> */}
                            </Box>
                            <Box
                                sx={{
                                    overflow: 'auto',
                                    maxHeight: '66vh',
                                    '&::-webkit-scrollbar': {
                                        width: '7px'
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        bgcolor: 'rgba(0,0,0,0.1)',
                                        borderRadius: '4px'
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        bgcolor: 'var(--color-bg)'
                                    }
                                }}>
                                <Stack paddingTop={1}>
                                    <TextField
                                        variant="standard"
                                        fullWidth
                                        placeholder="Tìm nhân viên"
                                        InputProps={{ startAdornment: <Search /> }}
                                        onChange={(e) => setTxtSearchNV(e.target.value)}
                                    />
                                    <Stack
                                        padding={1}
                                        sx={{ backgroundColor: 'var(--color-bg)', cursor: 'pointer' }}
                                        onClick={() => setIdNhanVienChosed(Guid.EMPTY)}>
                                        <Typography variant="body2" fontWeight={600}>
                                            Tất cả
                                        </Typography>
                                    </Stack>
                                    <Stack sx={{ overflow: 'auto', maxHeight: 400 }}>
                                        {lstNhanVien?.map((nvien: NhanSuItemDto, index: number) => (
                                            <Stack
                                                direction={'row'}
                                                spacing={1}
                                                key={index}
                                                sx={{
                                                    borderBottom: '1px dashed #cccc',
                                                    padding: '8px',
                                                    backgroundColor: idNhanVienChosed == nvien.id ? 'antiquewhite' : '',
                                                    '&:hover': {
                                                        bgcolor: 'var(--color-bg)'
                                                    }
                                                }}
                                                onClick={() => setIdNhanVienChosed(nvien.id)}>
                                                <Stack>
                                                    <Avatar
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                            backgroundColor: 'var(--color-bg)',
                                                            color: 'var(--color-main)',
                                                            fontSize: '14px'
                                                        }}>
                                                        {utils.getFirstLetter(nvien?.tenNhanVien ?? '')}
                                                    </Avatar>
                                                </Stack>
                                                <Stack justifyContent={'center'} spacing={1}>
                                                    <Stack sx={{ fontSize: '14px' }}>{nvien?.tenNhanVien}</Stack>
                                                    <Stack sx={{ fontSize: '12px', color: '#839bb1' }}>
                                                        {nvien?.tenChucVu}
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Stack>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item lg={10} md={10} sm={9} xs={13}>
                        <Box className="page-box-right">
                            <DataGrid
                                disableRowSelectionOnClick
                                rowHeight={46}
                                autoHeight={pageResultChietKhauDV.totalCount === 0}
                                className={'data-grid-row'}
                                rows={pageResultChietKhauDV.items}
                                columns={columns}
                                hideFooter
                                localeText={TextTranslate}
                                getRowId={(row) => row.idNhanVien + '_' + row.idDonViQuiDoi}
                            />

                            <Grid item container>
                                <Grid item xs={4} md={4} lg={4} sm={4}>
                                    <OptionPage changeNumberOfpage={changeNumberOfpage} />
                                </Grid>
                                <Grid item xs={8} md={8} lg={8} sm={8}>
                                    <Stack direction="row" style={{ float: 'right' }}>
                                        <LabelDisplayedRows
                                            currentPage={paramSearch.skipCount}
                                            pageSize={paramSearch.maxResultCount}
                                            totalCount={pageResultChietKhauDV.totalCount}
                                        />
                                        <Pagination
                                            shape="rounded"
                                            count={pageResultChietKhauDV.totalPage}
                                            page={paramSearch.skipCount}
                                            defaultPage={paramSearch.skipCount}
                                            onChange={handleChangePage}
                                        />
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}