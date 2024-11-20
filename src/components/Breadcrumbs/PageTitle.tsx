import { Breadcrumbs, Typography } from '@mui/material';

export default function BreadcrumbsPageTitle({ listLink }: any) {
    return (
        <>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
                {listLink.map((item: any, index: any) => (
                    <Typography key={index} color={item.color} variant="body1" fontSize="14px">
                        {item.text}
                    </Typography>
                ))}
            </Breadcrumbs>
        </>
    );
}
