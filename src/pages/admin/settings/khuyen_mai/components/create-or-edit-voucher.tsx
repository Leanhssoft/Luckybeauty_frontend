/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Autocomplete,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    IconButton,
    Button,
    Switch,
    TextField,
    Typography,
    ToggleButtonGroup,
    ToggleButton,
    Radio,
    RadioGroup,
    Tabs,
    Tab,
    Box,
    MenuItem,
    Select,
    InputLabel,
    FormHelperText
} from '@mui/material';
import { ReactComponent as CloseIcon } from '../../../../../images/close-square.svg';
import { FieldArray, Form, Formik, FormikErrors } from 'formik';
import { format as formatDate } from 'date-fns';
import DatePickerRequiredCustom from '../../../../../components/DatetimePicker/DatePickerRequiredCustom';
import suggestStore from '../../../../../stores/suggestStore';
import { observer } from 'mobx-react';
import AppConsts from '../../../../../lib/appconst';
import { useState } from 'react';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ThoiGianConst from '../../../../../lib/thoiGianConst';
import khuyenMaiStore from '../../../../../stores/khuyenMaiStore';
import { NumericFormat } from 'react-number-format';
import rules from './create-or-edit-khuyen-mai.validate';
import { KhuyenMaiChiTiet } from '../../../../../services/khuyen_mai/dto/CreateOrEditKhuyenMaiDto';
function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`
    };
}
const CreateOrEditVoucher: React.FC<{
    visiable: boolean;
    handleClose: () => void;
    onOk: () => void;
}> = ({ visiable, handleClose, onOk }: any) => {
    const [tabIndex, setTabIndex] = useState(0);
    const handleTabChange = (event: any, value: number) => {
        setTabIndex(value);
    };
    const initValues = khuyenMaiStore.createOrEditKhuyenMaiDto;
    return (
        <Dialog open={visiable} maxWidth="md" fullWidth onClose={handleClose}>
            <DialogTitle>
                <Typography fontSize="24px" fontWeight={700}>
                    {initValues.id == AppConsts.guidEmpty ? 'Thêm mới voucher' : 'Cập nhật voucher'}
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        '&:hover': {
                            filter: ' brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                        }
                    }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={initValues}
                    validationSchema={rules}
                    validate={(values) => {
                        const errors = { thoiGianKetThuc: '', khuyenMaiChiTiets: [] as any[] };
                        if (
                            values.thoiGianKetThuc === '' ||
                            values.thoiGianKetThuc == null ||
                            values.thoiGianKetThuc == undefined
                        ) {
                            setTabIndex(1);
                            errors.thoiGianKetThuc = 'Thời gian kết thúc không được để trống';
                        } else if (values.khuyenMaiChiTiets && values.khuyenMaiChiTiets.length > 0) {
                            values.khuyenMaiChiTiets.forEach((item, index) => {
                                let errorKhuyenMai = {
                                    tongTienHang: '',
                                    soLuongMua: '',
                                    idDonViQuiDoiTang: '',
                                    giamGia: '',
                                    soLuongTang: '',
                                    idDonViQuiDoiMua: '',
                                    soDiemTang: '',
                                    giaKhuyenMai: ''
                                };
                                if (values.loaiKhuyenMai === 1) {
                                    if (!item.tongTienHang) {
                                        errorKhuyenMai = {
                                            ...errorKhuyenMai,
                                            tongTienHang: 'Tổng tiền hàng không được để trống'
                                        };
                                        setTabIndex(0);
                                    }
                                }
                                if (values.loaiKhuyenMai === 2) {
                                    if (!item.soLuongMua) {
                                        errorKhuyenMai = {
                                            ...errorKhuyenMai,
                                            soLuongMua: 'Số lượng mua không được để trống'
                                        };
                                        setTabIndex(0);
                                    }
                                    if (!item.idDonViQuiDoiMua) {
                                        errorKhuyenMai = {
                                            ...errorKhuyenMai,
                                            idDonViQuiDoiMua: 'Đơn vị quy đổi mua không được để trống'
                                        };

                                        setTabIndex(0);
                                    }
                                }
                                if (values.hinhThucKM === 11 || values.hinhThucKM === 13 || values.hinhThucKM === 21) {
                                    if (!item.giamGia || item.giamGia <= 0) {
                                        errorKhuyenMai = {
                                            ...errorKhuyenMai,
                                            giamGia: 'Giảm giá không được để trống'
                                        };
                                        setTabIndex(0);
                                    }
                                }
                                if (values.hinhThucKM === 12 || values.hinhThucKM === 22) {
                                    if (!item.soLuongTang || item?.soLuongTang <= 0) {
                                        errorKhuyenMai = {
                                            ...errorKhuyenMai,
                                            soLuongTang: 'Số lượng tặng không được để trống'
                                        };
                                        setTabIndex(0);
                                    }
                                }
                                if (
                                    values.hinhThucKM === 12 ||
                                    values.hinhThucKM === 13 ||
                                    values.hinhThucKM === 22 ||
                                    values.hinhThucKM === 21
                                ) {
                                    if (!item.idDonViQuiDoiTang) {
                                        errorKhuyenMai = {
                                            ...errorKhuyenMai,
                                            idDonViQuiDoiTang: 'Mặt hàng tặng không được để trống'
                                        };
                                        setTabIndex(0);
                                    }
                                }
                                if (values.hinhThucKM === 14 || values.hinhThucKM === 24) {
                                    if (!item.soDiemTang || item?.soDiemTang <= 0) {
                                        errorKhuyenMai = {
                                            ...errorKhuyenMai,
                                            soDiemTang: 'Số điểm tặng không được để trống'
                                        };
                                        setTabIndex(0);
                                    }
                                }
                                if (values.hinhThucKM === 23) {
                                    if (!item.giaKhuyenMai || item?.giaKhuyenMai <= 0) {
                                        errorKhuyenMai = {
                                            ...errorKhuyenMai,
                                            giaKhuyenMai: 'Giá khuyến mãi không được để trống'
                                        };
                                        setTabIndex(0);
                                    }
                                }
                                errors.khuyenMaiChiTiets.push(errorKhuyenMai);
                            });
                        }

                        return errors;
                    }}
                    onSubmit={async (values, formikHelper) => {
                        await khuyenMaiStore.CreateOrEditKhuyenMai(values);
                        formikHelper.resetForm();
                        onOk();
                    }}>
                    {({ values, errors, touched, handleChange, setFieldValue, isSubmitting }) => (
                        <Form
                            onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault(); // Prevent unwanted form submission
                                }
                            }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        value="start"
                                        control={
                                            <Switch checked={values?.trangThai === 1 ? true : false} color="primary" />
                                        }
                                        label="Kích hoạt"
                                        labelPlacement="start"
                                        onChange={(e, v) => {
                                            setFieldValue('trangThai', v === true ? 1 : 0);
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        size="small"
                                        type="text"
                                        name="maKhuyenMai"
                                        label={<Typography variant="subtitle2">Mã chương trình</Typography>}
                                        value={values?.maKhuyenMai}
                                        onChange={handleChange}
                                        fullWidth
                                        sx={{ fontSize: '16px' }}></TextField>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        size="small"
                                        type="text"
                                        name="tenKhuyenMai"
                                        label={
                                            <Typography fontSize={'13px'}>
                                                Tên chương trình <span className="text-danger">*</span>
                                            </Typography>
                                        }
                                        error={errors.tenKhuyenMai && touched.tenKhuyenMai ? true : false}
                                        helperText={
                                            errors.tenKhuyenMai &&
                                            touched.tenKhuyenMai && (
                                                <span className="text-danger">{errors.tenKhuyenMai}</span>
                                            )
                                        }
                                        value={values?.tenKhuyenMai}
                                        onChange={handleChange}
                                        fullWidth
                                        sx={{ fontSize: '16px' }}></TextField>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Tabs
                                        orientation={'vertical'}
                                        variant="scrollable"
                                        value={tabIndex}
                                        onChange={handleTabChange}
                                        sx={{
                                            borderRight: 1,
                                            borderColor: 'divider',
                                            marginTop: '8px'
                                        }}>
                                        <Tab
                                            sx={{ alignItems: 'start', fontSize: '13px' }}
                                            label="Hình thức khuyến mại"
                                            {...a11yProps(0)}
                                        />
                                        <Tab
                                            sx={{ alignItems: 'start', fontSize: '13px' }}
                                            label="Thời gian áp dụng"
                                            {...a11yProps(1)}
                                        />
                                        <Tab
                                            sx={{ alignItems: 'start', fontSize: '13px' }}
                                            label="Phạm vi áp dụng"
                                            {...a11yProps(2)}
                                        />
                                    </Tabs>
                                </Grid>

                                <Grid item xs={12} sm={6} md={9}>
                                    <TabPanel value={tabIndex} index={0}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <FormControl fullWidth>
                                                    <InputLabel sx={{ fontSize: '13px' }} id="demo-simple-select-label">
                                                        Loại khuyến mãi
                                                    </InputLabel>
                                                    <Select
                                                        size="small"
                                                        label="Loại khuyến mại"
                                                        onChange={(event) => {
                                                            setFieldValue('loaiKhuyenMai', event.target.value);
                                                            setFieldValue(
                                                                'hinhThucKM',
                                                                event.target.value == 1 ? 11 : 21
                                                            );
                                                        }}
                                                        value={values?.loaiKhuyenMai}>
                                                        <MenuItem value={AppConsts.loaiKhuyenMai.hangHoa}>
                                                            Hàng hóa
                                                        </MenuItem>
                                                        <MenuItem value={AppConsts.loaiKhuyenMai.hoaDon}>
                                                            Hóa đơn
                                                        </MenuItem>
                                                    </Select>
                                                    <FormHelperText>
                                                        {errors.loaiKhuyenMai && (
                                                            <span className="text-danger">{errors.loaiKhuyenMai}</span>
                                                        )}
                                                    </FormHelperText>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <FormGroup>
                                                    <Autocomplete
                                                        options={
                                                            values.loaiKhuyenMai === AppConsts.loaiKhuyenMai.hoaDon
                                                                ? AppConsts.hinhThucKhuyenMaiHoaDon
                                                                : AppConsts.hinhThucKhuyenMaiHangHoa
                                                        }
                                                        getOptionLabel={(option) => `${option.name}`}
                                                        value={
                                                            values.loaiKhuyenMai === AppConsts.loaiKhuyenMai.hoaDon
                                                                ? AppConsts.hinhThucKhuyenMaiHoaDon.find(
                                                                      (x) => x.value == values?.hinhThucKM
                                                                  )
                                                                : AppConsts.hinhThucKhuyenMaiHangHoa.find(
                                                                      (x) => x.value == values?.hinhThucKM
                                                                  )
                                                        }
                                                        size="small"
                                                        fullWidth
                                                        disablePortal
                                                        onChange={(event, value) => {
                                                            setFieldValue('hinhThucKM', value ? value.value : null);
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label={
                                                                    <Typography variant="body1" fontSize="14px">
                                                                        Hình thức
                                                                    </Typography>
                                                                }
                                                                error={
                                                                    errors.hinhThucKM && touched.hinhThucKM
                                                                        ? true
                                                                        : false
                                                                }
                                                                helperText={
                                                                    errors.hinhThucKM &&
                                                                    touched.hinhThucKM && (
                                                                        <span className="text-danger">
                                                                            {errors.hinhThucKM}
                                                                        </span>
                                                                    )
                                                                }
                                                                placeholder="Chọn hình thức khuyễn mãi"
                                                            />
                                                        )}
                                                    />
                                                </FormGroup>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FieldArray
                                                    name="khuyenMaiChiTiets"
                                                    render={(arrayHelpers) => {
                                                        return (
                                                            <Box>
                                                                {values?.khuyenMaiChiTiets &&
                                                                values?.khuyenMaiChiTiets.length > 0 ? (
                                                                    <Box>
                                                                        {values?.khuyenMaiChiTiets.map(
                                                                            (item, index) => (
                                                                                <Box
                                                                                    key={index}
                                                                                    display="flex"
                                                                                    gap="4px"
                                                                                    alignItems={'start'}
                                                                                    justifyContent="space-between">
                                                                                    {values.loaiKhuyenMai === 1 ? (
                                                                                        <Box
                                                                                            display={'flex'}
                                                                                            flexDirection={'column'}>
                                                                                            <NumericFormat
                                                                                                thousandSeparator={'.'}
                                                                                                decimalSeparator={','}
                                                                                                size="small"
                                                                                                label="Tổng tiền hàng từ"
                                                                                                sx={{
                                                                                                    marginTop: '6px'
                                                                                                }}
                                                                                                type="text"
                                                                                                fullWidth
                                                                                                onChange={(e) => {
                                                                                                    const valueChange =
                                                                                                        e.target.value.replaceAll(
                                                                                                            '.',
                                                                                                            ''
                                                                                                        );
                                                                                                    setFieldValue(
                                                                                                        `khuyenMaiChiTiets.${index}.tongTienHang`,
                                                                                                        Number.parseInt(
                                                                                                            valueChange
                                                                                                        )
                                                                                                    );
                                                                                                }}
                                                                                                customInput={TextField}
                                                                                                value={
                                                                                                    item.tongTienHang
                                                                                                }
                                                                                            />
                                                                                            {errors.khuyenMaiChiTiets &&
                                                                                                errors
                                                                                                    .khuyenMaiChiTiets[
                                                                                                    index
                                                                                                ] && (
                                                                                                    <span className="text-danger">
                                                                                                        {
                                                                                                            (
                                                                                                                errors
                                                                                                                    .khuyenMaiChiTiets[0] as FormikErrors<KhuyenMaiChiTiet>
                                                                                                            )
                                                                                                                .tongTienHang
                                                                                                        }
                                                                                                    </span>
                                                                                                )}
                                                                                        </Box>
                                                                                    ) : null}
                                                                                    {values.loaiKhuyenMai === 2 ? (
                                                                                        <Box
                                                                                            display={'flex'}
                                                                                            flexDirection={'column'}
                                                                                            sx={{ width: '64px' }}>
                                                                                            <NumericFormat
                                                                                                thousandSeparator={'.'}
                                                                                                decimalSeparator={','}
                                                                                                size="small"
                                                                                                label=""
                                                                                                sx={{
                                                                                                    marginTop: '6px'
                                                                                                }}
                                                                                                onChange={(e) => {
                                                                                                    const valueChange =
                                                                                                        e.target.value.replaceAll(
                                                                                                            '.',
                                                                                                            ''
                                                                                                        );
                                                                                                    setFieldValue(
                                                                                                        `khuyenMaiChiTiets.${index}.soLuongMua`,
                                                                                                        Number.parseInt(
                                                                                                            valueChange
                                                                                                        )
                                                                                                    );
                                                                                                }}
                                                                                                customInput={TextField}
                                                                                                value={item.soLuongMua}
                                                                                                name={`khuyenMaiChiTiets.${index}.soLuongMua`}
                                                                                            />
                                                                                            {errors.khuyenMaiChiTiets &&
                                                                                                errors
                                                                                                    .khuyenMaiChiTiets[
                                                                                                    index
                                                                                                ] && (
                                                                                                    <span className="text-danger">
                                                                                                        {
                                                                                                            (
                                                                                                                errors
                                                                                                                    .khuyenMaiChiTiets[0] as FormikErrors<KhuyenMaiChiTiet>
                                                                                                            ).soLuongMua
                                                                                                        }
                                                                                                    </span>
                                                                                                )}
                                                                                        </Box>
                                                                                    ) : null}
                                                                                    {values.loaiKhuyenMai === 2 ? (
                                                                                        <Box
                                                                                            display={'flex'}
                                                                                            flexDirection={'column'}>
                                                                                            <Autocomplete
                                                                                                options={
                                                                                                    suggestStore?.suggestDonViQuiDoi ??
                                                                                                    []
                                                                                                }
                                                                                                getOptionLabel={(
                                                                                                    option
                                                                                                ) =>
                                                                                                    `${option.tenDonVi}`
                                                                                                }
                                                                                                value={
                                                                                                    suggestStore.suggestDonViQuiDoi?.find(
                                                                                                        (x) =>
                                                                                                            x.id ==
                                                                                                            item.idDonViQuiDoiMua
                                                                                                    ) ?? null
                                                                                                }
                                                                                                size="small"
                                                                                                fullWidth
                                                                                                disablePortal
                                                                                                onChange={async (
                                                                                                    event,
                                                                                                    value
                                                                                                ) => {
                                                                                                    setFieldValue(
                                                                                                        `khuyenMaiChiTiets.${index}.idDonViQuiDoiMua`,
                                                                                                        value?.id
                                                                                                    );
                                                                                                }}
                                                                                                renderInput={(
                                                                                                    params
                                                                                                ) => (
                                                                                                    <TextField
                                                                                                        {...params}
                                                                                                        sx={{
                                                                                                            marginTop:
                                                                                                                '6px'
                                                                                                        }}
                                                                                                        label={
                                                                                                            <Typography fontSize="13px">
                                                                                                                Mặt hàng
                                                                                                            </Typography>
                                                                                                        }
                                                                                                    />
                                                                                                )}
                                                                                            />
                                                                                            {errors.khuyenMaiChiTiets &&
                                                                                                errors
                                                                                                    .khuyenMaiChiTiets[
                                                                                                    index
                                                                                                ] && (
                                                                                                    <span className="text-danger">
                                                                                                        {
                                                                                                            (
                                                                                                                errors
                                                                                                                    .khuyenMaiChiTiets[0] as FormikErrors<KhuyenMaiChiTiet>
                                                                                                            )
                                                                                                                .idDonViQuiDoiMua
                                                                                                        }
                                                                                                    </span>
                                                                                                )}
                                                                                        </Box>
                                                                                    ) : null}
                                                                                    {values.hinhThucKM === 11 ||
                                                                                    values.hinhThucKM === 13 ||
                                                                                    values.hinhThucKM === 21 ? (
                                                                                        <Box
                                                                                            display={'flex'}
                                                                                            flexDirection={'column'}>
                                                                                            <NumericFormat
                                                                                                thousandSeparator={'.'}
                                                                                                decimalSeparator={','}
                                                                                                size="small"
                                                                                                label="Giảm giá"
                                                                                                sx={{
                                                                                                    marginTop: '6px'
                                                                                                }}
                                                                                                value={item.giamGia}
                                                                                                onChange={(e) => {
                                                                                                    const valueChange =
                                                                                                        e.target.value.replaceAll(
                                                                                                            '.',
                                                                                                            ''
                                                                                                        );
                                                                                                    setFieldValue(
                                                                                                        `khuyenMaiChiTiets.${index}.giamGia`,
                                                                                                        Number.parseInt(
                                                                                                            valueChange
                                                                                                        )
                                                                                                    );
                                                                                                }}
                                                                                                customInput={TextField}
                                                                                                name={`khuyenMaiChiTiets.${index}.giamGia`}
                                                                                            />
                                                                                            {errors.khuyenMaiChiTiets &&
                                                                                                errors
                                                                                                    .khuyenMaiChiTiets[
                                                                                                    index
                                                                                                ] && (
                                                                                                    <span className="text-danger">
                                                                                                        {
                                                                                                            (
                                                                                                                errors
                                                                                                                    .khuyenMaiChiTiets[0] as FormikErrors<KhuyenMaiChiTiet>
                                                                                                            ).giamGia
                                                                                                        }
                                                                                                    </span>
                                                                                                )}
                                                                                        </Box>
                                                                                    ) : null}
                                                                                    {values.hinhThucKM === 12 ||
                                                                                    values.hinhThucKM === 22 ? (
                                                                                        <Box
                                                                                            display={'flex'}
                                                                                            flexDirection={'column'}>
                                                                                            <NumericFormat
                                                                                                thousandSeparator={'.'}
                                                                                                decimalSeparator={','}
                                                                                                value={item.soLuongTang}
                                                                                                name={`khuyenMaiChiTiets.${index}.soLuongTang`}
                                                                                                size="small"
                                                                                                label={
                                                                                                    values.hinhThucKM ===
                                                                                                    12
                                                                                                        ? 'Số lượng tặng'
                                                                                                        : ''
                                                                                                }
                                                                                                sx={{
                                                                                                    marginTop: '6px'
                                                                                                }}
                                                                                                onChange={(e) => {
                                                                                                    const valueChange =
                                                                                                        e.target.value.replaceAll(
                                                                                                            '.',
                                                                                                            ''
                                                                                                        );
                                                                                                    setFieldValue(
                                                                                                        `khuyenMaiChiTiets.${index}.soLuongTang`,
                                                                                                        Number.parseInt(
                                                                                                            valueChange
                                                                                                        )
                                                                                                    );
                                                                                                }}
                                                                                                customInput={TextField}
                                                                                            />
                                                                                            {errors.khuyenMaiChiTiets &&
                                                                                                errors
                                                                                                    .khuyenMaiChiTiets[
                                                                                                    index
                                                                                                ] && (
                                                                                                    <span className="text-danger">
                                                                                                        {
                                                                                                            (
                                                                                                                errors
                                                                                                                    .khuyenMaiChiTiets[0] as FormikErrors<KhuyenMaiChiTiet>
                                                                                                            )
                                                                                                                .soLuongTang
                                                                                                        }
                                                                                                    </span>
                                                                                                )}
                                                                                        </Box>
                                                                                    ) : null}
                                                                                    {values.hinhThucKM === 11 ||
                                                                                    values.hinhThucKM === 13 ||
                                                                                    values.hinhThucKM === 21 ? (
                                                                                        <ToggleButtonGroup
                                                                                            value={
                                                                                                item.giamGiaTheoPhanTram ??
                                                                                                true
                                                                                            }
                                                                                            sx={{
                                                                                                marginTop: '6px'
                                                                                            }}
                                                                                            size="small">
                                                                                            <ToggleButton
                                                                                                onClick={() => {
                                                                                                    setFieldValue(
                                                                                                        `khuyenMaiChiTiets.${index}.giamGiaTheoPhanTram`,
                                                                                                        true
                                                                                                    );
                                                                                                }}
                                                                                                value={true}
                                                                                                sx={{
                                                                                                    width: '32px',
                                                                                                    height: '36px'
                                                                                                }}>
                                                                                                %
                                                                                            </ToggleButton>
                                                                                            <ToggleButton
                                                                                                value={false}
                                                                                                onClick={() => {
                                                                                                    setFieldValue(
                                                                                                        `khuyenMaiChiTiets.${index}.giamGiaTheoPhanTram`,
                                                                                                        false
                                                                                                    );
                                                                                                }}
                                                                                                sx={{
                                                                                                    padding: '5px',
                                                                                                    width: '32px',
                                                                                                    height: '36px'
                                                                                                }}>
                                                                                                đ
                                                                                            </ToggleButton>
                                                                                        </ToggleButtonGroup>
                                                                                    ) : null}

                                                                                    {values.hinhThucKM === 12 ||
                                                                                    values.hinhThucKM === 13 ||
                                                                                    values.hinhThucKM === 22 ||
                                                                                    values.hinhThucKM === 21 ? (
                                                                                        <Box
                                                                                            display={'flex'}
                                                                                            flexDirection={'column'}>
                                                                                            <Autocomplete
                                                                                                options={
                                                                                                    suggestStore?.suggestDonViQuiDoi ??
                                                                                                    []
                                                                                                }
                                                                                                getOptionLabel={(
                                                                                                    option
                                                                                                ) =>
                                                                                                    `${option.tenDonVi}`
                                                                                                }
                                                                                                value={
                                                                                                    suggestStore.suggestDonViQuiDoi?.find(
                                                                                                        (x) =>
                                                                                                            x.id ==
                                                                                                            item.idDonViQuiDoiTang
                                                                                                    ) ?? null
                                                                                                }
                                                                                                sx={{
                                                                                                    marginTop: '6px'
                                                                                                }}
                                                                                                size="small"
                                                                                                fullWidth
                                                                                                disablePortal
                                                                                                onChange={async (
                                                                                                    event,
                                                                                                    value
                                                                                                ) => {
                                                                                                    setFieldValue(
                                                                                                        `khuyenMaiChiTiets.${index}.idDonViQuiDoiTang`,
                                                                                                        value?.id
                                                                                                    );
                                                                                                }}
                                                                                                renderInput={(
                                                                                                    params
                                                                                                ) => (
                                                                                                    <TextField
                                                                                                        {...params}
                                                                                                        label={
                                                                                                            <Typography fontSize="13px">
                                                                                                                Mặt hàng
                                                                                                            </Typography>
                                                                                                        }
                                                                                                    />
                                                                                                )}
                                                                                            />
                                                                                            {errors.khuyenMaiChiTiets &&
                                                                                                errors
                                                                                                    .khuyenMaiChiTiets[
                                                                                                    index
                                                                                                ] && (
                                                                                                    <span className="text-danger">
                                                                                                        {
                                                                                                            (
                                                                                                                errors
                                                                                                                    .khuyenMaiChiTiets[0] as FormikErrors<KhuyenMaiChiTiet>
                                                                                                            )
                                                                                                                .idDonViQuiDoiTang
                                                                                                        }
                                                                                                    </span>
                                                                                                )}
                                                                                        </Box>
                                                                                    ) : null}
                                                                                    {values.hinhThucKM === 14 ||
                                                                                    values.hinhThucKM === 24 ? (
                                                                                        <Box
                                                                                            display={'flex'}
                                                                                            flexDirection={'column'}>
                                                                                            <NumericFormat
                                                                                                thousandSeparator={'.'}
                                                                                                decimalSeparator={','}
                                                                                                sx={{
                                                                                                    marginTop: '6px'
                                                                                                }}
                                                                                                size="small"
                                                                                                label={'Số điểm tặng'}
                                                                                                fullWidth
                                                                                                onChange={(e) => {
                                                                                                    const valueChange =
                                                                                                        e.target.value.replaceAll(
                                                                                                            '.',
                                                                                                            ''
                                                                                                        );
                                                                                                    setFieldValue(
                                                                                                        `khuyenMaiChiTiets.${index}.soDiemTang`,
                                                                                                        Number.parseInt(
                                                                                                            valueChange
                                                                                                        )
                                                                                                    );
                                                                                                }}
                                                                                                customInput={TextField}
                                                                                                value={item.soDiemTang}
                                                                                                name={`khuyenMaiChiTiets.${index}.soDiemTang`}
                                                                                            />
                                                                                            {errors.khuyenMaiChiTiets &&
                                                                                                errors
                                                                                                    .khuyenMaiChiTiets[
                                                                                                    index
                                                                                                ] && (
                                                                                                    <span className="text-danger">
                                                                                                        {
                                                                                                            (
                                                                                                                errors
                                                                                                                    .khuyenMaiChiTiets[0] as FormikErrors<KhuyenMaiChiTiet>
                                                                                                            ).soDiemTang
                                                                                                        }
                                                                                                    </span>
                                                                                                )}
                                                                                        </Box>
                                                                                    ) : null}
                                                                                    {values.hinhThucKM === 23 ? (
                                                                                        <Box
                                                                                            display={'flex'}
                                                                                            flexDirection={'column'}>
                                                                                            <NumericFormat
                                                                                                thousandSeparator={'.'}
                                                                                                decimalSeparator={','}
                                                                                                sx={{
                                                                                                    marginTop: '6px'
                                                                                                }}
                                                                                                size="small"
                                                                                                label={'Giá khuyến mại'}
                                                                                                fullWidth
                                                                                                onChange={(e) => {
                                                                                                    const valueChange =
                                                                                                        e.target.value.replaceAll(
                                                                                                            '.',
                                                                                                            ''
                                                                                                        );
                                                                                                    setFieldValue(
                                                                                                        `khuyenMaiChiTiets.${index}.giaKhuyenMai`,
                                                                                                        Number.parseInt(
                                                                                                            valueChange
                                                                                                        )
                                                                                                    );
                                                                                                }}
                                                                                                customInput={TextField}
                                                                                                value={
                                                                                                    item.giaKhuyenMai
                                                                                                }
                                                                                                name={`khuyenMaiChiTiets.${index}.giaKhuyenMai`}
                                                                                            />
                                                                                            {errors.khuyenMaiChiTiets &&
                                                                                                errors
                                                                                                    .khuyenMaiChiTiets[
                                                                                                    index
                                                                                                ] && (
                                                                                                    <span className="text-danger">
                                                                                                        {
                                                                                                            (
                                                                                                                errors
                                                                                                                    .khuyenMaiChiTiets[0] as FormikErrors<KhuyenMaiChiTiet>
                                                                                                            )
                                                                                                                .giaKhuyenMai
                                                                                                        }
                                                                                                    </span>
                                                                                                )}
                                                                                        </Box>
                                                                                    ) : null}
                                                                                    <IconButton
                                                                                        onClick={() => {
                                                                                            arrayHelpers.remove(index);
                                                                                        }}
                                                                                        sx={{
                                                                                            marginLeft: '5px',
                                                                                            marginTop: '6px'
                                                                                        }}>
                                                                                        <CloseIcon color="red" />
                                                                                    </IconButton>
                                                                                </Box>
                                                                            )
                                                                        )}
                                                                        <Button
                                                                            onClick={() =>
                                                                                arrayHelpers.insert(
                                                                                    values.khuyenMaiChiTiets.length + 1,
                                                                                    {
                                                                                        id: AppConsts.guidEmpty
                                                                                    }
                                                                                )
                                                                            }>
                                                                            Thêm điều kiện
                                                                        </Button>
                                                                    </Box>
                                                                ) : (
                                                                    <Button
                                                                        onClick={() =>
                                                                            arrayHelpers.push({
                                                                                id: AppConsts.guidEmpty
                                                                            })
                                                                        }>
                                                                        Thêm điều kiện
                                                                    </Button>
                                                                )}
                                                            </Box>
                                                        );
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                    <TabPanel value={tabIndex} index={1}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
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
                                                        error:
                                                            Boolean(errors.thoiGianApDung) && touched.thoiGianApDung
                                                                ? true
                                                                : false,
                                                        helperText: Boolean(errors.thoiGianApDung) &&
                                                            touched?.thoiGianApDung && (
                                                                <span className="text-danger">
                                                                    {String(errors.thoiGianApDung)}
                                                                </span>
                                                            )
                                                    }}
                                                    defaultVal={
                                                        values?.thoiGianApDung
                                                            ? formatDate(new Date(values?.thoiGianApDung), 'yyyy-MM-dd')
                                                            : ''
                                                    }
                                                    handleChangeDate={(value: string) => {
                                                        values.thoiGianApDung = value;
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DatePickerRequiredCustom
                                                    props={{
                                                        width: '100%',
                                                        size: 'small',
                                                        label: (
                                                            <Typography>
                                                                Ngày kêt thúc
                                                                <span className="text-danger"> *</span>
                                                            </Typography>
                                                        ),
                                                        error:
                                                            Boolean(errors?.thoiGianKetThuc) && touched?.thoiGianKetThuc
                                                                ? true
                                                                : false,
                                                        helperText: Boolean(errors?.thoiGianKetThuc) &&
                                                            touched.thoiGianKetThuc && (
                                                                <span className="text-danger">
                                                                    {String(errors?.thoiGianKetThuc)}
                                                                </span>
                                                            )
                                                    }}
                                                    defaultVal={
                                                        values?.thoiGianKetThuc
                                                            ? formatDate(
                                                                  new Date(values?.thoiGianKetThuc),
                                                                  'yyyy-MM-dd'
                                                              )
                                                            : ''
                                                    }
                                                    handleChangeDate={(value: string) => {
                                                        values.thoiGianKetThuc = value;
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Autocomplete
                                                    multiple
                                                    options={ThoiGianConst.thang}
                                                    getOptionLabel={(option) => `${option.displayName}`}
                                                    renderOption={(props, option, { selected }) => (
                                                        <li {...props}>
                                                            <Checkbox
                                                                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                                                style={{ marginRight: 8 }}
                                                                checked={selected}
                                                            />
                                                            {option.displayName}
                                                        </li>
                                                    )}
                                                    value={ThoiGianConst.thang.filter((x) =>
                                                        values?.thangApDungs?.includes(x.value)
                                                    )}
                                                    size="small"
                                                    fullWidth
                                                    disablePortal
                                                    onChange={(event, value) => {
                                                        setFieldValue(
                                                            'thangApDung',
                                                            value.map((x) => x.value)
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Theo tháng" />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Autocomplete
                                                    multiple
                                                    options={ThoiGianConst.ngay}
                                                    getOptionLabel={(option) => `${option.displayName}`}
                                                    renderOption={(props, option, { selected }) => (
                                                        <li {...props}>
                                                            <Checkbox
                                                                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                                                style={{ marginRight: 8 }}
                                                                checked={selected}
                                                            />
                                                            {option.displayName}
                                                        </li>
                                                    )}
                                                    value={ThoiGianConst.ngay.filter((x) =>
                                                        values?.ngayApDungs?.includes(x.value)
                                                    )}
                                                    size="small"
                                                    fullWidth
                                                    disablePortal
                                                    onChange={(event, value) => {
                                                        setFieldValue(
                                                            'ngayApDung',
                                                            value.map((x) => x.value)
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Theo ngày" />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Autocomplete
                                                    multiple
                                                    options={ThoiGianConst.thu}
                                                    getOptionLabel={(option) => `${option.displayName}`}
                                                    renderOption={(props, option, { selected }) => (
                                                        <li {...props}>
                                                            <Checkbox
                                                                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                                                style={{ marginRight: 8 }}
                                                                checked={selected}
                                                            />
                                                            {option.displayName}
                                                        </li>
                                                    )}
                                                    value={ThoiGianConst.thu.filter((x) =>
                                                        values?.thuApDungs?.includes(x.value)
                                                    )}
                                                    size="small"
                                                    fullWidth
                                                    disablePortal
                                                    onChange={(event, value) => {
                                                        setFieldValue(
                                                            'thuApDung',
                                                            value.map((x) => x.value)
                                                        );
                                                    }}
                                                    renderInput={(params) => <TextField {...params} label="Theo thứ" />}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Autocomplete
                                                    multiple
                                                    options={ThoiGianConst.gio}
                                                    getOptionLabel={(option) => `${option}`}
                                                    renderOption={(props, option, { selected }) => (
                                                        <li {...props}>
                                                            <Checkbox
                                                                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                                                style={{ marginRight: 8 }}
                                                                checked={selected}
                                                            />
                                                            {option}
                                                        </li>
                                                    )}
                                                    value={ThoiGianConst.gio.filter((x) =>
                                                        values?.gioApDungs?.includes(x)
                                                    )}
                                                    size="small"
                                                    fullWidth
                                                    disablePortal
                                                    onChange={(event, value) => {
                                                        setFieldValue('gioApDung', value);
                                                    }}
                                                    renderInput={(params) => <TextField {...params} label="Theo giờ" />}
                                                />
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                    <TabPanel value={tabIndex} index={2}>
                                        <Grid item xs={12}>
                                            <FormControl component="fieldset" variant="standard" fullWidth>
                                                <RadioGroup
                                                    row
                                                    value={values?.tatCaChiNhanh}
                                                    onChange={(e, v) => {
                                                        setFieldValue('idChiNhanhs', []);
                                                        setFieldValue('tatCaChiNhanh', v === 'true' ? true : false);
                                                    }}>
                                                    <FormControlLabel
                                                        control={<Radio value="true" />}
                                                        label="Toàn hệ thống"
                                                    />
                                                    <FormControlLabel
                                                        control={<Radio value="false" />}
                                                        label="Chi nhánh"
                                                    />
                                                </RadioGroup>
                                                <Autocomplete
                                                    multiple
                                                    disabled={values?.tatCaChiNhanh}
                                                    options={suggestStore?.suggestChiNhanh ?? []}
                                                    getOptionLabel={(option) => `${option.tenChiNhanh}`}
                                                    renderOption={(props, option, { selected }) => (
                                                        <li {...props}>
                                                            <Checkbox
                                                                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                                                style={{ marginRight: 8 }}
                                                                checked={selected}
                                                            />
                                                            {option.tenChiNhanh}
                                                        </li>
                                                    )}
                                                    value={suggestStore.suggestChiNhanh.filter((x) =>
                                                        values?.idChiNhanhs?.includes(x.id)
                                                    )}
                                                    size="small"
                                                    fullWidth
                                                    disablePortal
                                                    onChange={(event, value) => {
                                                        setFieldValue(
                                                            'idChiNhanhs',
                                                            value.map((x) => x.id)
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            placeholder="Chọn chi nhánh áp dụng..."
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                            <FormControl component="fieldset" variant="standard" fullWidth>
                                                <RadioGroup
                                                    row
                                                    value={values?.tatCaNhanVien}
                                                    onChange={(e, v) => {
                                                        setFieldValue('idNhanViens', []);
                                                        setFieldValue('tatCaNhanVien', v === 'true' ? true : false);
                                                    }}>
                                                    <FormControlLabel
                                                        control={<Radio value="true" />}
                                                        label="Toàn bô người bán"
                                                    />
                                                    <FormControlLabel
                                                        control={<Radio value={'false'} />}
                                                        label="Người bán"
                                                    />
                                                </RadioGroup>
                                                <Autocomplete
                                                    multiple
                                                    disabled={values?.tatCaNhanVien}
                                                    options={suggestStore?.suggestNhanVien ?? []}
                                                    getOptionLabel={(option) => `${option.tenNhanVien}`}
                                                    renderOption={(props, option, { selected }) => (
                                                        <li {...props}>
                                                            <Checkbox
                                                                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                                                style={{ marginRight: 8 }}
                                                                checked={selected}
                                                            />
                                                            {option.tenNhanVien}
                                                        </li>
                                                    )}
                                                    value={suggestStore.suggestNhanVien.filter((x) =>
                                                        values?.idNhanViens?.includes(x.id)
                                                    )}
                                                    size="small"
                                                    fullWidth
                                                    disablePortal
                                                    onChange={(event, value) => {
                                                        setFieldValue(
                                                            'idNhanViens',
                                                            value.map((x) => x.id)
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            placeholder="Chọn nhân viên áp dụng..."
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                            <FormControl component="fieldset" variant="standard" fullWidth>
                                                <RadioGroup
                                                    row
                                                    value={values?.tatCaKhachHang}
                                                    onChange={(e, value) => {
                                                        setFieldValue('idNhomKhachs', []);
                                                        setFieldValue(
                                                            'tatCaNhomKhach',
                                                            value === 'true' ? true : false
                                                        );
                                                    }}>
                                                    <FormControlLabel
                                                        control={<Radio value={'true'} />}
                                                        label="Toàn bộ khách hàng"
                                                    />
                                                    <FormControlLabel
                                                        control={<Radio value={'false'} />}
                                                        label="Nhóm khách hàng"
                                                    />
                                                </RadioGroup>
                                                <Autocomplete
                                                    multiple
                                                    disabled={values?.tatCaKhachHang}
                                                    options={suggestStore?.suggestNhomKhach ?? []}
                                                    getOptionLabel={(option) => `${option.tenNhomKhach}`}
                                                    renderOption={(props, option, { selected }) => (
                                                        <li {...props}>
                                                            <Checkbox
                                                                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                                                style={{ marginRight: 8 }}
                                                                checked={selected}
                                                            />
                                                            {option.tenNhomKhach}
                                                        </li>
                                                    )}
                                                    value={suggestStore.suggestNhomKhach.filter((x) =>
                                                        values?.idNhomKhachs?.includes(x.id)
                                                    )}
                                                    size="small"
                                                    fullWidth
                                                    disablePortal
                                                    onChange={(event, value) => {
                                                        setFieldValue(
                                                            'idNhomKhachs',
                                                            value.map((x) => x.id)
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            placeholder="Chọn nhóm khách hàng áp dụng..."
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </TabPanel>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label={
                                            <Typography variant="subtitle2" fontSize="14px">
                                                Ghi chú
                                            </Typography>
                                        }
                                        fullWidth
                                        type="text"
                                        multiline
                                        rows={4}
                                        size="small"
                                        name="ghiChu"
                                        value={values?.ghiChu}
                                        onChange={handleChange}></TextField>
                                </Grid>
                            </Grid>
                            <DialogActions sx={{ paddingRight: '0!important' }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleClose}
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
export default observer(CreateOrEditVoucher);
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}>
            {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
        </div>
    );
}
