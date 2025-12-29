import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";

// Job Seeker Pages
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import ProfilePage from "./pages/ProfilePage";
import CVBuilderPage from "./pages/CVBuilderPage";

// Employer Pages
import EmployerDashboard from "./pages/EmployerDashboard";
import PostJobPage from "./pages/PostJobPage";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";

function ProtectedRoute({ component: Component, requiredRole }: { component: any; requiredRole?: string }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    window.location.href = "/";
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <NotFound />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />

      {/* Job Seeker Routes */}
      <Route path="/jobs" component={JobsPage} />
      <Route path="/jobs/:id" component={JobDetailPage} />
      <Route path="/applications" component={MyApplicationsPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/cv-builder" component={CVBuilderPage} />
      <Route path="/cv-builder/:id" component={CVBuilderPage} />

      {/* Employer Routes */}
      <Route
        path="/employer/dashboard"
        component={() => <ProtectedRoute component={EmployerDashboard} requiredRole="employer" />}
      />
      <Route
        path="/employer/post-job"
        component={() => <ProtectedRoute component={PostJobPage} requiredRole="employer" />}
      />
      <Route
        path="/employer/edit-job/:id"
        component={() => <ProtectedRoute component={PostJobPage} requiredRole="employer" />}
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        component={() => <ProtectedRoute component={AdminDashboard} requiredRole="admin" />}
      />

      {/* Fallback */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
