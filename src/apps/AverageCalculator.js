import React, { useState, useEffect } from 'react';
import supabase from '../supabase';
import Cookies from 'js-cookie';

const AverageCalculator = () => {
    const [inputNumber, setInputNumber] = useState('');
    const [average, setAverage] = useState(null);
    const [status, setStatus] = useState('');
    const [allInputs, setAllInputs] = useState([]);

    const appId = 'AverageCalculator';
    const cookieName = `submitted_${appId}`;
    const hasSubmitted = Cookies.get(cookieName);

    const saveNumber = async () => {
        if (!inputNumber || isNaN(inputNumber)) {
            setStatus('Please enter a valid number.');
            return;
        }

        if (hasSubmitted) {
            setStatus('You have already submitted a number for this app.');
            return;
        }

        const userId = generateUserId();
        const { error } = await supabase
            .from('app_data')
            .insert([{ app_id: appId, data: { number: Number(inputNumber), userId } }]);

        if (error) {
            console.error('Error saving number:', error);
            setStatus('Error saving number.');
        } else {
            setStatus('Number saved successfully!');
            setInputNumber('');
            Cookies.set(cookieName, userId, { expires: 1 });
            fetchAverage();
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
        setStatus('');
    };

    const resetSubmission = async () => {
        const userId = Cookies.get(cookieName);
        if (!userId) {
            setStatus('No submission to reset.');
            return;
        }

        const { error } = await supabase
            .from('app_data')
            .delete()
            .eq('app_id', appId)
            .eq('data->>userId', userId);

        if (error) {
            console.error('Error resetting submission:', error);
            setStatus('Error resetting submission.');
        } else {
            setStatus('Submission reset successfully.');
            Cookies.remove(cookieName);
            fetchAverage();
        }
    };

    const generateUserId = () => {
        const existingUserId = Cookies.get(cookieName);
        if (existingUserId) return existingUserId;

        const newUserId = `user_${Date.now()}`;
        return newUserId;
    };

    useEffect(() => {
        fetchAverage();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-gray-700 mb-4">
                    Average Calculator
                </h1>

                <p className="text-sm text-gray-500 mb-6 text-center">
                    Enter a number below, and we'll calculate the average of all submissions for this app.
                </p>

                <div className="mb-4">
                    <input
                        type="number"
                        value={inputNumber}
                        onChange={(e) => setInputNumber(e.target.value)}
                        placeholder="Enter a number"
                        disabled={hasSubmitted}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
                    />
                </div>

                <div className="flex justify-between">
                    <button
                        onClick={saveNumber}
                        disabled={hasSubmitted}
                        className={`px-4 py-2 rounded-lg text-white font-semibold ${
                            hasSubmitted
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                    >
                        Save Number
                    </button>
                    <button
                        onClick={resetSubmission}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
                    >
                        Reset Submission
                    </button>
                </div>

                {status && (
                    <p className="mt-4 text-center text-sm font-medium text-gray-600">{status}</p>
                )}

                <div className="mt-6 border-t pt-4">
                    <h2 className="text-lg font-semibold text-gray-700 text-center">Results</h2>
                    <p className="text-sm text-gray-500 mt-2">
                        <strong>All Inputs:</strong> {allInputs.length ? allInputs.join(', ') : 'No data yet'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        <strong>Average:</strong> {average !== null ? average.toFixed(2) : 'No data yet'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AverageCalculator;
