import { Stack, Typography } from '@mui/material';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';

export default function PageEmpty(props: any) {
    return (
        <>
            <Stack style={props.style}>
                <Stack alignItems={'center'} paddingTop={'10%'}>
                    <LibraryBooksOutlinedIcon sx={{ width: 200, height: 200, color: 'antiquewhite' }} />
                    <Typography color={'burlywood'}>Không có dữ liệu</Typography>
                </Stack>
            </Stack>
        </>
    );
}
