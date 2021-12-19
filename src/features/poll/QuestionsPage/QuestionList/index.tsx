import {Fragment} from 'react';
import {List, ListItem, ListItemText} from "@mui/material";
import {QuestionWithAuthor} from "../../../../types";
import QuestionListItem from "./QuestionListItem";
import Divider from "@mui/material/Divider";

type QuestionListProps = {
    questions: Array<QuestionWithAuthor>,
};

const QuestionList = ({questions}: QuestionListProps) => (
    <List sx={{width: '100%', bgcolor: 'background.paper'}}>
        {questions.length ? questions.map((question: QuestionWithAuthor, i: number) => (
            <Fragment key={question.id}>
                <QuestionListItem question={question}/>
                {i !== questions.length - 1 && (
                    <Divider/>
                )}
            </Fragment>
        )) : (
            <ListItem>
                <ListItemText primary="No questions to see here..."/>
            </ListItem>
        )}
    </List>
);

export default QuestionList;
