import { Component, ReactNode } from 'react';
import { CreateOrEditCaLamViecDto } from '../../../../services/nhan-vien/ca_lam_viec/dto/createOrEditCaLamViecDto';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Grid,
    TextField,
    Typography
} from '@mui/material';
import * as Yup from 'yup';
import { ReactComponent as CloseIcon } from '../../../../images/close-square.svg';
import { Form, Formik } from 'formik';
import caLamViecService from '../../../../services/nhan-vien/ca_lam_viec/caLamViecService';
import { enqueueSnackbar } from 'notistack';
import AppConsts from '../../../../lib/appconst';
import DialogButtonClose from '../../../../components/Dialog/ButtonClose';
interface CreateOrEditProps {
    visible: boolean;
    onCancel: () => void;
    title: React.ReactNode;
    createOrEditDto: CreateOrEditCaLamViecDto;
}
class CreateOrEditCaLamViecDialog extends Component<CreateOrEditProps> {
    state = {
        isNghiGiuaCa: false
    };
    render(): ReactNode {
        const { visible, onCancel, title, createOrEditDto } = this.props;
        const initValues = createOrEditDto;
        const rules = Yup.object().shape({
            tenCa: Yup.string().required('Tên ca không dược để trống'),
            gioVao: Yup.string().required('Giờ bắt đầu ca không được để trống'),
            gioRa: Yup.string().required('Giờ kết thúc ca không được để trống')
        });
        const handleSubmit = async (values: CreateOrEditCaLamViecDto) => {
            values.id = createOrEditDto.id;
            const createOrEdit = await caLamViecService.ceateOrEdit(values);
            createOrEdit != null
                ? values.id === AppConsts.guidEmpty || values.id === ''
                    ? enqueueSnackbar('Thêm mới thành công', {
                          variant: 'success',
                          autoHideDuration: 3000
                      })
                    : enqueueSnackbar('Cập nhật thành công', {
                          variant: 'success',
                          autoHideDuration: 3000
                      })
                : enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại sau', {
                      variant: 'error',
                      autoHideDuration: 3000
                  });
            onCancel();
        };
        return (
            <Dialog open={visible} onClose={onCancel} maxWidth="md">
                <DialogButtonClose onClose={onCancel} />
                <DialogTitle>
                    <Box className="modal-title" sx={{ float: 'left' }}>
                        {title}
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Formik initialValues={initValues} validationSchema={rules} onSubmit={handleSubmit}>
                        {({ values, handleChange, errors, touched, isSubmitting }) => (
                            <Form
                                onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault(); // Prevent form submission
                                    }
                                }}>
                                <Grid container direction="row" spacing={2} alignItems="center">
                                    <Grid item xs={12} sx={{ marginTop: '8px' }}>
                                        <FormGroup>
                                            <TextField
                                                label={
                                                    <Typography>
                                                        Tên ca
                                                        <span className="text-danger"> *</span>
                                                    </Typography>
                                                }
                                                value={values.tenCa}
                                                error={errors.tenCa && touched.tenCa ? true : false}
                                                helperText={
                                                    errors.tenCa &&
                                                    touched.tenCa && <span className="text-danger">{errors.tenCa}</span>
                                                }
                                                type="text"
                                                name="tenCa"
                                                size="small"
                                                onChange={handleChange}
                                                placeholder="Nhập tên ca"
                                            />
                                        </FormGroup>
                                        <FormControlLabel
                                            sx={{
                                                '& .MuiFormControlLabel-label': {
                                                    fontSize: '13px!important'
                                                }
                                            }}
                                            control={<Checkbox />}
                                            label="Không cố định thời gian"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <FormGroup>
                                            <TextField
                                                label={
                                                    <Typography>
                                                        Bắt đầu ca
                                                        <span className="text-danger"> *</span>
                                                    </Typography>
                                                }
                                                type="time"
                                                size="small"
                                                name="gioVao"
                                                value={values.gioVao}
                                                error={errors.gioVao && touched.gioVao ? true : false}
                                                helperText={
                                                    errors.tenCa &&
                                                    touched.tenCa && (
                                                        <span className="text-danger">{errors.gioVao}</span>
                                                    )
                                                }
                                                onChange={handleChange}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                placeholder="Nhập từ ngày"
                                            />
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <FormGroup>
                                            <TextField
                                                label={
                                                    <Typography>
                                                        Kết thúc ca
                                                        <span className="text-danger"> *</span>
                                                    </Typography>
                                                }
                                                type="time"
                                                size="small"
                                                name="gioRa"
                                                value={values.gioRa}
                                                error={errors.gioRa && touched.gioRa ? true : false}
                                                helperText={
                                                    errors.gioRa &&
                                                    touched.gioRa && <span className="text-danger">{errors.gioRa}</span>
                                                }
                                                onChange={handleChange}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                placeholder="Nhập từ ngày"
                                            />
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            sx={{
                                                '& .MuiFormControlLabel-label': {
                                                    fontSize: '13px!important'
                                                }
                                            }}
                                            name="laNghiGiuaCa"
                                            value={values?.laNghiGiuaCa}
                                            checked={values?.laNghiGiuaCa}
                                            onChange={handleChange}
                                            control={<Checkbox />}
                                            label="Nghỉ giữa ca"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} hidden={values.laNghiGiuaCa == true ? false : true}>
                                        <TextField
                                            fullWidth
                                            label={<Typography>Giờ nghỉ từ</Typography>}
                                            type="time"
                                            size="small"
                                            name="gioNghiTu"
                                            value={values.gioNghiTu}
                                            onChange={handleChange}
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} hidden={values.laNghiGiuaCa == true ? false : true}>
                                        <TextField
                                            fullWidth
                                            label={<Typography>Giờ nghỉ đến</Typography>}
                                            type="time"
                                            size="small"
                                            name="gioNghiDen"
                                            value={values.gioNghiDen}
                                            onChange={handleChange}
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormGroup
                                            sx={{
                                                '& textarea': {
                                                    height: '100px',
                                                    borderColor: 'rgba(0, 0, 0, 0.23)',
                                                    borderRadius: '8px'
                                                }
                                            }}>
                                            <TextField
                                                label={<Typography>Mô tả</Typography>}
                                                multiline
                                                maxRows={3}
                                                minRows={2}></TextField>
                                        </FormGroup>
                                    </Grid>
                                </Grid>
                                <DialogActions
                                    sx={{
                                        position: 'sticky',
                                        bgcolor: '#fff',
                                        zIndex: '5',
                                        padding: '16px 0px 0px 0px !important'
                                    }}>
                                    <Button
                                        sx={{
                                            color: 'var(--color-main)!important',
                                            bgcolor: '#fff!important',
                                            height: '40px'
                                        }}
                                        variant="outlined"
                                        type="button"
                                        onClick={onCancel}
                                        className="btn-cancel-dialog btn-outline-hover">
                                        Hủy
                                    </Button>
                                    {!isSubmitting ? (
                                        <Button
                                            sx={{ height: '40px' }}
                                            variant="contained"
                                            type="submit"
                                            className="btn-container-hover">
                                            Lưu
                                        </Button>
                                    ) : (
                                        <Button
                                            sx={{ height: '40px' }}
                                            variant="contained"
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
    }
}
export default CreateOrEditCaLamViecDialog;
