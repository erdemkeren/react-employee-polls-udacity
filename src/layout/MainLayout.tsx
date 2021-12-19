import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import {drawerWidth} from "../utils/constants";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {authUserSelector, logout} from "../features/auth/authSlice";
import {CreateSharp, Leaderboard, MarkEmailRead, MarkEmailUnread} from "@mui/icons-material";
import {Menu} from '@mui/material';
import {MenuItem} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import {ReactNode} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import CircularIndeterminate from "./CircularIndeterminate";
import Typography from "@mui/material/Typography";

type MainLayoutProps = {
    children: ReactNode;
}

export default function MainLayout({children}: MainLayoutProps) {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const authUser = useAppSelector(authUserSelector);
    const {pathname} = useLocation();

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    if (!authUser) {
        return <CircularIndeterminate/>;
    }

    const drawer = (
        <div>
            <Toolbar style={{justifyContent: "center"}}>
                <img
                    alt="Employee Polls"
                    src="/logo.jpg"
                    onClick={() => navigate('/')}
                    style={{cursor: 'pointer'}}
                />
            </Toolbar>
            <Divider/>
            <List>
                <ListItem
                    selected={pathname === '/leaderboard'}
                    button onClick={() => {
                    navigate('/leaderboard')
                }}
                >
                    <ListItemIcon>
                        <Leaderboard/>
                    </ListItemIcon>
                    <ListItemText primary="Leaderboard"/>
                </ListItem>
                <ListItem
                    selected={pathname === '/'}
                    button onClick={() => {
                    navigate('/')
                }}
                >
                    <ListItemIcon>
                        <MarkEmailRead/>
                    </ListItemIcon>
                    <ListItemText primary="New Questions"/>
                </ListItem>
                <ListItem
                    selected={pathname === '/answered'}
                    button onClick={() => {
                    navigate('/answered')
                }}
                >
                    <ListItemIcon>
                        <MarkEmailUnread/>
                    </ListItemIcon>
                    <ListItemText primary="Answered Questions"/>
                </ListItem>
                <ListItem
                    selected={pathname === '/add'}
                    button onClick={() => {
                    navigate('/add')
                }}
                >
                    <ListItemIcon>
                        <CreateSharp/>
                    </ListItemIcon>
                    <ListItemText primary="Add Question"/>
                </ListItem>
            </List>
            <Divider/>
            <List>
                <ListItem button onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon/>
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <Typography variant="body1" display="block" gutterBottom>
                                Logout <b>{authUser!.name}</b>
                            </Typography>
                        }/>
                </ListItem>
            </List>
        </div>
    );

    const container = document.body;

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar
                position="fixed"
                sx={{
                    width: {sm: `calc(100% - ${drawerWidth}px)`},
                    ml: {sm: `${drawerWidth}px`},
                }}
            >
                <Toolbar>
                    <Box sx={{flexGrow: 1, display: 'flex'}}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{mr: 2, display: {sm: 'none'}}}
                        >
                            <MenuIcon/>
                        </IconButton>
                    </Box>

                    <Box sx={{flexGrow: 0, display: 'flex'}}>
                        <div>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenUserMenu}
                                color="inherit"
                            >
                                <Avatar
                                    alt={authUser!.name || undefined}
                                    src={authUser!.avatarURL || undefined}
                                />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem onClick={handleLogout}>
                                    Logout&nbsp;<b>{authUser!.name}</b>
                                </MenuItem>
                            </Menu>
                        </div>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
                aria-label="mailbox folders"
            >
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: {xs: 'block', sm: 'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: {xs: 'none', sm: 'block'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{flexGrow: 1, p: 3, width: {sm: `calc(100% - ${drawerWidth}px)`}}}
            >
                <Toolbar/>
                {children}
            </Box>
        </Box>
    );
}
