import { CssBaseline, createTheme, ThemeProvider } from '@mui/material';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ExperimentConfig from './components/ExperimentConfig';
import ExperimentReport from './components/ExperimentReport';
import ExperimentReports from './components/ExperimentReports';
import ExperimentCompare from './components/ExperimentCompare';
import DashboardMetrics from './components/DashboardMetrics';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#f8f9fa',
    },
    success: {
      main: '#34a853',
    },
    error: {
      main: '#ea4335',
    },
    warning: {
      main: '#fbbc04',
    },
    info: {
      main: '#4285f4',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/experiments" element={<ExperimentReports />} />
            <Route path="/experiments/new" element={<ExperimentConfig />} />
            <Route path="/experiments/compare" element={<ExperimentCompare />} />
            <Route path="/experiments/:id" element={<ExperimentReport />} />
            <Route path="/metrics" element={<DashboardMetrics />} />
            <Route path="/analysis" element={<DashboardMetrics />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App
