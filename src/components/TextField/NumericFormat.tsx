import * as React from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { InputPropNumber } from '../../services/dto/InputFormat';

export const NumericFormatCustom = React.forwardRef<NumericFormatProps, InputPropNumber>(function NumericFormatCustom(
    props,
    ref
) {
    const { onChange, ...other } = props;

    return (
        <NumericFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values: any) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value
                    }
                });
            }}
            thousandSeparator
            valueIsNumericString
        />
    );
});
