import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { Component, ReactNode } from 'react';
import { ReactComponent as CloseIcon } from '../../../../images/close-square.svg';
import { Form, Formik } from 'formik';
import chucVuService from '../../../../services/nhan-vien/chuc_vu/chucVuService';
import suggestStore from '../../../../stores/suggestStore';
import { observer } from 'mobx-react';
import nhanVienStore from '../../../../stores/nhanVienStore';
import { CreateOrEditChucVuDto } from '../../../../services/nhan-vien/chuc_vu/dto/CreateOrEditChucVuDto';
import utils from '../../../../utils/utils';
import { Guid } from 'guid-typescript';
import * as yup from 'yup';

import SnackbarAlert from '../../../../components/AlertDialog/SnackbarAlert';
import ConfirmDelete from '../../../../components/AlertDialog/ConfirmDelete';
import { PropConfirmOKCancel } from '../../../../utils/PropParentToChild';
interface ModalProps {
    visiable: boolean;
    idChucVu: string;
    handleClose: () => void;
    handleSubmit: () => void;
}

class CreateOrEditChucVuModal extends Component<ModalProps> {
    state = {
        dialogTitle: '',
        objChucVu: {} as CreateOrEditChucVuDto,
        objAlert: { show: false, type: 1, mes: '' },
        inforDelete: new PropConfirmOKCancel({ show: false, title: '' })
    };

    ChucVu_GetDetail_byId = async (idChucVu: string) => {
        // get data from db
        const result = await chucVuService.ChucVu_GetDetail_byId(idChucVu);
        this.setState({
            objChucVu: {
                id: result.id,
                tenChucVu: result.tenChucVu,
                moTa: result.moTa,
                trangThai: result.trangThai
            } as CreateOrEditChucVuDto
        });
    };
    UNSAFE_componentWillReceiveProps(nextProp: ModalProps): void {
        if (utils.checkNull(nextProp?.idChucVu) || nextProp?.idChucVu == Guid.EMPTY) {
            this.setState({
                objChucVu: { id: Guid.EMPTY, tenChucVu: '', moTa: '', trangThai: 1 } as CreateOrEditChucVuDto,
                dialogTitle: 'Thêm mới '
            });
        } else {
            this.setState({
                dialogTitle: 'Cập nhật '
            });
            this.ChucVu_GetDetail_byId(nextProp.idChucVu);
        }
    }
    validate = yup.object().shape({
        tenChucVu: yup.string().required('Vui lòng nhập tên chức vụ')
    });
    deleteChucvu = async () => {
        await chucVuService.ChucVu_Delete(this.state.objChucVu.id);
        this.setState({
            objAlert: { show: true, mes: 'Xóa chức vụ thành công' }
        });
        this.setState({
            inforDelete: { show: false, mes: '' }
        });
        await suggestStore.getSuggestChucVu();
        this.props.handleSubmit();
    };
    render(): ReactNode {
        const initValues = this.state.objChucVu;

        return (
            <>
                <SnackbarAlert
                    showAlert={this.state.objAlert.show}
                    type={this.state.objAlert.type}
                    title={this.state.objAlert.mes}
                    handleClose={() => this.setState({ objAlert: { show: false } })}></SnackbarAlert>
                <ConfirmDelete
                    isShow={this.state.inforDelete.show}
                    title={this.state.inforDelete.title}
                    mes={this.state.inforDelete.mes}
                    onOk={this.deleteChucvu}
                    onCancel={() => this.setState({ inforDelete: { show: false } })}></ConfirmDelete>

                <Dialog fullWidth maxWidth="sm" open={this.props.visiable} onClose={this.props.handleClose}>
                    <Box>
                        <DialogTitle className="modal-title">
                            {this.state.dialogTitle} chức vụ
                            <Button
                                onClick={this.props.handleClose}
                                sx={{
                                    position: 'absolute',
                                    right: '16px',
                                    top: '16px',
                                    minWidth: 'unset',
                                    '&:hover svg': {
                                        filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                                    }
                                }}>
                                <CloseIcon />
                            </Button>
                        </DialogTitle>
                        <DialogContent sx={{ pt: '16px!important' }}>
                            <Formik
                                enableReinitialize
                                validationSchema={this.validate}
                                initialValues={initValues}
                                onSubmit={async (values) => {
                                    const result = await chucVuService.CreateOrEditChucVu(values);
                                    await suggestStore.getSuggestChucVu();
                                    nhanVienStore.createEditNhanVien.idChucVu = result.id;
                                    this.props.handleSubmit();
                                    this.setState({
                                        objAlert: { show: true, mes: this.state.dialogTitle + ' chức vụ thành công' }
                                    });
                                }}>
                                {({ handleChange, values, touched, errors }) => (
                                    <Form>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Stack spacing={0.5}>
                                                    <Stack direction={'row'} spacing={0.5}>
                                                        <Typography variant="body2" fontWeight={500}>
                                                            Tên chức vụ
                                                        </Typography>
                                                        <span style={{ color: 'red' }}>*</span>
                                                    </Stack>

                                                    <TextField
                                                        autoFocus
                                                        fullWidth
                                                        size="small"
                                                        name="tenChucVu"
                                                        value={values.tenChucVu}
                                                        onChange={handleChange}
                                                        helperText={touched.tenChucVu && errors.tenChucVu}
                                                        error={
                                                            touched.tenChucVu && Boolean(errors?.tenChucVu)
                                                        }></TextField>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Stack spacing={0.5}>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        Mô tả
                                                    </Typography>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        name="moTa"
                                                        value={values.moTa}
                                                        onChange={handleChange}></TextField>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Stack spacing={1} direction={'row'} justifyContent={'end'}>
                                                    <Button
                                                        onClick={this.props.handleClose}
                                                        variant="outlined"
                                                        sx={{ color: 'var(--color-main)!important' }}
                                                        className="btn-outline-hover">
                                                        Hủy
                                                    </Button>
                                                    {!utils.checkNull(values.id) && values.id !== Guid.EMPTY && (
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            onClick={() =>
                                                                this.setState({
                                                                    inforDelete: {
                                                                        show: true,
                                                                        title: 'Thông báo xóa',
                                                                        mes:
                                                                            'Bạn có chắc chắn muốn xóa chức vụ ' +
                                                                            values.tenChucVu +
                                                                            ' không?'
                                                                    }
                                                                })
                                                            }>
                                                            Xóa
                                                        </Button>
                                                    )}

                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        className="btn-container-hover">
                                                        Lưu
                                                    </Button>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Form>
                                )}
                            </Formik>
                        </DialogContent>
                    </Box>
                </Dialog>
            </>
        );
    }
}
export default observer(CreateOrEditChucVuModal);
