import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormGroup,
    FormLabel,
    Grid,
    TextField,
    Box,
    FormControl,
    Typography,
    IconButton
} from '@mui/material';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { CreateOrEditNgayNghiLeDto } from '../../../services/ngay_nghi_le/dto/createOrEditNgayNghiLe';
import ngayNghiLeService from '../../../services/ngay_nghi_le/ngayNghiLeService';
import AppConsts from '../../../lib/appconst';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import { enqueueSnackbar } from 'notistack';
import { format as formatDate } from 'date-fns';
import DatePickerCustom from '../../../components/DatetimePicker/DatePickerCustom';
import DatePickerRequiredCustom from '../../../components/DatetimePicker/DatePickerRequiredCustom';
interface CreateOrEditProps {
    visible: boolean;
    onCancel: () => void;
    title: React.ReactNode;
    createOrEditDto: CreateOrEditNgayNghiLeDto;
}

class CreateOrEditThoiGianNghi extends React.Component<CreateOrEditProps> {
    render(): React.ReactNode {
        const { visible, onCancel, title, createOrEditDto } = this.props;

        const initialValues = {
            id: createOrEditDto.id,
            tenNgayLe: createOrEditDto.tenNgayLe,
            tuNgay: createOrEditDto.tuNgay,
            denNgay: createOrEditDto.denNgay
        };
        const rules = Yup.object().shape({
            tenNgayLe: Yup.string().required('Tên ngày lễ không được để trống'),
            tuNgay: Yup.date().required('Ngày bắt đầu không được để trống'),
            denNgay: Yup.date()
                .min(Yup.ref('tuNgay'), 'Thời gian kết thúc phải lớn hơn hoặc bằng ngày bắt đầu')
                .required('Ngày kết thúc không được để trống')
        });
        const handleSubmit = async (values: CreateOrEditNgayNghiLeDto) => {
            values.id = createOrEditDto.id;
            const createOrEdit = await ngayNghiLeService.createOrEdit(values);
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
            <Dialog open={visible} onClose={onCancel} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography
                        fontSize="24px"
                        //color="#333233"
                        fontWeight="700">
                        {title}
                    </Typography>
                    <IconButton
                        onClick={onCancel}
                        sx={{
                            '&:hover img': {
                                filter: 'brightness(0) saturate(100%) invert(36%) sepia(74%) saturate(1465%) hue-rotate(318deg) brightness(94%) contrast(100%)'
                            }
                        }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Formik initialValues={initialValues} validationSchema={rules} onSubmit={handleSubmit}>
                        {({ values, handleChange, errors, touched, isSubmitting }) => (
                            <Form
                                onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault(); // Prevent form submission
                                    }
                                }}>
                                <Grid container direction="row" spacing={3} alignItems="center">
                                    <Grid item xs={12}>
                                        <FormGroup>
                                            <TextField
                                                label={
                                                    <Typography variant="subtitle2">
                                                        Tên ngày lễ
                                                        <span className="text-danger"> *</span>
                                                    </Typography>
                                                }
                                                sx={{ marginTop: '16px' }}
                                                value={values.tenNgayLe}
                                                error={errors.tenNgayLe && touched.tenNgayLe ? true : false}
                                                helperText={
                                                    errors.tenNgayLe &&
                                                    touched.tenNgayLe && (
                                                        <span className="text-danger">{errors.tenNgayLe}</span>
                                                    )
                                                }
                                                type="text"
                                                name="tenNgayLe"
                                                size="small"
                                                onChange={handleChange}
                                                placeholder="Nhập tên ngày lễ"
                                            />
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormGroup>
                                            <DatePickerRequiredCustom
                                                props={{
                                                    width: '100%',
                                                    size: 'small',
                                                    label: (
                                                        <Typography variant="subtitle2">
                                                            Từ ngày
                                                            <span className="text-danger"> *</span>
                                                        </Typography>
                                                    ),
                                                    error: Boolean(errors.tuNgay) && touched.tuNgay ? true : false,
                                                    helperText: Boolean(errors.tuNgay) && touched?.tuNgay && (
                                                        <span className="text-danger">{String(errors.tuNgay)}</span>
                                                    )
                                                }}
                                                defaultVal={
                                                    values.tuNgay
                                                        ? formatDate(new Date(values.tuNgay), 'yyyy/MM/dd')
                                                        : ''
                                                }
                                                handleChangeDate={(dt: string) => {
                                                    values.tuNgay = new Date(dt);
                                                }}
                                            />
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormGroup>
                                            <DatePickerRequiredCustom
                                                props={{
                                                    width: '100%',
                                                    size: 'small',
                                                    label: (
                                                        <Typography variant="subtitle2">
                                                            Đến ngày
                                                            <span className="text-danger"> *</span>
                                                        </Typography>
                                                    ),
                                                    error: Boolean(errors.denNgay) && touched.denNgay ? true : false,
                                                    helperText: Boolean(errors.denNgay) && touched?.denNgay && (
                                                        <span className="text-danger">{String(errors.denNgay)}</span>
                                                    )
                                                }}
                                                defaultVal={
                                                    values.denNgay
                                                        ? formatDate(new Date(values.denNgay), 'yyyy/MM/dd')
                                                        : ''
                                                }
                                                handleChangeDate={(value: string) => {
                                                    values.denNgay = new Date(value);
                                                }}
                                            />
                                        </FormGroup>
                                    </Grid>
                                </Grid>
                                <DialogActions
                                    sx={{
                                        padding: '16px 0px 0px 0px !important'
                                    }}>
                                    <Button
                                        sx={{
                                            color: 'var(--color-main)!important',
                                            bgcolor: '#fff!important'
                                        }}
                                        variant="outlined"
                                        type="button"
                                        onClick={onCancel}
                                        className="btn-outline-hover">
                                        Hủy
                                    </Button>
                                    {!isSubmitting ? (
                                        <Button variant="contained" type="submit" className="btn-container-hover">
                                            Lưu
                                        </Button>
                                    ) : (
                                        <Button variant="contained" type="submit" className="btn-container-hover">
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

export default CreateOrEditThoiGianNghi;
