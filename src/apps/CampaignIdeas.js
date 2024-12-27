import React, { useState, useRef, useEffect } from "react";

const MarketingCampaignGenerator = () => {
  const [formData, setFormData] = useState({
    startupIdea: "",
    targetAudience: "",
  });
    const [wordCounts, setWordCounts] = useState({
      startupIdea: 0,
      targetAudience: 0
    })
  const [fieldErrors, setFieldErrors] = useState({
    startupIdea: "",
    targetAudience: "",
    global: null, // For global errors
  });
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(
    localStorage.getItem("campaignGeneratorSubmitted") === "true"
  );
  const wordLimit = 50;
  const generatedContentRef = useRef(null); // Ref for generated content
  const liveRegionRef = useRef(null); // Ref for polite announcements
  const errorRegionRef = useRef(null); // Ref for assertive announcements
  const submitButtonRef = useRef(null); // Ref for submit button
  const formRef = useRef(null); // Ref for form

  useEffect(() => {
    if (campaigns && generatedContentRef.current) {
      // Announce generated content first.
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = "Campaigns generated.";
      }
      // THEN focus on the heading
      // generatedContentRef.current.focus(); Removed from here
      generatedContentRef.current.querySelector("h2").focus(); // This is now the only focus action
    }
  }, [campaigns]);



  const countWords = (text) => {
        const trimmedText = text.trim();
      return trimmedText === '' ? 0 : trimmedText.split(/\s+/).length;
    }

  const handleChange = (e) => {
    const { name, value } = e.target;
    const currentWordCount = countWords(value);

    if (currentWordCount <= wordLimit) {
        setFormData({ ...formData, [name]: value });
    } else {
       // if it passes the limit then dont update
       return
    }

      setWordCounts({ ...wordCounts, [name]: currentWordCount });

    setFieldErrors({ ...fieldErrors, [name]: "", global: null }); // Clear global errors on change
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.startupIdea.trim()) {
      errors.startupIdea = "Startup idea is required.";
    } else if (wordCounts.startupIdea > wordLimit) {
        errors.startupIdea = `Startup idea must be ${wordLimit} words or fewer.`;
    }

    if (!formData.targetAudience.trim()) {
      errors.targetAudience = "Target audience is required.";
    }else if (wordCounts.targetAudience > wordLimit) {
        errors.targetAudience = `Target audience must be ${wordLimit} words or fewer.`;
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (hasSubmitted) {
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent =
          "You have already submitted your campaign idea.";
      }
      return;
    }

    if (!validateForm()) {
      // Focus on the first invalid field, and return focus to submit button
      const firstErrorField = document.querySelector("[aria-invalid='true']");
      if (firstErrorField) {
        submitButtonRef.current.focus();
        firstErrorField.focus();
      }

      // Announce errors via the live region
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent =
          "There are errors in the form. Please fix them before submitting.";
      }
      return;
    }

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
      setHasSubmitted(true);
      localStorage.setItem("campaignGeneratorSubmitted", "true");
      // focus on the title after campaigns have been generated
      if (generatedContentRef.current) {
         if (liveRegionRef.current) {
             liveRegionRef.current.textContent = "Campaigns generated.";
            }
         generatedContentRef.current.querySelector("h2").focus();
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        "An error occurred while generating campaigns. Please try again.";

      // Announce error message via live region
      if (errorRegionRef.current) {
        errorRegionRef.current.textContent = errorMessage;
      }

      setFieldErrors({ global: errorMessage });
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
        <div className="sr-only" aria-live="assertive" ref={errorRegionRef} />
        <div ref={formRef} aria-describedby="globalErrorContainer" className="space-y-6 mb-8">
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
              aria-describedby={`startupIdeaError_${
                fieldErrors.startupIdea ? "error" : ""
              }`}
              placeholder="Describe your startup idea..."
              rows="3"
            />
            {fieldErrors.startupIdea && (
              <p
                id={`startupIdeaError_${
                  fieldErrors.startupIdea ? "error" : ""
                }`}
                className="text-red-500 text-sm mt-1"
              >
                {fieldErrors.startupIdea}
              </p>
            )}
            <p className="text-gray-500 text-sm mt-1">
                {wordCounts.startupIdea}/{wordLimit} words
            </p>
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
                fieldErrors.targetAudience
                  ? "border-red-500"
                  : "border-purple-100"
              }`}
              aria-invalid={!!fieldErrors.targetAudience}
              aria-describedby={`targetAudienceError_${
                fieldErrors.targetAudience ? "error" : ""
              }`}
              placeholder="Describe your target audience..."
              rows="3"
            />
            {fieldErrors.targetAudience && (
              <p
                id={`targetAudienceError_${
                  fieldErrors.targetAudience ? "error" : ""
                }`}
                className="text-red-500 text-sm mt-1"
              >
                {fieldErrors.targetAudience}
              </p>
            )}
           <p className="text-gray-500 text-sm mt-1">
                {wordCounts.targetAudience}/{wordLimit} words
            </p>
          </div>
        </div>
        {fieldErrors.global && (
          <div
            id="globalErrorContainer"
            aria-live="assertive"
            className="text-red-500 text-center mt-4"
          >
            {fieldErrors.global}
          </div>
        )}

        <button
          ref={submitButtonRef}
          onClick={handleSubmit}
          disabled={loading || hasSubmitted}
          className={`w-full p-3 rounded-lg transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 relative ${
            loading || hasSubmitted
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
          }`}
          aria-busy={loading}
          aria-disabled={hasSubmitted}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
              Generating...
            </div>
          ) : hasSubmitted ? (
            "Campaign Already Submitted"
          ) : (
            "Generate Campaign Ideas"
          )}
        </button>

        {campaigns && (
          <div
            className="mt-8 space-y-6"
            aria-live="polite"
             // tabIndex="-1" Removed from here
            ref={generatedContentRef}
          >
            <h2 className="text-2xl font-bold text-center text-indigo-700" tabIndex="-1">
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