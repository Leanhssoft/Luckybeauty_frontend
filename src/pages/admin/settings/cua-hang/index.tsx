import React, { ChangeEvent, Component, ReactNode } from 'react';
import { Box, Typography, Grid, TextField, Button, Stack, InputAdornment } from '@mui/material';
import AddLogoIcon from '../../../../images/add-logo.svg';
import cuaHangService from '../../../../services/cua_hang/cuaHangService';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import Cookies from 'js-cookie';
import { EditCuaHangDto } from '../../../../services/cua_hang/Dto/EditCuaHangDto';
import { enqueueSnackbar } from 'notistack';
import utils from '../../../../utils/utils';
import uploadFileService from '../../../../services/uploadFileService';
import abpCustom from '../../../../components/abp-custom';
import AppConsts from '../../../../lib/appconst';
import { ReactComponent as FacebookIcon } from '../../../../images/icons/facebook.svg';
import { ReactComponent as WebsiteIcon } from '../../../../images/icons/website.svg';
import { ReactComponent as InstagramIcon } from '../../../../images/icons/instagram.svg';
import { ReactComponent as TwitterIcon } from '../../../../images/icons/twitter.svg';
import TaiKhoanNganHangServices from '../../../../services/so_quy/TaiKhoanNganHangServices';
import { TaiKhoanNganHangDto } from '../../../../services/so_quy/Dto/TaiKhoanNganHangDto';
import { ButtonNavigate } from '../../../../components/Button/ButtonNavigate';

class StoreDetail extends Component {
    state = {
        fileSelect: {} as File,
        googleDrive_fileId: '',
        isSaving: false,
        // navigate: useNavigate(),
        editCuaHang: {
            id: '',
            diaChi: '',
            facebook: '',
            ghiChu: '',
            instagram: '',
            logo: '',
            maSoThue: '',
            soDienThoai: '',
            tenCongTy: '',
            twitter: '',
            website: '',
            fileLogo: ''
        } as EditCuaHangDto,
        errors: {
            soDienThoai: '',
            tenCongTy: '',
            diaChi: '',
            maSoThue: ''
        },
        qrCode: '', // do cái này load hơi lâu, nên tách ra, để cho bankAcc load và hiển thị trước
        bankAcc: { id: '', tenChuThe: '', soTaiKhoan: '', logoNganHang: '' } as TaiKhoanNganHangDto
    };
    async getData() {
        const idChiNhanh = Cookies.get('IdChiNhanh')?.toString() ?? '';
        const cuaHang = await cuaHangService.getCongTyEdit(idChiNhanh);
        this.setState({
            editCuaHang: cuaHang,
            googleDrive_fileId: uploadFileService.GoogleApi_GetFileIdfromLink(cuaHang?.logo ?? '')
        });
        this.setState((old: any) => {
            return {
                ...old,
                editCuaHang: {
                    ...old.editCuaHang,
                    fileLogo: cuaHang.logo
                }
            };
        });
        await this.GettaiKhoanNganHang_MacDinh(idChiNhanh);
    }
    GettaiKhoanNganHang_MacDinh = async (idChiNhanh: string) => {
        const data = await TaiKhoanNganHangServices.GetDefault_TaiKhoanNganHang(idChiNhanh);
        this.setState({
            bankAcc: {
                id: data?.id,
                tenChuThe: data?.tenChuThe,
                soTaiKhoan: data?.soTaiKhoan,
                tenNganHang: data?.tenNganHang,
                logoNganHang: data?.logoNganHang
            } as TaiKhoanNganHangDto
        });
        const qrCode = await TaiKhoanNganHangServices.GetQRCode({
            tenChuThe: data?.tenChuThe,
            soTaiKhoan: data?.soTaiKhoan,
            tenNganHang: data?.tenNganHang,
            maPinNganHang: data?.maPinNganHang
        } as TaiKhoanNganHangDto);
        this.setState({
            qrCode: qrCode
        });
    };
    async componentDidMount() {
        await this.getData();
    }
    handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        this.setState({
            editCuaHang: {
                ...this.state.editCuaHang,
                [name]: value
            },
            errors: {
                ...this.state.errors,
                [name]: '' // Clear the error for this field
            }
        });
    };

    handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.closeImage();
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const fileLogo = URL.createObjectURL(file);

            this.setState({
                editCuaHang: {
                    ...this.state.editCuaHang,
                    fileLogo: fileLogo
                },
                fileSelect: file
            });
        }
    };
    closeImage = async () => {
        if (!utils.checkNull(this.state.googleDrive_fileId)) {
            await uploadFileService.GoogleApi_RemoveFile_byId(this.state.googleDrive_fileId);
        }
        this.setState((prev) => {
            return {
                ...prev,
                googleDrive_fileId: '',
                fileLogo: ''
            };
        });
    };
    validatePhoneNumber = (phoneNumber: string) => {
        return AppConsts.phoneRegex.test(phoneNumber);
    };
    validateMaSoThue = (maSoThue: string) => {
        return maSoThue.length === 10 || maSoThue.length === 13;
    };
    handSubmit = async () => {
        const { soDienThoai, tenCongTy, diaChi, maSoThue } = this.state.editCuaHang;
        if (!soDienThoai || !tenCongTy || !diaChi || !maSoThue) {
            this.setState({
                errors: {
                    soDienThoai: !soDienThoai ? 'Số điện thoại là trường bắt buộc' : '',
                    tenCongTy: !tenCongTy ? 'Tên cửa hàng là trường bắt buộc' : '',
                    diaChi: !diaChi ? 'Địa chỉ là trường bắt buộc' : '',
                    maSoThue: !maSoThue ? 'Mã số thuế là trường bắt buộc' : ''
                }
            });
            this.setState({ isSaving: false });
            return;
        }

        if (this.validatePhoneNumber(soDienThoai) == false) {
            this.setState({
                errors: {
                    ...this.state.errors,
                    soDienThoai: 'Số điện thoại không hợp lệ'
                }
            });
            this.setState({ isSaving: false });
            return;
        }

        if (this.validateMaSoThue(maSoThue) == false) {
            this.setState({
                errors: {
                    ...this.state.errors,
                    maSoThue: 'Mã số thuế phải có độ dài 10 hoặc 13 số'
                }
            });
            this.setState({ isSaving: false });
            return;
        }
        let fileId = this.state.googleDrive_fileId;
        const fileSelect = this.state.fileSelect;
        if (!utils.checkNull(this.state.editCuaHang.fileLogo)) {
            // nếu cập nhật: chỉ upload nếu chọn lại ảnh
            if (
                utils.checkNull(this.state.editCuaHang.id) ||
                (!utils.checkNull(this.state.editCuaHang.id) &&
                    !utils.checkNull(this.state.editCuaHang.logo) &&
                    utils.checkNull(this.state.googleDrive_fileId)) ||
                utils.checkNull(this.state.editCuaHang.logo)
            ) {
                // awlay insert: because image was delete before save
                fileId = await uploadFileService.GoogleApi_UploaFileToDrive(fileSelect, 'Logo');
            }
        }
        this.setState({ isSaving: true });
        //if (this.state.isSaving === false) return;
        // gán lại image theo id mới
        const dataSave = this.state.editCuaHang;
        dataSave.logo = fileId !== '' ? `https://drive.google.com/uc?export=view&id=${fileId}` : '';
        const result = await cuaHangService.Update(dataSave);
        result != null
            ? enqueueSnackbar('Cập nhật thông tin thành công', {
                  variant: 'success',
                  autoHideDuration: 3000
              })
            : enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại sau!', {
                  variant: 'error',
                  autoHideDuration: 3000
              });
        this.setState({
            isSaving: false,
            errors: {
                soDienThoai: '',
                tenCongTy: '',
                diaChi: '',
                maSoThue: ''
            }
        });
    };

    render(): ReactNode {
        const { editCuaHang } = this.state;

        return (
            <Box gap={4} paddingTop={2} borderRadius="8px" sx={{ backgroundColor: '#fff' }}>
                <Box className="page-full">
                    <Grid container>
                        <Grid item xs={12} md={12} sm={12}>
                            <Stack
                                marginBottom={'16px'}
                                direction={'row'}
                                justifyContent={'space-between'}
                                paddingLeft={2}
                                alignItems={'center'}>
                                <span className="page-title">Chi tiết cửa hàng</span>
                                <Stack pr={2}>
                                    {abpCustom.isGrandPermission('Pages.ChietKhauHoaDon.Create') ? (
                                        this.state.isSaving ? (
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    width: 'fit-content',
                                                    minWidth: 'unset',
                                                    textTransform: 'unset',
                                                    fontSize: '14px',
                                                    height: '40px',
                                                    fontWeight: '400',
                                                    ml: 'auto'
                                                }}
                                                className="btn-container-hover">
                                                Đang lưu
                                            </Button>
                                        ) : (
                                            <Stack direction={'row'} spacing={1}>
                                                <ButtonNavigate
                                                    navigateTo="/settings"
                                                    title="Trở về cài đặt"
                                                    btnText={window.screen.width > 768 ? 'Trở về cài đặt' : ''}
                                                />
                                                <Button
                                                    variant="contained"
                                                    onClick={this.handSubmit}
                                                    startIcon={<CheckOutlinedIcon />}
                                                    sx={{
                                                        width: 'fit-content',
                                                        minWidth: 'unset',
                                                        textTransform: 'unset',
                                                        fontSize: '14px',
                                                        height: '40px',
                                                        fontWeight: '400',
                                                        ml: 'auto'
                                                    }}
                                                    className="btn-container-hover">
                                                    Cập nhật
                                                </Button>
                                            </Stack>
                                        )
                                    ) : null}
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} padding={2}>
                        <Grid item xs={12} sm={4}>
                            <Box padding="20px" border="1px solid #E6E1E6" borderRadius="8px">
                                <Typography variant="body1" fontSize="14px" fontWeight="500">
                                    Logo cửa hàng
                                </Typography>
                                <Box position="relative" sx={{ textAlign: 'center', mt: '20px' }}>
                                    {editCuaHang.fileLogo ? (
                                        <img
                                            src={editCuaHang?.fileLogo}
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                objectFit: 'contain'
                                            }}
                                            alt="logo"
                                        />
                                    ) : (
                                        <img
                                            style={{
                                                width: '100px',
                                                height: '100px'
                                            }}
                                            src={AddLogoIcon}
                                            alt="default logo"
                                        />
                                    )}
                                    <input
                                        onChange={this.handleLogoChange}
                                        type="file"
                                        style={{
                                            position: 'absolute',
                                            top: '0',
                                            left: '0',
                                            width: '100%',
                                            height: '100%',
                                            opacity: '0',
                                            cursor: 'pointer'
                                        }}
                                    />
                                </Box>
                                <Typography
                                    variant="h6"
                                    fontWeight="400"
                                    fontSize="12px"
                                    textAlign="center"
                                    mt="24px"
                                    maxWidth="152px"
                                    marginX="auto">
                                    Kích thước tối thiểu 3.1 mb
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={8}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                '& label': {
                                    fontWeight: '500',
                                    color: '#4C4B4C',
                                    fontSize: '14px',
                                    mb: '8px'
                                },
                                '& input': {
                                    fontSize: '14px'
                                }
                            }}>
                            <Typography variant="h3" fontWeight="700" fontSize="16px">
                                Thông tin cửa hàng
                            </Typography>
                            <Grid container spacing={1} mt="5px" rowSpacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle2">Tên cửa hàng</Typography>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            name="tenCongTy"
                                            placeholder="Nhập tên"
                                            onChange={this.handleChange}
                                            value={editCuaHang.tenCongTy}
                                            error={Boolean(this.state.errors.tenCongTy)}
                                            helperText={this.state.errors.tenCongTy}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle2">Địa chỉ</Typography>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            name="diaChi"
                                            onChange={this.handleChange}
                                            value={editCuaHang.diaChi}
                                            error={Boolean(this.state.errors.diaChi)}
                                            helperText={this.state.errors.diaChi}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle2">Số điện thoại</Typography>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            name="soDienThoai"
                                            onChange={this.handleChange}
                                            value={editCuaHang.soDienThoai}
                                            error={Boolean(this.state.errors.soDienThoai)}
                                            helperText={this.state.errors.soDienThoai}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle2">Mã số thuế</Typography>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            name="maSoThue"
                                            onChange={this.handleChange}
                                            value={editCuaHang.maSoThue}
                                            error={Boolean(this.state.errors.maSoThue)}
                                            helperText={this.state.errors.maSoThue}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle2">Website</Typography>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            name="website"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <WebsiteIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                            onChange={this.handleChange}
                                            value={editCuaHang.website}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle2">Facebook</Typography>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            name="facebook"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <FacebookIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                            onChange={this.handleChange}
                                            value={editCuaHang.facebook}
                                        />
                                    </Stack>
                                </Grid>
                                {!utils.checkNull(this.state.bankAcc.id) && (
                                    <>
                                        <Grid
                                            item
                                            xs={12}
                                            sx={{
                                                borderTop: '1px solid #E3E6EB',
                                                paddingTop: '24px',
                                                mt: '24px'
                                            }}>
                                            <Typography variant="h3" fontWeight="700" fontSize="16px">
                                                Tài khoản ngân hàng
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={1}>
                                                <Typography className="bank-account ">
                                                    {this.state.bankAcc?.tenChuThe}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={1}>
                                                <Typography className="bank-account ">
                                                    {this.state.bankAcc?.soTaiKhoan}
                                                </Typography>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} md={12}>
                                            <Stack direction={'row'} flex={8}>
                                                <Stack flex={1}></Stack>
                                                <Stack flex={4}>
                                                    <Stack direction={'row'} spacing={1} flex={8}>
                                                        <Stack flex={1}>
                                                            <img src={this.state.qrCode} style={{ width: '100px' }} />
                                                        </Stack>

                                                        <Stack flex={5}>
                                                            <img
                                                                src={this.state.bankAcc?.logoNganHang}
                                                                style={{ width: '180px' }}
                                                            />
                                                            <Typography variant="body2" color={'darkcyan'}>
                                                                {this.state.bankAcc?.tenNganHang}
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </Grid>
                                    </>
                                )}

                                <Grid
                                    item
                                    xs={12}
                                    sx={{
                                        borderTop: '1px solid #E3E6EB',
                                        paddingTop: '24px',
                                        mt: '24px',
                                        display: 'none' // chưa dùng đến - ẩn
                                    }}>
                                    <Typography variant="h3" fontWeight="700" fontSize="16px">
                                        Liên kết trực tuyến
                                    </Typography>
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    sx={{
                                        display: 'none'
                                    }}>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle2">Instagram</Typography>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            name="instagram"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <InstagramIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                            onChange={this.handleChange}
                                            value={editCuaHang.instagram ?? ''}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    sx={{
                                        display: 'none'
                                    }}>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle2">Twitter</Typography>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            name="twitter"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <TwitterIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                            onChange={this.handleChange}
                                            value={editCuaHang.twitter ?? ''}
                                        />
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        );
    }
}
export default StoreDetail;
