import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, BookOpen, Video, Code, FileText } from "lucide-react";

interface Recommendation {
  id: string;
  skill_name: string;
  resource_type: string;
  resource_title: string;
  resource_url: string;
  provider: string;
}

interface RecommendationsProps {
  recommendations: Recommendation[];
}

const Recommendations = ({ recommendations }: RecommendationsProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "course":
        return <BookOpen className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "practice":
        return <Code className="w-4 h-4" />;
      case "article":
        return <FileText className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "course":
        return "bg-primary";
      case "video":
        return "bg-destructive";
      case "practice":
        return "bg-success";
      case "article":
        return "bg-secondary";
      default:
        return "bg-muted";
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Learning Recommendations
        </CardTitle>
        <CardDescription>Personalized resources to bridge your skill gaps</CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getTypeColor(rec.resource_type)}>
                        <span className="mr-1">{getIcon(rec.resource_type)}</span>
                        {rec.resource_type}
                      </Badge>
                      <Badge variant="outline">{rec.skill_name}</Badge>
                    </div>
                    <h4 className="font-semibold">{rec.resource_title}</h4>
                    {rec.provider && (
                      <p className="text-sm text-muted-foreground">
                        by {rec.provider}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <a
                      href={rec.resource_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Complete an assessment to receive personalized recommendations</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Recommendations;
