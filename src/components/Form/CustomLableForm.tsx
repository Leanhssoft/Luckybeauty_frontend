import Typography from '@mui/material/Typography';
import { Component, ReactNode } from 'react';

interface LableProps {
    content: string;
}
class LabelForm extends Component<LableProps> {
    render(): ReactNode {
        return (
            <Typography
                sx={{ marginTop: 2, marginBottom: 1 }}
                variant="h3"
                fontSize="14px"
                fontWeight="500"
                fontFamily="Roboto"
                fontStyle="normal"
                color="#4C4B4C">
                {this.props.content}
            </Typography>
        );
    }
}

export default LabelForm;
