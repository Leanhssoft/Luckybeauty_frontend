import * as React from 'react';
import { Alert, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function MessageAlert({ showAlert = false, type = 1, title = '' }: any) {
    const getIcon = () => {
        if (type === 1) {
            return <CheckCircleIcon />;
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
                        color: '#004434',
                        alignItems: 'center',
                        bgcolor: '#E8FFF3',
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
