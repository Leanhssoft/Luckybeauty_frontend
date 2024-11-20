import { Checkbox, Stack, TableCell, TableCellProps, TableRow, TableSortLabel } from '@mui/material';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import { useState } from 'react';

export interface IHeaderTable {
    columnId: string;
    columnText: string;
    align?: TableCellProps['align'];
}
export interface IMyTableProps {
    sortType: string;
    sortBy: string;
    isCheckAll: boolean;
    isShowCheck?: boolean;
    showAction: boolean;
    listColumnHeader: IHeaderTable[];
    onRequestSort?: (columnSort: string) => void;
    onSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MyHeaderTable(props: IMyTableProps) {
    const { listColumnHeader, isShowCheck, showAction, sortType, sortBy, isCheckAll, onRequestSort, onSelectAllClick } =
        props;

    const createSortHandler = (columnSort: string) => {
        if (onRequestSort) {
            onRequestSort(columnSort);
        }
    };

    return (
        <>
            <TableRow
                sx={{
                    ' & .MuiTableCell-root': {
                        padding: '14px 8px!important'
                    }
                }}>
                {(isShowCheck ?? true) && (
                    <TableCell align="center" className="td-check-box">
                        <Checkbox checked={isCheckAll} onChange={onSelectAllClick} />
                    </TableCell>
                )}

                {listColumnHeader.map((x) => (
                    <TableCell key={x.columnId}>
                        <Stack
                            direction={'row'}
                            spacing={0.5}
                            justifyContent={x.align == 'right' ? 'end' : x.align}
                            onClick={() => createSortHandler(x.columnId)}>
                            <Stack>{x.columnText}</Stack>
                            {sortBy == x.columnId ? (
                                sortType == 'asc' ? (
                                    <ArrowUpwardOutlinedIcon />
                                ) : (
                                    <ArrowDownwardOutlinedIcon />
                                )
                            ) : null}
                        </Stack>
                    </TableCell>
                ))}
                {showAction && (
                    <TableCell align="center" title="Thao tác">
                        #
                    </TableCell>
                )}
            </TableRow>
        </>
    );
}
