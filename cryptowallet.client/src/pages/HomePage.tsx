import { CssBaseline } from '@mui/material';
import AppAppBar from '../components/AppAppBar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { hasUserSession } from '../Helpers';
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

    return showPage ? <>
        <CssBaseline />
        <AppAppBar />
        <Hero />
        <Footer description={''} title={''} />
    </> : null;
}