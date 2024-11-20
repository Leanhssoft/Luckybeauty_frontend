import './index.css';

import * as React from 'react';

import { Link } from 'react-router-dom';
import error404 from '../../images/404.png';
import { Avatar, Button, Grid } from '@mui/material';

class Exception404 extends React.Component<any, any> {
    render() {
        return (
            <Grid container style={{ marginTop: 150 }}>
                <Grid item xs={6} sm={6} md={6} lg={4} xl={4}>
                    <Avatar variant="square" sx={{ width: '100%', height: '100%' }} src={error404} />
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={4} xl={4} style={{ marginTop: 75 }}>
                    <Grid item>
                        <h1 className={'errorTitle'}>404</h1>
                    </Grid>
                    <Grid item>
                        <h4 className={'errorDescription'}>Không tìm thấy trang</h4>
                    </Grid>
                    <Grid item>
                        <h5 className={'errorDescription'}>
                            Trang bạn muốn truy cập có thể đã bị xóa, đổi tên hoặc địa chỉ của trang không đúng. Xin vui
                            lòng thử lại.
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

export default Exception404;
