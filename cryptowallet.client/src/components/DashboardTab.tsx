import { Button, CircularProgress, Grid, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Chart from "./Chart";
import HideSourceIcon from '@mui/icons-material/HideSource';
import { getEndpoint, toLocaleFraction } from "../Helpers";

interface LoadedAsset {
    ticker: string,
    purchasedOn: Date,
    amount: number,
    price: number,
}

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

    const [loadedAssets, setLoadedAssets] = useState<LoadedAsset[][]>([]);
    const [initialAssets, setInitialAssets] = useState<LoadedAsset[]>([]);

    const appendLoadedAssets = (newAssetGroup: LoadedAsset[]) => {
        setLoadedAssets((prevLoadedAssets) => [
            ...(prevLoadedAssets || []),
            newAssetGroup,
        ]);
    };

    // Fetch initial assets
    useEffect(() => {
        const email = localStorage.getItem('email');
        const token = localStorage.getItem('jwtToken');

        // Send request
        fetch(getEndpoint() + `api/Asset?email=${email}`, {
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
                return response.json();
            })
            .then(data => {
                setInitialAssets(data);
                appendLoadedAssets(data);
                //setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                //setIsLoading(false);
            });

    }, []);

    const [fetchIntervalSeconds, setFetchIntervalSeconds] = useState<number>(60);

    const fetchRealtimeData = () => {
        const email = localStorage.getItem('email');
        const token = localStorage.getItem('jwtToken');

        // Fetch new prices from extrnal api
        fetch(getEndpoint() + `api/Asset/getRealtimeAssets/?email=${email}`, {
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
                return response.json();
            })
            .then(data => {
                appendLoadedAssets(data);
                //console.log(realtimeAssets);
                //setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                //setIsLoading(false);
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


    const calculateAssetsValueNumber = (assets: LoadedAsset[]) => {
        var value = 0.0;
        for (var i = 0; i < assets.length; i++) {
            value += assets[i].amount * assets[i].price;
        }
        return value;
    }

    const calculateAssetsValue = (assets: LoadedAsset[]) => {
        return calculateAssetsValueNumber(assets)
            .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    const getAssetsChangePercentage = (assets: LoadedAsset[]) => {
        if (!initialAssets)
            return 0;

        var initialValue = parseInt(calculateAssetsValue(initialAssets));
        var currentValue = parseInt(calculateAssetsValue(assets));
        var resultNumber = ((currentValue - initialValue) / initialValue) * 100;
        var resultStr = resultNumber.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        return resultNumber > 0 ? "+" + resultStr : resultStr;
    };

    const getChangePercentageNumber = (asset: LoadedAsset) => {
        if (!initialAssets)
            return 0;

        var initialValue = 0.0;
        for (var initialAsset of initialAssets) {
            if (initialAsset.ticker == asset.ticker) {
                initialValue = initialAsset.amount * initialAsset.price;
            }
        }

        var currentValue = asset.amount * asset.price;
        var resultNumber = ((currentValue - initialValue) / initialValue) * 100;
        return resultNumber;
    }

    const getChangePercentage = (asset: LoadedAsset) => {
        var resultNumber = getChangePercentageNumber(asset);
        var resultStr = resultNumber.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        return resultNumber > 0 ? "+" + resultStr : resultStr;
    }

    const formatDateTime = (date: Date) => {
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2); // Months are 0-indexed, add leading zero
        const day = (`0${date.getDate()}`).slice(-2);
        const hours = (`0${date.getHours()}`).slice(-2);
        const minutes = (`0${date.getMinutes()}`).slice(-2);
        const seconds = (`0${date.getSeconds()}`).slice(-2);

        return `${year}${month}${day}_${hours}${minutes}${seconds}`;
    };

    const exportToCSV = (data: LoadedAsset[][]) => {
        // Convert 2D array to CSV format
        let csvContent = "";// "data:text/csv;charset=utf-8,";

        // Add column headers (optional)
        csvContent += "Time,Overall ($),Change (%)";

        data[0].forEach(asset => {
            csvContent += "," + asset.ticker + " ($)";
            csvContent += "," + asset.ticker + " (%)"
        });

        csvContent += "\n";

        data.forEach(row => {
            csvContent += new Date(row[0].purchasedOn).toISOString();
            csvContent += ",";
            csvContent += calculateAssetsValueNumber(row);
            csvContent += ",";
            csvContent += getAssetsChangePercentage(row);

            row.forEach(asset => {
                csvContent += ",";
                csvContent += asset.amount * asset.price
                csvContent += ",";
                csvContent += getChangePercentageNumber(asset);
            });

            csvContent += "\n";
        });

        // Create a Blob with CSV content
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        // Create an anchor tag and trigger download
        const link = document.createElement('a');
        link.setAttribute('href', url);
        const fileName = 'CryptoWalletReport_' + formatDateTime(new Date()) + '.csv';
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return isLoading ? (
        <CircularProgress />
    ) :
        (hasAssets ? (
            <>
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
                            <Chart assets={loadedAssets} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sx={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        display: 'flex',
                        marginBottom: 1
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
                        <Button variant="contained" onClick={() => exportToCSV(loadedAssets)}
                            sx={{ marginLeft: 2 }}>
                            Export
                        </Button>
                    </Grid>
                </Grid>
                <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Time</TableCell>
                                <TableCell>Overall</TableCell>
                                {loadedAssets && loadedAssets.length > 0 ?
                                    loadedAssets[0].map((asset, index) => (
                                        <TableCell key={index} align="right">{asset.ticker}</TableCell>
                                    ))
                                    : null}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loadedAssets && loadedAssets.length > 0 ?
                                loadedAssets.map((assetGroup, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {new Date(assetGroup[0].purchasedOn).toLocaleString()}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        ${calculateAssetsValue(assetGroup)}<br />
                                        ({getAssetsChangePercentage(assetGroup)}%)
                                    </TableCell>
                                    {assetGroup.map((asset, index2) => (
                                        <TableCell key={index2} align="right">
                                            ${toLocaleFraction(asset.amount * asset.price)}<br />
                                            ({getChangePercentage(asset)}%)
                                        </TableCell>
                                    ))}
                                </TableRow>
                            )) : null}
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
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