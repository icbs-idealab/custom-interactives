import React, { useState } from 'react';

function DoubleNumberApp() {
  const [number, setNumber] = useState('');
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    setNumber(e.target.value);
  };

  const handleDouble = () => {
    const num = parseFloat(number);
    if (!isNaN(num)) {
      setResult(num * 2);
    } else {
      setResult('Please enter a valid number');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Double a Number</h1>
      <input
        type="text"
        value={number}
        onChange={handleInputChange}
        placeholder="Enter a number"
      />
      <button onClick={handleDouble}>Double It</button>
      <div>
        {result !== null && (
          <p>
            Result: <strong>{result}</strong>
          </p>
        )}
      </div>
    </div>
  );
}

export default DoubleNumberApp;
