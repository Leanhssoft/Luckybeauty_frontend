import './index.css';

import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import error401 from '../../images/401.png';
import error404 from '../../images/404.png';
import error500 from '../../images/500.png';
import { Avatar, Button, Grid } from '@mui/material';

class Exception extends React.Component<any, any> {
    render() {
        const location = useLocation();
        const params = new URLSearchParams(location.search);
        const type = params.get('type');
        const exception = [
            {
                errorCode: '404',
                errorImg: error404,
                errorDescription: 'Sorry, the page you visited does not exist'
            },
            {
                errorCode: '401',
                errorImg: error401,
                errorDescription: 'Sorry, you dont have access to this page'
            },
            {
                errorCode: '500',
                errorImg: error500,
                errorDescription: 'Sorry, the server is reporting an error'
            }
        ];
        let error = exception.find((x) => x.errorCode === type);

        if (error == null) {
            error = exception[0];
        }
        return (
            <Grid container style={{ marginTop: 150 }}>
                <Grid item xs={6} sm={6} md={6} lg={4} xl={4}>
                    <Avatar variant="square" sx={{ width: '100%', height: '100%' }} src={error.errorImg} />
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={4} xl={4} style={{ marginTop: 75 }}>
                    <Grid item>
                        <h1 className={'errorTitle'}>{error.errorCode}</h1>
                    </Grid>
                    <Grid item>
                        <h5 className={'errorDescription'}>{error.errorDescription}</h5>
                    </Grid>
                    <Grid item textAlign={'center'}>
                        <Button variant="contained" color="primary">
                            <Link
                                style={{ color: '#FFFFFF', textDecoration: 'none' }}
                                to={{
                                    pathname: '/'
                                }}>
                                Back to Home
                            </Link>
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default Exception;
