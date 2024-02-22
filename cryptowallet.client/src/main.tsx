import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { ThemeProvider, createTheme } from '@mui/material';

const darkTheme = createTheme({
    palette: {
        mode: 'dark', // Switches the theme to dark mode
    },
    components: {
        MuiBackdrop: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Adjust the alpha to make it less dark
                },
            },
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    //<React.StrictMode>
        <ThemeProvider theme={darkTheme}>
            <App />
        </ThemeProvider>
    //</React.StrictMode>,
)
