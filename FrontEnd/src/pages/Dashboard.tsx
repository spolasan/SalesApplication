import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const generateData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(month => ({
    month,
    sales: Math.floor(Math.random() * 1000) + 500,
    revenue: Math.floor(Math.random() * 2000) + 1000,
    customers: Math.floor(Math.random() * 100) + 50,
  }));
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface CorrelationData {
  'Inside Sales': number;
  'Gas Sales': number;
}

const Dashboard = () => {
  const [data] = useState(generateData());
  const [activeTimeframe, setActiveTimeframe] = useState("6M");
  const [correlationData, setCorrelationData] = useState<CorrelationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const timeframes = [
    { label: "1M", value: "1M" },
    { label: "3M", value: "3M" },
    { label: "6M", value: "6M" },
    { label: "1Y", value: "1Y" },
    { label: "2Y", value: "2Y" },
  ];

  useEffect(() => {
    const fetchCorrelationData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5050/correlation_analysis/${activeTimeframe}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setCorrelationData(response.data);
      } catch (error) {
        console.error("Error fetching correlation data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCorrelationData();
  }, [activeTimeframe]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <div className="flex gap-2">
            {timeframes.map((tf) => (
              <Button
                key={tf.value}
                variant={activeTimeframe === tf.value ? "default" : "outline"}
                onClick={() => setActiveTimeframe(tf.value)}
                className="min-w-[60px]"
              >
                {tf.label}
              </Button>
            ))}
            <Button onClick={handleLogout} className="bg-red-500 text-white hover:bg-red-700">
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Customer Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="customers"
                    nameKey="month"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Sales Correlation Analysis</h3>
            {isLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="Inside Sales" 
                    name="Inside Sales" 
                    unit="$"
                    domain={['auto', 'auto']}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="Gas Sales" 
                    name="Gas Sales" 
                    unit="$"
                    domain={['auto', 'auto']}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter
                    name="Sales Correlation"
                    data={correlationData}
                    fill="#8884d8"
                  >
                    {correlationData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            )}
            <div className="mt-4 text-sm text-gray-600">
              <p>Timeframe: {activeTimeframe}</p>
              <p>
                Correlation Strength: {
                  correlationData.length > 0
                    ? (calculateCorrelation(correlationData) * 100).toFixed(2) + '%'
                    : 'N/A'
                }
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

const calculateCorrelation = (data: CorrelationData[]) => {
  if (data.length < 2) return 0;

  const xValues = data.map(d => d['Inside Sales']);
  const yValues = data.map(d => d['Gas Sales']);

  const xMean = xValues.reduce((a, b) => a + b, 0) / xValues.length;
  const yMean = yValues.reduce((a, b) => a + b, 0) / yValues.length;

  const numerator = xValues.reduce((sum, x, i) => 
    sum + (x - xMean) * (yValues[i] - yMean), 0
  );

  const xVariance = xValues.reduce((sum, x) => 
    sum + Math.pow(x - xMean, 2), 0
  );
  const yVariance = yValues.reduce((sum, y) => 
    sum + Math.pow(y - yMean, 2), 0
  );

  return numerator / Math.sqrt(xVariance * yVariance);
};

export default Dashboard;
