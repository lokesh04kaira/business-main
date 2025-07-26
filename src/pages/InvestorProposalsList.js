import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import { db } from "../utils/firebase";

function InvestorProposalsList() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const navigate = useNavigate();
  // const location = useLocation();

  // Business categories
  const categories = [
    "All Categories",
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

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);

        const proposalsQuery = query(
          collection(db, "investorProposals"),
          where("status", "==", "active"),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(proposalsQuery);
        let proposalsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProposals(proposalsData);
        setError("");
      } catch (err) {
        console.error("Error fetching investor proposals:", err);

        // We still have the error, but we'll check if we have data first
        try {
          // Try a simple query without complex filters or ordering
          const simpleQuery = query(collection(db, "investorProposals"));
          const snapshot = await getDocs(simpleQuery);

          if (snapshot.docs.length > 0) {
            // We have some data, so let's use that instead of showing an error
            console.log(
              `Found ${snapshot.docs.length} investor proposal documents with simple query`
            );
            const simpleData = snapshot.docs
              .map((doc) => ({ id: doc.id, ...doc.data() }))
              .filter((proposal) => proposal.status === "active")
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setProposals(simpleData);
            setError(""); // Clear error if we have data
          } else {
            // No data found even with simple query
            setError(
              "No investor proposals found. Please add some investor proposals."
            );
          }
        } catch (fallbackErr) {
          // Fallback query also failed
          console.error("Fallback query also failed:", fallbackErr);

          // Set a more user-friendly error message
          setError(
            "Unable to load investor proposals. Please try again later."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [selectedCategory]);

  // Filter proposals by selected category
  const filteredProposals =
    selectedCategory === "All Categories"
      ? proposals
      : proposals.filter(
          (proposal) =>
            proposal.categories &&
            proposal.categories.includes(selectedCategory)
        );

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Investment Opportunities</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="mb-4">
          <label
            htmlFor="category-filter"
            className="block text-gray-700 font-medium mb-2"
          >
            Filter by Category
          </label>
          <select
            id="category-filter"
            className="w-full md:w-1/3 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
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
            onClick={() => navigate("/investor-proposals/new")}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Investment Opportunity
          </button>
        </div>
      ) : filteredProposals.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-8 rounded-lg text-center">
          <p className="text-lg">
            No investment opportunities found in this category.
          </p>
          <p className="mt-2">
            Try selecting a different category or add a new investment
            opportunity.
          </p>
          <button
            onClick={() => navigate("/investor-proposals/new")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Investment Opportunity
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/investor-proposals/${proposal.id}`)}
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {proposal.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {proposal.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {proposal.categories &&
                    proposal.categories.map((category) => (
                      <span
                        key={category}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                </div>

                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-700">
                      <p>Investment Range:</p>
                      <p className="font-medium">
                        ₹{proposal.minAmount?.toLocaleString() || 0} - ₹
                        {proposal.maxAmount?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div className="text-gray-500 text-right">
                      <p>Posted by {proposal.creatorName}</p>
                      <p>{new Date(proposal.createdAt).toLocaleDateString()}</p>
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

export default InvestorProposalsList;
