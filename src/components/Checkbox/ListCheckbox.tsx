import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { ISelect } from '../../lib/appconst';
import { useEffect, useState } from 'react';
import { IPropsListCheckFilter } from '../../services/dto/IPropsComponent';

export default function ListCheckbox(props: IPropsListCheckFilter) {
    const { isShowCheckAll, lstOption, arrValueDefault, onChange } = props;
    const [arrIdChosed, setArrIdChosed] = useState<number[] | string[]>([]);
    useEffect(() => {
        if (arrValueDefault !== undefined) {
            setArrIdChosed([...(arrValueDefault as number[])]);
        }
    }, []);

    const changeCheckAll = (isCheck: boolean) => {
        if (isCheck) {
            const allIds = lstOption?.map((x) => {
                return x.value;
            });
            setArrIdChosed(allIds as string[]);
        } else {
            setArrIdChosed([]);
        }
    };
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, id: number | string) => {
        const isCheck = event.target.checked;
        let arrID: string[] = [];
        if (isCheck) {
            arrID = [...arrIdChosed, id] as string[];
        } else {
            const arrTrungGian: string[] = [...arrIdChosed] as string[];
            arrID = arrTrungGian?.filter((x: number | string) => x !== id) as string[];
        }
        setArrIdChosed([...arrID]);
        onChange(arrID);
    };
    return (
        <FormGroup>
            {isShowCheckAll && (
                <FormControlLabel
                    label={'Tất cả'}
                    control={
                        <Checkbox
                            checked={arrIdChosed?.length === lstOption?.length && arrIdChosed?.length !== 0}
                            onChange={(event) => changeCheckAll(event.target.checked)}
                        />
                    }
                />
            )}

            {lstOption?.map((x: ISelect) => (
                <FormControlLabel
                    key={x.value}
                    value={x.value}
                    label={x.text}
                    control={
                        <Checkbox
                            checked={arrIdChosed?.includes(x.value as never) ?? false}
                            onChange={(event) => handleChange(event, x.value as number)}
                        />
                    }
                />
            ))}
        </FormGroup>
    );
}
