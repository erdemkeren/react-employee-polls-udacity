import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchQuestions, storeAnswer, storeQuestion} from "./pollAPI";
import {RootState} from "../../app/store";
import {Question, questionOptions} from '../../types';

export const getQuestionsAsync = createAsyncThunk(
    'poll/fetchQuestions',
    async () => await fetchQuestions()
);

type StoreQuestionAsyncArgs = { author: string, optionOneText: string, optionTwoText: string };
export const storeQuestionAsync = createAsyncThunk(
    'poll/storeQuestion',
    async (args: StoreQuestionAsyncArgs) => await storeQuestion(args)
)

type StoreAnswerArgs = { userId: string, questionId: string, answer: questionOptions };
export const storeAnswerAsync = createAsyncThunk(
    'poll/storeQuestionAnswer',
    async (args: StoreAnswerArgs) => (await storeAnswer({
        authedUser: args.userId,
        qid: args.questionId,
        answer: args.answer,
    }))
)

type QuestionsById = {
    [key: string]: Question,
};

export type PollState = {
    questions: {
        byId: QuestionsById,
        allIds: Array<string>,
    },
    status: 'idle' | 'loading' | 'failed',
}

const initialState: PollState = {
    questions: {
        byId: {},
        allIds: [],
    },
    status: 'idle',
}

export const pollSlice = createSlice({
    name: 'poll',
    initialState,
    reducers: {
        store: (state: PollState, action: PayloadAction<Question>) => ({
            ...state,
            questions: {
                ...state.questions,
                byId: {
                    ...state.questions.byId,
                    [action.payload.id]: action.payload,
                },
                allIds: [
                    ...state.questions.allIds,
                    action.payload.id,
                ]
            },
        }),
        update: (state: PollState, action: PayloadAction<Question>) => ({
            ...state,
            questions: {
                ...state.questions,
                byId: {
                    ...state.questions.byId,
                    [action.payload.id]: action.payload,
                },
            }
        }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(getQuestionsAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getQuestionsAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.questions.byId = action.payload;
                state.questions.allIds = pluckQuestionIds(action.payload);
            })
            .addCase(getQuestionsAsync.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(storeAnswerAsync.fulfilled, (state, action) => ({
                ...state,
                questions: {
                    ...state.questions,
                    byId: {
                        ...state.questions.byId,
                        [action.meta.arg.questionId]: {
                            ...state.questions.byId[action.meta.arg.questionId],
                            [action.meta.arg.answer]: {
                                ...state.questions.byId[action.meta.arg.questionId][action.meta.arg.answer],
                                votes: [
                                    ...state.questions.byId[action.meta.arg.questionId][action.meta.arg.answer].votes,
                                    action.meta.arg.userId,
                                ]
                            },
                        }
                    }
                }
            }))
            .addCase(storeQuestionAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(storeQuestionAsync.fulfilled, (state, action) => ({
                ...state,
                status: 'idle',
                questions: {
                    ...state.questions,
                    byId: {
                        ...state.questions.byId,
                        [action.payload.id]: {
                            ...action.payload,
                        },
                    },
                    allIds: [action.payload.id, ...state.questions.allIds],
                },
            }))
            .addCase(storeQuestionAsync.rejected, (state) => {
                state.status = 'failed';
            })
        ;
    },
});

const pluckQuestionIds = (questionsById: QuestionsById): Array<string> => {
    return Object.keys(questionsById)
        .reduce((questions: Array<Question>, questionId: string): Array<Question> => ([
            ...questions,
            questionsById[questionId],
        ]), [])
        .sort((a: Question, b: Question): number => b.timestamp - a.timestamp)
        .reduce((allIds: Array<string>, question: Question): Array<string> => ([
            ...allIds,
            question.id,
        ]), []);
};


export const pollSelector = (state: RootState): PollState => state.poll;

export const {store, update} = pollSlice.actions;

export default pollSlice.reducer;
