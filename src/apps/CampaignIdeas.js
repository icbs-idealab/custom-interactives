import React, { useState } from "react";

const MarketingCampaignGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState(null);
  const [formData, setFormData] = useState({
    startupIdea: "",
    targetAudience: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    return Object.values(formData).every((value) => value.trim() !== "");
  };

  const generateCampaigns = async () => {
    if (!isFormValid()) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/generate-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch campaigns");
      }

      const data = await response.json();
      setCampaigns(data.campaigns);
    } catch (err) {
      console.error(err);
      setError("Failed to generate campaigns. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Marketing campaign ideas generator
        </h1>

        <div className="space-y-6 mb-8">
          <div className="bg-white p-6 shadow-lg border border-indigo-100">
            <label className="block text-lg font-semibold mb-2 text-indigo-700">
              Startup idea
            </label>
            <textarea
              name="startupIdea"
              value={formData.startupIdea}
              onChange={handleChange}
              className="w-full border-2 border-indigo-100 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Describe your startup idea..."
              rows="3"
            />
          </div>

          <div className="bg-white p-6 shadow-lg border border-purple-100">
            <label className="block text-lg font-semibold mb-2 text-purple-700">
              Target audience
            </label>
            <textarea
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              className="w-full border-2 border-purple-100 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              placeholder="Describe your target audience..."
              rows="3"
            />
          </div>
        </div>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <button
          onClick={generateCampaigns}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Campaign Ideas"}
        </button>

        {campaigns && (
          <div className="mt-8 space-y-6">
            {campaigns.map((campaign, index) => (
              <div
                key={index}
                className="bg-white p-6 shadow-lg border border-indigo-100 hover:border-purple-300 transition-all"
              >
                <h3 className="text-xl font-bold mb-4 text-indigo-700">
                  {campaign.name}
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p className="pb-2 border-b border-gray-100">
                    <span className="font-semibold text-purple-600">
                      Approach:
                    </span>{" "}
                    {campaign.approach}
                  </p>
                  <p className="pb-2 border-b border-gray-100">
                    <span className="font-semibold text-purple-600">
                      Platforms:
                    </span>{" "}
                    {campaign.platforms.join(", ")}
                  </p>
                  <p className="pb-2 border-b border-gray-100">
                    <span className="font-semibold text-purple-600">
                      Engagement Methods:
                    </span>{" "}
                    {campaign.engagementMethods.join(", ")}
                  </p>
                  <p>
                    <span className="font-semibold text-purple-600">
                      Evaluation Metrics:
                    </span>{" "}
                    {campaign.evaluationMetrics.join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketingCampaignGenerator;
