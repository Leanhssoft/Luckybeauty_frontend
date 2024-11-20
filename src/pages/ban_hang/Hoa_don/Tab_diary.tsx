import React, { useEffect, useState } from 'react';
import { Box, Link } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import { TextTranslate } from '../../../components/TableLanguage';
import { format } from 'date-fns';
import SoQuyServices from '../../../services/so_quy/SoQuyServices';
import QuyHoaDonDto from '../../../services/so_quy/QuyHoaDonDto';
import utils from '../../../utils/utils';

export default function TabDiary({ idHoaDon }: any) {
    const [phieuThuChi, setPhieuThuChi] = useState<QuyHoaDonDto[]>([]);
    const GetNhatKyThanhToan = async () => {
        const data = await SoQuyServices.GetNhatKyThanhToan_ofHoaDon(idHoaDon);
        setPhieuThuChi(data);
    };
    useEffect(() => {
        if (!utils.checkNull(idHoaDon)) {
            GetNhatKyThanhToan();
        }
    }, [idHoaDon]);
    const columns: GridColDef[] = [
        {
            field: 'maHoaDon',
            headerName: 'Mã phiếu',
            minWidth: 120,
            flex: 0.6,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box component={'span'}>{params.value}</Box>
        },
        {
            field: 'ngayLapHoaDon',
            headerName: 'Ngày lập phiếu',
            headerAlign: 'center',
            minWidth: 120,
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Box textAlign="center" width="100%">
                    {format(new Date(params.value), 'dd/MM/yyyy HH:mm')}
                </Box>
            )
        },
        {
            field: 'loaiPhieu',
            headerName: 'Loại thu/chi',
            minWidth: 90,
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box width="100%">{params.value}</Box>
        },
        {
            field: 'sHinhThucThanhToan',
            headerName: 'Phương thức',
            minWidth: 100,
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box width="100%">{params.value}</Box>
        },
        {
            field: 'tongTienThu',
            headerName: 'Tiền thu',
            headerAlign: 'right',
            minWidth: 100,
            flex: 1,
            renderHeader: (params) => <Box width="100%">{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Box textAlign="right" width="100%">
                    {new Intl.NumberFormat('vi-VN').format(params.value)}
                </Box>
            )
        },
        {
            field: 'txtTrangThai',
            headerName: 'Trạng thái',
            headerAlign: 'center',
            minWidth: 100,
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Box
                    margin="auto"
                    sx={{
                        padding: '4px',
                        borderRadius: '100px',
                        color:
                            params.row.trangThai === 1 ? '#50CD89' : params.row.trangThai === 0 ? '#FF9900' : '#F1416C',
                        bgcolor:
                            params.row.trangThai === 1 ? '#E8FFF3' : params.row.trangThai === 0 ? '#FFF8DD' : '#FFF5F8'
                    }}>
                    {params.value}
                </Box>
            )
        }
    ];

    return (
        <Box>
            <DataGrid
                disableRowSelectionOnClick
                autoHeight
                hideFooter
                rowHeight={46}
                columns={columns}
                rows={phieuThuChi}
                localeText={TextTranslate}
            />
        </Box>
    );
}
