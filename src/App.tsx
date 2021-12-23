import React, {useEffect} from 'react';
import {CssBaseline} from "@mui/material";
import MainLayout from "./layout/MainLayout";
import {authSelector} from "./features/auth/authSlice";
import Login from "./features/auth/LoginPage";
import {useAppDispatch, useAppSelector} from './app/hooks';
import QuestionsPage, {
    newQuestionFilter,
    answeredQuestionFilter
} from "./features/poll/QuestionsPage";
import {getQuestionsAsync, pollSelector} from "./features/poll/pollSlice";
import {getUsersAsync, userSelector} from "./features/user/userSlice";
import {Routes, Route} from 'react-router-dom';
import QuestionDetailPage from "./features/poll/QuestionDetailPage";
import Leaderboard from "./features/poll/Leaderboard";
import NewQuestionPage from "./features/poll/NewQuestionPage";

function App() {
    const dispatch = useAppDispatch();
    const auth = useAppSelector(authSelector);
    const poll = useAppSelector(pollSelector);
    const user = useAppSelector(userSelector);

    const loadingUserData: boolean = user.status === 'loading';
    const loadingPollData: boolean = poll.status === 'loading';
    const loading: boolean = loadingUserData || loadingPollData;

    useEffect(() => {
        if (!auth.isAuthenticated) {
            return;
        }

        dispatch(getQuestionsAsync());
        dispatch(getUsersAsync());
    }, [auth.isAuthenticated, dispatch]);

    if (!auth.isAuthenticated) {
        return (<Login/>);
    }

    return (
        <div>
            <CssBaseline/>
            <MainLayout>
                <Routes>
                    <Route
                        path="/leaderboard"
                        element={(
                            <Leaderboard/>
                        )}
                    />
                    <Route
                        path="/"
                        element={(
                            <QuestionsPage
                                title="New Questions"
                                filter={newQuestionFilter}
                                isLoading={loading}
                            />
                        )}
                    />
                    <Route
                        path="/answered"
                        element={(
                            <QuestionsPage
                                title="Answered Questions"
                                filter={answeredQuestionFilter}
                                isLoading={loading}
                            />
                        )}
                    />
                    <Route
                        path="/questions/:question"
                        element={(<QuestionDetailPage isLoading={loading}/>)}
                    />
                    <Route
                        path="/add"
                        element={(<NewQuestionPage/>)}
                    />
                </Routes>
            </MainLayout>
        </div>
    );
}

export default App;
