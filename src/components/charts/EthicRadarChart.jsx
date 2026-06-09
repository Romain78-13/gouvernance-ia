import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

// data: [{ axis, value, max }]
export default function EthicRadarChart({ data }) {
  const maxDomain = Math.max(...data.map((d) => d.max), 1);
  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} outerRadius="70%">
        <PolarGrid stroke="#E5E5EA" />
        <PolarAngleAxis
          dataKey="axis"
          tick={{ fill: "#6E6E73", fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, maxDomain]}
          tick={{ fill: "#AEAEB2", fontSize: 10 }}
          stroke="#E5E5EA"
        />
        <Radar
          name="Risque"
          dataKey="value"
          stroke="#0071E3"
          fill="#0071E3"
          fillOpacity={0.35}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
