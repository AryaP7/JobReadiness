import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SkillGapsProps {
  matchedSkills: string[];
  missingSkills: string[];
}

const SkillGaps = ({ matchedSkills, missingSkills }: SkillGapsProps) => {
  const hasData = matchedSkills.length > 0 || missingSkills.length > 0;

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-destructive" />
          Skill Analysis
        </CardTitle>
        <CardDescription>Skills you have and skills you need to develop</CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="space-y-6">
            {matchedSkills.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <h4 className="font-semibold">Matched Skills ({matchedSkills.length})</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchedSkills.map((skill) => (
                    <Badge key={skill} className="bg-success hover:bg-success/90">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {matchedSkills.length > 0 && missingSkills.length > 0 && (
              <Separator />
            )}

            {missingSkills.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <h4 className="font-semibold">Skills to Develop ({missingSkills.length})</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((skill) => (
                    <Badge key={skill} variant="destructive">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Focus on developing these skills to improve your readiness score
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Select a job role to analyze your skill gaps</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillGaps;
