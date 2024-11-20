import { CustomerSMSDto, ParamSearchSMS } from '../../services/sms/gui_tin_nhan/gui_tin_nhan_dto';
import * as React from 'react';
import { Autocomplete, Grid, TextField, Typography, Box, Stack } from '@mui/material';
import { useState, useRef } from 'react';
import { debounce } from '@mui/material/utils';
import { LoaiTin, SMS_HinhThucGuiTin, TrangThaiSMS } from '../../lib/appconst';
import khachHangService from '../../services/khach-hang/khachHangService';
import HeThongSMSServices from '../../services/sms/gui_tin_nhan/he_thong_sms_services';
import { PagedKhachHangResultRequestDto } from '../../services/khach-hang/dto/PagedKhachHangResultRequestDto';
import utils from '../../utils/utils';
import ZaloService from '../../services/zalo/ZaloService';
import suggestStore from '../../stores/suggestStore';
import { format } from 'date-fns';

export type IPropsZalo_AutocompleteMultipleCustomer = {
    label?: string;
    helperText?: string;
    isError?: boolean;
    paramFilter: ParamSearchSMS;
    arrIdChosed?: string[];
    handleChoseItem: (arrChosed: CustomerSMSDto[]) => void;
};

export default function Zalo_MultipleAutoComplete_WithSDT(props: IPropsZalo_AutocompleteMultipleCustomer) {
    const { label, helperText, isError, arrIdChosed, paramFilter, handleChoseItem } = props;
    const [lstOption, setLstOption] = useState<CustomerSMSDto[]>([]);
    const [lstChosed, setLstChosed] = useState<CustomerSMSDto[]>([]);
    const [textSearch, setTextSearch] = useState('');

    const getInforCustomerFromDB = async () => {
        if (arrIdChosed !== undefined && arrIdChosed != null) {
            const arr: CustomerSMSDto[] = [];
            for (let i = 0; i < arrIdChosed.length; i++) {
                const element = arrIdChosed[i];
                const customer = await khachHangService.getKhachHang(element);
                arr.push({
                    id: customer?.id,
                    idKhachHang: customer?.id,
                    zoaUserId: customer?.zoaUserId,
                    tenKhachHang: customer?.tenKhachHang,
                    soDienThoai: customer?.soDienThoai,
                    avatar: customer?.avatar
                } as CustomerSMSDto);
            }
            setLstChosed(arr);
            handleChoseItem(arr);
        } else {
            setLstChosed([]);
        }
    };

    const debounceDropDown = useRef(
        debounce(async (paramFilter, textSearch) => {
            paramFilter.textSearch = textSearch; // txtSearch
            switch (paramFilter?.idLoaiTin) {
                case LoaiTin.TIN_THUONG:
                    {
                        // only search by textsearch
                        const param = {
                            keyword: textSearch,
                            loaiDoiTuong: 1,
                            skipCount: 0,
                            maxResultCount: 50,
                            isUserZalo: paramFilter?.loaiUser_CoTheGuiTin ?? 0
                        } as PagedKhachHangResultRequestDto;

                        let arrUser: CustomerSMSDto[] = [];

                        let hinhThucGui = SMS_HinhThucGuiTin.SMS;
                        if (paramFilter?.hinhThucGuiTins?.length > 0) {
                            hinhThucGui = paramFilter?.hinhThucGuiTins[0];
                        }

                        switch (hinhThucGui) {
                            case SMS_HinhThucGuiTin.SMS:
                                {
                                    // get all customer has phone number
                                    const param = {
                                        keyword: textSearch,
                                        loaiDoiTuong: 1,
                                        skipCount: 0,
                                        maxResultCount: 50
                                    } as PagedKhachHangResultRequestDto;
                                    const data = await khachHangService.jqAutoCustomer(param);
                                    arrUser = data?.map((x) => {
                                        return {
                                            id: x?.id?.toString(),
                                            idKhachHang: x?.id?.toString(),
                                            maKhachHang: x?.maKhachHang ?? '',
                                            tenKhachHang: x?.tenKhachHang,
                                            soDienThoai: x?.soDienThoai,
                                            avatar: x?.avatar
                                        } as CustomerSMSDto;
                                    });
                                }
                                break;
                            case SMS_HinhThucGuiTin.ZALO:
                                {
                                    if ((paramFilter?.loaiUser_CoTheGuiTin ?? 0) == 0) {
                                        // get all user co tuongtac voi oa
                                        const allUser = await ZaloService.ZOA_GetDanhSachNguoiDung(
                                            suggestStore?.zaloAccessToken ?? ''
                                        );
                                        if (allUser?.users !== undefined) {
                                            for (let i = 0; i < allUser?.users?.length; i++) {
                                                const itFor = allUser?.users[i];
                                                const zaloUser = await ZaloService.GetInforUser_ofOA(
                                                    suggestStore?.zaloAccessToken ?? '',
                                                    itFor.user_id
                                                );
                                                if (zaloUser !== null) {
                                                    const zaloName = zaloUser?.display_name ?? '';
                                                    // tìm kiếm theo tên
                                                    if (
                                                        zaloName.includes(textSearch) ||
                                                        utils.strToEnglish(zaloName).includes(textSearch) ||
                                                        utils
                                                            .strToEnglish(zaloName)
                                                            .includes(utils.strToEnglish(textSearch))
                                                    ) {
                                                        itFor.id = zaloUser?.user_id;
                                                        itFor.zoaUserId = zaloUser?.user_id;
                                                        itFor.tenKhachHang = zaloUser?.display_name;
                                                        itFor.avatar = zaloUser?.avatar;
                                                        arrUser.push(itFor);
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        // chỉ get khách hàng có tk zoaId (DB)
                                        const data = await khachHangService.jqAutoCustomer(param);
                                        for (let i = 0; i < data?.length; i++) {
                                            const itFor = data[i];
                                            if (!utils.checkNull(itFor?.zoaUserId)) {
                                                const zaloUser = await ZaloService.GetInforUser_ofOA(
                                                    suggestStore?.zaloAccessToken ?? '',
                                                    itFor?.zoaUserId ?? ''
                                                );
                                                // get avartar zalo
                                                const newCus = {
                                                    id: itFor?.id?.toString(),
                                                    idKhachHang: itFor?.id?.toString(),
                                                    zoaUserId: itFor?.zoaUserId ?? '',
                                                    tenKhachHang: itFor?.tenKhachHang,
                                                    soDienThoai: itFor?.soDienThoai,
                                                    avatar: zaloUser?.avatar ?? ''
                                                } as CustomerSMSDto;
                                                arrUser.push(newCus);
                                            }
                                        }
                                    }
                                }
                                break;
                        }

                        setLstOption(arrUser);
                    }
                    break;
                case LoaiTin.TIN_SINH_NHAT:
                case LoaiTin.TIN_LICH_HEN:
                case LoaiTin.TIN_GIAO_DICH:
                    {
                        paramFilter.isFilterCustomer = true;
                        paramFilter.trangThais = [TrangThaiSMS.DRAFT, TrangThaiSMS.CHUA_GUI];
                        const data = await HeThongSMSServices.JqAutoCustomer_byIdLoaiTin(
                            paramFilter,
                            paramFilter?.idLoaiTin
                        );
                        if (data !== null) {
                            if ((paramFilter?.loaiUser_CoTheGuiTin ?? 0) == 2) {
                                const arrUser: CustomerSMSDto[] = [];
                                for (let i = 0; i < data?.length; i++) {
                                    const itFor = data[i];
                                    if (!utils.checkNull(itFor?.zoaUserId)) {
                                        const zaloUser = await ZaloService.GetInforUser_ofOA(
                                            suggestStore?.zaloAccessToken ?? '',
                                            itFor.zoaUserId
                                        );
                                        itFor.avatar = zaloUser?.avatar;
                                        arrUser.push(itFor);
                                    }
                                }
                                setLstOption(arrUser);
                            } else {
                                setLstOption(data);
                            }
                        }
                    }
                    break;
            }
        }, 500)
    ).current;

    React.useEffect(() => {
        debounceDropDown(paramFilter, textSearch);
    }, [
        textSearch,
        paramFilter?.fromDate,
        paramFilter?.toDate,
        paramFilter?.idChiNhanhs,
        paramFilter?.idLoaiTin,
        paramFilter.loaiUser_CoTheGuiTin // nếu gửi tin từ mẫu zalo template của hệ thống: chỉ lấy khách hàng có zoaId
    ]);

    React.useEffect(() => {
        getInforCustomerFromDB();
    }, [arrIdChosed]);

    const choseItem = (item: CustomerSMSDto[]) => {
        setLstChosed(item);
        handleChoseItem(item);
    };
    const handleInputChange = (newInputValue: string) => {
        setTextSearch(newInputValue);
    };

    return (
        <>
            <Autocomplete
                size="small"
                fullWidth
                disablePortal
                autoComplete
                multiple={true}
                filterSelectedOptions
                value={lstChosed}
                filterOptions={(x) => x}
                onChange={(event: any, newValue: CustomerSMSDto[]) => choseItem(newValue)}
                onInputChange={(event, newInputValue) => {
                    handleInputChange(newInputValue);
                }}
                options={lstOption}
                getOptionLabel={(option: CustomerSMSDto) => (option?.tenKhachHang ? option.tenKhachHang : '')}
                renderInput={(params) => (
                    <TextField {...params} label={label ?? 'Gửi đến'} helperText={helperText} error={isError} />
                )}
                renderOption={(props, option) => {
                    return (
                        <li
                            {...props}
                            key={option.id}
                            style={{
                                borderBottom: '1px dashed var(--border-color)'
                            }}>
                            <Grid container>
                                <Grid item xs={7}>
                                    <Stack spacing={1} direction={'row'} alignItems="center">
                                        <Stack>
                                            {option?.avatar && paramFilter.idLoaiTin == LoaiTin.TIN_THUONG && (
                                                <img
                                                    src={option?.avatar}
                                                    height={40}
                                                    width={40}
                                                    style={{ borderRadius: '100%' }}
                                                />
                                            )}
                                        </Stack>
                                        <Stack>
                                            <Typography style={{ fontSize: '13px' }}>{option?.tenKhachHang}</Typography>
                                            <Box
                                                component="span"
                                                style={{
                                                    fontWeight: 500,
                                                    color: '#acaca5',
                                                    fontSize: '12px'
                                                }}>
                                                {option?.soDienThoai}
                                            </Box>
                                        </Stack>
                                    </Stack>
                                </Grid>
                                <Grid item xs={5}>
                                    <Stack alignItems={'end'}>
                                        <Typography style={{ fontSize: '13px', fontWeight: 500 }}>
                                            {paramFilter?.idLoaiTin === LoaiTin.TIN_GIAO_DICH
                                                ? option?.maHoaDon
                                                : paramFilter?.idLoaiTin === LoaiTin.TIN_LICH_HEN
                                                ? option?.tenHangHoa
                                                : ''}
                                        </Typography>
                                        <Typography style={{ fontSize: '13px' }}>
                                            {paramFilter?.idLoaiTin === LoaiTin.TIN_GIAO_DICH
                                                ? format(new Date(option?.ngayLapHoaDon ?? new Date()), 'dd/MM/yyyy')
                                                : paramFilter?.idLoaiTin === LoaiTin.TIN_LICH_HEN
                                                ? format(new Date(option?.startTime ?? new Date()), 'dd/MM/yyyy')
                                                : ''}
                                        </Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </li>
                    );
                }}
            />
        </>
    );
}
