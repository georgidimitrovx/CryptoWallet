import * as React from 'react';
import { getEndpoint, hasUserSession } from '../Helpers';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Avatar, Box, Button, Container, Grid, Link, Paper, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function SignInPage() {
    const [showPage, setShowPage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    let navigate = useNavigate();

    // Check if user already logged in
    useEffect(() => {
        if (!hasUserSession()) {
            setShowPage(true);
        } else {
            navigate('/');
        }
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const signInData = {
            Email: formData.get('email'),
            Password: formData.get('password'),
        };

        // Validate input data
        if (signInData.Email == "") {
            setErrorMessage("Email empty");
            return;
        }

        if (signInData.Password == "") {
            setErrorMessage("Password empty");
            return;
        }

        // Send request
        fetch(getEndpoint() + 'api/Auth/signIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signInData)
        })
            .then(response => {
                if (!response.ok) {
                    setErrorMessage("Bad network response");
                    throw new Error('Bad network response');
                }
                return response.json();
            })
            .then((data) => {
                localStorage.setItem('email', data.email);
                localStorage.setItem('jwtToken', data.token);
                localStorage.setItem('jwtTokenExpiry', data.tokenExpiry);
                navigate('/dashboard');
            })
            .catch((error) => {
                console.error('Error fetching data: ', error);
                setErrorMessage(error.Message);
            })
    };

    return !showPage ? null : (
        <Container component="main" maxWidth="md" sx={{ marginTop: 6 }}>
            <Grid container sx={{ height: '80vh' }}>
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(https://source.unsplash.com/random?crypto)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 4,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5" sx={{ marginTop: 5 }}>
                            Sign In
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
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
                            />
                            {/*<FormControlLabel*/}
                            {/*    control={<Checkbox value="remember" color="primary" />}*/}
                            {/*    label="Remember me"*/}
                            {/*/>*/}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={() => setErrorMessage("")}
                            >
                                Sign In
                            </Button>
                            {errorMessage == "" ? null : (
                                <Typography variant="body1" sx={{ color: 'red', marginBottom: 2 }}>
                                    {errorMessage}
                                </Typography>
                            )}
                            <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Grid item>
                                    <Link href="/signUp" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }} >
                                <Link color="inherit" href="/">
                                    Crypto Wallet
                                </Link>{' '}
                                {new Date().getFullYear()}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}