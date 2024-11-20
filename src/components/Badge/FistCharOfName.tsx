import { Box } from '@mui/material';
export default function BadgeFistCharOfName({ firstChar }: any) {
    return (
        <>
            <Box
                style={{
                    minWidth: '40px',
                    height: '40px',
                    display: 'flex',
                    position: 'relative',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-main)'
                }}>
                {firstChar?.length > 2 ? firstChar.substring(0, 2) : firstChar}
            </Box>
        </>
    );
}
