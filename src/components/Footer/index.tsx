import { Container, Grid, Link, Typography } from '@mui/material';

const Footer: React.FC = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={2} justifyContent="center">
                <Grid item>
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} My Website
                    </Typography>
                </Grid>
                <Grid item>
                    <Link color="inherit" href="#">
                        Privacy Policy
                    </Link>
                </Grid>
                <Grid item>
                    <Link color="inherit" href="#">
                        Terms of Use
                    </Link>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Footer;
