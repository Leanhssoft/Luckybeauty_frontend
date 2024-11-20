import { createContext } from 'react';
import { SuggestNguonKhachDto } from '../../suggests/dto/SuggestNguonKhachDto';
import { SuggestNhomKhachDto } from '../../suggests/dto/SuggestNhomKhachDto';
import { KhachHangItemDto } from './KhachHangItemDto';
import { PagedResultDto } from '../../dto/pagedResultDto';

export const DataCustomerContext = createContext({
    listNguonKhach: [] as SuggestNguonKhachDto[],
    listNhomkhach: [] as SuggestNhomKhachDto[]
});
