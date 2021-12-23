import * as React from 'react';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useAppSelector, useAppDispatch} from '../../../app/hooks';
import {loginAsync, authSelector} from "../authSlice";

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://erdemkeren.com/">
                Hilmi Erdem Keren
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export default function SignIn() {
    const auth = useAppSelector(authSelector)
    const dispatch = useAppDispatch();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const data = new FormData(event.currentTarget);
        const username = data.get('username');
        const password = data.get('password');

        if (typeof username !== 'string' || typeof password !== 'string') {
            return;
        }

        event.preventDefault();
        dispatch(loginAsync({username, password}));
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            defaultValue="erdemkeren"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            defaultValue="pwd2022"
                        />
                        {auth.status === 'failed' && (
                            <Alert severity="warning">
                                The authentication was not successful.
                            </Alert>
                        )}
                        <LoadingButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            loading={auth.status === 'loading'}
                        >
                            Sign In
                        </LoadingButton>
                    </Box>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </ThemeProvider>
    );
}
