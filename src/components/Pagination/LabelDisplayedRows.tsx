import { Typography } from '@mui/material';
export const LabelDisplayedRows = ({ currentPage, pageSize, totalCount }: any) => {
    return (
        <>
            <Typography variant="body2" style={{ paddingTop: '6px' }}>
                Hiển thị {(currentPage - 1) * pageSize + 1} -{' '}
                {currentPage * pageSize > totalCount ? totalCount : currentPage * pageSize} của {totalCount} bản ghi
            </Typography>
        </>
    );
};
