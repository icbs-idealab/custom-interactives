import React, { useState } from "react";

function EmergingTechApp() {
    const [visible, setVisible] = useState(false);

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    return (
        <div className="app-container">
            <h1>Explore Emerging Technologies</h1>
            <button onClick={toggleVisibility}>Click to Reveal</button>
            {visible && (
                <div className="reveal-content">
                    <h2>Emerging Technology #1</h2>
                    <p>Details about emerging technology 1...</p>
                    <h2>Emerging Technology #2</h2>
                    <p>Details about emerging technology 2...</p>
                    <h2>Emerging Technology #3</h2>
                    <p>Details about emerging technology 3...</p>
                </div>
            )}
        </div>
    );
}

export default EmergingTechApp;
