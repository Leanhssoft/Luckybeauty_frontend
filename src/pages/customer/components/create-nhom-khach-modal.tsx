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
import { Form, Formik } from 'formik';
import { Component } from 'react';
import AppConsts from '../../../lib/appconst';
import suggestStore from '../../../stores/suggestStore';
import { enqueueSnackbar } from 'notistack';

import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import khachHangService from '../../../services/khach-hang/khachHangService';
import { observer } from 'mobx-react';
import khachHangStore from '../../../stores/khachHangStore';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import abpCustom from '../../../components/abp-custom';
interface ModalProps {
    visiable: boolean;
    handleClose: () => void;
}
class CreateOrEditNhomKhachModal extends Component<ModalProps> {
    state = {
        isShowConfirmDelete: false,
        mesDelete: ''
    };
    onOkDelete = async () => {
        const result = await khachHangService.XoaNhomKhachHang(khachHangStore.createOrEditNhomKhachDto?.id);
        this.setState({ isShowConfirmDelete: false });
        if (result !== null) {
            enqueueSnackbar('Xóa nhóm khách thành công', {
                variant: 'success',
                autoHideDuration: 3000
            });
            await suggestStore.getSuggestNhomKhach();
            this.props.handleClose();
        } else {
            enqueueSnackbar('Xóa nhóm khách thất bại', {
                variant: 'error',
                autoHideDuration: 3000
            });
        }
    };

    render() {
        return (
            <>
                <ConfirmDelete
                    isShow={this.state.isShowConfirmDelete}
                    mes={this.state.mesDelete}
                    onOk={this.onOkDelete}
                    onCancel={() =>
                        this.setState({
                            isShowConfirmDelete: false,
                            mes: ''
                        })
                    }></ConfirmDelete>
                <Dialog fullWidth maxWidth="xs" open={this.props.visiable} onClose={this.props.handleClose}>
                    <Box>
                        <DialogTitle className="modal-title">
                            {khachHangStore.createOrEditNhomKhachDto?.id != AppConsts.guidEmpty
                                ? 'Cập nhật '
                                : 'Thêm mới '}
                            nhóm khách
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
                        <DialogContent>
                            <Formik
                                initialValues={khachHangStore.createOrEditNhomKhachDto}
                                onSubmit={async (values) => {
                                    values.id = khachHangStore.createOrEditNhomKhachDto.id;
                                    await khachHangService.createNhomKhach(values);
                                    await suggestStore.getSuggestNhomKhach();
                                    await khachHangStore.createNewNhomKhachDto();
                                    this.props.handleClose();
                                }}>
                                {({ handleChange, values }) => (
                                    <Form>
                                        <Grid container spacing={2} paddingTop={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    autoFocus
                                                    fullWidth
                                                    label="Tên nhóm khách"
                                                    size="small"
                                                    value={values.tenNhomKhach}
                                                    name="tenNhomKhach"
                                                    onChange={handleChange}></TextField>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label=" Mô tả"
                                                    size="small"
                                                    value={values.moTa}
                                                    name="moTa"
                                                    onChange={handleChange}></TextField>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Stack spacing={1} direction={'row'} justifyContent={'flex-end'}>
                                                    <Button
                                                        onClick={this.props.handleClose}
                                                        variant="outlined"
                                                        sx={{
                                                            color: 'var(--color-main)!important'
                                                        }}
                                                        className="btn-outline-hover">
                                                        Hủy
                                                    </Button>
                                                    {khachHangStore.createOrEditNhomKhachDto?.id !=
                                                        AppConsts.guidEmpty && (
                                                        <Button
                                                            variant="outlined"
                                                            sx={{
                                                                display: abpCustom.isGrandPermission(
                                                                    'Pages.NhomKhach.Delete'
                                                                )
                                                                    ? ''
                                                                    : 'none'
                                                            }}
                                                            onClick={() =>
                                                                this.setState({
                                                                    isShowConfirmDelete: true,
                                                                    mesDelete: ` Bạn có chắc chắn muốn xóa nhóm khách hàng ${values.tenNhomKhach} không?`
                                                                })
                                                            }
                                                            color="error">
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
export default observer(CreateOrEditNhomKhachModal);
