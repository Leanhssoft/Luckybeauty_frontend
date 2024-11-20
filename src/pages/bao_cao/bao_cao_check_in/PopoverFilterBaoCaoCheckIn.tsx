import { useState, useEffect } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { Mark } from '@mui/base';

import { IPropsPopoverFilter } from '../../../services/dto/IPropsComponent';
import { IList } from '../../../services/dto/IList';
import AppConsts, { ISelect, LoaiSoSanh_Number, TrangThaiActive } from '../../../lib/appconst';
import { Popover, Grid, Box, Stack, Button, Typography, TextField } from '@mui/material';
import MultipleAutocompleteWithData from '../../../components/Autocomplete/MultipleAutocompleteWithData';
import suggestStore from '../../../stores/suggestStore';
import ListCheckbox from '../../../components/Checkbox/ListCheckbox';
import ListRadio from '../../../components/Radio/ListRadio';
import AutocompleteWithData from '../../../components/Autocomplete/AutocompleteWithData';
import { IDataAutocomplete } from '../../../services/dto/IDataAutocomplete';
import SliderFilterNumber from '../../../components/Slider/SliderFilterNumber';
import { parseInt, values } from 'lodash';
import SelectWithData from '../../../components/Select/SelectWithData';
import { ParamSearchBaoCaoCheckIn } from '../../../services/bao_cao/bao_cao_check_in/baoCaoCheckInDto';

export const ConstBaoCaoCheckIn_ColumCompare = {
    SOLAN_CHECKIN: 1,
    SOLAN_DATHEN: 1
};

export default function PopoverFilterBaoCaoCheckIn(props: IPropsPopoverFilter<ParamSearchBaoCaoCheckIn>) {
    const { id, anchorEl, handleClose, handleApply, paramFilter } = props;
    const [paramFilterThis, setParamFilterThis] = useState<ParamSearchBaoCaoCheckIn>({} as ParamSearchBaoCaoCheckIn);
    const [soLanCheckIn_LoaiSoSanh, setSoLanCheckIn_LoaiSoSanh] = useState(
        paramFilter?.soLanCheckIn_LoaiSoSanh ?? LoaiSoSanh_Number.NONE
    );
    const [soNgayChuaCheckIn_LoaiSoSanh, setSoNgayChuaCheckIn_LoaiSoSanh] = useState(
        paramFilter?.soNgayChuaCheckIn_LoaiSoSanh ?? LoaiSoSanh_Number.NONE
    );
    const [soLanDatHen_LoaiSoSanh, setSoLanDatHen_LoaiSoSanh] = useState(LoaiSoSanh_Number.NONE);

    useEffect(() => {
        setParamFilterThis({
            ...paramFilterThis,
            idChiNhanhs: paramFilter?.idChiNhanhs
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
    const changeSoNgayChuaCheckIn = (minValue: number | null, maxValue: number | null) => {
        setParamFilterThis({
            ...paramFilterThis,
            soNgayChuaCheckIn_From: minValue,
            soNgayChuaCheckIn_To: maxValue
        });
    };

    useEffect(() => {
        soLanCheckIn_changeGiaTriSoSanh(paramFilterThis?.soLanCheckIn_From as unknown as string);
    }, [soLanCheckIn_LoaiSoSanh]);

    useEffect(() => {
        soNgayChuaCheckIn_changeGiaTriSoSanh(paramFilterThis?.soNgayChuaCheckIn_From as unknown as string);
    }, [soLanCheckIn_LoaiSoSanh]);

    useEffect(() => {
        soLanDatHen_changeGiaTriSoSanh(paramFilterThis?.soLanCheckIn_From as unknown as string);
    }, [soLanDatHen_LoaiSoSanh]);

    const soLanCheckIn_changeGiaTriSoSanh = (valText: string) => {
        let newVal: number = parseInt(valText);
        if (isNaN(newVal)) {
            newVal = 0;
        }
        switch (soLanCheckIn_LoaiSoSanh) {
            case LoaiSoSanh_Number.NONE:
                {
                    setParamFilterThis({
                        ...paramFilterThis,
                        soLanCheckIn_From: null,
                        soLanCheckIn_To: null
                    });
                }
                break;
            case LoaiSoSanh_Number.EQUALS:
                {
                    setParamFilterThis({
                        ...paramFilterThis,
                        soLanCheckIn_From: newVal,
                        soLanCheckIn_To: newVal
                    });
                }
                break;
            case LoaiSoSanh_Number.GREATER_THAN:
                {
                    setParamFilterThis({
                        ...paramFilterThis,
                        soLanCheckIn_From: newVal + 1,
                        soLanCheckIn_To: null
                    });
                }
                break;
            case LoaiSoSanh_Number.GREATER_THAN_OR_EQUALS:
                {
                    setParamFilterThis({
                        ...paramFilterThis,
                        soLanCheckIn_From: newVal,
                        soLanCheckIn_To: null
                    });
                }
                break;
            case LoaiSoSanh_Number.LESS_THAN:
                {
                    setParamFilterThis({
                        ...paramFilterThis,
                        soLanCheckIn_From: null,
                        soLanCheckIn_To: newVal - 1
                    });
                }
                break;
            case LoaiSoSanh_Number.LESS_THAN_OR_EQUALS:
                {
                    setParamFilterThis({
                        ...paramFilterThis,
                        soLanCheckIn_From: null,
                        soLanCheckIn_To: newVal
                    });
                }
                break;
        }
    };
    const soNgayChuaCheckIn_changeGiaTriSoSanh = (valText: string) => {
        let newVal: number = parseInt(valText);
        if (isNaN(newVal)) {
            newVal = 0;
        }
        switch (soNgayChuaCheckIn_LoaiSoSanh) {
            case LoaiSoSanh_Number.NONE:
                {
                    setParamFilterThis({
                        ...paramFilterThis,
                        soNgayChuaCheckIn_From: null,
                        soNgayChuaCheckIn_To: null
                    });
                    console.log('soNgayChuaCheckIn_changeGiaTriSoSanh ', newVal, valText);
                }
                break;
            case LoaiSoSanh_Number.EQUALS:
                {
                    setParamFilterThis({
                        ...paramFilterThis,
                        soNgayChuaCheckIn_From: newVal,
                        soNgayChuaCheckIn_To: newVal
                    });
                }
                break;
            case LoaiSoSanh_Number.GREATER_THAN:
                {
                    setParamFilterThis({
                        ...paramFilterThis,
                        soNgayChuaCheckIn_From: newVal + 1,
                        soNgayChuaCheckIn_To: null
                    });
                }
                break;
            case LoaiSoSanh_Number.GREATER_THAN_OR_EQUALS:
                {
                    setParamFilterThis({
                        ...paramFilterThis,
                        soNgayChuaCheckIn_From: newVal,
                        soNgayChuaCheckIn_To: null
                    });
                }
                break;
            case LoaiSoSanh_Number.LESS_THAN:
                {
                    setParamFilterThis({
                        ...paramFilterThis,
                        soNgayChuaCheckIn_From: null,
                        soNgayChuaCheckIn_To: newVal - 1
                    });
                }
                break;
            case LoaiSoSanh_Number.LESS_THAN_OR_EQUALS:
                {
                    setParamFilterThis({
                        ...paramFilterThis,
                        soNgayChuaCheckIn_From: null,
                        soNgayChuaCheckIn_To: newVal
                    });
                }
                break;
        }
    };
    const soLanDatHen_changeGiaTriSoSanh = (valText: string) => {
        const newVal = parseInt(valText);
        switch (soLanDatHen_LoaiSoSanh) {
            case LoaiSoSanh_Number.NONE:
                {
                    setParamFilterThis({
                        ...paramFilterThis,
                        soLanDatHen_From: null,
                        soLanDatHen_To: null
                    });
                }
                break;
            case LoaiSoSanh_Number.EQUALS:
                {
                    setParamFilterThis({
                        ...paramFilterThis,
                        soLanDatHen_From: newVal,
                        soLanDatHen_To: newVal
                    });
                }
                break;
            case LoaiSoSanh_Number.GREATER_THAN:
                {
                    setParamFilterThis({
                        ...paramFilterThis,
                        soLanDatHen_From: newVal + 1,
                        soLanDatHen_To: null
                    });
                }
                break;
            case LoaiSoSanh_Number.GREATER_THAN_OR_EQUALS:
                {
                    setParamFilterThis({
                        ...paramFilterThis,
                        soLanDatHen_From: newVal,
                        soLanDatHen_To: null
                    });
                }
                break;
            case LoaiSoSanh_Number.LESS_THAN:
                {
                    setParamFilterThis({
                        ...paramFilterThis,
                        soLanDatHen_From: null,
                        soLanDatHen_To: newVal - 1
                    });
                }
                break;
            case LoaiSoSanh_Number.LESS_THAN_OR_EQUALS:
                {
                    setParamFilterThis({
                        ...paramFilterThis,
                        soLanDatHen_From: null,
                        soLanDatHen_To: newVal
                    });
                }
                break;
        }
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
                            <Stack spacing={3}>
                                <MultipleAutocompleteWithData
                                    labelInput="Chi nhánh"
                                    arrIdDefault={paramFilterThis?.idChiNhanhs}
                                    lstOption={suggestStore?.suggestChiNhanh_byUserLogin?.map((x) => {
                                        return {
                                            id: x.id,
                                            text: x.tenChiNhanh
                                        } as IList;
                                    })}
                                    handleChosedItem={choseChiNhanh}
                                />
                                <Stack sx={{ display: 'none' }}>
                                    <Typography variant="body2" fontWeight={500} marginLeft={'30px'}>
                                        Số ngày chưa check in
                                    </Typography>
                                    <Stack paddingTop={1}>
                                        <SliderFilterNumber
                                            lbl="ngày"
                                            lstData={
                                                [
                                                    { value: 7, label: '7' },
                                                    { value: 30, label: '30' },
                                                    { value: 90, label: '90' }
                                                ] as Mark[]
                                            }
                                            onChangeMinMax={changeSoNgayChuaCheckIn}
                                        />
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Typography variant="body2" fontWeight={500}>
                                        Số ngày chưa check in
                                    </Typography>
                                    <Stack paddingTop={2} spacing={1} direction={'row'}>
                                        <Stack width={'100%'}>
                                            <SelectWithData
                                                label="Kiểu so sánh"
                                                data={AppConsts.ListLoaiSoSanh_KieuSo}
                                                idChosed={soNgayChuaCheckIn_LoaiSoSanh}
                                                handleChange={(item: ISelect) =>
                                                    setSoNgayChuaCheckIn_LoaiSoSanh(item.value as number)
                                                }
                                            />
                                        </Stack>

                                        {soNgayChuaCheckIn_LoaiSoSanh !== LoaiSoSanh_Number.NONE && (
                                            <Stack direction={'row'} spacing={2} justifyContent={'center'}>
                                                <TextField
                                                    label={
                                                        soNgayChuaCheckIn_LoaiSoSanh === LoaiSoSanh_Number.OTHER
                                                            ? 'Từ'
                                                            : ''
                                                    }
                                                    size="small"
                                                    defaultValue={paramFilter?.soNgayChuaCheckIn_From}
                                                    onChange={(e) =>
                                                        soNgayChuaCheckIn_changeGiaTriSoSanh(e.target.value)
                                                    }
                                                />
                                                {soNgayChuaCheckIn_LoaiSoSanh === LoaiSoSanh_Number.OTHER && (
                                                    <TextField
                                                        label="Đến"
                                                        size="small"
                                                        defaultValue={paramFilter?.soLanCheckIn_To}
                                                        onChange={(e) =>
                                                            setParamFilterThis({
                                                                ...paramFilterThis,
                                                                soNgayChuaCheckIn_From:
                                                                    paramFilterThis?.soNgayChuaCheckIn_From,
                                                                soNgayChuaCheckIn_To: parseInt(e.target.value)
                                                            })
                                                        }
                                                    />
                                                )}
                                            </Stack>
                                        )}
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Typography variant="body2" fontWeight={500}>
                                        Số lần check in
                                    </Typography>
                                    <Stack paddingTop={2} spacing={1} direction={'row'}>
                                        <Stack width={'100%'}>
                                            <SelectWithData
                                                label="Kiểu so sánh"
                                                data={AppConsts.ListLoaiSoSanh_KieuSo}
                                                idChosed={soLanCheckIn_LoaiSoSanh}
                                                handleChange={(item: ISelect) =>
                                                    setSoLanCheckIn_LoaiSoSanh(item.value as number)
                                                }
                                            />
                                        </Stack>

                                        {soLanCheckIn_LoaiSoSanh !== LoaiSoSanh_Number.NONE && (
                                            <Stack direction={'row'} spacing={2} justifyContent={'center'}>
                                                <TextField
                                                    label={
                                                        soLanCheckIn_LoaiSoSanh === LoaiSoSanh_Number.OTHER ? 'Từ' : ''
                                                    }
                                                    size="small"
                                                    defaultValue={paramFilter?.soLanCheckIn_From}
                                                    onChange={(e) => soLanCheckIn_changeGiaTriSoSanh(e.target.value)}
                                                />
                                                {soLanCheckIn_LoaiSoSanh === LoaiSoSanh_Number.OTHER && (
                                                    <TextField
                                                        label="Đến"
                                                        size="small"
                                                        defaultValue={paramFilter?.soLanCheckIn_To}
                                                        onChange={(e) =>
                                                            setParamFilterThis({
                                                                ...paramFilterThis,
                                                                soLanCheckIn_From: paramFilterThis?.soLanCheckIn_From,
                                                                soLanCheckIn_To: parseInt(e.target.value)
                                                            })
                                                        }
                                                    />
                                                )}
                                            </Stack>
                                        )}
                                    </Stack>
                                </Stack>
                                <Stack sx={{ display: 'none' }}>
                                    <Typography variant="body2" fontWeight={500}>
                                        Số lần đặt hẹn
                                    </Typography>
                                    <Stack paddingTop={2} spacing={1} direction={'row'}>
                                        <Stack
                                            width={soLanDatHen_LoaiSoSanh === LoaiSoSanh_Number.OTHER ? '50%' : '100%'}>
                                            <SelectWithData
                                                label="Kiểu so sánh"
                                                data={AppConsts.ListLoaiSoSanh_KieuSo}
                                                idChosed={soLanDatHen_LoaiSoSanh}
                                                handleChange={(item: ISelect) =>
                                                    setSoLanDatHen_LoaiSoSanh(item.value as number)
                                                }
                                            />
                                        </Stack>

                                        {soLanDatHen_LoaiSoSanh !== LoaiSoSanh_Number.NONE && (
                                            <Stack direction={'row'} spacing={2} justifyContent={'center'}>
                                                <TextField
                                                    label={
                                                        soLanDatHen_LoaiSoSanh === LoaiSoSanh_Number.OTHER ? 'Từ' : ''
                                                    }
                                                    size="small"
                                                    defaultValue={paramFilter?.soLanDatHen_From}
                                                    onChange={(e) => soLanDatHen_changeGiaTriSoSanh(e.target.value)}
                                                />
                                                {soLanDatHen_LoaiSoSanh === LoaiSoSanh_Number.OTHER && (
                                                    <TextField
                                                        label="Đến"
                                                        size="small"
                                                        defaultValue={paramFilter?.soLanDatHen_To}
                                                        onChange={(e) =>
                                                            setParamFilterThis({
                                                                ...paramFilterThis,
                                                                soLanDatHen_From: paramFilterThis?.soLanDatHen_From,
                                                                soLanDatHen_To: parseInt(e.target.value)
                                                            })
                                                        }
                                                    />
                                                )}
                                            </Stack>
                                        )}
                                    </Stack>
                                </Stack>
                                <Stack sx={{ display: 'none' }}>
                                    <Typography variant="body2" fontWeight={500}>
                                        Nhóm khách
                                    </Typography>
                                    <Stack paddingTop={1} overflow={'auto'} maxHeight={200}>
                                        <ListCheckbox
                                            arrValueDefault={[]}
                                            isShowCheckAll={true}
                                            lstOption={suggestStore?.suggestNhomKhach?.map((x) => {
                                                return {
                                                    value: x.id,
                                                    text: x.tenNhomKhach
                                                } as ISelect;
                                            })}
                                            onChange={(arrChosed: string[] | number[]) =>
                                                setParamFilterThis({
                                                    ...paramFilterThis,
                                                    idNhomKhachs: arrChosed as string[]
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
