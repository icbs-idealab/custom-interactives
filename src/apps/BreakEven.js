import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const BreakEvenCalculator = () => {
  const [newPlantCost, setNewPlantCost] = useState(1.25);
  const [rdCost, setRdCost] = useState(1.5);
  const [marketingCost, setMarketingCost] = useState(0.025);
  const [unitProductionCost, setUnitProductionCost] = useState(65);
  const [pricePerPlane, setPricePerPlane] = useState(105);
  const [breakEvenPoint, setBreakEvenPoint] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [calculations, setCalculations] = useState({});

  useEffect(() => {
    calculateBreakEven();
  }, [newPlantCost, rdCost, marketingCost, unitProductionCost, pricePerPlane]);

  const calculateBreakEven = () => {
    const fixedCosts = newPlantCost + rdCost + marketingCost;
    const profitPerPlane = pricePerPlane - unitProductionCost;
    const breakEven = (fixedCosts * 1000) / profitPerPlane;
    setBreakEvenPoint(Math.ceil(breakEven * 10) / 10);

    setCalculations({
      fixedCosts,
      profitPerPlane,
      breakEven,
    });

    const data = [];
    for (let i = 0; i <= breakEven * 2; i += breakEven / 10) {
      data.push({
        units: Math.round(i),
        totalCosts: fixedCosts * 1000 + i * unitProductionCost,
        totalRevenue: i * pricePerPlane,
      });
    }
    setChartData(data);
  };

  const inputStyle = {
    margin: "5px 0",
    padding: "12px",
    width: "100%",
    border: "2px solid #3498db",
    borderRadius: "8px",
    fontSize: "16px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
  };

  const labelStyle = {
    display: "block",
    marginTop: "15px",
    marginBottom: "5px",
    fontWeight: "bold",
    fontSize: "16px",
    color: "#2c3e50",
  };

  const formatTooltip = (value, name, props) => {
    if (typeof value === "number") {
      return value.toFixed(0); // This rounds to 0 decimal places
    }
    return value;
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px",
        backgroundColor: "#ecf0f1",
        borderRadius: "15px",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#2c3e50",
          marginBottom: "30px",
          fontSize: "36px",
        }}
      >
        Break-even calculator
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "40px",
          backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div>
          <label style={labelStyle}>New plant cost (bn $)</label>
          <input
            type="number"
            value={newPlantCost}
            onChange={(e) => setNewPlantCost(parseFloat(e.target.value))}
            step="0.01"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>R&D cost (bn $)</label>
          <input
            type="number"
            value={rdCost}
            onChange={(e) => setRdCost(parseFloat(e.target.value))}
            step="0.01"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Marketing cost (bn $)</label>
          <input
            type="number"
            value={marketingCost}
            onChange={(e) => setMarketingCost(parseFloat(e.target.value))}
            step="0.001"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Unit production cost (m $)</label>
          <input
            type="number"
            value={unitProductionCost}
            onChange={(e) => setUnitProductionCost(parseFloat(e.target.value))}
            step="0.1"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Price per plane (m $)</label>
          <input
            type="number"
            value={pricePerPlane}
            onChange={(e) => setPricePerPlane(parseFloat(e.target.value))}
            step="0.1"
            style={inputStyle}
          />
        </div>
      </div>

      <h2
        style={{
          textAlign: "center",
          margin: "40px 0 20px",
          color: "#e74c3c",
          fontSize: "28px",
        }}
      >
        Break-even point: {breakEvenPoint.toFixed(1)} planes
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "30px",
          marginTop: "30px",
        }}
      >
        <div
          style={{
            flex: "1 1 600px",
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.08)",
          }}
        >
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis
                dataKey="units"
                label={{
                  value: "Units Sold",
                  position: "insideBottom",
                  offset: -10,
                  fill: "#34495e",
                }}
                stroke="#34495e"
                tickFormatter={(value) => Math.round(value)}
              />
              <YAxis
                label={{
                  value: "Amount ($)",
                  angle: -90,
                  position: "insideLeft",
                  offset: -5,
                  fill: "#34495e",
                }}
                stroke="#34495e"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #e9ecef",
                }}
                formatter={formatTooltip}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="totalCosts"
                stroke="#e74c3c"
                name="Total costs"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="totalRevenue"
                stroke="#2ecc71"
                name="Total revenue"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            flex: "1 1 300px",
            backgroundColor: "#2c3e50",
            color: "#ecf0f1",
            padding: "25px",
            borderRadius: "10px",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
          }}
        >
          <h3 style={{ marginTop: 0, color: "#3498db", fontSize: "24px" }}>
            Calculations:
          </h3>
          {`1. Sum of fixed costs:
   ${newPlantCost.toFixed(2)} bn + ${rdCost.toFixed(2)} bn + ${marketingCost.toFixed(3)} bn = ${calculations.fixedCosts?.toFixed(3)} bn

2. Profit per plane:
   ${pricePerPlane} m - ${unitProductionCost} m = ${calculations.profitPerPlane?.toFixed(1)} m

3. Break-even point:
   ${(calculations.fixedCosts * 1000).toFixed(3)} m / ${calculations.profitPerPlane?.toFixed(1)} m = ${calculations.breakEven?.toFixed(3)} planes`}
        </div>
      </div>
    </div>
  );
};

export default BreakEvenCalculator;
