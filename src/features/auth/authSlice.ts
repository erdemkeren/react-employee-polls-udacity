import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from "../../app/store";
import {fetchLogin} from "./authAPI";
import {User} from "../../types";

export const loginAsync = createAsyncThunk(
    'auth/fetchLogin',
    async (args: { username: string, password: string }) => {
        const res = await fetchLogin(args.username, args.password);
        // The value we return becomes the `fulfilled` action payload
        return res.data;
    },
);

export type AuthState = {
    isAuthenticated: boolean,
    userId?: string,
    status: 'idle' | 'loading' | 'failed',
};

const initialState: AuthState = {
    isAuthenticated: false,
    userId: undefined,
    status: 'idle',
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state: AuthState, action: PayloadAction<User>) => ({
            ...state,
            isAuthenticated: true,
            userId: action.payload.id,
        }),
        logout: (state: AuthState) => ({
            ...state,
            userId: undefined,
            isAuthenticated: false,
        }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.isAuthenticated = true;
                state.userId = action.payload.id;
            })
            .addCase(loginAsync.rejected, (state) => {
                state.status = 'failed';
            })
        ;
    },
})

export const {logout, login} = authSlice.actions;

export const authSelector = (state: RootState): AuthState => state.auth;
export const authUserSelector = (state: RootState): User | null => (
    state.auth.userId ? state.user.users.byId[state.auth.userId] : null
);

export default authSlice.reducer;
