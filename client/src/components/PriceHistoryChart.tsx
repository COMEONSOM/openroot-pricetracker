import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

type PricePoint = {
  date: string;
  price: number;
};

export default function PriceHistoryChart({
  data
}: {
  data: PricePoint[];
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "14px",
        padding: "1.4rem",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)"
      }}
    >
      <h3 style={{ marginBottom: "1rem" }}>Price History</h3>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis hide />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#4f46e5"
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
