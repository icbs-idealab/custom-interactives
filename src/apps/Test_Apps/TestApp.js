import React, { useState } from 'react';
import supabase from '../../supabase'; // Import the Supabase client

const TestApp = () => {
    const [inputData, setInputData] = useState('');
    const [fetchedData, setFetchedData] = useState([]);
    const [status, setStatus] = useState('');

    // Save data to Supabase
    const saveData = async () => {
        const { error } = await supabase
            .from('app_data') // Table name in your database
            .insert([{ app_id: 'TestApp', data: { input: inputData } }]); // App-specific data

        if (error) {
            console.error('Error saving data:', error);
            setStatus('Error saving data.');
        } else {
            setStatus('Data saved successfully!');
        }
    };

    // Fetch data from Supabase
    const fetchData = async () => {
        const { data, error } = await supabase
            .from('app_data')
            .select('*')
            .eq('app_id', 'TestApp'); // Filter by app_id to get only this app's data

        if (error) {
            console.error('Error fetching data:', error);
            setStatus('Error fetching data.');
        } else {
            console.log('Fetched data:', data);
            setFetchedData(data);
            setStatus('Data fetched successfully!');
        }
    };

    return (
        <div>
            <h1>Test App</h1>
            <input
                type="text"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder="Enter some data"
            />
            <button onClick={saveData}>Save!</button>
            <button onClick={fetchData}>Fetch!</button>
            <p>{status}</p>
            <h3>Fetched Data:</h3>
            <ul>
                {fetchedData.map((item) => (
                    <li key={item.id}>
                        {JSON.stringify(item.data)} (Created: {new Date(item.created_at).toLocaleString()})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TestApp;
