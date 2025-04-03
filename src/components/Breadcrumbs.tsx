import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="px-6 py-3">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link 
                to="/" 
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <HomeIcon className="h-4 w-4 mr-1" />
                <span>Home</span>
              </Link>
            </li>
            
            {items.map((item, index) => (
              <li key={index} className="flex items-center">
                <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-1" />
                {item.active ? (
                  <span className="text-gray-900 font-medium">{item.label}</span>
                ) : (
                  <Link 
                    to={item.path} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumbs; 