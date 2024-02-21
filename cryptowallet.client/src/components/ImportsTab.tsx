import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { getEndpoint } from "../Helpers";

interface LoadedFile {
    name: string,
    size: number,
    uploadTime: string
    fileText: string
}

export function ImportsTab() {
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");
    const [loadedFiles, setLoadedFiles] = useState<LoadedFile[]>();

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogText, setDialogText] = useState("");

    useEffect(() => {
        const email = localStorage.getItem('email');
        const token = localStorage.getItem('jwtToken');

        // Send request
        fetch(getEndpoint() + `api/FileImport/getAllByEmail?email=${email}`, {
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
                //console.log(data);
                setLoadedFiles(data);
                setIsLoadingHistory(false);
            })
            .catch(error => {
                console.error(error);
                setIsLoadingHistory(false);
            });
    }, [isUploading]);

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        // todo make loading
        setIsUploading(true);
        setUploadMessage("Importing...");

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
            .then(async (response) => {
                if (!response.ok) {
                    console.error(response);
                    const errorResponse = await response.json();
                    throw new Error(errorResponse.message || 'An error occurred');
                }
                return response.json();
            })
            .then(data => {
                setIsUploading(false);
                setUploadMessage(data.message);
            })
            .catch(error => {
                console.error(error);
                setIsUploading(false);
                setUploadMessage(`Error importing file: ${error.message}`);
            });
    };

    const handleClickOpenDialog = (title: string, text: string) => {
        setDialogTitle(title);
        setDialogText(text);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return <Grid container spacing={3}  >
        <Grid item xs={12}>
            <Typography variant="h6" sx={{ textAlign: 'left' }}>
                Import file with assets
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
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
                {uploadMessage != "" ? (
                    <Typography variant="body2" sx={{ textAlign: 'left', marginLeft: 2 }}>
                        {uploadMessage}
                    </Typography>
                ) : null}
            </Box>
            <Typography variant="body2" sx={{ textAlign: 'left', marginTop: 2, color: 'yellow' }}>
                Warning: This action will delete all current assets in portfolio.
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <Typography variant="h6" sx={{ textAlign: 'left' }}>
                History
            </Typography>
            {isLoadingHistory ? (<CircularProgress />) : (
                <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>File name</TableCell>
                                <TableCell align="right">Size (Bytes)</TableCell>
                                <TableCell align="right">Upload time</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loadedFiles ? loadedFiles.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.size}</TableCell>
                                    <TableCell align="right">{row.uploadTime}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            type="button"
                                            variant="contained"
                                            onClick={() => handleClickOpenDialog(row.name, row.fileText)}
                                        >
                                            View
                                        </Button>
                                        <Dialog
                                            open={openDialog}
                                            onClose={handleCloseDialog}
                                        >
                                            <DialogTitle>{dialogTitle}</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description"
                                                    style={{ whiteSpace: 'pre-wrap' }}>
                                                    {dialogText}
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleCloseDialog}>Close</Button>
                                            </DialogActions>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            )) : null}
                        </TableBody>
                    </Table>
                </TableContainer>)}
        </Grid>
    </Grid>;
}