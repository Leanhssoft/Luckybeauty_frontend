import { Popover, Button, ButtonGroup, Stack, TextField, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import utils from '../../utils/utils';

type PropsGiamGiaComponent = {
    tongTienHang: number;
    ptGiamGia: number;
    tongGiamGia: number;
    open: boolean;
    anchorEl: HTMLElement | SVGElement | null;
    onClosePopover: () => void;
    onUpdateGiamGia?: (ptGiamGia: number, tongGiamGiaHD: number) => void;
};

const PopoverGiamGiaHD = ({
    tongTienHang,
    ptGiamGia,
    tongGiamGia,
    open,
    anchorEl,
    onClosePopover,
    onUpdateGiamGia
}: PropsGiamGiaComponent) => {
    const [laPTGiamGia, setLaPTGiamGia] = useState(true);
    const [ptGiamGiaHD, setPTGiamGiaHD] = useState(0);
    const [tongGiamGiaHD, setTongGiamGiaHD] = useState(0);
    const gtriXX = laPTGiamGia ? ptGiamGiaHD : tongGiamGiaHD;

    useEffect(() => {
        if (open) {
            if (ptGiamGia > 0) {
                setLaPTGiamGia(true);
            } else {
                if (tongGiamGia == 0) {
                    setLaPTGiamGia(true);
                } else {
                    setLaPTGiamGia(false);
                }
            }
            setPTGiamGiaHD(ptGiamGia);
            setTongGiamGiaHD(tongGiamGia);
        }
    }, [open]);

    useEffect(() => {
        if (onUpdateGiamGia) {
            onUpdateGiamGia(ptGiamGiaHD, tongGiamGiaHD);
        }
    }, [ptGiamGiaHD, tongGiamGiaHD]);

    const onChangeGtriGiamGia = (gtri: string) => {
        let gtriNew = utils.formatNumberToFloat(gtri);
        let ptGiamGiaNew = 0;
        if (gtriNew > tongTienHang) {
            gtriNew = tongTienHang;
        }
        let gtriVND = 0;
        if (tongTienHang > 0) {
            if (laPTGiamGia) {
                gtriVND = (gtriNew * tongTienHang) / 100;
                ptGiamGiaNew = gtriNew;
            } else {
                gtriVND = gtriNew;
            }
        }
        setPTGiamGiaHD(ptGiamGiaNew);
        setTongGiamGiaHD(gtriVND);
    };
    const onClickPTramVND = (newVal: boolean) => {
        let gtriPT = 0;
        if (!laPTGiamGia) {
            if (newVal && tongTienHang > 0) {
                gtriPT = (tongGiamGiaHD / tongTienHang) * 100;
                setPTGiamGiaHD(gtriPT);
            }
        }
        setLaPTGiamGia(newVal);
    };

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClosePopover}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left'
            }}>
            <Stack padding={2}>
                <Stack spacing={2}>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography variant="body1" fontWeight={500}>
                            Giảm giá
                        </Typography>
                        {tongGiamGiaHD > 0 && (
                            <Typography variant="caption" fontWeight={500}>
                                {Intl.NumberFormat('vi-VN').format(tongGiamGiaHD)}
                            </Typography>
                        )}
                    </Stack>

                    <Stack direction={'row'} alignItems={'center'}>
                        <NumericFormat
                            size="small"
                            fullWidth
                            autoFocus
                            value={gtriXX}
                            decimalSeparator=","
                            thousandSeparator="."
                            isAllowed={(values) => {
                                const floatValue = values.floatValue;
                                if (laPTGiamGia) return (floatValue ?? 0) <= 100; // neu %: khong cho phep nhap qua 100%
                                if (!laPTGiamGia) return (floatValue ?? 0) <= tongTienHang;
                                return true;
                            }}
                            customInput={TextField}
                            onChange={(event) => onChangeGtriGiamGia(event.target.value)}
                        />
                        <ButtonGroup>
                            <Button
                                onClick={() => onClickPTramVND(true)}
                                sx={{
                                    bgcolor: laPTGiamGia ? '#1976d2' : 'white',
                                    color: laPTGiamGia ? 'white' : 'black',
                                    '&:hover ': {
                                        bgcolor: 'var(--color-main)',
                                        color: 'white'
                                    }
                                }}>
                                %
                            </Button>
                            <Button
                                onClick={() => onClickPTramVND(false)}
                                sx={{
                                    color: !laPTGiamGia ? 'white' : 'black',
                                    bgcolor: !laPTGiamGia ? '#1976d2' : 'white'
                                }}>
                                đ
                            </Button>
                        </ButtonGroup>
                    </Stack>
                </Stack>
            </Stack>
        </Popover>
    );
};
export default PopoverGiamGiaHD;
