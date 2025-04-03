import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Chip,
  LinearProgress,
  Breadcrumbs,
  Link,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl
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
  PieChart,
  Pie,
  Cell
} from 'recharts';


// Mock data for charts
const coverageData = [
  { name: 'Day 1', libFuzzer: 65, AFL: 28, Honggfuzz: 42 },
  { name: 'Day 2', libFuzzer: 68, AFL: 32, Honggfuzz: 45 },
  { name: 'Day 3', libFuzzer: 70, AFL: 38, Honggfuzz: 50 },
  { name: 'Day 4', libFuzzer: 74, AFL: 42, Honggfuzz: 56 },
  { name: 'Day 5', libFuzzer: 78, AFL: 48, Honggfuzz: 60 },
  { name: 'Day 6', libFuzzer: 80, AFL: 52, Honggfuzz: 63 },
  { name: 'Day 7', libFuzzer: 84, AFL: 56, Honggfuzz: 67 },
];

const crashesData = [
  { name: 'Day 1', libFuzzer: 2, AFL: 1, Honggfuzz: 0 },
  { name: 'Day 2', libFuzzer: 3, AFL: 2, Honggfuzz: 1 },
  { name: 'Day 3', libFuzzer: 5, AFL: 2, Honggfuzz: 2 },
  { name: 'Day 4', libFuzzer: 5, AFL: 3, Honggfuzz: 3 },
  { name: 'Day 5', libFuzzer: 8, AFL: 4, Honggfuzz: 3 },
  { name: 'Day 6', libFuzzer: 8, AFL: 4, Honggfuzz: 4 },
  { name: 'Day 7', libFuzzer: 10, AFL: 6, Honggfuzz: 5 },
];

const crashTypeData = [
  { name: 'Heap Buffer Overflow', value: 42 },
  { name: 'Use After Free', value: 28 },
  { name: 'Stack Buffer Overflow', value: 15 },
  { name: 'Null Pointer Dereference', value: 10 },
  { name: 'Integer Overflow', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Recent experiments mock data
const recentExperiments = [
  { id: 'exp-001', project: 'libxml2', fuzzer: 'libFuzzer', status: 'Completed', coverage: 84, crashes: 10, duration: '7 days' },
  { id: 'exp-002', project: 'libpng', fuzzer: 'AFL', status: 'In Progress', coverage: 56, crashes: 6, duration: '5 days' },
  { id: 'exp-003', project: 'openssl', fuzzer: 'Honggfuzz', status: 'Completed', coverage: 67, crashes: 5, duration: '7 days' },
  { id: 'exp-004', project: 'sqlite', fuzzer: 'libFuzzer', status: 'Failed', coverage: 0, crashes: 0, duration: '0 days' },
];

export default function Dashboard() {
  return (
    <Box>
      {/* Breadcrumbs navigation */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Typography color="text.primary">Dashboard</Typography>
      </Breadcrumbs>

      {/* Header with filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          OSS-Fuzz-Gen Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="time-period-label">Time Period</InputLabel>
            <Select
              labelId="time-period-label"
              id="time-period"
              label="Time Period"
              defaultValue="7d"
            >
              <MenuItem value="24h">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary">
            New Experiment
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3, mb: 3 }}>
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
          <Card className="dashboard-card" sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Experiments
              </Typography>
              <Typography variant="h4" component="div">
                128
              </Typography>
              <Typography color="textSecondary" sx={{ fontSize: 14 }}>
                12% increase from last month
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
          <Card className="dashboard-card" sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Experiments
              </Typography>
              <Typography variant="h4" component="div">
                24
              </Typography>
              <Typography color="textSecondary" sx={{ fontSize: 14 }}>
                3 added in the last 24 hours
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
          <Card className="dashboard-card" sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Crashes Found
              </Typography>
              <Typography variant="h4" component="div">
                256
              </Typography>
              <Typography color="textSecondary" sx={{ fontSize: 14 }}>
                32 in the last 7 days
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
          <Card className="dashboard-card" sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Coverage
              </Typography>
              <Typography variant="h4" component="div">
                72%
              </Typography>
              <Typography color="textSecondary" sx={{ fontSize: 14 }}>
                5% improvement from previous runs
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Charts */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3, mb: 3 }}>
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 8' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Coverage Trend by Fuzzer
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={coverageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="%" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="libFuzzer" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="AFL" stroke="#82ca9d" />
                <Line type="monotone" dataKey="Honggfuzz" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Crash Types Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={crashTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {crashTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
        <Box sx={{ gridColumn: 'span 12' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Crashes Trend by Fuzzer
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={crashesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="libFuzzer" fill="#8884d8" />
                <Bar dataKey="AFL" fill="#82ca9d" />
                <Bar dataKey="Honggfuzz" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>

      {/* Recent Experiments */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Experiments
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ minWidth: 800 }}>
            <Box sx={{ display: 'flex', fontWeight: 'bold', p: 2, borderBottom: '1px solid #e0e0e0' }}>
              <Box sx={{ width: '15%' }}>Experiment ID</Box>
              <Box sx={{ width: '20%' }}>Project</Box>
              <Box sx={{ width: '15%' }}>Fuzzer</Box>
              <Box sx={{ width: '15%' }}>Status</Box>
              <Box sx={{ width: '10%' }}>Coverage</Box>
              <Box sx={{ width: '10%' }}>Crashes</Box>
              <Box sx={{ width: '15%' }}>Duration</Box>
            </Box>
            {recentExperiments.map((exp) => (
              <Box 
                key={exp.id} 
                sx={{ 
                  display: 'flex', 
                  p: 2, 
                  '&:hover': { backgroundColor: '#f5f5f5' },
                  borderBottom: '1px solid #e0e0e0'
                }}
              >
                <Box sx={{ width: '15%' }}>{exp.id}</Box>
                <Box sx={{ width: '20%' }}>{exp.project}</Box>
                <Box sx={{ width: '15%' }}>{exp.fuzzer}</Box>
                <Box sx={{ width: '15%' }}>
                  <Chip 
                    label={exp.status} 
                    size="small" 
                    color={
                      exp.status === 'Completed' ? 'success' : 
                      exp.status === 'In Progress' ? 'primary' : 
                      'error'
                    } 
                  />
                </Box>
                <Box sx={{ width: '10%' }}>
                  {exp.status !== 'Failed' ? (
                    <>
                      {exp.coverage}%
                      <LinearProgress 
                        variant="determinate" 
                        value={exp.coverage} 
                        sx={{ mt: 1, height: 4 }} 
                      />
                    </>
                  ) : (
                    'N/A'
                  )}
                </Box>
                <Box sx={{ width: '10%' }}>{exp.crashes}</Box>
                <Box sx={{ width: '15%' }}>{exp.duration}</Box>
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button>View All Experiments</Button>
        </Box>
      </Paper>
    </Box>
  );
} 