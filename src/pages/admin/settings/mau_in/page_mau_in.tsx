import React, { useContext } from 'react';
import { Box, Grid, Tabs, Tab, Stack, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { OpenInNew } from '@mui/icons-material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MauInServices from '../../../../services/mau_in/MauInServices';
import { MauInDto } from '../../../../services/mau_in/MauInDto';
import ModalAddMauIn from './modal_add_mau_in';
import utils from '../../../../utils/utils';
import { AppContext } from '../../../../services/chi_nhanh/ChiNhanhContext';
import DataMauIn from './DataMauIn';
import SelectMauIn from '../../../../components/Select/SelectMauIn';
import SnackbarAlert from '../../../../components/AlertDialog/SnackbarAlert';
import CustomCkeditor from '../../../../components/ckeditor/CustomCkeditor';
import { Guid } from 'guid-typescript';
import { PropConfirmOKCancel } from '../../../../utils/PropParentToChild';
import ConfirmDelete from '../../../../components/AlertDialog/ConfirmDelete';
import TokenMauIn from './TokenMauIn';
import abpCustom from '../../../../components/abp-custom';
import { ButtonNavigate } from '../../../../components/Button/ButtonNavigate';
import { LoaiChungTu } from '../../../../lib/appconst';

export default function PageMauIn() {
    const [html, setHtml] = useState('');
    const [dataPrint, setdataPrint] = useState('');
    const [allMauIn, setAllMauIn] = useState<MauInDto[]>([]);
    const appContext = useContext(AppContext);
    const chinhanhCurrent = appContext.chinhanhCurrent;

    const [lstMauIn, setListMauIn] = useState<MauInDto[]>([]);
    const [idMauInChosed, setIdMauInChosed] = useState<string>('');
    const [isShowModalAddMauIn, setIsShowModalAddMauIn] = useState(false);
    const [idLoaiChungTu, setIdLoaiChungTu] = useState(1);
    const [newMauIn, setNewMauIn] = useState<MauInDto>({} as MauInDto);
    const [idMauInUpdate, setIdMauInUpdate] = useState('');
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [inforObjDelete, setInforObjDelete] = useState<PropConfirmOKCancel>(new PropConfirmOKCancel({ show: false }));
    const [isShowToken, setIsShowToken] = useState(false);

    useEffect(() => {
        GetAllMauIn_byChiNhanh();
    }, []);

    const GetAllMauIn_byChiNhanh = async () => {
        const data = await MauInServices.GetAllMauIn_byChiNhanh();
        setAllMauIn(data);
        setListMauInHoaDon(data);
    };

    const BindDataPrint = async (shtml: string) => {
        // !import: replace theo thu tu: cthd, hoadon
        switch (idLoaiChungTu) {
            case LoaiChungTu.HOA_DON_BAN_LE:
            case LoaiChungTu.GOI_DICH_VU:
                {
                    let dataAfter = DataMauIn.replaceChiTietHoaDon(shtml);
                    dataAfter = DataMauIn.replaceChiNhanh(dataAfter);
                    dataAfter = DataMauIn.replaceHoaDon(dataAfter);
                    if (shtml.includes('QRCode')) {
                        dataAfter = await DataMauIn.replacePhieuThuChi(dataAfter);
                    }
                    setdataPrint(dataAfter);
                }
                break;
            case LoaiChungTu.THE_GIA_TRI:
                {
                    let dataAfter = DataMauIn.replaceHoaDon(shtml);
                    dataAfter = DataMauIn.replaceChiNhanh(dataAfter);
                    if (shtml.includes('QRCode')) {
                        dataAfter = await DataMauIn.replacePhieuThuChi(dataAfter);
                    }
                    setdataPrint(dataAfter);
                }
                break;
            case LoaiChungTu.PHIEU_THU:
            case LoaiChungTu.PHIEU_CHI:
                {
                    let dataAfter = DataMauIn.replaceChiNhanh(shtml);
                    dataAfter = await DataMauIn.replacePhieuThuChi(dataAfter);
                    setdataPrint(dataAfter);
                }
                break;
        }
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setIdLoaiChungTu(newValue);
        setListMauInHoaDon(allMauIn, newValue);
    };

    const setListMauInHoaDon = (allMauIn: MauInDto[], idLoaiChungTu = LoaiChungTu.HOA_DON_BAN_LE) => {
        const mauInByLoaiChungTu = allMauIn.filter((x: MauInDto) => x.loaiChungTu === idLoaiChungTu);
        const mauMacDinh = mauInByLoaiChungTu.filter((x: MauInDto) => x.laMacDinh);
        const tempK80: MauInDto = {
            id: '1',
            tenMauIn: 'Mẫu mặc định',
            laMacDinh: false
        } as MauInDto;
        if (mauMacDinh.length === 0) {
            tempK80.laMacDinh = true;
            setListMauIn([tempK80, ...mauInByLoaiChungTu]);
            setIdMauInChosed('1');
        } else {
            setListMauIn([...mauInByLoaiChungTu, tempK80]);
            setIdMauInChosed(mauMacDinh[0].id);
            setNewMauIn(mauMacDinh[0]);
        }
    };

    const showModalAddMauIn = () => {
        setIsShowModalAddMauIn(true);
        setIdMauInUpdate('');
    };

    const changeMauIn = (item: MauInDto) => {
        setIdMauInChosed(item.id);
        setNewMauIn(item);
    };

    useEffect(() => {
        if (!utils.checkNull(idMauInChosed)) {
            if (idMauInChosed.toString().length < 36) {
                // mau txt (k80)
                GetContentMauInMacDinh(parseInt(idMauInChosed));
            } else {
                // mauDB
                const itEx = lstMauIn.filter((x: MauInDto) => x.id === idMauInChosed);
                if (itEx.length > 0) {
                    setHtml(itEx[0].noiDungMauIn);
                } else {
                    setHtml('');
                }
            }
        }
    }, [idMauInChosed, idLoaiChungTu]);

    const AssignAgainListMauIn_afterSave = (objMauIn: MauInDto) => {
        setNewMauIn({
            ...newMauIn,
            laMacDinh: objMauIn.laMacDinh,
            tenMauIn: objMauIn.tenMauIn,
            noiDungMauIn: objMauIn.noiDungMauIn
        });
        setListMauIn(() =>
            lstMauIn.map((x: MauInDto) => {
                if (x.id === objMauIn.id) {
                    return {
                        ...x,
                        laMacDinh: objMauIn.laMacDinh,
                        tenMauIn: objMauIn.tenMauIn,
                        noiDungMauIn: objMauIn.noiDungMauIn
                    };
                } else {
                    return x;
                }
            })
        );
        setAllMauIn(() =>
            lstMauIn.map((x: MauInDto) => {
                if (x.id === objMauIn.id) {
                    return {
                        ...x,
                        laMacDinh: objMauIn.laMacDinh,
                        tenMauIn: objMauIn.tenMauIn,
                        noiDungMauIn: objMauIn.noiDungMauIn
                    };
                } else {
                    return x;
                }
            })
        );
    };

    const saveMauIn = async (dataMauIn: any) => {
        setIsShowModalAddMauIn(false);

        setHtml(() => dataMauIn.noiDungMauIn);

        const dataNew = {
            ...dataMauIn
        };
        dataNew.loaiChungTu = idLoaiChungTu;
        dataNew.idChiNhanh = chinhanhCurrent.id;

        if (utils.checkNull(idMauInUpdate)) {
            // insert
            dataNew.id = Guid.EMPTY;
            const data = await MauInServices.InsertMauIn(dataNew);
            dataNew.id = data.id;
            setObjAlert({ ...objAlert, show: true, mes: 'Thêm mới mẫu in thành công' });

            setListMauIn(() => [dataNew, ...lstMauIn]);
            setAllMauIn(() => [dataNew, ...allMauIn]);
            setIdMauInChosed(data.id);

            setNewMauIn(() => {
                return {
                    ...newMauIn,
                    id: dataNew.id,
                    idChiNhanh: dataNew.idChiNhanh,
                    loaiChungTu: idLoaiChungTu,
                    tenMauIn: dataMauIn.tenMauIn,
                    noiDungMauIn: dataMauIn.noiDungMauIn
                };
            });
        } else {
            await MauInServices.UpdatetMauIn(dataNew);
            setObjAlert({ ...objAlert, show: true, mes: 'Cập nhật mẫu in thành công' });

            setNewMauIn(() => {
                return {
                    ...newMauIn,
                    id: dataNew.id,
                    loaiChungTu: idLoaiChungTu,
                    tenMauIn: dataMauIn.tenMauIn,
                    noiDungMauIn: dataMauIn.noiDungMauIn
                };
            });
            AssignAgainListMauIn_afterSave(dataNew);
        }
    };

    const UpdateMauIn = async () => {
        await MauInServices.UpdatetMauIn(newMauIn);
        setObjAlert({ ...objAlert, show: true, mes: 'Cập nhật mẫu in thành công' });
        AssignAgainListMauIn_afterSave(newMauIn);
    };

    const tenLoaiChungTu = () => {
        let sLoai = '';
        switch (idLoaiChungTu) {
            case LoaiChungTu.HOA_DON_BAN_LE:
                sLoai = 'HD';
                break;
            case LoaiChungTu.GOI_DICH_VU:
                sLoai = 'GDV';
                break;
            case LoaiChungTu.PHIEU_THU:
                sLoai = 'SQPT';
                break;
            case LoaiChungTu.PHIEU_CHI:
                sLoai = 'SQPC';
                break;
        }
        return sLoai;
    };

    const GetContentMauInMacDinh = async (loai = 1) => {
        //Loai (1.k80,2.a4)
        const data = await MauInServices.GetContentMauInMacDinh(loai, idLoaiChungTu);
        setHtml(data);
    };

    // this func onChangeCkeditor: alway render
    const onChangeCkeditor = (shtmlNew: string) => {
        BindDataPrint(shtmlNew);
        setNewMauIn(() => {
            return { ...newMauIn, noiDungMauIn: shtmlNew };
        });
    };

    const deleteMauIn = async () => {
        await MauInServices.DeleteMauIn(newMauIn.id);
        setObjAlert({
            show: true,
            type: 1,
            mes: 'Xóa mẫu in thành công'
        });
        setListMauIn((old: MauInDto[]) => {
            return old.filter((x: MauInDto) => x.id !== newMauIn.id);
        });
        setAllMauIn((old: MauInDto[]) => {
            return old.filter((x: MauInDto) => x.id !== newMauIn.id);
        });
        setInforObjDelete(
            new PropConfirmOKCancel({
                show: false,
                title: '',
                mes: ''
            })
        );
        // set default to mauin macdinh
        setIdMauInChosed('1');
    };

    return (
        <>
            <ModalAddMauIn
                lstMauIn={lstMauIn}
                idUpdate={idMauInUpdate}
                isShowModal={isShowModalAddMauIn}
                tenLoaiChungTu={tenLoaiChungTu().toString()}
                idLoaiChungTu={idLoaiChungTu}
                handleSave={saveMauIn}
                onClose={() => setIsShowModalAddMauIn(false)}
                onDelete={deleteMauIn}
            />
            <TokenMauIn isShow={isShowToken} onClose={() => setIsShowToken(false)} />
            <ConfirmDelete
                isShow={inforObjDelete.show}
                title={inforObjDelete.title}
                mes={inforObjDelete.mes}
                onOk={deleteMauIn}
                onCancel={() => setInforObjDelete({ ...inforObjDelete, show: false })}></ConfirmDelete>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Grid container spacing={2} padding={2} paddingLeft={0}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={idLoaiChungTu}
                            onChange={handleChange}
                            sx={{
                                '& .MuiTabs-flexContainer': {
                                    alignItems: 'center' /*căn giữa text cho the span */
                                }
                            }}
                            aria-label="basic tabs example">
                            <InfoOutlinedIcon
                                titleAccess="Danh sách token mẫu in"
                                sx={{ color: 'chocolate' }}
                                onClick={() => setIsShowToken(true)}
                            />

                            <Tab label="Hóa đơn" value={LoaiChungTu.HOA_DON_BAN_LE} />
                            <Tab label="Gói dịch vụ" value={LoaiChungTu.GOI_DICH_VU} />
                            <Tab label="Thẻ giá trị" value={LoaiChungTu.THE_GIA_TRI} />
                            <Tab label="Phiếu thu" value={LoaiChungTu.PHIEU_THU} />
                            <Tab label="Phiếu chi" value={LoaiChungTu.PHIEU_CHI} />
                        </Tabs>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={3} md={3} lg={3}>
                                    <Button
                                        variant="contained"
                                        onClick={showModalAddMauIn}
                                        sx={{
                                            display: abpCustom.isGrandPermission('Pages.MauIn.Create') ? '' : 'none'
                                        }}>
                                        Thêm mới
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <SelectMauIn data={lstMauIn} idChosed={idMauInChosed} handleChange={changeMauIn} />
                                </Grid>
                                <Grid item xs={12} sm={3} md={3} lg={3}>
                                    {idMauInChosed.length === 36 && (
                                        <Stack direction="row" spacing={1}>
                                            <OpenInNew
                                                sx={{ width: 40, height: 40, padding: '8px' }}
                                                onClick={() => {
                                                    setIsShowModalAddMauIn(true);
                                                    setIdMauInUpdate(newMauIn.id);
                                                }}
                                            />
                                        </Stack>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <Stack spacing={1} justifyContent={'flex-end'} direction={'row'}>
                                <ButtonNavigate navigateTo="/settings" btnText="Trở về cài đặt" />
                                {idMauInChosed.length === 36 && (
                                    <Stack spacing={1} justifyContent={'flex-end'} direction={'row'}>
                                        <Button
                                            variant="contained"
                                            onClick={UpdateMauIn}
                                            sx={{
                                                display: abpCustom.isGrandPermission('Pages.MauIn.Edit') ? '' : 'none'
                                            }}>
                                            Lưu mẫu in
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            sx={{
                                                display: abpCustom.isGrandPermission('Pages.MauIn.Delete')
                                                    ? ''
                                                    : 'none',
                                                backgroundColor: 'white'
                                            }}
                                            onClick={() => {
                                                setInforObjDelete(
                                                    new PropConfirmOKCancel({
                                                        show: true,
                                                        title: 'Xác nhận xóa',
                                                        mes: `Bạn có chắc chắn muốn xóa mẫu in ${newMauIn?.tenMauIn} không?`
                                                    })
                                                );
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
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <CustomCkeditor html={html} handleChange={onChangeCkeditor} />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} style={{ backgroundColor: 'white' }}>
                    <div className="ck-content" dangerouslySetInnerHTML={{ __html: dataPrint }}></div>
                </Grid>
            </Grid>
        </>
    );
}
