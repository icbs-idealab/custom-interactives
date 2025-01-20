import React, { useState, useRef, useEffect } from "react";

const JobRisk = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [loading, setLoading] = useState(false);
  const [riskData, setRiskData] = useState(null);

  const liveRegionRef = useRef(null);

  const handleChange = (e) => {
    setJobTitle(e.target.value);
    if (fieldError) {
      setFieldError("");
    }
  };

  const handleSubmit = async () => {
    if (!jobTitle.trim()) {
      setFieldError("Job title is required.");
      return;
    }

    setLoading(true);
    setRiskData(null);

    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = "Calculating risk. Please wait.";
    }

    try {
      const response = await fetch("/api/job-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle }),
      });

      if (!response.ok) {
        throw new Error("Failed to assess risk.");
      }

      const data = await response.json();
      setRiskData(data);

      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = "Risk calculated.";
      }
    } catch (error) {
      console.error(error);
      setFieldError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-50 p-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">
        Risk assessment
        </h1>

        <div className="sr-only" aria-live="polite" ref={liveRegionRef}></div>

        <div className="mb-4">
          <label htmlFor="jobTitle" className="block text-lg font-medium text-gray-800">
            Enter a job title
          </label>
          <input
            id="jobTitle"
            name="jobTitle"
            type="text"
            value={jobTitle}
            onChange={handleChange}
            className={`w-full mt-1 p-2 border ${
              fieldError ? "border-red-500" : "border-gray-300"
            } rounded-md`}
            aria-invalid={!!fieldError}
          />
          {fieldError && (
            <p className="text-red-500 text-sm mt-1">{fieldError}</p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md font-semibold ${
            loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "Calculating..." : "Assess risk"}
        </button>

        {riskData && (
          <div className="mt-6 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Assessment</h2>
            <p>
              <strong>Job title:</strong> {riskData.jobTitle}
            </p>
            <p>
              <strong>Risk score:</strong> {riskData.riskScore} / 10
            </p>
            <p>
              <strong>Explanation:</strong> {riskData.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobRisk;
