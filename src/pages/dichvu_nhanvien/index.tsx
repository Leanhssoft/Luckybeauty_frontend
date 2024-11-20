import { Component, ReactNode } from 'react';
import {
    Autocomplete,
    Avatar,
    Box,
    Button,
    Chip,
    Grid,
    InputAdornment,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import CreateOrEditDichVuNhanVienModal from './components/create-or-edit-dichVu_nhanVien';
import suggestStore from '../../stores/suggestStore';
import StarIcon from '@mui/icons-material/Star';
import { ReactComponent as SearchIcon } from '../../images/search-normal.svg';
import { observer } from 'mobx-react';
import dichVuNhanVienStore from '../../stores/dichVuNhanVienStore';
import AppConsts from '../../lib/appconst';
import { AppContext, IAppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import Cookies from 'js-cookie';

class SettingDichVuNhanVien extends Component {
    static contextType = AppContext;
    onModal = () => {
        this.setState({ visiableModal: !this.state.visiableModal });
    };
    handleCloseModal = () => {
        this.setState({ visiableModal: false });
    };
    state = {
        visiableModal: false,
        settingValue: 'Service',
        selectedItemId: null,
        idChiNhanh: Cookies.get('IdChiNhanh')
    };
    componentDidMount(): void {
        this.getData();
    }
    componentDidUpdate(prevProps: any, prevState: any, snapshot?: any): void {
        const appContext = this.context as IAppContext;
        const chiNhanhContext = appContext.chinhanhCurrent;
        if (this.state.idChiNhanh !== chiNhanhContext.id) {
            // ChiNhanhContext has changed, update the component
            this.setState({
                idChiNhanh: chiNhanhContext.id
            });
            this.getData();
        }
    }
    async getData() {
        await suggestStore.getSuggestNhanVien();
        await suggestStore.getSuggestDichVu();
        await suggestStore.getSuggestNhomHangHoa();
        dichVuNhanVienStore.idNhanVien = suggestStore.suggestNhanVien[0]?.id;
        this.setState({ selectedItemId: suggestStore.suggestNhanVien[0]?.id });
        await dichVuNhanVienStore.getDichVuNhanVienDetail(suggestStore.suggestNhanVien[0]?.id ?? AppConsts.guidEmpty);
    }
    handleSettingChange = async (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        await this.setState({
            settingValue: value
        });
    };
    render(): ReactNode {
        return (
            <Box>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} paddingTop={'16px'}>
                    <Typography
                        fontSize={'18px'}
                        fontWeight={700}
                        //color={'#3D475C'}
                        fontFamily={'Roboto'}>
                        Cài đặt dịch vụ nhân viên
                    </Typography>
                </Box>
                <Box padding={'16px 0px'}>
                    <Grid container spacing={2}>
                        {window.screen.width <= 650 ? (
                            <Grid item xs={12}>
                                <Autocomplete
                                    //defaultValue={suggestStore.suggestNhanVien[0] ?? []}
                                    options={suggestStore.suggestNhanVien ?? []}
                                    getOptionLabel={(option) => `${option.tenNhanVien}`}
                                    renderOption={(props, option) => (
                                        <Box
                                            key={option.id}
                                            component="li"
                                            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                            {...props}>
                                            <Avatar src={option.avatar} />
                                            <Box display={'flex'} flexDirection={'column'} ml={'5px'}>
                                                <Typography fontSize={'13px'}>{option?.tenNhanVien}</Typography>
                                                <Typography fontSize={'13px'}>{option?.chucVu}</Typography>
                                            </Box>
                                        </Box>
                                    )}
                                    size="small"
                                    fullWidth
                                    disablePortal
                                    onChange={async (event, option) => {
                                        await dichVuNhanVienStore.getDichVuNhanVienDetail(
                                            option?.id ?? AppConsts.guidEmpty
                                        );
                                        dichVuNhanVienStore.idNhanVien = option?.id ?? AppConsts.guidEmpty;
                                        this.setState({
                                            selectedItemId: option?.id ?? AppConsts.guidEmpty
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            sx={{ bgcolor: '#fff' }}
                                            {...params}
                                            placeholder="Tìm tên"
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <>
                                                        {params.InputProps.startAdornment}
                                                        <InputAdornment position="start">
                                                            <SearchIcon />
                                                        </InputAdornment>
                                                    </>
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                        ) : (
                            <Grid item xs={4}>
                                <Box
                                    sx={{
                                        backgroundColor: '#fff',
                                        borderRadius: '8px',
                                        border: '1px solid #E6E1E6'
                                    }}>
                                    <Box
                                        className="page-box-left"
                                        sx={{
                                            padding: '8px',
                                            width: '100%',
                                            // minHeight: '550px',
                                            // maxHeight: '550px',
                                            overflow: 'auto',
                                            bgcolor: 'background.paper',
                                            '&::-webkit-scrollbar': {
                                                width: '7px'
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                bgcolor: 'rgba(0,0,0,0.1)',
                                                borderRadius: '4px'
                                            },
                                            '&::-webkit-scrollbar-track': {
                                                bgcolor: 'var(--color-bg)'
                                            }
                                        }}>
                                        {suggestStore.suggestNhanVien?.map((item, key) => (
                                            <ListItem
                                                key={key}
                                                onClick={async () => {
                                                    await dichVuNhanVienStore.getDichVuNhanVienDetail(
                                                        item.id ?? AppConsts.guidEmpty
                                                    );
                                                    dichVuNhanVienStore.idNhanVien = item.id;
                                                    this.setState({ selectedItemId: item.id });
                                                }}
                                                sx={{
                                                    backgroundColor:
                                                        this.state.selectedItemId === item.id
                                                            ? '#E6E6E6'
                                                            : 'transparent', // Apply background color based on selection
                                                    padding: '0px 8px',
                                                    fontSize: '13px !important'
                                                }}>
                                                <ListItemAvatar>
                                                    <Avatar src={item.avatar} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Typography fontSize={'13px'}>{item.tenNhanVien}</Typography>
                                                    }
                                                    secondary={item.chucVu}
                                                />
                                            </ListItem>
                                        ))}
                                    </Box>
                                </Box>
                            </Grid>
                        )}

                        <Grid item xs={12} sm={8} md={8}>
                            <Box
                                className="page-box-right"
                                sx={{
                                    backgroundColor: '#fff',
                                    borderRadius: '8px',
                                    border: '1px solid #E6E1E6',
                                    padding: '8px'
                                }}>
                                <Box
                                    display={'flex'}
                                    flexDirection={'column'}
                                    alignItems={'center'}
                                    padding={'8px'}
                                    borderBottom={'1px solid #EBEBEB'}>
                                    <Avatar
                                        sx={{ width: '64px', height: '64px' }}
                                        src={dichVuNhanVienStore.dichVuNhanVienDetail?.avatar}
                                    />
                                    <Typography fontSize={'14px'}>
                                        {dichVuNhanVienStore.dichVuNhanVienDetail?.tenNhanVien}
                                    </Typography>
                                    <Box
                                        display={'flex'}
                                        flexDirection={'row'}
                                        alignItems={'center'}
                                        textAlign={'center'}
                                        gap={2}>
                                        <Box
                                            display={'flex'}
                                            flexDirection={'row'}
                                            alignItems={'center'}
                                            textAlign={'center'}>
                                            <Typography fontSize={'14px'}>
                                                {dichVuNhanVienStore.dichVuNhanVienDetail?.rate === 0
                                                    ? 5
                                                    : dichVuNhanVienStore.dichVuNhanVienDetail?.rate}
                                            </Typography>
                                            <StarIcon
                                                style={{
                                                    opacity: 0.55,
                                                    marginLeft: '5px',
                                                    marginRight: '5px'
                                                }}
                                                sx={{ color: '#EE8935' }}
                                            />
                                            -
                                        </Box>
                                        <Chip label={dichVuNhanVienStore.dichVuNhanVienDetail?.chucVu} />
                                        <Typography fontSize={'14px'}>
                                            {dichVuNhanVienStore.dichVuNhanVienDetail?.soDienThoai}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box>
                                    <TableContainer
                                        sx={{
                                            '&::-webkit-scrollbar': {
                                                width: '7px'
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                bgcolor: 'rgba(0,0,0,0.1)',
                                                borderRadius: '4px'
                                            },
                                            '&::-webkit-scrollbar-track': {
                                                bgcolor: 'var(--color-bg)'
                                            },
                                            maxHeight: '400px'
                                        }}>
                                        <Table>
                                            <TableBody>
                                                {dichVuNhanVienStore.dichVuNhanVienDetail?.dichVuThucHiens.length >
                                                0 ? (
                                                    dichVuNhanVienStore.dichVuNhanVienDetail?.dichVuThucHiens?.map(
                                                        (item, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell align="left">
                                                                    <Box
                                                                        display={'flex'}
                                                                        flexDirection={'row'}
                                                                        alignItems={'center'}
                                                                        gap="8px">
                                                                        <Avatar src={item.avatar} variant="square" />{' '}
                                                                        <Typography fontSize={'13px'}>
                                                                            {item.tenDichVu}
                                                                        </Typography>
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell align={'right'}>
                                                                    <Typography fontSize={'13px'}>
                                                                        {item.soPhutThucHien}
                                                                        {' phút'}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell align={'right'}>
                                                                    <Typography fontSize={'13px'}>
                                                                        {new Intl.NumberFormat('vi-VN').format(
                                                                            item.donGia
                                                                        )}
                                                                    </Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )
                                                ) : (
                                                    <TableRow>
                                                        <TableCell>
                                                            <Box
                                                                display={'flex'}
                                                                alignItems="center"
                                                                justifyContent={'center'}
                                                                textAlign={'center'}
                                                                padding={'32px'}>
                                                                Không có bản ghi nào được hiển thị
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => {
                                        this.onModal();
                                    }}>
                                    Cập nhật
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <CreateOrEditDichVuNhanVienModal
                    visiable={this.state.visiableModal}
                    handleClose={this.handleCloseModal}
                    handleOk={this.onModal}
                />
            </Box>
        );
    }
}
export default observer(SettingDichVuNhanVien);
