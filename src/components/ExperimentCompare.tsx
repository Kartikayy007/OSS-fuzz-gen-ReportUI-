import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  Divider, 
  Grid, 
  Chip,
  Card,
  CardContent,
  CardHeader,
  Breadcrumbs,
  Link,
  SelectChangeEvent,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  CompareArrows as CompareIcon,
  SwapHoriz as SwapIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { 
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Mock data for experiments to compare
const availableExperiments = [
  { id: 'exp-001', name: 'libxml2 (libFuzzer)', project: 'libxml2', fuzzer: 'libFuzzer', date: '2023-03-15' },
  { id: 'exp-002', name: 'libxml2 (AFL++)', project: 'libxml2', fuzzer: 'AFL++', date: '2023-03-16' },
  { id: 'exp-003', name: 'curl test run', project: 'curl', fuzzer: 'libFuzzer', date: '2023-03-17' },
  { id: 'exp-004', name: 'OpenSSL (Honggfuzz)', project: 'openssl', fuzzer: 'Honggfuzz', date: '2023-03-18' },
  { id: 'exp-005', name: 'SQLite intensive test', project: 'sqlite', fuzzer: 'libFuzzer', date: '2023-03-19' },
];

// Mock experiment data
const experimentData = {
  'exp-001': {
    id: 'exp-001',
    name: 'libxml2 (libFuzzer)',
    project: 'libxml2',
    fuzzer: 'libFuzzer',
    duration: '7 days',
    status: 'Completed',
    startDate: '2023-03-15',
    endDate: '2023-03-22',
    coverage: 76.2,
    crashes: 12,
    uniqueCrashes: 8,
    executions: 1205307523,
    execsPerSec: 1982,
    peakRSS: 1245,
    cpuUsage: 98.2,
    sanitizers: ['address', 'undefined'],
    coverageTrend: [
      { day: 'Day 1', coverage: 32.5 },
      { day: 'Day 2', coverage: 45.7 },
      { day: 'Day 3', coverage: 56.2 },
      { day: 'Day 4', coverage: 64.8 },
      { day: 'Day 5', coverage: 68.9 },
      { day: 'Day 6', coverage: 73.5 },
      { day: 'Day 7', coverage: 76.2 },
    ],
    crashesTrend: [
      { day: 'Day 1', crashes: 0 },
      { day: 'Day 2', crashes: 3 },
      { day: 'Day 3', crashes: 5 },
      { day: 'Day 4', crashes: 8 },
      { day: 'Day 5', crashes: 9 },
      { day: 'Day 6', crashes: 11 },
      { day: 'Day 7', crashes: 12 },
    ],
    crashTypes: [
      { type: 'Heap Buffer Overflow', count: 5 },
      { type: 'Use After Free', count: 3 },
      { type: 'Null Pointer Dereference', count: 2 },
      { type: 'Stack Buffer Overflow', count: 1 },
      { type: 'Integer Overflow', count: 1 },
    ]
  },
  'exp-002': {
    id: 'exp-002',
    name: 'libxml2 (AFL++)',
    project: 'libxml2',
    fuzzer: 'AFL++',
    duration: '7 days',
    status: 'Completed',
    startDate: '2023-03-16',
    endDate: '2023-03-23',
    coverage: 72.8,
    crashes: 10,
    uniqueCrashes: 7,
    executions: 983215748,
    execsPerSec: 1618,
    peakRSS: 1348,
    cpuUsage: 97.5,
    sanitizers: ['address'],
    coverageTrend: [
      { day: 'Day 1', coverage: 28.9 },
      { day: 'Day 2', coverage: 42.1 },
      { day: 'Day 3', coverage: 52.4 },
      { day: 'Day 4', coverage: 59.3 },
      { day: 'Day 5', coverage: 64.5 },
      { day: 'Day 6', coverage: 69.2 },
      { day: 'Day 7', coverage: 72.8 },
    ],
    crashesTrend: [
      { day: 'Day 1', crashes: 0 },
      { day: 'Day 2', crashes: 2 },
      { day: 'Day 3', crashes: 4 },
      { day: 'Day 4', crashes: 6 },
      { day: 'Day 5', crashes: 7 },
      { day: 'Day 6', crashes: 9 },
      { day: 'Day 7', crashes: 10 },
    ],
    crashTypes: [
      { type: 'Heap Buffer Overflow', count: 4 },
      { type: 'Use After Free', count: 3 },
      { type: 'Null Pointer Dereference', count: 1 },
      { type: 'Stack Buffer Overflow', count: 1 },
      { type: 'Integer Overflow', count: 1 },
    ]
  },
  'exp-003': {
    id: 'exp-003',
    name: 'curl test run',
    project: 'curl',
    fuzzer: 'libFuzzer',
    duration: '5 days',
    status: 'Completed',
    startDate: '2023-03-17',
    endDate: '2023-03-22',
    coverage: 68.4,
    crashes: 7,
    uniqueCrashes: 5,
    executions: 943521074,
    execsPerSec: 2178,
    peakRSS: 987,
    cpuUsage: 99.1,
    sanitizers: ['address', 'undefined', 'memory'],
    coverageTrend: [
      { day: 'Day 1', coverage: 28.3 },
      { day: 'Day 2', coverage: 42.7 },
      { day: 'Day 3', coverage: 55.8 },
      { day: 'Day 4', coverage: 63.2 },
      { day: 'Day 5', coverage: 68.4 },
    ],
    crashesTrend: [
      { day: 'Day 1', crashes: 1 },
      { day: 'Day 2', crashes: 3 },
      { day: 'Day 3', crashes: 5 },
      { day: 'Day 4', crashes: 6 },
      { day: 'Day 5', crashes: 7 },
    ],
    crashTypes: [
      { type: 'Heap Buffer Overflow', count: 2 },
      { type: 'Use After Free', count: 2 },
      { type: 'Null Pointer Dereference', count: 1 },
      { type: 'Stack Buffer Overflow', count: 1 },
      { type: 'Integer Overflow', count: 1 },
    ]
  }
};

// Merge data for coverage trend chart
const mergeChartData = (
  data1: {day: string, coverage: number}[], 
  data2: {day: string, coverage: number}[],
  label1: string,
  label2: string
) => {
  const maxLength = Math.max(data1.length, data2.length);
  const result = [];
  
  for(let i = 0; i < maxLength; i++) {
    const obj: any = {};
    obj.day = i < data1.length ? data1[i].day : data2[i].day;
    
    if (i < data1.length) {
      obj[label1] = data1[i].coverage;
    }
    
    if (i < data2.length) {
      obj[label2] = data2[i].coverage;
    }
    
    result.push(obj);
  }
  
  return result;
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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ExperimentCompare() {
  const [leftExperiment, setLeftExperiment] = useState<string>('');
  const [rightExperiment, setRightExperiment] = useState<string>('');
  const [tabValue, setTabValue] = useState(0);
  
  const handleLeftChange = (event: SelectChangeEvent) => {
    setLeftExperiment(event.target.value);
  };
  
  const handleRightChange = (event: SelectChangeEvent) => {
    setRightExperiment(event.target.value);
  };
  
  const handleSwapExperiments = () => {
    setLeftExperiment(rightExperiment);
    setRightExperiment(leftExperiment);
  };
  
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Get data for selected experiments
  const leftData = leftExperiment ? experimentData[leftExperiment as keyof typeof experimentData] : null;
  const rightData = rightExperiment ? experimentData[rightExperiment as keyof typeof experimentData] : null;
  
  // Generate merged chart data if both experiments selected
  const mergedCoverageData = (leftData && rightData) 
    ? mergeChartData(
        leftData.coverageTrend, 
        rightData.coverageTrend,
        leftData.name,
        rightData.name
      )
    : [];
    
  const mergedCrashesData = (leftData && rightData) 
    ? mergeChartData(
        leftData.crashesTrend.map(item => ({ day: item.day, coverage: item.crashes })), 
        rightData.crashesTrend.map(item => ({ day: item.day, coverage: item.crashes })),
        leftData.name,
        rightData.name
      )
    : [];
  
  // Calculate differences if both experiments are selected
  const getDifference = (val1: number, val2: number) => {
    const diff = val1 - val2;
    const percent = val2 !== 0 ? (diff / val2) * 100 : 0;
    return {
      diff,
      percent,
      isPositive: diff > 0,
      isNeutral: diff === 0
    };
  };
  
  const differences = (leftData && rightData) ? {
    coverage: getDifference(leftData.coverage, rightData.coverage),
    crashes: getDifference(leftData.crashes, rightData.crashes),
    uniqueCrashes: getDifference(leftData.uniqueCrashes, rightData.uniqueCrashes),
    execsPerSec: getDifference(leftData.execsPerSec, rightData.execsPerSec),
    peakRSS: getDifference(leftData.peakRSS, rightData.peakRSS),
    cpuUsage: getDifference(leftData.cpuUsage, rightData.cpuUsage),
  } : null;

  return (
    <Box>
      {/* Breadcrumbs navigation */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="/experiments">
          Experiments
        </Link>
        <Typography color="text.primary">Compare</Typography>
      </Breadcrumbs>
      
      <Typography variant="h4" component="h1" gutterBottom>
        Compare Experiments
      </Typography>
      
      {/* Experiment selection */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 2
        }}>
          <FormControl fullWidth sx={{ flex: 1 }}>
            <InputLabel id="left-experiment-label">First Experiment</InputLabel>
            <Select
              labelId="left-experiment-label"
              id="left-experiment"
              value={leftExperiment}
              label="First Experiment"
              onChange={handleLeftChange}
            >
              <MenuItem value="">
                <em>Select an experiment</em>
              </MenuItem>
              {availableExperiments.map((exp) => (
                <MenuItem 
                  key={exp.id} 
                  value={exp.id}
                  disabled={exp.id === rightExperiment}
                >
                  {exp.name} ({exp.date})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Tooltip title="Swap experiments">
              <IconButton 
                onClick={handleSwapExperiments}
                disabled={!leftExperiment || !rightExperiment}
              >
                <SwapIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          <FormControl fullWidth sx={{ flex: 1 }}>
            <InputLabel id="right-experiment-label">Second Experiment</InputLabel>
            <Select
              labelId="right-experiment-label"
              id="right-experiment"
              value={rightExperiment}
              label="Second Experiment"
              onChange={handleRightChange}
            >
              <MenuItem value="">
                <em>Select an experiment</em>
              </MenuItem>
              {availableExperiments.map((exp) => (
                <MenuItem 
                  key={exp.id} 
                  value={exp.id}
                  disabled={exp.id === leftExperiment}
                >
                  {exp.name} ({exp.date})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        {(!leftExperiment || !rightExperiment) && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Please select two experiments to compare.
          </Alert>
        )}
      </Paper>
      
      {/* Comparison results */}
      {leftData && rightData && (
        <>
          {/* Summary cards */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 3 }}>
            {/* Tab navigation */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                aria-label="comparison tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Summary" id="tab-0" aria-controls="tabpanel-0" />
                <Tab label="Coverage" id="tab-1" aria-controls="tabpanel-1" />
                <Tab label="Crashes" id="tab-2" aria-controls="tabpanel-2" />
                <Tab label="Performance" id="tab-3" aria-controls="tabpanel-3" />
                <Tab label="Configuration" id="tab-4" aria-controls="tabpanel-4" />
              </Tabs>
            </Box>
            
            {/* Summary tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid xs={12}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Key Differences
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Metric</TableCell>
                            <TableCell>{leftData.name}</TableCell>
                            <TableCell>{rightData.name}</TableCell>
                            <TableCell>Difference</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>Coverage</TableCell>
                            <TableCell>{leftData.coverage.toFixed(1)}%</TableCell>
                            <TableCell>{rightData.coverage.toFixed(1)}%</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {differences?.coverage.isPositive ? (
                                  <ArrowUpIcon color="success" fontSize="small" />
                                ) : differences?.coverage.isNeutral ? (
                                  "–"
                                ) : (
                                  <ArrowDownIcon color="error" fontSize="small" />
                                )}
                                <Typography 
                                  variant="body2" 
                                  color={differences?.coverage.isPositive ? 'success.main' : 
                                         differences?.coverage.isNeutral ? 'text.secondary' : 'error.main'}
                                  sx={{ ml: 1 }}
                                >
                                  {Math.abs(differences?.coverage.diff || 0).toFixed(1)}% 
                                  ({Math.abs(differences?.coverage.percent || 0).toFixed(1)}%)
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Crashes Found</TableCell>
                            <TableCell>{leftData.crashes}</TableCell>
                            <TableCell>{rightData.crashes}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {differences?.crashes.isPositive ? (
                                  <ArrowUpIcon color="success" fontSize="small" />
                                ) : differences?.crashes.isNeutral ? (
                                  "–"
                                ) : (
                                  <ArrowDownIcon color="error" fontSize="small" />
                                )}
                                <Typography 
                                  variant="body2" 
                                  color={differences?.crashes.isPositive ? 'success.main' : 
                                         differences?.crashes.isNeutral ? 'text.secondary' : 'error.main'}
                                  sx={{ ml: 1 }}
                                >
                                  {Math.abs(differences?.crashes.diff || 0)} 
                                  ({Math.abs(differences?.crashes.percent || 0).toFixed(1)}%)
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Unique Crashes</TableCell>
                            <TableCell>{leftData.uniqueCrashes}</TableCell>
                            <TableCell>{rightData.uniqueCrashes}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {differences?.uniqueCrashes.isPositive ? (
                                  <ArrowUpIcon color="success" fontSize="small" />
                                ) : differences?.uniqueCrashes.isNeutral ? (
                                  "–"
                                ) : (
                                  <ArrowDownIcon color="error" fontSize="small" />
                                )}
                                <Typography 
                                  variant="body2" 
                                  color={differences?.uniqueCrashes.isPositive ? 'success.main' : 
                                         differences?.uniqueCrashes.isNeutral ? 'text.secondary' : 'error.main'}
                                  sx={{ ml: 1 }}
                                >
                                  {Math.abs(differences?.uniqueCrashes.diff || 0)} 
                                  ({Math.abs(differences?.uniqueCrashes.percent || 0).toFixed(1)}%)
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Executions/sec</TableCell>
                            <TableCell>{leftData.execsPerSec.toLocaleString()}</TableCell>
                            <TableCell>{rightData.execsPerSec.toLocaleString()}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {differences?.execsPerSec.isPositive ? (
                                  <ArrowUpIcon color="success" fontSize="small" />
                                ) : differences?.execsPerSec.isNeutral ? (
                                  "–"
                                ) : (
                                  <ArrowDownIcon color="error" fontSize="small" />
                                )}
                                <Typography 
                                  variant="body2" 
                                  color={differences?.execsPerSec.isPositive ? 'success.main' : 
                                         differences?.execsPerSec.isNeutral ? 'text.secondary' : 'error.main'}
                                  sx={{ ml: 1 }}
                                >
                                  {Math.abs(differences?.execsPerSec.diff || 0).toLocaleString()} 
                                  ({Math.abs(differences?.execsPerSec.percent || 0).toFixed(1)}%)
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>
            
            {/* Coverage tab */}
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                <Grid xs={12}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Coverage Trend Comparison
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={mergedCoverageData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis unit="%" />
                        <RechartsTooltip />
                        <Legend />
                        <Line type="monotone" dataKey={leftData.name} stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey={rightData.name} stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>
            
            {/* Crashes tab */}
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Crashes Found
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={mergedCrashesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line type="monotone" dataKey={leftData.name} stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey={rightData.name} stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
                <Grid xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Crash Types Distribution
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {leftData.name}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          Crashes
                        </Typography>
                      </Box>
                      {leftData.crashTypes.map((crashType, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="body2">{crashType.type}</Typography>
                          <Chip 
                            label={crashType.count} 
                            size="small" 
                            color={
                              crashType.type.includes('Heap') ? 'error' :
                              crashType.type.includes('Use After') ? 'warning' :
                              crashType.type.includes('Null') ? 'info' :
                              'default'
                            }
                          />
                        </Box>
                      ))}
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {rightData.name}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          Crashes
                        </Typography>
                      </Box>
                      {rightData.crashTypes.map((crashType, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="body2">{crashType.type}</Typography>
                          <Chip 
                            label={crashType.count} 
                            size="small" 
                            color={
                              crashType.type.includes('Heap') ? 'error' :
                              crashType.type.includes('Use After') ? 'warning' :
                              crashType.type.includes('Null') ? 'info' :
                              'default'
                            }
                          />
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>
            
            {/* Performance tab */}
            <TabPanel value={tabValue} index={3}>
              <Grid container spacing={3}>
                <Grid xs={12}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Performance Metrics
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={[
                          { name: 'Executions/sec', [leftData.name]: leftData.execsPerSec, [rightData.name]: rightData.execsPerSec },
                          { name: 'Peak RSS (MB)', [leftData.name]: leftData.peakRSS, [rightData.name]: rightData.peakRSS },
                          { name: 'CPU Usage (%)', [leftData.name]: leftData.cpuUsage, [rightData.name]: rightData.cpuUsage },
                        ]}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey={leftData.name} fill="#8884d8" />
                        <Bar dataKey={rightData.name} fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>
            
            {/* Configuration tab */}
            <TabPanel value={tabValue} index={4}>
              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <Card variant="outlined">
                    <CardHeader
                      title={leftData.name}
                      subheader={`${leftData.project} - ${leftData.fuzzer}`}
                    />
                    <Divider />
                    <CardContent>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Duration:
                          </Typography>
                          <Typography variant="body2">
                            {leftData.duration}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Start Date:
                          </Typography>
                          <Typography variant="body2">
                            {leftData.startDate}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            End Date:
                          </Typography>
                          <Typography variant="body2">
                            {leftData.endDate}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Sanitizers:
                          </Typography>
                          <Box>
                            {leftData.sanitizers.map((sanitizer, index) => (
                              <Chip
                                key={index}
                                label={sanitizer}
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid xs={12} md={6}>
                  <Card variant="outlined">
                    <CardHeader
                      title={rightData.name}
                      subheader={`${rightData.project} - ${rightData.fuzzer}`}
                    />
                    <Divider />
                    <CardContent>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Duration:
                          </Typography>
                          <Typography variant="body2">
                            {rightData.duration}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Start Date:
                          </Typography>
                          <Typography variant="body2">
                            {rightData.startDate}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            End Date:
                          </Typography>
                          <Typography variant="body2">
                            {rightData.endDate}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Sanitizers:
                          </Typography>
                          <Box>
                            {rightData.sanitizers.map((sanitizer, index) => (
                              <Chip
                                key={index}
                                label={sanitizer}
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
          </Box>
        </>
      )}
    </Box>
  );
} 