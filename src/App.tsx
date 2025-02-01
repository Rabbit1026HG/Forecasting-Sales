import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";
import axios from "axios";
import { SampleData1, SampleData2, SampleData3 } from "./sample-data";

interface SalesData {
  date: string;
  actual?: number;
  predicted?: number;
}

function App() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [predictions, setPredictions] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [bulkInput, setBulkInput] = useState("");
  const [showPredictions, setShowPredictions] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("default", {
      month: "short",
      day: "numeric",
    });
  };

  const handleSalesSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setShowPredictions(false); // Reset predictions visibility

    try {
      const values = bulkInput.split(",").map((v) => Number(v.trim()));
      if (values.length <40) {
        alert("Please provide a minimum of 40 values separated by commas.");
        setLoading(false);
        return;
      }

      // Get predictions first
      const response = await axios.post(import.meta.env.VITE_API_URL, {
        sales_data: values, prediction_length: 20
      });

      const predictedData = response.data.prediction;
      setPredictions(predictedData);

      const chartData: SalesData[] = [];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - values.length);

      // First, set only historical data
      for (let i = 0; i < values.length; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);
        chartData.push({
          date: formatDate(currentDate),
          actual: values[i],
        });
      }

      setSalesData(chartData);

      // After a short delay, add predictions
      setTimeout(() => {
        const completeData = [...chartData];
        const lastValue = values[values.length - 1];

        // Update the last historical point to include prediction
        completeData[completeData.length - 1] = {
          ...completeData[completeData.length - 1],
          predicted: lastValue,
        };

        // Add future predictions
        const overlapDate = new Date(startDate);
        overlapDate.setDate(overlapDate.getDate() + values.length - 1);

        for (let i = 0; i < predictedData.length; i++) {
          const futureDate = new Date(overlapDate);
          futureDate.setDate(futureDate.getDate() + i + 1);
          completeData.push({
            date: formatDate(futureDate),
            predicted: predictedData[i],
          });
        }

        setSalesData(completeData);
        setShowPredictions(true);
      }, 500); // 500ms delay before showing predictions
    } catch (error) {
      console.error("Error fetching prediction:", error);
      alert(
        "Error fetching prediction. Please make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <TrendingUp className="mx-auto h-12 w-12 text-indigo-600" />
          <h1 className="mt-4 text-4xl font-bold text-gray-900">
            Daily Sales Forecasting
          </h1>
          <p className="mt-2 text-lg text-gray-600">
          Predict the next 20 days of sales based on at least 40 days of historical data.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <form onSubmit={handleSalesSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste at least 40 comma-separated values.
                </label>
                <textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  className="w-full h-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                  placeholder="e.g., 1200,1300,1250,..."
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setBulkInput(SampleData1)}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Use sample data_1
                </button>
                <button
                  type="button"
                  onClick={() => setBulkInput(SampleData2)}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Use sample data_2
                </button>
                <button
                  type="button"
                  onClick={() => setBulkInput(SampleData3)}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Use sample data_3
                </button>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 select-none"
              >
                {loading ? "Calculating..." : "Generate Forecast"}
              </button>
            </div>
          </form>
        </div>

        {salesData.length > 0 && (
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Sales Trend & Forecast
            </h2>
            <div className="w-full overflow-x-auto">
              <LineChart
                width={1200}
                height={500}
                data={salesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  interval={14}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Historical Sales"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ r: 1 }}
                  activeDot={{ r: 6 }}
                />
                {showPredictions && (
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    name="Predicted Sales"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 6 }}
                  />
                )}
              </LineChart>
            </div>
            {predictions.length > 0 && showPredictions && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  20-Day Forecast Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Average Predicted Sales</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      ${Math.round(
                        predictions.reduce((a, b) => a + b, 0) /
                          predictions.length
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Highest Predicted Day</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      ${Math.max(...predictions).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Lowest Predicted Day</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      ${Math.min(...predictions).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
