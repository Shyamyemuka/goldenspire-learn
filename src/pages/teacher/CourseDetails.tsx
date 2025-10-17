import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GraduationCap, ArrowLeft, Users, FileText, Plus, Edit, Trash2 } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: course } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: students = [] } = useQuery({
    queryKey: ['course-students', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          profiles:student_id (full_name, email)
        `)
        .eq('course_id', id);
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ['course-assignments', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          submissions(count)
        `)
        .eq('course_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const deleteAssignmentMutation = useMutation({
    mutationFn: async (assignmentId: string) => {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', assignmentId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-assignments'] });
      toast({
        title: "Assignment deleted",
        description: "The assignment has been deleted successfully.",
      });
    },
  });

  if (!course) return null;

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
        <Link to="/teacher/courses">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </Link>

        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList>
            <TabsTrigger value="students">
              <Users className="mr-2 h-4 w-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="assignments">
              <FileText className="mr-2 h-4 w-4" />
              Assignments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card className="bg-card border-border">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Enrolled Students ({students.length})</h3>
                {students.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No students enrolled yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Enrolled On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student: any) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.profiles?.full_name}</TableCell>
                          <TableCell>{student.profiles?.email}</TableCell>
                          <TableCell>{new Date(student.enrolled_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="assignments">
            <div className="space-y-4">
              <div className="flex justify-end">
                <Link to={`/teacher/courses/${id}/assignments/create`}>
                  <Button className="bg-gradient-gold">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Assignment
                  </Button>
                </Link>
              </div>

              {assignments.length === 0 ? (
                <Card className="p-12 text-center bg-card border-border">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No assignments yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first assignment</p>
                  <Link to={`/teacher/courses/${id}/assignments/create`}>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Assignment
                    </Button>
                  </Link>
                </Card>
              ) : (
                <div className="space-y-4">
                  {assignments.map((assignment: any) => (
                    <Card key={assignment.id} className="p-6 bg-card border-border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{assignment.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{assignment.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No deadline'}</span>
                            <span>{assignment.submissions?.[0]?.count || 0} submissions</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/teacher/assignments/${assignment.id}/submissions`}>
                            <Button size="sm" variant="outline">
                              View Submissions
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this assignment?')) {
                                deleteAssignmentMutation.mutate(assignment.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseDetails;
