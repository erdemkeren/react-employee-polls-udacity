import {pollSelector, storeQuestionAsync} from "../pollSlice";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {authUserSelector} from "../../auth/authSlice";
import Box from '@mui/material/Box';
import {TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {styles} from './styles';
import {Alert, LoadingButton} from "@mui/lab";
import * as React from "react";
import {useState} from "react";
import {generatePath, useNavigate} from "react-router-dom";

const NewQuestionPage = () => {
    const dispatch = useAppDispatch();
    const authUser = useAppSelector(authUserSelector)!;
    const poll = useAppSelector(pollSelector);
    const [missingFields, setMissingFields] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const optionOneText = data.get('optionOneText');
        const optionTwoText = data.get('optionTwoText');

        if (!(optionOneText && optionTwoText)) {
            setMissingFields(true);
            return;
        }

        setMissingFields(false);

        dispatch(storeQuestionAsync({
            author: authUser.id,
            optionOneText: optionOneText as string,
            optionTwoText: optionTwoText as string,
        })).then(() => {
            navigate(generatePath('/'));
        });
    };

    return (
        <>
            <Typography variant="h2" component="div" gutterBottom>
                Add Question
            </Typography>
            <Typography variant="body2" component="div" gutterBottom>
                Would You Rather
            </Typography>
            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Box sx={styles.boxSx}>
                    <TextField fullWidth label="Option One" name="optionOneText"/>
                </Box>

                <Box sx={styles.boxSx}>
                    <TextField fullWidth label="Option Two" name="optionTwoText"/>
                </Box>

                <Box sx={styles.boxSx}>
                    {poll.status === 'failed' && (
                        <Alert severity="error">
                            The question was not created.
                        </Alert>
                    )}

                    {missingFields && (
                        <Alert severity="warning">
                            All fields are required.
                        </Alert>
                    )}

                    <LoadingButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                        loading={poll.status === 'loading'}
                    >
                        Submit
                    </LoadingButton>
                </Box>
            </Box>
        </>
    );
};

export default NewQuestionPage;
