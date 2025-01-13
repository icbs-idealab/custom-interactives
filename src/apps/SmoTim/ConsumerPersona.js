import React, { useState, useRef, useEffect } from "react";

const ConsumerPersona = () => {
  const [formData, setFormData] = useState({
    brandName: "",
    brandDescription: "",
  });
  const [wordCounts, setWordCounts] = useState({
    brandName: 0,
    brandDescription: 0,
  });
  const [fieldErrors, setFieldErrors] = useState({
    brandName: "",
    brandDescription: "",
    global: null,
  });
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(
    localStorage.getItem("consumerPersonaSubmitted") === "true"
  );

  const wordLimit = 50;
  const generatedContentRef = useRef(null);
  const liveRegionRef = useRef(null);
  const errorRegionRef = useRef(null);
  const submitButtonRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (persona && generatedContentRef.current) {
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = "Consumer persona generated.";
      }
      // Focus the heading so screen readers are directed to the new content.
      generatedContentRef.current.querySelector("h2").focus();
    }
  }, [persona]);

  const countWords = (text) => {
    const trimmedText = text.trim();
    return trimmedText === "" ? 0 : trimmedText.split(/\s+/).length;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const currentWordCount = countWords(value);

    if (currentWordCount <= wordLimit) {
      setFormData({ ...formData, [name]: value });
      setWordCounts({ ...wordCounts, [name]: currentWordCount });
      setFieldErrors({ ...fieldErrors, [name]: "", global: null });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.brandName.trim()) {
      errors.brandName = "Brand name is required.";
    } else if (wordCounts.brandName > wordLimit) {
      errors.brandName = `Brand name must be ${wordLimit} words or fewer.`;
    }
    if (!formData.brandDescription.trim()) {
      errors.brandDescription = "Brand description is required.";
    } else if (wordCounts.brandDescription > wordLimit) {
      errors.brandDescription = `Brand description must be ${wordLimit} words or fewer.`;
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    setFieldErrors((prevErrors) => ({ ...prevErrors, global: null }));
    if (!validateForm()) {
      const globalErrorMessage =
        "One or more required fields has not been filled in. Please fill in the empty fields and then try submitting again.";
      if (errorRegionRef.current) {
        errorRegionRef.current.textContent = "";
        errorRegionRef.current.textContent = globalErrorMessage;
      }
      setFieldErrors((prevErrors) => ({ ...prevErrors, global: globalErrorMessage }));
      return;
    }

    setLoading(true);
    setFieldErrors({});
    setPersona(null);
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = "Generating consumer persona. Please wait.";
    }

    try {
      const response = await fetch("/api/generate-persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate consumer persona.");
      }

      const data = await response.json();
      setPersona(data);
      setHasSubmitted(true);
      localStorage.setItem("consumerPersonaSubmitted", "true");
      if (generatedContentRef.current && liveRegionRef.current) {
        liveRegionRef.current.textContent = "Consumer persona generated.";
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        "An error occurred while generating the consumer persona. Please try again.";
      if (errorRegionRef.current) {
        errorRegionRef.current.textContent = "";
        errorRegionRef.current.textContent = errorMessage;
      }
      setFieldErrors({ global: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const getErrorSummary = () => {
    const errorKeys = Object.keys(fieldErrors).filter((key) => key !== "global" && fieldErrors[key]);
    if (errorKeys.length === 0) {
      return null;
    }
    return (
      <ul className="text-red-500 text-center mt-4">
        {errorKeys.map((key) => (
          <li key={key}>{fieldErrors[key]}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          Consumer Persona Generator
        </h1>

        <div className="sr-only" aria-live="polite" ref={liveRegionRef} />
        <div className="sr-only" aria-live="assertive" ref={errorRegionRef} />

        <div ref={formRef} role="form" aria-describedby="globalErrorContainer" className="space-y-6 mb-8">
          <div className="bg-white p-6 shadow-md rounded-lg border border-gray-200">
            <label htmlFor="brandName" className="block text-lg font-semibold text-gray-800 mb-2">
              Brand Name
            </label>
            <textarea
              id="brandName"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                fieldErrors.brandName ? "border-red-500" : "border-gray-300"
              }`}
              aria-invalid={!!fieldErrors.brandName}
              aria-describedby={`brandNameError_${fieldErrors.brandName ? "error" : ""}`}
              placeholder="Enter brand name..."
              rows="2"
            />
            {fieldErrors.brandName && (
              <p id={`brandNameError_${fieldErrors.brandName ? "error" : ""}`} className="text-red-500 text-sm mt-1">
                {fieldErrors.brandName}
              </p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              {wordCounts.brandName}/{wordLimit} words
            </p>
          </div>

          <div className="bg-white p-6 shadow-md rounded-lg border border-gray-200">
            <label htmlFor="brandDescription" className="block text-lg font-semibold text-gray-800 mb-2">
              Brand Description
            </label>
            <textarea
              id="brandDescription"
              name="brandDescription"
              value={formData.brandDescription}
              onChange={handleChange}
              className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                fieldErrors.brandDescription ? "border-red-500" : "border-gray-300"
              }`}
              aria-invalid={!!fieldErrors.brandDescription}
              aria-describedby={`brandDescriptionError_${fieldErrors.brandDescription ? "error" : ""}`}
              placeholder="Enter brand description..."
              rows="3"
            />
            {fieldErrors.brandDescription && (
              <p id={`brandDescriptionError_${fieldErrors.brandDescription ? "error" : ""}`} className="text-red-500 text-sm mt-1">
                {fieldErrors.brandDescription}
              </p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              {wordCounts.brandDescription}/{wordLimit} words
            </p>
          </div>
        </div>

        {getErrorSummary()}
        {fieldErrors.global && (
          <div id="globalErrorContainer" aria-live="assertive" className="text-red-500 text-center mt-4">
            {fieldErrors.global}
          </div>
        )}

        <button
          ref={submitButtonRef}
          onClick={handleSubmit}
          disabled={loading || hasSubmitted}
          className={`w-full p-3 rounded-lg transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
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
            "Persona Already Submitted"
          ) : (
            "Generate Consumer Persona"
          )}
        </button>

        {persona && (
          <div className="mt-12 space-y-8" aria-live="polite" ref={generatedContentRef}>
            <h2 className="text-3xl font-bold text-center text-indigo-700" tabIndex="-1">
              Consumer Persona
            </h2>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              {/* Demographics */}
              <section className="mb-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Demographics</h3>
                <ul className="space-y-1 ml-6 list-disc text-gray-700">
                  <li>
                    <strong>Name:</strong> {persona.demographics?.name}
                  </li>
                  <li>
                    <strong>Age:</strong> {persona.demographics?.age}
                  </li>
                  <li>
                    <strong>Gender:</strong> {persona.demographics?.gender}
                  </li>
                  <li>
                    <strong>Occupation:</strong> {persona.demographics?.occupation}
                  </li>
                  <li>
                    <strong>Income Level:</strong> {persona.demographics?.incomeLevel}
                  </li>
                  <li>
                    <strong>Education Level:</strong> {persona.demographics?.educationLevel}
                  </li>
                  <li>
                    <strong>Location:</strong> {persona.demographics?.location}
                  </li>
                </ul>
              </section>

              {/* Psychographics */}
              <section className="mb-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Psychographics</h3>
                <ul className="space-y-1 ml-6 list-disc text-gray-700">
                  <li>
                    <strong>Values and Beliefs:</strong> {persona.psychographics?.valuesAndBeliefs}
                  </li>
                  <li>
                    <strong>Lifestyle:</strong> {persona.psychographics?.lifestyle}
                  </li>
                  <li>
                    <strong>Personality Traits:</strong> {persona.psychographics?.personalityTraits}
                  </li>
                  <li>
                    <strong>Goals and Aspirations:</strong> {persona.psychographics?.goalsAndAspirations}
                  </li>
                </ul>
              </section>

              {/* Behavioral */}
              <section className="mb-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Behavioral</h3>
                <ul className="space-y-1 ml-6 list-disc text-gray-700">
                  <li>
                    <strong>Buying Habits:</strong> {persona.behavioral?.buyingHabits}
                  </li>
                  <li>
                    <strong>Pain Points:</strong> {persona.behavioral?.painPoints}
                  </li>
                  <li>
                    <strong>Motivations:</strong> {persona.behavioral?.motivations}
                  </li>
                  <li>
                    <strong>Preferred Channels:</strong> {persona.behavioral?.preferredChannels}
                  </li>
                </ul>
              </section>

              {/* Situational */}
              <section className="mb-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Situational Details</h3>
                <ul className="space-y-1 ml-6 list-disc text-gray-700">
                  <li>
                    <strong>Technology Usage:</strong> {persona.situational?.technologyUsage}
                  </li>
                  <li>
                    <strong>Decision-Making Process:</strong> {persona.situational?.decisionMakingProcess}
                  </li>
                  <li>
                    <strong>Brand Affinities:</strong> {persona.situational?.brandAffinities}
                  </li>
                  <li>
                    <strong>Role in Buying Process:</strong> {persona.situational?.roleInBuyingProcess}
                  </li>
                </ul>
              </section>

              {/* Context & Story */}
              <section>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Context & Story</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Quote:</strong> {persona.quote}
                </p>
                <p className="text-gray-700">
                  <strong>Scenario:</strong> {persona.scenario}
                </p>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumerPersona;
