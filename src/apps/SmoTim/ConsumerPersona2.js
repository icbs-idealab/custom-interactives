import React, { useState, useRef, useEffect } from "react";
import { User, Heart, ShoppingCart, Smartphone, BookOpen } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from "recharts";

// Radar chart component for personality traits
const PersonaRadarChart = ({ data }) => {
  return (
    <div className="flex justify-center">
      <RadarChart outerRadius={150} width={500} height={400} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="trait" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Tooltip />
        <Radar
          name="Personality"
          dataKey="value"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
      </RadarChart>
    </div>
  );
};

const ConsumerPersona = () => {
  // ---------------------------
  // 1) Replace "wordLimit" with "charLimit"
  // ---------------------------
  const charLimit = 300;

  const [formData, setFormData] = useState({
    brandName: "",
    brandDescription: "",
  });

  // No longer tracking words; remove wordCounts entirely
  // and references to "countWords" or "wordCount".

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

  // References for accessibility
  const generatedContentRef = useRef(null);
  const liveRegionRef = useRef(null);
  const errorRegionRef = useRef(null);
  const submitButtonRef = useRef(null);
  const formRef = useRef(null);

  // Focus the generated content heading for screen readers once persona is set
  useEffect(() => {
    if (persona && generatedContentRef.current) {
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = "Consumer persona generated.";
      }
      generatedContentRef.current.querySelector("h2").focus();
    }
  }, [persona]);

  // ---------------------------
  // 2) Handle Change with a Character Limit
  // ---------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value.length <= charLimit) {
      // If under or exactly at the limit, keep the input as typed
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      // If over, slice it back to the limit
      setFormData((prev) => ({ ...prev, [name]: value.slice(0, charLimit) }));
    }

    // Optionally clear individual field errors
    setFieldErrors((prev) => ({ ...prev, [name]: "", global: null }));
  };

  // ---------------------------
  // 3) Validate Form by Character Count
  // ---------------------------
  const validateForm = () => {
    const errors = {};

    // BRAND NAME
    if (!formData.brandName.trim()) {
      errors.brandName = "Brand name is required.";
    } else if (formData.brandName.length > charLimit) {
      errors.brandName = `Brand name must be ${charLimit} characters or fewer.`;
    }

    // BRAND DESCRIPTION
    if (!formData.brandDescription.trim()) {
      errors.brandDescription = "Brand description is required.";
    } else if (formData.brandDescription.length > charLimit) {
      errors.brandDescription = `Brand description must be ${charLimit} characters or fewer.`;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ---------------------------
  // 4) Handle Submit
  // ---------------------------
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
      const response = await fetch("/api/generate-persona2", {
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

  // Show any individual field errors
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

  // Transform the personalityRadar object into an array for the radar chart
  const radarData =
    persona && persona.personalityRadar
      ? [
          { trait: "Openness", value: persona.personalityRadar.openness },
          { trait: "Conscientiousness", value: persona.personalityRadar.conscientiousness },
          { trait: "Extraversion", value: persona.personalityRadar.extraversion },
          { trait: "Agreeableness", value: persona.personalityRadar.agreeableness },
          { trait: "Neuroticism", value: persona.personalityRadar.neuroticism },
        ]
      : [];

  // ---------------------------
  // 5) Render
  // ---------------------------
  return (
    <div className="min-h-full bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          Consumer persona generator
        </h1>

        <div className="sr-only" aria-live="polite" ref={liveRegionRef} />
        <div className="sr-only" aria-live="assertive" ref={errorRegionRef} />

        <div
          ref={formRef}
          role="form"
          aria-describedby="globalErrorContainer"
          className="space-y-6 mb-8"
        >
          {/* BRAND NAME */}
          <div className="bg-white p-6 shadow-md rounded-lg border border-gray-200">
            <label
              htmlFor="brandName"
              className="block text-lg font-semibold text-gray-800 mb-2"
            >
              Brand name
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
              <p
                id={`brandNameError_${fieldErrors.brandName ? "error" : ""}`}
                className="text-red-500 text-sm mt-1"
              >
                {fieldErrors.brandName}
              </p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              {formData.brandName.length}/{charLimit} characters
            </p>
          </div>

          {/* BRAND DESCRIPTION */}
          <div className="bg-white p-6 shadow-md rounded-lg border border-gray-200">
            <label
              htmlFor="brandDescription"
              className="block text-lg font-semibold text-gray-800 mb-2"
            >
              Brand description
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
              aria-describedby={`brandDescriptionError_${
                fieldErrors.brandDescription ? "error" : ""
              }`}
              placeholder="Enter brand description..."
              rows="3"
            />
            {fieldErrors.brandDescription && (
              <p
                id={`brandDescriptionError_${fieldErrors.brandDescription ? "error" : ""}`}
                className="text-red-500 text-sm mt-1"
              >
                {fieldErrors.brandDescription}
              </p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              {formData.brandDescription.length}/{charLimit} characters
            </p>
          </div>
        </div>

        {/* Error Summaries */}
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

        {/* Submit Button */}
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
            "Persona already submitted"
          ) : (
            "Generate consumer persona"
          )}
        </button>

        {/* Generated Persona */}
        {persona && (
          <div className="mt-12" aria-live="polite" ref={generatedContentRef}>
            <h2
              className="text-3xl font-bold text-center text-indigo-900 mb-8 focus:outline-none"
              tabIndex="-1"
            >
              Consumer persona
            </h2>

            {/* Display persona image if available */}
            {persona.imageUrl && (
              <div className="flex justify-center mb-8">
                <img
                  src={persona.imageUrl}
                  alt={`Portrait of ${persona.demographics?.name}`}
                  className="rounded-full h-48 w-48 object-cover border border-gray-300 shadow-md"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Demographics */}
              <div className="bg-gradient-to-tr from-gray-800 to-gray-700 text-white p-6 rounded-xl shadow-xl ">
                <div className="flex items-center mb-3">
                  <User className="h-6 w-6 mr-2" aria-hidden="true" />
                  <h3 className="text-2xl font-semibold border-b pb-1">
                    Demographics
                  </h3>
                </div>
                <ul className="space-y-2">
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
                    <strong>Occupation:</strong>{" "}
                    {persona.demographics?.occupation}
                  </li>
                  <li>
                    <strong>Income level:</strong>{" "}
                    {persona.demographics?.incomeLevel}
                  </li>
                  <li>
                    <strong>Education level:</strong>{" "}
                    {persona.demographics?.educationLevel}
                  </li>
                  <li>
                    <strong>Location:</strong> {persona.demographics?.location}
                  </li>
                </ul>
              </div>

              {/* Psychographics */}
              <div className="bg-gradient-to-tr from-blue-900 to-blue-800 text-white p-6 rounded-xl shadow-xl ">
                <div className="flex items-center mb-3">
                  <Heart className="h-6 w-6 mr-2" aria-hidden="true" />
                  <h3 className="text-2xl font-semibold border-b pb-1">
                    Psychographics
                  </h3>
                </div>
                <ul className="space-y-2">
                  <li>
                    <strong>Values & beliefs:</strong>{" "}
                    {persona.psychographics?.valuesAndBeliefs}
                  </li>
                  <li>
                    <strong>Lifestyle:</strong>{" "}
                    {persona.psychographics?.lifestyle}
                  </li>
                  <li>
                    <strong>Personality:</strong>{" "}
                    {persona.psychographics?.personalityTraits}
                  </li>
                  <li>
                    <strong>Goals & aspirations:</strong>{" "}
                    {persona.psychographics?.goalsAndAspirations}
                  </li>
                </ul>
              </div>

              {/* Behavioral */}
              <div className="bg-gradient-to-tr from-red-900 to-red-800 text-white p-6 rounded-xl shadow-xl ">
                <div className="flex items-center mb-3">
                  <ShoppingCart className="h-6 w-6 mr-2" aria-hidden="true" />
                  <h3 className="text-2xl font-semibold border-b pb-1">
                    Behavioural
                  </h3>
                </div>
                <ul className="space-y-2">
                  <li>
                    <strong>Buying habits:</strong>{" "}
                    {persona.behavioral?.buyingHabits}
                  </li>
                  <li>
                    <strong>Pain points:</strong> {persona.behavioral?.painPoints}
                  </li>
                  <li>
                    <strong>Motivations:</strong> {persona.behavioral?.motivations}
                  </li>
                  <li>
                    <strong>Preferred channels:</strong>{" "}
                    {persona.behavioral?.preferredChannels}
                  </li>
                </ul>
              </div>

              {/* Situational */}
              <div className="bg-gradient-to-tr from-green-900 to-green-800 text-white p-6 rounded-xl shadow-xl ">
                <div className="flex items-center mb-3">
                  <Smartphone className="h-6 w-6 mr-2" aria-hidden="true" />
                  <h3 className="text-2xl font-semibold border-b pb-1">
                    Situational
                  </h3>
                </div>
                <ul className="space-y-2">
                  <li>
                    <strong>Tech usage:</strong>{" "}
                    {persona.situational?.technologyUsage}
                  </li>
                  <li>
                    <strong>Decision process:</strong>{" "}
                    {persona.situational?.decisionMakingProcess}
                  </li>
                  <li>
                    <strong>Brand affinities:</strong>{" "}
                    {persona.situational?.brandAffinities}
                  </li>
                  <li>
                    <strong>Role in buying:</strong>{" "}
                    {persona.situational?.roleInBuyingProcess}
                  </li>
                </ul>
              </div>
            </div>

            {/* Context & Story */}
            <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-300 mt-10 ">
              <div className="flex items-center mb-3">
                <BookOpen
                  className="h-6 w-6 mr-2 text-indigo-900"
                  aria-hidden="true"
                />
                <h3 className="text-2xl font-semibold text-indigo-900 border-b pb-1">
                  Context & story
                </h3>
              </div>
              <p className="text-gray-800 mb-3">
                <strong>Quote:</strong> {persona.quote}
              </p>
              <p className="text-gray-800">
                <strong>Scenario:</strong> {persona.scenario}
              </p>
            </div>

            {/* Personality Radar Chart */}
            {radarData.length > 0 && (
              <div className="mt-10 bg-white p-8 rounded-xl shadow-2xl border border-gray-300 ">
                <h3 className="text-2xl font-semibold text-indigo-900 mb-4 text-center">
                  Personality traits
                </h3>
                <PersonaRadarChart data={radarData} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumerPersona;
