/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Box,
    Button,
    Grid,
    TextField,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ThemeProvider,
    Typography,
    createTheme,
    IconButton,
    SelectChangeEvent,
    Stack
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { ReactComponent as UploadIcon } from '../../images/upload.svg';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { TextTranslate } from '../../components/TableLanguage';
import { useState, useEffect, ReactComponentElement, useContext } from 'react';
import { PropConfirmOKCancel } from '../../utils/PropParentToChild';
import { BrandnameDto, IParamSearchBrandname } from '../../services/sms/brandname/BrandnameDto';
import { CustomerSMSDto, PagedResultSMSDto } from '../../services/sms/gui_tin_nhan/gui_tin_nhan_dto';
import { RequestFromToDto } from '../../services/dto/ParamSearchDto';
import Cookies from 'js-cookie';
import BrandnameService from '../../services/sms/brandname/BrandnameService';
import HeThongSMServices from '../../services/sms/gui_tin_nhan/he_thong_sms_services';
import ModalGuiTinNhan from './components/modal_gui_tin_nhan';
import CustomTablePagination from '../../components/Pagination/CustomTablePagination';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import { Add, Search, SvgIconComponent } from '@mui/icons-material';
import AppConsts, { ISelect, LoaiTin, TrangThaiGuiTinZalo, TrangThaiSMS, TypeAction } from '../../lib/appconst';
import DateFilterCustom from '../../components/DatetimePicker/DateFilterCustom';
import he_thong_sms_services from '../../services/sms/gui_tin_nhan/he_thong_sms_services';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import { MauTinSMSDto } from '../../services/sms/mau_tin_sms/mau_tin_dto';
import MauTinSMService from '../../services/sms/mau_tin_sms/MauTinSMSService';
import fileDowloadService from '../../services/file-dowload.service';
import { IFileDto } from '../../services/dto/FileDto';
import ModalGuiTinNhanZalo from '../zalo/modal_gui_tin_zalo';
import ZaloService from '../../services/zalo/ZaloService';
import { InforZOA, ZaloAuthorizationDto } from '../../services/zalo/zalo_dto';
import { Guid } from 'guid-typescript';
import abpCustom from '../../components/abp-custom';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import utils from '../../utils/utils';
import suggestStore from '../../stores/suggestStore';

const styleListItem = createTheme({
    components: {
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontSize: '14px'
                }
            }
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: 0,
                    marginRight: '8px'
                }
            }
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    height: '20px'
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    // paddingLeft: 0
                }
            }
        }
    }
});

interface IListItemButtonCustomer {
    index: number;
    text: string;
    icon?: ReactComponentElement<SvgIconComponent>;
}

export function ListItemButtonCustomer({ listItem, handleListItemClick, tabActive = 0 }: any) {
    return (
        <>
            {listItem?.map((item: IListItemButtonCustomer) => (
                <ListItemButton
                    key={item.index}
                    selected={tabActive === item.index}
                    onClick={(event) => handleListItemClick(event, item.index)}
                    sx={{ backgroundColor: tabActive == item.index ? 'var(--color-bg)' : '' }}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                </ListItemButton>
            ))}
        </>
    );
}

export function CellDate({ date, dateType = 'dd/MM/yyyy' }: any) {
    // dateType: kiểu định dạng của date ('dd/MM/yyyy',....)
    const [dateValue, setDateValue] = useState('');

    useEffect(() => {
        if (date != null && date !== undefined) {
            setDateValue(format(new Date(date), dateType));
        }
    }, [date]);
    return <Box title={dateValue}>{dateValue}</Box>;
}
const TinNhanPage = () => {
    // list column default (ds tin nhan da gui)
    const columns: GridColDef[] = [
        {
            field: 'thoiGianGui',
            headerName: 'Thời gian',
            headerAlign: 'center',
            align: 'center',
            flex: 0.6,
            renderHeader: (params) => <Box>{params?.colDef?.headerName}</Box>,
            renderCell: (params) => <CellDate date={params?.value} dateType="dd/MM/yyyy HH:mm" />
        },
        {
            field: 'tenKhachHang',
            headerName: 'Khách hàng',
            minWidth: 118,
            flex: 1,
            renderHeader: (params) => <Box>{params?.colDef?.headerName}</Box>,
            renderCell: (params) => <Box title={params.value}>{params.value}</Box>
        },
        {
            field: 'soDienThoai',
            headerName: 'Số điện thoại',
            headerAlign: 'center',
            minWidth: 118,
            flex: 0.5,
            renderHeader: (params) => <Box>{params?.colDef?.headerName}</Box>,
            renderCell: (params) => (
                <Box title={params.value} width="100%" textAlign="center">
                    {params.value}
                </Box>
            )
        },
        {
            field: 'loaiTin',
            headerName: 'Loại tin',
            flex: 0.5,
            renderHeader: (params) => <Box>{params?.colDef?.headerName}</Box>,
            renderCell: (params) => (
                <Box
                    sx={{
                        color:
                            params.row.idLoaiTin === 2
                                ? '#800AC7 '
                                : params.row.idLoaiTin === 3
                                ? '#FF7DA1'
                                : params.row.idLoaiTin === 4
                                ? '#50CD89'
                                : ''
                    }}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'noiDungTin',
            headerName: 'Nội dung',
            minWidth: 350,
            maxWidth: 350,
            flex: 2,
            renderHeader: (params) => <Box>{params?.colDef?.headerName}</Box>,
            renderCell: (params) => (
                <Typography
                    variant="body2"
                    title={params.value}
                    dangerouslySetInnerHTML={{ __html: utils.SubString_toChar(params?.value, '<br/>') }}
                    className="lableOverflow"></Typography>
            )
        }
    ];

    const appContext = useContext(AppContext);
    const congty = appContext.congty;
    const [isShowModalAdd, setIsShowModalAdd] = useState(false);
    const [isShowModalAddMauTin, setIsShowModalAddMauTin] = useState(false);
    const [isShowModalGuiTinZalo, setIsShowModalGuiTinZalo] = useState(false);
    const [tabActive, setTabActive] = useState(0);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const [dataGrid_typeAction, setDataGrid_typeAction] = useState(0);
    const [inforDelete, setInforDelete] = useState<PropConfirmOKCancel>(new PropConfirmOKCancel({ show: false }));
    const [lstBrandname, setLstBrandname] = useState<BrandnameDto[]>([]);
    const [lstAllMauTinSMS, setLstAllMauTinSMS] = useState<MauTinSMSDto[]>([]);
    const [pageSMS, setPageSMS] = useState<PagedResultSMSDto>(new PagedResultSMSDto({ items: [] }));
    const [inforZOA, setInforZOA] = useState<InforZOA>({} as InforZOA);
    const [zaloToken, setZaloToken] = useState<ZaloAuthorizationDto>(new ZaloAuthorizationDto({ id: Guid.EMPTY }));
    const [pageCutomerSMS, setPageCutomerSMS] = useState<PagedResultDto<CustomerSMSDto>>({
        items: [],
        totalCount: 0,
        totalPage: 0
    } as PagedResultDto<CustomerSMSDto>);
    const [paramSearch, setParamSearch] = useState<RequestFromToDto>({
        textSearch: '',
        trangThais: [TrangThaiSMS.SUCCESS, TrangThaiGuiTinZalo.SUCCESS],
        fromDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        toDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
    } as RequestFromToDto);
    const [columnGrid, setColumnGrid] = useState<GridColDef[]>(columns);
    const [lstRowSelect, setLstRowSelect] = useState<CustomerSMSDto[]>([]);
    const [idLoaiTin, setIdLoaiTin] = useState(1);

    useEffect(() => {
        GetListColumn_DataGrid();
    }, [tabActive]);

    useEffect(() => {
        GetListBrandname();
        GetAllMauTinSMS();
        GetZaloTokenfromDB();
    }, []);

    const ConstTabActive = {
        TIN_DA_GUI: 0,
        TIN_NHAP: 1,
        TIN_THAT_BAI: 2,
        GIAO_DICH: 3,
        LICH_HEN: 4,
        SINH_NHAT: 5
    };

    const GetZaloTokenfromDB = async () => {
        // todo: sau này phải có hàm chạy tự động: check  hết hạn accestoken
        const objAuthen = await ZaloService.Innit_orGetToken();
        if (objAuthen !== null) {
            if (objAuthen.isExpiresAccessToken) {
                const objNewToken = await ZaloService.GetNewAccessToken_fromRefreshToken(objAuthen?.refreshToken);
                if (objNewToken !== null) {
                    // insert to db
                    const codeVerifier = ZaloService.CreateCodeVerifier();
                    const codeChallenge = await ZaloService.GenerateCodeChallenge(codeVerifier);

                    const newToken = new ZaloAuthorizationDto({
                        id: Guid.EMPTY,
                        codeVerifier: codeVerifier,
                        codeChallenge: codeChallenge,
                        accessToken: objNewToken.access_token,
                        refreshToken: objNewToken.refresh_token,
                        expiresToken: objNewToken.expires_in
                    });

                    const dataDB = await ZaloService.InsertCodeVerifier(new ZaloAuthorizationDto(newToken));
                    newToken.id = dataDB.id;

                    const newOA = await ZaloService.GetInfor_ZaloOfficialAccount(newToken?.accessToken);
                    setInforZOA(newOA);
                }
            } else {
                setZaloToken(objAuthen);

                const newOA = await ZaloService.GetInfor_ZaloOfficialAccount(objAuthen?.accessToken);
                setInforZOA(newOA);
            }
            await suggestStore.Zalo_GetAccessToken(); // get again token --> pass to modal gửi tin nhắn
        }
    };

    const GetListBrandname = async () => {
        let tenantId = parseInt(Cookies.get('Abp.TenantId') ?? '1') ?? 1;
        tenantId = isNaN(tenantId) ? 1 : tenantId;
        const param = {
            keyword: ''
        } as IParamSearchBrandname;
        const data = await BrandnameService.GetListBandname(param, tenantId);
        if (data !== null) {
            // HOST: đang get all brandname, nên nếu gửi SMS từ HOST thì filter
            const arrByTenantId = data.items?.filter((x) => x.tenantId == tenantId);
            setLstBrandname(arrByTenantId);
        }
    };
    const GetAllMauTinSMS = async () => {
        const data = await MauTinSMService.GetAllMauTinSMS();
        if (data !== null) {
            setLstAllMauTinSMS(data);
        }
    };

    const GetListSMS = async () => {
        const data = await HeThongSMServices.GetListSMS(paramSearch);
        if (data !== null) {
            setPageSMS({ items: [...data.items], totalCount: data.totalCount, totalPage: 1 });
        }
    };

    const GetListCustomer_byLoaiTin = async (idLoaiTin: number) => {
        const data = await he_thong_sms_services.GetListCustomer_byIdLoaiTin(paramSearch, idLoaiTin);
        if (data !== null) {
            setPageCutomerSMS({ items: [...data.items], totalCount: data.totalCount, totalPage: 1 });
        }
    };

    useEffect(() => {
        LoadData_byTabActive();
    }, [
        paramSearch.currentPage,
        paramSearch.pageSize,
        paramSearch.fromDate,
        paramSearch.toDate,
        paramSearch.trangThais,
        tabActive
    ]);

    const testguitin = async () => {
        const data = ZaloService.NguoiDung_ChiaSeThongTin_ChoOA(inforZOA, zaloToken.accessToken);
    };

    const LoadData_byTabActive = async () => {
        switch (tabActive) {
            case ConstTabActive.TIN_DA_GUI:
            case ConstTabActive.TIN_NHAP:
            case ConstTabActive.TIN_THAT_BAI:
                GetListSMS();
                break;
            case ConstTabActive.GIAO_DICH:
                {
                    await GetListCustomer_byLoaiTin(LoaiTin.TIN_GIAO_DICH);
                }
                break;
            case ConstTabActive.LICH_HEN:
                {
                    await GetListCustomer_byLoaiTin(LoaiTin.TIN_LICH_HEN);
                }
                break;
            case ConstTabActive.SINH_NHAT:
                {
                    await GetListCustomer_byLoaiTin(LoaiTin.TIN_SINH_NHAT);
                }
                break;
        }
    };

    const handleKeyDownTextSearch = (event: any) => {
        if (event.keyCode === 13) {
            hanClickIconSearch();
        }
    };

    const hanClickIconSearch = () => {
        if (paramSearch.currentPage !== 1) {
            setParamSearch({
                ...paramSearch,
                currentPage: 1
            });
        } else {
            LoadData_byTabActive();
        }
    };

    const DataGrid_handleAction = async (item: any) => {
        switch (parseInt(item.id)) {
            case 1:
                setInforDelete({
                    ...inforDelete,
                    show: true,
                    title: 'Thông báo xóa',
                    mes: `Bạn có chắc chắn muốn xóa ${rowSelectionModel.length} brandname này không?`
                });
                break;
            case 2:
                {
                    setInforDelete({
                        ...inforDelete,
                        show: true,
                        title: 'Kích hoạt',
                        mes: `Bạn có chắc chắn muốn kích hoạt ${rowSelectionModel.length} brandname này không?`
                    });
                }
                break;
        }
        setDataGrid_typeAction(parseInt(item.id));
    };

    const exportToExcel = async () => {
        const param = { ...paramSearch };
        param.currentPage = 1;

        let fileDowload: IFileDto = {} as IFileDto;
        switch (tabActive) {
            case 0:
            case 1:
            case 2:
                {
                    param.pageSize = pageSMS.totalCount;
                    fileDowload = await HeThongSMServices.ExportToExcel_DanhSachTinNhan(param);
                }
                break;
            case 3:
            case 4:
            case 5:
                {
                    param.pageSize = pageCutomerSMS.totalCount;
                    let idLoaiTin = 2;
                    switch (tabActive) {
                        case 3:
                            idLoaiTin = LoaiTin.TIN_GIAO_DICH;
                            break;
                        case 4:
                            idLoaiTin = LoaiTin.TIN_LICH_HEN;
                            break;
                        case 5:
                            idLoaiTin = LoaiTin.TIN_SINH_NHAT;
                            break;
                    }
                    param.pageSize = 50;
                    fileDowload = await HeThongSMServices.ExportToExcel_DanhSachKhachHang_SMS(param, idLoaiTin);
                }
                break;
        }

        fileDowloadService.downloadExportFile(fileDowload);
    };

    const handleChangePage = (event: any, value: number) => {
        setParamSearch({
            ...paramSearch,
            currentPage: value
        });
    };
    const handlePerPageChange = (event: SelectChangeEvent<number>) => {
        setParamSearch({
            ...paramSearch,
            pageSize: parseInt(event.target.value.toString(), 10)
        });
    };
    const doActionRow = (action: number, item: any) => {
        switch (action) {
            case 1:
                {
                    setIsShowModalAdd(true);
                }
                break;
            case 2:
                setInforDelete({
                    ...inforDelete,
                    show: true,
                    mes: `Bạn có chắc chắn muốn xóa brandname ${item.brandname} này không?`
                });
                break;
        }
    };

    const onClickGuiLai = async () => {
        switch (tabActive) {
            case ConstTabActive.TIN_DA_GUI: // tin nhan da gui
                {
                    // xuat excel
                }
                break;
            case ConstTabActive.TIN_NHAP: // tin nhap
            case ConstTabActive.TIN_THAT_BAI: // gui that bai
                {
                    if (lstBrandname.length > 0) {
                        const data = await HeThongSMServices.GuiLai_TinNhan_ThatBai(
                            rowSelectionModel,
                            lstBrandname[0].brandname
                        );
                        if (data?.success ?? 0 > 0) {
                            setObjAlert({ mes: `Gửi lại thành công ${data.success} tin nhắn`, show: true, type: 1 });
                        } else {
                            const typeMes = AppConsts.ListTrangThaiGuiTin.filter((x) => x.value == data.messageStatus);
                            if (typeMes.length > 0) {
                                setObjAlert({ mes: `Gửi lại thất bại. ${typeMes[0].text}`, show: true, type: 2 });
                            }
                        }
                    }
                }
                break;
        }
    };
    const choseRow = (item: any) => {
        console.log('item ', item);
    };

    const onRowSelect_GuiTin = async () => {
        // get list customer by row chosed
        const lstRowSelect = pageCutomerSMS?.items?.filter((x: CustomerSMSDto) => rowSelectionModel.includes(x.id));
        setLstRowSelect(lstRowSelect);
        setIsShowModalAdd(true);

        switch (tabActive) {
            case ConstTabActive.GIAO_DICH:
                setIdLoaiTin(LoaiTin.TIN_GIAO_DICH);
                break;
            case ConstTabActive.LICH_HEN:
                setIdLoaiTin(LoaiTin.TIN_KHUYEN_MAI);
                break;
            case ConstTabActive.SINH_NHAT:
                setIdLoaiTin(LoaiTin.TIN_SINH_NHAT);
                break;
        }
    };

    const saveSMSOK = (type: number) => {
        setIsShowModalAdd(false);
        setIsShowModalGuiTinZalo(false);
        LoadData_byTabActive();
    };

    const saveMauTinOK = (objMauTin: MauTinSMSDto, type: number) => {
        setIsShowModalAddMauTin(false);
        switch (type) {
            case TypeAction.INSEART:
                setLstAllMauTinSMS([...lstAllMauTinSMS, objMauTin]);
                break;
            case TypeAction.UPDATE:
                setLstAllMauTinSMS([
                    ...lstAllMauTinSMS.map((x: MauTinSMSDto) => {
                        if (x.id === objMauTin.id) {
                            return {
                                ...x,
                                tenMauTin: objMauTin.tenMauTin,
                                noiDungTinMau: objMauTin.noiDungTinMau,
                                laMacDinh: objMauTin.laMacDinh,
                                trangThai: objMauTin.trangThai
                            };
                        } else {
                            return x;
                        }
                    })
                ]);
                break;
            case TypeAction.DELETE:
                setLstAllMauTinSMS([...lstAllMauTinSMS.filter((x: MauTinSMSDto) => x.id !== objMauTin.id)]);
                break;
        }
    };

    const [anchorDateEl, setAnchorDateEl] = useState<HTMLDivElement | null>(null);
    const openDateFilter = Boolean(anchorDateEl);

    const onApplyFilterDate = async (from: string, to: string, txtShow: string) => {
        setAnchorDateEl(null);
        setParamSearch({ ...paramSearch, fromDate: from, toDate: to });
    };

    const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
        setTabActive(index);
        switch (index) {
            case 1: // tin nhap
                setParamSearch({
                    ...paramSearch,
                    trangThais: [TrangThaiSMS.DRAFT]
                });
                break;
            case 2: // thất bại
                setParamSearch({
                    ...paramSearch,
                    trangThais: AppConsts.ListTrangThaiGuiTin.filter(
                        (x: ISelect) => x.value !== TrangThaiSMS.SUCCESS && x.value !== TrangThaiSMS.DRAFT
                    ).map((x: ISelect) => {
                        return x.value as number;
                    })
                });
                break;
            case 0: // gui thanh cong
                setParamSearch({
                    ...paramSearch,
                    trangThais: [TrangThaiSMS.SUCCESS, TrangThaiGuiTinZalo.SUCCESS]
                });
                break;
            case 3:
            case 4:
            case 5:
                setParamSearch({
                    ...paramSearch,
                    trangThais: [] // all trangthai
                });
                break;
            default:
                break;
        }
    };

    const GetListColumn_DataGrid = () => {
        let arr: GridColDef[] = [];
        switch (tabActive) {
            case ConstTabActive.TIN_DA_GUI:
            case ConstTabActive.TIN_NHAP:
            case ConstTabActive.TIN_THAT_BAI:
                {
                    arr = columns;
                }
                break;

            case ConstTabActive.GIAO_DICH:
                arr = [
                    {
                        field: 'tenKhachHang',
                        headerName: 'Khách hàng',
                        flex: 1.5,
                        renderHeader: (params) => <Box>{params?.colDef?.headerName}</Box>,
                        renderCell: (params) => <Box title={params.value}>{params.value}</Box>
                    },
                    {
                        field: 'soDienThoai',
                        headerName: 'Số điện thoại',
                        headerAlign: 'center',
                        flex: 1,
                        renderHeader: (params) => <Box>{params?.colDef?.headerName}</Box>,
                        renderCell: (params) => (
                            <Box title={params.value} width="100%" textAlign="center">
                                {params.value}
                            </Box>
                        )
                    },
                    {
                        field: 'maHoaDon',
                        headerAlign: 'center',
                        align: 'center',
                        headerName: 'Mã giao dịch',
                        flex: 1,
                        renderHeader: (params) => <Box>{params?.colDef?.headerName}</Box>
                    },
                    {
                        field: 'ngayLapHoaDon',
                        headerName: 'Ngày giao dịch',
                        headerAlign: 'center',
                        align: 'center',
                        flex: 1,
                        renderHeader: (params) => <Box>{params?.colDef?.headerName}</Box>,
                        renderCell: (params) => <CellDate date={params.value} dateType="dd/MM/yyyy HH:mm" />
                    },
                    {
                        field: 'sTrangThaiGuiTinNhan',
                        headerName: 'Trạng thái',
                        headerAlign: 'center',
                        align: 'center',
                        flex: 1,
                        renderHeader: (params) => <Box>{params?.colDef?.headerName}</Box>,
                        renderCell: (params) => (
                            <Box
                                sx={{
                                    fontSize: '12px',
                                    padding: '4px 8px',
                                    borderRadius: '1000px',
                                    // backgroundColor: '#F1FAFF',
                                    color: params.row?.trangThai !== 100 ? '#b16827' : '#009EF7'
                                }}>
                                {params.value || ''}
                            </Box>
                        )
                    }
                ];
                break;
            case ConstTabActive.LICH_HEN:
                arr = [
                    {
                        field: 'tenKhachHang',
                        headerName: 'Khách hàng',
                        flex: 1.2,
                        renderHeader: (params) => <Box>{params?.colDef?.headerName}</Box>,
                        renderCell: (params) => <Box title={params.value}>{params.value}</Box>
                    },
                    {
                        field: 'soDienThoai',
                        headerName: 'Số điện thoại',
                        headerAlign: 'center',
                        flex: 0.8,
                        renderHeader: (params) => <Box>{params?.colDef?.headerName}</Box>,
                        renderCell: (params) => (
                            <Box title={params.value} width="100%" textAlign="center">
                                {params.value}
                            </Box>
                        )
                    },

                    {
                        field: 'bookingDate',
                        headerName: 'Ngày hẹn',
                        headerAlign: 'center',
                        align: 'center',
                        flex: 0.6,
                        renderHeader: (params) => <Box>{params?.colDef?.headerName}</Box>,
                        renderCell: (params) => <CellDate date={params.value} />
                    },
                    {
                        field: 'thoiGianHen',
                        headerName: 'Giờ hẹn',
                        headerAlign: 'center',
                        align: 'center',
                        flex: 0.8,
                        renderHeader: (params) => <Box>{params?.colDef?.headerName}</Box>
                    },
                    {
                        field: 'tenHangHoa',
                        headerName: 'Dịch vụ hẹn ',
                        flex: 1.5,
                        renderHeader: (params) => <Box>{params?.colDef?.headerName}</Box>
                    },
                    {
                        field: 'sTrangThaiGuiTinNhan',
                        headerName: 'Trạng thái',
                        headerAlign: 'center',
                        align: 'center',
                        flex: 0.8,
                        renderHeader: (params) => <Box>{params?.colDef?.headerName}</Box>,
                        renderCell: (params) => (
                            <Box
                                sx={{
                                    fontSize: '12px',
                                    padding: '4px 8px',
                                    borderRadius: '1000px',
                                    backgroundColor: params.row?.trangThai !== 1 ? '' : '#F1FAFF',
                                    color:
                                        params.row?.trangThai === 100
                                            ? '#009EF7'
                                            : params.row?.trangThai === 1
                                            ? ''
                                            : '#b16827'
                                }}>
                                {params.value || ''}
                            </Box>
                        )
                    }
                ];
                break;
            case ConstTabActive.SINH_NHAT:
                arr = [
                    {
                        field: 'tenKhachHang',
                        headerName: 'Khách hàng',
                        flex: 2,
                        renderHeader: (params) => <Box>{params?.colDef?.headerName}</Box>,
                        renderCell: (params) => <Box title={params.value}>{params.value}</Box>
                    },
                    {
                        field: 'soDienThoai',
                        headerName: 'Số điện thoại',
                        headerAlign: 'center',
                        flex: 1,
                        renderHeader: (params) => <Box>{params?.colDef?.headerName}</Box>,
                        renderCell: (params) => (
                            <Box title={params.value} width="100%" textAlign="center">
                                {params.value}
                            </Box>
                        )
                    },

                    {
                        field: 'ngaySinh',
                        headerName: 'Ngày sinh',
                        headerAlign: 'center',
                        align: 'center',
                        flex: 1,
                        renderHeader: (params) => <Box>{params?.colDef?.headerName}</Box>,
                        renderCell: (params) => <CellDate date={params.value} />
                    },
                    {
                        field: 'sTrangThaiGuiTinNhan',
                        headerName: 'Trạng thái',
                        flex: 1,
                        renderHeader: (params) => <Box>{params?.colDef?.headerName}</Box>
                    }
                ];
                break;
        }
        setColumnGrid([...arr]);
    };

    return (
        <>
            <ModalGuiTinNhan
                isShowModal={isShowModalAdd}
                idUpdate={''}
                onClose={() => setIsShowModalAdd(false)}
                onOK={saveSMSOK}
                arrIdCustomerChosed={lstRowSelect?.map((x) => {
                    return x?.idKhachHang ?? '';
                })}
                idLoaiTin={idLoaiTin}
            />
            <ModalGuiTinNhanZalo
                isShowModal={isShowModalGuiTinZalo}
                idUpdate={''}
                onClose={() => setIsShowModalGuiTinZalo(false)}
                onOK={saveSMSOK}
            />
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Grid container paddingTop={2} spacing={4}>
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={5}>
                            <Grid container spacing={1} alignItems="center">
                                <Grid item xs={4}>
                                    <span className="page-title"> Tin nhắn SMS</span>
                                </Grid>
                                <Grid item xs={8}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        sx={{
                                            backgroundColor: '#fff'
                                        }}
                                        variant="outlined"
                                        placeholder="Tìm kiếm"
                                        InputProps={{
                                            startAdornment: (
                                                <IconButton onClick={hanClickIconSearch}>
                                                    <Search />
                                                </IconButton>
                                            )
                                        }}
                                        onChange={(event) =>
                                            setParamSearch((itemOlds: any) => {
                                                return {
                                                    ...itemOlds,
                                                    textSearch: event.target.value
                                                };
                                            })
                                        }
                                        onKeyDown={(event) => {
                                            handleKeyDownTextSearch(event);
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} md={7} gap={1} display="flex" justifyContent="end">
                            <Grid item xs={12} md={4}>
                                <Stack>
                                    <TextField
                                        label="Thời gian"
                                        size="small"
                                        fullWidth
                                        variant="outlined"
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                height: '40px!important'
                                            }
                                        }}
                                        onClick={(event) => setAnchorDateEl(event.currentTarget)}
                                        value={`${format(
                                            new Date(paramSearch.fromDate as string),
                                            'dd/MM/yyyy'
                                        )} - ${format(new Date(paramSearch.toDate as string), 'dd/MM/yyyy')}`}
                                    />
                                    <DateFilterCustom
                                        id="popover-date-filter"
                                        open={openDateFilter}
                                        anchorEl={anchorDateEl}
                                        onClose={() => setAnchorDateEl(null)}
                                        onApplyDate={onApplyFilterDate}
                                    />
                                </Stack>
                            </Grid>
                            <Button
                                size="small"
                                onClick={exportToExcel}
                                variant="outlined"
                                startIcon={<UploadIcon />}
                                className="btnNhapXuat btn-outline-hover"
                                sx={{
                                    bgcolor: '#fff!important',
                                    color: '#666466',
                                    display: abpCustom.isGrandPermission('Pages.HeThongSMS.Export') ? '' : 'none'
                                }}>
                                Xuất
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                sx={{
                                    minWidth: '143px',
                                    fontSize: '14px',
                                    display: abpCustom.isGrandPermission('Pages.HeThongSMS.Create') ? '' : 'none'
                                }}
                                startIcon={<Add />}
                                onClick={() => setIsShowModalGuiTinZalo(true)}>
                                Gửi tin Zalo
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={4} sm={4} md={2.5}>
                            <Box bgcolor={'#FFF'} borderRadius={'8px'}>
                                <Button
                                    fullWidth
                                    size="small"
                                    sx={{
                                        height: '40px',
                                        display: abpCustom.isGrandPermission('Pages.HeThongSMS.Create') ? '' : 'none'
                                    }}
                                    variant="contained"
                                    onClick={() => {
                                        setIsShowModalAdd(true);
                                        setIdLoaiTin(1);
                                        setLstRowSelect([]);
                                    }}
                                    startIcon={<Add />}>
                                    Tin nhắn mới
                                </Button>
                                <ThemeProvider theme={styleListItem}>
                                    <List>
                                        <ListItemButtonCustomer
                                            listItem={
                                                [
                                                    {
                                                        index: ConstTabActive.TIN_DA_GUI,
                                                        text: 'Đã gửi',
                                                        icon: <SendIcon />
                                                    },
                                                    {
                                                        index: ConstTabActive.TIN_NHAP,
                                                        text: 'Nháp',
                                                        icon: <ArticleOutlinedIcon />
                                                    },
                                                    {
                                                        index: ConstTabActive.TIN_THAT_BAI,
                                                        text: 'Thất bại',
                                                        icon: <DeleteSweepOutlinedIcon />
                                                    }
                                                ] as IListItemButtonCustomer[]
                                            }
                                            tabActive={tabActive}
                                            handleListItemClick={handleListItemClick}
                                        />
                                    </List>
                                </ThemeProvider>

                                <ThemeProvider theme={styleListItem}>
                                    <List
                                        subheader={
                                            <Typography fontSize={'16px'} color={'#3D475C'} fontWeight={500}>
                                                Danh sách
                                            </Typography>
                                        }>
                                        <ListItemButtonCustomer
                                            listItem={
                                                [
                                                    {
                                                        index: 3,
                                                        text: 'Giao dịch',
                                                        icon: <AssignmentOutlinedIcon />
                                                    },
                                                    {
                                                        index: 4,
                                                        text: 'Lịch hẹn',
                                                        icon: <EventNoteOutlinedIcon />
                                                    },
                                                    {
                                                        index: 5,
                                                        text: 'Khách sinh nhật',
                                                        icon: <CakeOutlinedIcon />
                                                    }
                                                ] as IListItemButtonCustomer[]
                                            }
                                            tabActive={tabActive}
                                            handleListItemClick={handleListItemClick}
                                        />
                                    </List>
                                </ThemeProvider>
                            </Box>
                        </Grid>
                        <Grid item xs={8} sm={8} md={9.5}>
                            <Box bgcolor={'#FFF'} height={'100%'} borderRadius={'8px'}>
                                {[
                                    ConstTabActive.TIN_DA_GUI,
                                    ConstTabActive.TIN_NHAP,
                                    ConstTabActive.TIN_THAT_BAI
                                ].includes(tabActive) ? (
                                    <>
                                        {rowSelectionModel.length > 0 && (
                                            <Button
                                                variant="contained"
                                                onClick={onClickGuiLai}
                                                sx={{
                                                    display:
                                                        tabActive == ConstTabActive.TIN_NHAP
                                                            ? abpCustom.isGrandPermission('Pages.HeThongSMS.Create')
                                                                ? ''
                                                                : 'none'
                                                            : tabActive == ConstTabActive.TIN_THAT_BAI
                                                            ? abpCustom.isGrandPermission('Pages.HeThongSMS.Resend')
                                                                ? ''
                                                                : 'none'
                                                            : abpCustom.isGrandPermission('Pages.HeThongSMS.Export')
                                                            ? ''
                                                            : 'none'
                                                }}
                                                startIcon={
                                                    tabActive != 0 ? (
                                                        <NearMeOutlinedIcon style={{ width: 20 }} />
                                                    ) : (
                                                        <UploadIcon />
                                                    )
                                                }>
                                                {tabActive == ConstTabActive.TIN_NHAP
                                                    ? 'Gửi tin'
                                                    : tabActive == ConstTabActive.TIN_THAT_BAI
                                                    ? 'Gửi lại'
                                                    : 'Xuất excel'}
                                            </Button>
                                        )}
                                        <DataGrid
                                            sx={{ marginTop: rowSelectionModel.length > 0 ? 2 : 0 }}
                                            disableRowSelectionOnClick
                                            className={
                                                rowSelectionModel.length > 0 ? 'data-grid-row-chosed' : 'data-grid-row'
                                            }
                                            rowHeight={46}
                                            columns={columnGrid}
                                            rows={pageSMS.items}
                                            hideFooter
                                            checkboxSelection
                                            onRowClick={(item) => choseRow(item)}
                                            localeText={TextTranslate}
                                            onRowSelectionModelChange={(newRowSelectionModel) => {
                                                console.log('newRowSelectionModel ', newRowSelectionModel);
                                                setRowSelectionModel(newRowSelectionModel);
                                            }}
                                            rowSelectionModel={rowSelectionModel}
                                        />
                                    </>
                                ) : (
                                    <>
                                        {rowSelectionModel.length > 0 && (
                                            // <ActionRowSelect
                                            //     lstOption={[
                                            //         {
                                            //             id: '1',
                                            //             text: 'Chuyển nhóm khách'
                                            //         },
                                            //         {
                                            //             id: '2',
                                            //             text: 'Xóa khách hàng'
                                            //         },
                                            //         {
                                            //             id: '3',
                                            //             text: 'Xuất danh sách'
                                            //         }
                                            //     ]}
                                            //     countRowSelected={rowSelectionModel.length}
                                            //     title={
                                            //         tabActive == 3
                                            //             ? 'Giao dịch'
                                            //             : tabActive == 4
                                            //             ? 'Lịch hẹn'
                                            //             : 'Khách hàng'
                                            //     }
                                            //     choseAction={DataGrid_handleAction}
                                            //     removeItemChosed={() => {
                                            //         setRowSelectionModel([]);
                                            //     }}
                                            // />
                                            <Button
                                                variant="contained"
                                                onClick={onRowSelect_GuiTin}
                                                startIcon={<NearMeOutlinedIcon />}
                                                sx={{
                                                    display: abpCustom.isGrandPermission('Pages.HeThongSMS.Create')
                                                        ? ''
                                                        : 'none'
                                                }}>
                                                Gửi tin
                                            </Button>
                                        )}

                                        <DataGrid
                                            disableRowSelectionOnClick
                                            sx={{ marginTop: rowSelectionModel.length > 0 ? 2 : 0 }}
                                            className={
                                                rowSelectionModel.length > 0 ? 'data-grid-row-chosed' : 'data-grid-row'
                                            }
                                            rowHeight={46}
                                            columns={columnGrid}
                                            rows={pageCutomerSMS.items}
                                            hideFooter
                                            checkboxSelection
                                            onRowClick={(item) => choseRow(item)}
                                            localeText={TextTranslate}
                                            onRowSelectionModelChange={(newRowSelectionModel) => {
                                                setRowSelectionModel(newRowSelectionModel);
                                            }}
                                            rowSelectionModel={rowSelectionModel}
                                        />
                                    </>
                                )}

                                <CustomTablePagination
                                    currentPage={paramSearch.currentPage ?? 1}
                                    rowPerPage={paramSearch.pageSize ?? 10}
                                    totalRecord={
                                        [0, 1, 2].includes(tabActive) ? pageSMS.totalCount : pageCutomerSMS.totalCount
                                    }
                                    totalPage={
                                        [0, 1, 2].includes(tabActive) ? pageSMS.totalPage : pageCutomerSMS.totalPage
                                    }
                                    handlePerPageChange={handlePerPageChange}
                                    handlePageChange={handleChangePage}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};
export default TinNhanPage;
