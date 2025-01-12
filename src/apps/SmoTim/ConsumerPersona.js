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
      // Announce generation to screen readers
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = "Consumer persona generated.";
      }
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
    const errorKeys = Object.keys(fieldErrors).filter(
      (key) => key !== "global" && fieldErrors[key]
    );
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
    <div className="min-h-full bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Consumer Persona Generator
        </h1>

        <div className="sr-only" aria-live="polite" ref={liveRegionRef} />
        <div className="sr-only" aria-live="assertive" ref={errorRegionRef} />

        <div
          ref={formRef}
          role="form"
          aria-describedby="globalErrorContainer"
          className="space-y-6 mb-8"
        >
          <div className="bg-white p-6 shadow-lg border border-green-100">
            <label
              htmlFor="brandName"
              className="block text-lg font-semibold mb-2 text-green-700 flex items-center gap-2"
            >
              Brand Name
            </label>
            <textarea
              id="brandName"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              className={`w-full border-2 rounded-lg p-3 focus:ring-2 focus:ring-green-500 transition-all ${
                fieldErrors.brandName ? "border-red-500" : "border-green-100"
              }`}
              aria-invalid={!!fieldErrors.brandName}
              aria-describedby={`brandNameError_${
                fieldErrors.brandName ? "error" : ""
              }`}
              placeholder="Enter brand name..."
              rows="2"
            />
            {fieldErrors.brandName && (
              <p
                id={`brandNameError_${
                  fieldErrors.brandName ? "error" : ""
                }`}
                className="text-red-500 text-sm mt-1"
              >
                {fieldErrors.brandName}
              </p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              {wordCounts.brandName}/{wordLimit} words
            </p>
          </div>

          <div className="bg-white p-6 shadow-lg border border-blue-100">
            <label
              htmlFor="brandDescription"
              className="block text-lg font-semibold mb-2 text-blue-700 flex items-center gap-2"
            >
              Brand Description
            </label>
            <textarea
              id="brandDescription"
              name="brandDescription"
              value={formData.brandDescription}
              onChange={handleChange}
              className={`w-full border-2 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 transition-all ${
                fieldErrors.brandDescription ? "border-red-500" : "border-blue-100"
              }`}
              aria-invalid={!!fieldErrors.brandDescription}
              aria-describedby={`brandDescriptionError_${
                fieldErrors.brandDescription ? "error" : ""
              }`}
              placeholder="Enter brand description..."
              rows="3"
            />
            {fieldErrors.brandDescription && (
              <p
                id={`brandDescriptionError_${
                  fieldErrors.brandDescription ? "error" : ""
                }`}
                className="text-red-500 text-sm mt-1"
              >
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
          className={`w-full p-3 rounded-lg transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 relative ${
            loading || hasSubmitted
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700"
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
          <div
            className="mt-8 space-y-6"
            aria-live="polite"
            ref={generatedContentRef}
          >
            <h2 className="text-2xl font-bold text-center text-green-700" tabIndex="-1">
              Consumer Persona
            </h2>
            {/* Show the persona card without image section */}
            <div className="bg-white p-6 shadow-lg border border-green-100">
              {/* Demographics */}
              <h3 className="text-xl font-semibold mb-2 text-green-700">Demographics</h3>
              <ul className="mb-4 ml-4 list-disc">
                <li><strong>Name:</strong> {persona.demographics?.name}</li>
                <li><strong>Age:</strong> {persona.demographics?.age}</li>
                <li><strong>Gender:</strong> {persona.demographics?.gender}</li>
                <li><strong>Occupation:</strong> {persona.demographics?.occupation}</li>
                <li><strong>Income Level:</strong> {persona.demographics?.incomeLevel}</li>
                <li><strong>Education Level:</strong> {persona.demographics?.educationLevel}</li>
                <li><strong>Location:</strong> {persona.demographics?.location}</li>
              </ul>

              {/* Psychographics */}
              <h3 className="text-xl font-semibold mb-2 text-green-700">Psychographics</h3>
              <ul className="mb-4 ml-4 list-disc">
                <li><strong>Values and Beliefs:</strong> {persona.psychographics?.valuesAndBeliefs}</li>
                <li><strong>Lifestyle:</strong> {persona.psychographics?.lifestyle}</li>
                <li><strong>Personality Traits:</strong> {persona.psychographics?.personalityTraits}</li>
                <li><strong>Goals and Aspirations:</strong> {persona.psychographics?.goalsAndAspirations}</li>
              </ul>

              {/* Behavioral Characteristics */}
              <h3 className="text-xl font-semibold mb-2 text-green-700">Behavioral</h3>
              <ul className="mb-4 ml-4 list-disc">
                <li><strong>Buying Habits:</strong> {persona.behavioral?.buyingHabits}</li>
                <li><strong>Pain Points:</strong> {persona.behavioral?.painPoints}</li>
                <li><strong>Motivations:</strong> {persona.behavioral?.motivations}</li>
                <li><strong>Preferred Channels:</strong> {persona.behavioral?.preferredChannels}</li>
              </ul>

              {/* Situational Details */}
              <h3 className="text-xl font-semibold mb-2 text-green-700">Situational Details</h3>
              <ul className="mb-4 ml-4 list-disc">
                <li><strong>Technology Usage:</strong> {persona.situational?.technologyUsage}</li>
                <li><strong>Decision-Making Process:</strong> {persona.situational?.decisionMakingProcess}</li>
                <li><strong>Brand Affinities:</strong> {persona.situational?.brandAffinities}</li>
                <li><strong>Role in Buying Process:</strong> {persona.situational?.roleInBuyingProcess}</li>
              </ul>

              {/* Context & Story */}
              <h3 className="text-xl font-semibold mb-2 text-green-700">Context & Story</h3>
              <p className="mb-2"><strong>Quote:</strong> {persona.quote}</p>
              <p><strong>Scenario:</strong> {persona.scenario}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumerPersona;
