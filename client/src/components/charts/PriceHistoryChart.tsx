import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import "../../styles/PriceHistoryChart.css";

type PricePoint = {
  date: string;
  price: number;
};

interface Props {
  data: PricePoint[];
}

export default function PriceHistoryChart({ data }: Props) {
  return (
    <div className="price-history-card">
      <h3 className="price-history-title">
        Price History
      </h3>

      <div className="price-history-chart">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis hide />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="price"
              strokeWidth={2.5}
              dot={false}
              className="price-history-line"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
