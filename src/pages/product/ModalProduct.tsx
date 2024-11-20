import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import { NumericFormat } from 'react-number-format';
import {
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Grid,
    Stack,
    Typography,
    Button,
    Box,
    TextField,
    Autocomplete,
    Link,
    FormGroup,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { ReactComponent as CloseIcon } from '../../images/close-square.svg';
import { Add } from '@mui/icons-material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import { ModelNhomHangHoa, ModelHangHoaDto } from '../../services/product/dto';
import { PropConfirmOKCancel, PropModal } from '../../utils/PropParentToChild';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';

import ProductService from '../../services/product/ProductService';
import './style.css';

import { Guid } from 'guid-typescript';
import utils from '../../utils/utils';
import Cookies from 'js-cookie';
import uploadFileService from '../../services/uploadFileService';
import abpCustom from '../../components/abp-custom';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import ModalNhomHangHoa from './ModalGroupProduct';
import { observer } from 'mobx-react';
import nhomHangHoaStore from '../../stores/nhomHangHoaStore';
import { LoaiNhatKyThaoTac, TypeAction } from '../../lib/appconst';
import ImgurAPI from '../../services/ImgurAPI/ImgurAPI';
import { util } from 'prettier';
import DialogButtonClose from '../../components/Dialog/ButtonClose';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import { CreateNhatKyThaoTacDto } from '../../services/nhat_ky_hoat_dong/dto/CreateNhatKyThaoTacDto';
import nhatKyHoatDongService from '../../services/nhat_ky_hoat_dong/nhatKyHoatDongService';

const ModalHangHoa = ({ handleSave, trigger }: any) => {
    const appContext = useContext(AppContext);
    const chiNhanhCurrent = appContext.chinhanhCurrent;
    const idChiNhanh = utils.checkNull(chiNhanhCurrent?.id) ? Cookies.get('IdChiNhanh') : chiNhanhCurrent?.id;
    const [open, setOpen] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [product, setProduct] = useState(new ModelHangHoaDto());
    const [inforOldProduct, setInforOldProduct] = useState(new ModelHangHoaDto());
    const [wasClickSave, setWasClickSave] = useState(false);
    const [actionProduct, setActionProduct] = useState(TypeAction.INSEART);
    const tenantName = Cookies.get('TenantName') ?? 'HOST';
    const [productImage, setProductImage] = useState(''); // url of imge
    const [fileImage, setFileImage] = useState<File>({} as File); // file image

    const [errTenHangHoa, setErrTenHangHoa] = useState(false);
    const [errMaHangHoa, setErrMaHangHoa] = useState(false);

    const [imgur_imageId, setImgur_imageId] = useState('');
    const [imgur_albumId, setImgur_albumId] = useState('');

    const [nhomChosed, setNhomChosed] = useState<ModelNhomHangHoa | null>(null);
    const [inforDeleteProduct, setInforDeleteProduct] = useState<PropConfirmOKCancel>(
        new PropConfirmOKCancel({ show: false })
    );
    const [triggerModalNhomHang, setTriggerModalNhomHang] = useState<PropModal>(new PropModal({ isShow: false }));
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const showModal = async (id: string) => {
        if (id) {
            const obj = await ProductService.GetDetailProduct(id);
            setProduct(obj);
            setInforOldProduct(obj);

            setProduct((old: ModelHangHoaDto) => {
                return {
                    ...old,
                    laHangHoa: old.idLoaiHangHoa === 1
                };
            });

            // find nhomhang
            const nhom = nhomHangHoaStore.listAllNhomHang?.filter((x) => x.id == obj.idNhomHangHoa);
            if (nhom.length > 0) {
                setNhomChosed(nhom[0]);
            } else {
                setNhomChosed(null);
            }

            // get image (from imgur)
            const imgur_image = ImgurAPI.GetInforImage_fromDataImage(obj.image ?? '');
            setImgur_imageId(imgur_image?.id);

            const imgData = await ImgurAPI.GetFile_fromId(imgur_image?.id ?? '');
            setProductImage(imgData?.link ?? '');
        } else {
            setProduct(new ModelHangHoaDto());
            setProductImage('');

            if (trigger.item.idNhomHangHoa !== undefined) {
                const nhom = nhomHangHoaStore.listAllNhomHang?.filter((x) => x.id == trigger.item.idNhomHangHoa);
                if (nhom.length > 0) {
                    setNhomChosed(nhom[0]);
                    setProduct((old: ModelHangHoaDto) => {
                        return {
                            ...old,
                            idNhomHangHoa: nhom[0].id,
                            tenNhomHang: nhom[0].tenNhomHang
                        };
                    });
                } else {
                    setNhomChosed(null);
                }
            } else {
                setNhomChosed(null);
            }
        }
    };

    useEffect(() => {
        GetInforAlbum();
        InitData();

        if (trigger.isShow) {
            setOpen(true);
            showModal(trigger.id);
        }
        setIsNew(trigger.isNew);
    }, [trigger]);

    const InitData = () => {
        setFileImage({} as File);
        setWasClickSave(false);
        setErrMaHangHoa(false);
        setErrTenHangHoa(false);
        setImgur_imageId('');
        setImgur_albumId('');
    };

    const GetInforAlbum = async () => {
        const dataImage = await ProductService.GetInforImage_OfAnyHangHoa();
        const dataSubAlbum = ImgurAPI.GetInforSubAlbum_fromDataImage(dataImage);
        setImgur_albumId(dataSubAlbum?.id);

        if (utils.checkNull(dataSubAlbum?.id)) {
            // trường hợp đã có album treen Imgur, nhưng ảnh trong DM hàng hóa đã bị xóa hết
            const allAlbums = await ImgurAPI.GetAllAlbum_WithAccount();
            if (allAlbums !== undefined && allAlbums?.length > 0) {
                const albumItem = allAlbums?.filter((x) => x.title === `${tenantName}_HangHoa`);
                if (albumItem?.length > 0) {
                    setImgur_albumId(albumItem[0]?.id);
                }
            }
        }
    };

    const editGiaBan = (event: any) => {
        setProduct((itemOlds) => {
            return {
                ...itemOlds,
                giaBan: utils.formatNumberToFloat(event.target.value)
            };
        });
    };
    const handleChangeNhom = (item: any) => {
        setProduct((itemOlds) => {
            return {
                ...itemOlds,
                idNhomHangHoa: item?.id ?? null,
                tenNhomHang: item?.tenNhomHang,
                laHangHoa: item?.laNhomHangHoa ?? false,
                idLoaiHangHoa: item?.laNhomHangHoa ? 1 : 2,
                tenLoaiHangHoa: item?.laNhomHangHoa ? 'hàng hóa' : 'dịch vụ'
            };
        });

        if (item == null) setNhomChosed(null);
        else setNhomChosed(new ModelNhomHangHoa({ id: item?.id ?? null, tenNhomHang: item?.tenNhomHang }));
        setWasClickSave(false);
    };

    const handleClickOKComfirm = () => {
        setOpen(false);
        setInforDeleteProduct({ ...inforDeleteProduct, show: false });
        handleSave(product, actionProduct);
    };

    const CheckSave = async () => {
        if (utils.checkNull(product.tenHangHoa ?? '')) {
            setErrTenHangHoa(true);
            return false;
        }
        if (!utils.checkNull(product.maHangHoa ?? '')) {
            const exists = await ProductService.CheckExistsMaHangHoa(
                product.maHangHoa ?? '',
                product.idDonViQuyDoi ?? Guid.EMPTY
            );
            if (exists) {
                setErrMaHangHoa(true);
                return false;
            }
        }
        return true;
    };

    const choseImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file: File = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setProductImage(reader.result?.toString() ?? '');
            };
            setFileImage(file);
        } else {
            setProductImage('');
            setFileImage({} as File);
        }

        await closeImage();
    };
    const closeImage = async () => {
        setProductImage('');
        if (!utils.checkNull(imgur_imageId)) {
            await ImgurAPI.RemoveImage(imgur_imageId ?? '');
        }
    };

    const saveDiaryProduct = async (product: ModelHangHoaDto) => {
        const sLoai = isNew ? 'Thêm mới' : 'Cập nhật';
        let sOld = '';
        if (!isNew) {
            sOld = `<br /> <b> Thông tin cũ: </b> <br /> Mã dịch vụ: ${
                inforOldProduct?.maHangHoa
            }  <br /> Tên dịch vụ: ${inforOldProduct?.tenHangHoa} <br /> Thuộc nhóm: ${
                inforOldProduct?.tenNhomHang ?? ''
            }  <br /> Giá bán:  ${Intl.NumberFormat('vi-VN').format(inforOldProduct?.giaBan as unknown as number)}`;
        }
        const diary = {
            idChiNhanh: idChiNhanh,
            chucNang: `Danh mục dịch vụ`,
            noiDung: `${sLoai} dịch vụ ${product?.tenHangHoa} (${product?.maHangHoa})  `,
            noiDungChiTiet: `Mã dịch vụ: ${product?.maHangHoa}  <br /> Tên dịch vụ: ${
                product?.tenHangHoa
            } <br /> Thuộc nhóm: ${product?.tenNhomHang ?? ''}  <br /> Giá bán:  ${Intl.NumberFormat('vi-VN').format(
                product?.giaBan as unknown as number
            )} ${sOld}`,
            loaiNhatKy: isNew ? LoaiNhatKyThaoTac.INSEART : LoaiNhatKyThaoTac.UPDATE
        } as CreateNhatKyThaoTacDto;
        await nhatKyHoatDongService.createNhatKyThaoTac(diary);
    };

    async function saveProduct() {
        setWasClickSave(true);

        if (wasClickSave) {
            return;
        }
        const check = await CheckSave();
        if (!check) {
            return;
        }

        // imageData: tennantName_HangHoa/image (albumId/imageId)
        let imgur_PathImage = '';
        if ((fileImage?.size ?? 0) > 0) {
            let subAlbumId = imgur_albumId;
            if (utils.checkNull(imgur_albumId)) {
                // create subAlbum
                const subAlbum = await ImgurAPI.CreateNewAlbum(`${tenantName}_HangHoa`);
                if (subAlbum != null && subAlbum?.id !== undefined) {
                    imgur_PathImage = `${subAlbum?.id}/`;
                    subAlbumId = subAlbum?.id;
                }
            } else {
                imgur_PathImage = `${imgur_albumId}/`;
            }

            // add image to subAlbum
            const dataImage = await ImgurAPI.UploadImage(fileImage);
            if (dataImage != null && dataImage?.id !== undefined) {
                imgur_PathImage += `${dataImage?.id}`;
                await ImgurAPI.AddImageToAlbum_WithImageId(subAlbumId, dataImage?.id ?? '');
            }
        }

        // if update: imageId != null
        if (!utils.checkNull(imgur_imageId) && utils.checkNull(productImage)) {
            imgur_PathImage = '';
        } else {
            imgur_PathImage = product?.image ?? ''; // keep
        }

        const objNew = { ...product };
        objNew.giaBan = utils.formatNumberToFloat(product.giaBan);
        objNew.tenHangHoa_KhongDau = utils.strToEnglish(objNew.tenHangHoa ?? '');
        objNew.tenLoaiHangHoa = objNew.idLoaiHangHoa == 1 ? 'Hàng hóa' : 'Dịch vụ';
        objNew.txtTrangThaiHang = objNew.trangThai == 1 ? 'Đang kinh doanh' : 'Ngừng kinh doanh';
        objNew.image = imgur_PathImage;
        objNew.donViQuiDois = [
            {
                id: objNew.idDonViQuyDoi,
                maHangHoa: objNew.maHangHoa,
                tenDonViTinh: '',
                tyLeChuyenDoi: objNew.tyLeChuyenDoi,
                giaBan: objNew.giaBan,
                laDonViTinhChuan: objNew.laDonViTinhChuan
            }
        ];

        const data = await ProductService.CreateOrEditProduct(objNew);
        objNew.id = data.id;
        objNew.idHangHoa = data.id;
        objNew.donViQuiDois = [...data.donViQuiDois];
        objNew.maHangHoa = data.donViQuiDois.filter((x: any) => x.laDonViTinhChuan === 1)[0]?.maHangHoa;
        objNew.idDonViQuyDoi = data.donViQuiDois.filter((x: any) => x.laDonViTinhChuan === 1)[0]?.id;

        // save diary
        await saveDiaryProduct(objNew);

        handleSave(objNew, isNew ? TypeAction.INSEART : TypeAction.UPDATE);
        setOpen(false);
    }

    function showModalAddNhomHang(id = '') {
        setTriggerModalNhomHang({
            isShow: true,
            isNew: utils.checkNull(id),
            id: id
        });
    }

    const saveNhomHang = (objNhomHang: ModelNhomHangHoa) => {
        setTriggerModalNhomHang({ ...triggerModalNhomHang, isShow: false });
        setNhomChosed(objNhomHang);
        setProduct({ ...product, idNhomHangHoa: objNhomHang.id, tenNhomHang: objNhomHang.tenNhomHang });

        setObjAlert({
            show: true,
            type: 1,
            mes: 'Thêm nhóm ' + (product?.tenLoaiHangHoa ?? '').toLocaleLowerCase() + ' thành công'
        });
        // todgo get again treeNhomHang
    };
    return (
        <>
            <ConfirmDelete
                isShow={inforDeleteProduct.show}
                title={inforDeleteProduct.title}
                mes={inforDeleteProduct.mes}
                onOk={handleClickOKComfirm}
                onCancel={() => setInforDeleteProduct({ ...inforDeleteProduct, show: false })}></ConfirmDelete>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <ModalNhomHangHoa trigger={triggerModalNhomHang} handleSave={saveNhomHang} />
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogButtonClose onClose={() => setOpen(false)} />
                <DialogTitle className="modal-title">
                    {isNew ? 'Thêm ' : 'Cập nhật '}
                    {product.tenLoaiHangHoa?.toLocaleLowerCase()}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} paddingTop={2}>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <Box
                                sx={{
                                    border: '1px solid #cccc',
                                    p: 1,
                                    height: '100%',
                                    textAlign: 'center',
                                    position: 'relative'
                                }}>
                                {!utils.checkNull(productImage) ? (
                                    <Box sx={{ position: 'relative', height: '100%' }}>
                                        <img src={productImage} style={{ width: '100%', height: '100%' }} />
                                    </Box>
                                ) : (
                                    <>
                                        <Stack spacing={1} paddingTop={2}>
                                            <Box>
                                                <InsertDriveFileIcon className="icon-size" />
                                            </Box>

                                            <Box>
                                                <CloudDoneIcon
                                                    style={{
                                                        paddingRight: '5px',
                                                        color: 'var(--color-main)'
                                                    }}
                                                />
                                                <Link underline="always" fontSize={'13px'}>
                                                    Tải ảnh lên
                                                </Link>
                                            </Box>
                                            <Typography variant="caption">File định dạng jpeg, png</Typography>
                                        </Stack>
                                    </>
                                )}
                                <TextField
                                    type="file"
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        opacity: 0,
                                        '& input': {
                                            height: '100%'
                                        },
                                        '& div': {
                                            height: '100%'
                                        }
                                    }}
                                    onChange={choseImage}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8}>
                            <Stack spacing={2}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    placeholder="Mã tự động"
                                    value={product.maHangHoa}
                                    error={errMaHangHoa && wasClickSave}
                                    label={`Mã ${product.tenLoaiHangHoa?.toLocaleLowerCase()}`}
                                    helperText={
                                        errMaHangHoa && wasClickSave
                                            ? `Mã ${product.tenLoaiHangHoa?.toLocaleLowerCase()} đã tồn tại`
                                            : ''
                                    }
                                    onChange={(event) => {
                                        setProduct((itemOlds) => {
                                            return {
                                                ...itemOlds,
                                                maHangHoa: event.target.value
                                            };
                                        });
                                        setWasClickSave(false);
                                    }}
                                />
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    autoFocus
                                    label={
                                        <Typography variant="body2">
                                            Tên {product.tenLoaiHangHoa?.toLocaleLowerCase()}
                                            <span className="text-danger"> *</span>
                                        </Typography>
                                    }
                                    error={wasClickSave && errTenHangHoa}
                                    helperText={
                                        wasClickSave && errTenHangHoa
                                            ? `Vui lòng nhập tên ${product.tenLoaiHangHoa?.toLocaleLowerCase()}`
                                            : ''
                                    }
                                    value={product.tenHangHoa}
                                    onChange={(event) => {
                                        setProduct((itemOlds) => {
                                            return {
                                                ...itemOlds,
                                                tenHangHoa: event.target.value
                                            };
                                        });
                                        setErrTenHangHoa(false);
                                        setWasClickSave(false);
                                    }}
                                />
                                <Stack direction={'row'} spacing={1}>
                                    <Autocomplete
                                        size="small"
                                        fullWidth
                                        disablePortal
                                        value={nhomChosed}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        options={nhomHangHoaStore?.listAllNhomHang?.filter(
                                            (x) => x.id !== null && x.id !== ''
                                        )}
                                        onChange={(event, newValue) => handleChangeNhom(newValue)}
                                        getOptionLabel={(option: any) => (option.tenNhomHang ? option.tenNhomHang : '')}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={`Nhóm ${product.tenLoaiHangHoa?.toLocaleLowerCase()}`}
                                            />
                                        )}
                                        renderOption={(props, item) => (
                                            <Box component={'li'} {...props} className="autocomplete-option">
                                                {item.tenNhomHang}
                                            </Box>
                                        )}
                                    />
                                    <Add
                                        titleAccess="Thêm nhóm"
                                        sx={{
                                            width: 36,
                                            display: abpCustom.isGrandPermission('Pages.DM_NhomHangHoa.Create')
                                                ? ''
                                                : 'none',
                                            height: 36,
                                            padding: 0.5,
                                            border: '1px solid #ccc',
                                            borderRadius: '4px'
                                        }}
                                        onClick={() => showModalAddNhomHang()}
                                    />
                                </Stack>
                                <NumericFormat
                                    size="small"
                                    fullWidth
                                    label="Giá bán"
                                    value={product.giaBan}
                                    thousandSeparator={'.'}
                                    decimalSeparator={','}
                                    customInput={TextField}
                                    onChange={(event) => editGiaBan(event)}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={0} sm={4} md={4} lg={4}></Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8} paddingTop={2} pl={{ sm: 0, md: 0.5 }}>
                            <TextField
                                variant="outlined"
                                size="small"
                                fullWidth
                                label="Số phút thực hiện"
                                placeholder="0"
                                type="number"
                                value={product.soPhutThucHien}
                                onChange={(event) =>
                                    setProduct((itemOlds) => {
                                        return {
                                            ...itemOlds,
                                            soPhutThucHien: event.target.value
                                        };
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={0} sm={4} md={4} lg={4}></Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8} paddingTop={2} pl={{ sm: 0, md: 0.5 }}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                multiline
                                rows="2"
                                label="Ghi chú"
                                value={product?.moTa ?? ''}
                                onChange={(event) =>
                                    setProduct((itemOlds) => {
                                        return {
                                            ...itemOlds,
                                            moTa: event.target.value
                                        };
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid item xs={12} sm={12} md={12} lg={12} style={{ display: 'none' }}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={product.laHangHoa}
                                                onChange={(event) => {
                                                    setProduct((olds: ModelHangHoaDto) => {
                                                        return {
                                                            ...olds,
                                                            laHangHoa: event.target.checked,
                                                            idLoaiHangHoa: event.target.checked ? 2 : 1,
                                                            tenLoaiHangHoa: event.target.checked
                                                                ? 'hàng hóa'
                                                                : 'dịch vụ'
                                                        };
                                                    });
                                                }}
                                                sx={{
                                                    color: '#7C3367',
                                                    '&.Mui-checked': {
                                                        color: '#7C3367'
                                                    }
                                                }}
                                            />
                                        }
                                        label="Là hàng hóa"
                                    />
                                </FormGroup>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions style={{ paddingBottom: '20px' }}>
                    <Button
                        variant="outlined"
                        sx={{ color: 'var(--color-main)' }}
                        onClick={() => setOpen(false)}
                        className="btn-outline-hover">
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: '#633434',
                            display:
                                !abpCustom.isGrandPermission('Pages.DM_HangHoa.Restore') || product.trangThai === 1
                                    ? 'none'
                                    : ''
                        }}
                        onClick={() => {
                            setInforDeleteProduct(
                                new PropConfirmOKCancel({
                                    show: true,
                                    title: 'Khôi phục ' + product?.tenLoaiHangHoa?.toLocaleLowerCase(),
                                    mes: `Bạn có chắc chắn muốn khôi phục ${product?.tenLoaiHangHoa?.toLocaleLowerCase()} ${
                                        product.tenHangHoa
                                    }   không?`
                                })
                            );
                            setActionProduct(TypeAction.RESTORE);
                        }}>
                        Khôi phục
                    </Button>
                    {!(product.trangThai === 0 || isNew) && !wasClickSave && (
                        <Button
                            variant="outlined"
                            sx={{ display: abpCustom.isGrandPermission('Pages.DM_HangHoa.Delete') ? '' : 'none' }}
                            color="error"
                            onClick={() => {
                                setInforDeleteProduct(
                                    new PropConfirmOKCancel({
                                        show: true,
                                        title: 'Xác nhận xóa',
                                        mes: `Bạn có chắc chắn muốn xóa ${product.tenHangHoa}  ${
                                            product?.tenLoaiHangHoa ?? ' '
                                        } không?`
                                    })
                                );
                                setActionProduct(TypeAction.DELETE);
                            }}>
                            Xóa
                        </Button>
                    )}

                    {product.trangThai !== 0 && (
                        <>
                            {!wasClickSave && (
                                <Button
                                    variant="contained"
                                    sx={{ bgcolor: '#7C3367' }}
                                    onClick={saveProduct}
                                    className="btn-container-hover">
                                    Lưu
                                </Button>
                            )}
                            {wasClickSave && (
                                <Button variant="contained" sx={{ bgcolor: '#7C3367' }} className="btn-container-hover">
                                    Đang lưu
                                </Button>
                            )}
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};
export default observer(ModalHangHoa);
