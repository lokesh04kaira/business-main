import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../utils/AuthContext';

function InvestorProposalDetail() {
  const { id } = useParams();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProposalDetails = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'investorProposals', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProposal({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Investor proposal not found.');
        }
      } catch (err) {
        console.error('Error fetching investor proposal details:', err);
        setError('Failed to load investor proposal details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProposalDetails();
    }
  }, [id]);

  // Check if the user can contact the investor
  const canContact = userRole === 'business';

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-10">
          <div className="loader">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Failed to load investor proposal. Please try again later.'}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{proposal.title}</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Investment Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{proposal.description}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Investment Interests</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {proposal.categories && proposal.categories.map(category => (
                <span 
                  key={category} 
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Investment Details</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Investment Range</span>
                  <span className="font-medium">₹{proposal.minAmount.toLocaleString()} - ₹{proposal.maxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Expected Return</span>
                  <span className="font-medium">{proposal.expectedReturn}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Investment Timeframe</span>
                  <span className="font-medium">{proposal.timeframe}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">About the Investor</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Posted By</span>
                  <span className="font-medium">{proposal.creatorName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Posted On</span>
                  <span className="font-medium">{new Date(proposal.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          {proposal.additionalInfo && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Additional Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">{proposal.additionalInfo}</p>
              </div>
            </div>
          )}
          
          {canContact && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between py-2 border-b border-blue-100">
                  <span className="text-gray-600">Email</span>
                  <a href={`mailto:${proposal.contactEmail}`} className="text-blue-600 hover:underline">{proposal.contactEmail}</a>
                </div>
                {proposal.contactPhone && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Phone</span>
                    <a href={`tel:${proposal.contactPhone}`} className="text-blue-600 hover:underline">{proposal.contactPhone}</a>
                  </div>
                )}
              </div>
              <div className="mt-4 text-center">
                <button 
                  onClick={() => window.location.href = `mailto:${proposal.contactEmail}?subject=Interest in Your Investment Opportunity: ${proposal.title}`}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none"
                >
                  Contact Investor
                </button>
              </div>
            </div>
          )}
          
          {!canContact && !currentUser && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
              <p className="text-yellow-800 font-medium mb-2">Sign in as a business owner to view contact details</p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
                >
                  Register
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
        >
          Go Back
        </button>
        
        {userRole === 'investor' && proposal.createdBy === currentUser?.uid && (
          <button
            onClick={() => navigate(`/investor-proposals/edit/${proposal.id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
          >
            Edit Proposal
          </button>
        )}
      </div>
    </div>
  );
}

export default InvestorProposalDetail; 