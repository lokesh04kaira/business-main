import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../utils/firebase";
// import { useAuth } from '../utils/AuthContext';

function LoanDetailsList() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLoanType, setSelectedLoanType] = useState("All Types");
  const navigate = useNavigate();

  // Loan types for filtering
  const loanTypes = [
    "All Types",
    "Business Loan",
    "Term Loan",
    "Working Capital Loan",
    "Equipment Financing",
    "Startup Funding",
    "Commercial Real Estate Loan",
    "Line of Credit",
    "Invoice Financing",
    "Microfinance",
    "Rural Business Loan",
    "MSME Loan",
    "Other",
  ];

  // Add a sample loan if none exists
  // const addSampleLoan = async () => {
  //   try {
  //     console.log("Adding sample loan");
  //     const sampleLoan = {
  //       title: "Small Business Startup Loan",
  //       bankName: "Indian Bank",
  //       loanType: "Business Loan",
  //       description: "This loan is designed for entrepreneurs looking to start a small business. It offers competitive interest rates and flexible repayment terms to help you get your business up and running.",
  //       interestRate: 8.5,
  //       minAmount: 100000,
  //       maxAmount: 5000000,
  //       tenure: "1-5 years",
  //       eligibility: "- Business plan with clear growth potential\n- Minimum age: 21 years\n- Indian resident\n- Good credit history",
  //       documentsRequired: "- Identity Proof (Aadhar, PAN)\n- Address Proof\n- Business Plan\n- Projected Financial Statements\n- Bank Statements (last 6 months)",
  //       contactEmail: "smallbusiness@indianbank.com",
  //       contactPhone: "+91 1234567890",
  //       createdBy: "sample",
  //       creatorName: "Indian Bank Representative",
  //       createdAt: new Date().toISOString(),
  //       status: "active"
  //     };

  //     try {
  //       console.log("Attempting to add sample loan to Firestore");
  //       const docRef = await addDoc(collection(db, 'loanDetails'), sampleLoan);
  //       console.log("Sample loan added successfully with ID:", docRef.id);
  //       return [{ id: docRef.id, ...sampleLoan }];
  //     } catch (addErr) {
  //       console.error("Error adding sample loan to Firestore:", addErr);
  //       // Just return a mock loan with ID "sample-1" if we couldn't add to Firestore
  //       return [{ id: "sample-1", ...sampleLoan }];
  //     }
  //   } catch (err) {
  //     console.error("Error in addSampleLoan function:", err);
  //     return [];
  //   }
  // };

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        console.log("Fetching loan details...");

        const loansQuery = query(
          collection(db, "loanDetails"),
          where("status", "==", "active"),
          orderBy("createdAt", "desc")
        );

        console.log("Executing Firestore query for loan details...");
        const querySnapshot = await getDocs(loansQuery);
        console.log(
          `Query returned ${querySnapshot.docs.length} loan documents`
        );

        let loansData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log(`Setting ${loansData.length} loans to state`);
        setLoans(loansData);
        setError("");
      } catch (err) {
        console.error("Error fetching loan details:", err);

        // We still have the error, but we'll check if we have data first
        try {
          // Try a simple query without complex filters or ordering
          const simpleQuery = query(collection(db, "loanDetails"));
          const snapshot = await getDocs(simpleQuery);

          if (snapshot.docs.length > 0) {
            // We have some data, so let's use that instead of showing an error
            console.log(
              `Found ${snapshot.docs.length} loan documents with simple query`
            );
            const simpleData = snapshot.docs
              .map((doc) => ({ id: doc.id, ...doc.data() }))
              .filter((loan) => loan.status === "active")
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setLoans(simpleData);
            setError(""); // Clear error if we have data
          } else {
            // No data found even with simple query
            setError("No loan details found. Please add some loan details.");
          }
        } catch (fallbackErr) {
          // Fallback query also failed
          console.error("Fallback query also failed:", fallbackErr);

          // Set a more user-friendly error message
          setError("Unable to load loan details. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  // Filter loans by selected loan type
  const filteredLoans =
    selectedLoanType === "All Types"
      ? loans
      : loans.filter((loan) => loan.loanType === selectedLoanType);

  const handleLoanTypeChange = (e) => {
    setSelectedLoanType(e.target.value);
  };

  // const goToTestPage = () => {
  //   navigate('/test-firebase');
  // };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Loan Details</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="mb-4">
          <label
            htmlFor="loan-type-filter"
            className="block text-gray-700 font-medium mb-2"
          >
            Filter by Loan Type
          </label>
          <select
            id="loan-type-filter"
            className="w-full md:w-1/3 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedLoanType}
            onChange={handleLoanTypeChange}
          >
            {loanTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
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
            onClick={() => navigate("/loan-details/new")}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Loan Details
          </button>
        </div>
      ) : filteredLoans.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-8 rounded-lg text-center">
          <p className="text-lg">No loan details found for this loan type.</p>
          <p className="mt-2">
            Try selecting a different loan type or add new loan details.
          </p>
          <button
            onClick={() => navigate("/loan-details/new")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Loan Details
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLoans.map((loan) => (
            <div
              key={loan.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/loan-details/${loan.id}`)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {loan.title}
                  </h2>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {loan.loanType}
                  </span>
                </div>
                <p className="text-gray-500 mb-1 text-sm">{loan.bankName}</p>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {loan.description}
                </p>
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-700">
                      <p>
                        Interest Rate:{" "}
                        <span className="font-medium">
                          {loan.interestRate}% p.a.
                        </span>
                      </p>
                      <p>
                        Amount:{" "}
                        <span className="font-medium">
                          ₹{loan.minAmount?.toLocaleString() || 0} - ₹
                          {loan.maxAmount?.toLocaleString() || 0}
                        </span>
                      </p>
                    </div>
                    <div className="text-green-600 font-medium">
                      View Details
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

export default LoanDetailsList;
