import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

function BusinessInfoForm() {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General Business");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [contactEmail, setContactEmail] = useState(currentUser?.email || "");
  const [contactPhone, setContactPhone] = useState("");

  // Information categories
  const categories = [
    "General Business",
    "Startup Advice",
    "Business Planning",
    "Market Research",
    "Finance & Funding",
    "Legal & Compliance",
    "Operations",
    "Marketing & Sales",
    "Taxation",
    "Business Strategy",
    "Technology",
    "Human Resources",
    "Other",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userRole !== "advisor") {
      setError("Only business advisors can post business information");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // TODO: Implement Firebase integration when needed
      // const infoData = {
      //   title,
      //   category,
      //   content,
      //   tags: tags.split(",").map((tag) => tag.trim()).filter((tag) => tag),
      //   contactEmail,
      //   contactPhone,
      //   createdBy: currentUser.uid,
      //   creatorName: currentUser.displayName,
      //   createdAt: new Date().toISOString(),
      //   status: "active",
      // };
      // const docRef = await addDoc(collection(db, 'businessInfo'), infoData);

      navigate("/dashboard", {
        state: { success: "Business information submitted successfully!" },
      });
    } catch (error) {
      console.error("Error submitting business information:", error);
      setError("Failed to submit business information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || userRole !== "advisor") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>
            You must be logged in as a business advisor to post business
            information.
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
        <h1 className="text-3xl font-bold mb-6">Post Business Information</h1>

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
              Title
            </label>
            <input
              id="title"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Essential Tax Considerations for Tech Startups"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="category"
            >
              Information Category
            </label>
            <select
              id="category"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="content"
            >
              Information Content
            </label>
            <textarea
              id="content"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-64"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide detailed information, advice, or guidance on the topic..."
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="tags"
            >
              Tags (comma separated)
            </label>
            <input
              id="tags"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="E.g., startup, taxation, legal, finance"
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
              Contact Phone (Optional)
            </label>
            <input
              id="contactPhone"
              type="tel"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="Your phone number"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {loading ? "Submitting..." : "Post Information"}
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

export default BusinessInfoForm;
