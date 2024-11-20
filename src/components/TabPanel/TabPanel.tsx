import { Box, Stack } from '@mui/material';
import { CSSProperties } from 'styled-components';

interface TabPanelProps {
    children?: React.ReactNode;
    value: number;
    index: number;
    style?: CSSProperties;
}
export default function TabPanel(props: TabPanelProps) {
    const { children, value, index, style, ...other } = props;
    return (
        <Stack hidden={value !== index} {...other} width="100%">
            {value === index && (
                <Box marginTop={3} style={style}>
                    {children}
                </Box>
            )}
        </Stack>
    );
}
