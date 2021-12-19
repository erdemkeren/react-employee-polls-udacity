import QuestionList from "./QuestionList";
import {Question, QuestionWithAuthor} from "../../../types";
import {useAppSelector} from "../../../app/hooks";
import {pollSelector} from "../pollSlice";
import {authUserSelector} from "../../auth/authSlice";
import CircularIndeterminate from "../../../layout/CircularIndeterminate";
import Typography from "@mui/material/Typography";
import {userSelector} from "../../user/userSlice";

type QuestionsPageParams = {
    title: string,
    isLoading: boolean,
    filter: (answeredQuestionIds: Array<string>) => (id: string) => boolean,
};

const QuestionsPage = ({title, filter, isLoading}: QuestionsPageParams) => {
    const authUser = useAppSelector(authUserSelector);
    const answeredQuestionIds = Object.keys(authUser!.answers);
    const poll = useAppSelector(pollSelector);
    const newQuestionIds = poll.questions.allIds.filter(filter(answeredQuestionIds));
    const user = useAppSelector(userSelector);

    const newQuestionsWithAuthors = newQuestionIds.map((id: string): QuestionWithAuthor => {
        const question: Question = poll.questions.byId[id];

        return {
            ...question,
            authorObject: user.users.byId[question.author],
        };
    });

    if (isLoading) {
        return <CircularIndeterminate/>;
    }

    return (
        <>
            <Typography variant="h2" component="div" gutterBottom>
                {title}
            </Typography>
            <QuestionList questions={newQuestionsWithAuthors}/>
        </>
    )
}

export const newQuestionFilter = (answeredQuestionIds: Array<string>) =>
    (id: string) => !answeredQuestionIds.includes(id);
export const answeredQuestionFilter = (answeredQuestionIds: Array<string>) =>
    (id: string) => answeredQuestionIds.includes(id);

export default QuestionsPage;
