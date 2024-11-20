/* eslint-disable @typescript-eslint/no-explicit-any */
import './index.css';

import * as React from 'react';

import { Link } from 'react-router-dom';
import error500 from '../../images/500.png';
import { Avatar, Button, Grid } from '@mui/material';

class Exception500 extends React.Component<any, any> {
    render() {
        return (
            <Grid container style={{ marginTop: 150 }}>
                <Grid item xs={6} sm={6} md={6} lg={4} xl={4}>
                    <Avatar variant="square" sx={{ width: '100%', height: '100%' }} src={error500} />
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={4} xl={4} style={{ marginTop: 75 }}>
                    <Grid item>
                        <h1 className={'errorTitle'}>500</h1>
                    </Grid>
                    <Grid item>
                        <h5 className={'errorDescription'}>
                            Xin lỗi, đã xảy ra lỗi trên trang này. Đội ngũ của chúng tôi đã được thông báo về điều này
                            và chúng tôi sẽ cố gắng giải quyết vấn đề này một cách tốt nhất có thể
                        </h5>
                    </Grid>
                    <Grid item textAlign={'center'}>
                        <Button variant="contained" color="primary">
                            <Link
                                style={{ color: '#FFFFFF', textDecoration: 'none' }}
                                to={{
                                    pathname: '/'
                                }}>
                                Về trang chủ
                            </Link>
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default Exception500;
