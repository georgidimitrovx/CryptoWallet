import { CircularProgress, Grid, Link, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Chart from "./Chart";
import HideSourceIcon from '@mui/icons-material/HideSource';
import { getEndpoint } from "../Helpers";

export function DashboardTab() {
    const [isLoading, setIsLoading] = useState(true);
    const [hasAssets, setHasAssets] = useState(false);

    useEffect(() => {
        // todo load assets from srv

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

    return isLoading ? (
        <CircularProgress />
    ) :
        (
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
                            <Link color="inherit" href="/dashboard/imports">
                                Import assets to get started
                            </Link>
                        </Typography>
                    </Grid>
                )}
            </Grid>);
}