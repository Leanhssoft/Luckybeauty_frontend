import { Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
const CustomSwitch = styled(Switch)(({ theme }) => ({
    width: 64,
    height: 32,
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 28,
            height: 28,
            margin: 2
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(0px)'
        }
    },
    '& .MuiSwitch-switchBase': {
        padding: 0,
        '&.Mui-checked': {
            transform: 'translateX(32px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#3699FF'
            }
        }
    },
    '& .MuiSwitch-thumb': {
        margin: 2,
        width: 28,
        height: 28,
        borderRadius: 32 / 2
    },
    '& .MuiSwitch-track': {
        borderRadius: 32 / 2,
        opacity: 1,
        backgroundColor: '#EBEDF3'
    }
}));
export default CustomSwitch;
