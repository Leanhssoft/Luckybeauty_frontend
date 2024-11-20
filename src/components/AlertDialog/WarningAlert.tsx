import * as React from 'react';
import { Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { ReactComponent as WarningIcon } from '../../images/warning.svg';
export default function WarningAlert({ showAlert = false, type = 1, title = '' }: any) {
    const getIcon = () => {
        if (type === 1) {
            return <WarningIcon />;
        } else if (type === 2) {
            return <DeleteIcon />;
        }
        return null;
    };
    return (
        <>
            {showAlert && (
                <Alert
                    sx={{
                        float: 'right',
                        width: '400px',
                        fontSize: '16px',
                        height: '40px',
                        alignItems: 'center',
                        bgcolor: '#FFF8DD',
                        color: '#FF9900',
                        '& .MuiAlert-message': {
                            padding: '0'
                        }
                    }}
                    severity={type == 1 ? 'success' : 'error'}
                    icon={getIcon()}>
                    {title}
                </Alert>
            )}
        </>
    );
}
