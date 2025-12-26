import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockOfficerPerformance } from '@/data/mockAnalytics';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export function OfficerPerformanceChart() {
  const chartData = mockOfficerPerformance.map(officer => ({
    name: officer.officerName.split(' ')[0],
    decisions: officer.decisionsCount,
    approvalRate: officer.approvalRate,
    turnaround: officer.avgTurnaroundHours,
  }));

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Officer Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))',
                }}
              />
              <Legend />
              <Bar 
                dataKey="decisions" 
                name="Total Decisions"
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="approvalRate" 
                name="Approval Rate %"
                fill="hsl(var(--chart-2))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Detailed Breakdown</h4>
          {mockOfficerPerformance.slice(0, 3).map((officer) => (
            <div key={officer.officerId} className="p-4 bg-muted/30 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{officer.officerName}</p>
                  <p className="text-xs text-muted-foreground">{officer.decisionsCount} decisions</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    {officer.avgTurnaroundHours}h avg
                  </Badge>
                  <Badge 
                    variant={officer.overrideRate > 10 ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {officer.overrideRate}% override
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Approval Rate</span>
                  <span className="font-medium">{officer.approvalRate}%</span>
                </div>
                <Progress value={officer.approvalRate} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}