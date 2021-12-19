import authReducer, {AuthState, login, logout, authSelector} from "./authSlice";
import {PollState} from "../poll/pollSlice";
import {RootState} from "../../app/store";
import {UserState} from "../user/userSlice";

describe('auth reducer', () => {
    const initialAuthState: AuthState = {
        isAuthenticated: false,
        userId: undefined,
        status: 'idle',
    };

    const initialPollState: PollState = {
        questions: {
            byId: {},
            allIds: [],
        },
        status: 'idle',
    };

    const initialUserState: UserState = {
        status: 'idle',
        users: {
            byId: {},
            allIds: [],
        }
    };

    it('should handle initial state', () => {
        expect(authReducer(undefined, {type: 'unknown'})).toEqual({
            isAuthenticated: false,
            user: undefined,
            status: 'idle',
        });
    });

    it('should handle login', () => {
        const auth = authReducer(initialAuthState, login({
            id: ':id:',
            name: ':name:',
            avatarURL: ':avatarURL:',
            answers: {},
            questions: [],
        }));

        expect(auth.isAuthenticated).toBeTruthy();
        expect(auth.userId).toEqual(':id:');
    });

    it('should handle logout', () => {
        const auth = authReducer(initialAuthState, logout());

        expect(auth.userId).toBeUndefined();
        expect(auth.isAuthenticated).toBeFalsy();
    });

    it('should select auth', () => {
        const rootState: RootState = {
            auth: initialAuthState,
            poll: initialPollState,
            user: initialUserState,
        };
        const auth = authSelector(rootState);

        expect(auth.isAuthenticated).toBeFalsy();
        expect(auth.userId).toBeUndefined();
    });
});
