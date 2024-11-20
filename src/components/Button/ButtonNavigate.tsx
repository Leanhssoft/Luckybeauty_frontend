import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';

export type ButtonNavigateMyType = {
    navigateTo: string;
    btnText: string;
    title?: string;
};
export function ButtonNavigate({ navigateTo = '', btnText = '', title = '' }: ButtonNavigateMyType) {
    const navigate = useNavigate(); // Sử dụng hook useNavigate

    const handleClick = () => {
        navigate(navigateTo);
    };
    return (
        <>
            <Button
                variant="outlined"
                className="btn-outline-hover"
                title={title}
                sx={{ color: '#525f7a' }}
                startIcon={<ArrowBackOutlinedIcon />}
                onClick={handleClick}>
                {btnText}
            </Button>
        </>
    );
}
