import React, { useState, useRef, useEffect } from "react";

const MarketingCampaignGenerator = () => {
  const [formData, setFormData] = useState({
    startupIdea: "",
    targetAudience: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    startupIdea: "",
    targetAudience: "",
  });
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState(null);
  const wordLimit = 50;
  const generatedContentRef = useRef(null); // Ref for generated content
  const liveRegionRef = useRef(null); // Ref for live announcements

  useEffect(() => {
    if (campaigns && generatedContentRef.current) {
      // Announce and focus generated content
      generatedContentRef.current.focus();
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = "Campaigns generated.";
      }
    }
  }, [campaigns]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: "" });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.startupIdea.trim()) {
      errors.startupIdea = "Startup idea is required.";
    } else if (formData.startupIdea.trim().split(/\s+/).length > wordLimit) {
      errors.startupIdea = `Startup idea must be ${wordLimit} words or fewer.`;
    }
    if (!formData.targetAudience.trim()) {
      errors.targetAudience = "Target audience is required.";
    } else if (formData.targetAudience.trim().split(/\s+/).length > wordLimit) {
      errors.targetAudience = `Target audience must be ${wordLimit} words or fewer.`;
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setFieldErrors({});
    setCampaigns(null);
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = "Generating campaigns. Please wait.";
    }

    try {
      const response = await fetch("/api/generate-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate campaigns.");
      }

      const data = await response.json();
      setCampaigns(data.campaigns);
    } catch (error) {
      console.error(error);
      setFieldErrors({ global: "An error occurred while generating campaigns. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Marketing Campaign Ideas Generator
        </h1>

        <div className="sr-only" aria-live="polite" ref={liveRegionRef} />

        <div className="space-y-6 mb-8">
          <div className="bg-white p-6 shadow-lg border border-indigo-100">
            <label
              htmlFor="startupIdea"
              className="block text-lg font-semibold mb-2 text-indigo-700 flex items-center gap-2"
            >
              Startup Idea
            </label>
            <textarea
              id="startupIdea"
              name="startupIdea"
              value={formData.startupIdea}
              onChange={handleChange}
              className={`w-full border-2 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 transition-all ${
                fieldErrors.startupIdea ? "border-red-500" : "border-indigo-100"
              }`}
              aria-invalid={!!fieldErrors.startupIdea}
              aria-describedby="startupIdeaError"
              placeholder="Describe your startup idea..."
              rows="3"
            />
            {fieldErrors.startupIdea && (
              <p id="startupIdeaError" className="text-red-500 text-sm mt-1">
                {fieldErrors.startupIdea}
              </p>
            )}
          </div>

          <div className="bg-white p-6 shadow-lg border border-purple-100">
            <label
              htmlFor="targetAudience"
              className="block text-lg font-semibold mb-2 text-purple-700 flex items-center gap-2"
            >
              Target Audience
            </label>
            <textarea
              id="targetAudience"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              className={`w-full border-2 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 transition-all ${
                fieldErrors.targetAudience ? "border-red-500" : "border-purple-100"
              }`}
              aria-invalid={!!fieldErrors.targetAudience}
              aria-describedby="targetAudienceError"
              placeholder="Describe your target audience..."
              rows="3"
            />
            {fieldErrors.targetAudience && (
              <p id="targetAudienceError" className="text-red-500 text-sm mt-1">
                {fieldErrors.targetAudience}
              </p>
            )}
          </div>
        </div>

        {fieldErrors.global && (
          <div aria-live="assertive" className="text-red-500 text-center mt-4">
            {fieldErrors.global}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full p-3 rounded-lg transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            loading
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
          }`}
          aria-busy={loading}
          aria-live="polite"
        >
          {loading ? "Generating..." : "Generate Campaign Ideas"}
        </button>

        {campaigns && (
          <div
            className="mt-8 space-y-6"
            aria-live="polite"
            tabIndex="-1"
            ref={generatedContentRef}
          >
            <h2 className="text-2xl font-bold text-center text-indigo-700">
              Generated Campaign Ideas
            </h2>
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
