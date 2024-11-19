import React, { useState, useEffect } from 'react';
import supabase from '../supabase';

const AverageCalculator = () => {
    const [inputNumber, setInputNumber] = useState('');
    const [average, setAverage] = useState(null);
    const [status, setStatus] = useState('');
    const [allInputs, setAllInputs] = useState([]);

    const appId = 'AverageCalculator'; // Unique identifier for this app

    // Save a user's input to Supabase
    const saveNumber = async () => {
        if (!inputNumber || isNaN(inputNumber)) {
            setStatus('Please enter a valid number.');
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
            fetchAverage(); // Recalculate the average after saving
        }
    };

    // Fetch all numbers and calculate the average
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

        // Extract numbers and calculate the average
        const numbers = data.map((item) => item.data.number);
        const avg = numbers.reduce((acc, num) => acc + num, 0) / numbers.length || 0;

        setAllInputs(numbers); // Store all inputs for display
        setAverage(avg);
        setStatus('Average calculated successfully!');
    };

    // Fetch the average on component mount
    useEffect(() => {
        fetchAverage();
    }, []);

    return (
        <div>
            <h1>Average Calculator</h1>
            <input
                type="number"
                value={inputNumber}
                onChange={(e) => setInputNumber(e.target.value)}
                placeholder="Enter a number"
            />
            <button onClick={saveNumber}>Save Number</button>
            <p>{status}</p>

            <h2>Results</h2>
            <p>All Inputs: {allInputs.join(', ')}</p>
            <p>Average: {average !== null ? average.toFixed(2) : 'No data yet'}</p>
        </div>
    );
};

export default AverageCalculator;
