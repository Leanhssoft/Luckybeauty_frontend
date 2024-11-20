import { Popover, Stack, Typography, Button, Grid } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import { ParamSearchSoQuyDto } from '../../../../services/so_quy/Dto/ParamSearchSoQuyDto';
import MultipleAutocompleteWithData from '../../../../components/Autocomplete/MultipleAutocompleteWithData';
import ListRadio from '../../../../components/Radio/ListRadio';
import ListCheckbox from '../../../../components/Checkbox/ListCheckbox';
import { useState, useEffect } from 'react';
import { IList } from '../../../../services/dto/IList';
import { IPropsPopoverFilter } from '../../../../services/dto/IPropsComponent';
import { ISelect, LoaiChungTu, TrangThaiActive } from '../../../../lib/appconst';
import suggestStore from '../../../../stores/suggestStore';
import AutocompleteWithData from '../../../../components/Autocomplete/AutocompleteWithData';
import { IDataAutocomplete } from '../../../../services/dto/IDataAutocomplete';

export default function PopoverFilterSoQuy(props: IPropsPopoverFilter<ParamSearchSoQuyDto>) {
    const { id, anchorEl, handleClose, handleApply, paramFilter } = props;
    const [paramFilterThis, setParamFilterThis] = useState<ParamSearchSoQuyDto>({} as ParamSearchSoQuyDto);

    useEffect(() => {
        setParamFilterThis({
            ...paramFilterThis,
            idChiNhanhs: paramFilter?.idChiNhanhs,
            idLoaiChungTus: paramFilter?.idLoaiChungTus,
            trangThais: paramFilter?.trangThais ?? [TrangThaiActive.ACTIVE]
        });
    }, [paramFilter?.idChiNhanhs]);
    const choseChiNhanh = (lstChosed: IList[]) => {
        setParamFilterThis({
            ...paramFilterThis,
            idChiNhanhs: lstChosed?.map((x) => {
                return x.id;
            })
        });
    };

    const onClickApDung = () => {
        handleApply(paramFilterThis);
    };
    return (
        <>
            <Popover
                id={id ?? 'popover-filter'}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}>
                <Grid padding={2} container minWidth={300} position={'relative'}>
                    <Grid item xs={12}>
                        <Stack spacing={3}>
                            <Typography fontWeight={600}>Bộ lọc</Typography>
                            <Stack spacing={2}>
                                <MultipleAutocompleteWithData
                                    labelInput="Chi nhánh"
                                    arrIdDefault={paramFilterThis?.idChiNhanhs}
                                    lstOption={suggestStore?.suggestChiNhanh_byUserLogin?.map((x) => {
                                        return {
                                            id: x.id,
                                            text: x.tenChiNhanh
                                        } as IList;
                                    })}
                                    handleChosedItem={choseChiNhanh}
                                />
                                <Stack>
                                    <Typography variant="body2" fontWeight={500}>
                                        Loại phiếu
                                    </Typography>
                                    <Stack paddingTop={1}>
                                        <ListCheckbox
                                            arrValueDefault={paramFilterThis.idLoaiChungTus as unknown as number[]}
                                            lstOption={
                                                [
                                                    { value: LoaiChungTu.PHIEU_THU, text: 'Phiếu thu' },
                                                    { value: LoaiChungTu.PHIEU_CHI, text: 'Phiếu chi' }
                                                ] as ISelect[]
                                            }
                                            onChange={(arrChosed: number[] | string[]) =>
                                                setParamFilterThis({
                                                    ...paramFilterThis,
                                                    idLoaiChungTus: arrChosed as number[]
                                                })
                                            }
                                        />
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Typography variant="body2" fontWeight={500}>
                                        Loại chứng từ
                                    </Typography>
                                    <Stack paddingTop={1}>
                                        <ListRadio
                                            lstOption={
                                                [
                                                    { value: LoaiChungTu.ALL, text: 'Tất cả' },
                                                    { value: LoaiChungTu.HOA_DON_BAN_LE, text: 'Hóa đơn bán' },
                                                    { value: LoaiChungTu.KHAC, text: 'Khác' }
                                                ] as ISelect[]
                                            }
                                            defaultValue={paramFilterThis?.idLoaiChungTuLienQuan ?? LoaiChungTu.ALL}
                                            onChange={(valNew: any) =>
                                                setParamFilterThis({
                                                    ...paramFilterThis,
                                                    idLoaiChungTuLienQuan: valNew
                                                })
                                            }
                                        />
                                    </Stack>
                                </Stack>
                                <AutocompleteWithData
                                    label="Tài khoản ngân hàng"
                                    idChosed={paramFilterThis?.idTaiKhoanNganHang ?? ''}
                                    lstData={suggestStore?.suggestTaiKhoanNganHangQr?.map((x) => {
                                        return {
                                            id: x.id,
                                            text1: x.tenChuThe,
                                            text2: x.soTaiKhoan.concat(` (${x.tenRutGon})`)
                                        } as IDataAutocomplete;
                                    })}
                                    handleChoseItem={(item: IDataAutocomplete) => {
                                        setParamFilterThis({ ...paramFilterThis, idTaiKhoanNganHang: item?.id });
                                    }}
                                />
                                <Stack>
                                    <Typography variant="body2" fontWeight={500}>
                                        Trạng thái
                                    </Typography>
                                    <Stack paddingTop={1}>
                                        <ListRadio
                                            lstOption={
                                                [
                                                    { value: TrangThaiActive.ACTIVE, text: 'Đã thanh toán' },
                                                    { value: TrangThaiActive.NOT_ACTIVE, text: 'Đã hủy' }
                                                ] as ISelect[]
                                            }
                                            defaultValue={
                                                paramFilterThis?.trangThais
                                                    ? paramFilterThis.trangThais[0]
                                                    : TrangThaiActive.ACTIVE
                                            }
                                            onChange={(valNew: any) =>
                                                setParamFilterThis({
                                                    ...paramFilterThis,
                                                    trangThais: [valNew]
                                                })
                                            }
                                        />
                                    </Stack>
                                </Stack>

                                <Stack direction={'row'} justifyContent={'end'} spacing={1}>
                                    <Button variant="outlined" fullWidth onClick={handleClose}>
                                        Đóng
                                    </Button>
                                    <Button variant="contained" fullWidth onClick={onClickApDung}>
                                        Áp dụng
                                    </Button>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Grid>
                    <ClearIcon sx={{ position: 'absolute', top: 10, right: 5 }} onClick={handleClose} />
                </Grid>
            </Popover>
        </>
    );
}
