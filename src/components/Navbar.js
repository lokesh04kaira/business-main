import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

function Navbar() {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">InvestorConnect</Link>
        
        <div className="flex space-x-4">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          
          {!currentUser ? (
            <>
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link to="/register" className="hover:text-blue-200">Register</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
              
              {/* Links visible to all logged-in users */}
              <Link to="/business-proposals" className="hover:text-blue-200">Business Ideas</Link>
              <Link to="/investor-proposals" className="hover:text-blue-200">Investment Opportunities</Link>
              <Link to="/loan-details" className="hover:text-blue-200">Loan Options</Link>
              <Link to="/info" className="hover:text-blue-200">Business Info</Link>
              
              {/* Role-specific action links */}
              {userRole === 'investor' && (
                <Link to="/investor-proposals/new" className="hover:text-blue-200">Post Investment</Link>
              )}
              
              {userRole === 'business' && (
                <Link to="/business-proposals/new" className="hover:text-blue-200">Post Idea</Link>
              )}
              
              {userRole === 'banker' && (
                <Link to="/loan-details/new" className="hover:text-blue-200">Post Loan Details</Link>
              )}
              
              {userRole === 'advisor' && (
                <Link to="/info/new" className="hover:text-blue-200">Post Information</Link>
              )}
              
              <button onClick={handleLogout} className="hover:text-blue-200">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 