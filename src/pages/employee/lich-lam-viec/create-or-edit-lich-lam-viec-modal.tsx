import React, { useEffect, useState } from 'react';
import {
    Box,
    Dialog,
    TextField,
    Button,
    Grid,
    Typography,
    Select,
    MenuItem,
    SelectChangeEvent,
    ToggleButtonGroup,
    ToggleButton,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Autocomplete,
    FormHelperText,
    FormLabel,
    AutocompleteRenderInputParams,
    IconButton
} from '@mui/material';
import * as Yup from 'yup';
import { ReactComponent as ArrowDown } from '../../../images/arow-down.svg';
import { ReactComponent as DateIcon } from '../../../images/calendarMenu.svg';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import AppConsts from '../../../lib/appconst';
import { SuggestCaLamViecDto } from '../../../services/suggests/dto/SuggestCaLamViecDto';
import SuggestService from '../../../services/suggests/SuggestService';
import { Form, Formik } from 'formik';
import Cookies from 'js-cookie';
import lichLamViecService from '../../../services/nhan-vien/lich_lam_viec/lichLamViecService';
import { enqueueSnackbar } from 'notistack';
import { observer } from 'mobx-react';
import { format as formatDate } from 'date-fns';
import suggestStore from '../../../stores/suggestStore';
import DatePickerRequiredCustom from '../../../components/DatetimePicker/DatePickerRequiredCustom';
import lichLamViecStore from '../../../stores/lichLamViecStore';

interface DialogComponentProps {
    open: boolean;
    idNhanVien: string;
    onClose: () => void;
}
const CreateOrEditLichLamViecModal: React.FC<DialogComponentProps> = ({ open, onClose, idNhanVien }) => {
    const [curent, setCurent] = useState(1);
    const [idCaLamViec, setIdCaLamViec] = useState('');
    const [suggestCaLamViec, setSuggestCaLamViec] = useState<SuggestCaLamViecDto[]>([]);

    const caLamViecHandleChange = (event: SelectChangeEvent<any>) => {
        setIdCaLamViec(event.target.value);
    };
    const [date, setDate] = useState<string>('20/6/2023');
    useEffect(() => {
        getSuggestCaLamViec();
    }, []);
    const getSuggestCaLamViec = async () => {
        const result = await SuggestService.SuggestCaLamViec();
        if (result && result.length > 0) {
            setIdCaLamViec(result[0].id);
            setSuggestCaLamViec(result);
        }
    };
    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDate(event.target.value);
    };
    const initValues = { ...lichLamViecStore.createLichLamViecDto, idNhanVien: idNhanVien };
    const [selectedDays, setSelectedDays] = useState<string[]>(lichLamViecStore.createLichLamViecDto?.ngayLamViec);
    const handleDayToggle = (event: React.MouseEvent<HTMLElement>, newDays: string[]) => {
        setSelectedDays(newDays);
    };

    const rules = Yup.object().shape({
        idNhanVien: Yup.string()
            .nullable()
            .notOneOf(['00000000-0000-0000-0000-000000000000'], 'Nhân viên không được để trống')
            .required('Nhân viên không được để trống'),
        idCaLamViec: Yup.string().required('Ca làm việc không được để trống'),
        tuNgay: Yup.string().required('Ngày bắt đầu không được để trống'),
        denNgay: Yup.string().required('Ngày kết thúc không được để trống')
        // ngayLamViec: Yup.array()
        //     .of(Yup.string().required('Ngày làm việc trong tuần không được để trống'))
        //     .required('Ngày làm việc trong tuần không được để trống')
    });
    return (
        <Dialog open={open} onClose={onClose} maxWidth={false}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography fontSize="24px" fontWeight="700">
                    Đặt ca làm việc thường xuyên
                </Typography>
                <IconButton
                    onClick={onClose}
                    sx={{
                        '&:hover svg': {
                            filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                        }
                    }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Formik
                    validationSchema={rules}
                    initialValues={initValues}
                    onSubmit={async (values, helper) => {
                        //values.ngayLamViec = selectedDays;
                        if (values.ngayLamViec.length == 0 || values.ngayLamViec == null) {
                            helper.setFieldError('ngayLamViec', 'Ngày làm việc không được để trống');
                        } else {
                            const result = await lichLamViecService.createOrEditLichLamViec(values);
                            result == true
                                ? enqueueSnackbar('Thêm mới thành công', {
                                      variant: 'success',
                                      autoHideDuration: 3000
                                  })
                                : enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại sau!', {
                                      variant: 'error',
                                      autoHideDuration: 3000
                                  });
                            helper.resetForm();
                            setSelectedDays([]);
                            onClose();
                        }
                    }}>
                    {({ values, handleChange, errors, touched, setFieldValue, isSubmitting }) => (
                        <Form
                            onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault(); // Prevent form submission
                                }
                            }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={5}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: '16px',
                                            flexDirection: 'column',
                                            border: '1px solid #E6E1E6',
                                            padding: '24px',
                                            borderRadius: '8px'
                                        }}>
                                        <FormControl fullWidth>
                                            <InputLabel>
                                                <Typography fontSize="13px">Lặp lại</Typography>
                                            </InputLabel>
                                            <Select
                                                label={<Typography fontSize="13px">Lặp lại</Typography>}
                                                value={curent}
                                                onChange={(e) => {
                                                    setCurent(Number.parseInt(e.target.value.toString()));
                                                }}
                                                sx={{
                                                    width: '100%',
                                                    '[aria-expanded="true"] ~ svg': {
                                                        transform: 'rotate(180deg)'
                                                    },
                                                    pr: '20px'
                                                    //color: '#4C4B4C',

                                                    //mt: '8px'
                                                }}
                                                size="small"
                                                IconComponent={() => <ArrowDown />}>
                                                <MenuItem value={2}>Mỗi tuần</MenuItem>
                                                <MenuItem value={1}>Mỗi ngày</MenuItem>
                                                <MenuItem value={3}>Mỗi tháng</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Box>
                                            <DatePickerRequiredCustom
                                                props={{
                                                    width: '100%',
                                                    size: 'small',
                                                    label: (
                                                        <Typography variant="subtitle2">
                                                            Ngày bắt đầu
                                                            <span className="text-danger"> *</span>
                                                        </Typography>
                                                    ),
                                                    error: Boolean(errors.tuNgay) && touched.tuNgay ? true : false,
                                                    helperText: Boolean(errors.tuNgay) && touched?.tuNgay && (
                                                        <span className="text-danger">{String(errors.tuNgay)}</span>
                                                    )
                                                }}
                                                defaultVal={values?.tuNgay}
                                                handleChangeDate={(value: string) => {
                                                    values.tuNgay = value;
                                                }}
                                            />
                                        </Box>
                                        <Box>
                                            <DatePickerRequiredCustom
                                                props={{
                                                    width: '100%',
                                                    size: 'small',
                                                    label: (
                                                        <Typography variant="subtitle2">
                                                            Ngày kết thúc
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
                                                        ? formatDate(new Date(values.denNgay), 'yyyy-MM-dd')
                                                        : ''
                                                }
                                                handleChangeDate={(value: string) => {
                                                    values.denNgay = value;
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <Box
                                        sx={{
                                            gap: '16px',
                                            border: '1px solid #E6E1E6',
                                            padding: '24px',
                                            borderRadius: '8px'
                                        }}>
                                        <Grid container item spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Autocomplete
                                                    fullWidth
                                                    onChange={(event, value) => {
                                                        setFieldValue('idNhanVien', value?.id ?? '');
                                                        //idNhanVien = value?.id;
                                                    }}
                                                    options={suggestStore?.suggestNhanVien ?? []}
                                                    value={
                                                        suggestStore.suggestNhanVien?.find(
                                                            (x) => x.id == values.idNhanVien
                                                        ) ?? null
                                                    }
                                                    disabled={
                                                        idNhanVien !== AppConsts.guidEmpty || idNhanVien === ''
                                                            ? true
                                                            : false
                                                    }
                                                    getOptionLabel={(item) => item.tenNhanVien}
                                                    size="small"
                                                    sx={{
                                                        '& .MuiAutocomplete-root': {
                                                            backgroundColor: '#fff',
                                                            '& .MuiSvgIcon-root': {
                                                                position: 'relative',
                                                                left: '-10px'
                                                            },
                                                            '&[aria-expanded="true"] .MuiSvgIcon-root': {
                                                                transform: 'rotate(180deg)'
                                                            }
                                                        }
                                                    }}
                                                    renderInput={(params: any) => (
                                                        <TextField
                                                            error={
                                                                touched.idNhanVien && errors.idNhanVien ? true : false
                                                            }
                                                            helperText={
                                                                touched.idNhanVien &&
                                                                errors.idNhanVien && (
                                                                    <span className="text-danger">
                                                                        {errors.idNhanVien}
                                                                    </span>
                                                                )
                                                            }
                                                            fullWidth
                                                            {...params}
                                                            label={
                                                                <Typography variant="subtitle2">
                                                                    Nhân viên
                                                                    <span className="text-danger"> *</span>
                                                                </Typography>
                                                            }
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Autocomplete
                                                    size="small"
                                                    options={suggestCaLamViec ?? []}
                                                    getOptionLabel={(option) => option.tenCa}
                                                    value={
                                                        suggestCaLamViec.find((x) => x.id == values.idCaLamViec) ?? null
                                                    }
                                                    onChange={(e, v) => {
                                                        setFieldValue('idCaLamViec', v?.id);
                                                    }}
                                                    renderInput={(param: AutocompleteRenderInputParams) => (
                                                        <TextField
                                                            {...param}
                                                            label={
                                                                <Typography fontSize={'13px'}>
                                                                    Ca làm việc
                                                                    <span className="text-danger">*</span>
                                                                </Typography>
                                                            }
                                                            error={
                                                                touched.idCaLamViec && errors.idCaLamViec ? true : false
                                                            }
                                                            helperText={
                                                                touched.idCaLamViec &&
                                                                errors.idCaLamViec && (
                                                                    <span className="text-danger">
                                                                        {errors.idCaLamViec}
                                                                    </span>
                                                                )
                                                            }
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Box>
                                                    <Typography fontSize={'13px'}>
                                                        Ngày làm việc
                                                        <span className="text-danger"> *</span>
                                                    </Typography>
                                                    <ToggleButtonGroup
                                                        fullWidth
                                                        size="small"
                                                        orientation="horizontal"
                                                        value={values.ngayLamViec}
                                                        sx={{ mt: '8px', padding: '2px' }}
                                                        onChange={(event, days) => {
                                                            handleDayToggle(event, days);
                                                            setFieldValue('ngayLamViec', days);
                                                        }}>
                                                        <ToggleButton
                                                            value={AppConsts.dayOfWeek.monday}
                                                            aria-label="Monday"
                                                            style={
                                                                values.ngayLamViec?.includes(AppConsts.dayOfWeek.monday)
                                                                    ? {
                                                                          backgroundColor: 'var(--color-main)',
                                                                          color: '#FFFFFF'
                                                                      }
                                                                    : { color: 'black' }
                                                            }>
                                                            T2
                                                        </ToggleButton>
                                                        <ToggleButton
                                                            value={AppConsts.dayOfWeek.tuesday}
                                                            aria-label="Tuesday"
                                                            style={
                                                                values.ngayLamViec?.includes(
                                                                    AppConsts.dayOfWeek.tuesday
                                                                )
                                                                    ? {
                                                                          backgroundColor: 'var(--color-main)',
                                                                          color: '#FFFFFF'
                                                                      }
                                                                    : { color: 'black' }
                                                            }>
                                                            T3
                                                        </ToggleButton>
                                                        <ToggleButton
                                                            value={AppConsts.dayOfWeek.wednesday}
                                                            aria-label="Wednesday"
                                                            style={
                                                                values.ngayLamViec?.includes(
                                                                    AppConsts.dayOfWeek.wednesday
                                                                )
                                                                    ? {
                                                                          backgroundColor: 'var(--color-main)',
                                                                          color: '#FFFFFF'
                                                                      }
                                                                    : { color: 'black' }
                                                            }>
                                                            T4
                                                        </ToggleButton>
                                                        <ToggleButton
                                                            value={AppConsts.dayOfWeek.thursday}
                                                            aria-label="Thursday"
                                                            style={
                                                                values.ngayLamViec?.includes(
                                                                    AppConsts.dayOfWeek.thursday
                                                                )
                                                                    ? {
                                                                          backgroundColor: 'var(--color-main)',
                                                                          color: '#FFFFFF'
                                                                      }
                                                                    : { color: 'black' }
                                                            }>
                                                            T5
                                                        </ToggleButton>
                                                        <ToggleButton
                                                            value={AppConsts.dayOfWeek.friday}
                                                            aria-label="Friday"
                                                            style={
                                                                values.ngayLamViec?.includes(AppConsts.dayOfWeek.friday)
                                                                    ? {
                                                                          backgroundColor: 'var(--color-main)',
                                                                          color: '#FFFFFF'
                                                                      }
                                                                    : { color: 'black' }
                                                            }>
                                                            T6
                                                        </ToggleButton>
                                                        <ToggleButton
                                                            value={AppConsts.dayOfWeek.saturday}
                                                            aria-label="Saturday"
                                                            style={
                                                                values.ngayLamViec?.includes(
                                                                    AppConsts.dayOfWeek.saturday
                                                                )
                                                                    ? {
                                                                          backgroundColor: 'var(--color-main)',
                                                                          color: '#FFFFFF'
                                                                      }
                                                                    : { color: 'black' }
                                                            }>
                                                            T7
                                                        </ToggleButton>
                                                        <ToggleButton
                                                            value={AppConsts.dayOfWeek.sunday}
                                                            aria-label="Sunday"
                                                            style={
                                                                values.ngayLamViec?.includes(AppConsts.dayOfWeek.sunday)
                                                                    ? {
                                                                          backgroundColor: 'var(--color-main)',
                                                                          color: '#FFFFFF'
                                                                      }
                                                                    : { color: 'black' }
                                                            }>
                                                            CN
                                                        </ToggleButton>
                                                    </ToggleButtonGroup>
                                                    {errors.ngayLamViec && (
                                                        <span className="text-danger">{errors.ngayLamViec}</span>
                                                    )}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                            <DialogActions
                                sx={{
                                    paddingRight: '0px !important'
                                }}>
                                <Box
                                    display="flex"
                                    marginLeft="auto"
                                    gap="8px"
                                    sx={{
                                        '& button': {
                                            textTransform: 'unset!important'
                                        }
                                    }}>
                                    <Button
                                        onClick={onClose}
                                        variant="outlined"
                                        sx={{ color: 'var(--color-main)!important' }}
                                        className="btn-outline-hover">
                                        Hủy
                                    </Button>
                                    {!isSubmitting ? (
                                        <Button type="submit" variant="contained" className="btn-container-hover">
                                            Lưu
                                        </Button>
                                    ) : (
                                        <Button type="submit" variant="contained" className="btn-container-hover">
                                            Đang lưu
                                        </Button>
                                    )}
                                </Box>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};
export default observer(CreateOrEditLichLamViecModal);
