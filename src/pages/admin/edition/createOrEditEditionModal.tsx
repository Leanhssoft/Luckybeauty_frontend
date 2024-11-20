import React, { useState } from 'react';
import CreateOrEditEditionDto from '../../../services/editions/dto/CreateOrEditEditionDto';
import FlatFeatureDto from '../../../services/editions/dto/FlatFeatureDto';
import NameValueDto from '../../../services/dto/NameValueDto';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormGroup,
    IconButton,
    Stack,
    Tab,
    TextField,
    Typography
} from '@mui/material';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import { FieldArray, Form, Formik } from 'formik';
import rules from './createOrEditEdition.validate';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import editionService from '../../../services/editions/editionService';
import { enqueueSnackbar } from 'notistack';
export interface ICreateOrEditUserProps {
    visible: boolean;
    onCancel: () => void;
    onOk: () => void;
    formRef: CreateOrEditEditionDto;
    allFeatures: FlatFeatureDto[];
    allFeatureValues: NameValueDto[];
}
const CreateOrEditEditionModal = (props: ICreateOrEditUserProps) => {
    const [tabValue, setTabValue] = useState('1');
    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };
    return (
        <Dialog open={props.visible} onClose={props.onCancel} fullWidth maxWidth="sm">
            <DialogTitle>
                <Typography variant="h3" fontSize="24px" fontWeight="700">
                    {props.formRef.edition !== undefined && props.formRef.edition?.id > 0
                        ? 'Cập nhật phiên bản'
                        : 'Thêm mới phiên bản'}
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={props.onCancel}
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
            <DialogContent sx={{ paddingBottom: '0' }}>
                <Formik
                    initialValues={props.formRef}
                    validationSchema={rules}
                    onSubmit={async (values, formikHelper) => {
                        //console.log(JSON.stringify(values));
                        const response = await editionService.createOrEditEdition(values);
                        response.success == true
                            ? values.edition.id === 0
                                ? enqueueSnackbar('Thêm mới thành công!', {
                                      variant: 'success',
                                      autoHideDuration: 3000
                                  })
                                : enqueueSnackbar('Dữ liệu được chỉnh sửa thành công!', {
                                      variant: 'success',
                                      autoHideDuration: 3000
                                  })
                            : enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại sau!', {
                                  variant: 'error',
                                  autoHideDuration: 3000
                              });
                        //formikHelper.setSubmitting(true);
                        formikHelper.resetForm();
                        props.onOk();
                    }}>
                    {({ values, touched, setFieldValue, errors, isSubmitting, handleChange }) => (
                        <Form>
                            <TabContext value={tabValue}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={handleTabChange}>
                                        <Tab
                                            label="Thông tin phiên bản"
                                            value="1"
                                            sx={{ textTransform: 'unset!important' }}
                                        />
                                        <Tab label="Tính năng" value="2" sx={{ textTransform: 'unset!important' }} />
                                    </TabList>
                                </Box>
                                <TabPanel value="1" sx={{ padding: '16px 0px 0px 0px' }}>
                                    <Box display={'flex'} flexDirection={'column'} gap={2}>
                                        <FormGroup>
                                            <TextField
                                                label={
                                                    <label>
                                                        Tên phiên bản
                                                        <span
                                                            style={{
                                                                color: 'red',
                                                                marginLeft: '3px'
                                                            }}>
                                                            *
                                                        </span>
                                                    </label>
                                                }
                                                error={touched.edition?.name && errors.edition?.name ? true : false}
                                                helperText={
                                                    touched.edition?.name &&
                                                    errors.edition?.name && <span>{errors.edition?.name}</span>
                                                }
                                                size="small"
                                                fullWidth
                                                name="edition.name"
                                                value={values.edition.name}
                                                onChange={handleChange}></TextField>
                                        </FormGroup>
                                        <FormGroup>
                                            <TextField
                                                label={
                                                    <label>
                                                        Tên hiển thị
                                                        <span
                                                            style={{
                                                                color: 'red',
                                                                marginLeft: '3px'
                                                            }}>
                                                            *
                                                        </span>
                                                    </label>
                                                }
                                                error={touched.edition?.name && errors.edition?.name ? true : false}
                                                helperText={
                                                    touched.edition?.name &&
                                                    errors.edition?.name && <span>{errors.edition?.name}</span>
                                                }
                                                size="small"
                                                fullWidth
                                                name="edition.displayName"
                                                value={values.edition.displayName}
                                                onChange={handleChange}></TextField>
                                        </FormGroup>
                                        <FormGroup>
                                            <TextField
                                                label={'Giá'}
                                                size="small"
                                                fullWidth
                                                name="edition.price"
                                                value={values.edition.price}
                                                onChange={handleChange}></TextField>
                                        </FormGroup>
                                    </Box>
                                </TabPanel>
                                <TabPanel value="2" sx={{ padding: '16px 0px 0px 0px' }}>
                                    <Box display={'flex'} flexDirection={'column'} gap={1.5}>
                                        {props.allFeatures
                                            .filter((x) => x.parentName === null)
                                            .map((item, index) => {
                                                return (
                                                    <Stack
                                                        direction={'row'}
                                                        key={index}
                                                        spacing={2}
                                                        alignItems={'center'}>
                                                        {item.inputType.name === 'CHECKBOX' ? (
                                                            <Checkbox
                                                                sx={{ flex: 1 }}
                                                                defaultChecked={item.defaultValue === 'true'}
                                                                checked={
                                                                    values.featureValues.find(
                                                                        (x) => x.name == item.name
                                                                    )?.value === 'true'
                                                                }
                                                                onChange={(e, checked) => {
                                                                    if (checked === true) {
                                                                        const oldFeature = values.featureValues.filter(
                                                                            (x) => x.name != item.name
                                                                        );
                                                                        const newFeature = [
                                                                            ...oldFeature,
                                                                            { name: item.name, value: 'true' }
                                                                        ];
                                                                        setFieldValue('featureValues', newFeature);
                                                                    } else {
                                                                        const oldFeature = values.featureValues.filter(
                                                                            (x) => x.name != item.name
                                                                        );
                                                                        const newFeature = [
                                                                            ...oldFeature,
                                                                            { name: item.name, value: 'false' }
                                                                        ];
                                                                        setFieldValue('featureValues', newFeature);
                                                                    }
                                                                }}
                                                            />
                                                        ) : null}
                                                        {item.inputType.name === 'SINGLE_LINE_STRING' ? (
                                                            <Checkbox
                                                                sx={{ flex: 1 }}
                                                                checked={
                                                                    values.featureValues
                                                                        .map((item) => {
                                                                            return item.name;
                                                                        })
                                                                        .includes(item.name)
                                                                        ? true
                                                                        : false
                                                                }
                                                                onChange={(e, checked) => {
                                                                    if (checked === true) {
                                                                        const selectedFeature =
                                                                            props.allFeatureValues.filter(
                                                                                (x) => x.name == item.name
                                                                            )[0];
                                                                        const newFeature = [
                                                                            ...values.featureValues,
                                                                            selectedFeature
                                                                        ];
                                                                        setFieldValue('featureValues', newFeature);
                                                                    } else {
                                                                        setFieldValue(
                                                                            'featureValues',
                                                                            values.featureValues.filter(
                                                                                (x) => x.name != item.name
                                                                            )
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        ) : null}
                                                        <Stack
                                                            direction={'row'}
                                                            alignItems={'center'}
                                                            spacing={2}
                                                            sx={{ flex: 11 }}>
                                                            <Typography variant="body2" sx={{ flex: 2 }}>
                                                                {item.displayName}
                                                            </Typography>
                                                            {item.inputType.name === 'SINGLE_LINE_STRING' ? (
                                                                <TextField
                                                                    type={
                                                                        item.inputType.validator.name === 'NUMERIC'
                                                                            ? 'number'
                                                                            : 'text'
                                                                    }
                                                                    size="small"
                                                                    defaultValue={item.defaultValue}
                                                                    value={
                                                                        values.featureValues.find(
                                                                            (x) => x.name == item.name
                                                                        )?.value
                                                                    }
                                                                    onChange={(e) => {
                                                                        const indexValue =
                                                                            values.featureValues.findIndex(
                                                                                (x) => x.name == item.name
                                                                            );
                                                                        setFieldValue(
                                                                            `featureValues[${indexValue}].value`,
                                                                            e.target.value
                                                                        );
                                                                    }}></TextField>
                                                            ) : null}
                                                        </Stack>
                                                    </Stack>
                                                );
                                            })}
                                    </Box>
                                </TabPanel>
                            </TabContext>
                            <DialogActions
                                sx={{
                                    padding: '16px 0px 16px 0px !important',
                                    position: 'sticky',
                                    bottom: '0',
                                    left: '0',
                                    zIndex: '5',
                                    bgcolor: '#fff'
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
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            color: 'var(--color-main)',
                                            fontSize: '14px'
                                        }}
                                        onClick={props.onCancel}
                                        className="btn-outline-hover">
                                        Hủy
                                    </Button>
                                    {!isSubmitting ? (
                                        <Button
                                            variant="contained"
                                            sx={{ fontSize: '14px' }}
                                            size="small"
                                            type="submit"
                                            className="btn-container-hover">
                                            Lưu
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            sx={{ fontSize: '14px' }}
                                            size="small"
                                            className="btn-container-hover">
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

export default CreateOrEditEditionModal;
