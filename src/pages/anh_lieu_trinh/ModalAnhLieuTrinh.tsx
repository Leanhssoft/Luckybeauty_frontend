import {
    Stack,
    Typography,
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid
} from '@mui/material';
import FileUploadSharpIcon from '@mui/icons-material/FileUploadSharp';
import { CloseOutlined } from '@mui/icons-material';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { IPropModal } from '../../services/dto/IPropsComponent';
import { AnhLieuTrinhChiTietDto, AnhLieuTrinhDto } from '../../services/anh_lieu_trinh/AnhLieuTrinhDto';
import utils from '../../utils/utils';
import DialogButtonClose from '../../components/Dialog/ButtonClose';
import AnhLieuTrinhService from '../../services/anh_lieu_trinh/AnhLieuTrinhService';
import { useEffect, useState } from 'react';
import ImgurAPI from '../../services/ImgurAPI/ImgurAPI';
import { TypeAction } from '../../lib/appconst';
import { Guid } from 'guid-typescript';
import Cookies from 'js-cookie';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';

export default function ModalAnhLieuTrinh(props: IPropModal<AnhLieuTrinhDto>) {
    const { isShowModal, idUpdate, objUpDate, onClose, onOK } = props;
    const tenantName = Cookies.get('TenantName') ?? 'HOST';
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lstImage, setLstImage] = useState<AnhLieuTrinhChiTietDto[]>([]);
    const [lstFileImage, setLstFileImage] = useState<File[]>([]);
    const [imgur_albumId, setImgur_albumId] = useState('');
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [albumName, setAlbumName] = useState('');

    useEffect(() => {
        ResetData();
        GetInforImage_ofAnhLieuTrinh();

        if (!utils.checkNull(idUpdate)) {
            GetAllImage_inAlbum();
            setAlbumName(objUpDate?.albumName ?? '');
        } else {
            setAlbumName('');
        }
    }, [isShowModal]);

    const ResetData = () => {
        setIsSubmitting(false);
        setLstFileImage([]);
        setLstImage([]);
    };
    const GetAllImage_inAlbum = async () => {
        const data = await AnhLieuTrinhService.GetAllImage_inAlbum(idUpdate ?? '');

        const imgur_LstImg: AnhLieuTrinhChiTietDto[] = [];
        if (data != null) {
            for (let i = 0; i < data?.length; i++) {
                const url = data[i]?.imageUrl;
                const pathImg = ImgurAPI.GetInforImage_fromDataImage(url);
                const imgur_dataImg = await ImgurAPI.GetFile_fromId(pathImg?.id);
                if (imgur_dataImg != null) {
                    data[i].imgur_ImageId = imgur_dataImg?.id; // lấy id from imgur
                    data[i].imgur_ImageLink = imgur_dataImg?.link;
                    imgur_LstImg.push(data[i]);
                }
            }
            setLstImage(imgur_LstImg);
        }
    };

    const GetInforImage_ofAnhLieuTrinh = async () => {
        const dataImage = await AnhLieuTrinhService.GetInforImage_OfAnyAnhLieuTrinh();
        const dataSubAlbum = ImgurAPI.GetInforSubAlbum_fromDataImage(dataImage);
        setImgur_albumId(dataSubAlbum?.id);

        if (utils.checkNull(dataSubAlbum?.id)) {
            const albumId = await ImgurAPI.FindAlbumIdExists_InImgur(`${tenantName}_AnhLieuTrinh`);
            setImgur_albumId(albumId);
        }
    };
    const choseImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const images = e.target.files;
        if (images && images?.length > 0) {
            const arrNew: AnhLieuTrinhChiTietDto[] = [];
            const arrFile: File[] = [];
            for (let i = 0; i < images?.length; i++) {
                const file: File = images[i];
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    const newImg = {
                        id: Guid.EMPTY,
                        imgur_ImageLink: reader.result?.toString(),
                        imageIndex: i + 1
                    } as AnhLieuTrinhChiTietDto;
                    arrNew.unshift(newImg);
                    setLstImage([...arrNew, ...lstImage]);
                };
                arrFile.push(file);
            }
            setLstFileImage([...arrFile, ...lstFileImage]);
        }
    };
    const RemoveImage = async (item: AnhLieuTrinhChiTietDto, indexItem: number) => {
        if (!utils.checkNull_OrEmpty(item?.imgur_ImageId)) {
            // remove image from imgur
            await ImgurAPI.RemoveImage(item?.imgur_ImageId ?? '');
        }
        if (!utils.checkNull_OrEmpty(item?.id)) {
            // remove image from DB
            await AnhLieuTrinhService.Remove_AnhLieuTrinhChiTiet(item?.id ?? '');
        }
        setLstImage(lstImage?.filter((x, index) => index !== indexItem));
    };
    const saveLstImage = async () => {
        if (utils.checkNull(albumName)) {
            setObjAlert({ ...objAlert, show: true, mes: 'Vui lòng chọn nhập tên album', type: 2 });
            return;
        }
        if (lstFileImage?.length === 0 && lstImage?.length == 0) {
            setObjAlert({ ...objAlert, show: true, mes: 'Vui lòng chọn ảnh', type: 2 });
            return;
        }

        if (isSubmitting) {
            return;
        }
        setIsSubmitting(true);

        let imgur_PathImage = '';
        let subAlbumId = imgur_albumId;
        if (lstFileImage?.length > 0) {
            if (utils.checkNull(imgur_albumId)) {
                // create subAlbum
                const subAlbum = await ImgurAPI.CreateNewAlbum(
                    `${tenantName}_AnhLieuTrinh`,
                    `#${tenantName} #${objUpDate?.idKhachHang}`
                );
                if (subAlbum != null && subAlbum?.id !== undefined) {
                    imgur_PathImage = `${subAlbum?.id}/`;
                    subAlbumId = subAlbum?.id;
                }
            } else {
                imgur_PathImage = `${imgur_albumId}/`;
            }
        }

        const albumIdDB = idUpdate;

        const arrAnhLieuTrinh: AnhLieuTrinhChiTietDto[] = [];
        const arrImageId: string[] = [];
        for (let i = 0; i < lstFileImage?.length; i++) {
            const dataImg = await ImgurAPI.UploadImage(lstFileImage[i], `#${tenantName} #AnhLieuTrinh`);
            if (dataImg !== null) {
                arrImageId.unshift(dataImg.id);

                arrAnhLieuTrinh.push({
                    id: Guid.EMPTY,
                    albumId: albumIdDB ?? '',
                    imageIndex: i + 1,
                    imageUrl: `${imgur_PathImage}${dataImg.id}`
                } as AnhLieuTrinhChiTietDto);
            }
        }

        const newAlbbum = {
            id: Guid.EMPTY,
            idKhachHang: objUpDate?.idKhachHang,
            albumName: albumName?.trim()
        } as AnhLieuTrinhDto;
        newAlbbum.lstAnhLieuTrinh = arrAnhLieuTrinh;

        if (utils.checkNull(idUpdate)) {
            await AnhLieuTrinhService.Insert_AnhLieuTrinh(newAlbbum);
        } else {
            newAlbbum.id = idUpdate ?? '';
            await AnhLieuTrinhService.Update_AnhLieuTrinh(newAlbbum);
        }

        if (arrImageId?.length > 0) {
            await ImgurAPI.AddImageToAlbum_WithImageId(subAlbumId, arrImageId.toString());
        }

        onOK(TypeAction.INSEART);
        onClose();
    };
    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Dialog open={isShowModal} maxWidth="sm" fullWidth>
                <DialogButtonClose onClose={onClose} />
                <DialogTitle className="modal-title">
                    {utils.checkNull(idUpdate) ? 'Thêm ' : 'Cập nhật '}
                    {'ảnh liệu trình'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Stack spacing={2} direction={'row'} alignItems={'center'}>
                                <Typography variant="body2" fontWeight={500}>
                                    Tên album
                                </Typography>
                                <Stack>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        variant="standard"
                                        value={albumName}
                                        onChange={(e) => setAlbumName(e.target.value)}
                                    />
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} lg={12} height={100}>
                            <Stack
                                alignItems={'center'}
                                sx={{
                                    border: '1px solid #cccc',
                                    p: 1,
                                    height: '100%',
                                    textAlign: 'center',
                                    position: 'relative'
                                }}>
                                <Stack spacing={1}>
                                    <Stack spacing={1} paddingTop={2} alignItems={'center'}>
                                        <Stack>
                                            <FileUploadSharpIcon className="icon-size" />
                                        </Stack>
                                        <Typography variant="caption">upload ảnh</Typography>
                                    </Stack>
                                </Stack>
                                <input
                                    type="file"
                                    multiple
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        opacity: 0
                                    }}
                                    onChange={choseImage}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} lg={12} minHeight={100}>
                            {lstImage?.length == 0 ? (
                                <Grid container height={'100%'}>
                                    {[1, 2, 3, 4]?.map((x) => (
                                        <Grid item xs={3} key={x} border={'1px dashed #ccc'} alignContent={'center'}>
                                            <Stack alignItems={'center'}>
                                                <AddPhotoAlternateOutlinedIcon />
                                            </Stack>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Grid container>
                                    {lstImage?.map((x, index) => (
                                        <Grid
                                            item
                                            xs={3}
                                            key={index}
                                            border={'1px dashed #ccc'}
                                            alignContent={'center'}>
                                            <Stack alignItems={'center'} position={'relative'} height={'100%'}>
                                                <img
                                                    src={x.imgur_ImageLink}
                                                    style={{ width: '100%', height: '100%' }}
                                                />
                                                <CloseOutlined
                                                    sx={{ color: 'red', position: 'absolute', top: 0, right: 0 }}
                                                    onClick={() => RemoveImage(x, index)}
                                                />
                                            </Stack>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>
                        Đóng
                    </Button>
                    {!utils.checkNull_OrEmpty(idUpdate) && (
                        <Button variant="outlined" color="error">
                            Xóa
                        </Button>
                    )}

                    {isSubmitting ? (
                        <Button variant="contained">Đang lưu</Button>
                    ) : (
                        <Button variant="contained" onClick={saveLstImage}>
                            Lưu
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}
