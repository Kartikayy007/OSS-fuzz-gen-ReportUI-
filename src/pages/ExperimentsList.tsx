import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  SearchIcon, FilterIcon, RefreshCwIcon, PlusIcon, 
  ChevronRightIcon, ArrowUpIcon, ArrowDownIcon 
} from 'lucide-react';

import Breadcrumbs from '../components/Breadcrumbs';

// Sample experiments data
const experimentsData = [
  {
    id: '1248',
    project: 'libxml2',
    startTime: '2023-06-15T08:00:00Z',
    status: 'completed',
    duration: '24h 15m',
    coverage: 87.5,
    crashes: 15,
    fuzzer: 'libFuzzer'
  },
  {
    id: '1247',
    project: 'libxml2',
    startTime: '2023-06-14T10:30:00Z',
    status: 'completed',
    duration: '22h 45m',
    coverage: 85.2,
    crashes: 12,
    fuzzer: 'AFL'
  },
  {
    id: '1246',
    project: 'curl',
    startTime: '2023-06-14T08:15:00Z',
    status: 'completed',
    duration: '24h 30m',
    coverage: 78.9,
    crashes: 8,
    fuzzer: 'Honggfuzz'
  },
  {
    id: '1245',
    project: 'openssl',
    startTime: '2023-06-13T14:20:00Z',
    status: 'completed',
    duration: '23h 10m',
    coverage: 82.1,
    crashes: 10,
    fuzzer: 'libFuzzer'
  },
  {
    id: '1244',
    project: 'sqlite',
    startTime: '2023-06-12T09:00:00Z',
    status: 'running',
    duration: '36h+',
    coverage: 76.3,
    crashes: 5,
    fuzzer: 'AFL++'
  }
];

const projects = ['All Projects', 'libxml2', 'curl', 'openssl', 'sqlite'];
const fuzzers = ['All Fuzzers', 'libFuzzer', 'AFL', 'AFL++', 'Honggfuzz'];
const statuses = ['All Statuses', 'Running', 'Completed', 'Failed'];

const ExperimentsList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [selectedFuzzer, setSelectedFuzzer] = useState('All Fuzzers');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [showFilters, setShowFilters] = useState(false);

  // Breadcrumb items for experiments list
  const breadcrumbItems = [
    { label: 'Experiments', path: '/experiments', active: true }
  ];

  // Filter experiments based on selected filters
  const filteredExperiments = experimentsData.filter(exp => {
    if (selectedProject !== 'All Projects' && exp.project !== selectedProject) return false;
    if (selectedFuzzer !== 'All Fuzzers' && exp.fuzzer !== selectedFuzzer) return false;
    if (selectedStatus !== 'All Statuses' && exp.status !== selectedStatus.toLowerCase()) return false;
    if (searchQuery && !exp.project.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !exp.id.includes(searchQuery)) return false;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header Section */}
      <div className="px-6 py-4 bg-white shadow-sm border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Experiments</h1>
            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredExperiments.length} of {experimentsData.length} experiments
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
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <FilterIcon className="h-4 w-4" />
              <span>Filters</span>
            </button>
            <button className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <RefreshCwIcon className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              <span>New Experiment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
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
              
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={() => {
                setSelectedProject('All Projects');
                setSelectedFuzzer('All Fuzzers');
                setSelectedStatus('All Statuses');
                setSearchQuery('');
              }}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Experiments Table */}
      <div className="flex-1 p-6">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coverage
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Crashes
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fuzzer
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExperiments.map((experiment) => (
                  <tr key={experiment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link to={`/experiments/${experiment.id}`}>
                        #{experiment.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {experiment.project}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(experiment.startTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        experiment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        experiment.status === 'running' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {experiment.status.charAt(0).toUpperCase() + experiment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {experiment.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span className="mr-2">{experiment.coverage}%</span>
                        {experiment.coverage > 80 ? (
                          <ArrowUpIcon className="h-4 w-4 text-green-500" />
                        ) : experiment.coverage < 70 ? (
                          <ArrowDownIcon className="h-4 w-4 text-red-500" />
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {experiment.crashes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {experiment.fuzzer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/experiments/${experiment.id}`} 
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {filteredExperiments.length === 0 && (
          <div className="mt-6 text-center py-8">
            <p className="text-gray-500">No experiments match your filters. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperimentsList; 