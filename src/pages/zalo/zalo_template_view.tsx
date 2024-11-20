import { Stack, Typography, Grid, Button } from '@mui/material';
import ZaloService from '../../services/zalo/ZaloService';
import { useEffect, useState } from 'react';
import { IZaloButtonDetail, IZaloTableDetail } from '../../services/zalo/ZaloTemplateDto';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import CaiDatNhacNhoService from '../../services/sms/cai_dat_nhac_nho/CaiDatNhacNhoService';

export type PropsZaloTempView = {
    logoBanner?: string;
    headerText: string;
    contentText: string;
    tables?: IZaloTableDetail[];
    buttons?: IZaloButtonDetail[];
};

export const ZaloTemplateView = (props: PropsZaloTempView) => {
    const { logoBanner, headerText, contentText, tables, buttons } = props;
    const headerTextNew = CaiDatNhacNhoService.ReplaceBienSMS(headerText);
    const contentTextNew = CaiDatNhacNhoService.ReplaceBienSMS(contentText);
    // todo replace content
    return (
        <>
            <Stack spacing={1} padding={2}>
                {logoBanner && <img src={logoBanner} style={{ width: '200px', height: '48px' }} />}

                <Typography variant="body1" fontWeight={600}>
                    {headerTextNew}
                </Typography>
                <Typography variant="body2">{contentTextNew}</Typography>

                {tables?.map((x, index) => (
                    <Grid container key={index}>
                        <Grid item xs={4}>
                            <Typography variant="body2">{x.key}</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="body2">{x.value}</Typography>
                        </Grid>
                    </Grid>
                ))}

                <Stack spacing={1}>
                    {buttons?.map((x, index: number) => (
                        <Button variant="contained" key={index}>
                            {x.title}
                        </Button>
                    ))}
                </Stack>
            </Stack>
        </>
    );
};
