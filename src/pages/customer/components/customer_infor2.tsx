import { Grid, Stack, Avatar, Typography, Button, Tab } from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabCuocHen from './TabCuocHen';
import TabMuaHang from './TabMuaHang';
import utils from '../../../utils/utils';
import { useEffect, useState } from 'react';
import { Guid } from 'guid-typescript';
import khachHangService from '../../../services/khach-hang/khachHangService';
import { ICustomerDetail_FullInfor } from '../../../services/khach-hang/dto/KhachHangDto';
import { HoatDongKhachHang } from '../../../services/khach-hang/dto/ThongTinKhachHangTongHopDto';
import { format } from 'date-fns';
import CreateOrEditCustomerDialog from '../components/create-or-edit-customer-modal';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import { PropConfirmOKCancel } from '../../../utils/PropParentToChild';
import { CreateOrEditKhachHangDto } from '../../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import uploadFileService from '../../../services/uploadFileService';
import TabAnhLieuTrinh from './TabAnhLieuTrinh';

export interface IScreenCustomerInfor {
    khachHangId?: string;
    onClose: () => void;
}

const CustomerInfor2 = ({ khachHangId, onClose }: IScreenCustomerInfor) => {
    const [tabActive, setTabActive] = useState('1');
    const [isShowEditKhachHang, setIsShowEditKhachHang] = useState(false);
    const [cusEdit, setCusEdit] = useState<ICustomerDetail_FullInfor>({} as ICustomerDetail_FullInfor);
    const [nkyHoatDong, setNKyHoatDong] = useState<HoatDongKhachHang[]>([]);
    const [objAlert, setObjAlert] = useState({ show: false, mes: '', type: 1 });
    const [objDelete, setObjDelete] = useState<PropConfirmOKCancel>(new PropConfirmOKCancel({ show: false }));

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setTabActive(newValue);
    };

    useEffect(() => {
        getNhatKyHoatDong();
        getKhachHangInfo();
    }, [khachHangId]);

    const getNhatKyHoatDong = async () => {
        const data = await khachHangService.GetNhatKyHoatDong_ofKhachHang(khachHangId ?? Guid.EMPTY);
        setNKyHoatDong(data);
    };

    const getKhachHangInfo = async () => {
        const data = await khachHangService.getDetail(khachHangId ?? Guid.EMPTY);
        setCusEdit({
            ...cusEdit,
            id: data.id,
            maKhachHang: data?.maKhachHang as string,
            tenKhachHang: data?.tenKhachHang as string,
            soDienThoai: data?.soDienThoai as string,
            ngaySinh: data?.ngaySinh as Date,
            diaChi: data?.diaChi as string,
            idNhomKhach: data?.idNhomKhach as string,
            avatar: data?.avatar,
            tenNhomKhach: data?.tenNhomKhach,
            cuocHenGanNhat: data?.cuocHenGanNhat,
            soLanBooking: data?.soLanBooking,
            tongChiTieu: data?.tongChiTieu,
            conNo: data?.conNo
        });
    };

    const onShowModalEditCustomer = async () => {
        setIsShowEditKhachHang(true);
    };

    const gotoBack = () => {
        // window.location.replace('/khach-hangs');
        onClose();
    };

    const onDeleteCustomer = async () => {
        await khachHangService.delete(khachHangId ?? Guid.EMPTY);
        setObjDelete({ ...objDelete, show: false });
        setObjAlert({ ...objAlert, show: true, mes: 'Xóa khách hàng thành công' });
        gotoBack();
    };

    const onSaveEditCustomer = async () => {
        await getKhachHangInfo();
        setIsShowEditKhachHang(false);
    };

    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <ConfirmDelete
                title={objDelete.title}
                mes={objDelete.mes}
                isShow={objDelete.show}
                onOk={onDeleteCustomer}
                onCancel={() => setObjDelete({ ...objDelete, show: false })}></ConfirmDelete>
            <CreateOrEditCustomerDialog
                visible={isShowEditKhachHang}
                onCancel={() => {
                    setIsShowEditKhachHang(!isShowEditKhachHang);
                }}
                onOk={onSaveEditCustomer}
                title={'Cập nhật thông tin khách hàng'}
                formRef={
                    {
                        id: khachHangId,
                        maKhachHang: cusEdit?.maKhachHang,
                        tenKhachHang: cusEdit?.tenKhachHang,
                        soDienThoai: cusEdit?.soDienThoai,
                        ngaySinh: cusEdit?.ngaySinh,
                        diaChi: cusEdit?.diaChi ?? '',
                        gioiTinhNam: cusEdit?.gioiTinhNam ?? false,
                        moTa: cusEdit?.moTa ?? '',
                        idNhomKhach: cusEdit?.idNhomKhach,
                        idNguonKhach: cusEdit?.idNguonKhach,
                        avatar: cusEdit?.avatar,
                        idLoaiKhach: cusEdit?.idLoaiKhach
                    } as CreateOrEditKhachHangDto
                }
            />
            <Grid container paddingTop={2} spacing={1}>
                <Grid item xs={12} md={4} lg={4} sx={{ position: 'relative' }}>
                    <Stack
                        padding={2}
                        spacing={2}
                        className="page-full"
                        sx={{ border: '1px solid #cccc', borderRadius: '4px' }}>
                        <Stack sx={{ position: 'relative' }}>
                            <Stack direction={'row'} spacing={1.5} alignItems={'center'}>
                                <Stack position={'relative'}>
                                    {cusEdit?.avatar ? (
                                        <Stack
                                            sx={{
                                                '& img': {
                                                    maxWidth: '100%',
                                                    maxHeight: '100%',
                                                    height: '60px',
                                                    width: '60px',
                                                    objectFit: 'cover',
                                                    borderRadius: '6px'
                                                }
                                            }}>
                                            <img
                                                src={uploadFileService.GoogleApi_NewLink(cusEdit?.avatar)}
                                                alt="avatar"
                                            />
                                        </Stack>
                                    ) : (
                                        <Avatar
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                backgroundColor: 'var(--color-bg)',
                                                color: 'var(--color-main)',
                                                fontSize: '18px'
                                            }}>
                                            {utils.getFirstLetter(cusEdit?.tenKhachHang, 3)}
                                        </Avatar>
                                    )}
                                </Stack>
                                <Stack sx={{ position: 'relative' }}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
                                        {cusEdit?.tenKhachHang}
                                    </Typography>
                                    <Typography variant="caption" color={'#b2b7bb'}>
                                        {cusEdit?.maKhachHang}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>

                        <Stack sx={{ borderBottom: '1px solid #cccc' }}>
                            <Grid container spacing={1.5} paddingBottom={2}>
                                <Grid item xs={5} lg={4}>
                                    <Typography variant="body2" fontWeight={600}>
                                        Điện thoại
                                    </Typography>
                                </Grid>
                                <Grid item xs={7} lg={8}>
                                    <Typography variant="body2">{cusEdit?.soDienThoai}</Typography>
                                </Grid>
                                <Grid item xs={5} lg={4}>
                                    <Typography variant="body2" fontWeight={600}>
                                        Ngày sinh
                                    </Typography>
                                </Grid>
                                <Grid item xs={7} lg={8}>
                                    <Typography variant="body2">
                                        {!utils.checkNull(cusEdit?.ngaySinh as unknown as string)
                                            ? format(new Date(cusEdit?.ngaySinh as unknown as string), 'dd/MM/yyyy')
                                            : ''}
                                    </Typography>
                                </Grid>
                                <Grid item xs={5} lg={4}>
                                    <Typography variant="body2" fontWeight={600}>
                                        Địa chỉ
                                    </Typography>
                                </Grid>
                                <Grid item xs={7} lg={8}>
                                    <Typography variant="body2"> {cusEdit?.diaChi}</Typography>
                                </Grid>
                                <Grid item xs={5} lg={4}>
                                    <Typography variant="body2" fontWeight={600}>
                                        Nhóm khách
                                    </Typography>
                                </Grid>
                                <Grid item xs={7} lg={8}>
                                    <Typography variant="body2">{cusEdit?.tenNhomKhach}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1} direction={'row'} justifyContent={'center'}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            sx={{ borderRadius: '12px', flex: 8 }}
                                            onClick={onShowModalEditCustomer}>
                                            Thay đổi thông tin
                                        </Button>
                                        {/* <DeleteOutlinedIcon
                                            titleAccess="Xóa khách hàng"
                                            sx={{ color: '#b75151' }}
                                            onClick={() => {
                                                setObjDelete({
                                                    ...objDelete,
                                                    show: true,
                                                    title: 'Thông báo xóa',
                                                    mes: 'Bạn có chắc chắn muốn xóa khách hàng này không?'
                                                });
                                            }}
                                        /> */}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Stack>
                        <Stack sx={{ borderBottom: '1px solid #cccc' }} paddingBottom={2}>
                            <Stack spacing={2}>
                                <Stack justifyContent={'space-between'} direction={'row'}>
                                    <Typography variant="body2">Cuộc hẹn gần nhất</Typography>

                                    <Typography variant="body2">
                                        {!utils.checkNull(cusEdit?.cuocHenGanNhat as unknown as string)
                                            ? format(
                                                  new Date(cusEdit?.cuocHenGanNhat as unknown as string),
                                                  'dd/MM/yyyy'
                                              )
                                            : ''}
                                    </Typography>
                                </Stack>
                                <Stack>
                                    <Stack justifyContent={'space-between'} direction={'row'}>
                                        <Stack alignItems={'center'}>
                                            <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
                                                {cusEdit?.soLanBooking}
                                            </Typography>
                                            <Typography variant="caption">Cuộc hẹn</Typography>
                                        </Stack>
                                        <Stack alignItems={'center'}>
                                            <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
                                                {utils.formatNumber(cusEdit?.tongChiTieu ?? 0)}
                                            </Typography>
                                            <Typography variant="caption">Chi tiêu</Typography>
                                        </Stack>
                                        <Stack alignItems={'center'}>
                                            <Typography
                                                sx={{
                                                    fontSize: '18px',
                                                    fontWeight: 600,
                                                    color:
                                                        (cusEdit?.conNo ?? 0) > 0 ? '#b75151' : 'var(--font-color-main)'
                                                }}>
                                                {utils.formatNumber(cusEdit?.conNo ?? 0)}
                                            </Typography>
                                            <Typography variant="caption">Còn nợ</Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>

                        <Stack>
                            <Stack spacing={2}>
                                <Typography variant="body2" fontWeight={600} textAlign={'center'}>
                                    Nhật ký hoạt động
                                </Typography>
                                <Stack
                                    spacing={1.5}
                                    // 70vh - 335px: 335 là chiều cao các phần (thông tin khách + thông tin cuộc hẹn)
                                    // 70vh là chiều cao max của phần bên trái
                                    sx={{ overflow: 'auto', maxHeight: 'calc(70vh - 335px)', paddingBottom: '16px' }}>
                                    {nkyHoatDong?.map((item, index) => (
                                        <Stack key={index} spacing={0.5}>
                                            <Typography
                                                variant="body2"
                                                dangerouslySetInnerHTML={{ __html: item?.hoatDong }}></Typography>
                                            <Typography variant="caption" color={'#978686'}>
                                                {format(new Date(item?.thoiGian), 'dd/MM/yyyy HH:mm')}
                                            </Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={8} lg={8}>
                    <Stack padding={2} className="page-full" sx={{ border: '1px solid #cccc', borderRadius: '4px' }}>
                        <TabContext value={tabActive}>
                            <Grid container alignItems={'center'}>
                                <Grid item lg={6}>
                                    <TabList onChange={handleChangeTab}>
                                        <Tab label="Cuộc hẹn" value="1" />
                                        <Tab label="Mua hàng" value="2" />
                                        <Tab label="Ảnh liệu trình" value="3" />
                                    </TabList>
                                </Grid>
                                <Grid item lg={6}>
                                    <Stack direction={'row'} spacing={1} justifyContent={'end'}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<ArrowBackOutlinedIcon />}
                                            onClick={gotoBack}>
                                            Quay trở lại
                                        </Button>
                                        <Button variant="outlined" startIcon={<FileUploadOutlinedIcon />}>
                                            Xuất excel
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                            <TabPanel value="1" sx={{ padding: 0 }}>
                                <TabCuocHen khachHangId={khachHangId} />
                            </TabPanel>
                            <TabPanel value="2" sx={{ padding: 0 }}>
                                <TabMuaHang khachHangId={khachHangId} />
                            </TabPanel>
                            <TabPanel value="3" sx={{ padding: 0 }}>
                                <TabAnhLieuTrinh khachHangId={khachHangId ?? ''} />
                            </TabPanel>
                        </TabContext>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
};
// export default observer(CustomerInfor2);
export default CustomerInfor2;
