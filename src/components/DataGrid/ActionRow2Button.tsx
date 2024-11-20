import { Stack } from '@mui/material';
import { ReactComponent as DeleteIcon } from '../../images/trash.svg';

import ClearIcon from '@mui/icons-material/Clear';
import BorderHorizontalOutlinedIcon from '@mui/icons-material/BorderHorizontalOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { TypeAction } from '../../lib/appconst';

export default function ActionRow2Button({ handleClickAction }: any) {
    const onClickAction = (type: number) => {
        handleClickAction(type);
    };
    return (
        <>
            <Stack spacing={1} direction={'row'}>
                <BorderColorOutlinedIcon
                    titleAccess="Cập nhật"
                    sx={{ width: '16px', color: '#7e7979' }}
                    onClick={() => onClickAction(TypeAction.UPDATE)}
                />
                <DeleteIcon
                    title="Xóa"
                    style={{ width: '16px', color: '#7e7979' }}
                    onClick={() => onClickAction(TypeAction.DELETE)}
                />
            </Stack>
        </>
    );
}
