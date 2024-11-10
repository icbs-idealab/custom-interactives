import React, { useState } from 'react';

const ToggleSwitchApp = () => {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    setIsOn(prevState => !prevState);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-8">
      <h2 className="text-2xl font-bold mb-4">Toggle Switch!</h2>
      <p className="text-lg mb-6">
        The switch is currently: <strong>{isOn ? 'ON' : 'OFF'}</strong>
      </p>
      <button
        onClick={toggleSwitch}
        className={`px-4 py-2 text-white font-semibold rounded transition ${
          isOn ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'
        }`}
      >
        {isOn ? 'Turn OFF' : 'Turn ON'}
      </button>
    </div>
  );
};

export default ToggleSwitchApp;
