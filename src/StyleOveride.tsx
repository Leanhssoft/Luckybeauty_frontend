import { createTheme } from '@mui/material/styles';

class StyleOveride {
    placeholderTextField = createTheme({
        components: {
            MuiInputBase: {
                styleOverrides: {
                    input: {
                        '&::placeholder': {
                            fontSize: 14 // Change this value to your desired font size
                        }
                    }
                }
            }
        }
    });
}

export default new StyleOveride();
