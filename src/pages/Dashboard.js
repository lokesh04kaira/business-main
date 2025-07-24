import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { db } from '../utils/firebase';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';

function Dashboard() {
  const { currentUser, userRole } = useAuth();
  const [businessProposals, setBusinessProposals] = useState([]);
  const [investorProposals, setInvestorProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch recent business proposals
        const businessQuery = query(
          collection(db, 'businessProposals'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const businessSnapshot = await getDocs(businessQuery);
        const businessData = businessSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Fetch recent investor proposals
        const investorQuery = query(
          collection(db, 'investorProposals'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const investorSnapshot = await getDocs(investorQuery);
        const investorData = investorSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setBusinessProposals(businessData);
        setInvestorProposals(investorData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {currentUser.displayName}</h1>
      
      {/* Common sections for all users */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div 
          className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
          onClick={() => navigate('/business-proposals')}
        >
          <h2 className="text-xl font-semibold mb-2">Browse Business Ideas</h2>
          <p className="text-gray-600 mb-4">Discover promising business ideas from entrepreneurs looking for investment.</p>
          <button className="text-blue-600 font-medium">View All Ideas →</button>
        </div>
        
        <div 
          className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
          onClick={() => navigate('/investor-proposals')}
        >
          <h2 className="text-xl font-semibold mb-2">Investment Opportunities</h2>
          <p className="text-gray-600 mb-4">Explore investors looking to fund promising business ventures.</p>
          <button className="text-green-600 font-medium">View All Opportunities →</button>
        </div>
        
        <div 
          className="bg-purple-50 p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
          onClick={() => navigate('/loan-details')}
        >
          <h2 className="text-xl font-semibold mb-2">Loan Options</h2>
          <p className="text-gray-600 mb-4">Find various loan options available for businesses from different banks.</p>
          <button className="text-purple-600 font-medium">View All Loans →</button>
        </div>
        
        <div 
          className="bg-yellow-50 p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
          onClick={() => navigate('/info')}
        >
          <h2 className="text-xl font-semibold mb-2">Business Information</h2>
          <p className="text-gray-600 mb-4">Access valuable business information and advice from industry experts.</p>
          <button className="text-yellow-600 font-medium">View All Resources →</button>
        </div>
      </div>
      
      {/* Role specific sections */}
      {userRole === 'user' && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Technology', 'Real Estate', 'Food & Beverage', 'Healthcare', 'Education', 'Finance', 'E-commerce', 'Manufacturing'].map((category) => (
              <div 
                key={category} 
                className="bg-blue-50 p-4 rounded-lg text-center cursor-pointer hover:bg-blue-100"
                onClick={() => navigate(`/business-proposals?category=${category}`)}
              >
                {category}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {userRole === 'investor' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Business Proposals</h2>
              <button 
                onClick={() => navigate('/business-proposals')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                View All
              </button>
            </div>
            
            {businessProposals.length === 0 ? (
              <p>No business proposals available at the moment.</p>
            ) : (
              <div className="space-y-4">
                {businessProposals.map(proposal => (
                  <div key={proposal.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <h3 className="font-medium">{proposal.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{proposal.category}</p>
                    <p className="text-sm text-gray-600 mb-2">Required Investment: ₹{proposal.investmentAmount.toLocaleString()}</p>
                    <button 
                      onClick={() => navigate(`/business-proposals/${proposal.id}`)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Your Investment Opportunities</h2>
            <button 
              onClick={() => navigate('/investor-proposals/new')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mr-4"
            >
              Post New Investment Opportunity
            </button>
          </div>
        </div>
      )}
      
      {userRole === 'business' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Investor Proposals</h2>
              <button 
                onClick={() => navigate('/investor-proposals')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                View All
              </button>
            </div>
            
            {investorProposals.length === 0 ? (
              <p>No investor proposals available at the moment.</p>
            ) : (
              <div className="space-y-4">
                {investorProposals.map(proposal => (
                  <div key={proposal.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <h3 className="font-medium">{proposal.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">Investment Range: ₹{proposal.minAmount.toLocaleString()} - ₹{proposal.maxAmount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600 mb-2">Interested in: {proposal.categories.join(', ')}</p>
                    <button 
                      onClick={() => navigate(`/investor-proposals/${proposal.id}`)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Your Business Ideas</h2>
            <button 
              onClick={() => navigate('/business-proposals/new')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mr-4"
            >
              Post New Business Idea
            </button>
          </div>
        </div>
      )}
      
      {userRole === 'banker' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Banker Dashboard</h2>
          <p className="mb-4">As a banker, you can post loan details for businesses and investors.</p>
          <button 
            onClick={() => navigate('/loan-details/new')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Post New Loan Details
          </button>
        </div>
      )}
      
      {userRole === 'advisor' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Business Advisor Dashboard</h2>
            <p className="mb-4">As a business advisor, you can provide guidance to entrepreneurs and investors.</p>
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate('/info/new')}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Post New Information
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
