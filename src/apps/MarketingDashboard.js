import React, { useState, useEffect } from "react";
import supabase from "../supabase";
import Cookies from "js-cookie";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

const MarketingROISimulator = () => {
    const [budgetAllocations, setBudgetAllocations] = useState({
        social_media: "",
        email: "",
        search_ads: "",
        content: "",
        influencer: "",
    });
    const [averageAllocations, setAverageAllocations] = useState(null);
    const [predictedROI, setPredictedROI] = useState(null);
    const [status, setStatus] = useState("");
    const [allSubmissions, setAllSubmissions] = useState([]);

    const appId = "MarketingROISimulator";
    const cookieName = `submitted_${appId}`;

    // Simulated ROI multipliers for each channel
    const roiMultipliers = {
        social_media: 2.8,
        email: 4.2,
        search_ads: 3.1,
        content: 2.5,
        influencer: 3.4,
    };

    const validateInput = () => {
        const total = Object.values(budgetAllocations).reduce(
            (sum, val) => sum + Number(val || 0),
            0,
        );
        if (total !== 100) {
            setStatus("Total allocation must equal 100%");
            return false;
        }
        return true;
    };

    const calculateROI = (allocations) => {
        return Object.entries(allocations).reduce(
            (total, [channel, percentage]) => {
                return (
                    total + (Number(percentage) * roiMultipliers[channel]) / 100
                );
            },
            0,
        );
    };

    const generateUserId = () => {
        const existingUserId = Cookies.get(cookieName);
        if (existingUserId) return existingUserId;
        const newUserId = `user_${Date.now()}`;
        Cookies.set(cookieName, newUserId);
        return newUserId;
    };

    const handleSubmit = async () => {
        if (!validateInput()) return;

        const roi = calculateROI(budgetAllocations);
        setPredictedROI(roi);

        await saveSubmission(budgetAllocations, roi);
        await fetchResults();
    };

    const saveSubmission = async (allocations, roi) => {
        const { error } = await supabase.from("app_data").insert([
            {
                app_id: appId,
                data: {
                    budgetAllocations: allocations,
                    predictedROI: roi,
                    userId: generateUserId(),
                },
            },
        ]);

        if (error) {
            setStatus("Error saving data");
            console.error("Error:", error);
            return;
        }
        setStatus("Submission saved successfully!");
    };

    const fetchResults = async () => {
        const { data, error } = await supabase
            .from("app_data")
            .select("*")
            .eq("app_id", appId);

        if (error) {
            console.error("Error fetching data:", error);
            setStatus("Error fetching data");
            return;
        }

        if (data && data.length > 0) {
            const submissions = data.map((item) => item.data);
            setAllSubmissions(submissions);
            calculateAverages(submissions);
        }
    };

    const calculateAverages = (submissions) => {
        const totals = {};
        const channels = Object.keys(roiMultipliers);

        channels.forEach((channel) => {
            totals[channel] =
                submissions.reduce(
                    (sum, sub) =>
                        sum + Number(sub.budgetAllocations[channel] || 0),
                    0,
                ) / submissions.length;
        });

        setAverageAllocations(totals);
    };

    const handleInputChange = (channel, value) => {
        setBudgetAllocations((prev) => ({
            ...prev,
            [channel]: value,
        }));
    };

    useEffect(() => {
        fetchResults();
    }, []);

    const prepareChartData = () => {
        if (!averageAllocations) return [];

        return Object.entries(averageAllocations).map(([channel, value]) => ({
            channel: channel
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
            allocation: value,
            roi: Number(((value * roiMultipliers[channel]) / 100).toFixed(2)),
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-4xl">
                <h1 className="text-2xl font-bold text-center text-gray-700 mb-4">
                    Marketing Channel ROI Simulator
                </h1>

                <p className="text-sm text-gray-500 mb-6 text-center">
                    Allocate your marketing budget across different channels
                    (total must equal 100%). See how your strategy compares to
                    the class average and predicted ROI.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {Object.entries(budgetAllocations).map(
                        ([channel, value]) => (
                            <div key={channel}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {channel
                                        .split("_")
                                        .map(
                                            (word) =>
                                                word.charAt(0).toUpperCase() +
                                                word.slice(1),
                                        )
                                        .join(" ")}{" "}
                                    (%)
                                </label>
                                <input
                                    type="number"
                                    value={value}
                                    onChange={(e) =>
                                        handleInputChange(
                                            channel,
                                            e.target.value,
                                        )
                                    }
                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                    min="0"
                                    max="100"
                                />
                            </div>
                        ),
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                >
                    Calculate ROI
                </button>

                {status && (
                    <p className="text-center mt-4 text-sm text-gray-600">
                        {status}
                    </p>
                )}

                {predictedROI !== null && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">
                            Your Predicted ROI: {predictedROI.toFixed(2)}
                        </h2>
                    </div>
                )}

                {averageAllocations && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">
                            Class Average Allocations & ROI
                        </h2>
                        <div className="overflow-x-auto">
                            <BarChart
                                width={600}
                                height={300}
                                data={prepareChartData()}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="channel"
                                    angle={-45}
                                    textAnchor="end"
                                    height={70}
                                />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="allocation"
                                    fill="#8884d8"
                                    name="Allocation %"
                                />
                                <Bar
                                    dataKey="roi"
                                    fill="#82ca9d"
                                    name="ROI Impact"
                                />
                            </BarChart>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketingROISimulator;
