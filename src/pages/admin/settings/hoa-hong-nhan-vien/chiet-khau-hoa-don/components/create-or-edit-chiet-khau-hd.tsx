import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
    Grid,
    RadioGroup,
    Radio,
    FormControlLabel,
    Checkbox,
    Box,
    MenuItem,
    ListItemText,
    Tab,
    FormControl,
    InputLabel,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemIcon,
    ListItemButton,
    Autocomplete
} from '@mui/material';
import Select from '@mui/material/Select';
import { ReactComponent as CloseIcon } from '../../../../../../images/close-square.svg';
import { Component, ReactNode } from 'react';
import { CreateOrEditChietKhauHoaDonDto } from '../../../../../../services/hoa_hong/chiet_khau_hoa_don/Dto/CreateOrEditChietKhauHoaDonDto';
import { Form, Formik } from 'formik';
import chietKhauHoaDonStore from '../../../../../../stores/chietKhauHoaDonStore';
import { enqueueSnackbar } from 'notistack';
import TabContext from '@mui/lab/TabContext/TabContext';
import TabList from '@mui/lab/TabList/TabList';
import TabPanel from '@mui/lab/TabPanel';
import SearchIcon from '../../../../../../images/search-normal.svg';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { observer } from 'mobx-react';
import suggestStore from '../../../../../../stores/suggestStore';
import { SuggestNhanSuDto } from '../../../../../../services/suggests/dto/SuggestNhanSuDto';
import { SuggestChucVuDto } from '../../../../../../services/suggests/dto/SuggestChucVuDto';
import * as Yup from 'yup';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { NumericFormat } from 'react-number-format';
interface DialogProps {
    visited: boolean;
    title?: React.ReactNode;
    onClose: () => void;
    onSave: () => void;
    formRef: CreateOrEditChietKhauHoaDonDto;
}
class CreateOrEditChietKhauHoaDonModal extends Component<DialogProps> {
    state = {
        tabIndex: '1',
        selectedChucVuId: '',
        listEmployee: [] as SuggestNhanSuDto[],
        listEmployeeSelected: [] as SuggestNhanSuDto[],
        listIdEmployeeAdd: [] as SuggestNhanSuDto[],
        listIdEmployeeRemove: [] as SuggestNhanSuDto[],
        filteredChucVu: [] as SuggestChucVuDto[],
        chucVuSearchValue: '',
        nhanVienSearchValue: '',
        nhanVienSelectedSearchValue: ''
    };
    handleChucVuSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ chucVuSearchValue: event.target.value });
    };

    handleNhanVienSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ nhanVienSearchValue: event.target.value });
    };
    handleNhanVienSelectedSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ nhanVienSelectedSearchValue: event.target.value });
    };

    handleAddNhanVien = (item: SuggestNhanSuDto, checked: boolean) => {
        if (checked == true) {
            const newArray = [...this.state.listIdEmployeeAdd, item];
            this.setState({
                listIdEmployeeAdd: newArray
            });
        }
        if (checked === false) {
            const newArray = this.state.listIdEmployeeAdd.filter((x) => x != item);
            this.setState({
                listIdEmployeeAdd: newArray
            });
        }
    };
    handleRemoveNhanVien = (item: SuggestNhanSuDto, checked: boolean) => {
        if (checked == true) {
            const newArray = [...this.state.listIdEmployeeRemove, item];
            this.setState({
                listIdEmployeeRemove: newArray
            });
        }
        if (checked === false) {
            const newArray = this.state.listIdEmployeeRemove.filter((x) => x != item);
            this.setState({
                listIdEmployeeRemove: newArray
            });
        }
    };
    handleMoveItemSelectToRight = () => {
        const newListEmployee = this.state.listEmployee.filter(
            (employee) => !this.state.listIdEmployeeAdd.includes(employee)
        );
        this.setState({
            listEmployeeSelected: [...this.state.listEmployeeSelected, ...this.state.listIdEmployeeAdd],
            listIdEmployeeAdd: [],
            listEmployee: newListEmployee
        });
    };
    handleMoveItemSelectToLeft = () => {
        const newListEmployee = [...this.state.listEmployee, ...this.state.listIdEmployeeRemove];
        const newListEmployeeSelected = this.state.listEmployeeSelected.filter(
            (employee) => !this.state.listIdEmployeeRemove.includes(employee)
        );
        this.setState({
            listEmployeeSelected: newListEmployeeSelected,
            listIdEmployeeRemove: [],
            listEmployee: newListEmployee
        });
    };

    handleMoveToRight = (item: SuggestNhanSuDto) => {
        const { listEmployeeSelected, listEmployee } = this.state;
        const updatedLeftList = listEmployee.filter((employee) => employee.id !== item.id);
        const selectedItemsData = suggestStore.suggestNhanVien.filter((employee) => employee.id === item.id);
        this.setState({
            listEmployee: updatedLeftList,
            listEmployeeSelected: [...listEmployeeSelected, ...selectedItemsData]
        });
    };

    handleMoveToLeft = (item: SuggestNhanSuDto) => {
        const { listEmployeeSelected, listEmployee } = this.state;
        const updatedRightList = listEmployeeSelected.filter((employee) => employee.id !== item.id);
        const selectedEmployees = suggestStore.suggestNhanVien.filter((employee) => employee.id === item.id);
        this.setState({
            listEmployeeSelected: updatedRightList,
            listEmployee: [...listEmployee, ...selectedEmployees]
        });
    };
    handleSelectAllItemToAdd = (checked: boolean) => {
        checked === true
            ? this.setState({
                  listIdEmployeeAdd: this.state.listEmployee
              })
            : this.setState({
                  listIdEmployeeAdd: []
              });
    };
    handleSelectAllItemToRemove = (checked: boolean) => {
        checked === true
            ? this.setState({
                  listIdEmployeeRemove: this.state.listEmployeeSelected
              })
            : this.setState({
                  listIdEmployeeRemove: []
              });
    };
    handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        this.setState({ tabIndex: newValue });
        if (newValue === '2') {
            this.fillDataEmployee();
        }
    };
    fillDataEmployee = async () => {
        if (suggestStore && chietKhauHoaDonStore) {
            const { suggestNhanVien } = suggestStore;
            const { createOrEditDto } = chietKhauHoaDonStore;

            if (suggestNhanVien && createOrEditDto) {
                this.setState({
                    listEmployee: suggestNhanVien.filter((x) => !createOrEditDto.idNhanViens.includes(x.id)),
                    listEmployeeSelected: suggestNhanVien.filter((x) => createOrEditDto.idNhanViens.includes(x.id))
                });
            }
        }
    };
    render(): ReactNode {
        const { title, onClose, onSave, visited } = this.props;
        const initValues: CreateOrEditChietKhauHoaDonDto = chietKhauHoaDonStore.createOrEditDto;
        const filteredChucVu =
            this.state.chucVuSearchValue === ''
                ? suggestStore.suggestChucVu
                : suggestStore.suggestChucVu?.filter((item) =>
                      item.tenChucVu.toLowerCase().includes(this.state.chucVuSearchValue.toLowerCase())
                  );
        const filteredNhanVien = Array.isArray(this.state.listEmployee)
            ? this.state.listEmployee.filter((item) => {
                  const selectedChucVu = filteredChucVu.find((x) => x.idChucVu === this.state.selectedChucVuId);

                  // Add null/undefined checks to avoid 'Cannot read properties of undefined'
                  return (
                      (this.state.selectedChucVuId === '' ||
                          (selectedChucVu && selectedChucVu.tenChucVu === item.chucVu)) &&
                      item.tenNhanVien &&
                      item.tenNhanVien.toLowerCase().includes(this.state.nhanVienSearchValue.toLowerCase())
                  );
              })
            : [];

        const filteredSelectedNhanVien = Array.isArray(this.state.listEmployeeSelected)
            ? this.state.listEmployeeSelected.filter(
                  (item) =>
                      item.tenNhanVien &&
                      item.tenNhanVien.toLowerCase().includes(this.state.nhanVienSelectedSearchValue.toLowerCase())
              )
            : [];

        return (
            <Dialog open={visited} fullWidth maxWidth="md" onClose={onClose}>
                <DialogTitle sx={{ fontSize: '24px', fontWeight: '700' }}>
                    {title}
                    {onClose ? (
                        <IconButton
                            aria-label="close"
                            onClick={() => {
                                onClose();
                                this.setState({
                                    tabIndex: '1',
                                    chucVuSearchValue: '',
                                    nhanVienSearchValue: '',
                                    nhanVienSelectedSearchValue: ''
                                });
                            }}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                '&:hover svg': {
                                    filter: 'brightness(0) saturate(100%) invert(36%) sepia(74%) saturate(1465%) hue-rotate(318deg) brightness(94%) contrast(100%)'
                                }
                            }}>
                            <CloseIcon />
                        </IconButton>
                    ) : null}
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={initValues}
                        onSubmit={async (values, formikHepler) => {
                            values.idNhanViens = this.state.listEmployeeSelected.map((item) => {
                                return item.id;
                            });
                            if (
                                values.chungTuApDung == '' ||
                                values.chungTuApDung == null ||
                                values.chungTuApDung == undefined
                            ) {
                                formikHepler.setFieldError('chungTuApDung', 'Chứng từ áp dụng không được để trống');
                                this.setState({ tabIndex: '1' });
                            } else if (values.idNhanViens.length == 0) {
                                formikHepler.setFieldError('idNhanViens', 'Nhân viên không được để trống');
                                this.fillDataEmployee();
                                this.setState({ tabIndex: '2' });
                            } else if (values.giaTriChietKhau == null || values.giaTriChietKhau == 0) {
                                formikHepler.setFieldError('giaTriChietKhau', 'Giá trị chiết khấu không được để trống');
                                this.setState({ tabIndex: '1' });
                            } else if (values.giaTriChietKhau <= 0) {
                                formikHepler.setFieldError('giaTriChietKhau', 'Giá trị chiết khấu phải là số dương');
                                this.setState({ tabIndex: '1' });
                            } else {
                                const createOrEdit = await chietKhauHoaDonStore.createOrEdit(values);
                                enqueueSnackbar(createOrEdit.message, {
                                    variant: createOrEdit.status,
                                    autoHideDuration: 3000
                                });
                                this.setState({
                                    tabIndex: '1',
                                    chucVuSearchValue: '',
                                    nhanVienSearchValue: '',
                                    nhanVienSelectedSearchValue: ''
                                });
                                await onSave();
                            }
                        }}>
                        {({ handleChange, errors, touched, values, setFieldValue, isSubmitting }) => (
                            <Form
                                onKeyPress={(event: React.KeyboardEvent<HTMLFormElement>) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault(); // Prevent unwanted form submission
                                    }
                                }}>
                                <TabContext value={this.state.tabIndex}>
                                    <TabList onChange={this.handleTabChange}>
                                        <Tab label="Thông tin" value="1" sx={{ textTransform: 'unset!important' }} />
                                        <Tab
                                            label="Nhân viên áp dụng"
                                            value="2"
                                            sx={{ textTransform: 'unset!important' }}
                                        />
                                    </TabList>
                                    <TabPanel value="1" sx={{ padding: '16px' }}>
                                        <Grid container spacing={4} rowSpacing={2}>
                                            <Grid item xs={12}>
                                                <RadioGroup
                                                    name="loaiChietKhau"
                                                    value={values?.loaiChietKhau ?? 1}
                                                    onChange={handleChange}
                                                    sx={{ display: 'flex', flexDirection: 'row' }}>
                                                    <FormControlLabel
                                                        value={1}
                                                        control={<Radio />}
                                                        label="Theo % thực thu"
                                                    />
                                                    <FormControlLabel
                                                        value={2}
                                                        control={<Radio />}
                                                        label=" Theo % doanh thu"
                                                    />
                                                    <FormControlLabel value={3} control={<Radio />} label="Theo VNĐ" />
                                                </RadioGroup>
                                                {errors.loaiChietKhau && touched.loaiChietKhau && (
                                                    <span className={'text-danger'}>{errors.loaiChietKhau}</span>
                                                )}
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={4}>
                                                <NumericFormat
                                                    label={<Typography>Giá trị chiết khấu</Typography>}
                                                    fullWidth
                                                    size="small"
                                                    name="giaTriChietKhau"
                                                    thousandSeparator={'.'}
                                                    decimalSeparator={','}
                                                    error={
                                                        errors.giaTriChietKhau && touched.giaTriChietKhau ? true : false
                                                    }
                                                    helperText={
                                                        errors.giaTriChietKhau &&
                                                        touched.giaTriChietKhau && (
                                                            <span className="text-danger">
                                                                {errors.giaTriChietKhau}
                                                            </span>
                                                        )
                                                    }
                                                    value={values?.giaTriChietKhau}
                                                    onChange={(e) => {
                                                        const valueChange = e.target.value.replaceAll('.', '');
                                                        setFieldValue('giaTriChietKhau', Number.parseInt(valueChange));
                                                    }}
                                                    customInput={TextField}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={8}>
                                                <FormControl fullWidth>
                                                    <Autocomplete
                                                        options={suggestStore.suggestLoaiChungTu ?? []}
                                                        getOptionLabel={(option: any) => option.tenLoaiChungTu}
                                                        size="small"
                                                        onChange={(_, newValue) => {
                                                            setFieldValue('chungTuApDung', newValue?.tenLoaiChungTu);
                                                        }}
                                                        value={
                                                            suggestStore.suggestLoaiChungTu?.filter(
                                                                (x) => x.tenLoaiChungTu == values?.chungTuApDung
                                                            )[0] ?? { id: 0, tenLoaiChungTu: '' }
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label={
                                                                    <Typography variant="subtitle2">
                                                                        Chứng từ áp dụng
                                                                    </Typography>
                                                                }
                                                                error={
                                                                    errors.chungTuApDung && touched.chungTuApDung
                                                                        ? true
                                                                        : false
                                                                }
                                                                fullWidth
                                                                sx={{
                                                                    fontSize: '16px',
                                                                    color: '#4c4b4c'
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </FormControl>
                                                {errors.chungTuApDung && touched.chungTuApDung && (
                                                    <span className={'text-danger'}>{errors.chungTuApDung}</span>
                                                )}
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    name="ghiChu"
                                                    value={values.ghiChu}
                                                    onChange={handleChange}
                                                    label={<Typography>Ghi chú</Typography>}
                                                    multiline
                                                    minRows={2}
                                                    maxRows={3}></TextField>
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                    <TabPanel value="2" sx={{ padding: '16px' }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={3}>
                                                <Typography>Vị trí</Typography>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    className="search-field"
                                                    variant="outlined"
                                                    placeholder="Tìm kiếm"
                                                    value={this.state.chucVuSearchValue}
                                                    onChange={this.handleChucVuSearchChange}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <IconButton type="button">
                                                                <img src={SearchIcon} />
                                                            </IconButton>
                                                        )
                                                    }}></TextField>
                                                <Box maxHeight={'300px'} overflow={'auto'} marginTop={2}>
                                                    <ListItem
                                                        sx={{
                                                            fontSize: '13px !important',
                                                            backgroundColor:
                                                                this.state.selectedChucVuId === ''
                                                                    ? '#E6E6E6'
                                                                    : 'transparent' // Apply background color based on selection
                                                        }}
                                                        onClick={async () => {
                                                            await this.setState({
                                                                selectedChucVuId: '',
                                                                chucVuSearchValue: ''
                                                            });
                                                        }}>
                                                        <ListItemText
                                                            primary={<Typography fontSize={'13px'}>Tất cả</Typography>}
                                                        />
                                                    </ListItem>
                                                    {filteredChucVu.map((item, key) => (
                                                        <ListItem
                                                            key={key}
                                                            sx={{
                                                                fontSize: '13px !important',
                                                                backgroundColor:
                                                                    this.state.selectedChucVuId === item.idChucVu
                                                                        ? '#E6E6E6'
                                                                        : 'transparent' // Apply background color based on selection
                                                            }}
                                                            onClick={async () => {
                                                                this.setState({
                                                                    selectedChucVuId: item.idChucVu
                                                                });
                                                            }}>
                                                            <ListItemText
                                                                primary={
                                                                    <Typography fontSize={'13px'}>
                                                                        {item.tenChucVu}
                                                                    </Typography>
                                                                }
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4.5}>
                                                <Typography>Nhân viên</Typography>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    className="search-field"
                                                    variant="outlined"
                                                    placeholder="Tìm kiếm"
                                                    value={this.state.nhanVienSearchValue}
                                                    onChange={this.handleNhanVienSearchChange}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <IconButton type="button">
                                                                <img src={SearchIcon} />
                                                            </IconButton>
                                                        )
                                                    }}></TextField>
                                                <Box maxHeight={'300px'} overflow={'auto'} marginTop={2}>
                                                    <Box
                                                        display={'flex'}
                                                        alignItems={'center'}
                                                        justifyContent={'space-between'}>
                                                        <Box paddingLeft={'15px'}>
                                                            <FormControlLabel
                                                                label="Chọn tất cả"
                                                                onChange={(event, checked) => {
                                                                    this.handleSelectAllItemToAdd(checked);
                                                                }}
                                                                control={<Checkbox />}
                                                            />
                                                            {this.state.listIdEmployeeAdd.length > 0 ? (
                                                                <Typography fontSize={'13px'}>
                                                                    {this.state.listIdEmployeeAdd.length} bản ghi được
                                                                    chọn
                                                                </Typography>
                                                            ) : null}
                                                        </Box>
                                                        <Button
                                                            variant="text"
                                                            onClick={this.handleMoveItemSelectToRight}>
                                                            Thêm
                                                        </Button>
                                                    </Box>
                                                    {Array.isArray(filteredNhanVien) ? (
                                                        filteredNhanVien.map((item, key) => (
                                                            <ListItem
                                                                key={key}
                                                                sx={{ fontSize: '13px !important' }}
                                                                secondaryAction={
                                                                    <IconButton
                                                                        edge="end"
                                                                        size="small"
                                                                        sx={{
                                                                            border: '1px solid #C2C9D6',
                                                                            borderRadius: '4px',
                                                                            padding: '2px'
                                                                        }}
                                                                        onClick={() => {
                                                                            this.handleMoveToRight(item);
                                                                        }}>
                                                                        <ArrowForwardIosIcon />
                                                                    </IconButton>
                                                                }>
                                                                <ListItemIcon sx={{ minWidth: 'auto' }}>
                                                                    <Checkbox
                                                                        edge="start"
                                                                        checked={this.state.listIdEmployeeAdd.includes(
                                                                            item
                                                                        )}
                                                                        onChange={(event, checked) => {
                                                                            this.handleAddNhanVien(item, checked);
                                                                        }}
                                                                    />
                                                                </ListItemIcon>
                                                                <ListItemAvatar
                                                                    sx={{
                                                                        width: '40px',
                                                                        height: '40px'
                                                                    }}>
                                                                    <Avatar src={item.avatar} />
                                                                </ListItemAvatar>
                                                                <ListItemText
                                                                    primary={
                                                                        <Typography fontSize={'14px'}>
                                                                            {item.tenNhanVien}
                                                                        </Typography>
                                                                    }
                                                                    secondary={item.chucVu}
                                                                />
                                                            </ListItem>
                                                        ))
                                                    ) : (
                                                        // Handle the case when items is not an array
                                                        <div>No items to display</div>
                                                    )}
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4.5}>
                                                <Typography>Nhân viên áp dụng</Typography>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    className="search-field"
                                                    variant="outlined"
                                                    placeholder="Tìm kiếm"
                                                    value={this.state.nhanVienSelectedSearchValue}
                                                    onChange={this.handleNhanVienSelectedSearchChange}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <IconButton type="button">
                                                                <img src={SearchIcon} />
                                                            </IconButton>
                                                        )
                                                    }}></TextField>
                                                <Box maxHeight={'300px'} overflow={'auto'} marginTop={2}>
                                                    <Box display={'flex'} justifyContent={'space-between'}>
                                                        <Box paddingLeft={'15px'}>
                                                            <FormControlLabel
                                                                label="Chọn tất cả"
                                                                onChange={(event, checked) => {
                                                                    this.handleSelectAllItemToRemove(checked);
                                                                }}
                                                                control={<Checkbox />}
                                                            />
                                                            {this.state.listIdEmployeeRemove.length > 0 ? (
                                                                <Typography fontSize={'13px'}>
                                                                    {this.state.listIdEmployeeRemove.length} bản ghi
                                                                    được chọn
                                                                </Typography>
                                                            ) : null}
                                                        </Box>
                                                        <Button
                                                            variant="text"
                                                            onClick={this.handleMoveItemSelectToLeft}>
                                                            Xóa
                                                        </Button>
                                                    </Box>
                                                    {Array.isArray(filteredSelectedNhanVien) ? (
                                                        filteredSelectedNhanVien.map((item, key) => (
                                                            <ListItem
                                                                key={key}
                                                                secondaryAction={
                                                                    <CloseOutlinedIcon
                                                                        onClick={() => {
                                                                            this.handleMoveToLeft(item);
                                                                        }}
                                                                    />
                                                                }>
                                                                <ListItemIcon sx={{ minWidth: 'auto' }}>
                                                                    <Checkbox
                                                                        edge="start"
                                                                        checked={this.state.listIdEmployeeRemove.includes(
                                                                            item
                                                                        )}
                                                                        onChange={(event, checked) => {
                                                                            this.handleRemoveNhanVien(item, checked);
                                                                        }}
                                                                    />
                                                                </ListItemIcon>
                                                                <ListItemAvatar
                                                                    sx={{
                                                                        width: '40px',
                                                                        height: '40px'
                                                                    }}>
                                                                    <Avatar src={item.avatar} />
                                                                </ListItemAvatar>
                                                                <ListItemText
                                                                    primary={item.tenNhanVien}
                                                                    secondary={item.chucVu}
                                                                />
                                                            </ListItem>
                                                        ))
                                                    ) : (
                                                        // Handle the case when items is not an array
                                                        <div>No items to display</div>
                                                    )}
                                                    {errors.idNhanViens && (
                                                        <Box textAlign={'center'}>
                                                            <span
                                                                className={'text-danger'}
                                                                style={{
                                                                    width: '100%',
                                                                    fontSize: '13px'
                                                                }}>
                                                                {errors.idNhanViens}
                                                            </span>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                </TabContext>

                                <DialogActions sx={{ paddingRight: '0' }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: '8px',
                                            bottom: '24px',
                                            right: '50px'
                                        }}>
                                        <Button
                                            className="btn-outline-hover"
                                            variant="outlined"
                                            onClick={() => {
                                                onClose();
                                                this.setState({
                                                    tabIndex: '1',
                                                    chucVuSearchValue: '',
                                                    nhanVienSearchValue: '',
                                                    nhanVienSelectedSearchValue: ''
                                                });
                                            }}
                                            sx={{
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                color: 'var(--color-main)',
                                                borderColor: '#965C85'
                                            }}>
                                            Hủy
                                        </Button>
                                        {!isSubmitting ? (
                                            <Button
                                                className="btn-container-hover"
                                                variant="contained"
                                                sx={{
                                                    fontSize: '14px',
                                                    textTransform: 'unset',
                                                    color: '#fff',

                                                    border: 'none'
                                                }}
                                                type="submit">
                                                Lưu
                                            </Button>
                                        ) : (
                                            <Button
                                                className="btn-container-hover"
                                                variant="contained"
                                                sx={{
                                                    fontSize: '14px',
                                                    textTransform: 'unset',
                                                    color: '#fff',

                                                    border: 'none'
                                                }}>
                                                Đang lưu
                                            </Button>
                                        )}
                                    </Box>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        );
    }
}
export default observer(CreateOrEditChietKhauHoaDonModal);
