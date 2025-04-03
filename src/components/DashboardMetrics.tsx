import { useState } from 'react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, AreaChart, Area, 
  XAxis, YAxis, ZAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { ArrowUpIcon, ArrowDownIcon, SearchIcon, FilterIcon, DownloadIcon, RefreshCwIcon, ChevronRightIcon } from 'lucide-react';

// Color palette constants
const COLORS = {
  primary: '#4285F4',    // Google Blue
  secondary: '#EA4335',  // Google Red
  tertiary: '#34A853',   // Google Green
  quaternary: '#FBBC05', // Google Yellow
  success: '#34A853',
  danger: '#EA4335',
  warning: '#FBBC05',
  info: '#4285F4',
  gray: '#9AA0A6'
};

// Enhanced mock data
const coverageTrendData = [
  { timestamp: '03/01 00:00', libFuzzer: 65, AFL: 45, Honggfuzz: 55, totalPaths: 1200, newPaths: 50 },
  { timestamp: '03/01 06:00', libFuzzer: 68, AFL: 48, Honggfuzz: 58, totalPaths: 1450, newPaths: 45 },
  { timestamp: '03/01 12:00', libFuzzer: 72, AFL: 52, Honggfuzz: 60, totalPaths: 1600, newPaths: 40 },
  { timestamp: '03/01 18:00', libFuzzer: 76, AFL: 56, Honggfuzz: 63, totalPaths: 1800, newPaths: 35 },
  { timestamp: '03/02 00:00', libFuzzer: 80, AFL: 60, Honggfuzz: 67, totalPaths: 2000, newPaths: 30 },
  { timestamp: '03/02 06:00', libFuzzer: 82, AFL: 63, Honggfuzz: 70, totalPaths: 2150, newPaths: 25 },
  { timestamp: '03/02 12:00', libFuzzer: 85, AFL: 67, Honggfuzz: 72, totalPaths: 2300, newPaths: 20 },
  { timestamp: '03/02 18:00', libFuzzer: 87, AFL: 70, Honggfuzz: 75, totalPaths: 2400, newPaths: 15 },
];

const coverageMetrics = {
  lineRate: { current: 87.5, previous: 82.3 },
  branchRate: { current: 75.2, previous: 71.8 },
  functionRate: { current: 92.1, previous: 88.5 },
  complexity: { current: 4.2, previous: 4.5 }
};

const crashSeverityData = [
  { name: 'Critical', value: 15, color: COLORS.danger },
  { name: 'High', value: 25, color: '#F66B4E' },
  { name: 'Medium', value: 45, color: COLORS.warning },
  { name: 'Low', value: 15, color: COLORS.success }
];

const crashClusterData = Array.from({ length: 20 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 50 + 10,
  cluster: Math.floor(Math.random() * 4),
  id: `crash-${i + 1}`
}));

const resourceMetrics = [
  { metric: 'Executions/sec', value: 4200, trend: 'up', change: 12.5 },
  { metric: 'CPU Usage (%)', value: 85.2, trend: 'neutral', change: 0.5 },
  { metric: 'Memory (GB)', value: 4.8, trend: 'down', change: -2.1 },
  { metric: 'Disk I/O (MB/s)', value: 156.3, trend: 'up', change: 8.7 }
];

const fuzzerEfficiencyData = [
  { attribute: 'Speed', libFuzzer: 90, AFL: 75, Honggfuzz: 85 },
  { attribute: 'Coverage', libFuzzer: 85, AFL: 70, Honggfuzz: 80 },
  { attribute: 'Crash Finding', libFuzzer: 75, AFL: 85, Honggfuzz: 70 },
  { attribute: 'Memory Usage', libFuzzer: 65, AFL: 80, Honggfuzz: 75 },
  { attribute: 'CPU Usage', libFuzzer: 70, AFL: 75, Honggfuzz: 80 }
];

const projects = ['All Projects', 'libxml2', 'libpng', 'curl', 'openssl', 'sqlite'];
const fuzzers = ['All Fuzzers', 'libFuzzer', 'AFL', 'AFL++', 'Honggfuzz'];
const dateRanges = ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Custom Range'];

export default function DashboardMetrics() {
  const [activeTab, setActiveTab] = useState<'coverage' | 'crash' | 'performance'>('coverage');
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [selectedFuzzer, setSelectedFuzzer] = useState('All Fuzzers');
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Enhanced summary metrics
  const summaryMetrics = [
    {
      key: 'totalExperiments',
      label: 'Total Experiments',
      value: '1,248',
      change: '+12.5%',
      trend: 'up'
    },
    {
      key: 'avgCoverage',
      label: 'Avg. Coverage',
      value: '72.4%',
      change: '+5.2%',
      trend: 'up'
    },
    {
      key: 'criticalCrashes',
      label: 'Critical Crashes',
      value: '38',
      change: '-8.3%',
      trend: 'down'
    },
    {
      key: 'execSpeed',
      label: 'Exec. Speed',
      value: '4.2K/s',
      change: '+15.7%',
      trend: 'up'
    }
  ];

  // Add state for sliding tab indicator
  const [tabIndicatorStyle, setTabIndicatorStyle] = useState({ left: 0, width: 0 });
  
  // Update tab change handler to include sliding animation
  const handleTabChange = (tab: 'coverage' | 'crash' | 'performance', event: React.MouseEvent<HTMLButtonElement>) => {
    setActiveTab(tab);
    // Update the sliding indicator position
    const button = event.currentTarget;
    setTabIndicatorStyle({
      left: button.offsetLeft,
      width: button.offsetWidth,
    });
  };

  // Function to determine bar color based on crash count
  const getCrashBarColor = (crashes: number): string => {
    return crashes > 8 ? '#ef4444' : '#6366f1';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <a href="/" className="text-gray-500 hover:text-gray-700">Dashboard</a>
              </li>
              <li className="flex items-center">
                <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-1" />
                <a href="/metrics" className="text-gray-500 hover:text-gray-700">Metrics</a>
              </li>
              <li className="flex items-center">
                <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-1" />
                <span className="text-gray-900 font-medium">{selectedProject}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Header Section */}
      <div className="px-6 py-4 bg-white shadow-sm border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fuzzing Metrics Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Insights for {selectedProject} • {selectedFuzzer}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search experiments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64"
              />
              <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <button className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <RefreshCwIcon className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <DownloadIcon className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <select 
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
            >
              {projects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
            
            <select 
              value={selectedFuzzer}
              onChange={(e) => setSelectedFuzzer(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
            >
              {fuzzers.map(fuzzer => (
                <option key={fuzzer} value={fuzzer}>{fuzzer}</option>
              ))}
            </select>
          </div>
          
          <div className="ml-auto flex items-center gap-2">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
            >
              {dateRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <FilterIcon className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryMetrics.map((metric) => (
            <div key={metric.key} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {metric.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${
                  metric.trend === 'up' ? 'bg-green-100' : 
                  metric.trend === 'down' ? 'bg-red-100' : 
                  'bg-blue-100'
                }`}>
                  {metric.trend === 'up' ? <ArrowUpIcon className="h-6 w-6 text-green-600" /> :
                   metric.trend === 'down' ? <ArrowDownIcon className="h-6 w-6 text-red-600" /> :
                   null}
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">vs previous period</span>
                  <span className={`flex items-center ${
                    metric.trend === 'up' ? 'text-green-600' :
                    metric.trend === 'down' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Improved Tabs Navigation */}
        <div className="relative border-b border-gray-200">
          <nav className="flex space-x-8" aria-label="Tabs">
            {['coverage', 'crash', 'performance'].map((tab) => (
              <button
                key={tab}
                onClick={(e) => handleTabChange(tab as any, e)}
                className={`group relative min-w-0 flex-1 overflow-hidden py-4 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10 focus:outline-none ${
                  activeTab === tab
                    ? 'text-black  bg-white'
                    : 'text-black hover:text-gray-700 bg-white'
                }`}
                aria-current={activeTab === tab ? 'page' : undefined}
              >
                <span>{tab.charAt(0).toUpperCase() + tab.slice(1)} Analysis</span>
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-0.5 ${
                    activeTab === tab ? 'bg-blue-600' : 'bg-transparent'
                  }`}
                />
              </button>
            ))}
          </nav>
          {/* Sliding Indicator */}
          <div
            className="absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300"
            style={{ left: tabIndicatorStyle.left, width: tabIndicatorStyle.width }}
          />
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Coverage Tab */}
          {activeTab === 'coverage' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Coverage Trend */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Coverage Progression</h3>
                  <div className="flex gap-2">
                    <button className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded">Line</button>
                    <button className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded">Branch</button>
                    <button className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded">Function</button>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={coverageTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="timestamp" />
                      <YAxis domain={[0, 100]} />
                      <RechartsTooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="libFuzzer" 
                        stroke={COLORS.primary}
                        strokeWidth={2}
                        dot={{ r: 4, fill: COLORS.primary }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="AFL" 
                        stroke={COLORS.secondary}
                        strokeWidth={2}
                        dot={{ r: 4, fill: COLORS.secondary }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Honggfuzz" 
                        stroke={COLORS.tertiary}
                        strokeWidth={2}
                        dot={{ r: 4, fill: COLORS.tertiary }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Fuzzer Efficiency */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuzzer Efficiency</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={140} width={500} height={300} data={fuzzerEfficiencyData}>
                      <PolarGrid stroke={COLORS.gray} />
                      <PolarAngleAxis dataKey="attribute" stroke="#374151" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#374151" />
                      <Radar 
                        name="libFuzzer" 
                        dataKey="libFuzzer" 
                        stroke={COLORS.primary} 
                        fill={COLORS.primary} 
                        fillOpacity={0.4} 
                      />
                      <Radar 
                        name="AFL" 
                        dataKey="AFL" 
                        stroke={COLORS.secondary} 
                        fill={COLORS.secondary} 
                        fillOpacity={0.4} 
                      />
                      <Radar 
                        name="Honggfuzz" 
                        dataKey="Honggfuzz" 
                        stroke={COLORS.tertiary} 
                        fill={COLORS.tertiary} 
                        fillOpacity={0.4} 
                      />
                      <Legend 
                        wrapperStyle={{
                          paddingTop: '20px'
                        }}
                      />
                      <RechartsTooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Coverage Details */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Coverage Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(coverageMetrics).map(([key, data]) => (
                    <div key={key} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="mt-2 text-2xl font-semibold text-gray-900">{data.current}%</p>
                      <div className="mt-2 flex items-center text-sm">
                        <span className={data.current > data.previous ? 'text-green-600' : 'text-red-600'}>
                          {data.current > data.previous ? '↑' : '↓'} {Math.abs(data.current - data.previous).toFixed(1)}%
                        </span>
                        <span className="ml-2 text-gray-500">vs prev.</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Crash Tab */}
          {activeTab === 'crash' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Crash Timeline */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Crash Timeline</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid />
                      <XAxis type="number" dataKey="x" name="Time" />
                      <YAxis type="number" dataKey="y" name="Impact" />
                      <ZAxis type="number" dataKey="size" range={[100, 1000]} />
                      <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Crashes" data={crashClusterData} fill="#6366f1" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Crash Severity */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Crash Severity Distribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={crashSeverityData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                      >
                        {crashSeverityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Resource Usage */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Usage</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={resourceMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="value" fill={COLORS.primary}>
                        {resourceMetrics.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            fill={entry.trend === 'up' ? COLORS.success : 
                                 entry.trend === 'down' ? COLORS.danger : 
                                 COLORS.primary}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Execution Efficiency */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Execution Efficiency</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={coverageTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <RechartsTooltip />
                      <Area
                        type="monotone"
                        dataKey="totalPaths"
                        name="Total Paths"
                        stroke={COLORS.primary}
                        fill={COLORS.primary}
                        fillOpacity={0.2}
                      />
                      <Area
                        type="monotone"
                        dataKey="newPaths"
                        name="New Paths"
                        stroke={COLORS.tertiary}
                        fill={COLORS.tertiary}
                        fillOpacity={0.2}
                      />
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper component for metric items
const MetricItem = ({ label, value, trend }: { label: string; value: string; trend: 'up' | 'down' | 'neutral' }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <span className="text-gray-600">{label}</span>
    <div className="flex items-center gap-2">
      <span className="font-medium">{value}</span>
      {trend === 'up' && <ArrowUpIcon className="w-4 h-4 text-green-600" />}
      {trend === 'down' && <ArrowDownIcon className="w-4 h-4 text-red-600" />}
    </div>
  </div>
);
