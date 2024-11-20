import React, { StrictMode, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes } from './components/routers';
import { SnackbarProvider, MaterialDesignContent } from 'notistack';
import { ReactComponent as SuccessIcon } from './images/success.svg';
import styled from 'styled-components';
import notificationStore from './stores/notificationStore';

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
    '&.notistack-MuiContent-success': {
        backgroundColor: '#E8FFF3',
        color: '#004434'
    },
    '&.notistack-MuiContent-warning': {
        backgroundColor: '#FFF8DD',
        color: '#FF9900'
    },
    '&.notistack-MuiContent-error': {
        backgroundColor: '#FFE5EC',
        color: '#F1416C'
    }
}));

const App = () => {
    return (
        <div>
            <BrowserRouter>{Routes}</BrowserRouter>
            <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                iconVariant={{
                    success: <SuccessIcon />
                }}
                Components={{
                    success: StyledMaterialDesignContent,
                    error: StyledMaterialDesignContent
                }}
            />
        </div>
    );
};

export default App;
