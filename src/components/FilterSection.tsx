import { useState } from 'react';
import { Filter, X, Search } from 'lucide-react';
import { CATEGORY_SPECS } from '../data/categorySpecs';

export interface FilterValues {
  priceMin?: number;
  priceMax?: number;
  location?: string;
  category?: string;
  condition?: string;
}

interface FilterSectionProps {
  onApplyFilters: (filters: FilterValues) => void;
  onSaveSearch?: (query: string, filters: FilterValues) => void;
  initialFilters?: FilterValues;
  searchQuery?: string;
}

export const FilterSection = ({ 
  onApplyFilters, 
  onSaveSearch,
  initialFilters = {},
  searchQuery = ''
}: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const [query, setQuery] = useState(searchQuery);

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
  const categories = CATEGORY_SPECS.map(spec => spec.category);

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const handleSaveSearch = () => {
    if (onSaveSearch) {
      onSaveSearch(query, filters);
    }
  };

  const clearFilters = () => {
    setFilters({});
    onApplyFilters({});
  };

  return (
    <div className="mb-6">
      {/* Search and Filter Bar */}
      <div className="flex gap-2 mb-2">
        <div className="flex-1 relative">
          <input
            type="search"
            placeholder="Search products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <Filter className="w-5 h-5" />
          <span>Filter</span>
        </button>
      </div>

      {/* Active Filters Display */}
      {Object.keys(filters).length > 0 && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          <button
            onClick={clearFilters}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        </div>
      )}

      {/* Filter Panel */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-lg p-4 space-y-4 mt-2">
          {/* Price Range */}
          <div>
            <h3 className="font-medium mb-2">Price Range (AED)</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceMin || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, priceMin: Number(e.target.value) }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.priceMax || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, priceMax: Number(e.target.value) }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="font-medium mb-2">Location</h3>
            <input
              type="text"
              placeholder="Enter location"
              value={filters.location || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
            />
          </div>

          {/* Category */}
          <div>
            <h3 className="font-medium mb-2">Category</h3>
            <select
              value={filters.category || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <h3 className="font-medium mb-2">Condition</h3>
            <select
              value={filters.condition || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
            >
              <option value="">Any Condition</option>
              {conditions.map(condition => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleApplyFilters}
              className="flex-1 bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition-colors"
            >
              Apply Filters
            </button>
            {onSaveSearch && (
              <button
                onClick={handleSaveSearch}
                className="flex-1 border border-sky-600 text-sky-600 py-2 rounded-lg hover:bg-sky-50 transition-colors"
              >
                Save Search
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};