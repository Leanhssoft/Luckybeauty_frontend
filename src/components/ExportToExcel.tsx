import React from 'react';
import { Button } from '@mui/material';
import { saveAs } from 'file-saver';

import * as XLSX from 'xlsx';
import { GridColDef } from '@mui/x-data-grid';
import UploadIcon from '../images/upload.svg';
interface ExportToExcelProps {
    rows: any[];
    columns: GridColDef[];
    fileName: string;
}

const ExportToExcel: React.FC<ExportToExcelProps> = ({ rows, columns, fileName }) => {
    const handleExport = () => {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(rows, {
            header: columns.map((col) => col.field)
        });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([excelData]), `${fileName}.xlsx`);
    };

    return (
        <Button
            size="small"
            className="border-color btn-outline-hover"
            variant="outlined"
            startIcon={<img src={UploadIcon} />}
            sx={{
                textTransform: 'capitalize',
                fontWeight: '400',
                color: '#666466',
                padding: '10px 16px',
                borderColor: '#E6E1E6',
                bgcolor: '#fff!important'
            }}
            onClick={handleExport}>
            Xuất
        </Button>
    );
};

export default ExportToExcel;
