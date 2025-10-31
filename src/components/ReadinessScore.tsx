import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

interface ReadinessScoreProps {
  score: number | null;
}

const ReadinessScore = ({ score }: ReadinessScoreProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-accent";
    if (score >= 40) return "text-secondary";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  return (
    <Card className="shadow-card bg-gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-accent" />
          Placement Readiness Score
        </CardTitle>
        <CardDescription>Your overall readiness for the selected role</CardDescription>
      </CardHeader>
      <CardContent>
        {score !== null ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
                {score}
                <span className="text-2xl">%</span>
              </div>
              <div className="text-lg font-medium text-muted-foreground mt-2">
                {getScoreLabel(score)}
              </div>
            </div>
            <Progress value={score} className="h-3" />
            <div className="text-sm text-muted-foreground text-center">
              Based on your skills match with the job requirements
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Select a job role to see your readiness score</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReadinessScore;
