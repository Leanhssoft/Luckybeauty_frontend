import { Stack, Typography } from '@mui/material';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import { CSSProperties } from 'styled-components';

export type IPropPageEmpty = {
    text?: string;
    icon?: React.ReactNode;
    style?: CSSProperties;
};

export default function PageEmpty(props: IPropPageEmpty) {
    const { icon, text, style, ...other } = props;
    return (
        <Stack
            spacing={2}
            alignItems={'center'}
            justifyContent={'center'}
            {...other}
            style={style}
            sx={{ backgroundColor: '#f2f2ea' }}>
            {icon ?? <NoteAddOutlinedIcon style={{ width: 80, height: 80, color: '#d3cbc0' }} />}
            <Typography fontSize={'16px'}>{text ?? 'Không có dữ liệu'}</Typography>
        </Stack>
    );
}
