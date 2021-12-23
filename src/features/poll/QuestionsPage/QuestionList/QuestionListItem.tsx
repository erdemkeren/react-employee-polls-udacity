import {QuestionWithAuthor} from "../../../../types";
import {ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import React from "react";
import {useNavigate, generatePath} from "react-router-dom";

type QuestionListItemProps = {
    question: QuestionWithAuthor,
};

const QuestionListItem = ({question}: QuestionListItemProps) => {
    const navigate = useNavigate();

    const handleClick = () => navigate(
        generatePath('/questions/:question', {question: question.id})
    );

    return (
        <ListItem alignItems="flex-start" button onClick={handleClick}>
            <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={question.authorObject.avatarURL || ''}/>
            </ListItemAvatar>
            <ListItemText
                primary={`Would you rather ${question.optionOne.text} or ${question.optionTwo.text}`}
                secondary={
                    <>
                        <Typography
                            sx={{display: 'inline'}}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            {question.authorObject.name} asked
                        </Typography>
                        &nbsp;on&nbsp;
                        {(new Date(question.timestamp).toLocaleString())}
                    </>
                }
            />
        </ListItem>
    );
}

export default QuestionListItem;
