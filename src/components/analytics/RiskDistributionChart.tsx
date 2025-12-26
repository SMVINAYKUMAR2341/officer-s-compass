import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockRiskDistribution } from '@/data/mockAnalytics';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

const COLORS = {
  LOW: 'hsl(var(--chart-2))',
  MEDIUM: 'hsl(var(--chart-4))',
  HIGH: 'hsl(var(--chart-1))',
};

export function RiskDistributionChart() {
  const data = mockRiskDistribution.map(item => ({
    name: item.riskBand,
    value: item.count,
    percentage: item.percentage,
  }));

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Risk Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.name as keyof typeof COLORS]}
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))',
                }}
                formatter={(value: number, name: string) => [`${value} applications`, name]}
              />
              <Legend 
                formatter={(value) => (
                  <span style={{ color: 'hsl(var(--foreground))' }}>{value} Risk</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {mockRiskDistribution.map((item) => (
            <div 
              key={item.riskBand} 
              className="text-center p-3 rounded-lg"
              style={{ backgroundColor: `${COLORS[item.riskBand]}20` }}
            >
              <p className="text-2xl font-bold" style={{ color: COLORS[item.riskBand] }}>
                {item.count}
              </p>
              <p className="text-xs text-muted-foreground">{item.riskBand} Risk</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}