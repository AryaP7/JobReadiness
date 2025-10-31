import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Github, Loader2 } from "lucide-react";

interface ProfileUploadProps {
  onProfileUpdate: () => void;
}

const ProfileUpload = ({ onProfileUpdate }: ProfileUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");
  const { toast } = useToast();

  const handleGithubUpdate = async () => {
    if (!githubUrl) {
      toast({
        title: "GitHub URL required",
        description: "Please enter your GitHub profile URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // @ts-ignore - Types will be generated after migration
      const { error } = await supabase
        .from("profiles")
        .update({ github_url: githubUrl })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "GitHub profile URL saved successfully",
      });
      
      onProfileUpdate();
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_resume.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("resumes")
        .getPublicUrl(filePath);

      // @ts-ignore - Types will be generated after migration
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ resume_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      toast({
        title: "Resume uploaded",
        description: "Your resume has been uploaded successfully",
      });
      
      onProfileUpdate();
    } catch (error: any) {
      toast({
        title: "Error uploading resume",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary" />
          Profile Information
        </CardTitle>
        <CardDescription>Upload your resume and connect your GitHub profile</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="resume">Resume (PDF)</Label>
          <Input
            id="resume"
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground">Upload your latest resume in PDF format</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="github" className="flex items-center gap-2">
            <Github className="w-4 h-4" />
            GitHub Profile URL
          </Label>
          <div className="flex gap-2">
            <Input
              id="github"
              type="url"
              placeholder="https://github.com/username"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              disabled={loading}
            />
            <Button onClick={handleGithubUpdate} disabled={loading || !githubUrl}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileUpload;
