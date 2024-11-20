import * as React from 'react';
import { useState, useEffect } from 'react';
import './modelNhanVienThucHien.css';
import {
    Button,
    Stack,
    Typography,
    Grid,
    Box,
    TextField,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Search } from '@mui/icons-material';
import utils from '../../utils/utils';
import NhanSuItemDto from '../../services/nhan-vien/dto/nhanSuItemDto';
import NhanVienThucHienDto from '../../services/nhan_vien_thuc_hien/NhanVienThucHienDto';
import nhanVienService from '../../services/nhan-vien/nhanVienService';
import { PagedNhanSuRequestDto } from '../../services/nhan-vien/dto/PagedNhanSuRequestDto';
import BadgeFistCharOfName from '../../components/Badge/FistCharOfName';
import DialogButtonClose from '../../components/Dialog/ButtonClose';
import chietKhauDichVuService from '../../services/hoa_hong/chiet_khau_dich_vu/chietKhauDichVuService';
import DialogDraggable from '../../components/Dialog/DialogDraggable';

const ModelNhanVienThucHien = ({ triggerModal, handleSave, idChiNhanh }: any) => {
    const [isShow, setIsShow] = useState(false);
    const [txtSearch, setTxtSearch] = useState('');
    const [lstNhanVien, setLstNhanVien] = useState<NhanSuItemDto[]>([]);
    const [allNhanVien, setAllNhanVien] = useState<NhanSuItemDto[]>([]);
    const [lstNVThucHien, setLstNhanVienChosed] = useState<NhanVienThucHienDto[]>([]);

    useEffect(() => {
        if (triggerModal.isShow) {
            setIsShow(true);
            if (triggerModal.isNew) {
                // get from cthd cache
                setLstNhanVienChosed([...triggerModal.item.nhanVienThucHien]);
            } else {
                // get from db
                GetListNVThucHien_DichVu();
            }
            updateNVChosed_ToListNhanVien();
        }
    }, [triggerModal?.id, triggerModal?.show]);
    const handleClose = () => {
        setIsShow(false);
    };
    const GetListNVThucHien_DichVu = () => {
        return null;
    };

    const updateNVChosed_ToListNhanVien = () => {
        const arrNV: any = [...allNhanVien];
        arrNV.map((x: any) => {
            x['isChosed'] = false;
            x['ptChietKhau'] = 0; // chỉ có mục đích hiển thị
            x['tienChietKhau'] = 0;
        });
        if (triggerModal?.item?.nhanVienThucHien?.length > 0) {
            for (let i = 0; i < arrNV.length; i++) {
                const itemNV = triggerModal?.item?.nhanVienThucHien?.filter((x: any) => x.idNhanVien === arrNV[i].id);
                if (itemNV.length > 0) {
                    arrNV[i].isChosed = true;
                    arrNV[i].ptChietKhau = itemNV[0].ptChietKhau;
                    arrNV[i].tienChietKhau = itemNV[0].tienChietKhau;
                }
            }
        }

        setLstNhanVien([...arrNV]);
    };

    const GetListNhanVien = async () => {
        const data = await nhanVienService.getAll({
            filter: txtSearch,
            skipCount: 0,
            maxResultCount: 100
        } as PagedNhanSuRequestDto);
        const arrNV = [...data.items];

        setAllNhanVien([...arrNV]);
        setLstNhanVien([...arrNV]);
    };

    React.useEffect(() => {
        GetListNhanVien();
    }, []);

    const SearchNhanVienClient = () => {
        if (!utils.checkNull(txtSearch)) {
            const txt = txtSearch.trim().toLowerCase();
            const txtUnsign = utils.strToEnglish(txt);
            setLstNhanVien(
                lstNhanVien.filter(
                    (x) =>
                        (x.maNhanVien !== null && x.maNhanVien.trim().toLowerCase().indexOf(txt) > -1) ||
                        (x.tenNhanVien !== null && x.tenNhanVien.trim().toLowerCase().indexOf(txt) > -1) ||
                        (x.soDienThoai !== null && x.soDienThoai.trim().toLowerCase().indexOf(txt) > -1) ||
                        (x.maNhanVien !== null && utils.strToEnglish(x.maNhanVien).indexOf(txtUnsign) > -1) ||
                        (x.tenNhanVien !== null && utils.strToEnglish(x.tenNhanVien).indexOf(txtUnsign) > -1) ||
                        (x.soDienThoai !== null && utils.strToEnglish(x.soDienThoai).indexOf(txtUnsign) > -1)
                )
            );
        } else {
            updateNVChosed_ToListNhanVien();
        }
    };

    React.useEffect(() => {
        SearchNhanVienClient();
    }, [txtSearch]);

    const ChoseNhanVien = async (item: NhanSuItemDto) => {
        const hoahongDV = await chietKhauDichVuService.GetHoaHongNV_theoDichVu(
            item.id,
            triggerModal.item.idDonViQuyDoi,
            idChiNhanh
        );

        const newNV = new NhanVienThucHienDto({
            idNhanVien: item.id,
            maNhanVien: item.maNhanVien,
            tenNhanVien: item.tenNhanVien,
            soDienThoai: item.soDienThoai,
            gioiTinh: item.gioiTinh,
            avatar: item.avatar
        });
        if (hoahongDV.length > 0) {
            newNV.ptChietKhau = hoahongDV[0].laPhanTram ? hoahongDV[0].giaTri : 0;
            newNV.chietKhauMacDinh = hoahongDV[0].giaTri;
            if (newNV.ptChietKhau > 0) {
                newNV.tienChietKhau = (newNV.ptChietKhau * triggerModal.item.thanhTienSauCK) / 100;
            } else {
                newNV.tienChietKhau = hoahongDV[0].giaTri * triggerModal.item.soLuong;
            }
        }

        // check exists
        const nvEX = lstNVThucHien.filter((x) => x.idNhanVien === newNV.idNhanVien);
        if (nvEX.length > 0) {
            // remove if chose again
            setLstNhanVienChosed(lstNVThucHien.filter((x) => x.idNhanVien !== newNV.idNhanVien));
        } else {
            setLstNhanVienChosed([newNV, ...lstNVThucHien]);
        }

        const isChosedAgain = nvEX.length > 0;
        setLstNhanVien(
            lstNhanVien.map((x: any) => {
                if (x.id === item.id) {
                    return {
                        ...x,
                        isChosed: !isChosedAgain,
                        ptChietKhau: newNV?.ptChietKhau,
                        tienChietKhau: newNV?.tienChietKhau
                    };
                } else {
                    return { ...x };
                }
            })
        );
    };

    // useEffect(() => {
    //     UpdateStatus();
    //     console.log('into');
    // }, [nvCurrentChosed]);

    const onSave = () => {
        setIsShow(false);
        handleSave(lstNVThucHien);
    };

    return (
        <>
            <Dialog
                open={isShow}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
                aria-labelledby="dialogIdTitle"
                //PaperComponent={DialogDraggable}
            >
                <DialogTitle>
                    <Typography className="modal-title" id="dialogIdTitle">
                        Chọn kỹ thuật viên
                    </Typography>
                    <DialogButtonClose onClose={() => setIsShow(false)} />
                </DialogTitle>
                <DialogContent>
                    <TextField
                        size="small"
                        sx={{
                            width: '375px'
                        }}
                        type="search"
                        placeholder="Tìm kiếm"
                        value={txtSearch}
                        onChange={(event) => {
                            setTxtSearch(event.target.value);
                        }}
                        InputProps={{
                            startAdornment: <Search />
                        }}
                    />
                    <Typography
                        variant="subtitle1"
                        fontWeight="700"
                        color="#999699"
                        marginTop="20px"
                        marginBottom={'8px'}>
                        Danh sách kỹ thuật viên
                    </Typography>

                    <Grid container spacing={2} id="idContainer">
                        {lstNhanVien?.map((person: any, index: any) => (
                            <Grid
                                className="person-item"
                                item
                                xs={12}
                                md={4}
                                lg={4}
                                key={index}
                                onClick={() => ChoseNhanVien(person)}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        position: 'relative',
                                        padding: '20px 12px',
                                        borderRadius: '8px',
                                        transition: '.2s',
                                        cursor: 'pointer',
                                        border: '1px solid #CDC9CD',
                                        borderColor: person.isChosed ? 'var(--color-main)' : '',

                                        '&:hover': {
                                            borderColor: 'var(--color-main)'
                                        },
                                        '& .Check-icon': {
                                            position: 'absolute',
                                            right: '-10px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            top: '-5px',
                                            zIndex: '2',
                                            transition: '.2s',
                                            opacity: person.isChosed ? '1' : '0'
                                        }
                                    }}>
                                    <Box
                                        bgcolor="#fff"
                                        className="Check-icon"
                                        sx={{
                                            '& svg': {
                                                verticalAlign: 'unset'
                                            }
                                        }}>
                                        <CheckCircleIcon sx={{ color: 'var(--color-main)' }} />
                                    </Box>
                                    <div className="person-avatar">
                                        {utils.checkNull(person?.avatar) ? (
                                            <BadgeFistCharOfName
                                                firstChar={utils.getFirstLetter(person?.tenNhanVien ?? '')}
                                            />
                                        ) : (
                                            <Avatar sx={{ width: 40, height: 40 }} src={person?.avatar} />
                                        )}
                                    </div>
                                    <Stack maxWidth="calc(100% - 50px)" minWidth={'calc(100% - 50px)'}>
                                        <Typography
                                            title={person.tenNhanVien}
                                            variant="subtitle2"
                                            className="lableOverflow">
                                            {person.tenNhanVien}
                                        </Typography>
                                        <Stack direction={'row'} justifyContent={'space-between'}>
                                            <Typography
                                                variant="caption"
                                                className="person-position"
                                                color={'var(--color-text-secondary)'}>
                                                {person.tenChucVu}
                                            </Typography>
                                            {person.isChosed && (
                                                <Typography
                                                    variant="caption"
                                                    color={'#8d8b8b'}
                                                    sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                                                    onClick={(event) => {
                                                        event.stopPropagation(); // dừng không cho gọi đến sự kiện click của parent
                                                    }}>
                                                    {person?.ptChietKhau > 0
                                                        ? `${person?.ptChietKhau} %`
                                                        : new Intl.NumberFormat('vi-VN').format(
                                                              person?.tienChietKhau ?? 0
                                                          )}
                                                </Typography>
                                            )}
                                        </Stack>
                                    </Stack>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            background: '#fff',
                            justifyContent: 'center',
                            position: 'sticky',
                            bottom: '0',
                            left: '0',
                            paddingTop: '30px'
                        }}>
                        <Button
                            variant="outlined"
                            sx={{
                                borderColor: '#e6e1e6',
                                textTransform: 'capitalize'
                            }}
                            className=" btn-outline-hover"
                            onClick={() => setIsShow(false)}>
                            Hủy
                        </Button>
                        <Button
                            variant="contained"
                            className="btn-container-hover"
                            sx={{
                                background: '#7c3367',
                                textTransform: 'capitalize',
                                color: '#fff'
                            }}
                            onClick={onSave}>
                            Lưu
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
};
export default ModelNhanVienThucHien;
