import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Button, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import {  Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import CryptoWalletLogo from '../assets/cryptoWalletLogo.svg'
import { useEffect, useState } from 'react';
import { hasUserSession } from '../Helpers';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import { ImportsTab } from '../components/ImportsTab';
import { AssetsTab } from '../components/AssetsTab';
import { DashboardTab } from '../components/DashboardTab';

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            <Link color="inherit" href="/">
                Crypto Wallet
            </Link>{' '}
            {new Date().getFullYear()}
        </Typography>
    );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

export default function DashboardPage() {
    const [showPage, setShowPage] = useState(false);
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleToolbarOnResize = () => {
        setOpen(window.innerWidth > 600);
    };

    // Check if user already logged in
    useEffect(() => {
        if (hasUserSession()) {
            setShowPage(true);
            toggleToolbarOnResize();
        } else {
            navigate('/');
        }
    }, []);

    // Add event listener for window resize
    window.addEventListener('resize', toggleToolbarOnResize);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const onSignOut = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('jwtTokenExpiry');
        navigate('/');
    };

    const getRouteName = () => {
        var path = location.pathname.split('/');
        var res = "";
        for (var i = 0; i < path.length; i++) {
            res += path[i].charAt(0).toUpperCase() + path[i].substring(1);
            if (i > 0 && i < path.length - 1)
                res += " / ";
        }

        return res;
    }

    return showPage ? (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="absolute" open={open}>
                <Toolbar
                    sx={{
                        pr: '24px', // keep right padding when drawer closed
                    }}
                >
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: '36px',
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        sx={{ flexGrow: 1 }}
                    >
                        {getRouteName()}
                    </Typography>
                    {/*<IconButton color="inherit">*/}
                    {/*    <Badge badgeContent={4} color="secondary">*/}
                    {/*        <NotificationsIcon />*/}
                    {/*    </Badge>*/}
                    {/*</IconButton>*/}
                    <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        component="a"
                        onClick={onSignOut}
                    >
                        Sign out
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: [1],
                    }}
                >
                    <img src={CryptoWalletLogo} width="80%" />
                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List component="nav">
                    <ListItemButton href="/dashboard">
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                    <ListItemButton href="/dashboard/assets">
                        <ListItemIcon>
                            <CurrencyBitcoinIcon />
                        </ListItemIcon>
                        <ListItemText primary="Assets" />
                    </ListItemButton>
                    <ListItemButton href="/dashboard/imports">
                        <ListItemIcon>
                            <CloudUploadIcon />
                        </ListItemIcon>
                        <ListItemText primary="Imports" />
                    </ListItemButton>
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Routes>
                        <Route path="/" element={<DashboardTab />} />
                        <Route path="/assets" element={<AssetsTab />} />
                        <Route path="/imports" element={<ImportsTab />} />
                    </Routes>
                </Container>
                <Copyright sx={{ pt: 4, marginBottom: 5 }} />
            </Box>
        </Box>
    ) : null;
}