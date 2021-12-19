import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {fetchUsers} from "./userAPI";
import {User, UserWithScore} from "../../types";
import {RootState} from "../../app/store";
import {storeAnswerAsync, storeQuestionAsync} from "../poll/pollSlice";

type UsersById = {
    [key: string]: User,
};

export type UserState = {
    users: {
        byId: UsersById,
        allIds: Array<string>,
    },
    status: 'idle' | 'loading' | 'failed',
}

const initialState: UserState = {
    users: {
        byId: {},
        allIds: [],
    },
    status: 'idle',
}

export const getUsersAsync = createAsyncThunk(
    'user/fetchUsers',
    async () => await fetchUsers(),
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUsersAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getUsersAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.users.byId = action.payload;
                state.users.allIds = Object.keys(action.payload);
            })
            .addCase(getUsersAsync.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(storeAnswerAsync.fulfilled, (state, action) => ({
                ...state,
                users: {
                    ...state.users,
                    byId: {
                        ...state.users.byId,
                        [action.meta.arg.userId]: {
                            ...state.users.byId[action.meta.arg.userId],
                            answers: {
                                ...state.users.byId[action.meta.arg.userId].answers,
                                [action.meta.arg.questionId]: action.meta.arg.answer,
                            },
                        }
                    },
                }
            }))
            .addCase(storeQuestionAsync.fulfilled, (state, action) => ({
                ...state,
                users: {
                    ...state.users,
                    byId: {
                        ...state.users.byId,
                        [action.meta.arg.author]: {
                            ...state.users.byId[action.meta.arg.author],
                            questions: [
                                ...state.users.byId[action.meta.arg.author].questions,
                                action.payload.id,
                            ]
                        }
                    },
                }
            }))
        ;
    },
});

const calculateUserPoints = (user: User): number => (
    user.questions.length + Object.keys(user.answers).length
);

export const userSelector = (state: RootState): UserState => state.user;
export const leaderSelector = (state: RootState): Array<UserWithScore> => {
    const {users} = userSelector(state);

    return users.allIds.reduce((usersWithScores: Array<UserWithScore>, userId: string): Array<UserWithScore> => ([
        ...usersWithScores,
        {
            ...users.byId[userId],
            score: calculateUserPoints(users.byId[userId]),
        }
    ]), []).sort((userA, userB) => userB.score - userA.score);
};

export default userSlice.reducer;
