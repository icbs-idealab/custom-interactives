import React, { useState, useRef } from 'react';

const ConsumerPersona = () => {
  const [formData, setFormData] = useState({
    brandName: '',
    brandDescription: '',
  });
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState(null);
  const [error, setError] = useState(null);
  const resultRef = useRef(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate persona');
      }

      const data = await response.json();
      setPersona(data);
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Consumer Persona Generator
        </h1>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand Name
              </label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your brand name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand Description
              </label>
              <textarea
                value={formData.brandDescription}
                onChange={(e) => setFormData({ ...formData, brandDescription: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                rows="4"
                placeholder="Describe your brand and its offerings"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full p-3 rounded-md text-white transition-all ${
                loading
                  ? 'bg-gray-400'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
              }`}
            >
              {loading ? 'Generating...' : 'Generate Persona'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {persona && (
          <div ref={resultRef} className="bg-white rounded-lg shadow-xl p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <img
                  src={persona.image}
                  alt={persona.demographics.name}
                  className="w-full rounded-lg shadow-lg"
                />
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-lg italic text-purple-800">"{persona.contextualElements.quote}"</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold text-purple-800 mb-3">Demographics</h2>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {persona.demographics.name}</p>
                    <p><span className="font-medium">Age:</span> {persona.demographics.age}</p>
                    <p><span className="font-medium">Gender:</span> {persona.demographics.gender}</p>
                    <p><span className="font-medium">Occupation:</span> {persona.demographics.occupation}</p>
                    <p><span className="font-medium">Income:</span> {persona.demographics.incomeLevel}</p>
                    <p><span className="font-medium">Education:</span> {persona.demographics.educationLevel}</p>
                    <p><span className="font-medium">Location:</span> {persona.demographics.location}</p>
                  </div>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold text-purple-800 mb-3">Psychographics</h2>
                  <div className="space-y-2">
                    <p><span className="font-medium">Values:</span> {persona.psychographics.valuesAndBeliefs}</p>
                    <p><span className="font-medium">Lifestyle:</span> {persona.psychographics.lifestyle}</p>
                    <p><span className="font-medium">Personality:</span> {persona.psychographics.personalityTraits}</p>
                    <p><span className="font-medium">Goals:</span> {persona.psychographics.goalsAndAspirations}</p>
                  </div>
                </section>
              </div>
            </div>
            
            <div className="mt-8 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-purple-800 mb-3">Behavioral Characteristics</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p><span className="font-medium">Buying Habits:</span> {persona.behavioralCharacteristics.buyingHabits}</p>
                    <p><span className="font-medium">Pain Points:</span> {persona.behavioralCharacteristics.painPoints}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Motivations:</span> {persona.behavioralCharacteristics.motivations}</p>
                    <p><span className="font-medium">Preferred Channels:</span> {persona.behavioralCharacteristics.preferredChannels}</p>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-purple-800 mb-3">Situational Details</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p><span className="font-medium">Technology Usage:</span> {persona.situationalDetails.technologyUsage}</p>
                    <p><span className="font-medium">Decision Making:</span> {persona.situationalDetails.decisionMakingProcess}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Brand Affinities:</span> {persona.situationalDetails.brandAffinities}</p>
                    <p><span className="font-medium">Role in Buying:</span> {persona.situationalDetails.roleInBuyingProcess}</p>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-purple-800 mb-3">A Day in the Life</h2>
                <p className="text-gray-700">{persona.contextualElements.scenario}</p>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumerPersona;