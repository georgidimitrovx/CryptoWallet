import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { getEndpoint } from "../Helpers";

function createData(
    fileName: string,
    size: number,
    uploadTime: string,
) {
    return { fileName, size, uploadTime };
}

export function ImportsTab() {
    const [isUploading, setIsUploading] = useState(false);
    //const [hasAssets, setHasAssets] = React.useState(true);

    //useEffect(() => {
    //    // todo load assets from srv
    //}, []);

    const rows = [
        createData('my-assets.txt', 1.5, "2021/10/10 10:21:22"),
        createData('my-new-assets.txt', 0.1, "2022/10/10 10:21:22"),
        createData('assets-of-a-friend.txt', 2.8, "2020/10/10 10:21:22"),
        createData('old-assets.txt', 5.1, "2023/10/10 10:21:22"),
        createData('crypto-portfolio-20221010.txt', 102, "2022/10/10 10:21:22"),
    ];

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        // todo make loading
        setIsUploading(true);

        if (!e.target.files) {
            return;
        }

        const email = localStorage.getItem('email');
        if (email == null)
            return;

        const token = localStorage.getItem('jwtToken');

        const formData = new FormData();
        formData.append("Email", email);
        formData.append("File", e.target.files[0]);

        // Send request
        fetch(getEndpoint() + 'api/FileImport/add', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        })
            .then(data => {
                console.log(data);
                setIsUploading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setIsUploading(false);
            });
    };

    return <Grid container spacing={3}  >
        <Grid item xs={12}>
            <Typography variant="h6" sx={{ textAlign: 'left' }}>
                Import file with assets
            </Typography>
            <Box sx={{ display: 'flex' }}>
                {/*<Button*/}
                {/*    type="button"*/}
                {/*    variant="contained"*/}
                {/*    sx={{ mt: 2 }}*/}
                {/*>*/}
                {/*    Select file*/}
                {/*</Button>*/}
                <Button
                    variant="contained"
                    component="label"
                    disabled={isUploading}
                >
                    Upload File
                    <input
                        accept=".txt"
                        type="file"
                        hidden
                        onChange={handleFileUpload}
                    />
                </Button>
            </Box>
            <Typography variant="body1" sx={{ textAlign: 'left', marginTop: 2, color: 'yellow' }}>
                Warning: This action will delete all current assets in portfolio.
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <Typography variant="h6" sx={{ textAlign: 'left' }}>
                History
            </Typography>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>File name</TableCell>
                            <TableCell align="right">Size (KB)</TableCell>
                            <TableCell align="right">Upload time</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.fileName}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.fileName}
                                </TableCell>
                                <TableCell align="right">{row.size}</TableCell>
                                <TableCell align="right">{row.uploadTime}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        type="button"
                                        variant="contained"
                                    >
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    </Grid >;
}