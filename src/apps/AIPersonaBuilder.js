import React, { useState } from 'react';

const AIPersonaBuilder = () => {
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState(null);
  const storageKey = 'persona_generated';
  const hasGenerated = localStorage.getItem(storageKey);
  const [formData, setFormData] = useState({
    age: '',
    interests: '',
    buyingBehavior: '',
    additionalInfo: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generatePersona = async () => {
    setLoading(true);
    try {
      // Generate persona details
      const personaResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "user",
            content: `Create a detailed buyer persona based on the following information:
              Age: ${formData.age}
              Interests: ${formData.interests}
              Buying Behavior: ${formData.buyingBehavior}
              Additional Information: ${formData.additionalInfo}
              
              Format the response as a JSON object with the following fields:
              - name
              - occupation
              - challenges
              - goals
              - communicationStyle
              - shoppingPreferences`
          }]
        })
      });

      const data = await personaResponse.json();
      const generatedPersona = JSON.parse(data.choices[0].message.content);
      
      // Generate image using DALL-E
      const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          prompt: `Professional headshot of ${generatedPersona.name}, a ${generatedPersona.occupation}. High quality, realistic photo.`,
          n: 1,
          size: "512x512"
        })
      });

      const imageData = await imageResponse.json();
      setPersona({
        ...generatedPersona,
        image: imageData.data[0].url
      });
      localStorage.setItem(storageKey, 'true');
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const resetGeneration = () => {
    localStorage.removeItem(storageKey);
    setPersona(null);
    setFormData({
      age: '',
      interests: '',
      buyingBehavior: '',
      additionalInfo: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">AI Persona Builder</h1>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Age Range</label>
          <input
            type="text"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., 25-35"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Interests</label>
          <input
            type="text"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., technology, fitness, travel"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Buying Behavior</label>
          <input
            type="text"
            name="buyingBehavior"
            value={formData.buyingBehavior}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., price-sensitive, quality-focused"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Additional Information</label>
          <textarea
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Any other relevant details..."
          />
        </div>
      </div>

      <button
        onClick={generatePersona}
        disabled={loading || hasGenerated}
        className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          hasGenerated
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {loading ? 'Generating...' : hasGenerated ? 'Persona Already Generated' : 'Generate Persona'}
      </button>

      {hasGenerated && (
        <button
          onClick={resetGeneration}
          className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
        >
          Reset & Generate New Persona
        </button>
      )}

      {persona && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          {persona.image && (
            <img 
              src={persona.image} 
              alt={persona.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg"
            />
          )}
          <h2 className="text-2xl font-bold mb-4 text-center">{persona.name}</h2>
          <div className="space-y-4">
            <p><strong>Occupation:</strong> {persona.occupation}</p>
            <div>
              <strong>Challenges:</strong>
              <ul className="list-disc pl-5 mt-2">
                {Array.isArray(persona.challenges) ? 
              persona.challenges.map((challenge, index) => (
                <li key={index}>{challenge}</li>
              )) : 
              <li>{persona.challenges}</li>
            }
              </ul>
            </div>
            <div>
              <strong>Goals:</strong>
              <ul className="list-disc pl-5 mt-2">
                {Array.isArray(persona.goals) ? 
              persona.goals.map((goal, index) => (
                <li key={index}>{goal}</li>
              )) : 
              <li>{persona.goals}</li>
            }
              </ul>
            </div>
            <p><strong>Communication Style:</strong> {persona.communicationStyle}</p>
            <div>
              <strong>Shopping Preferences:</strong>
              {typeof persona.shoppingPreferences === 'object' ? (
                <ul className="list-disc pl-5 mt-2">
                  {Object.entries(persona.shoppingPreferences).map(([key, value]) => (
                    <li key={key}><strong>{key}:</strong> {value}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2">{persona.shoppingPreferences}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPersonaBuilder;