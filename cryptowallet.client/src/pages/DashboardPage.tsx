import * as React from 'react';
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
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Chart from '../components/Chart';
import { Button, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
//import Deposits from './Deposits';
//import Orders from './Orders';
import CryptoWalletLogo from '../assets/cryptoWalletLogo.svg'
import { useEffect, useState } from 'react';
import { hasUserSession } from '../Helpers';
import HideSourceIcon from '@mui/icons-material/HideSource';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import { ImportsTab } from '../components/ImportsTab';
import { AssetsTab } from '../components/AssetsTab';

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
    const [selectedTab, setSelectedTab] = React.useState("Dashboard");
    const navigate = useNavigate();

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

    const [hasAssets, setHasAssets] = React.useState(false);

    useEffect(() => {
        // todo load assets from srv
    }, []);

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
                        Dashboard
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
                    <ListItemButton onClick={() => setSelectedTab("Dashboard")}>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                    <ListItemButton onClick={() => setSelectedTab("Assets")}>
                        <ListItemIcon>
                            <CurrencyBitcoinIcon />
                        </ListItemIcon>
                        <ListItemText primary="Assets" />
                    </ListItemButton>
                    <ListItemButton onClick={() => setSelectedTab("Imports")}>
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
                    {selectedTab == "Dashboard" ? (
                        <Grid container spacing={3}>
                            {/* Chart */}
                            {hasAssets ? (
                                <Grid item xs={12}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: 480,
                                        }}
                                    >
                                        <Chart />
                                    </Paper>
                                </Grid>
                            ) : (
                                <Grid item xs={12} sx={{ marginTop: 5 }} >
                                    <HideSourceIcon fontSize="large" />
                                    <Typography variant="body1" color="text.secondary" align="center" sx={{ marginTop: 2 }}>
                                        No assets detected
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" align="center" sx={{ marginTop: 2 }}>
                                        <Link color="inherit" onClick={() => setSelectedTab("Imports")} href="#">
                                            Import assets to get started
                                        </Link>{' '}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    )
                        : selectedTab == "Assets" ? <AssetsTab />
                            : selectedTab == "Imports" ? <ImportsTab />
                                : null}
                </Container>
                <Copyright sx={{ pt: 4, marginBottom: 5 }} />
            </Box>
        </Box>
    ) : null;
}