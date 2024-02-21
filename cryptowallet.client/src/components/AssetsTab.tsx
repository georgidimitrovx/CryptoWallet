import { CircularProgress, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { getEndpoint } from "../Helpers";

interface LoadedAsset {
    ticker: string,
    purchasedOn: Date,
    amount: number,
    price: number,
}

export function AssetsTab() {
    const [isLoading, setIsLoading] = useState(true);
    const [loadedAssets, setLoadedAssets] = useState<LoadedAsset[]>();
    //const [hasAssets, setHasAssets] = React.useState(true);

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
                setLoadedAssets(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                setIsLoading(false);
            });

    }, []);

    return isLoading ? (
        <CircularProgress />
    ) : (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Ticker</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Purchased On</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loadedAssets ? loadedAssets.map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.ticker}
                            </TableCell>
                            <TableCell align="right">{row.amount}</TableCell>
                            <TableCell align="right">{row.price}</TableCell>
                            <TableCell align="right">{new Date(row.purchasedOn).toUTCString()}</TableCell>
                        </TableRow>
                    )) : null}
                </TableBody>
            </Table>
        </TableContainer>);
}