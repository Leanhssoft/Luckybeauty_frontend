import { Popover, Stack, Typography, Button, Grid, TextField } from '@mui/material';
import MultipleAutocompleteWithData from '../../../components/Autocomplete/MultipleAutocompleteWithData';
import { IList } from '../../../services/dto/IList';
import ClearIcon from '@mui/icons-material/Clear';
import { DateType, ISelect, LoaiChungTu } from '../../../lib/appconst';
import ListRadio from '../../../components/Radio/ListRadio';
import ListCheckbox from '../../../components/Checkbox/ListCheckbox';
import { useState, useEffect } from 'react';
import { HoaDonRequestDto } from '../../../services/dto/ParamSearchDto';
import { TrangThaiNo, TrangThaiHoaDon } from '../../../services/ban_hang/HoaDonConst';
import { IPropsPopoverFilter } from '../../../services/dto/IPropsComponent';
import suggestStore from '../../../stores/suggestStore';
import DateFilterCustom from '../../../components/DatetimePicker/DateFilterCustom';
import { addDays, format } from 'date-fns';

export default function PopoverFilterHoaDon(props: IPropsPopoverFilter<HoaDonRequestDto>) {
    const { id, anchorEl, handleClose, handleApply, paramFilter } = props;
    const [paramFilterThis, setParamFilterThis] = useState<HoaDonRequestDto>({} as HoaDonRequestDto);
    const [anchorDateEl, setAnchorDateEl] = useState<HTMLDivElement | null>(null);
    const openDateFilter = Boolean(anchorDateEl);

    useEffect(() => {
        // set again idChiNhanh if change at header
        setParamFilterThis({
            ...paramFilterThis,
            idChiNhanhs: paramFilter?.idChiNhanhs,
            trangThaiNos: paramFilter?.trangThaiNos,
            fromDate: paramFilter?.fromDate,
            toDate: paramFilter?.toDate,
            dateType: paramFilter?.dateType ?? DateType.THANG_NAY,
            trangThais: paramFilter?.trangThais ?? [TrangThaiHoaDon.HOAN_THANH]
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

    const onApplyFilterDate = async (from: string, to: string, dateType: string) => {
        setAnchorDateEl(null);
        setParamFilterThis({
            ...paramFilterThis,
            fromDate: from,
            toDate: format(addDays(new Date(to), 1), 'yyyy-MM-dd'),
            currentPage: 1,
            dateType: dateType
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
                                {(paramFilter?.idLoaiChungTus?.includes(LoaiChungTu.THE_GIA_TRI) ||
                                    paramFilter?.idLoaiChungTus?.includes(LoaiChungTu.PHIEU_DIEU_CHINH_TGT)) && (
                                    <Stack>
                                        <Typography variant="body2" fontWeight={500}>
                                            Thời gian
                                        </Typography>
                                        <TextField
                                            label=""
                                            size="small"
                                            fullWidth
                                            variant="outlined"
                                            sx={{
                                                paddingTop: 1,
                                                '& .MuiInputBase-root': {
                                                    height: '40px!important'
                                                },
                                                backgroundColor: 'white'
                                            }}
                                            onClick={(event) => setAnchorDateEl(event.currentTarget)}
                                            value={`${format(
                                                new Date(paramFilterThis?.fromDate ?? new Date()),
                                                'dd/MM/yyyy'
                                            )} - ${format(
                                                new Date(paramFilterThis?.toDate ?? new Date()),
                                                'dd/MM/yyyy'
                                            )}`}
                                        />
                                        <DateFilterCustom
                                            id="popover-date-filter"
                                            open={openDateFilter}
                                            anchorEl={anchorDateEl}
                                            onClose={() => setAnchorDateEl(null)}
                                            onApplyDate={onApplyFilterDate}
                                            dateTypeDefault={paramFilterThis?.dateType ?? DateType.THANG_NAY}
                                        />
                                    </Stack>
                                )}

                                <Stack>
                                    <Typography variant="body2" fontWeight={500}>
                                        Trạng thái
                                    </Typography>
                                    <Stack paddingTop={1}>
                                        <ListRadio
                                            lstOption={
                                                [
                                                    { value: TrangThaiHoaDon.HOAN_THANH, text: 'Hoàn thành' },
                                                    { value: TrangThaiHoaDon.HUY, text: 'Hủy' }
                                                ] as ISelect[]
                                            }
                                            defaultValue={
                                                paramFilterThis?.trangThais
                                                    ? paramFilterThis.trangThais[0]
                                                    : TrangThaiHoaDon.HOAN_THANH
                                            }
                                            onChange={(valNew: any) =>
                                                setParamFilterThis({
                                                    ...paramFilterThis,
                                                    trangThais: [valNew]
                                                })
                                            }
                                        />
                                    </Stack>
                                </Stack>
                                {!paramFilter?.idLoaiChungTus?.includes(LoaiChungTu.PHIEU_DIEU_CHINH_TGT) && (
                                    <Stack>
                                        <Typography variant="body2" fontWeight={500}>
                                            Trạng thái nợ
                                        </Typography>
                                        <Stack paddingTop={1}>
                                            <ListCheckbox
                                                arrValueDefault={paramFilterThis.trangThaiNos as unknown as number[]}
                                                lstOption={
                                                    [
                                                        { value: TrangThaiNo.CON_NO, text: 'Còn nợ' },
                                                        { value: TrangThaiNo.HET_NO, text: 'Hết nợ' }
                                                    ] as ISelect[]
                                                }
                                                onChange={(arrChosed: number[] | string[]) =>
                                                    setParamFilterThis({
                                                        ...paramFilterThis,
                                                        trangThaiNos: arrChosed as number[]
                                                    })
                                                }
                                            />
                                        </Stack>
                                    </Stack>
                                )}

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
