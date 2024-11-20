import * as React from 'react';
import { CircularProgress } from '@mui/material';

const Loading = () => (
    <div style={{ paddingTop: 100, textAlign: 'center' }}>
        <CircularProgress />
    </div>
);

export default Loading;
