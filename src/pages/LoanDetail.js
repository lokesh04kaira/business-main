import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../utils/AuthContext';

function LoanDetail() {
  const { id } = useParams();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        setLoading(true);
        console.log(`Fetching loan details for ID: ${id}`);

        const docRef = doc(db, 'loanDetails', id);
        console.log("Executing Firestore getDoc...");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          console.log("Document data retrieved successfully");
          setLoan({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No document found with this ID");
          setError('Loan details not found. Please check the ID and try again.');
        }
      } catch (err) {
        console.error('Error fetching loan details:', err);
        let errorMsg = 'Failed to load loan details.';
        if (err.code) {
          errorMsg += ` Error code: ${err.code}.`;
        }
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLoanDetails();
    } else {
      setError('Invalid loan ID.');
      setLoading(false);
    }
  }, [id]);

  const goToTestPage = () => {
    navigate('/test-firebase');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-10">
          <div className="loader">Loading...</div>
        </div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Failed to load loan details. Please try again later.'}
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
          >
            Go Back
          </button>
          <button
            onClick={goToTestPage}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
          >
            Run Firebase Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
          <p><strong>Note:</strong> {error}</p>
          <p className="mt-2 text-sm">This page is showing sample data for demonstration purposes.</p>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{loan.title}</h1>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          {loan.loanType}
        </span>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Offered By</h2>
            <p className="text-gray-700 text-lg font-medium">{loan.bankName}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Loan Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{loan.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Loan Details</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Interest Rate</span>
                  <span className="font-medium">{loan.interestRate}% p.a.</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Loan Amount Range</span>
                  <span className="font-medium">₹{loan.minAmount.toLocaleString()} - ₹{loan.maxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Loan Tenure</span>
                  <span className="font-medium">{loan.tenure}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">Eligibility Criteria</h2>
              <div className="bg-gray-50 p-4 rounded-lg h-full">
                <p className="text-gray-700 whitespace-pre-line">{loan.eligibility}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Required Documents</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line">{loan.documentsRequired}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between py-2 border-b border-blue-100">
                <span className="text-gray-600">Email</span>
                <a href={`mailto:${loan.contactEmail}`} className="text-blue-600 hover:underline">{loan.contactEmail}</a>
              </div>
              {loan.contactPhone && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Phone</span>
                  <a href={`tel:${loan.contactPhone}`} className="text-blue-600 hover:underline">{loan.contactPhone}</a>
                </div>
              )}
            </div>
            <div className="mt-4 text-center">
              <button 
                onClick={() => window.location.href = `mailto:${loan.contactEmail}?subject=Interest in Loan: ${loan.title}`}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none"
              >
                Contact for More Information
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
        >
          Go Back
        </button>
        
        {userRole === 'banker' && loan.createdBy === currentUser?.uid && (
          <button
            onClick={() => navigate(`/loan-details/edit/${loan.id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
          >
            Edit Loan Details
          </button>
        )}
      </div>
    </div>
  );
}

export default LoanDetail; 