import { createContext } from 'react';
import NhanSuItemDto from './nhanSuItemDto';
export const ListNhanVienDataContext = createContext<NhanSuItemDto[]>([]);
