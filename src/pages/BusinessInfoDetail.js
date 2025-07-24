import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../utils/AuthContext';

function BusinessInfoDetail() {
  const { id } = useParams();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInfoDetails = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'businessInfo', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setInfo({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Business information not found.');
        }
      } catch (err) {
        console.error('Error fetching business information details:', err);
        setError('Failed to load business information details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInfoDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-10">
          <div className="loader">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !info) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Failed to load business information. Please try again later.'}
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{info.title}</h1>
        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
          {info.category}
        </span>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Content</h2>
            <p className="text-gray-700 whitespace-pre-line">{info.content}</p>
          </div>
          
          {info.tags && info.tags.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Related Topics</h2>
              <div className="flex flex-wrap gap-2">
                {info.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">About the Advisor</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Posted By</span>
                <span className="font-medium">{info.creatorName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Posted On</span>
                <span className="font-medium">{new Date(info.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between py-2 border-b border-blue-100">
                <span className="text-gray-600">Email</span>
                <a href={`mailto:${info.contactEmail}`} className="text-blue-600 hover:underline">{info.contactEmail}</a>
              </div>
              {info.contactPhone && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Phone</span>
                  <a href={`tel:${info.contactPhone}`} className="text-blue-600 hover:underline">{info.contactPhone}</a>
                </div>
              )}
            </div>
            <div className="mt-4 text-center">
              <button 
                onClick={() => window.location.href = `mailto:${info.contactEmail}?subject=Question about: ${info.title}`}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none"
              >
                Contact Advisor
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
        
        {userRole === 'advisor' && info.createdBy === currentUser?.uid && (
          <button
            onClick={() => navigate(`/info/edit/${info.id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
          >
            Edit Information
          </button>
        )}
      </div>
    </div>
  );
}

export default BusinessInfoDetail; 