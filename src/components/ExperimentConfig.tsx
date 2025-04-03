import { useState, type ReactNode } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Divider,
  Chip,
  Switch,
  FormControlLabel,
  Alert,
  Slider,
  Breadcrumbs,
  Link,
  FormHelperText,
  Tooltip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Code as CodeIcon,
  CloudUpload as CloudUploadIcon,
  PlayArrow as StartIcon,
  Save as SaveIcon
} from '@mui/icons-material';

// Mock data for project selections
const projectOptions = [
  { value: 'libxml2', label: 'libxml2' },
  { value: 'openssl', label: 'OpenSSL' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'libpng', label: 'libpng' },
  { value: 'zlib', label: 'zlib' },
  { value: 'curl', label: 'curl' },
  { value: 'imagemagick', label: 'ImageMagick' },
  { value: 'libtiff', label: 'libtiff' }
];

// Fuzzer options
const fuzzerOptions = [
  { value: 'libFuzzer', label: 'libFuzzer', description: 'LLVM in-process coverage-guided fuzzer' },
  { value: 'AFL', label: 'AFL', description: 'American Fuzzy Lop - evolutionary coverage-guided fuzzer' },
  { value: 'AFL++', label: 'AFL++', description: 'AFL with community patches, additions, and improvements' },
  { value: 'Honggfuzz', label: 'Honggfuzz', description: 'Security-oriented fuzzer with feedback-driven fuzzing capabilities' }
];

// GCP machine types
const machineTypes = [
  { value: 'e2-standard-2', label: 'E2 Standard 2', vCPUs: 2, memory: '8 GB', costPerHour: '$0.067' },
  { value: 'e2-standard-4', label: 'E2 Standard 4', vCPUs: 4, memory: '16 GB', costPerHour: '$0.134' },
  { value: 'e2-standard-8', label: 'E2 Standard 8', vCPUs: 8, memory: '32 GB', costPerHour: '$0.269' },
  { value: 'c2-standard-4', label: 'C2 Standard 4', vCPUs: 4, memory: '16 GB', costPerHour: '$0.210' },
  { value: 'c2-standard-8', label: 'C2 Standard 8', vCPUs: 8, memory: '32 GB', costPerHour: '$0.420' },
  { value: 'n2-standard-2', label: 'N2 Standard 2', vCPUs: 2, memory: '8 GB', costPerHour: '$0.097' },
  { value: 'n2-standard-4', label: 'N2 Standard 4', vCPUs: 4, memory: '16 GB', costPerHour: '$0.194' }
];

// Duration options
const durationOptions = [
  { value: '1h', label: '1 hour' },
  { value: '6h', label: '6 hours' },
  { value: '12h', label: '12 hours' },
  { value: '1d', label: '1 day' },
  { value: '3d', label: '3 days' },
  { value: '7d', label: '7 days' },
  { value: '14d', label: '14 days' },
  { value: '30d', label: '30 days' }
];

// Sanitizer options
const sanitizerOptions = [
  { value: 'address', label: 'AddressSanitizer (ASan)', description: 'Detects memory errors like buffer overflows, use-after-free, etc.' },
  { value: 'undefined', label: 'UndefinedBehaviorSanitizer (UBSan)', description: 'Detects undefined behavior like integer overflow' },
  { value: 'memory', label: 'MemorySanitizer (MSan)', description: 'Detects uninitialized memory reads' },
  { value: 'thread', label: 'ThreadSanitizer (TSan)', description: 'Detects data races and deadlocks' },
  { value: 'leak', label: 'LeakSanitizer (LSan)', description: 'Detects memory leaks' }
];

const steps = ['Project Setup', 'Fuzzing Configuration', 'Infrastructure', 'Review & Run'];

// Function to generate YAML from form data
const generateYaml = (formData: any): string => {
  let yaml = `# OSS-Fuzz-Gen Experiment Configuration
# Generated: ${new Date().toISOString()}

experiment:
  name: "${formData.name || formData.project}"
  project: "${formData.project}"
  description: "${formData.description || ''}"

fuzzing:
  fuzzer: "${formData.fuzzer}"
  sanitizers:
${formData.sanitizers ? formData.sanitizers.map((s: string) => `    - ${s}`).join('\n') : '    - address'}
  runtime: "${formData.runtime || formData.duration}"
  memory_limit: ${formData.memoryLimit}
  timeout: ${formData.timeout || formData.timeoutSeconds}
  dict_enabled: ${formData.dictEnabled || formData.useDictionary}

infrastructure:
  machine_type: "${formData.machineType}"
  instances: ${formData.instances || formData.numInstances}
  region: "${formData.region || 'us-central1'}"
  
advanced:
  build_flags: "${formData.buildFlags || formData.buildArgs || ''}"
  run_flags: "${formData.runFlags || ''}"
  seed_corpus_enabled: ${formData.seedCorpusEnabled || formData.useCorpus}
`;
  return yaml;
};

// Define the interface for our form data
interface ExperimentConfigData {
  project: string;
  fuzzer: string;
  name: string;
  description: string;
  sanitizers: string[];
  buildArgs: string;
  runFlags: string;
  buildFlags: string;
  machineType: string;
  numInstances: number;
  instances: number;
  duration: string;
  runtime: string;
  region: string;
  useCorpus: boolean;
  useDictionary: boolean;
  dictEnabled: boolean;
  seedCorpusEnabled: boolean;
  timeoutSeconds: number;
  timeout: number;
  memoryLimit: number;
}

function ExperimentConfig() {
  const [activeStep, setActiveStep] = useState(0);
  const [config, setConfig] = useState<ExperimentConfigData>({
    project: '',
    fuzzer: '',
    name: '',
    description: '',
    sanitizers: ['address'],
    buildArgs: '',
    runFlags: '',
    buildFlags: '',
    machineType: 'e2-standard-2',
    numInstances: 1,
    instances: 1,
    duration: '1d',
    runtime: '1d',
    region: 'us-central1',
    useCorpus: false,
    useDictionary: false,
    dictEnabled: true,
    seedCorpusEnabled: true,
    timeoutSeconds: 60,
    timeout: 25,
    memoryLimit: 2048,
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Handle select change
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const name = event.target.name as keyof ExperimentConfigData;
    const value = event.target.value;
    if (name) {
      setConfig({
        ...config,
        [name]: value,
      });
    }
  };

  // Handle text field change
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as keyof ExperimentConfigData;
    const value = event.target.value;
    if (name) {
      setConfig({
        ...config,
        [name]: value,
      });
    }
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as keyof ExperimentConfigData;
    const checked = event.target.checked;
    setConfig({
      ...config,
      [name]: checked,
    });
  };

  const handleSliderChange = (name: keyof ExperimentConfigData) => (_: Event, value: number | number[]) => {
    setConfig({
      ...config,
      [name]: value,
    });
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl required fullWidth sx={{ mb: 3 }}>
              <InputLabel id="project-label">Project</InputLabel>
              <Select
                labelId="project-label"
                id="project"
                name="project"
                value={config.project}
                label="Project"
                onChange={handleSelectChange}
              >
                {projectOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select the open-source project you want to fuzz. This will determine the codebase and build configuration used for fuzzing.
            </Typography>
            
            <Alert severity="info" sx={{ mt: 2 }}>
              Tip: Make sure the project has been properly integrated with OSS-Fuzz before creating an experiment.
            </Alert>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl required fullWidth sx={{ mb: 3 }}>
              <InputLabel id="fuzzer-label">Fuzzer</InputLabel>
              <Select
                labelId="fuzzer-label"
                id="fuzzer"
                name="fuzzer"
                value={config.fuzzer}
                label="Fuzzer"
                onChange={handleSelectChange}
              >
                {fuzzerOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box>
                      <Typography>{option.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Build Arguments"
              name="buildArgs"
              value={config.buildArgs}
              onChange={handleTextChange}
              placeholder="e.g. -fsanitize=address"
              sx={{ mb: 3 }}
              helperText="Additional arguments for the build process"
            />
            
            <TextField
              fullWidth
              label="Run Arguments"
              name="runFlags"
              value={config.runFlags}
              onChange={handleTextChange}
              placeholder="e.g. -max_len=1024"
              sx={{ mb: 3 }}
              helperText="Additional arguments for the fuzzer"
            />
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.useCorpus}
                    onChange={handleSwitchChange}
                    name="useCorpus"
                    color="primary"
                  />
                }
                label="Use existing corpus"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={config.useDictionary}
                    onChange={handleSwitchChange}
                    name="useDictionary"
                    color="primary"
                  />
                }
                label="Use dictionary"
              />
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl required fullWidth sx={{ mb: 3 }}>
              <InputLabel id="machine-type-label">Machine Type</InputLabel>
              <Select
                labelId="machine-type-label"
                id="machineType"
                name="machineType"
                value={config.machineType}
                label="Machine Type"
                onChange={handleSelectChange}
              >
                {machineTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box>
                      <Typography>{option.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.memory}, {option.vCPUs} vCPUs, {option.costPerHour}/hour
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Typography gutterBottom>Number of Instances</Typography>
            <Slider
              value={config.numInstances}
              onChange={handleSliderChange('numInstances')}
              aria-labelledby="num-instances-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={10}
              sx={{ mb: 4 }}
            />
            
            <FormControl required fullWidth sx={{ mb: 3 }}>
              <InputLabel id="duration-label">Duration</InputLabel>
              <Select
                labelId="duration-label"
                id="duration"
                name="duration"
                value={config.duration}
                label="Duration"
                onChange={handleSelectChange}
              >
                {durationOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Typography gutterBottom>Timeout (seconds)</Typography>
            <Slider
              value={config.timeoutSeconds}
              onChange={handleSliderChange('timeoutSeconds')}
              aria-labelledby="timeout-slider"
              valueLabelDisplay="auto"
              step={10}
              marks
              min={10}
              max={300}
              sx={{ mb: 4 }}
            />
            
            <Typography gutterBottom>Memory Limit (MB)</Typography>
            <Slider
              value={config.memoryLimit}
              onChange={handleSliderChange('memoryLimit')}
              aria-labelledby="memory-limit-slider"
              valueLabelDisplay="auto"
              step={512}
              marks
              min={512}
              max={8192}
              sx={{ mb: 3 }}
            />
            
            <Alert severity="warning" sx={{ mt: 2 }}>
              Higher resource allocations will result in increased costs. Please optimize your configuration.
            </Alert>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Experiment Configuration Summary
            </Typography>
            
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Basic Settings
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 30%', minWidth: '200px' }}>
                  <Typography variant="body2" color="text.secondary">
                    Project
                  </Typography>
                  <Typography>{projectOptions.find(p => p.value === config.project)?.label || '-'}</Typography>
                </Box>
                <Box sx={{ flex: '1 1 30%', minWidth: '200px' }}>
                  <Typography variant="body2" color="text.secondary">
                    Fuzzer
                  </Typography>
                  <Typography>{fuzzerOptions.find(f => f.value === config.fuzzer)?.label || '-'}</Typography>
                </Box>
                <Box sx={{ flex: '1 1 30%', minWidth: '200px' }}>
                  <Typography variant="body2" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography>{durationOptions.find(d => d.value === config.duration)?.label || '-'}</Typography>
                </Box>
              </Box>
            </Paper>
            
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Resource Configuration
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 30%', minWidth: '200px' }}>
                  <Typography variant="body2" color="text.secondary">
                    Machine Type
                  </Typography>
                  <Typography>{machineTypes.find(m => m.value === config.machineType)?.label || '-'}</Typography>
                </Box>
                <Box sx={{ flex: '1 1 30%', minWidth: '200px' }}>
                  <Typography variant="body2" color="text.secondary">
                    Number of Instances
                  </Typography>
                  <Typography>{config.numInstances}</Typography>
                </Box>
                <Box sx={{ flex: '1 1 30%', minWidth: '200px' }}>
                  <Typography variant="body2" color="text.secondary">
                    Memory Limit
                  </Typography>
                  <Typography>{config.memoryLimit} MB</Typography>
                </Box>
              </Box>
            </Paper>
            
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Advanced Options
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Build Arguments
                  </Typography>
                  <Typography fontFamily="monospace" sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                    {config.buildArgs || '(none)'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Run Arguments
                  </Typography>
                  <Typography fontFamily="monospace" sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                    {config.runFlags || '(none)'}
                  </Typography>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    {config.useCorpus && (
                      <Chip label="Using Corpus" color="primary" size="small" />
                    )}
                    {config.useDictionary && (
                      <Chip label="Using Dictionary" color="primary" size="small" />
                    )}
                  </Box>
                </Box>
              </Box>
            </Paper>
            
            <Alert severity="success" sx={{ mt: 3 }}>
              Your experiment is ready to be deployed to Google Cloud Platform.
            </Alert>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  // Dialog state
  const [yamlDialogOpen, setYamlDialogOpen] = useState(false);
  const [yamlContent, setYamlContent] = useState('');
  
  // Handle yaml dialog
  const handleYamlOpen = () => {
    const yaml = generateYaml(config);
    setYamlContent(yaml);
    setYamlDialogOpen(true);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // In a real app, this would submit the form data to the backend
    alert('Experiment configuration submitted!');
    // Generate YAML
    handleYamlOpen();
  };

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="/experiments">
          Experiments
        </Link>
        <Typography color="text.primary">New Experiment</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom>
        Configure New Experiment
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
            >
              Deploy Experiment
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!config.project && activeStep === 0 || !config.fuzzer && activeStep === 1}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Saved Templates
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Load a pre-configured experiment template
        </Typography>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {[
            { name: 'LibXML2 with libFuzzer', date: '2 days ago' },
            { name: 'OpenSSL with AFL++', date: '1 week ago' },
            { name: 'SQLite intensive fuzzing', date: '3 weeks ago' }
          ].map((template, index) => (
            <Box key={index} sx={{ flex: '1 1 30%', minWidth: '200px' }}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f9f9f9' },
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                <Typography variant="subtitle1" fontWeight="medium">
                  {template.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto', pt: 1 }}>
                  Last used: {template.date}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* YAML Dialog */}
      <Dialog
        open={yamlDialogOpen}
        onClose={() => setYamlDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          YAML Configuration
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            This YAML configuration can be used with OSS-Fuzz-Gen command-line tools.
          </Typography>
          <Box 
            component="pre" 
            sx={{ 
              bgcolor: '#f5f5f5', 
              p: 2, 
              borderRadius: 1, 
              overflow: 'auto',
              fontSize: '0.875rem',
              fontFamily: 'monospace'
            }}
          >
            {yamlContent}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setYamlDialogOpen(false)}>Close</Button>
          <Button 
            variant="contained"
            onClick={() => {
              navigator.clipboard.writeText(yamlContent);
              alert('YAML copied to clipboard!');
            }}
          >
            Copy to Clipboard
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ExperimentConfig; 