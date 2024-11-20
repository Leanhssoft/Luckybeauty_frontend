import { createContext } from 'react';
import { GetAllUserOutput } from './dto/getAllUserOutput';
// used to pass data from deep child
export const UserContext = createContext<GetAllUserOutput[]>([]);
