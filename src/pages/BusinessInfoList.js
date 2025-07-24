import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';

function BusinessInfoList() {
  const [businessInfo, setBusinessInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Information categories
  const categories = [
    'All Categories',
    'General Business',
    'Startup Advice',
    'Business Planning',
    'Market Research',
    'Finance & Funding',
    'Legal & Compliance',
    'Operations',
    'Marketing & Sales',
    'Taxation',
    'Business Strategy',
    'Technology',
    'Human Resources',
    'Other'
  ];

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        setLoading(true);
        
        const infoQuery = query(
          collection(db, 'businessInfo'),
          where('status', '==', 'active'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(infoQuery);
        let infoData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setBusinessInfo(infoData);
        setError('');
      } catch (err) {
        console.error('Error fetching business information:', err);
        
        // We still have the error, but we'll check if we have data first
        try {
          // Try a simple query without complex filters or ordering
          const simpleQuery = query(collection(db, 'businessInfo'));
          const snapshot = await getDocs(simpleQuery);
          
          if (snapshot.docs.length > 0) {
            // We have some data, so let's use that instead of showing an error
            console.log(`Found ${snapshot.docs.length} business info documents with simple query`);
            const simpleData = snapshot.docs
              .map(doc => ({ id: doc.id, ...doc.data() }))
              .filter(info => info.status === 'active')
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
              
            setBusinessInfo(simpleData);
            setError(''); // Clear error if we have data
          } else {
            // No data found even with simple query
            setError('No business information found. Please add some business information.');
          }
        } catch (fallbackErr) {
          // Fallback query also failed
          console.error('Fallback query also failed:', fallbackErr);
          
          // Set a more user-friendly error message
          setError('Unable to load business information. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessInfo();
  }, [selectedCategory]);

  // Filter info by selected category and search query
  const filteredInfo = businessInfo.filter(info => {
    const matchesCategory = selectedCategory === 'All Categories' || info.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      info.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      info.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (info.tags && info.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Business Information & Advisory</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="mb-4">
          <div className="mb-4">
            <label htmlFor="search-info" className="block text-gray-700 font-medium mb-2">
              Search Information
            </label>
            <input
              id="search-info"
              type="text"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by title, content, or tags..."
            />
          </div>
          
          <label htmlFor="category-filter" className="block text-gray-700 font-medium mb-2">
            Filter by Category
          </label>
          <select
            id="category-filter"
            className="w-full md:w-1/3 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="loader">Loading...</div>
        </div>
      ) : error ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-8 rounded-lg text-center">
          <p className="text-lg mb-3">{error}</p>
          <button
            onClick={() => navigate('/info/new')}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Business Information
          </button>
        </div>
      ) : filteredInfo.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-8 rounded-lg text-center">
          <p className="text-lg">No business information found matching your criteria.</p>
          <p className="mt-2">Try selecting a different category, modifying your search query, or add new information.</p>
          <button
            onClick={() => navigate('/info/new')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Business Information
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInfo.map(info => (
            <div 
              key={info.id} 
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/info/${info.id}`)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{info.title}</h2>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">{info.category}</span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">{info.content}</p>
                
                {info.tags && info.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {info.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-500">
                      <p>By {info.creatorName}</p>
                      <p>{new Date(info.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-purple-600 font-medium">
                      Read More
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BusinessInfoList; 