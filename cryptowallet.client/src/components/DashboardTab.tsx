import { Button, CircularProgress, Grid, Link, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Chart from "./Chart";
import HideSourceIcon from '@mui/icons-material/HideSource';
import { getEndpoint } from "../Helpers";

export function DashboardTab() {
    const [isLoading, setIsLoading] = useState(true);
    const [hasAssets, setHasAssets] = useState(false);

    useEffect(() => {
        const email = localStorage.getItem('email');
        const token = localStorage.getItem('jwtToken');

        // Send request
        fetch(getEndpoint() + `api/FileImport/hasFileImport?email=${email}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
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
                setHasAssets(true);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                setIsLoading(false);
            });
    }, []);

    const [fetchIntervalSeconds, setFetchIntervalSeconds] = useState<number>(60);

    const fetchRealtimeData = () => {
        const email = localStorage.getItem('email');
        const token = localStorage.getItem('jwtToken');

        fetch(getEndpoint() + `api/Asset/refresh/?email=${email}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errorResponse = await response.json();
                    throw new Error(errorResponse.message || 'An error occurred');
                }
                return response;
            })
            .then(() => {
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchRealtimeData();
    }, []);

    useEffect(() => {
        // Set up the interval
        const intervalId = setInterval(fetchRealtimeData, fetchIntervalSeconds * 1000);
        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, [fetchIntervalSeconds]);

    return isLoading ? (
        <CircularProgress />
    ) :
        (hasAssets ? (
            <Grid container spacing={3}>
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
                <Grid item xs={12} sx={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                }}>
                    <Typography variant="body2" sx={{ marginRight: 2 }}>
                        Refresh interval: {fetchIntervalSeconds < 60 ?
                            `${fetchIntervalSeconds} sec` : `${fetchIntervalSeconds / 60} min`}
                    </Typography>
                    <Button onClick={() => setFetchIntervalSeconds(15)}>
                        15 sec
                    </Button>
                    <Button onClick={() => setFetchIntervalSeconds(30)}>
                        30 sec
                    </Button>
                    <Button onClick={() => setFetchIntervalSeconds(60)}>
                        1 min
                    </Button>
                    <Button onClick={() => setFetchIntervalSeconds(60 * 3)}>
                        3 min
                    </Button>
                    <Button onClick={() => setFetchIntervalSeconds(60 * 5)}>
                        5 min
                    </Button>
                    <Button onClick={() => setFetchIntervalSeconds(60 * 10)}>
                        10 min
                    </Button>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'left' }}>
                    <Typography variant="h6">
                        Initial portfolio value: $10
                    </Typography>
                    <Typography variant="h6">
                        Current portfolio value: $15 (+change%)
                    </Typography>
                </Grid>
            </Grid>
        ) : (
            <Grid item xs={12} sx={{ marginTop: 5 }} >
                <HideSourceIcon fontSize="large" />
                <Typography variant="body1" color="text.secondary" align="center" sx={{ marginTop: 2 }}>
                    No assets detected
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ marginTop: 2 }}>
                    <Link color="inherit" href="/dashboard/imports">
                        Import assets to get started
                    </Link>
                </Typography>
            </Grid>
        ));
}