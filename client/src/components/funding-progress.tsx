import { Progress } from "@/components/ui/progress";

interface FundingProgressProps {
  current: number;
  goal: number;
}

export default function FundingProgress({ current, goal }: FundingProgressProps) {
  const percentage = Math.min(Math.round((current / goal) * 100), 100);

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <div className="text-2xl font-bold">{current.toLocaleString()} ₽</div>
        <div className="text-muted-foreground">из {goal.toLocaleString()} ₽</div>
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="text-sm text-muted-foreground">{percentage}% собрано</div>
    </div>
  );
}