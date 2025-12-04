import {
  ResponsiveContainer,
  LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart as RePieChart, Pie, Cell,
  RadarChart as ReRadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart as ReBarChart, Bar
} from 'recharts';

const COLORS = ['#FF8042', '#00C49F', '#0088FE', '#FFBB28', '#FF6666'];

export function LineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReLineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" stroke="#666" />
        <YAxis domain={[0, 100]} stroke="#666" />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eee' }}
          formatter={(value) => [`${value}%`, 'Score']}
          labelFormatter={(label) => `Scan: ${label}`}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="score" 
          stroke="#4f46e5" 
          strokeWidth={2}
          activeDot={{ r: 8, fill: '#4f46e5' }}
          dot={{ r: 4, fill: '#4f46e5' }}
        />
      </ReLineChart>
    </ResponsiveContainer>
  );
}

export function PieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RePieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          innerRadius={40}
          paddingAngle={2}
          dataKey="value"
        >
          {data?.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`${value} issues`, 'Count']}
          contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eee' }}
        />
        <Legend 
          layout="vertical" 
          verticalAlign="middle" 
          align="right"
          formatter={(value) => <span className="text-sm">{value}</span>}
        />
      </RePieChart>
    </ResponsiveContainer>
  );
}

export function RadarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="#f0f0f0" />
        <PolarAngleAxis dataKey="subject" stroke="#666" />
        <PolarGrid radialLines={false} />
        <Radar 
          name="Accessibility" 
          dataKey="score" 
          stroke="#8884d8" 
          fill="#8884d8" 
          fillOpacity={0.6} 
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eee' }}
          formatter={(value) => [`${value}%`, 'Score']}
        />
      </ReRadarChart>
    </ResponsiveContainer>
  );
}

export function BarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReBarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" stroke="#666" />
        <YAxis stroke="#666" />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eee' }}
          formatter={(value) => [`${value} issues`, 'Count']}
          labelFormatter={(label) => `Domain: ${label}`}
        />
        <Legend />
        <Bar dataKey="issues" fill="#4f46e5" name="Issue Count" radius={[4, 4, 0, 0]} />
      </ReBarChart>
    </ResponsiveContainer>
  );
}