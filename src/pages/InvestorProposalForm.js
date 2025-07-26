import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

function InvestorProposalForm() {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expectedReturn, setExpectedReturn] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [contactEmail, setContactEmail] = useState(currentUser?.email || "");
  const [contactPhone, setContactPhone] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  // Business categories
  const categories = [
    "Technology",
    "Real Estate",
    "Food & Beverage",
    "Healthcare",
    "Education",
    "Finance",
    "E-commerce",
    "Manufacturing",
    "Retail",
    "Services",
    "Entertainment",
    "Travel & Tourism",
    "Agriculture",
    "Other",
  ];

  const handleCategoryToggle = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userRole !== "investor") {
      setError("Only investors can submit investment proposals");
      return;
    }

    if (selectedCategories.length === 0) {
      setError("Please select at least one business category");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // TODO: Implement Firebase integration when needed
      // const proposalData = {
      //   title,
      //   description,
      //   minAmount: parseFloat(minAmount),
      //   maxAmount: parseFloat(maxAmount),
      //   categories: selectedCategories,
      //   expectedReturn,
      //   timeframe,
      //   contactEmail,
      //   contactPhone,
      //   additionalInfo,
      //   createdBy: currentUser.uid,
      //   creatorName: currentUser.displayName,
      //   createdAt: new Date().toISOString(),
      //   status: "active",
      // };
      // const docRef = await addDoc(collection(db, 'investorProposals'), proposalData);

      navigate("/dashboard", {
        state: { success: "Investment proposal submitted successfully!" },
      });
    } catch (error) {
      console.error("Error submitting investment proposal:", error);
      setError("Failed to submit investment proposal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || userRole !== "investor") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>
            You must be logged in as an investor to post an investment proposal.
          </p>
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
        <h1 className="text-3xl font-bold mb-6">Post Investment Opportunity</h1>

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
              Title of Investment Opportunity
            </label>
            <input
              id="title"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Seed funding for promising startups"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your investment interests, criteria, and goals..."
              required
            />
          </div>

          <div className="mb-4 flex gap-4">
            <div className="w-1/2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="minAmount"
              >
                Minimum Investment (INR)
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
                Maximum Investment (INR)
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
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Business Categories of Interest
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <input
                    id={`cat-${category}`}
                    type="checkbox"
                    className="mr-2"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                  />
                  <label htmlFor={`cat-${category}`}>{category}</label>
                </div>
              ))}
            </div>
            {selectedCategories.length === 0 && (
              <p className="text-red-500 text-xs italic mt-1">
                Please select at least one category
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="expectedReturn"
            >
              Expected Return on Investment
            </label>
            <input
              id="expectedReturn"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              placeholder="E.g., 15-20% annually or equity stake expectations"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="timeframe"
            >
              Investment Timeframe
            </label>
            <input
              id="timeframe"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              placeholder="E.g., 3-5 years, long term"
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

          <div className="mb-4">
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
              placeholder="Your phone number"
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="additionalInfo"
            >
              Additional Information (Optional)
            </label>
            <textarea
              id="additionalInfo"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Any additional requirements or information for potential businesses"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {loading ? "Submitting..." : "Post Investment Opportunity"}
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

export default InvestorProposalForm;
