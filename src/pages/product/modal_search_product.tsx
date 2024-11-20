import { Search } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, debounce } from '@mui/material';
import { useRef, useState, useEffect, FC } from 'react';
import ListProductByGroup from './list_product_by_group';
import ProductService from '../../services/product/ProductService';
import DialogButtonClose from '../../components/Dialog/ButtonClose';
import { IHangHoaGroupTheoNhomDto, ModelHangHoaDto, PagedProductSearchDto } from '../../services/product/dto';

const ModalSearchProduct: FC<{
    isShow: boolean;
    handleChoseProduct: (productChosed: ModelHangHoaDto) => void;
    handlClose: () => void;
}> = ({ isShow, handlClose, handleChoseProduct }) => {
    const [txtSearch, setTxtSearch] = useState('');
    const firstLoad = useRef(true);
    const [listProduct, setListProduct] = useState<IHangHoaGroupTheoNhomDto[]>([]);

    const getListHangHoa_groupbyNhom = async (txtSearch: string) => {
        const input = {
            IdNhomHangHoas: [],
            TextSearch: txtSearch,
            IdLoaiHangHoa: 0, // all
            CurrentPage: 0,
            PageSize: 50
        } as PagedProductSearchDto;
        const data = await ProductService.GetDMHangHoa_groupByNhom(input);
        setListProduct(data);
    };

    useEffect(() => {
        if (isShow) {
            getListHangHoa_groupbyNhom('');
        }
    }, [isShow]);

    // only used when change textseach
    const debounceDropDown = useRef(
        debounce(async (txtSearch: string) => {
            await getListHangHoa_groupbyNhom(txtSearch);
        }, 500)
    ).current;

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        debounceDropDown(txtSearch);
    }, [txtSearch]);

    return (
        <>
            <Dialog open={isShow} onClose={handlClose} fullWidth maxWidth="lg">
                <DialogTitle>
                    <span style={{ fontWeight: 700 }}> Chọn dịch vụ</span>
                    <DialogButtonClose onClose={handlClose} />
                </DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={6}>
                            <TextField
                                size="small"
                                fullWidth
                                value={txtSearch}
                                onChange={(e) => setTxtSearch(e.target.value)}
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    startAdornment: <Search />
                                }}
                            />
                        </Grid>
                    </Grid>
                    <ListProductByGroup listProduct={listProduct} handleChoseItem={handleChoseProduct} />
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>
        </>
    );
};
export default ModalSearchProduct;
