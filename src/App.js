import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BusinessProposalForm from "./pages/BusinessProposalForm";
import InvestorProposalForm from "./pages/InvestorProposalForm";
import LoanDetailsForm from "./pages/LoanDetailsForm";
import BusinessInfoForm from "./pages/BusinessInfoForm";
import BusinessProposalsList from "./pages/BusinessProposalsList";
import BusinessProposalDetail from "./pages/BusinessProposalDetail";
import InvestorProposalsList from "./pages/InvestorProposalsList";
import InvestorProposalDetail from "./pages/InvestorProposalDetail";
import LoanDetailsList from "./pages/LoanDetailsList";
import LoanDetail from "./pages/LoanDetail";
import BusinessInfoList from "./pages/BusinessInfoList";
import BusinessInfoDetail from "./pages/BusinessInfoDetail";
import TestFirebase from "./pages/TestFirebase";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Business Proposals Routes */}
          <Route path="/business-proposals" element={<BusinessProposalsList />} />
          <Route path="/business-proposals/new" element={<BusinessProposalForm />} />
          <Route path="/business-proposals/:id" element={<BusinessProposalDetail />} />
          
          {/* Investor Proposals Routes */}
          <Route path="/investor-proposals" element={<InvestorProposalsList />} />
          <Route path="/investor-proposals/new" element={<InvestorProposalForm />} />
          <Route path="/investor-proposals/:id" element={<InvestorProposalDetail />} />
          
          {/* Loan Details Routes */}
          <Route path="/loan-details" element={<LoanDetailsList />} />
          <Route path="/loan-details/new" element={<LoanDetailsForm />} />
          <Route path="/loan-details/:id" element={<LoanDetail />} />
          
          {/* Business Info Routes */}
          <Route path="/info" element={<BusinessInfoList />} />
          <Route path="/info/new" element={<BusinessInfoForm />} />
          <Route path="/info/:id" element={<BusinessInfoDetail />} />
          
          {/* Test Routes */}
          <Route path="/test-firebase" element={<TestFirebase />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
