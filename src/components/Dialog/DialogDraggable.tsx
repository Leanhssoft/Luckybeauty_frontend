import { Paper, PaperProps } from '@mui/material';
import Draggable from 'react-draggable';

export default function DialogDraggable(props: PaperProps) {
    return (
        <Draggable handle={`#${props['aria-labelledby']}`} cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}
