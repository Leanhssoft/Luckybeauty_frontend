/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Dialog,
    DialogContent,
    Grid,
    Stack,
    Avatar,
    TextField,
    Checkbox,
    DialogTitle,
    Button,
    DialogActions,
    Pagination
} from '@mui/material';
import { Search } from '@mui/icons-material';
import utils from '../../../../../utils/utils';
import NhanSuItemDto from '../../../../../services/nhan-vien/dto/nhanSuItemDto';
import { useState, useEffect, useRef } from 'react';
import { NumericFormat } from 'react-number-format';
import { debounce } from '@mui/material/utils';
import ProductService from '../../../../../services/product/ProductService';
import { ModelHangHoaDto, PagedProductSearchDto } from '../../../../../services/product/dto';
import DialogButtonClose from '../../../../../components/Dialog/ButtonClose';
import SnackbarAlert from '../../../../../components/AlertDialog/SnackbarAlert';
import chietKhauDichVuService from '../../../../../services/hoa_hong/chiet_khau_dich_vu/chietKhauDichVuService';
import { ChietKhauDichVuDto_AddMultiple } from '../../../../../services/hoa_hong/chiet_khau_dich_vu/Dto/CreateOrEditChietKhauDichVuDto';
import Cookies from 'js-cookie';
import { Guid } from 'guid-typescript';
import AppConsts, { LoaiHoaHongDichVu } from '../../../../../lib/appconst';
import { LabelDisplayedRows } from '../../../../../components/Pagination/LabelDisplayedRows';

export default function ModalSetupHoaHongDichVu({ isShow, nhanVienChosed, allNhanVien, onClose, onSaveOK }: any) {
    const [txtSearchNV, setTxtSearchNV] = useState('');
    const [totalCount, setTotalCount] = useState(0);
    const [totalPage, setTotalPage] = useState(1);
    const [lstNhanVien, setLstNhanVien] = useState<NhanSuItemDto[]>([]);
    const [listProduct, setListProduct] = useState<ModelHangHoaDto[]>([]);
    const [arrIdQuyDoiChosed, setArrIdQuyDoiChosed] = useState<string[]>([]);
    const [arrIdNhanVienChosed, setArrIdNhanVienChosed] = useState<string[]>([]);

    const [checkAllNVien, setCheckAllNVien] = useState(false);
    const [checkAllProdcuct, setCheckAllProdcuct] = useState(false);

    const [objHoaHongThucHien, setObjHoaHongThucHien] = useState({
        loaiChietKhau: LoaiHoaHongDichVu.THUC_HIEN,
        laPhanTram: true,
        giaTri: 0
    });
    const [objHoaHongTuVan, setObjHoaHongTuVan] = useState({
        loaiChietKhau: LoaiHoaHongDichVu.TU_VAN,
        laPhanTram: true,
        giaTri: 0
    });

    const [paramSearch, setParamSearch] = useState<PagedProductSearchDto>({
        textSearch: '',
        idChiNhanhs: [''],
        currentPage: 1,
        pageSize: AppConsts.pageOption[0].value,
        columnSort: 'NgayLapHoaDon',
        typeSort: 'DESC'
    });

    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [isSaving, setIsSaving] = useState(false);

    const SearchNhanVienClient = () => {
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
        if (isShow) {
            setLstNhanVien([...allNhanVien]);
            setIsSaving(false);
            setObjHoaHongThucHien({ loaiChietKhau: 1, laPhanTram: true, giaTri: 0 });
            setObjHoaHongTuVan({ loaiChietKhau: 3, laPhanTram: true, giaTri: 0 });

            setArrIdQuyDoiChosed([]);
            setTxtSearchNV('');
            setParamSearch({ ...paramSearch, textSearch: '', currentPage: 1, pageSize: AppConsts.pageOption[0].value });
            if (nhanVienChosed != null) {
                setArrIdNhanVienChosed([nhanVienChosed?.id]);
            } else {
                setArrIdNhanVienChosed([]);
            }
        }
    }, [isShow]);

    useEffect(() => {
        SearchNhanVienClient();
    }, [txtSearchNV]);

    const debounceProduct = useRef(
        debounce(async (input: string) => {
            GetDanhMucHangHoa(input);
        }, 500)
    ).current;

    const GetDanhMucHangHoa = async (input = '') => {
        const param = { ...paramSearch };
        param.textSearch = input;
        const data = await ProductService.Get_DMHangHoa(param);
        setListProduct(data.items);
        setTotalCount(data?.totalCount);
        setTotalPage(Math.ceil(data?.totalCount / (paramSearch?.pageSize ?? 10)));
    };

    useEffect(() => {
        debounceProduct(paramSearch?.textSearch ?? '');
    }, [paramSearch?.textSearch]);

    useEffect(() => {
        GetDanhMucHangHoa();
    }, [paramSearch?.currentPage]);

    const NVien_changeCheckAll = () => {
        const gtriNew = !checkAllNVien;
        setCheckAllNVien(gtriNew);
        const arrIdNhanVienNew = lstNhanVien.map((x) => {
            return x.id;
        });
        if (gtriNew) {
            const arrAddIdUnique = Array.from(new Set([...arrIdNhanVienChosed, ...arrIdNhanVienNew]));
            setArrIdNhanVienChosed(arrAddIdUnique);
        } else {
            setArrIdNhanVienChosed(arrIdNhanVienChosed.filter((x) => !arrIdNhanVienNew.includes(x)));
        }
    };
    const NVien_changeCheckOne = (nvien: NhanSuItemDto) => {
        // check exist this nvien in list chosed
        const exist = arrIdNhanVienChosed.filter((x) => x == nvien.id);
        if (exist.length > 0) {
            // remove if exists
            setArrIdNhanVienChosed(arrIdNhanVienChosed.filter((x) => x !== nvien.id));
            setCheckAllNVien(false);
        } else {
            // add if not
            const arrIdAfterChosed = [...arrIdNhanVienChosed, nvien.id];
            setArrIdNhanVienChosed([...arrIdAfterChosed]);

            // check length of listNVien - list idcurrent chosed
            const arrIdNhanVienSearch = lstNhanVien.map((x) => {
                return x.id;
            });
            // if all nvien search exist in newArray --> checkall
            const arrFindAll = arrIdAfterChosed.filter((x) => arrIdNhanVienSearch.includes(x));
            setCheckAllNVien(arrFindAll.length === arrIdNhanVienSearch.length);
        }
    };

    const NVien_clickBoChon = () => {
        setArrIdNhanVienChosed([]);
        setCheckAllNVien(false);
    };
    const Product_clickBoChon = () => {
        setArrIdQuyDoiChosed([]);
        setCheckAllProdcuct(false);
    };

    const Product_changeCheckAll = () => {
        const gtriNew = !checkAllProdcuct;
        setCheckAllProdcuct(!checkAllProdcuct);

        const arrIdQuyDoiNew = listProduct.map((x) => {
            return x.idDonViQuyDoi as string;
        });
        if (gtriNew) {
            const arrAddIdUnique = Array.from(new Set([...arrIdQuyDoiChosed, ...arrIdQuyDoiNew]));
            setArrIdQuyDoiChosed(arrAddIdUnique);
        } else {
            setArrIdQuyDoiChosed(arrIdQuyDoiChosed.filter((x) => !arrIdQuyDoiNew.includes(x)));
        }
    };
    const Product_changeCheckOne = (product: ModelHangHoaDto) => {
        const idQuyDoi = product.idDonViQuyDoi as string;
        // check exist  in list chosed
        const exist = arrIdQuyDoiChosed.filter((x) => x == idQuyDoi);
        if (exist.length > 0) {
            // remove if exists
            setArrIdQuyDoiChosed(arrIdQuyDoiChosed.filter((x) => x !== idQuyDoi));
            setCheckAllProdcuct(false);
        } else {
            // add if not
            const arrIdAfterChosed = [...arrIdQuyDoiChosed, idQuyDoi];
            setArrIdQuyDoiChosed([...arrIdAfterChosed]);

            // check length of list search - list idcurrent chosed
            const arrIdProductSearch = listProduct.map((x) => {
                return x.idDonViQuyDoi as string;
            });
            // if all id in array search exist in newArray --> checkall
            const arrFindAll = arrIdAfterChosed.filter((x) => arrIdProductSearch.includes(x));
            setCheckAllProdcuct(arrFindAll.length === arrIdProductSearch.length);
        }
    };

    const saveSetup = async () => {
        // if (arrIdNhanVienChosed.length === 0) {
        //     setObjAlert({ ...objAlert, show: true, mes: 'Vui lòng chọn nhân viên áp dụng' });
        //     return;
        // }
        // form này chỉ chọn dịch vụ
        if (arrIdQuyDoiChosed.length === 0) {
            setObjAlert({ ...objAlert, show: true, mes: 'Vui lòng chọn dịch vụ áp dụng', type: 2 });
            return;
        }
        // if (objHoaHongThucHien.giaTri === 0) {
        //     setObjAlert({ ...objAlert, show: true, mes: 'Vui lòng nhập giá trị hoa hồng', type: 2 });
        //     return;
        // }
        // todo check NVien has setup dichvu (check DB)
        if (isSaving) return;
        setIsSaving(true);

        const idChiNhanh = Cookies.get('IdChiNhanh') ?? Guid.EMPTY;
        const paramThucHien = {
            idChiNhanh: idChiNhanh,
            idNhanViens: arrIdNhanVienChosed,
            idDonViQuyDois: arrIdQuyDoiChosed,
            loaiChietKhau: objHoaHongThucHien.loaiChietKhau,
            giaTri: objHoaHongThucHien.giaTri,
            laPhanTram: objHoaHongThucHien.laPhanTram
        } as ChietKhauDichVuDto_AddMultiple;
        const dataTH = await chietKhauDichVuService.AddMultiple_ChietKhauDichVu_toMultipleNhanVien(paramThucHien);

        // chỉ cài NV thực hiện
        // const paramTuVan = {
        //     idChiNhanh: idChiNhanh,
        //     idNhanViens: arrIdNhanVienChosed,
        //     idDonViQuyDois: arrIdQuyDoiChosed,
        //     loaiChietKhau: objHoaHongTuVan.loaiChietKhau,
        //     giaTri: objHoaHongTuVan.giaTri,
        //     laPhanTram: objHoaHongTuVan.laPhanTram
        // } as ChietKhauDichVuDto_AddMultiple;
        // await chietKhauDichVuService.AddMultiple_ChietKhauDichVu_toMultipleNhanVien(paramTuVan);

        setIsSaving(false);
        if (dataTH === 0) {
            setObjAlert({ ...objAlert, show: true, mes: 'Cài đặt hoa hồng dịch vụ thất bại', type: 2 });
            return;
        }
        setObjAlert({ ...objAlert, show: true, mes: 'Cài đặt hoa hồng dịch vụ thành công', type: 1 });
        onSaveOK();
    };

    const handleChangePage = (event: any, value: number) => {
        setParamSearch({
            ...paramSearch,
            currentPage: value
        });
    };

    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Dialog open={isShow} maxWidth="md" fullWidth onClose={onClose}>
                <DialogTitle className="modal-title">
                    Cài đặt hoa hồng dịch vụ {`(${nhanVienChosed?.tenNhanVien})`}
                    <DialogButtonClose onClose={onClose} />
                </DialogTitle>
                <DialogContent sx={{ paddingTop: '16px!important' }}>
                    <Grid container spacing={2}>
                        {/* bỏ: phần chọn NV: chọn theo từng NV ở bên ngoài */}
                        <Grid item xs={12} md={3} lg={3} style={{ display: 'none' }}>
                            <Stack>
                                <TextField
                                    size="small"
                                    fullWidth
                                    label="Tìm nhân viên"
                                    value={txtSearchNV}
                                    onChange={(event) => {
                                        setTxtSearchNV(event.target.value);
                                    }}
                                    InputProps={{
                                        startAdornment: <Search />
                                    }}
                                />
                                <Stack
                                    justifyContent={'space-between'}
                                    direction={'row'}
                                    fontSize={'13px'}
                                    alignItems={'center'}
                                    paddingRight={1}
                                    sx={{ backgroundColor: 'var(--color-bg)' }}>
                                    <Stack direction={'row'} alignItems={'center'} onClick={NVien_changeCheckAll}>
                                        <Checkbox value={checkAllNVien} checked={checkAllNVien} />
                                        <span style={{ cursor: 'pointer' }}> Chọn tất cả</span>
                                    </Stack>
                                    <Stack style={{ cursor: 'pointer' }} onClick={NVien_clickBoChon}>
                                        Bỏ chọn
                                    </Stack>
                                </Stack>
                                <Stack sx={{ overflow: 'auto', maxHeight: 400 }}>
                                    {lstNhanVien?.map((nvien: NhanSuItemDto, index: number) => (
                                        <Stack
                                            direction={'row'}
                                            key={index}
                                            sx={{
                                                borderBottom: `1px dashed ${
                                                    arrIdNhanVienChosed.includes(nvien.id) ? '#ff7171' : '#cccc'
                                                }`,
                                                padding: '6px',
                                                backgroundColor: arrIdNhanVienChosed.includes(nvien.id)
                                                    ? 'antiquewhite'
                                                    : ''
                                            }}
                                            onClick={() => NVien_changeCheckOne(nvien)}>
                                            <Checkbox checked={arrIdNhanVienChosed.includes(nvien.id)} />
                                            <Stack direction={'row'} spacing={1}>
                                                <Stack justifyContent={'center'} spacing={1}>
                                                    <Stack sx={{ fontSize: '14px' }}>{nvien?.tenNhanVien}</Stack>
                                                    <Stack sx={{ fontSize: '12px', color: '#839bb1' }}>
                                                        {nvien?.tenChucVu}
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <Stack>
                                <TextField
                                    size="small"
                                    fullWidth
                                    label="Tìm dịch vụ"
                                    value={paramSearch?.textSearch ?? ''}
                                    onChange={(event) => {
                                        setParamSearch({ ...paramSearch, textSearch: event.currentTarget.value });
                                    }}
                                    InputProps={{
                                        startAdornment: <Search />
                                    }}
                                />

                                <Stack
                                    justifyContent={'space-between'}
                                    direction={'row'}
                                    fontSize={'13px'}
                                    alignItems={'center'}
                                    paddingRight={1}
                                    sx={{ backgroundColor: 'var(--color-bg)' }}>
                                    <Stack direction={'row'} alignItems={'center'} onClick={Product_changeCheckAll}>
                                        <Checkbox value={checkAllProdcuct} checked={checkAllProdcuct} />
                                        <span style={{ cursor: 'pointer' }}> Chọn tất cả</span>
                                    </Stack>
                                    <Stack style={{ cursor: 'pointer' }} onClick={Product_clickBoChon}>
                                        <span>Bỏ chọn</span>
                                    </Stack>
                                </Stack>
                            </Stack>

                            <Stack sx={{ overflow: 'auto', maxHeight: 400 }}>
                                {listProduct?.map((item: ModelHangHoaDto, index: number) => (
                                    <Stack
                                        direction={'row'}
                                        justifyContent={'space-between'}
                                        key={index}
                                        padding={'8px 16px'}
                                        // borderBottom={'1px dashed #cccc'}
                                        alignItems={'center'}
                                        sx={{
                                            borderBottom: `1px dashed ${
                                                arrIdQuyDoiChosed.includes(item?.idDonViQuyDoi as string)
                                                    ? '#ff7171'
                                                    : '#cccc'
                                            }`,
                                            padding: '6px',
                                            backgroundColor: arrIdQuyDoiChosed.includes(item?.idDonViQuyDoi as string)
                                                ? 'antiquewhite'
                                                : ''
                                        }}
                                        onClick={() => Product_changeCheckOne(item)}>
                                        <Stack direction={'row'}>
                                            <Checkbox
                                                checked={arrIdQuyDoiChosed.includes(item?.idDonViQuyDoi as string)}
                                            />
                                            <Stack spacing={1}>
                                                <Stack sx={{ fontSize: '14px' }}>{item?.tenHangHoa}</Stack>
                                                <Stack sx={{ fontStyle: 'italic', fontSize: '12px' }}>
                                                    {item?.tenNhomHang}
                                                </Stack>
                                            </Stack>
                                        </Stack>

                                        <Stack sx={{ fontSize: '14px' }}>
                                            {new Intl.NumberFormat('vi-VN').format(item?.giaBan as number)}
                                        </Stack>
                                    </Stack>
                                ))}
                            </Stack>
                        </Grid>
                        {/* bỏ cài đạt giá trị: nhập bên ngoài (sau khi thêm) */}
                        <Grid
                            item
                            xs={12}
                            md={3}
                            lg={3}
                            marginTop={'10%'}
                            fontSize={'14px'}
                            style={{ display: 'none' }}>
                            <Grid container spacing={2} alignItems={'end'}>
                                <Grid item xs={4}>
                                    Thực hiện
                                </Grid>
                                <Grid item xs={8}>
                                    <Stack direction={'row'} spacing={2}>
                                        <NumericFormat
                                            fullWidth
                                            size="small"
                                            variant="standard"
                                            thousandSeparator={'.'}
                                            decimalSeparator={','}
                                            customInput={TextField}
                                            InputProps={{
                                                inputProps: {
                                                    style: { textAlign: 'right' }
                                                }
                                            }}
                                            isAllowed={(values) => {
                                                const floatValue = values.floatValue;
                                                if (objHoaHongThucHien.laPhanTram) return (floatValue ?? 0) <= 100; // neu %: khong cho phep nhap qua 100%
                                                return true;
                                            }}
                                            onChange={(e) =>
                                                setObjHoaHongThucHien({
                                                    ...objHoaHongThucHien,
                                                    giaTri: utils.formatNumberToFloat(e.target.value)
                                                })
                                            }
                                            value={objHoaHongThucHien.giaTri}
                                        />
                                        {objHoaHongThucHien.laPhanTram ? (
                                            <Avatar
                                                style={{
                                                    width: 25,
                                                    height: 25,
                                                    fontSize: '12px',
                                                    backgroundColor: 'var(--color-main)'
                                                }}
                                                onClick={() =>
                                                    setObjHoaHongThucHien({
                                                        ...objHoaHongThucHien,
                                                        laPhanTram: !objHoaHongThucHien.laPhanTram
                                                    })
                                                }>
                                                %
                                            </Avatar>
                                        ) : (
                                            <Avatar
                                                style={{
                                                    width: 25,
                                                    height: 25,
                                                    fontSize: '12px'
                                                }}
                                                onClick={() =>
                                                    setObjHoaHongThucHien({
                                                        ...objHoaHongThucHien,
                                                        laPhanTram: !objHoaHongThucHien.laPhanTram
                                                    })
                                                }>
                                                đ
                                            </Avatar>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={4}>
                                    Tư vấn
                                </Grid>
                                <Grid item xs={8}>
                                    <Stack direction={'row'} spacing={1}>
                                        <NumericFormat
                                            fullWidth
                                            size="small"
                                            variant="standard"
                                            thousandSeparator={'.'}
                                            decimalSeparator={','}
                                            customInput={TextField}
                                            autoComplete="off"
                                            InputProps={{
                                                inputProps: {
                                                    style: { textAlign: 'right' }
                                                }
                                            }}
                                            isAllowed={(values) => {
                                                const floatValue = values.floatValue;
                                                if (objHoaHongTuVan.laPhanTram) return (floatValue ?? 0) <= 100; // neu %: khong cho phep nhap qua 100%
                                                return true;
                                            }}
                                            onChange={(e) =>
                                                setObjHoaHongTuVan({
                                                    ...objHoaHongTuVan,
                                                    giaTri: utils.formatNumberToFloat(e.target.value)
                                                })
                                            }
                                            value={objHoaHongTuVan.giaTri}
                                        />
                                        {objHoaHongTuVan.laPhanTram ? (
                                            <Avatar
                                                style={{
                                                    width: 25,
                                                    height: 25,
                                                    fontSize: '12px',
                                                    backgroundColor: 'var(--color-main)'
                                                }}
                                                onClick={() =>
                                                    setObjHoaHongTuVan({
                                                        ...objHoaHongTuVan,
                                                        laPhanTram: !objHoaHongTuVan.laPhanTram
                                                    })
                                                }>
                                                %
                                            </Avatar>
                                        ) : (
                                            <Avatar
                                                style={{
                                                    width: 25,
                                                    height: 25,
                                                    fontSize: '12px'
                                                }}
                                                onClick={() =>
                                                    setObjHoaHongTuVan({
                                                        ...objHoaHongTuVan,
                                                        laPhanTram: !objHoaHongTuVan.laPhanTram
                                                    })
                                                }>
                                                đ
                                            </Avatar>
                                        )}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ paddingBottom: '16px!important' }}>
                    <Grid container sx={{ paddingRight: '16px', paddingLeft: '24px' }}>
                        <Grid item xs={8}>
                            <Stack direction="row">
                                <LabelDisplayedRows
                                    currentPage={paramSearch?.currentPage ?? 1}
                                    pageSize={paramSearch?.pageSize ?? 10}
                                    totalCount={totalCount}
                                />
                                <Pagination
                                    shape="rounded"
                                    count={totalPage}
                                    page={paramSearch?.currentPage ?? 1}
                                    defaultPage={paramSearch?.currentPage ?? 1}
                                    onChange={handleChangePage}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={4}>
                            <Stack spacing={1} direction={'row'} justifyContent={'end'}>
                                <Button variant="outlined" onClick={onClose}>
                                    Bỏ qua
                                </Button>
                                {isSaving ? (
                                    <Button variant="contained">Đang lưu</Button>
                                ) : (
                                    <Button variant="contained" onClick={saveSetup}>
                                        Áp dụng
                                    </Button>
                                )}
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </>
    );
}
