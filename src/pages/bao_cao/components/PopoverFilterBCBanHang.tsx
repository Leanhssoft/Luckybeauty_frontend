import { Popover, Stack, Typography, Button, Grid } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { LocalOffer } from '@mui/icons-material';

import { IPropsPopoverFilter } from '../../../services/dto/IPropsComponent';
import { ParamSearchBaoCaoBanHang } from '../../../services/bao_cao/bao_cao_ban_hang/dto/ParamSearchBaoCaoBanHang';
import { useEffect, useState } from 'react';
import { IList } from '../../../services/dto/IList';
import MultipleAutocompleteWithData from '../../../components/Autocomplete/MultipleAutocompleteWithData';
import suggestStore from '../../../stores/suggestStore';
import TreeViewGroupProduct from '../../../components/Treeview/ProductGroup';
import GroupProductService from '../../../services/product/GroupProductService';
import { ModelNhomHangHoa } from '../../../services/product/dto';

export default function PopoverFilterBCBanHang(props: IPropsPopoverFilter<ParamSearchBaoCaoBanHang>) {
    const { id, anchorEl, handleClose, handleApply, paramFilter } = props;
    const [paramFilterThis, setParamFilterThis] = useState<ParamSearchBaoCaoBanHang>({} as ParamSearchBaoCaoBanHang);
    const [allNhomHang, setAllNhomHang] = useState<ModelNhomHangHoa[]>([]);

    const getTreeNhomHangHoa = async () => {
        const data = await GroupProductService.GetTreeNhomHangHoa();
        setAllNhomHang(data?.items);
    };

    useEffect(() => {
        setParamFilterThis({
            ...paramFilterThis,
            idChiNhanhs: paramFilter?.idChiNhanhs
        });
    }, [paramFilter?.idChiNhanhs]);

    useEffect(() => {
        getTreeNhomHangHoa();
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
                                        Nhóm dịch vụ
                                    </Typography>
                                    <Stack paddingTop={1} sx={{ overflow: 'auto', maxHeight: '250px' }}>
                                        <TreeViewGroupProduct
                                            roleEdit={false}
                                            //arrIdChosedDefault={[paramFilterThis?.idNhomHangHoa as string]}
                                            lstData={allNhomHang?.map((x) => {
                                                return {
                                                    id: x.id,
                                                    text: x.tenNhomHang,
                                                    text2: x?.tenNhomHang_KhongDau,
                                                    color: x.color,
                                                    icon: <LocalOffer sx={{ width: 16 }} />,
                                                    children: x?.children?.map((o) => {
                                                        return {
                                                            id: o.id,
                                                            text: o.tenNhomHang,
                                                            text2: o?.tenNhomHang_KhongDau
                                                        };
                                                    })
                                                } as IList;
                                            })}
                                            clickTreeItem={(isEdit, itemChosed) => {
                                                //
                                            }}
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
