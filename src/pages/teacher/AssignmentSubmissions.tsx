import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GraduationCap, ArrowLeft, Download } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const AssignmentSubmissions = () => {
  const { id } = useParams(); // assignment id
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");

  const { data: assignment } = useQuery({
    queryKey: ['assignment', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assignments')
        .select('*, courses(*)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ['assignment-submissions', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          profiles:student_id (full_name, email)
        `)
        .eq('assignment_id', id)
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const gradeMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('submissions')
        .update({
          grade: parseFloat(grade),
          feedback,
          graded_at: new Date().toISOString(),
        })
        .eq('id', selectedSubmission.id);
      
      if (error) throw error;

      // Notify student
      await supabase
        .from('notifications')
        .insert({
          user_id: selectedSubmission.student_id,
          message: `Your assignment "${assignment?.title}" has been graded`,
          type: 'grade',
          related_id: selectedSubmission.id,
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment-submissions'] });
      toast({
        title: "Submission graded",
        description: "Student has been notified about the grade.",
      });
      setSelectedSubmission(null);
      setGrade("");
      setFeedback("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to grade submission.",
        variant: "destructive",
      });
    },
  });

  const handleGrade = (e: React.FormEvent) => {
    e.preventDefault();
    gradeMutation.mutate();
  };

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
        <Link to={`/teacher/courses/${assignment?.course_id}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Button>
        </Link>

        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">{assignment?.title}</h1>
          <p className="text-muted-foreground">Review and grade student submissions</p>
        </div>

        <Card className="bg-card border-border">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Submissions ({submissions.length})</h3>
            {submissions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No submissions yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Submitted On</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission: any) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.profiles?.full_name}</TableCell>
                      <TableCell>{new Date(submission.submitted_at).toLocaleString()}</TableCell>
                      <TableCell>
                        {submission.grade ? (
                          <span className="font-semibold text-primary">{submission.grade}/100</span>
                        ) : (
                          <span className="text-muted-foreground">Not graded</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {submission.file_url && (
                            <a href={submission.file_url} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                            </a>
                          )}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedSubmission(submission);
                                  setGrade(submission.grade?.toString() || "");
                                  setFeedback(submission.feedback || "");
                                }}
                              >
                                Grade
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Grade Submission</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={handleGrade} className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="grade">Grade (out of 100)</Label>
                                  <Input
                                    id="grade"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="feedback">Feedback</Label>
                                  <Textarea
                                    id="feedback"
                                    rows={4}
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Provide feedback to the student..."
                                  />
                                </div>
                                <Button type="submit" className="w-full" disabled={gradeMutation.isPending}>
                                  {gradeMutation.isPending ? 'Submitting...' : 'Submit Grade'}
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AssignmentSubmissions;
