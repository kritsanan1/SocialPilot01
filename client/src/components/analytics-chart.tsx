import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AnalyticsChart() {
  // Mock data for 7-day engagement overview
  const data = [
    { day: 'Mon', engagement: 60 },
    { day: 'Tue', engagement: 45 },
    { day: 'Wed', engagement: 75 },
    { day: 'Thu', engagement: 55 },
    { day: 'Fri', engagement: 80 },
    { day: 'Sat', engagement: 65 },
    { day: 'Sun', engagement: 70 },
  ];

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-200" data-testid="card-analytics-chart">
      <CardHeader className="px-6 py-4 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-twitter-dark">Engagement Trends</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-48 w-full" data-testid="chart-engagement-trends">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="hsl(203, 89%, 53%)" 
                strokeWidth={2}
                dot={{ fill: 'hsl(203, 89%, 53%)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
