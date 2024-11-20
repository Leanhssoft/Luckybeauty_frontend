import { Grid, Stack, Typography } from '@mui/material';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

export default function BankAccount({ lstBankAccount, idChosed, handleChoseItem }: any) {
    const choseItem = (item: any) => {
        handleChoseItem(item);
    };

    return (
        <>
            <Grid container direction={'row'} spacing={2} flexWrap={'nowrap'} overflow={'auto'}>
                {lstBankAccount?.map((item: any) => (
                    <Grid item xs={3} key={item.id} sx={{ position: 'relative' }} onClick={() => choseItem(item)}>
                        <Stack
                            spacing={1}
                            sx={{
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                backgroundColor: 'white'
                            }}>
                            <Stack>
                                <img src={item.logoNganHang} style={{ width: 135, height: 50 }} />
                            </Stack>
                            <Stack className="lableOverflow">
                                <Typography variant="body2">{item.tenChuThe}</Typography>
                            </Stack>
                        </Stack>
                        {idChosed == item.id && (
                            <Stack
                                sx={{
                                    position: 'absolute',
                                    borderRadius: '100%',
                                    top: 10,
                                    right: -4,
                                    color: 'white',
                                    backgroundColor: 'var(--color-main)'
                                }}>
                                <CheckOutlinedIcon sx={{ width: '18px', height: '18px' }} />
                            </Stack>
                        )}
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
