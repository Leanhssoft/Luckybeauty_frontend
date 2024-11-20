import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
interface Props {
    label: string;
    name: string;
    value: number;
}

const NumberFormatTextField = ({ label, name }: Props) => {
    const [formattedNumber, setFormattedNumber] = useState('');
    const [value, setValue] = useState(0);
    const handleInputChange = (event: any) => {
        const inputValue = event.target.value;
        const numericValue = inputValue.replace(/[^0-9]/g, '');

        const formattedValue = Number(numericValue).toLocaleString('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        setValue(inputValue);
        setFormattedNumber(formattedValue);
    };

    return (
        <TextField
            label={label}
            value={formattedNumber}
            name={name}
            onChange={handleInputChange}
            type="text" // Use text type to allow non-numeric characters
            InputProps={{
                inputProps: {
                    pattern: '[0-9]*' // Use pattern attribute to enforce numeric input
                }
            }}
        />
    );
};
