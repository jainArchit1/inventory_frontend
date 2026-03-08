import React, { useState, useEffect } from 'react';
import SearchFilters from './components/SearchFilters';

const CATEGORIES = ["All", "electronics", "furniture", "stationary"];

function App() {
  const getInitialFilters = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      q: params.get('q') || '',
      category: params.get('category') || 'All',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || ''
    };
  };

  const [filters, setFilters] = useState(getInitialFilters);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      
      if (filters.minPrice && Number(filters.minPrice) < 0) {
        setError("Min price cannot be negative.");
        setResults([]);
        setLoading(false);
        return;
      }
      
      if (filters.maxPrice && Number(filters.maxPrice) < 0) {
        setError("Max price cannot be negative.");
        setResults([]);
        setLoading(false);
        return;
      }
      
      if (filters.minPrice && filters.maxPrice && Number(filters.minPrice) > Number(filters.maxPrice)) {
        setError("Min price cannot be greater than max price.");
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        const queryParams = new URLSearchParams();
        if (filters.q) queryParams.append('q', filters.q);
        if (filters.category && filters.category !== 'All') queryParams.append('category', filters.category);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

        const response = await fetch(`https://inventory-backend-gtp4.onrender.com/search?${queryParams.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch data from backend. Ensure backend is running.");
        
        const data = await response.json();
        setResults(data.results);

        // Sync with browser URL
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + queryParams.toString();
        window.history.pushState({ path: newUrl }, '', newUrl);

      } catch (err) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Zeerostock</h1>
          <p className="mt-2 text-gray-600">Search surplus inventory across global suppliers.</p>
        </header>

        <SearchFilters 
          filters={filters} 
          setFilters={setFilters} 
          categories={CATEGORIES} 
        />

        <main>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-md">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!error && loading ? (
             <div className="text-center py-12">
               <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 border-t-transparent"></div>
               <p className="mt-4 text-gray-500 font-medium">Searching inventory...</p>
             </div>
          ) : !error && results.length === 0 ? (
             <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm text-gray-500">
               <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
               <h3 className="text-lg font-medium text-gray-900">No results found</h3>
               <p className="mt-1">Try adjusting your filters or search query.</p>
             </div>
          ) : (
            !error && (
              <div>
                <p className="text-sm text-gray-500 mb-4 font-medium">Showing {results.length} items</p>
                <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th> */}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {results.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-900">₹{item.price.toFixed(2)}</div>
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.supplier}
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
