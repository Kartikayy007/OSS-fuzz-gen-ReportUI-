import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  InputAdornment, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Breadcrumbs,
  Link,
  Tooltip,
  Badge,
  LinearProgress,
  Alert,
  Stack
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterAlt as FilterIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';

// Mock data for experiments
const mockExperiments = [
  { 
    id: 'Experiment #1248', 
    name: 'libxml2 Fuzzing with LibFuzzer', 
    project: 'libxml2', 
    fuzzer: 'LibFuzzer', 
    status: 'Completed', 
    date: '2024-04-01', 
    duration: '7 days',
    coverage: 84, 
    crashes: 10, 
    tags: ['high-priority', 'production']
  },
  { 
    id: 'Experiment #1249', 
    name: 'libpng AFL Fuzzing Campaign', 
    project: 'libpng', 
    fuzzer: 'AFL', 
    status: 'In Progress', 
    date: '2024-04-02', 
    duration: '3 days',
    coverage: 56, 
    crashes: 6, 
    tags: ['automated']
  },
  { 
    id: 'Experiment #1250', 
    name: 'OpenSSL Honggfuzz Run', 
    project: 'openssl', 
    fuzzer: 'Honggfuzz', 
    status: 'Completed', 
    date: '2024-03-15', 
    duration: '5 days',
    coverage: 67, 
    crashes: 5, 
    tags: ['high-priority', 'security-audit']
  },
  { 
    id: 'Experiment #1251', 
    name: 'SQLite LibFuzzer Testing', 
    project: 'sqlite', 
    fuzzer: 'LibFuzzer', 
    status: 'Failed', 
    date: '2024-03-10', 
    duration: '0 days',
    coverage: 0, 
    crashes: 0, 
    tags: ['experimental']
  },
  { 
    id: 'Experiment #1252', 
    name: 'zlib AFL++ Analysis', 
    project: 'zlib', 
    fuzzer: 'AFL++', 
    status: 'Completed', 
    date: '2024-02-28', 
    duration: '10 days',
    coverage: 72, 
    crashes: 3, 
    tags: ['long-running']
  },
  { 
    id: 'Experiment #1253', 
    name: 'curl Vulnerability Hunt', 
    project: 'curl', 
    fuzzer: 'LibFuzzer', 
    status: 'Scheduled', 
    date: '2024-04-12', 
    duration: 'Pending',
    coverage: 0, 
    crashes: 0, 
    tags: ['high-priority', 'security-audit']
  },
  { 
    id: 'Experiment #1254', 
    name: 'ffmpeg Format Fuzzing', 
    project: 'ffmpeg', 
    fuzzer: 'Hongfuzz', 
    status: 'Completed', 
    date: '2024-03-05', 
    duration: '10 days',
    coverage: 63, 
    crashes: 15, 
    tags: ['media', 'high-priority']
  },
  { 
    id: 'Experiment #1255', 
    name: 'OpenJPEG Memory Testing', 
    project: 'openjpeg', 
    fuzzer: 'LibFuzzer', 
    status: 'In Progress', 
    date: '2024-04-01', 
    duration: '2 days',
    coverage: 45, 
    crashes: 2, 
    tags: ['automated', 'media']
  }
];

// Filter options
const projects = ['All Projects', 'libxml2', 'libpng', 'openssl', 'sqlite', 'zlib', 'curl', 'ffmpeg', 'openjpeg'];
const fuzzers = ['All Fuzzers', 'LibFuzzer', 'AFL', 'AFL++', 'Honggfuzz'];
const statuses = ['All Statuses', 'Completed', 'In Progress', 'Failed', 'Scheduled'];
const timeRanges = ['Any Time', 'Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days'];

export default function ExperimentReports() {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [project, setProject] = useState('All Projects');
  const [fuzzer, setFuzzer] = useState('All Fuzzers');
  const [status, setStatus] = useState('All Statuses');
  const [timeRange, setTimeRange] = useState('Any Time');
  const [activeFilters, setActiveFilters] = useState(0);
  const [experiments, setExperiments] = useState(mockExperiments);
  const [filteredExperiments, setFilteredExperiments] = useState(mockExperiments);
  const [isSearching, setIsSearching] = useState(false);

  // Filter experiments when criteria change
  useEffect(() => {
    setIsSearching(true);
    
    // Simulate a brief delay to show the searching state
    const timer = setTimeout(() => {
      const filtered = experiments.filter((exp) => {
        // Search query filter
        const matchesSearch = searchQuery === '' || 
          exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exp.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exp.fuzzer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (exp.tags && exp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
        
        // Project filter
        const matchesProject = project === 'All Projects' || exp.project === project;
        
        // Fuzzer filter
        const matchesFuzzer = fuzzer === 'All Fuzzers' || exp.fuzzer === fuzzer;
        
        // Status filter
        const matchesStatus = status === 'All Statuses' || exp.status === status;
        
        // Time range filter (simplified for demo)
        // In a real app, you would compare dates properly
        const matchesTimeRange = timeRange === 'Any Time' || true;
        
        return matchesSearch && matchesProject && matchesFuzzer && matchesStatus && matchesTimeRange;
      });
      
      setFilteredExperiments(filtered);
      setIsSearching(false);
      
      // Count active filters
      let count = 0;
      if (searchQuery) count++;
      if (project !== 'All Projects') count++;
      if (fuzzer !== 'All Fuzzers') count++;
      if (status !== 'All Statuses') count++;
      if (timeRange !== 'Any Time') count++;
      setActiveFilters(count);
      
    }, 500); // Short delay for better UX
    
    return () => clearTimeout(timer);
  }, [searchQuery, project, fuzzer, status, timeRange, experiments]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setProject('All Projects');
    setFuzzer('All Fuzzers');
    setStatus('All Statuses');
    setTimeRange('Any Time');
  };

  // Handle search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Box>
      {/* Breadcrumbs navigation */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Typography color="text.primary">Experiment Reports</Typography>
      </Breadcrumbs>
      
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Experiment Reports
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          href="/experiments/new"
        >
          New Experiment
        </Button>
      </Box>

      {/* Search and Filter Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 2,
          border: '1px solid #e0e0e0',
        }}
      >
        <Grid container spacing={2}>
          {/* Main search box */}
          <Grid lg={6} md={6} sm={12} xs={12}>
            <TextField
              fullWidth
              placeholder="Search experiments by name, ID, project or tags..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          
          {/* Filter buttons/panel toggle */}
          <Grid lg={6} md={6} sm={12} xs={12}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
              <Badge badgeContent={activeFilters} color="primary" sx={{ '& .MuiBadge-badge': { top: 8, right: 8 } }}>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel id="project-label">Project</InputLabel>
                  <Select
                    labelId="project-label"
                    value={project}
                    label="Project"
                    onChange={(e) => setProject(e.target.value)}
                  >
                    {projects.map(p => (
                      <MenuItem key={p} value={p}>{p}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Badge>
              
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="fuzzer-label">Fuzzer</InputLabel>
                <Select
                  labelId="fuzzer-label"
                  value={fuzzer}
                  label="Fuzzer"
                  onChange={(e) => setFuzzer(e.target.value)}
                >
                  {fuzzers.map(f => (
                    <MenuItem key={f} value={f}>{f}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  value={status}
                  label="Status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {statuses.map(s => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="time-label">Time Range</InputLabel>
                <Select
                  labelId="time-label"
                  value={timeRange}
                  label="Time Range"
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  {timeRanges.map(t => (
                    <MenuItem key={t} value={t}>{t}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {activeFilters > 0 && (
                <Button 
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Active filters visualization */}
      {activeFilters > 0 && (
        <Box sx={{ mb: 3 }}>
        
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {searchQuery && (
              <Chip 
                label={`Search: "${searchQuery}"`} 
                onDelete={() => setSearchQuery('')} 
                color="primary" 
                variant="outlined"
              />
            )}
            {project !== 'All Projects' && (
              <Chip 
                label={`Project: ${project}`} 
                onDelete={() => setProject('All Projects')} 
                color="primary" 
                variant="outlined"
              />
            )}
            {fuzzer !== 'All Fuzzers' && (
              <Chip 
                label={`Fuzzer: ${fuzzer}`} 
                onDelete={() => setFuzzer('All Fuzzers')} 
                color="primary" 
                variant="outlined"
              />
            )}
            {status !== 'All Statuses' && (
              <Chip 
                label={`Status: ${status}`} 
                onDelete={() => setStatus('All Statuses')} 
                color="primary" 
                variant="outlined"
              />
            )}
            {timeRange !== 'Any Time' && (
              <Chip 
                label={`Time: ${timeRange}`} 
                onDelete={() => setTimeRange('Any Time')} 
                color="primary" 
                variant="outlined"
              />
            )}
          </Stack>
        </Box>
      )}
      
      {/* Results count and loading indicator */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {isSearching 
            ? "Searching..." 
            : `Showing ${filteredExperiments.length} of ${experiments.length} experiments`}
        </Typography>
      </Box>
      
      {isSearching && <LinearProgress sx={{ mb: 2 }} />}
      
      {/* Results display */}
      {filteredExperiments.length > 0 ? (
        <TableContainer component={Paper} sx={{ mb: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Fuzzer</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Coverage</TableCell>
                <TableCell>Crashes</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExperiments.map((exp) => (
                <TableRow 
                  key={exp.id} 
                  sx={{ 
                    '&:hover': { backgroundColor: '#f9f9f9' },
                    borderLeft: exp.status === 'In Progress' 
                      ? '4px solid #1976d2' 
                      : exp.status === 'Failed' 
                        ? '4px solid #d32f2f' 
                        : exp.status === 'Completed' 
                          ? '4px solid #2e7d32' 
                          : '4px solid #ed6c02'
                  }}
                >
                  <TableCell>{exp.id}</TableCell>
                  <TableCell>
                    <Link href={`/experiments/${exp.id}`} underline="hover" color="primary" sx={{ fontWeight: 500 }}>
                      {exp.name}
                    </Link>
                  </TableCell>
                  <TableCell>{exp.project}</TableCell>
                  <TableCell>{exp.fuzzer}</TableCell>
                  <TableCell>
                    <Chip 
                      label={exp.status} 
                      size="small" 
                      color={
                        exp.status === 'Completed' ? 'success' : 
                        exp.status === 'In Progress' ? 'primary' : 
                        exp.status === 'Failed' ? 'error' :
                        'warning'
                      }
                    />
                  </TableCell>
                  <TableCell>{exp.date}</TableCell>
                  <TableCell>
                    {exp.status !== 'Failed' && exp.status !== 'Scheduled' ? (
                      <>
                        {exp.coverage}%
                        <LinearProgress 
                          variant="determinate" 
                          value={exp.coverage} 
                          sx={{ mt: 1, height: 4, borderRadius: 2 }} 
                        />
                      </>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>{exp.crashes}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {exp.tags && exp.tags.map((tag) => (
                        <Chip 
                          key={tag} 
                          label={tag} 
                          size="small" 
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <Tooltip title="View Details">
                        <IconButton size="small" href={`/experiments/${exp.id}`}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download Report">
                        <IconButton size="small">
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Alert 
          severity="info" 
          action={
            <Button color="inherit" size="small" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          }
        >
          No experiments match your search criteria.
        </Alert>
      )}
    </Box>
  );
} 