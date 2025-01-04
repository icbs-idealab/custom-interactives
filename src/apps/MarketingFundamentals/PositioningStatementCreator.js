import React, { useState, useRef, useEffect } from 'react';
import './PositioningStatementCreator.css'; // Import app-specific styles
import { Copy, Check, Sparkles, RefreshCw } from 'lucide-react'; // Importing refresh icon

const PositioningStatementCreator = () => {
  const [formData, setFormData] = useState({
    targetAudience: '',
    brand: '',
    category: '',
    keyBenefit: '',
    competitor: '',
    usp: ''
  });
  const [copied, setCopied] = useState(false);
  const [animateSparkle, setAnimateSparkle] = useState(false);
  const [ariaMessage, setAriaMessage] = useState(''); // For screen reader messages
  const textareaRef = useRef(null);
  const copyButtonRef = useRef(null); // Ref for focus management after copying

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const generateStatement = () => {
    return `For ${formData.targetAudience || '[target audience]'}, ${formData.brand || '[brand]'} offers ${formData.category || '[category/product]'} that delivers ${formData.keyBenefit || '[key benefit]'}. Unlike ${formData.competitor || '[competitor]'}, ${formData.brand || '[brand]'} emphasizes ${formData.usp || '[USP]'}.`;
  };

  const copyToClipboard = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      document.execCommand('copy');
      setCopied(true);
      setAriaMessage('Text copied to clipboard'); // Set the message for screen reader
      copyButtonRef.current.focus(); // Return focus to button after action
    }
  };

  const resetForm = () => {
    setFormData({
      targetAudience: '',
      brand: '',
      category: '',
      keyBenefit: '',
      competitor: '',
      usp: ''
    });
    setCopied(false); // Reset copied state
    setAriaMessage('Form has been reset'); // Announce reset for screen reader
  };

  useEffect(() => {
    setAnimateSparkle(true);
    const timer = setTimeout(() => setAnimateSparkle(false), 1000);
    return () => clearTimeout(timer);
  }, [formData]);

  const getPlaceholder = (key) => {
    const placeholders = {
      targetAudience: 'Target audience',
      brand: 'Brand',
      category: 'Category/product',
      keyBenefit: 'Key benefit',
      competitor: 'Competitor',
      usp: 'USP'
    };
    return placeholders[key] || key;
  };

  return (
    <form className="max-w-4xl w-full mx-auto p-8 bg-blue-100 rounded-lg shadow-2xl" aria-labelledby="form-title">
  <h1 id="form-title" className="text-4xl font-extrabold mb-6 text-gray-700 text-center">
    Positioning Statement Creator
    <Sparkles className={`inline-block ml-2 ${animateSparkle ? 'animate-spin' : ''} text-yellow-400`} aria-hidden="true" />
  </h1>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    {Object.entries(formData).map(([key, value]) => (
      <div key={key} className="relative">
        <label htmlFor={key} className="sr-only">{getPlaceholder(key)}</label>
        <input
          type="text"
          id={key}
          name={key}
          value={value}
          onChange={handleInputChange}
          placeholder={getPlaceholder(key)}
          className="w-full p-3 border-2 border-blue-300 rounded-lg bg-white bg-opacity-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-100 transition duration-300"
          aria-required="true"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
        </div>
      </div>
    ))}
  </div>


  <div className="bg-white bg-opacity-50 p-6 rounded-lg shadow-inner mb-8">
    <h2 className="text-2xl font-bold mb-4 text-gray-700">Your positioning statement:</h2>
    <textarea
      ref={textareaRef}
      value={generateStatement()}
      readOnly
      aria-readonly="true"
      className="w-full p-4 border-2 border-blue-300 rounded-lg bg-white bg-opacity-50 text-gray-700 focus:outline-none focus:border-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-100 transition duration-300 h-48 md:h-32 resize-none"
      aria-label="Generated positioning statement"
    />
  </div>

  <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
    <button
      type="button"  // Add this to prevent form submission
      ref={copyButtonRef}
      onClick={copyToClipboard}
      className={`px-6 py-3 rounded-full flex items-center ${
        copied ? 'bg-green-400' : 'bg-yellow-300'
      } text-gray-700 font-bold text-lg transition duration-300 transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-100`}
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="mr-2" aria-hidden="true" /> : <Copy className="mr-2" aria-hidden="true" />}
      {copied ? 'Copied!' : 'Copy to clipboard'}
    </button>

    <button
      type="button"  // Add this to prevent form submission
      onClick={resetForm}
      className="px-6 py-3 rounded-full flex items-center bg-red-600 text-white font-bold text-lg transition duration-300 transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-100"
      aria-label="Reset the form"
    >
      <RefreshCw className="mr-2" aria-hidden="true" />
      Reset
    </button>
  </div>

  <div aria-live="assertive" className="sr-only">
    {ariaMessage}
  </div>
</form>

  );
};

export default PositioningStatementCreator;
