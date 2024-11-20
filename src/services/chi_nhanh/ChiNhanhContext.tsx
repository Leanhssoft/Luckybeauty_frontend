import { createContext } from 'react';
import { SuggestChiNhanhDto } from '../suggests/dto/SuggestChiNhanhDto';
import { CuaHangDto } from '../cua_hang/Dto/CuaHangDto';
export const ChiNhanhContext = createContext<SuggestChiNhanhDto>({ id: '', tenChiNhanh: '' });
export const ChiNhanhContextbyUser = createContext<SuggestChiNhanhDto[]>([]);

export interface IAppContext {
    chinhanhCurrent: SuggestChiNhanhDto;
    congty: CuaHangDto;
}
export const AppContext = createContext<IAppContext>({} as IAppContext);
