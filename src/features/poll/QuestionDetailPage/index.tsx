import {useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {pollSelector, storeAnswerAsync} from "../pollSlice";
import {Question, questionOptions} from "../../../types";
import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    RadioGroup
} from "@mui/material";
import {Radio, Card, CardContent, CardMedia, Box} from '@mui/material';
import {authSelector} from "../../auth/authSlice";
import {userSelector} from "../../user/userSlice";
import {useState} from "react";
import CircularIndeterminate from '../../../layout/CircularIndeterminate';
import LoadingButton from "@mui/lab/LoadingButton";
import * as React from "react";
import Typography from "@mui/material/Typography";
import {getValueForQuestion, getStatsForQuestion} from './utils';

type QuestionDetailPageProps = {
    isLoading: boolean,
};

const QuestionDetailPage = ({isLoading}: QuestionDetailPageProps) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const poll = useAppSelector(pollSelector);
    const auth = useAppSelector(authSelector);
    const user = useAppSelector(userSelector);

    let {question: id}: { question?: string | null } = useParams<"question">();
    const question: Question | null = id ? poll.questions.byId[id] : null;

    const [value, setValue] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const value = data.get('value');
        if (!value) {
            return;
        }

        setLoading(true);
        dispatch(storeAnswerAsync({
            userId: auth.userId!,
            questionId: question!.id,
            answer: questionOptions[value as keyof typeof questionOptions]
        })).finally(() => setLoading(false));
    };

    if (isLoading) {
        return <CircularIndeterminate/>;
    }

    if (!question) {
        return <div>Question not found.</div>;
    }

    const stats = getStatsForQuestion(question);

    const author = user.users.byId[question.author];

    const existingValue = getValueForQuestion(question, auth.userId!);
    const currentValue = existingValue || value;

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (existingValue) {
            return;
        }

        setValue(event.currentTarget.value);
    }

    return (
        <>
            <Card sx={{display: 'flex'}}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 5,
                }}>
                    <CardMedia
                        component="img"
                        sx={{width: 151}}
                        image={author.avatarURL || ''}
                        alt={author.name}
                    />
                    <p>Poll By: {author.name}</p>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <CardContent sx={{flex: '1 0 auto'}}>
                        <form onSubmit={handleSubmit}>
                            <fieldset disabled={!!existingValue} style={{border: 0}}>
                                <FormControl
                                    sx={{m: 3}}
                                    component="fieldset"
                                    variant="standard"
                                >
                                    <FormLabel component="legend">Would you rather...</FormLabel>
                                    <RadioGroup
                                        aria-label="quiz"
                                        name="value"
                                        value={currentValue}
                                        onChange={handleValueChange}
                                    >
                                        <FormControlLabel
                                            value={questionOptions.optionOne}
                                            control={<Radio/>}
                                            label={question.optionOne.text}
                                            disabled={!!existingValue}
                                        />
                                        <FormControlLabel
                                            value={questionOptions.optionTwo}
                                            control={<Radio/>}
                                            label={question.optionTwo.text}
                                            disabled={!!existingValue}
                                        />
                                    </RadioGroup>
                                    <FormHelperText>
                                        {existingValue ? '' : 'Stats will appear answer picking an option...'}
                                    </FormHelperText>
                                    <LoadingButton
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{mt: 3, mb: 2}}
                                        loading={loading}
                                        disabled={!!existingValue}
                                    >
                                        Submit
                                    </LoadingButton>
                                </FormControl>
                            </fieldset>
                        </form>
                    </CardContent>
                </Box>
            </Card>
            {existingValue && (
                <Card title="Stats" sx={{marginTop: 2}}>
                    <CardContent>
                        <Typography variant="h5" component="div" gutterBottom>
                            Stats
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <b>{stats.oneN}({stats.oneP}%)</b> users
                            prefer <b>{question.optionOne.text}</b>,
                            <br/>
                            while the
                            remaining <b>{stats.twoN}({stats.twoP}%)</b> prefer <b>{question.optionTwo.text}</b>.
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </>
    )
};

export default QuestionDetailPage;
