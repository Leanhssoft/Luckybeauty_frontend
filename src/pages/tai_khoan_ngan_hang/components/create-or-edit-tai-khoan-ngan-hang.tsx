import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    Button,
    Autocomplete,
    TextField,
    Box,
    Grid,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    FormControlLabel,
    Checkbox,
    DialogActions,
    Stack,
    FormHelperText
} from '@mui/material';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import suggestStore from '../../../stores/suggestStore';
import { SuggestNganHangDto } from '../../../services/suggests/dto/SuggestNganHangDto';
import { observer } from 'mobx-react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { CreateOrEditTaiKhoanNganHangDto } from '../../../services/tai_khoan_ngan_hang/Dto/createOrEditTaiKhoanNganHangDto';
import taiKhoanNganHangService from '../../../services/tai_khoan_ngan_hang/taiKhoanNganHangService';
import { enqueueSnackbar } from 'notistack';
import AppConsts from '../../../lib/appconst';
interface Props {
    visiable: boolean;
    onCancel: () => void;
    onOk: () => void;
    formRef: CreateOrEditTaiKhoanNganHangDto;
}
const CreateOrEditTaiKhoanNganHangModal = ({ visiable, onCancel, onOk, formRef }: Props) => {
    const initValues = formRef;
    const rules = Yup.object().shape({
        idNganHang: Yup.string().required('Ngân hàng không được để trống'),
        soTaiKhoan: Yup.number().required('Số tài khoản không được để trống'),
        tenChuThe: Yup.string().required('Tên chủ thẻ không được để trống')
    });
    return (
        <Dialog open={visiable} fullWidth maxWidth={'sm'} onClose={onCancel}>
            <DialogTitle className="modal-title">
                {formRef.id === AppConsts.guidEmpty ? ' Thêm mới tài khoản ngân hàng' : ' Cập nhật tài khoản ngân hàng'}
                <Button
                    sx={{
                        position: 'absolute',
                        right: '16px',
                        top: '16px',
                        minWidth: 'unset',
                        '&:hover svg': {
                            filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                        }
                    }}
                    onClick={onCancel}>
                    <CloseIcon />
                </Button>
            </DialogTitle>
            <DialogContent>
                <Formik
                    enableReinitialize={true}
                    initialValues={initValues}
                    validationSchema={rules}
                    onSubmit={async (values) => {
                        const result = await taiKhoanNganHangService.createOrEdit(values);
                        enqueueSnackbar(result.message, {
                            variant: result.status,
                            autoHideDuration: 3000
                        });
                        onOk();
                    }}>
                    {({ values, handleChange, isSubmitting, errors, setFieldValue, touched }) => (
                        <Form
                            onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault(); // Prevent form submission
                                }
                            }}>
                            <Grid container spacing={2} paddingTop={2}>
                                <Grid item xs={12}>
                                    <Autocomplete
                                        value={
                                            suggestStore.suggestNganHang?.length > 0 &&
                                            suggestStore.suggestNganHang != undefined
                                                ? suggestStore.suggestNganHang?.filter(
                                                      (x) => x.id == values.idNganHang
                                                  )[0]
                                                : ({
                                                      id: '',
                                                      bin: '',
                                                      logo: '',
                                                      maNganHang: '',
                                                      tenNganHang: '',
                                                      tenRutGon: ''
                                                  } as SuggestNganHangDto)
                                        }
                                        options={suggestStore.suggestNganHang}
                                        getOptionLabel={(option) => option.tenRutGon}
                                        renderOption={(props, option) => (
                                            <ListItem {...props}>
                                                <ListItemAvatar>
                                                    <Avatar
                                                        variant="square"
                                                        sx={{ width: '90px', marginRight: '10px' }}
                                                        src={option.logo}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={option.tenRutGon}
                                                    secondary={option.tenNganHang}
                                                />
                                            </ListItem>
                                        )}
                                        fullWidth
                                        onChange={(event, value) => {
                                            setFieldValue('idNganHang', value?.id);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                size="small"
                                                error={errors.idNganHang && touched.idNganHang ? true : false}
                                                helperText={
                                                    Boolean(errors?.idNganHang) &&
                                                    touched.tenChuThe && (
                                                        <span className="text-danger">
                                                            {String(errors?.idNganHang)}
                                                        </span>
                                                    )
                                                }
                                                label={
                                                    <Typography variant="body2">
                                                        Ngân hàng <span className="text-danger"> *</span>
                                                    </Typography>
                                                }
                                                placeholder="Nhập tên ngân hàng"
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        size="small"
                                        label={
                                            <Typography variant="body2">
                                                Tên chủ thẻ
                                                <span className="text-danger">*</span>
                                            </Typography>
                                        }
                                        name="tenChuThe"
                                        value={values.tenChuThe}
                                        onChange={handleChange}
                                        fullWidth
                                        error={Boolean(errors?.tenChuThe) && touched?.tenChuThe ? true : false}
                                        helperText={
                                            Boolean(errors?.tenChuThe) &&
                                            touched.tenChuThe && (
                                                <span className="text-danger">{String(errors?.tenChuThe)}</span>
                                            )
                                        }
                                        sx={{
                                            fontSize: '16px',
                                            color: '#4c4b4c'
                                        }}></TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        size="small"
                                        label={
                                            <Typography variant="body2">
                                                Số tài khoản
                                                <span className="text-danger">*</span>
                                            </Typography>
                                        }
                                        fullWidth
                                        name="soTaiKhoan"
                                        value={values.soTaiKhoan}
                                        onChange={handleChange}
                                        error={Boolean(errors?.soTaiKhoan) && touched?.soTaiKhoan ? true : false}
                                        helperText={
                                            Boolean(errors?.soTaiKhoan) &&
                                            touched.soTaiKhoan && (
                                                <span className="text-danger">{String(errors?.soTaiKhoan)}</span>
                                            )
                                        }
                                        sx={{
                                            fontSize: '16px',
                                            color: '#4c4b4c'
                                        }}></TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        size="small"
                                        multiline
                                        maxRows={3}
                                        label={<Typography variant="body2">Ghi chú</Typography>}
                                        fullWidth
                                        name="ghiChu"
                                        value={values.ghiChu}
                                        onChange={handleChange}
                                        sx={{
                                            fontSize: '16px',
                                            color: '#4c4b4c'
                                        }}></TextField>
                                </Grid>
                                <Grid item xs={12} sx={{ paddingLeft: '4px!important' }}>
                                    <Stack direction={'row'} alignItems={'center'}>
                                        <Checkbox
                                            checked={values.isDefault}
                                            onChange={(event, value) => {
                                                setFieldValue('isDefault', value);
                                            }}
                                        />
                                        <Typography variant="body2">Tài khoản mặc định</Typography>
                                    </Stack>
                                    <Stack direction={'row'} alignItems={'center'}>
                                        <Checkbox
                                            checked={values.trangThai === 1 ? true : false}
                                            onChange={(event, value) => {
                                                setFieldValue('trangThai', value ? 1 : 0);
                                            }}
                                        />
                                        <Typography variant="body2">Kích hoạt</Typography>
                                    </Stack>
                                </Grid>
                            </Grid>

                            <DialogActions sx={{ paddingRight: '0!important' }}>
                                <Button
                                    variant="outlined"
                                    onClick={onCancel}
                                    sx={{
                                        fontSize: '14px',
                                        textTransform: 'unset',
                                        color: '#666466'
                                    }}
                                    className="btn-outline-hover">
                                    Hủy
                                </Button>
                                {!isSubmitting ? (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            fontSize: '14px',
                                            textTransform: 'unset',
                                            color: '#fff',

                                            border: 'none'
                                        }}
                                        type="submit"
                                        className="btn-container-hover">
                                        Lưu
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            fontSize: '14px',
                                            textTransform: 'unset',
                                            color: '#fff',

                                            border: 'none'
                                        }}
                                        className="btn-container-hover">
                                        Đang lưu
                                    </Button>
                                )}
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};
export default observer(CreateOrEditTaiKhoanNganHangModal);
