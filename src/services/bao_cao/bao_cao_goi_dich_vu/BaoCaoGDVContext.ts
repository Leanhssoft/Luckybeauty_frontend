import { createContext } from 'react';
import { format, startOfMonth, lastDayOfMonth } from 'date-fns';
import { RequestFromToDto } from '../../dto/ParamSearchDto';

export interface IBaoCaoGDV_DataContextFilter {
    loaiBaoCao: number;
    countClick: number;
    filter: RequestFromToDto;
}

export const BaoCaoGoiDVDataContextFilter = createContext<IBaoCaoGDV_DataContextFilter>({
    loaiBaoCao: 2,
    countClick: 0,
    filter: {
        textSearch: '',
        currentPage: 0,
        pageSize: 10,
        fromDate: format(startOfMonth(new Date()), 'yyyy-MM-01'),
        toDate: format(lastDayOfMonth(new Date()), 'yyyy-MM-dd')
    } as RequestFromToDto
});
