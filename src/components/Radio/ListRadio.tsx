import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { ISelect } from '../../lib/appconst';
import { useState } from 'react';
import { IPropsListRadioFilter } from '../../services/dto/IPropsComponent';

export default function ListRadio(props: IPropsListRadioFilter) {
    const { lstOption, defaultValue, onChange } = props;

    const [value, setValue] = useState(defaultValue);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = event.target.value;
        setValue(newVal);
        onChange(newVal);
    };
    return (
        <RadioGroup value={value} onChange={handleChange}>
            {lstOption?.map((x: ISelect) => (
                <FormControlLabel key={x.value} value={x.value} control={<Radio size="small" />} label={x.text} />
            ))}
        </RadioGroup>
    );
}
