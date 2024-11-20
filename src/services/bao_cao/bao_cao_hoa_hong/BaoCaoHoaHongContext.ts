import { createContext, useContext } from 'react';
import { ParamSearchBaoCaoHoaHong } from './BaoCaoHoaHongDto';
import { format, startOfMonth, lastDayOfMonth } from 'date-fns';

export interface IBaoCaoHoaHong_DataContextFilter {
    loaiBaoCao: string;
    countClick: number;
    filter: ParamSearchBaoCaoHoaHong;
}

export const BaoCaoHoaHongDataContextFilter = createContext<IBaoCaoHoaHong_DataContextFilter>({
    loaiBaoCao: '1',
    countClick: 0,
    filter: {
        textSearch: '',
        currentPage: 0,
        pageSize: 10,
        fromDate: format(startOfMonth(new Date()), 'yyyy-MM-01'),
        toDate: format(lastDayOfMonth(new Date()), 'yyyy-MM-dd')
    } as ParamSearchBaoCaoHoaHong
});
