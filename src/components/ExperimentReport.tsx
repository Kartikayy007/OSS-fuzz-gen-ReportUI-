import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  IconButton,
  Link as MuiLink,
  LinearProgress,
  Alert,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  Download as DownloadIcon,
  Share as ShareIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  ArrowDropDown as ArrowDropDownIcon,
  AccessTime as AccessTimeIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Mock data for experiment
const experimentData = {
  id: 'Experiment #1248',
  name: 'libxml2 Fuzzing (libFuzzer)',
  startTime: '2024-03-25T08:00:00Z',
  endTime: '2024-04-01T08:00:00Z',
  status: 'Completed',
  project: 'libxml2',
  fuzzer: 'libFuzzer',
  buildArgs: '-fsanitize=address -O1 -fno-omit-frame-pointer',
  runArgs: '-max_len=16384 -rss_limit_mb=2048',
  machines: [
    { id: 'vm-001', machineType: 'e2-standard-2', status: 'Terminated' },
    { id: 'vm-002', machineType: 'e2-standard-2', status: 'Terminated' }
  ],
  summary: {
    totalExecutions: 1842000000,
    edgeCoverage: 84.2,
    functionCoverage: 79.6,
    branchCoverage: 71.3,
    totalCrashes: 10,
    uniqueCrashes: 4,
    timeoutCrashes: 2,
    oomCrashes: 1,
    executionsPerSecond: 18420,
    peakRss: 1024,
    totalCost: 42.56
  }
};

// Coverage over time
const coverageTimeData = [
  { time: '1d', edgeCoverage: 45.2, functionCoverage: 39.8, branchCoverage: 32.5 },
  { time: '2d', edgeCoverage: 61.7, functionCoverage: 56.4, branchCoverage: 48.1 },
  { time: '3d', edgeCoverage: 72.3, functionCoverage: 65.9, branchCoverage: 57.2 },
  { time: '4d', edgeCoverage: 77.8, functionCoverage: 70.5, branchCoverage: 62.4 },
  { time: '5d', edgeCoverage: 81.1, functionCoverage: 74.2, branchCoverage: 66.8 },
  { time: '6d', edgeCoverage: 83.0, functionCoverage: 77.4, branchCoverage: 69.5 },
  { time: '7d', edgeCoverage: 84.2, functionCoverage: 79.6, branchCoverage: 71.3 }
];

// Executions per second over time
const execSpeedData = [
  { time: '1d', execPerSec: 19200 },
  { time: '2d', execPerSec: 19100 },
  { time: '3d', execPerSec: 18900 },
  { time: '4d', execPerSec: 18700 },
  { time: '5d', execPerSec: 18500 },
  { time: '6d', execPerSec: 18450 },
  { time: '7d', execPerSec: 18420 }
];

// Crash data with discovery time
const crashesData = [
  { id: 'crash-001', type: 'Heap Buffer Overflow', severity: 'High', status: 'Verified', discovered: '1d 8h', file: 'parser.c', line: 1024, reproducer: 'poc_001.xml' },
  { id: 'crash-002', type: 'Use After Free', severity: 'Critical', status: 'Verified', discovered: '2d 3h', file: 'xmlreader.c', line: 512, reproducer: 'poc_002.xml' },
  { id: 'crash-003', type: 'Stack Buffer Overflow', severity: 'Medium', status: 'Verified', discovered: '3d 5h', file: 'xmlsave.c', line: 328, reproducer: 'poc_003.xml' },
  { id: 'crash-004', type: 'Null Pointer Dereference', severity: 'Low', status: 'Needs Triage', discovered: '5d 12h', file: 'xmlschemas.c', line: 876, reproducer: 'poc_004.xml' },
  { id: 'crash-005', type: 'Stack Buffer Overflow', severity: 'Medium', status: 'Duplicate', discovered: '6d 2h', file: 'xmlsave.c', line: 328, reproducer: 'poc_005.xml' },
  { id: 'crash-006', type: 'Timeout', severity: 'Undefined', status: 'Needs Triage', discovered: '2d 9h', file: 'xpath.c', line: 432, reproducer: 'poc_006.xml' },
  { id: 'crash-007', type: 'Timeout', severity: 'Undefined', status: 'False Positive', discovered: '4d 10h', file: 'c14n.c', line: 216, reproducer: 'poc_007.xml' },
  { id: 'crash-008', type: 'Out of Memory', severity: 'Low', status: 'Needs Triage', discovered: '1d 18h', file: 'catalog.c', line: 652, reproducer: 'poc_008.xml' },
  { id: 'crash-009', type: 'Use After Free', severity: 'Critical', status: 'Duplicate', discovered: '6d 15h', file: 'xmlreader.c', line: 515, reproducer: 'poc_009.xml' },
  { id: 'crash-010', type: 'Integer Overflow', severity: 'Low', status: 'Verified', discovered: '4d 22h', file: 'xmlstring.c', line: 198, reproducer: 'poc_010.xml' }
];

// Add custom focus outline styles to ensure visible focus indicators with sufficient contrast
const focusOutlineStyle = {
  outline: '2px solid #2563eb',
  outlineOffset: '2px',
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`experiment-tabpanel-${index}`}
      aria-labelledby={`experiment-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ExperimentReport() {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState<string | false>('coverageSection');
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [configSearchQuery, setConfigSearchQuery] = useState('');
  const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([]);
  const [coverageFilter, setCoverageFilter] = useState<string | null>(null);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Keyboard shortcut for accordion sections
  const handleKeyDown = (panel: string) => (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setExpanded(expanded === panel ? false : panel);
    }
  };

  const handleGlobalSearchToggle = () => {
    setGlobalSearchOpen(!globalSearchOpen);
    if (!globalSearchOpen) {
      setGlobalSearchQuery('');
    }
  };

  const handleGlobalSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalSearchQuery(event.target.value);
  };

  const handleConfigSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfigSearchQuery(event.target.value);
  };

  const toggleQuickFilter = (filter: string) => {
    setActiveQuickFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };

  const clearQuickFilters = () => {
    setActiveQuickFilters([]);
    setSearchQuery('');
  };

  const setCoverageFocus = (focus: string | null) => {
    setCoverageFilter(focus);
  };

  const getGlobalSearchResults = () => {
    if (!globalSearchQuery.trim()) return [];

    const query = globalSearchQuery.toLowerCase();
    const results = [];

    // Search in crashes
    crashesData.forEach(crash => {
      if (
        crash.id.toLowerCase().includes(query) ||
        crash.type.toLowerCase().includes(query) ||
        crash.file.toLowerCase().includes(query) ||
        crash.severity.toLowerCase().includes(query)
      ) {
        results.push({
          type: 'crash',
          id: crash.id,
          title: `${crash.id}: ${crash.type}`,
          detail: `${crash.severity} issue in ${crash.file}:${crash.line}`,
          tabIndex: 1 // Crashes tab
        });
      }
    });

    // Search in configuration
    if (experimentData.buildArgs.toLowerCase().includes(query)) {
      results.push({
        type: 'config',
        id: 'build-args',
        title: 'Build Arguments',
        detail: experimentData.buildArgs,
        tabIndex: 3 // Configuration tab
      });
    }
    
    if (experimentData.runArgs.toLowerCase().includes(query)) {
      results.push({
        type: 'config',
        id: 'run-args',
        title: 'Run Arguments',
        detail: experimentData.runArgs,
        tabIndex: 3 // Configuration tab
      });
    }

    // Search in machines
    experimentData.machines.forEach(machine => {
      if (
        machine.id.toLowerCase().includes(query) ||
        machine.machineType.toLowerCase().includes(query) ||
        machine.status.toLowerCase().includes(query)
      ) {
        results.push({
          type: 'machine',
          id: machine.id,
          title: `Machine: ${machine.id}`,
          detail: `Type: ${machine.machineType}, Status: ${machine.status}`,
          tabIndex: 3 // Configuration tab
        });
      }
    });

    // Search in coverage data
    const foundCoverageData = coverageTimeData.find(data => 
      data.time.toLowerCase().includes(query)
    );
    
    if (foundCoverageData) {
      results.push({
        type: 'coverage',
        id: `coverage-${foundCoverageData.time}`,
        title: `Coverage at day ${foundCoverageData.time}`,
        detail: `Edge: ${foundCoverageData.edgeCoverage}%, Function: ${foundCoverageData.functionCoverage}%, Branch: ${foundCoverageData.branchCoverage}%`,
        tabIndex: 2 // Coverage tab
      });
    }

    return results;
  };

  const filteredMachines = experimentData.machines.filter(machine => {
    if (!configSearchQuery) return true;
    const query = configSearchQuery.toLowerCase();
    
    return (
      machine.id.toLowerCase().includes(query) ||
      machine.machineType.toLowerCase().includes(query) ||
      machine.status.toLowerCase().includes(query)
    );
  });

  const getFilteredCrashes = () => {
    let filtered = crashesData;
    
    // Apply text search filter
    if (searchQuery) {
      filtered = filtered.filter(crash => 
        crash.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crash.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crash.file.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crash.severity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crash.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply quick filters
    if (activeQuickFilters.length > 0) {
      if (activeQuickFilters.includes('critical')) {
        filtered = filtered.filter(crash => crash.severity === 'Critical');
      }
      
      if (activeQuickFilters.includes('high')) {
        filtered = filtered.filter(crash => crash.severity === 'High');
      }
      
      if (activeQuickFilters.includes('verified')) {
        filtered = filtered.filter(crash => crash.status === 'Verified');
      }
      
      if (activeQuickFilters.includes('needsTriage')) {
        filtered = filtered.filter(crash => crash.status === 'Needs Triage');
      }
      
      if (activeQuickFilters.includes('latest')) {
        // Show only the most recent crashes (last 3 days)
        filtered = filtered.filter(crash => {
          const days = parseInt(crash.discovered.split('d')[0]);
          return days <= 3;
        });
      }
    }
    
    return filtered;
  };

  const filteredCrashes = getFilteredCrashes();

  // Calculate days from start to end
  const startDate = new Date(experimentData.startTime);
  const endDate = new Date(experimentData.endTime);
  const durationInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

  // Add coverage filtering function
  const getFilteredCoverageData = () => {
    if (!coverageFilter) return coverageTimeData;
    
    switch (coverageFilter) {
      case 'lowEdge':
        return coverageTimeData.filter(data => data.edgeCoverage < 70);
      case 'lowFunction':
        return coverageTimeData.filter(data => data.functionCoverage < 65);
      case 'lowBranch':
        return coverageTimeData.filter(data => data.branchCoverage < 60);
      case 'slowGrowth':
        // Find periods of slow growth (less than 5% improvement)
        return coverageTimeData.filter((data, index, array) => {
          if (index === 0) return false;
          const prevData = array[index - 1];
          return (data.edgeCoverage - prevData.edgeCoverage) < 5;
        });
      default:
        return coverageTimeData;
    }
  };

  const filteredCoverageData = getFilteredCoverageData();

  return (
    <Box 
      role="region" 
      aria-label="Experiment Report"
    >
      {/* Breadcrumbs */}
      <Box 
        sx={{ display: 'flex', p: 3, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}
        role="navigation"
        aria-label="Breadcrumb navigation"
      >
        <Typography sx={{ display: 'flex', alignItems: 'center' }}>
          <MuiLink 
            component={RouterLink} 
            to="/" 
            color="inherit" 
            sx={{ 
              mr: 1, 
              '&:focus-visible': focusOutlineStyle 
            }}
            aria-label="Go to Home page"
          >
            Home
          </MuiLink>
          <span aria-hidden="true">{' / '}</span>
          <MuiLink 
            component={RouterLink} 
            to="/experiments" 
            color="inherit" 
            sx={{ 
              mx: 1, 
              '&:focus-visible': focusOutlineStyle 
            }}
            aria-label="Go to Experiments page"
          >
            Experiments
          </MuiLink>
          <span aria-hidden="true">{' / '}</span>
          <MuiLink 
            component={RouterLink} 
            to={`/experiments/project/${experimentData.project}`} 
            color="inherit" 
            sx={{ 
              mx: 1, 
              '&:focus-visible': focusOutlineStyle 
            }}
            aria-label={`Go to ${experimentData.project} project page`}
          >
            {experimentData.project}
          </MuiLink>
          <span aria-hidden="true">{' / '}</span>
          <Typography color="textPrimary" sx={{ ml: 1 }}>
            {experimentData.id}
          </Typography>
        </Typography>
      </Box>
      
      {/* Report Header */}
      <Box 
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 3, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}
        role="banner"
      >
        <Box>
          <Typography variant="h4" gutterBottom component="h1">
            {experimentData.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Chip 
              label={experimentData.status} 
              color={experimentData.status === 'Completed' ? 'success' : 'primary'} 
              aria-label={`Status: ${experimentData.status}`}
            />
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} aria-hidden="true" /> 
              <span aria-label={`Experiment duration: ${durationInDays} days from ${new Date(experimentData.startTime).toLocaleDateString()} to ${new Date(experimentData.endTime).toLocaleDateString()}`}>
                {new Date(experimentData.startTime).toLocaleDateString()} - {new Date(experimentData.endTime).toLocaleDateString()} ({durationInDays} days)
              </span>
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            <span aria-label={`Project: ${experimentData.project}`}>Project: {experimentData.project}</span> | 
            <span aria-label={`Fuzzer: ${experimentData.fuzzer}`}> Fuzzer: {experimentData.fuzzer}</span> | 
            <span aria-label={`Instances: ${experimentData.machines.length}`}> Instances: {experimentData.machines.length}</span>
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            startIcon={<SearchIcon />} 
            variant="outlined"
            aria-label="Global Search"
            sx={{ '&:focus-visible': focusOutlineStyle }}
            onClick={handleGlobalSearchToggle}
          >
            Search
          </Button>
          <Button 
            startIcon={<DownloadIcon />} 
            variant="outlined"
            aria-label="Export Report"
            sx={{ '&:focus-visible': focusOutlineStyle }}
          >
            Export Report
          </Button>
          <Button 
            startIcon={<ShareIcon />} 
            variant="outlined"
            aria-label="Share Report"
            sx={{ '&:focus-visible': focusOutlineStyle }}
          >
            Share
          </Button>
        </Box>
      </Box>
      
      {/* Global Search Overlay */}
      {globalSearchOpen && (
        <Box 
          sx={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0,0,0,0.5)',
            zIndex: 1200,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            pt: 10
          }}
          onClick={handleGlobalSearchToggle}
          role="dialog"
          aria-label="Global search"
        >
          <Box 
            sx={{ 
              width: '80%', 
              maxWidth: 800, 
              bgcolor: 'background.paper', 
              borderRadius: 1,
              boxShadow: 3,
              overflow: 'hidden',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <SearchIcon sx={{ mr: 2, color: 'text.secondary' }} />
              <TextField
                fullWidth
                placeholder="Search across all experiment data..."
                variant="standard"
                value={globalSearchQuery}
                onChange={handleGlobalSearchChange}
                autoFocus
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: '1.1rem' }
                }}
                aria-label="Global search query"
              />
              <IconButton 
                onClick={handleGlobalSearchToggle} 
                aria-label="Close search"
                sx={{ '&:focus-visible': focusOutlineStyle }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Box sx={{ overflow: 'auto', flex: 1, p: 0 }}>
              {globalSearchQuery && getGlobalSearchResults().length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                  <Typography>No results found for "{globalSearchQuery}"</Typography>
                </Box>
              ) : (
                <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                  {getGlobalSearchResults().map((result) => (
                    <Box 
                      key={`${result.type}-${result.id}`}
                      component="li"
                      sx={{ 
                        p: 2, 
                        borderBottom: 1, 
                        borderColor: 'divider',
                        '&:hover': { bgcolor: 'action.hover' },
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setTabValue(result.tabIndex);
                        handleGlobalSearchToggle();
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Search result: ${result.title}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setTabValue(result.tabIndex);
                          handleGlobalSearchToggle();
                        }
                      }}
                    >
                      <Typography variant="subtitle1">{result.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {result.detail}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'primary.main' }}>
                        Go to {result.tabIndex === 1 ? 'Crashes' : result.tabIndex === 2 ? 'Coverage' : 'Configuration'} tab
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}

      {/* Summary Cards */}
      <Box sx={{ p: 3 }} role="region" aria-label="Summary metrics">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
          <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '240px' }}>
            <Paper sx={{ p: 2 }} role="group" aria-label="Total Executions">
              <Typography color="textSecondary" gutterBottom id="total-exec-label">
                Total Executions
              </Typography>
              <Typography variant="h5" component="div" aria-labelledby="total-exec-label">
                {(experimentData.summary.totalExecutions / 1000000).toFixed(2)}M
              </Typography>
              <Typography color="textSecondary" sx={{ fontSize: 14 }} aria-label={`${experimentData.summary.executionsPerSecond.toLocaleString()} executions per second`}>
                {experimentData.summary.executionsPerSecond.toLocaleString()} execs/sec
              </Typography>
            </Paper>
          </Box>
          
          <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '240px' }}>
            <Paper sx={{ p: 2 }}>
              <Typography color="textSecondary" gutterBottom>
                Edge Coverage
              </Typography>
              <Typography variant="h5" component="div">
                {experimentData.summary.edgeCoverage}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={experimentData.summary.edgeCoverage} 
                sx={{ mt: 1, mb: 1, height: 6, borderRadius: 3 }} 
              />
            </Paper>
          </Box>
          
          <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '240px' }}>
            <Paper sx={{ p: 2 }}>
              <Typography color="textSecondary" gutterBottom>
                Unique Crashes
              </Typography>
              <Typography variant="h5" component="div">
                {experimentData.summary.uniqueCrashes}
              </Typography>
              <Typography color="textSecondary" sx={{ fontSize: 14 }}>
                {experimentData.summary.totalCrashes} total crashes found
              </Typography>
            </Paper>
          </Box>
          
          <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '240px' }}>
            <Paper sx={{ p: 2 }}>
              <Typography color="textSecondary" gutterBottom>
                Total Cost
              </Typography>
              <Typography variant="h5" component="div">
                ${experimentData.summary.totalCost}
              </Typography>
              <Typography color="textSecondary" sx={{ fontSize: 14 }}>
                {experimentData.machines.length} instances × {durationInDays} days
              </Typography>
            </Paper>
          </Box>
          
          <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '240px' }}>
            <Paper sx={{ p: 2 }}>
              <Typography color="textSecondary" gutterBottom>
                Peak RSS
              </Typography>
              <Typography variant="h5" component="div">
                {experimentData.summary.peakRss} MB
              </Typography>
              <Typography color="textSecondary" sx={{ fontSize: 14 }}>
                Memory usage
              </Typography>
            </Paper>
          </Box>
          
          <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '240px' }}>
            <Paper sx={{ p: 2 }}>
              <Typography color="textSecondary" gutterBottom>
                Run Duration
              </Typography>
              <Typography variant="h5" component="div">
                {durationInDays} days
              </Typography>
              <Typography color="textSecondary" sx={{ fontSize: 14 }}>
                {new Date(experimentData.startTime).toLocaleDateString()} - {new Date(experimentData.endTime).toLocaleDateString()}
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
      
      {/* Tabs Navigation */}
      <Box sx={{ px: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="Experiment report sections"
            sx={{
              '& .MuiTab-root:focus-visible': focusOutlineStyle
            }}
          >
            <Tab 
              label="Overview" 
              id="experiment-tab-0" 
              aria-controls="experiment-tabpanel-0" 
              aria-selected={tabValue === 0}
            />
            <Tab 
              label="Crashes" 
              id="experiment-tab-1" 
              aria-controls="experiment-tabpanel-1" 
              aria-selected={tabValue === 1}
            />
            <Tab 
              label="Coverage" 
              id="experiment-tab-2" 
              aria-controls="experiment-tabpanel-2" 
              aria-selected={tabValue === 2}
            />
            <Tab 
              label="Configuration" 
              id="experiment-tab-3" 
              aria-controls="experiment-tabpanel-3" 
              aria-selected={tabValue === 3}
            />
          </Tabs>
        </Box>
      </Box>
      
      <Box sx={{ p: 3 }}>
        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          {/* Coverage Progress Section */}
          <Accordion 
            expanded={expanded === 'coverageSection'} 
            onChange={handleAccordionChange('coverageSection')}
            sx={{ mb: 2 }}
            id="coverage-section"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon aria-hidden="true" />}
              aria-controls="coverage-content"
              id="coverage-header"
              onKeyDown={handleKeyDown('coverageSection')}
              sx={{ 
                backgroundColor: 'background.paper',
                borderRadius: expanded === 'coverageSection' ? '4px 4px 0 0' : 4,
                '&:focus-visible': focusOutlineStyle
              }}
              aria-expanded={expanded === 'coverageSection'}
            >
              <Typography variant="h6">Coverage Progress</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ height: 300 }} aria-label="Coverage progress chart">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={coverageTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" label={{ value: 'Time', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis unit="%" label={{ value: 'Coverage (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="edgeCoverage" name="Edge Coverage" stroke="#8884d8" />
                    <Line type="monotone" dataKey="functionCoverage" name="Function Coverage" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="branchCoverage" name="Branch Coverage" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </AccordionDetails>
          </Accordion>
          
          {/* Crash Analysis Section */}
          <Accordion 
            expanded={expanded === 'crashSection'} 
            onChange={handleAccordionChange('crashSection')}
            sx={{ mb: 2 }}
            id="crash-section"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon aria-hidden="true" />}
              aria-controls="crash-content"
              id="crash-header"
              onKeyDown={handleKeyDown('crashSection')}
              sx={{ 
                backgroundColor: 'background.paper',
                borderRadius: expanded === 'crashSection' ? '4px 4px 0 0' : 4,
                '&:focus-visible': focusOutlineStyle
              }}
              aria-expanded={expanded === 'crashSection'}
            >
              <Typography variant="h6">Crash Analysis</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '240px' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Crash Types
                  </Typography>
                  <Box sx={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Heap BOF', count: 1 },
                          { name: 'UAF', count: 2 },
                          { name: 'Stack BOF', count: 2 },
                          { name: 'NPD', count: 1 },
                          { name: 'Int OF', count: 1 },
                          { name: 'Timeout', count: 2 },
                          { name: 'OOM', count: 1 }
                        ]}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
                
                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '240px' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Crash Severity
                  </Typography>
                  <Box sx={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Critical', count: 2 },
                          { name: 'High', count: 1 },
                          { name: 'Medium', count: 2 },
                          { name: 'Low', count: 3 },
                          { name: 'Undefined', count: 2 }
                        ]}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip />
                        <Bar dataKey="count" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
          
          {/* Recent Activity Section */}
          <Accordion 
            expanded={expanded === 'activitySection'} 
            onChange={handleAccordionChange('activitySection')}
            sx={{ mb: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="activity-content"
              id="activity-header"
              sx={{ 
                backgroundColor: 'background.paper',
                borderRadius: expanded === 'activitySection' ? '4px 4px 0 0' : 4
              }}
            >
              <Typography variant="h6">Recent Activity</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                  7d 0h - Experiment completed
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, pl: 2, borderLeft: '2px solid #e0e0e0', py: 0.5 }}>
                  Final coverage: 84.2%
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                  6d 15h - New crash found
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, pl: 2, borderLeft: '2px solid #e0e0e0', py: 0.5 }}>
                  crash-009 (Use After Free - Duplicate)
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                  6d 2h - New crash found
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, pl: 2, borderLeft: '2px solid #e0e0e0', py: 0.5 }}>
                  crash-005 (Stack Buffer Overflow - Duplicate)
                </Typography>
              </Box>
              <Button size="small" sx={{ mt: 1 }}>
                View full activity log
              </Button>
            </AccordionDetails>
          </Accordion>
          
          {/* Performance Metrics Section */}
          <Accordion 
            expanded={expanded === 'performanceSection'} 
            onChange={handleAccordionChange('performanceSection')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="performance-content"
              id="performance-header"
              sx={{ 
                backgroundColor: 'background.paper',
                borderRadius: expanded === 'performanceSection' ? '4px 4px 0 0' : 4
              }}
            >
              <Typography variant="h6">Performance Metrics</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={execSpeedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" label={{ value: 'Time', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis label={{ value: 'Executions/sec', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="execPerSec" name="Executions per Second" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </AccordionDetails>
          </Accordion>
        </TabPanel>
        
        {/* Crashes Tab */}
        <TabPanel value={tabValue} index={1}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" id="crashes-table-title">
                Crashes ({filteredCrashes.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  placeholder="Search crashes..."
                  size="small"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon aria-hidden="true" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    width: 300,
                    '& .MuiOutlinedInput-root:focus-visible': focusOutlineStyle 
                  }}
                  aria-label="Search crashes"
                />
                <Button 
                  startIcon={<FilterListIcon />} 
                  variant="outlined" 
                  size="small"
                  aria-label="Filter crashes"
                  sx={{ '&:focus-visible': focusOutlineStyle }}
                >
                  Filter
                </Button>
              </Box>
            </Box>
            
            {/* Quick Filter Actions */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1, 
                mb: 3, 
                alignItems: 'center' 
              }}
              role="group"
              aria-label="Quick filter actions"
            >
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                Quick Filters:
              </Typography>
              <Chip
                label="Critical Issues"
                size="small"
                clickable
                color={activeQuickFilters.includes('critical') ? 'error' : 'default'}
                onClick={() => toggleQuickFilter('critical')}
                sx={{ 
                  '&:focus-visible': focusOutlineStyle,
                  fontWeight: activeQuickFilters.includes('critical') ? 'bold' : 'normal'
                }}
              />
              <Chip
                label="High Severity"
                size="small"
                clickable
                color={activeQuickFilters.includes('high') ? 'warning' : 'default'}
                onClick={() => toggleQuickFilter('high')}
                sx={{ 
                  '&:focus-visible': focusOutlineStyle,
                  fontWeight: activeQuickFilters.includes('high') ? 'bold' : 'normal'
                }}
              />
              <Chip
                label="Verified"
                size="small"
                clickable
                color={activeQuickFilters.includes('verified') ? 'success' : 'default'}
                onClick={() => toggleQuickFilter('verified')}
                sx={{ 
                  '&:focus-visible': focusOutlineStyle,
                  fontWeight: activeQuickFilters.includes('verified') ? 'bold' : 'normal'
                }}
              />
              <Chip
                label="Needs Triage"
                size="small"
                clickable
                color={activeQuickFilters.includes('needsTriage') ? 'info' : 'default'}
                onClick={() => toggleQuickFilter('needsTriage')}
                sx={{ 
                  '&:focus-visible': focusOutlineStyle,
                  fontWeight: activeQuickFilters.includes('needsTriage') ? 'bold' : 'normal'
                }}
              />
              <Chip
                label="Latest (3 days)"
                size="small"
                clickable
                color={activeQuickFilters.includes('latest') ? 'primary' : 'default'}
                onClick={() => toggleQuickFilter('latest')}
                sx={{ 
                  '&:focus-visible': focusOutlineStyle,
                  fontWeight: activeQuickFilters.includes('latest') ? 'bold' : 'normal'
                }}
              />
              {activeQuickFilters.length > 0 && (
                <Button 
                  size="small" 
                  onClick={clearQuickFilters}
                  startIcon={<CloseIcon fontSize="small" />}
                  sx={{ 
                    ml: 1,
                    '&:focus-visible': focusOutlineStyle
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </Box>
            
            <TableContainer>
              <Table aria-labelledby="crashes-table-title">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Discovered</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Reproducer</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCrashes.map((crash) => (
                    <TableRow key={crash.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                      <TableCell>{crash.id}</TableCell>
                      <TableCell>{crash.type}</TableCell>
                      <TableCell>
                        <Chip 
                          label={crash.severity} 
                          size="small"
                          color={
                            crash.severity === 'Critical' ? 'error' :
                            crash.severity === 'High' ? 'warning' :
                            crash.severity === 'Medium' ? 'info' :
                            'default'
                          }
                          aria-label={`Severity: ${crash.severity}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={crash.status} 
                          size="small"
                          variant="outlined"
                          aria-label={`Status: ${crash.status}`}
                        />
                      </TableCell>
                      <TableCell>{crash.discovered}</TableCell>
                      <TableCell>{crash.file}:{crash.line}</TableCell>
                      <TableCell>
                        <Button 
                          size="small" 
                          variant="text"
                          aria-label={`View reproducer ${crash.reproducer}`}
                          sx={{ '&:focus-visible': focusOutlineStyle }}
                        >
                          {crash.reproducer}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small"
                          aria-label={`More actions for crash ${crash.id}`}
                          sx={{ '&:focus-visible': focusOutlineStyle }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </TabPanel>
        
        {/* Coverage Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Quick Focus Actions for Coverage */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1, 
                mb: 1, 
                alignItems: 'center',
                bgcolor: 'background.paper',
                p: 2,
                borderRadius: 1
              }}
              role="group"
              aria-label="Coverage focus actions"
            >
              <Typography variant="body1" sx={{ mr: 1 }}>
                Quick Focus:
              </Typography>
              <Chip
                label="Low Edge Coverage (<70%)"
                size="small"
                clickable
                color={coverageFilter === 'lowEdge' ? 'primary' : 'default'}
                onClick={() => setCoverageFocus(coverageFilter === 'lowEdge' ? null : 'lowEdge')}
                sx={{ 
                  '&:focus-visible': focusOutlineStyle,
                  fontWeight: coverageFilter === 'lowEdge' ? 'bold' : 'normal'
                }}
              />
              <Chip
                label="Low Function Coverage (<65%)"
                size="small"
                clickable
                color={coverageFilter === 'lowFunction' ? 'secondary' : 'default'}
                onClick={() => setCoverageFocus(coverageFilter === 'lowFunction' ? null : 'lowFunction')}
                sx={{ 
                  '&:focus-visible': focusOutlineStyle,
                  fontWeight: coverageFilter === 'lowFunction' ? 'bold' : 'normal'
                }}
              />
              <Chip
                label="Low Branch Coverage (<60%)"
                size="small"
                clickable
                color={coverageFilter === 'lowBranch' ? 'info' : 'default'}
                onClick={() => setCoverageFocus(coverageFilter === 'lowBranch' ? null : 'lowBranch')}
                sx={{ 
                  '&:focus-visible': focusOutlineStyle,
                  fontWeight: coverageFilter === 'lowBranch' ? 'bold' : 'normal'
                }}
              />
              <Chip
                label="Slow Growth Periods"
                size="small"
                clickable
                color={coverageFilter === 'slowGrowth' ? 'warning' : 'default'}
                onClick={() => setCoverageFocus(coverageFilter === 'slowGrowth' ? null : 'slowGrowth')}
                sx={{ 
                  '&:focus-visible': focusOutlineStyle,
                  fontWeight: coverageFilter === 'slowGrowth' ? 'bold' : 'normal'
                }}
              />
              {coverageFilter && (
                <Button 
                  size="small" 
                  onClick={() => setCoverageFocus(null)}
                  startIcon={<CloseIcon fontSize="small" />}
                  sx={{ 
                    ml: 1,
                    '&:focus-visible': focusOutlineStyle
                  }}
                >
                  Show All
                </Button>
              )}
            </Box>

            {/* Coverage Summary Section */}
            <Accordion 
              defaultExpanded 
              sx={{ mb: 1 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="summary-content"
                id="summary-header"
                sx={{ backgroundColor: 'background.paper' }}
              >
                <Typography variant="h6">Coverage Summary</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '240px' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Edge Coverage
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h3" sx={{ mr: 2 }}>
                        {experimentData.summary.edgeCoverage}%
                      </Typography>
                      <Box sx={{ width: '100%' }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={experimentData.summary.edgeCoverage} 
                          sx={{ height: 10, borderRadius: 5 }} 
                        />
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '240px' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Function Coverage
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h3" sx={{ mr: 2 }}>
                        {experimentData.summary.functionCoverage}%
                      </Typography>
                      <Box sx={{ width: '100%' }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={experimentData.summary.functionCoverage} 
                          sx={{ height: 10, borderRadius: 5 }} 
                          color="secondary"
                        />
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '240px' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Branch Coverage
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h3" sx={{ mr: 2 }}>
                        {experimentData.summary.branchCoverage}%
                      </Typography>
                      <Box sx={{ width: '100%' }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={experimentData.summary.branchCoverage} 
                          sx={{ height: 10, borderRadius: 5 }} 
                          color="success"
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
            
            {/* Coverage Over Time Section */}
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="coverage-time-content"
                id="coverage-time-header"
                sx={{ backgroundColor: 'background.paper' }}
              >
                <Typography variant="h6">
                  Coverage Over Time
                  {coverageFilter && (
                    <Typography component="span" color="primary.main" sx={{ fontSize: '0.8rem', ml: 2 }}>
                      (Filtered)
                    </Typography>
                  )}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredCoverageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" label={{ value: 'Time (days)', position: 'insideBottomRight', offset: -5 }} />
                      <YAxis unit="%" label={{ value: 'Coverage (%)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="edgeCoverage" name="Edge Coverage" stroke="#8884d8" strokeWidth={2} dot={{ r: 5 }} />
                      <Line type="monotone" dataKey="functionCoverage" name="Function Coverage" stroke="#82ca9d" strokeWidth={2} dot={{ r: 5 }} />
                      <Line type="monotone" dataKey="branchCoverage" name="Branch Coverage" stroke="#ffc658" strokeWidth={2} dot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
                
                {coverageFilter ? (
                  <Alert severity="info" sx={{ mt: 3 }}>
                    {coverageFilter === 'lowEdge' && "Showing periods with edge coverage below 70%. Consider adding more edge-focused test cases."}
                    {coverageFilter === 'lowFunction' && "Showing periods with function coverage below 65%. Consider targeting uncovered functions."}
                    {coverageFilter === 'lowBranch' && "Showing periods with branch coverage below 60%. Review conditional paths that need more testing."}
                    {coverageFilter === 'slowGrowth' && "Highlighting periods with slow coverage growth. These may indicate fuzzing plateaus."}
                  </Alert>
                ) : (
                  <Alert severity="info" sx={{ mt: 3 }}>
                    Coverage growth slowed after day 5, indicating diminishing returns. Consider adjusting fuzzer strategy or corpus for future experiments.
                  </Alert>
                )}
              </AccordionDetails>
            </Accordion>
          </Box>
        </TabPanel>
        
        {/* Configuration Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Search box for configuration */}
            <Box sx={{ mb: 2 }}>
              <TextField
                placeholder="Search configuration..."
                size="small"
                value={configSearchQuery}
                onChange={handleConfigSearchChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon aria-hidden="true" />
                    </InputAdornment>
                  ),
                  endAdornment: configSearchQuery ? (
                    <InputAdornment position="end">
                      <IconButton 
                        size="small" 
                        onClick={() => setConfigSearchQuery('')}
                        aria-label="Clear search"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root:focus-visible': focusOutlineStyle 
                }}
                aria-label="Search configuration"
              />
            </Box>
            
            {/* Basic Configuration Section */}
            <Accordion 
              defaultExpanded 
              sx={{ mb: 1 }}
              id="basic-config-section"
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon aria-hidden="true" />}
                aria-controls="basic-config-content"
                id="basic-config-header"
                sx={{ 
                  backgroundColor: 'background.paper',
                  '&:focus-visible': focusOutlineStyle 
                }}
              >
                <Typography variant="h6">Basic Configuration</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size="small" aria-labelledby="basic-config-header">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Project</TableCell>
                        <TableCell>{experimentData.project}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Fuzzer</TableCell>
                        <TableCell>{experimentData.fuzzer}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Duration</TableCell>
                        <TableCell>{durationInDays} days</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Instances</TableCell>
                        <TableCell>{experimentData.machines.length}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
            
            {/* Resource Configuration Section - add filtered results */}
            <Accordion defaultExpanded sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon aria-hidden="true" />}
                aria-controls="resource-config-content"
                id="resource-config-header"
                sx={{ 
                  backgroundColor: 'background.paper',
                  '&:focus-visible': focusOutlineStyle 
                }}
              >
                <Typography variant="h6">
                  Resource Configuration
                  {configSearchQuery && ` (${filteredMachines.length} matching results)`}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size="small" aria-labelledby="resource-config-header">
                    <TableHead>
                      <TableRow>
                        <TableCell>Instance ID</TableCell>
                        <TableCell>Machine Type</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredMachines.length > 0 ? (
                        filteredMachines.map((machine) => (
                          <TableRow key={machine.id}>
                            <TableCell>{machine.id}</TableCell>
                            <TableCell>{machine.machineType}</TableCell>
                            <TableCell>
                              <Chip 
                                label={machine.status} 
                                size="small"
                                color={machine.status === 'Terminated' ? 'default' : 'success'}
                                aria-label={`Status: ${machine.status}`}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            No matching resources found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
            
            {/* Build & Run Configuration - Add highlighting for search matches */}
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon aria-hidden="true" />}
                aria-controls="build-config-content"
                id="build-config-header"
                sx={{ 
                  backgroundColor: 'background.paper',
                  '&:focus-visible': focusOutlineStyle 
                }}
              >
                <Typography variant="h6">Build & Run Configuration</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle1" gutterBottom>
                  Build Configuration
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: 1, 
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  overflow: 'auto',
                  mb: 3
                }}>
                  {configSearchQuery && experimentData.buildArgs.toLowerCase().includes(configSearchQuery.toLowerCase()) ? (
                    <pre style={{ margin: 0 }}>
                      {experimentData.buildArgs.split(new RegExp(`(${configSearchQuery})`, 'i')).map((part, i) => 
                        part.toLowerCase() === configSearchQuery.toLowerCase() ? 
                          <mark key={i} style={{ backgroundColor: '#ffeb3b' }}>{part}</mark> : 
                          part
                      )}
                    </pre>
                  ) : (
                    <pre style={{ margin: 0 }}>{experimentData.buildArgs}</pre>
                  )}
                </Box>
                
                <Typography variant="subtitle1" gutterBottom>
                  Run Configuration
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: 1, 
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  overflow: 'auto',
                  mb: 3
                }}>
                  {configSearchQuery && experimentData.runArgs.toLowerCase().includes(configSearchQuery.toLowerCase()) ? (
                    <pre style={{ margin: 0 }}>
                      {experimentData.runArgs.split(new RegExp(`(${configSearchQuery})`, 'i')).map((part, i) => 
                        part.toLowerCase() === configSearchQuery.toLowerCase() ? 
                          <mark key={i} style={{ backgroundColor: '#ffeb3b' }}>{part}</mark> : 
                          part
                      )}
                    </pre>
                  ) : (
                    <pre style={{ margin: 0 }}>{experimentData.runArgs}</pre>
                  )}
                </Box>
                
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
                  Additional Options
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Chip label="Dictionary: Enabled" color="primary" />
                  <Chip label="Custom Corpus: Enabled" color="primary" />
                </Box>
                
                <Button 
                  variant="outlined" 
                  startIcon={<DownloadIcon aria-hidden="true" />} 
                  sx={{ 
                    mt: 2,
                    '&:focus-visible': focusOutlineStyle,
                    color: '#1565c0', // Ensuring sufficient color contrast 
                    borderColor: '#1565c0'
                  }}
                  aria-label="Download Configuration YAML file"
                >
                  Download Configuration YAML
                </Button>
              </AccordionDetails>
            </Accordion>
          </Box>
        </TabPanel>
      </Box>
    </Box>
  );
} 