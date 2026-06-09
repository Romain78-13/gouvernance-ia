import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { STATUS_COLORS } from "../../utils/constants";

// data: [{ name (status), value }]
export default function StatusPieChart({ data }) {
  const filtered = data.filter((d) => d.value > 0);
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={filtered}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={2}
        >
          {filtered.map((entry) => (
            <Cell
              key={entry.name}
              fill={STATUS_COLORS[entry.name]?.dot || "#6E6E73"}
              stroke="#FFFFFF"
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E5EA",
            borderRadius: 8,
            color: "#1D1D1F",
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 11, color: "#6E6E73" }}
          formatter={(v) => <span style={{ color: "#6E6E73" }}>{v}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
