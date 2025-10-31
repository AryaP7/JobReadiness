import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, Loader2 } from "lucide-react";

interface JobRole {
  id: string;
  title: string;
  description: string;
  required_skills: string[];
  preferred_skills: string[];
  experience_level: string;
}

interface JobRoleSelectorProps {
  onRoleSelect: (roleId: string) => void;
  selectedRoleId: string | null;
}

const JobRoleSelector = ({ onRoleSelect, selectedRoleId }: JobRoleSelectorProps) => {
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (selectedRoleId) {
      const role = roles.find(r => r.id === selectedRoleId);
      setSelectedRole(role || null);
    }
  }, [selectedRoleId, roles]);

  const fetchRoles = async () => {
    try {
      // @ts-ignore - Types will be generated after migration
      const { data, error } = await supabase
        .from("job_roles")
        .select("*")
        .order("title");

      if (error) throw error;
      setRoles((data as any) || []);
    } catch (error: any) {
      toast({
        title: "Error loading roles",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (roleId: string) => {
    onRoleSelect(roleId);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-secondary" />
          Target Job Role
        </CardTitle>
        <CardDescription>Select the position you're preparing for</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <Select value={selectedRoleId || undefined} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a job role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedRole && (
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedRole.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRole.required_skills.map((skill) => (
                      <Badge key={skill} variant="default">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Preferred Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRole.preferred_skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Experience Level</h4>
                  <Badge variant="outline">{selectedRole.experience_level}</Badge>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default JobRoleSelector;
