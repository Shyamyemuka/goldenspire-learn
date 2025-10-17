import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const Approvals = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const { data: pendingApprovals = [], isLoading } = useQuery({
    queryKey: ['pending-approvals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pending_approvals')
        .select('*')
        .eq('requested_role', 'student')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (approvalId: string) => {
      const approval: any = pendingApprovals.find((a: any) => a.id === approvalId);
      if (!approval) throw new Error("Approval not found");

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_approved: true })
        .eq('id', approval.user_id);

      if (profileError) throw profileError;

      // Add role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: approval.user_id,
          role: approval.requested_role,
        });

      if (roleError) throw roleError;

      // Create approval log
      if (session?.user?.id) {
        await supabase
          .from('approval_logs')
          .insert({
            approved_user_id: approval.user_id,
            approved_by: session.user.id,
            action: 'approved',
            role: approval.requested_role,
          });
      }

      // Delete pending approval
      const { error: deleteError } = await supabase
        .from('pending_approvals')
        .delete()
        .eq('id', approvalId);

      if (deleteError) throw deleteError;

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: approval.user_id,
          message: `Your ${approval.requested_role} account has been approved!`,
          type: 'enrollment',
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
      toast({
        title: "Approved",
        description: "Student has been approved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve student.",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (approvalId: string) => {
      const approval: any = pendingApprovals.find((a: any) => a.id === approvalId);
      if (!approval) throw new Error("Approval not found");

      // Delete pending approval
      const { error } = await supabase
        .from('pending_approvals')
        .delete()
        .eq('id', approvalId);

      if (error) throw error;

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: approval.user_id,
          message: `Your ${approval.requested_role} account request was not approved.`,
          type: 'enrollment',
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
      toast({
        title: "Rejected",
        description: "Student request has been rejected.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject student.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              Learners' LMS
            </span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <Link to="/teacher/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Pending Approvals</h1>
          <p className="text-muted-foreground">Review and approve student registrations</p>
        </div>

        {isLoading ? (
          <Card className="p-12 text-center bg-card border-border">
            <p className="text-muted-foreground">Loading approvals...</p>
          </Card>
        ) : pendingApprovals.length === 0 ? (
          <Card className="p-12 text-center bg-card border-border">
            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No pending approvals</h3>
            <p className="text-muted-foreground">All student requests have been processed</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingApprovals.map((approval: any) => (
              <Card key={approval.id} className="p-6 bg-card border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{approval.full_name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{approval.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Requested on {new Date(approval.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => approveMutation.mutate(approval.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => rejectMutation.mutate(approval.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Approvals;
