import { Autocomplete, TextField, Stack, Typography, Chip } from '@mui/material';
import { IList } from '../../services/dto/IList';
import { useEffect, useState } from 'react';

export interface IPropsMultipleAutocompleteWithData {
    lstOption: IList[];
    labelInput?: string;
    arrIdDefault?: string[];
    handleChosedItem: (lstNew: IList[]) => void;
}

export default function MultipleAutocompleteWithData(props: IPropsMultipleAutocompleteWithData) {
    const { arrIdDefault, labelInput, lstOption, handleChosedItem } = props;
    const [itemDefault, setItemDefault] = useState<IList[]>([]);
    useEffect(() => {
        const itEx = lstOption?.filter((x) => arrIdDefault?.includes(x.id));
        if (itEx.length > 0) {
            setItemDefault(itEx);
        }
    }, []);

    const choseItem = (event: any, lstNew: IList[]) => {
        setItemDefault([...lstNew]);
        handleChosedItem(lstNew);
    };
    return (
        <>
            <Autocomplete
                size="small"
                fullWidth
                disablePortal
                autoComplete
                multiple={true}
                filterSelectedOptions
                value={itemDefault}
                onChange={choseItem}
                options={lstOption}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option: IList) => (option?.text ? option.text : '')}
                renderInput={(params) => <TextField {...params} label={labelInput} />}
                renderTags={(tagValue, getTagProps) => {
                    return tagValue?.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={index} label={option?.text} />
                    ));
                }}
                renderOption={(props, option) => {
                    return (
                        <li
                            {...props}
                            key={option?.id}
                            style={{
                                borderBottom: '1px dashed var(--border-color)',
                                padding: '8px'
                            }}>
                            <Typography style={{ fontSize: '13px' }}>{option?.text}</Typography>
                        </li>
                    );
                }}
            />
        </>
    );
}
