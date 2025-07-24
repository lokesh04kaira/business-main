import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { db } from '../utils/firebase';
import { collection, addDoc } from 'firebase/firestore';

function BusinessProposalForm() {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [description, setDescription] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [equity, setEquity] = useState('');
  const [timeline, setTimeline] = useState('');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || '');
  const [contactPhone, setContactPhone] = useState('');

  // Business categories
  const categories = [
    'Technology', 
    'Real Estate', 
    'Food & Beverage', 
    'Healthcare', 
    'Education', 
    'Finance', 
    'E-commerce', 
    'Manufacturing',
    'Retail',
    'Services',
    'Entertainment',
    'Travel & Tourism',
    'Agriculture',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (userRole !== 'business') {
      setError('Only business owners can submit business proposals');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const proposalData = {
        title,
        category,
        description,
        investmentAmount: parseFloat(investmentAmount),
        equity: parseFloat(equity),
        timeline,
        contactEmail,
        contactPhone,
        createdBy: currentUser.uid,
        creatorName: currentUser.displayName,
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      
      // const docRef = await addDoc(collection(db, 'businessProposals'), proposalData);
      
      navigate('/dashboard', { state: { success: 'Business proposal submitted successfully!' } });
    } catch (error) {
      console.error('Error submitting business proposal:', error);
      setError('Failed to submit business proposal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || userRole !== 'business') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>You must be logged in as a business owner to post a business proposal.</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Submit Your Business Idea</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Business Title / Name
            </label>
            <input
              id="title"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Business Category
            </label>
            <select
              id="category"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Business Description
            </label>
            <textarea
              id="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your business idea, target market, competitive advantage, etc."
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="investment">
              Required Investment (INR)
            </label>
            <input
              id="investment"
              type="number"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              placeholder="Amount in INR"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="equity">
              Equity Offered (%)
            </label>
            <input
              id="equity"
              type="number"
              min="0"
              max="100"
              step="0.1"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={equity}
              onChange={(e) => setEquity(e.target.value)}
              placeholder="Percentage of equity"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="timeline">
              Expected Timeline
            </label>
            <input
              id="timeline"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="E.g., 6 months for development, 1 year to break even"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactEmail">
              Contact Email
            </label>
            <input
              id="contactEmail"
              type="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactPhone">
              Contact Phone
            </label>
            <input
              id="contactPhone"
              type="tel"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="Your phone number"
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {loading ? 'Submitting...' : 'Submit Business Proposal'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BusinessProposalForm; 