import React, { useState, useEffect } from "react";
import supabase from "../../supabase"; // Adjust according to your supabase client initialization

const AverageCalculator = () => {
    const [inputNumber, setInputNumber] = useState("");
    const [average, setAverage] = useState(null);
    const [status, setStatus] = useState("");
    const [allInputs, setAllInputs] = useState([]);

    const appId = "AverageCalculator";
    const storageKey = `submitted_${appId}`;
    const hasSubmitted = localStorage.getItem(storageKey);

    const saveNumber = async () => {
        if (!inputNumber || isNaN(inputNumber)) {
            setStatus("Please enter a valid number.");
            return;
        }

        if (hasSubmitted) {
            setStatus("You have already submitted a number for this app.");
            return;
        }

        const userId = generateUserId();
        const { error } = await supabase
            .from("app_data")
            .insert([
                {
                    app_id: appId,
                    data: { number: Number(inputNumber), userId },
                },
            ]);

        if (error) {
            console.error("Error saving number:", error);
            setStatus("Error saving number.");
        } else {
            setStatus("Number saved successfully!");
            setInputNumber("");
            localStorage.setItem(storageKey, userId); // Store in localStorage
            fetchAverage();
        }
    };

    const fetchAverage = async () => {
        const { data, error } = await supabase
            .from("app_data")
            .select("data")
            .eq("app_id", appId);

        if (error) {
            console.error("Error fetching numbers:", error);
            setStatus("Error fetching numbers.");
            return;
        }

        const numbers = data.map((item) => item.data.number);
        const avg =
            numbers.reduce((acc, num) => acc + num, 0) / numbers.length || 0;

        setAllInputs(numbers);
        setAverage(avg);
        setStatus("");
    };

    const resetSubmission = async () => {
        const userId = localStorage.getItem(storageKey);
        if (!userId) {
            setStatus("No submission to reset.");
            return;
        }

        const { error } = await supabase
            .from("app_data")
            .delete()
            .eq("app_id", appId)
            .eq("data->>userId", userId);

        if (error) {
            console.error("Error resetting submission:", error);
            setStatus("Error resetting submission.");
        } else {
            setStatus("Submission reset successfully.");
            localStorage.removeItem(storageKey); // Remove from localStorage
            fetchAverage();
        }
    };

    const generateUserId = () => {
        const existingUserId = localStorage.getItem(storageKey);
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
                    Enter a number below, and we'll calculate the average of all
                    submissions for this app.
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

                <button
                    onClick={saveNumber}
                    disabled={hasSubmitted}
                    className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Submit
                </button>

                <div className="mt-6 border-t pt-4">
                    <h2 className="text-lg font-semibold text-gray-700 text-center">
                        Results
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">
                        <strong>All Inputs:</strong>{" "}
                        {allInputs.length
                            ? allInputs.join(", ")
                            : "No data yet"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        <strong>Average:</strong>{" "}
                        {average !== null ? average.toFixed(2) : "No data yet"}
                    </p>
                </div>

                <button
                    onClick={resetSubmission}
                    className="mt-4 w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                    Reset Submission
                </button>

                <p className="text-center text-sm text-red-500 mt-2">
                    {status}
                </p>
            </div>
        </div>
    );
};

export default AverageCalculator;
