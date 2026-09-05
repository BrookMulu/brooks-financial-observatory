'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchIncomeStatement } from '@/app/services/fmpService';
import table from '@/app/model/table';

export default function TableComponent() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    startDate: '', 
    endDate: '', 
    minRevenue: '', 
    maxRevenue: '', 
    minNetIncome: '', 
    maxNetIncome: '',
  });

  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  useEffect(() => {
    let active = true;
    const getData = async () => {
      try {
        const result = await fetchIncomeStatement('AAPL', 'annual');
        if (active) setData(result);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load income statement data');
      } finally {
        if (active) setLoading(false);
      }
    };

    getData();
    return () => { active = false; };
  }, []);

  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (filters.startDate) {
      filtered = filtered.filter(
        (row) => new Date(row.date).getFullYear() >= Number(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (row) => new Date(row.date).getFullYear() <= Number(filters.endDate)
      );
    }

    if (filters.minRevenue) {
      filtered = filtered.filter((row) => row.revenue >= Number(filters.minRevenue));
    }
    if (filters.maxRevenue) {
      filtered = filtered.filter((row) => row.revenue <= Number(filters.maxRevenue));
    }

    if (filters.minNetIncome) {
      filtered = filtered.filter((row) => row.netIncome >= Number(filters.minNetIncome));
    }
    if (filters.maxNetIncome) {
      filtered = filtered.filter((row) => row.netIncome <= Number(filters.maxNetIncome));
    }

    if (!sortConfig.key) return filtered;

    const sortedData = [...filtered].sort((a, b) => {
      if (sortConfig.key === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        const valueA = a[sortConfig.key] || 0;
        const valueB = b[sortConfig.key] || 0;
        return sortConfig.direction === 'asc' ? valueA - valueB : valueB - valueA;
      }
    });

    return sortedData;
  }, [filters, data, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Income Statement</h1>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Start Year:</label>
          <input
            type="number"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="2020"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">End Year:</label>
          <input
            type="number"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="2024"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Min Revenue:</label>
          <input
            type="number"
            name="minRevenue"
            value={filters.minRevenue}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="Min Revenue"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Max Revenue:</label>
          <input
            type="number"
            name="maxRevenue"
            value={filters.maxRevenue}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="Max Revenue"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Min Net Income:</label>
          <input
            type="number"
            name="minNetIncome"
            value={filters.minNetIncome}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="Min Net Income"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Max Net Income:</label>
          <input
            type="number"
            name="maxNetIncome"
            value={filters.maxNetIncome}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="Max Net Income"
          />
        </div>
      </div>

      {error && <p role="alert" className="mb-4 text-red-600">{error}</p>}
      <div className="overflow-x-auto shadow-lg border border-gray-200 rounded-lg">
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm uppercase font-medium text-gray-600">
              {Object.keys(table).map((key, index) => (
                <th
                  key={index}
                  className="p-4 cursor-pointer hover:bg-gray-200"
                  aria-sort={sortConfig.key === key ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <button type="button" className="w-full text-left" onClick={() => handleSort(key)}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  {sortConfig.key === key && (
                    <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`text-sm border-t ${
                    rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  {Object.keys(table).map((key, colIndex) => (
                    <td key={colIndex} className="p-4">
                      {key === 'revenue' || key === 'netIncome'
                        ? row[key]?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                        : key === 'eps'
                        ? row[key]?.toFixed(2)
                        : row[key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={Object.keys(table).length} className="p-4 text-center text-gray-500">
                  {loading ? 'Loading income statements…' : error ? 'Income statements could not be loaded.' : data.length ? 'No statements match your filters.' : 'No data available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

