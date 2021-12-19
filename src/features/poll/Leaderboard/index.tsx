import {useAppSelector} from "../../../app/hooks";
import {leaderSelector, userSelector} from "../../user/userSlice";
import {UserWithScore} from "../../../types";
import {authUserSelector} from "../../auth/authSlice";
import {Avatar, List, ListItemAvatar, ListItem, ListItemText} from "@mui/material";
import React from "react";
import CircularIndeterminate from "../../../layout/CircularIndeterminate";
import Typography from "@mui/material/Typography";

const Leaderboard = () => {
    const leaders = useAppSelector(leaderSelector);
    const {status} = useAppSelector(userSelector);
    const authUser = useAppSelector(authUserSelector);

    if (status === 'loading') {
        return <CircularIndeterminate/>;
    }

    return (
        <>
            <Typography variant="h2" component="div" gutterBottom>
                Leaderboard
            </Typography>
            <List>
                {leaders.map((user: UserWithScore) => {
                    let style: { [key: string]: string } = {};

                    if (user.id === authUser!.id) {
                        style['backgroundColor'] = '#81D4FA';
                    }

                    return (
                        <ListItem key={user.id} alignItems="flex-start" style={style}>
                            <ListItemAvatar>
                                <Avatar alt="Remy Sharp" src={user.avatarURL || ''}/>
                            </ListItemAvatar>
                            <ListItemText
                                primary={user.name}
                                secondary={(
                                    <>
                                        {`Current score: ${user.score}`}<br/>
                                        {`Asked: ${user.questions.length}`}<br/>
                                        {`Answered: ${Object.keys(user.answers).length}`}
                                    </>
                                )}
                            />
                        </ListItem>
                    )
                })}
            </List>
        </>
    )
};

export default Leaderboard;
