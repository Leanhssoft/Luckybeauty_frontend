/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Popover,
    SelectChangeEvent,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import { ReactComponent as SearchIcon } from '../../../images/search-normal.svg';
import React, { useEffect, useState } from 'react';
import NhatKyThaoTacItemDto from '../../../services/nhat_ky_hoat_dong/dto/NhatKyThaoTacItemDto';
import nhatKyHoatDongService from '../../../services/nhat_ky_hoat_dong/nhatKyHoatDongService';
import { format as formatDate, startOfMonth, endOfMonth, format } from 'date-fns';
import { ReactComponent as FilterIcon } from '../../../images/icons/i-filter.svg';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import htmlParse from 'html-react-parser';
import DateFilterCustom from '../../../components/DatetimePicker/DateFilterCustom';
import { IHeaderTable, MyHeaderTable } from '../../../components/Table/MyHeaderTable';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
    ({ theme }) => ({
        border: `1px solid ${theme.palette.divider}`,
        '&:not(:last-child)': {
            borderBottom: 0
        },
        '&::before': {
            display: 'none'
        }
    })
);

const AccordionSummary = styled((props: AccordionSummaryProps) => <MuiAccordionSummary {...props} />)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)'
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1)
    }
}));
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)'
}));
const NhatKyHoatDongPage = () => {
    const [selectedRow, setSelectedRow] = useState(-1);
    const [showContentRowSelect, setShowContentRowSelect] = useState(false);
    const [nhatKyHoatDongData, setNhatKyHoatDongData] = useState([] as NhatKyThaoTacItemDto[]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [filter, setFilter] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortType, setSortType] = useState('');
    const [skipCount, setSkipCount] = useState(1);
    const [maxResultCount, setMaxResultCount] = useState(10);
    const [timeFrom, setTimeFrom] = useState<Date>(startOfMonth(new Date()));
    const [timeTo, setTimeTo] = useState<Date>(endOfMonth(new Date()));
    const [anchorDateEl, setAnchorDateEl] = useState<HTMLDivElement | null>(null);
    const [loaiNhatKys, setLoaiNhatKys] = useState([] as number[]);
    const [anchorElFilter, setAnchorElFilter] = useState<any>(null);
    const handleSearchChange = (event: any) => {
        setFilter(event.target.value);
    };
    const getAll = async () => {
        const response = await nhatKyHoatDongService.getAll({
            loaiNhatKys: loaiNhatKys.filter((x) => x != null),
            keyword: filter,
            sortBy: sortBy,
            sortType: sortType,
            skipCount: skipCount,
            maxResultCount: maxResultCount,
            timeFrom: timeFrom,
            timeTo: timeTo
        });
        setNhatKyHoatDongData(response.items);
        setTotalCount(response.totalCount);
        setTotalPage(Math.ceil(response.totalCount / maxResultCount));
    };
    useEffect(() => {
        getAll();
    }, [loaiNhatKys, timeFrom, timeTo, filter, sortBy, sortType, maxResultCount, skipCount]);
    const handlePerPageChange = (event: SelectChangeEvent<number>) => {
        setMaxResultCount(parseInt(event.target.value.toString(), 10));
        setSkipCount(1);
    };
    const handlePageChange = (event: any, value: number) => {
        setSkipCount(value);
    };
    const chonLoaiThaoTac = (event: React.ChangeEvent<any>, checked: boolean) => {
        if (checked === true) {
            setLoaiNhatKys([...loaiNhatKys, Number.parseInt(event.target.value)]);
        } else {
            const newData = loaiNhatKys.filter((x) => x !== Number.parseInt(event.target.value));
            setLoaiNhatKys(newData);
        }
        console.log(JSON.stringify(loaiNhatKys));
    };
    const onApplyFilterDate = async (from: string, to: string, txtShow: string) => {
        setAnchorDateEl(null);
        setTimeFrom(new Date(from));
        setTimeTo(new Date(to));
    };

    const onClickRow = (index: number) => {
        setSelectedRow(index);
        if (index != selectedRow) {
            setShowContentRowSelect(true);
        } else {
            setShowContentRowSelect(!showContentRowSelect);
        }
    };
    const listColumnHeader: IHeaderTable[] = [
        { columnId: 'tenNhanVien', columnText: 'Tên nhân viên' },
        { columnId: 'chucNang', columnText: 'Chức năng' },
        { columnId: 'thoiGian', columnText: 'Thời gian' },
        { columnId: 'noiDung', columnText: 'Nội dung' },
        { columnId: 'chiNhanh', columnText: 'Chi nhánh' }
    ];
    const openDateSelect = Boolean(anchorDateEl);
    const filterContent = (
        <Box>
            <Accordion defaultExpanded={true}>
                <AccordionSummary>
                    <Typography>Chức năng</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <TextField
                            size="small"
                            onChange={(e) => {
                                setFilter(e.target.value);
                            }}
                            placeholder="Nhập từ khóa"
                            onKeyDown={(e) => {
                                if (e.key == 'Enter') {
                                    getAll();
                                }
                            }}
                            fullWidth
                        />
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded={true}>
                <AccordionSummary>
                    <Typography>Thời gian</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack>
                        <TextField
                            label="Thời gian"
                            size="small"
                            fullWidth
                            variant="outlined"
                            sx={{
                                '& .MuiInputBase-root': {
                                    height: '40px!important'
                                },
                                backgroundColor: 'white'
                            }}
                            onClick={(event) => setAnchorDateEl(event.currentTarget)}
                            value={`${formatDate(new Date(timeFrom), 'dd/MM/yyyy')} - ${formatDate(
                                new Date(timeTo),
                                'dd/MM/yyyy'
                            )}`}
                        />
                        <DateFilterCustom
                            id="popover-date-filter"
                            open={openDateSelect}
                            anchorEl={anchorDateEl}
                            onClose={() => setAnchorDateEl(null)}
                            onApplyDate={onApplyFilterDate}
                        />
                    </Stack>
                </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded={true}>
                <AccordionSummary>
                    <Typography>Thao tác</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box display={'flex'} flexDirection={'column'} justifyContent={'start'}>
                        <FormControlLabel
                            control={<Checkbox />}
                            value={1}
                            checked={loaiNhatKys.find((x) => x === 1) ? true : false}
                            onChange={chonLoaiThaoTac}
                            label={'Thêm mới'}
                        />
                        <FormControlLabel
                            control={<Checkbox />}
                            value={2}
                            checked={loaiNhatKys.find((x) => x === 2) ? true : false}
                            onChange={chonLoaiThaoTac}
                            label={'Cập nhật'}
                        />
                        <FormControlLabel
                            control={<Checkbox />}
                            value={7}
                            checked={loaiNhatKys.find((x) => x === 7) ? true : false}
                            onChange={chonLoaiThaoTac}
                            label={'Hủy'}
                        />
                        <FormControlLabel
                            control={<Checkbox />}
                            value={3}
                            checked={loaiNhatKys.find((x) => x === 3) ? true : false}
                            onChange={chonLoaiThaoTac}
                            label={'Xóa'}
                        />
                        <FormControlLabel
                            control={<Checkbox />}
                            value={4}
                            checked={loaiNhatKys.find((x) => x === 4) ? true : false}
                            onChange={chonLoaiThaoTac}
                            label={'Nhập'}
                        />
                        <FormControlLabel
                            control={<Checkbox />}
                            value={5}
                            checked={loaiNhatKys.find((x) => x === 5) ? true : false}
                            onChange={chonLoaiThaoTac}
                            label={'Xuất'}
                        />
                        <FormControlLabel
                            control={<Checkbox />}
                            value={6}
                            checked={loaiNhatKys.find((x) => x === 6) ? true : false}
                            onChange={chonLoaiThaoTac}
                            label={'Đăng nhập'}
                        />
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
    return (
        <Box
            sx={{
                paddingTop: '16px'
            }}>
            <Grid container columnSpacing={1.5}>
                <Grid item sm={3} md={3} lg={2.5} display={window.screen.width <= 600 ? 'none' : ''}>
                    {filterContent}
                </Grid>
                <Grid item sm={9} md={9} lg={9.5}>
                    <Grid container columnSpacing={1} justifyItems={'center'}>
                        <Grid item xs={6} md={7} display={'flex'} alignItems={'center'}>
                            <Typography variant="h1" fontWeight="700" fontSize="16px" color="#333233">
                                Lịch sử thao tác
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={5} display={'flex'} alignItems={'center'} justifyContent={'end'} gap={1}>
                            <Button
                                className="border-color btn-outline-hover"
                                aria-describedby="popover-filter"
                                variant="outlined"
                                sx={{
                                    textTransform: 'capitalize',
                                    fontWeight: '400',
                                    padding: '10px 16px',
                                    minWidth: 'fit-content',
                                    display: window.screen.width > 500 ? 'none' : 'inherit'
                                }}
                                onClick={(e) => {
                                    setAnchorElFilter(e.currentTarget);
                                }}>
                                <FilterIcon />
                            </Button>
                            <TextField
                                fullWidth
                                onKeyDown={(e) => {
                                    if (e.key == 'Enter') {
                                        getAll();
                                    }
                                }}
                                onChange={handleSearchChange}
                                size="small"
                                sx={{
                                    borderColor: '#E6E1E6!important',
                                    bgcolor: '#fff'
                                }}
                                placeholder="Tìm kiếm..."
                                InputProps={{
                                    startAdornment: (
                                        <SearchIcon
                                            onClick={() => {
                                                getAll();
                                            }}
                                            style={{
                                                marginRight: '8px',
                                                color: 'gray'
                                            }}
                                        />
                                    )
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Box mt={2}>
                        <TableContainer className="data-grid-row">
                            <Table sx={{ backgroundColor: 'white' }}>
                                <TableHead>
                                    <MyHeaderTable
                                        isShowCheck={false}
                                        showAction={false}
                                        isCheckAll={false}
                                        sortBy={''}
                                        sortType={'desc'}
                                        onRequestSort={() => console.log('sort')}
                                        listColumnHeader={listColumnHeader}
                                    />
                                </TableHead>
                                {nhatKyHoatDongData?.map((row, index) => (
                                    <TableBody key={index}>
                                        <TableRow onClick={() => onClickRow(index)}>
                                            <TableCell sx={{ minWidth: 100, maxWidth: 100 }}>
                                                {row?.tenNguoiThaoTac}
                                            </TableCell>
                                            <TableCell sx={{ minWidth: 100, maxWidth: 150 }}>{row?.chucNang}</TableCell>
                                            <TableCell sx={{ maxWidth: 150 }}>
                                                {format(new Date(row?.creationTime), 'dd/MM/yyyy HH:mm')}
                                            </TableCell>
                                            <TableCell
                                                className="lableOverflow"
                                                sx={{ maxWidth: 200 }}
                                                title={row?.noiDung}>
                                                {row?.noiDung}
                                            </TableCell>
                                            <TableCell className="lableOverflow">{row?.chiNhanh}</TableCell>
                                        </TableRow>
                                        {selectedRow !== -1 && selectedRow === index && showContentRowSelect && (
                                            <TableRow>
                                                <TableCell colSpan={7} sx={{ borderLeft: '1px solid #ccc' }}>
                                                    {htmlParse(row?.noiDungChiTiet ?? '')}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                ))}
                            </Table>
                        </TableContainer>
                        <CustomTablePagination
                            currentPage={skipCount}
                            rowPerPage={maxResultCount}
                            totalPage={totalPage}
                            totalRecord={totalCount}
                            handlePerPageChange={handlePerPageChange}
                            handlePageChange={handlePageChange}
                        />
                        <Popover
                            id={'popover-filter'}
                            open={Boolean(anchorElFilter)}
                            anchorEl={anchorElFilter}
                            onClose={() => {
                                setAnchorElFilter(null);
                            }}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center'
                            }}
                            sx={{ marginTop: 1 }}>
                            {filterContent}
                        </Popover>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default NhatKyHoatDongPage;
