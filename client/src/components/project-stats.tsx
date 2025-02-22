import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project, Pledge } from "@shared/schema";

interface ProjectStatsProps {
  project: Project;
  pledges: Pledge[];
}

export default function ProjectStats({ project, pledges }: ProjectStatsProps) {
  // Подготовка данных для графика
  const dailyPledges = pledges.reduce((acc: { [key: string]: number }, pledge) => {
    const date = new Date(pledge.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + Number(pledge.amount);
    return acc;
  }, {});

  const chartData = Object.entries(dailyPledges).map(([date, amount]) => ({
    date,
    amount: amount / 100, // Конвертируем копейки в рубли
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Динамика сборов</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="date" 
                stroke="#FFFFFF"
                label={{ value: 'Дата', position: 'insideBottom', offset: -5, fill: '#FFFFFF' }}
              />
              <YAxis 
                stroke="#FFFFFF"
                label={{ value: 'Сумма (₽)', angle: -90, position: 'insideLeft', fill: '#FFFFFF' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }}
                formatter={(value: number) => [`${value.toLocaleString()} ₽`, 'Сумма']}
              />
              <Bar dataKey="amount" fill="#FFB300" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}