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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Marketing Campaign Generator
      </h1>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-lg font-semibold mb-2">
            Startup Idea
          </label>
          <textarea
            name="startupIdea"
            value={formData.startupIdea}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            placeholder="Describe your startup idea..."
            rows="3"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">
            Target Audience
          </label>
          <textarea
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            placeholder="Describe your target audience..."
            rows="3"
          />
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={generateCampaigns}
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Generating..." : "Generate Campaign Ideas"}
      </button>

      {campaigns && (
        <div className="mt-8 space-y-6">
          {campaigns.map((campaign, index) => (
            <div key={index} className="p-6 bg-gray-100 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">{campaign.name}</h3>
              <p>
                <strong>Approach:</strong> {campaign.approach}
              </p>
              <p>
                <strong>Platforms:</strong> {campaign.platforms.join(", ")}
              </p>
              <p>
                <strong>Engagement Methods:</strong>{" "}
                {campaign.engagementMethods.join(", ")}
              </p>
              <p>
                <strong>Evaluation Metrics:</strong>{" "}
                {campaign.evaluationMetrics.join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketingCampaignGenerator;
