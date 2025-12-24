import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PricePoint {
  date: string;
  price: number;
  platform: string;
}

interface Props {
  data: PricePoint[];
}

const PriceHistoryChart = ({ data }: Props) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-400 py-10">
        No price history available
      </div>
    );
  }

  return (
    <div className="w-full h-80 bg-white/5 border border-white/10 rounded-xl p-4">
      <h3 className="text-white font-semibold mb-4">
        Price History
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              background: "#111827",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            labelStyle={{ color: "#e5e7eb" }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#6366f1"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceHistoryChart;
