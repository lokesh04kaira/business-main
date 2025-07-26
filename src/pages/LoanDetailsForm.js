import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

function LoanDetailsForm() {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [bankName, setBankName] = useState("");
  const [loanType, setLoanType] = useState("");
  const [description, setDescription] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [tenure, setTenure] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [documentsRequired, setDocumentsRequired] = useState("");
  const [contactEmail, setContactEmail] = useState(currentUser?.email || "");
  const [contactPhone, setContactPhone] = useState("");

  // Loan types
  const loanTypes = [
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userRole !== "banker") {
      setError("Only bankers can post loan details");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // TODO: Implement Firebase integration when needed
      // const loanData = {
      //   title,
      //   bankName,
      //   loanType,
      //   description,
      //   interestRate: parseFloat(interestRate),
      //   minAmount: parseFloat(minAmount),
      //   maxAmount: parseFloat(maxAmount),
      //   tenure,
      //   eligibility,
      //   documentsRequired,
      //   contactEmail,
      //   contactPhone,
      //   createdBy: currentUser.uid,
      //   creatorName: currentUser.displayName,
      //   createdAt: new Date().toISOString(),
      //   status: "active",
      // };
      // const docRef = await addDoc(collection(db, 'loanDetails'), loanData);

      navigate("/dashboard", {
        state: { success: "Loan details submitted successfully!" },
      });
    } catch (error) {
      console.error("Error submitting loan details:", error);
      setError("Failed to submit loan details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || userRole !== "banker") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>You must be logged in as a banker to post loan details.</p>
          <button
            onClick={() => navigate("/login")}
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
        <h1 className="text-3xl font-bold mb-6">Post Loan Details</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Loan Title
            </label>
            <input
              id="title"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Small Business Startup Loan Package"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="bankName"
            >
              Bank / Financial Institution Name
            </label>
            <input
              id="bankName"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="loanType"
            >
              Loan Type
            </label>
            <select
              id="loanType"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
              required
            >
              <option value="">Select Loan Type</option>
              {loanTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Loan Description
            </label>
            <textarea
              id="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about the loan scheme, benefits, process, etc."
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="interestRate"
            >
              Interest Rate (% p.a.)
            </label>
            <input
              id="interestRate"
              type="number"
              min="0"
              step="0.01"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 flex gap-4">
            <div className="w-1/2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="minAmount"
              >
                Minimum Loan Amount (INR)
              </label>
              <input
                id="minAmount"
                type="number"
                min="0"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                required
              />
            </div>
            <div className="w-1/2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="maxAmount"
              >
                Maximum Loan Amount (INR)
              </label>
              <input
                id="maxAmount"
                type="number"
                min="0"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="tenure"
            >
              Loan Tenure
            </label>
            <input
              id="tenure"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              placeholder="E.g., 1-5 years, 6 months - 2 years"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="eligibility"
            >
              Eligibility Criteria
            </label>
            <textarea
              id="eligibility"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              placeholder="Specify who is eligible for this loan, minimum requirements, etc."
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="documentsRequired"
            >
              Documents Required
            </label>
            <textarea
              id="documentsRequired"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
              value={documentsRequired}
              onChange={(e) => setDocumentsRequired(e.target.value)}
              placeholder="List all documents required for loan application"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="contactEmail"
            >
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
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="contactPhone"
            >
              Contact Phone
            </label>
            <input
              id="contactPhone"
              type="tel"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="Contact number for inquiries"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {loading ? "Submitting..." : "Post Loan Details"}
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

export default LoanDetailsForm;
