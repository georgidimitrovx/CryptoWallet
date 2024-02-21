import { CircularProgress, Container, CssBaseline, Typography } from '@mui/material';
import AppAppBar from '../components/AppAppBar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { getEndpoint, hasUserSession } from '../Helpers';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const [showPage, setShowPage] = useState(false);
    let navigate = useNavigate();

    // Check if user already logged in
    useEffect(() => {
        if (!hasUserSession()) {
            setShowPage(true);
        } else {
            navigate('/dashboard');
        }
    }, []);

    const [toggleHeartbeat, setIsHeartbeat] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Send request
        fetch(getEndpoint() + `api/Heartbeat`, {
            method: 'GET',
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errorResponse = await response.json();
                    throw new Error(errorResponse.message || 'An error occurred');
                }
                return response;
            })
            .then(() => {
                //console.log(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                setIsHeartbeat(!toggleHeartbeat);
            });
    }, [toggleHeartbeat]);

    return isLoading ? (
        <Container sx={{ marginTop: 5 }}>
            <Typography>
                Waking up database. Please wait...
            </Typography>
            <CircularProgress sx={{ marginTop: 5 }} />
        </Container>
    ) : (
        showPage ? <>
            <CssBaseline />
            <AppAppBar />
            <Hero />
            <Footer description={''} title={''} />
        </> : null
    );
}