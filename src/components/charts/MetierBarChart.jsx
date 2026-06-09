import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#0071E3", "#AF52DE", "#5AC8FA", "#0071E3", "#FF9F0A"];

// data: [{ name (metier), value }]
export default function MetierBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: "#6E6E73", fontSize: 12 }}
          axisLine={{ stroke: "#E5E5EA" }}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: "#6E6E73", fontSize: 12 }}
          axisLine={{ stroke: "#E5E5EA" }}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
          contentStyle={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E5EA",
            borderRadius: 8,
            color: "#1D1D1F",
          }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {data.map((entry, i) => (
            <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
