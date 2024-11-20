import { GridApi } from '@mui/x-data-grid';

export const handleExportClick = (gridApi: GridApi | null) => {
    if (gridApi) {
        gridApi.exportDataAsCsv();
    }
};
