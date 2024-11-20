import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import LoginModel from '../../services/login/dto/LoginModel';
import loginService from '../../services/login/loginService';
import tokenAuthService from '../../services/tokenAuth/tokenAuthService';
import { AuthenticationModel } from '../../services/tokenAuth/dto/authenticationModel';

//  an initial state value
const initialState: LoginModel = {
    // tenantId: 0,
    tenantName: '',
    userNameOrEmailAddress: '',
    password: '',
    rememberClient: false
};

export const getTenantByName = createAsyncThunk('auth/getTenantByName', async (tenantName: string) => {
    const response = await loginService.CheckTenant(tenantName);
    return response.tenantId;
});
export const getInforUser = createAsyncThunk('auth/getUserLogin', async (param: LoginModel) => {
    const body: AuthenticationModel = {
        userNameOrEmailAddress: param.userNameOrEmailAddress,
        password: param.password,
        rememberClient: param.rememberClient
    };

    // const response = await tokenAuthService.authenticate(param?.tenantId ?? 0, body);
    const response = await tokenAuthService.authenticate(body);
    return response;
});

export const authSlice = createSlice({
    name: 'auth', // name: to identify the slice
    initialState,
    reducers: {
        saveInforLogin: (state, action: PayloadAction<LoginModel>) => {
            // if (state?.tenantId !== undefined) {
            //     state.tenantId += action.payload?.tenantId ?? 0;
            // }
            state.tenantName = action.payload.tenantName;
            state.userNameOrEmailAddress = action.payload.userNameOrEmailAddress;
            state.rememberClient = action.payload.rememberClient;
        }
    }
});

//action
export const { saveInforLogin } = authSlice.actions;
export default authSlice.reducer;

export const currentAuth = (state: LoginModel) => state;
