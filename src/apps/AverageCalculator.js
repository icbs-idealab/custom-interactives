import React, { useState, useEffect } from 'react';
import supabase from '../supabase';
import Cookies from 'js-cookie'; // Import the cookie library

const AverageCalculator = () => {
    const [inputNumber, setInputNumber] = useState('');
    const [average, setAverage] = useState(null);
    const [status, setStatus] = useState('');
    const [allInputs, setAllInputs] = useState([]);

    const appId = 'AverageCalculator'; // Unique identifier for this app
    const cookieName = `submitted_${appId}`; // Cookie specific to this app

    const hasSubmitted = Cookies.get(cookieName); // Check if the cookie exists

    const saveNumber = async () => {
        if (!inputNumber || isNaN(inputNumber)) {
            setStatus('Please enter a valid number.');
            return;
        }

        if (hasSubmitted) {
            setStatus('You have already submitted a number for this app.');
            return;
        }

        const { error } = await supabase
            .from('app_data')
            .insert([{ app_id: appId, data: { number: Number(inputNumber) } }]);

        if (error) {
            console.error('Error saving number:', error);
            setStatus('Error saving number.');
        } else {
            setStatus('Number saved successfully!');
            setInputNumber('');
            Cookies.set(cookieName, true, { expires: 1 }); // Set the cookie (expires in 1 day)
            fetchAverage(); // Recalculate the average
        }
    };

    const fetchAverage = async () => {
        const { data, error } = await supabase
            .from('app_data')
            .select('data')
            .eq('app_id', appId);

        if (error) {
            console.error('Error fetching numbers:', error);
            setStatus('Error fetching numbers.');
            return;
        }

        const numbers = data.map((item) => item.data.number);
        const avg = numbers.reduce((acc, num) => acc + num, 0) / numbers.length || 0;

        setAllInputs(numbers);
        setAverage(avg);
        setStatus('Average calculated successfully!');
    };

    useEffect(() => {
        fetchAverage();
    }, []);

    const resetSubmission = () => {
        Cookies.remove(cookieName); // Remove the cookie to allow new submission
        setStatus('You can now submit again.');
    };

    return (
        <div>
            <h1>Average Calculator</h1>
            <input
                type="number"
                value={inputNumber}
                onChange={(e) => setInputNumber(e.target.value)}
                placeholder="Enter a number"
                disabled={hasSubmitted} // Disable input if user has already submitted
            />
            <button onClick={saveNumber} disabled={hasSubmitted}>
                Save Number
            </button>
            <button onClick={resetSubmission}>
                Reset Submission
            </button>
            <p>{status}</p>

            <h2>Results</h2>
            <p>All Inputs: {allInputs.join(', ')}</p>
            <p>Average: {average !== null ? average.toFixed(2) : 'No data yet'}</p>
        </div>
    );
};

export default AverageCalculator;
