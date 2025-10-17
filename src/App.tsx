import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import RoleSelect from "./pages/auth/RoleSelect";
import Login from "./pages/auth/Login";
import SignupStudent from "./pages/auth/SignupStudent";
import SignupTeacher from "./pages/auth/SignupTeacher";
import StudentDashboard from "./pages/student/Dashboard";
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherCourses from "./pages/teacher/Courses";
import CreateCourse from "./pages/teacher/CreateCourse";
import CourseDetails from "./pages/teacher/CourseDetails";
import CreateAssignment from "./pages/teacher/CreateAssignment";
import AssignmentSubmissions from "./pages/teacher/AssignmentSubmissions";
import Approvals from "./pages/teacher/Approvals";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/role-select" element={<RoleSelect />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup/student" element={<SignupStudent />} />
          <Route path="/auth/signup/teacher" element={<SignupTeacher />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/courses" element={<TeacherCourses />} />
          <Route path="/teacher/courses/create" element={<CreateCourse />} />
          <Route path="/teacher/courses/:id" element={<CourseDetails />} />
          <Route path="/teacher/courses/:id/assignments/create" element={<CreateAssignment />} />
          <Route path="/teacher/assignments/:id/submissions" element={<AssignmentSubmissions />} />
          <Route path="/teacher/approvals" element={<Approvals />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
