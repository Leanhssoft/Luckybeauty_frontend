import { debounce, Grid, Stack, Typography } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import { FC, useEffect, useRef, useState } from 'react';
import {
    IHangHoaGroupTheoNhomDto,
    ModelHangHoaDto,
    ModelNhomHangHoa,
    PagedProductSearchDto
} from '../../../services/product/dto';
import GroupProductService from '../../../services/product/GroupProductService';
import ProductService from '../../../services/product/ProductService';
import Loading from '../../../components/Loading';

const ThuNganTabLeft: FC<{ txtSearch: string; onChoseProduct: (item: ModelHangHoaDto) => void }> = ({
    txtSearch,
    onChoseProduct
}) => {
    const [isLoadingData, setIsLoadingData] = useState(false);

    const [arrIdNhomHangChosed, setArrIdNhomHangChosed] = useState<string[]>([]);
    const [nhomHangHoaChosed, setNhomHangHoaChosed] = useState<ModelNhomHangHoa[]>([]);
    const [listProduct, setListProduct] = useState<IHangHoaGroupTheoNhomDto[]>([]);

    const GetListNhomHangHoa_byId = async (arrIdNhomHangFilter: string[]) => {
        const list = await GroupProductService.GetListNhomHangHoa_byId(arrIdNhomHangFilter);
        setNhomHangHoaChosed(list);
    };

    const getListHangHoa_groupbyNhom = async (txtSearch: string, arrIdNhomHang: string[] = []) => {
        setIsLoadingData(true);
        const input = {
            IdNhomHangHoas: arrIdNhomHang,
            TextSearch: txtSearch,
            IdLoaiHangHoa: 0, // all
            CurrentPage: 0,
            PageSize: 50
        } as PagedProductSearchDto;
        const data = await ProductService.GetDMHangHoa_groupByNhom(input);
        setListProduct(data);

        setIsLoadingData(false);
    };

    // only used when change textsearch
    const debounceSearchHangHoa = useRef(
        debounce(async (txtSearch: string) => {
            getListHangHoa_groupbyNhom(txtSearch, arrIdNhomHangChosed);
        }, 500)
    ).current;

    useEffect(() => {
        debounceSearchHangHoa(txtSearch);
    }, [txtSearch]);

    const BoChon1NhomHang = (idNhomHang: string) => {
        setArrIdNhomHangChosed(arrIdNhomHangChosed?.filter((x) => x !== idNhomHang));
        const arrIdNhom = arrIdNhomHangChosed?.filter((x) => x !== idNhomHang);
        GetListNhomHangHoa_byId(arrIdNhom ?? []);
        getListHangHoa_groupbyNhom(txtSearch, arrIdNhom ?? []);
    };
    const BoChonAllNhomHang = () => {
        setArrIdNhomHangChosed([]);
        GetListNhomHangHoa_byId([]);
        getListHangHoa_groupbyNhom(txtSearch, []);
    };

    const choseProduct = async (item: ModelHangHoaDto) => {
        onChoseProduct(item);
    };
    if (isLoadingData) {
        return <Loading />;
    }
    return (
        <>
            <Stack spacing={2} overflow={'auto'} maxHeight={'84vh'}>
                {(nhomHangHoaChosed?.length ?? 0) > 0 && (
                    <Stack spacing={2}>
                        <Stack direction={'row'} spacing={2} alignItems={'center'}>
                            <Typography fontWeight={500}>Nhóm hàng đã chọn</Typography>
                            <Stack
                                direction={'row'}
                                spacing={1}
                                alignItems={'center'}
                                color={'brown'}
                                sx={{ cursor: 'pointer' }}>
                                <Typography fontSize={13} onClick={() => BoChonAllNhomHang()}>
                                    Bỏ chọn tất cả
                                </Typography>
                                <CloseOutlinedIcon sx={{ width: 15, height: 15 }} />
                            </Stack>
                        </Stack>
                        <Stack direction={'row'} spacing={1} sx={{ overflowX: 'auto' }}>
                            {nhomHangHoaChosed?.map((x, index) => (
                                <Stack key={index} padding={1} bgcolor={'#f0e0da'} borderRadius={4}>
                                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                        <Typography
                                            fontWeight={500}
                                            className="lableOverflow"
                                            maxWidth={300}
                                            title={x?.tenNhomHang ?? ''}>
                                            {x?.tenNhomHang}
                                        </Typography>
                                        <CloseOutlinedIcon
                                            sx={{ width: 20, height: 20, cursor: 'pointer' }}
                                            onClick={() => BoChon1NhomHang(x?.id ?? '')}
                                        />
                                    </Stack>
                                </Stack>
                            ))}
                        </Stack>
                    </Stack>
                )}

                {listProduct.map((nhom: IHangHoaGroupTheoNhomDto, index: number) => (
                    <Stack key={index}>
                        <Typography fontSize={16} fontWeight={500} marginBottom={0.5}>
                            {nhom?.tenNhomHang}
                        </Typography>
                        <Grid container spacing={2} paddingRight={2}>
                            {nhom?.hangHoas.map((item, index2) => (
                                <Grid key={index2} item lg={4} md={6} xs={12} sm={12}>
                                    <Stack
                                        padding={2}
                                        title={item.tenHangHoa}
                                        sx={{
                                            backgroundColor: 'var(--color-bg)',
                                            border: '1px solid transparent',
                                            '&:hover': {
                                                borderColor: 'var(--color-main)',
                                                cursor: 'pointer'
                                            }
                                        }}>
                                        <Stack spacing={2} onClick={() => choseProduct(item)}>
                                            <Typography
                                                fontWeight={500}
                                                variant="body2"
                                                sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    width: '100%'
                                                }}>
                                                {item?.tenHangHoa}
                                            </Typography>
                                            <Typography variant="caption">
                                                {Intl.NumberFormat('vi-VN').format(item?.giaBan as number)}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Grid>
                            ))}
                        </Grid>
                    </Stack>
                ))}
            </Stack>
            ;
        </>
    );
};
export default ThuNganTabLeft;
