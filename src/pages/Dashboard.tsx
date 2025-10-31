import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User, Loader2, TrendingUp } from "lucide-react";
import ProfileUpload from "@/components/ProfileUpload";
import JobRoleSelector from "@/components/JobRoleSelector";
import ReadinessScore from "@/components/ReadinessScore";
import SkillGaps from "@/components/SkillGaps";
import Recommendations from "@/components/Recommendations";
import { Session } from "@supabase/supabase-js";

const Dashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) {
        navigate("/auth");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (selectedRoleId && session?.user) {
      analyzeReadiness();
    }
  }, [selectedRoleId, session?.user]);

  const analyzeReadiness = async () => {
    if (!selectedRoleId || !session?.user) return;

    setAnalyzing(true);
    try {
      // @ts-ignore - Types will be generated after migration
      const { data: role, error: roleError } = await supabase
        .from("job_roles")
        .select("*")
        .eq("id", selectedRoleId)
        .maybeSingle();

      if (roleError) throw roleError;
      if (!role) {
        throw new Error("Job role not found");
      }

      // For demo purposes, simulate skill analysis
      // In production, this would analyze the resume and GitHub profile
      const allRequiredSkills = (role as any).required_skills as string[];
      const simulatedUserSkills = allRequiredSkills.slice(0, Math.floor(allRequiredSkills.length * 0.6));
      const missingSkills = allRequiredSkills.filter(skill => !simulatedUserSkills.includes(skill));
      
      const readinessScore = Math.round((simulatedUserSkills.length / allRequiredSkills.length) * 100);

      // @ts-ignore - Types will be generated after migration
      const { data: newAssessment, error: assessmentError } = await supabase
        .from("user_assessments")
        .insert({
          user_id: session.user.id,
          job_role_id: selectedRoleId,
          readiness_score: readinessScore,
          skill_gaps: missingSkills,
          matched_skills: simulatedUserSkills,
        })
        .select()
        .maybeSingle();

      if (assessmentError) throw assessmentError;
      if (!newAssessment) {
        throw new Error("Failed to create assessment");
      }
      
      setAssessment(newAssessment);

      // Generate recommendations for missing skills
      const sampleRecommendations = missingSkills.slice(0, 3).flatMap((skill) => [
        {
          assessment_id: (newAssessment as any).id,
          skill_name: skill,
          resource_type: "course",
          resource_title: `Master ${skill} - Complete Course`,
          resource_url: `https://www.coursera.org/search?query=${encodeURIComponent(skill)}`,
          provider: "Coursera",
        },
        {
          assessment_id: (newAssessment as any).id,
          skill_name: skill,
          resource_type: "video",
          resource_title: `${skill} Tutorial for Beginners`,
          resource_url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill)}+tutorial`,
          provider: "YouTube",
        },
        {
          assessment_id: (newAssessment as any).id,
          skill_name: skill,
          resource_type: "practice",
          resource_title: `${skill} Practice Problems`,
          resource_url: `https://leetcode.com/problemset/?search=${encodeURIComponent(skill)}`,
          provider: "LeetCode",
        },
      ]);

      if (sampleRecommendations.length > 0) {
        // @ts-ignore - Types will be generated after migration
        const { data: recs, error: recError } = await supabase
          .from("recommendations")
          .insert(sampleRecommendations)
          .select();

        if (recError) throw recError;
        setRecommendations(recs || []);
      }

      toast({
        title: "Analysis complete",
        description: "Your readiness assessment is ready",
      });
    } catch (error: any) {
      toast({
        title: "Error analyzing readiness",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center shadow-elegant">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Placement Readiness Analyzer</h1>
              <p className="text-sm text-muted-foreground">Assess & Improve Your Skills</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{session?.user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-2">
            <ProfileUpload onProfileUpdate={() => {}} />
            <JobRoleSelector onRoleSelect={setSelectedRoleId} selectedRoleId={selectedRoleId} />
            
            {analyzing && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                <span className="text-muted-foreground">Analyzing your readiness...</span>
              </div>
            )}

            {assessment && (
              <>
                <SkillGaps
                  matchedSkills={assessment.matched_skills || []}
                  missingSkills={assessment.skill_gaps || []}
                />
                <Recommendations recommendations={recommendations} />
              </>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ReadinessScore score={assessment?.readiness_score || null} />
            
            {assessment && (
              <div className="bg-card rounded-lg p-6 shadow-card border">
                <h3 className="font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Matched Skills:</span>
                    <span className="font-medium text-success">{assessment.matched_skills?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Skills to Learn:</span>
                    <span className="font-medium text-destructive">{assessment.skill_gaps?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resources:</span>
                    <span className="font-medium text-primary">{recommendations.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
