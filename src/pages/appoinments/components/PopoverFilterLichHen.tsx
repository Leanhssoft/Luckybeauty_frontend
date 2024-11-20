import { Popover, Stack, Typography, Button, Grid } from '@mui/material';
import MultipleAutocompleteWithData from '../../../components/Autocomplete/MultipleAutocompleteWithData';
import { IList } from '../../../services/dto/IList';
import ClearIcon from '@mui/icons-material/Clear';
import { DateType, ISelect } from '../../../lib/appconst';
import ListCheckbox from '../../../components/Checkbox/ListCheckbox';
import { useState, useEffect } from 'react';
import { IPropsPopoverFilter } from '../../../services/dto/IPropsComponent';
import suggestStore from '../../../stores/suggestStore';
import { RequestFromToDto } from '../../../services/dto/ParamSearchDto';
import TrangThaiBooking from '../../../enum/TrangThaiBooking';

export default function PopoverFilterLichHen(props: IPropsPopoverFilter<RequestFromToDto>) {
    const { id, anchorEl, handleClose, handleApply, paramFilter } = props;
    const [paramFilterThis, setParamFilterThis] = useState<RequestFromToDto>({} as RequestFromToDto);

    useEffect(() => {
        // set again idChiNhanh if change at header
        setParamFilterThis({
            ...paramFilterThis,
            idChiNhanhs: paramFilter?.idChiNhanhs,
            fromDate: paramFilter?.fromDate,
            toDate: paramFilter?.toDate,
            dateType: paramFilter?.dateType ?? DateType.THANG_NAY,
            trangThais: paramFilter?.trangThais ?? [TrangThaiBooking.Wait, TrangThaiBooking.Confirm]
        });
    }, [paramFilter?.idChiNhanhs]);

    const choseChiNhanh = (lstChosed: IList[]) => {
        setParamFilterThis({
            ...paramFilterThis,
            idChiNhanhs: lstChosed?.map((x) => {
                return x.id;
            })
        });
    };

    const onClickApDung = () => {
        handleApply(paramFilterThis);
    };
    return (
        <>
            <Popover
                id={id ?? 'popover-filter'}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}>
                <Grid padding={2} container minWidth={300} position={'relative'}>
                    <Grid item xs={12}>
                        <Stack spacing={3}>
                            <Typography fontWeight={600}>Bộ lọc</Typography>
                            <Stack spacing={2}>
                                <MultipleAutocompleteWithData
                                    labelInput="Chi nhánh"
                                    arrIdDefault={paramFilterThis?.idChiNhanhs}
                                    lstOption={suggestStore?.suggestChiNhanh_byUserLogin?.map((x) => {
                                        return {
                                            id: x.id,
                                            text: x.tenChiNhanh
                                        };
                                    })}
                                    handleChosedItem={choseChiNhanh}
                                />

                                <Stack>
                                    <Typography variant="body2" fontWeight={500}>
                                        Trạng thái
                                    </Typography>
                                    <Stack paddingTop={1}>
                                        <ListCheckbox
                                            lstOption={
                                                [
                                                    { value: TrangThaiBooking.Wait, text: 'Chờ xác nhận' },
                                                    { value: TrangThaiBooking.Confirm, text: 'Đã xác nhận' },
                                                    { value: TrangThaiBooking.CheckIn, text: 'Đang check-in' },
                                                    { value: TrangThaiBooking.Success, text: 'Hoàn thành' },
                                                    { value: TrangThaiBooking.Cancel, text: 'Đã hủy' }
                                                ] as ISelect[]
                                            }
                                            arrValueDefault={paramFilterThis?.trangThais ?? []}
                                            onChange={(arr: number[] | string[]) =>
                                                setParamFilterThis({
                                                    ...paramFilterThis,
                                                    trangThais: arr as number[]
                                                })
                                            }
                                        />
                                    </Stack>
                                </Stack>

                                <Stack direction={'row'} justifyContent={'end'} spacing={1}>
                                    <Button variant="outlined" fullWidth onClick={handleClose}>
                                        Đóng
                                    </Button>
                                    <Button variant="contained" fullWidth onClick={onClickApDung}>
                                        Áp dụng
                                    </Button>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Grid>
                    <ClearIcon sx={{ position: 'absolute', top: 10, right: 5 }} onClick={handleClose} />
                </Grid>
            </Popover>
        </>
    );
}
