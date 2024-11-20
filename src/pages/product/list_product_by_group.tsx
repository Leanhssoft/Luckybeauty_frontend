import { Grid, Stack, Box } from '@mui/material';
import { FC } from 'react';
import { IHangHoaGroupTheoNhomDto, ModelHangHoaDto } from '../../services/product/dto';

const ListProductByGroup: FC<{
    listProduct: IHangHoaGroupTheoNhomDto[];
    handleChoseItem: (productChosed: ModelHangHoaDto) => void;
}> = ({ listProduct, handleChoseItem }) => {
    return (
        <>
            {listProduct.map((nhom, index) => (
                <Grid container paddingTop={2} spacing={2} key={index}>
                    <Grid item xs={12} key={index}>
                        <span
                            style={{
                                fontSize: '16px',
                                color: '#000',
                                fontWeight: '700'
                            }}>
                            {nhom.tenNhomHang}
                        </span>
                    </Grid>

                    {nhom.hangHoas.map((item, index2) => (
                        <Grid key={index2} item xs={12} sm={4} md={3} lg={3} onClick={() => handleChoseItem(item)}>
                            <Stack
                                direction="column"
                                padding={2}
                                spacing={2}
                                justifyContent="space-around"
                                sx={{
                                    border: '1px solid transparent',
                                    cursor: 'pointer',
                                    transition: '.4s',
                                    backgroundColor: 'var(--color-bg)',
                                    '&:hover': {
                                        borderColor: 'var(--color-main)'
                                    }
                                }}>
                                <Box
                                    height={40}
                                    style={{
                                        fontSize: 12,
                                        color: '#333233',
                                        fontWeight: '700'
                                    }}>
                                    {item.tenHangHoa}
                                </Box>
                                <Box
                                    style={{
                                        fontSize: 14,
                                        color: '#333233'
                                    }}>
                                    {new Intl.NumberFormat('vi-VN').format(item?.giaBan ?? 0)}
                                </Box>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            ))}
        </>
    );
};
export default ListProductByGroup;
