import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ChartIcon, FileTextIcon, CodeIcon, BugIcon, 
  ClockIcon, ServerIcon, DownloadIcon, RefreshCwIcon
} from 'lucide-react';

import Breadcrumbs from '../components/Breadcrumbs';

// Sample experiment data (would be fetched from API in real implementation)
const experimentData = {
  id: '1248',
  project: 'libxml2',
  startTime: '2023-06-15T08:00:00Z',
  status: 'completed',
  duration: '24h 15m',
  coverage: {
    lines: 87.5,
    branches: 75.2,
    functions: 92.1
  },
  crashes: {
    total: 15,
    critical: 3,
    high: 5,
    medium: 6,
    low: 1
  },
  fuzzers: ['libFuzzer', 'AFL', 'Honggfuzz'],
  resources: {
    cpuCores: 8,
    memoryGb: 16,
    diskGb: 50
  }
};

const ExperimentDetail: React.FC = () => {
  const { experimentId } = useParams<{ experimentId: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'coverage' | 'crashes' | 'logs'>('overview');

  // Breadcrumb items for this experiment
  const breadcrumbItems = [
    { label: 'Experiments', path: '/experiments' },
    { label: experimentData.project, path: `/experiments/project/${experimentData.project}` },
    { label: `Experiment #${experimentData.id}`, path: '', active: true }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />
      
      {/* Header Section */}
      <div className="px-6 py-4 bg-white shadow-sm border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Experiment #{experimentData.id} - {experimentData.project}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Started on {new Date(experimentData.startTime).toLocaleString()} • Duration: {experimentData.duration}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              experimentData.status === 'completed' ? 'bg-green-100 text-green-800' :
              experimentData.status === 'running' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {experimentData.status.charAt(0).toUpperCase() + experimentData.status.slice(1)}
            </span>
            <button className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <RefreshCwIcon className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <DownloadIcon className="h-4 w-4" />
              <span>Export Results</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="px-6 pt-4">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: ChartIcon },
              { id: 'coverage', label: 'Coverage', icon: FileTextIcon },
              { id: 'crashes', label: 'Crashes', icon: BugIcon },
              { id: 'logs', label: 'Logs', icon: CodeIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`group inline-flex items-center py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className={`mr-2 h-5 w-5 ${
                  activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Experiment Summary */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Experiment Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Project</span>
                  <span className="font-medium">{experimentData.project}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="font-medium capitalize">{experimentData.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Start Time</span>
                  <span className="font-medium">{new Date(experimentData.startTime).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium">{experimentData.duration}</span>
                </div>
              </div>
            </div>

            {/* Fuzzer Information */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuzzers</h3>
              <div className="space-y-4">
                {experimentData.fuzzers.map(fuzzer => (
                  <div key={fuzzer} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">{fuzzer}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Resources */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <ServerIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-500 mr-2">CPU Cores:</span>
                  <span className="font-medium">{experimentData.resources.cpuCores}</span>
                </div>
                <div className="flex items-center">
                  <ServerIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-500 mr-2">Memory:</span>
                  <span className="font-medium">{experimentData.resources.memoryGb} GB</span>
                </div>
                <div className="flex items-center">
                  <ServerIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-500 mr-2">Disk:</span>
                  <span className="font-medium">{experimentData.resources.diskGb} GB</span>
                </div>
              </div>
            </div>
            
            {/* Coverage Metrics */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Coverage Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Line Coverage</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{experimentData.coverage.lines}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Branch Coverage</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{experimentData.coverage.branches}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Function Coverage</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{experimentData.coverage.functions}%</p>
                </div>
              </div>
            </div>
            
            {/* Crash Summary */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Crash Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-red-600 font-medium">Critical</span>
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-lg">{experimentData.crashes.critical}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-600 font-medium">High</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-lg">{experimentData.crashes.high}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-600 font-medium">Medium</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-lg">{experimentData.crashes.medium}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-medium">Low</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-lg">{experimentData.crashes.low}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Placeholder for other tabs */}
        {activeTab === 'coverage' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Coverage Analysis</h3>
            <p className="text-gray-500">Detailed coverage information would be displayed here.</p>
          </div>
        )}
        
        {activeTab === 'crashes' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Crash Analysis</h3>
            <p className="text-gray-500">Detailed crash information would be displayed here.</p>
          </div>
        )}
        
        {activeTab === 'logs' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Experiment Logs</h3>
            <p className="text-gray-500">Experiment logs would be displayed here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperimentDetail; 