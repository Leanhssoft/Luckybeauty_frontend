import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    TextField,
    Typography,
    Checkbox,
    Box,
    createTheme,
    ThemeProvider
} from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CustomCkeditor from '../../../../components/ckeditor/CustomCkeditor';
import MauInServices from '../../../../services/mau_in/MauInServices';
import DataMauIn from './DataMauIn';
import utils from '../../../../utils/utils';
import SelectMauIn from '../../../../components/Select/SelectMauIn';
import { MauInDto } from '../../../../services/mau_in/MauInDto';
import { PropConfirmOKCancel } from '../../../../utils/PropParentToChild';
import ConfirmDelete from '../../../../components/AlertDialog/ConfirmDelete';
import TokenMauIn from './TokenMauIn';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import abpCustom from '../../../../components/abp-custom';

const zIndexDialog = createTheme({
    components: {
        MuiDialog: {
            styleOverrides: {
                root: {
                    zIndex: 20 // !important: (default 1300), use to show tableToolbar of CKEditor
                }
            }
        }
    }
});

export default function ModalAddMauIn({
    lstMauIn,
    isShowModal,
    idUpdate = '',
    tenLoaiChungTu,
    idLoaiChungTu,
    handleSave,
    onClose,
    onDelete
}: any) {
    const [idChosed, setIdChosed] = useState('');
    const [html, setHtml] = useState('');
    const [dataPrint, setDataPrint] = useState('');
    const [tenMauIn, setTenMauIn] = useState('');
    const [isCheckMauMacDinh, setIsCheckMauMacDinh] = useState(false);
    const [txtLoaiChungTu, setTxtLoaiChungTu] = useState('');
    const [isClickSave, setIsClickSave] = useState(false);
    const [isShowToken, setIsShowToken] = useState(false);
    const [inforObjDelete, setInforObjDelete] = useState<PropConfirmOKCancel>(new PropConfirmOKCancel({ show: false }));
    // const errtenMauIn = isClickSave && utils.checkNull(tenMauIn) ? 'Vui lòng nhập tên mẫu in' : '';
    const errtenMauIn = '';

    const BindDataPrint = async (html: string) => {
        switch (tenLoaiChungTu) {
            case 'SQPT':
            case 'SQPC':
                {
                    let dataAfter = DataMauIn.replaceChiNhanh(html);
                    dataAfter = await DataMauIn.replacePhieuThuChi(dataAfter);
                    setDataPrint(() => dataAfter);
                }
                break;
            default:
                {
                    let dataAfter = DataMauIn.replaceChiTietHoaDon(html);
                    dataAfter = DataMauIn.replaceChiNhanh(dataAfter);
                    dataAfter = DataMauIn.replaceHoaDon(dataAfter);
                    setDataPrint(() => dataAfter);
                }
                break;
        }
    };

    const GetContentMauInMacDinh = async (loai = 1) => {
        //Loai (1.k80,2.a4)
        const data = await MauInServices.GetContentMauInMacDinh(loai, idLoaiChungTu);
        setHtml(data);
    };

    useEffect(() => {
        if (isShowModal) {
            if (utils.checkNull(idUpdate)) {
                // insert
                setIdChosed('1');
                GetContentMauInMacDinh(1);

                setTenMauIn('');
                setIsCheckMauMacDinh(false);
            } else {
                setIdChosed(idUpdate);
                // update
                const itEx = lstMauIn.filter((x: MauInDto) => x.id === idUpdate);
                if (itEx.length > 0) {
                    setHtml(itEx[0].noiDungMauIn);

                    setTenMauIn(itEx[0].tenMauIn);
                    setIsCheckMauMacDinh(itEx[0].laMacDinh);
                } else {
                    setHtml('');
                }
            }
            setIsClickSave(false);

            let txt = '';
            switch (idLoaiChungTu) {
                case 11:
                    txt = 'phiếu thu';
                    break;
                case 12:
                    txt = 'phiếu chi';
                    break;
                default:
                    txt = 'hóa đơn';
                    break;
            }
            setTxtLoaiChungTu(txt);
        }
    }, [isShowModal]);

    const changeMauIn = (item: MauInDto) => {
        setIdChosed(item.id);
        if (item.id.length < 36) {
            GetContentMauInMacDinh(parseInt(item.id));
        } else {
            const itEx = lstMauIn.filter((x: MauInDto) => x.id === item.id);
            if (itEx.length > 0) {
                setHtml(itEx[0].noiDungMauIn);
            }
        }
    };

    const onChangeCkeditor = (shtmlNew: string) => {
        BindDataPrint(shtmlNew);
        setHtml(() => shtmlNew); // gán lại để cập nhật html + lưu
    };

    const saveMauIn = () => {
        setIsClickSave(true);
        if (utils.checkNull(tenMauIn)) {
            return;
        }
        const data = {
            id: idUpdate,
            laMacDinh: isCheckMauMacDinh,
            tenMauIn: tenMauIn,
            noiDungMauIn: html
        };
        handleSave(data);
    };

    const deleteMauIn = () => {
        setInforObjDelete(
            new PropConfirmOKCancel({
                show: false,
                title: '',
                mes: ''
            })
        );
        onClose();
        onDelete();
    };
    return (
        <>
            <TokenMauIn isShow={isShowToken} onClose={() => setIsShowToken(false)} />
            <ConfirmDelete
                isShow={inforObjDelete.show}
                title={inforObjDelete.title}
                mes={inforObjDelete.mes}
                onOk={deleteMauIn}
                onCancel={() => setInforObjDelete({ ...inforObjDelete, show: false })}></ConfirmDelete>
            <ThemeProvider theme={zIndexDialog}>
                <Dialog disableEnforceFocus open={isShowModal} onClose={onClose} fullWidth maxWidth="xl">
                    <DialogTitle>
                        <Stack spacing={1} direction={'row'}>
                            <span>
                                {' '}
                                {utils.checkNull(idUpdate) ? 'Thêm' : 'Cập nhật'} mẫu in {txtLoaiChungTu}
                            </span>
                            <InfoOutlinedIcon
                                titleAccess="Danh sách token mẫu in"
                                sx={{ color: 'chocolate' }}
                                onClick={() => setIsShowToken(true)}
                            />
                        </Stack>
                        <Stack
                            onClick={onClose}
                            sx={{
                                minWidth: 'unset',
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                '&:hover svg': {
                                    filter: 'brightness(0) saturate(100%) invert(21%) sepia(100%) saturate(3282%) hue-rotate(337deg) brightness(85%) contrast(105%)'
                                }
                            }}>
                            <CloseOutlinedIcon sx={{ width: 30, height: 30 }} />
                        </Stack>
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <Grid container>
                                    <Grid item xs={12} sm={2} md={2} lg={2}>
                                        <span className="modal-lable">Tên mẫu in</span>
                                    </Grid>
                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            value={tenMauIn}
                                            onChange={(e) => {
                                                setTenMauIn(e.target.value);
                                            }}
                                            helperText={errtenMauIn}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={5} md={5} lg={5}>
                                        <Box sx={{ float: 'right' }}>
                                            <Checkbox
                                                checked={isCheckMauMacDinh}
                                                onChange={(e) => setIsCheckMauMacDinh(e.target.checked)}
                                            />
                                            <span className="modal-lable" style={{ fontSize: '14px' }}>
                                                Là mẫu in mặc định
                                            </span>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={2} md={2} lg={2}>
                                        <span className="modal-lable">Mẫu gợi ý</span>
                                    </Grid>
                                    <Grid item xs={12} sm={8} md={5} lg={5}>
                                        <SelectMauIn data={lstMauIn} idChosed={idChosed} handleChange={changeMauIn} />
                                    </Grid>
                                    <Grid item xs={12} md={5} lg={5}>
                                        <Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
                                            <Button variant="contained" onClick={saveMauIn}>
                                                Lưu mẫu in
                                            </Button>
                                            {!utils.checkNull(idUpdate) && (
                                                <Stack spacing={1} direction={'row'}>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => {
                                                            setInforObjDelete(
                                                                new PropConfirmOKCancel({
                                                                    show: true,
                                                                    title: 'Xác nhận xóa',
                                                                    mes: `Bạn có chắc chắn muốn xóa mẫu in ${tenMauIn} không?`
                                                                })
                                                            );
                                                        }}
                                                        sx={{
                                                            display: abpCustom.isGrandPermission('Pages.MauIn.Delete')
                                                                ? ''
                                                                : 'none'
                                                        }}>
                                                        Xóa mẫu in
                                                    </Button>
                                                    <Button variant="contained" sx={{ display: 'none' }}>
                                                        Sao chép
                                                    </Button>
                                                </Stack>
                                            )}
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sm={12} md={6} lg={6} width={'100%'}>
                                <CustomCkeditor html={html} handleChange={onChangeCkeditor} />
                            </Grid>
                            <Grid item sm={12} md={6} lg={6}>
                                <div className="ck-content" dangerouslySetInnerHTML={{ __html: dataPrint }}></div>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </ThemeProvider>
        </>
    );
}
