import { Popover, Stack, Typography, Button, Grid } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { IPropsPopoverFilter } from '../../../services/dto/IPropsComponent';
import { useEffect, useState } from 'react';
import { IList } from '../../../services/dto/IList';
import MultipleAutocompleteWithData from '../../../components/Autocomplete/MultipleAutocompleteWithData';
import suggestStore from '../../../stores/suggestStore';
import { ParamSearchBaoCaoTGT } from '../../../services/bao_cao/bao_cao_the_gia_tri/ParamSearchBaoCaoTGT';
import ListCheckbox from '../../../components/Checkbox/ListCheckbox';
import { ISelect, LoaiChungTu } from '../../../lib/appconst';

export default function PopoverFilterBaoCaoTGT(props: IPropsPopoverFilter<ParamSearchBaoCaoTGT>) {
    const { id, anchorEl, handleClose, handleApply, paramFilter } = props;
    const [paramFilterThis, setParamFilterThis] = useState<ParamSearchBaoCaoTGT>({} as ParamSearchBaoCaoTGT);

    useEffect(() => {
        setParamFilterThis({
            ...paramFilterThis,
            idChiNhanhs: paramFilter?.idChiNhanhs
        });
    }, [paramFilter?.idChiNhanhs]);

    useEffect(() => {
        setParamFilterThis({
            ...paramFilterThis,
            idChiNhanhs: paramFilter?.idChiNhanhs,
            idLoaiChungTus: paramFilter?.idLoaiChungTus
        });
    }, []);

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
                                        Loại chứng từ
                                    </Typography>
                                    <Stack paddingTop={1}>
                                        <ListCheckbox
                                            arrValueDefault={paramFilterThis?.idLoaiChungTus ?? []}
                                            lstOption={
                                                [
                                                    { value: LoaiChungTu.HOA_DON_BAN_LE, text: 'Hóa đơn' },
                                                    { value: LoaiChungTu.GOI_DICH_VU, text: 'Gói dịch vụ' },
                                                    { value: LoaiChungTu.THE_GIA_TRI, text: 'Thẻ giá trị' },
                                                    {
                                                        value: LoaiChungTu.PHIEU_DIEU_CHINH_TGT,
                                                        text: 'Phiếu điều chỉnh'
                                                    }
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
