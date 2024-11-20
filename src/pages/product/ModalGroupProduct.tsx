import { observer } from 'mobx-react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState, useContext } from 'react';
import { Grid, Box, Autocomplete, InputAdornment, TextField, Stack } from '@mui/material';
import { PropConfirmOKCancel } from '../../utils/PropParentToChild';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';

import GroupProductService from '../../services/product/GroupProductService';
import { ModelNhomHangHoa } from '../../services/product/dto';
import { ReactComponent as CloseIcon } from '../../images/close-square.svg';
import Utils from '../../utils/utils';
import AppConsts, { LoaiNhatKyThaoTac, TypeAction } from '../../lib/appconst';
import abpCustom from '../../components/abp-custom';
import { NumericFormat } from 'react-number-format';
import nhomHangHoaStore from '../../stores/nhomHangHoaStore';
import utils from '../../utils/utils';
import Cookies from 'js-cookie';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import { CreateNhatKyThaoTacDto } from '../../services/nhat_ky_hoat_dong/dto/CreateNhatKyThaoTacDto';
import nhatKyHoatDongService from '../../services/nhat_ky_hoat_dong/nhatKyHoatDongService';

export const GridColor = ({ handleChoseColor }: any) => {
    const [itemColor, setItemColor] = useState({});

    const arrColor = [
        '#FF979C',
        '#FF7597',
        '#FF5677',
        '#DCAFFF',
        '#7F75BE',
        '#5654A8',
        '#78CEFF',
        '#00FF7F',
        '#009688',
        '#4B9C62',
        '#50CD89',
        '#89D49B',
        '#E1CF43',
        '#F4D292',
        '#EFB279',
        '#FC8C4A',
        '#F17448',
        '#DB4335'
    ];
    function choseColor(color: string) {
        setItemColor(color);
        handleChoseColor(color);
    }
    return (
        <>
            <Box
                style={{
                    width: 280,
                    height: 150,
                    position: 'absolute',
                    zIndex: 1,
                    backgroundColor: '#FFFFF0',
                    borderRadius: 4,
                    top: '22px'
                }}
                sx={{ ml: 0, p: 1.5, border: '1px solid grey' }}>
                <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 6, sm: 6, md: 6 }}>
                    {arrColor.map((item, index) => (
                        <Grid key={index} item xs={1} sm={1} md={1} onClick={() => choseColor(item)}>
                            <Box className="grid-color" sx={{ bgcolor: item }}></Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
};

const ModalNhomHangHoa = ({ handleSave, trigger }: any) => {
    const appContext = useContext(AppContext);
    const chiNhanhCurrent = appContext.chinhanhCurrent;
    const idChiNhanh = utils.checkNull(chiNhanhCurrent?.id) ? Cookies.get('IdChiNhanh') : chiNhanhCurrent?.id;
    const [colorToggle, setColorToggle] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [wasClickSave, setWasClickSave] = useState(false);
    const [errTenNhom, setErrTenNhom] = useState(false);
    const [groupProduct, setGroupProduct] = useState<ModelNhomHangHoa>(
        new ModelNhomHangHoa({
            id: AppConsts.guidEmpty,
            color: '#FF979C',
            tenNhomHang: '',
            laNhomHangHoa: true
        })
    );

    const [nhomGoc, setNhomGoc] = useState<ModelNhomHangHoa | null>(null);

    const [inforDeleteProduct, setInforDeleteProduct] = useState<PropConfirmOKCancel>(
        new PropConfirmOKCancel({ show: false })
    );

    const showModal = async (id: string) => {
        if (id) {
            console.log(22, trigger?.item);
            setGroupProduct(trigger.item);
            setGroupProduct((old: any) => {
                return {
                    ...old,
                    sLoaiNhomHang: old.laNhomHangHoa ? 'nhóm hàng hóa' : 'nhóm dịch vụ'
                };
            });

            // find nhomhang
            const nhom = nhomHangHoaStore?.listAllNhomHang?.filter((x) => x.id == trigger.item.idParent);
            if (nhom.length > 0) {
                setNhomGoc(nhom[0]);
            } else {
                setNhomGoc(null);
            }
        } else {
            setGroupProduct(new ModelNhomHangHoa({ color: '#FF979C' }));
            setNhomGoc(null);
        }
    };

    const handleChangeNhomGoc = (item: any) => {
        if (item == null) {
            setNhomGoc(null);
        } else {
            setNhomGoc(new ModelNhomHangHoa({ id: item?.id ?? null, tenNhomHang: item?.tenNhomHang }));
        }
        setGroupProduct((old: any) => {
            return { ...old, idParent: item?.id ?? null };
        });
    };

    useEffect(() => {
        if (trigger.isShow) {
            setIsShow(true);
            showModal(trigger.id);
        }
        setIsNew(trigger.isNew);
        setWasClickSave(false);
    }, [trigger]); // assign again dataNhomHang after save

    function changeColor(colorNew: string) {
        setColorToggle(false);
        setGroupProduct((olds: any) => {
            return { ...olds, color: colorNew };
        });
    }

    const xoaNhomHang = async () => {
        await GroupProductService.XoaNhomHangHoa(groupProduct?.id ?? '');
        setIsShow(false);
        setInforDeleteProduct({ ...inforDeleteProduct, show: false });
        nhomHangHoaStore?.changeListNhomHang(groupProduct, TypeAction.DELETE);

        handleSave(groupProduct, true);
    };

    const CheckSave = () => {
        if (Utils.checkNull(groupProduct.tenNhomHang)) {
            setErrTenNhom(true);
            return false;
        }
        return true;
    };

    const saveDiaryProductGroup = async (obj: ModelNhomHangHoa) => {
        const sLoai = isNew ? 'Thêm mới' : 'Cập nhật';
        const tenNhomGoc = utils.checkNull(nhomGoc?.tenNhomHang) ? '' : nhomGoc?.tenNhomHang;
        let sOld = '';
        if (!isNew) {
            sOld = `<br /> <b> Thông tin cũ: </b> <br /> Tên nhóm hàng: ${trigger?.item?.tenNhomHang} <br /> Thứ tự hiển thị: ${trigger?.item?.thuTuHienThi}`;
        }
        const diary = {
            idChiNhanh: idChiNhanh,
            chucNang: `Nhóm dịch vụ`,
            noiDung: `${sLoai} nhóm dịch vụ ${obj?.tenNhomHang}`,
            noiDungChiTiet: `Tên nhóm hàng: ${obj?.tenNhomHang}  <br /> Nhóm cha: ${tenNhomGoc} <br /> Thứ tự hiển thị: ${obj?.thuTuHienThi} ${sOld}`,
            loaiNhatKy: isNew ? LoaiNhatKyThaoTac.INSEART : LoaiNhatKyThaoTac.UPDATE
        } as CreateNhatKyThaoTacDto;
        await nhatKyHoatDongService.createNhatKyThaoTac(diary);
    };

    const saveNhomHangHoa = async () => {
        setWasClickSave(true);

        const check = CheckSave();
        if (!check) {
            return;
        }

        if (wasClickSave) {
            return;
        }
        const objNew: ModelNhomHangHoa = {
            ...groupProduct,
            tenNhomHang_KhongDau: utils.strToEnglish(groupProduct.tenNhomHang ?? '')
        };
        if (trigger.isNew) {
            GroupProductService.InsertNhomHangHoa(groupProduct).then((data) => {
                objNew.id = data.id;
                handleSave(objNew);
            });
            nhomHangHoaStore.changeListNhomHang(objNew, TypeAction.INSEART);
        } else {
            GroupProductService.UpdateNhomHangHoa(groupProduct).then(() => {
                handleSave(objNew);
            });
            nhomHangHoaStore.changeListNhomHang(objNew, TypeAction.UPDATE);
        }
        await saveDiaryProductGroup(objNew);
        setIsShow(false);
    };

    return (
        <div>
            <ConfirmDelete
                isShow={inforDeleteProduct.show}
                title={inforDeleteProduct.title}
                mes={inforDeleteProduct.mes}
                onOk={xoaNhomHang}
                onCancel={() => setInforDeleteProduct({ ...inforDeleteProduct, show: false })}></ConfirmDelete>
            <Dialog
                open={isShow}
                onClose={() => setIsShow(false)}
                aria-labelledby="draggable-dialog-title"
                maxWidth="xs">
                <DialogTitle className="modal-title" id="draggable-dialog-title">
                    {isNew ? 'Thêm' : 'Cập nhật'} {groupProduct.sLoaiNhomHang}
                </DialogTitle>
                <Button
                    sx={{
                        minWidth: 'unset',
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        '&:hover svg': {
                            filter: 'brightness(0) saturate(100%) invert(36%) sepia(74%) saturate(1465%) hue-rotate(318deg) brightness(94%) contrast(100%)'
                        }
                    }}
                    onClick={() => setIsShow(false)}>
                    <CloseIcon />
                </Button>
                <DialogContent sx={{ overflow: 'unset' }}>
                    <Grid container spacing={2}>
                        {/* <Grid item xs={12} sm={12} md={12} lg={12} sx={{ pb: 2 }}>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={groupProduct.laNhomHangHoa}
                                            onChange={(event) => {
                                                setGroupProduct((olds: any) => {
                                                    return {
                                                        ...olds,
                                                        laNhomHangHoa: event.target.checked,
                                                        sLoaiNhomHang: event.target.checked
                                                            ? 'nhóm hàng hóa'
                                                            : 'nhóm dịch vụ'
                                                    };
                                                });
                                                setDataNhomHangFilter(
                                                    dataNhomHang.filter(
                                                        (x: any) =>
                                                            x.laNhomHangHoa === event.target.checked
                                                    )
                                                );
                                            }}
                                            sx={{
                                                color: '#7C3367',
                                                '&.Mui-checked': {
                                                    color: '#7C3367'
                                                }
                                            }}
                                        />
                                    }
                                    label="Là nhóm hàng hóa"
                                />
                            </FormGroup>
                        </Grid> */}
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <TextField
                                variant="outlined"
                                size="small"
                                fullWidth
                                required
                                autoFocus
                                label={`Tên ${groupProduct.sLoaiNhomHang}`}
                                value={groupProduct.tenNhomHang}
                                error={errTenNhom && wasClickSave}
                                helperText={errTenNhom && wasClickSave ? 'Tên nhóm không được để trống' : ''}
                                onChange={(event) => {
                                    setGroupProduct((olds: any) => {
                                        return { ...olds, tenNhomHang: event.target.value };
                                    });
                                    setErrTenNhom(false);
                                    setWasClickSave(false);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Autocomplete
                                size="small"
                                fullWidth
                                disablePortal
                                multiple={false}
                                value={nhomGoc}
                                onChange={(event: any, newValue: any) => {
                                    handleChangeNhomGoc(newValue);
                                }}
                                options={nhomHangHoaStore?.listAllNhomHang?.filter((x) => x.id !== null && x.id !== '')}
                                getOptionLabel={(option: any) => (option.tenNhomHang ? option.tenNhomHang : '')}
                                renderInput={(params) => <TextField {...params} label="Nhóm cha" />}
                                renderOption={(props, item) => (
                                    <Box component={'li'} {...props} className="autocomplete-option">
                                        {item.tenNhomHang}
                                    </Box>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Stack spacing={1} position={'relative'}>
                                <TextField
                                    size="small"
                                    label="Màu sắc"
                                    onClick={() => setColorToggle(!colorToggle)}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Box className="grid-color" sx={{ bgcolor: groupProduct.color }}></Box>
                                            </InputAdornment>
                                        )
                                    }}
                                    variant="outlined"
                                />
                                {colorToggle && <GridColor handleChoseColor={changeColor} />}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <NumericFormat
                                size="small"
                                fullWidth
                                label="Thứ tự hiển thị"
                                value={groupProduct.thuTuHienThi}
                                thousandSeparator={'.'}
                                decimalSeparator={','}
                                customInput={TextField}
                                onChange={(event) =>
                                    setGroupProduct((olds: any) => {
                                        return { ...olds, thuTuHienThi: event.target.value };
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: 'none' }}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                multiline
                                label="Mô tả"
                                rows={2}
                                value={groupProduct.moTa || ''}
                                onChange={(event) =>
                                    setGroupProduct((olds: any) => {
                                        return { ...olds, moTa: event.target.value };
                                    })
                                }
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions style={{ paddingBottom: '20px' }}>
                    <Button
                        variant="outlined"
                        sx={{
                            color: 'var(--color-main)'
                        }}
                        onClick={() => setIsShow(false)}
                        className="btn-outline-hover">
                        Hủy
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        sx={{
                            display: isNew || !abpCustom.isGrandPermission('Pages.DM_NhomHangHoa.Delete') ? 'none' : ''
                        }}
                        onClick={() => {
                            setInforDeleteProduct(
                                new PropConfirmOKCancel({
                                    show: true,
                                    title: 'Xác nhận xóa',
                                    mes: `Bạn có chắc chắn muốn xóa ${groupProduct.sLoaiNhomHang}  ${
                                        groupProduct?.tenNhomHang ?? ' '
                                    } không?`
                                })
                            );
                        }}>
                        Xóa
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ bgcolor: 'var(--color-main)!important' }}
                        onClick={saveNhomHangHoa}
                        className="btn-container-hover">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default observer(ModalNhomHangHoa);
