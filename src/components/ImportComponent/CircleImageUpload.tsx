import { Box, Stack, TextField } from '@mui/material';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import utils from '../../utils/utils';

export default function CircleImageUpload({ pathImg, handeChoseImage, handleCloseImage, roleChangeImg = true }: any) {
    const choseImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!roleChangeImg) return;
        await closeImage();
        if (e.target.files && e.target.files[0]) {
            const file: File = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                handeChoseImage(reader.result?.toString() ?? '', file);
            };
        }
    };
    const closeImage = async () => {
        handleCloseImage();
    };
    return (
        <>
            <Stack position={'relative'} sx={{ alignItems: 'center!important', top: '20%' }}>
                {!utils.checkNull(pathImg) ? (
                    <Box
                        sx={{
                            position: 'relative'
                        }}>
                        <img src={pathImg} className="user-image-upload" />
                    </Box>
                ) : (
                    <div>
                        <PersonOutlinedIcon className="user-icon-upload" />
                    </div>
                )}
                <TextField
                    type={roleChangeImg ? 'file' : 'text'}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        '& input': {
                            height: '100%'
                        },
                        '& div': {
                            height: '100%'
                        }
                    }}
                    onChange={choseImage}
                />
            </Stack>
        </>
    );
}
