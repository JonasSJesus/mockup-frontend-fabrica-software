import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserRole } from "@/../../shared/types";

// Pages
import Login from "./pages/Login";
import Home from "./pages/Home";

// Admin Pages
import Companies from "./pages/admin/Companies";
import Employees from "./pages/admin/Employees";
import Questions from "./pages/admin/Questions";
import Surveys from "./pages/admin/Surveys";
import Reports from "./pages/admin/Reports";
import Videos from "./pages/admin/Videos";
import Payments from "./pages/admin/Payments";
import Settings from "./pages/admin/Settings";

// Manager Pages
import ManagerDashboard from "./pages/manager/Dashboard";
import ManagerReports from "./pages/manager/Reports";

// Employee Pages
import EmployeeDashboard from "./pages/employee/Dashboard";
import SurveyForm from "./pages/employee/SurveyForm";
import VideoLibrary from "./pages/employee/VideoLibrary";
import Gamification from "./pages/employee/Gamification";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/login" component={Login} />
      
      {/* Admin Routes */}
      <Route path="/">
        {() => (
          <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE]}>
            <Home />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/empresas">
        {() => (
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <Companies />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/funcionarios">
        {() => (
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <Employees />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/perguntas">
        {() => (
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <Questions />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/questionarios">
        {() => (
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <Surveys />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/relatorios">
        {() => (
          <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
            <Reports />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/videos">
        {() => (
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <Videos />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/pagamentos">
        {() => (
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <Payments />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/configuracoes">
        {() => (
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <Settings />
          </ProtectedRoute>
        )}
      </Route>
      
      {/* Manager Routes */}
      <Route path="/gerente/dashboard">
        {() => (
          <ProtectedRoute allowedRoles={[UserRole.MANAGER]}>
            <ManagerDashboard />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/gerente/relatorios">
        {() => (
          <ProtectedRoute allowedRoles={[UserRole.MANAGER]}>
            <ManagerReports />
          </ProtectedRoute>
        )}
      </Route>
      
      {/* Employee Routes */}
      <Route path="/funcionario/dashboard">
        {() => (
          <ProtectedRoute allowedRoles={[UserRole.EMPLOYEE]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/funcionario/questionario/:id">
        {(params) => (
          <ProtectedRoute allowedRoles={[UserRole.EMPLOYEE]}>
            <SurveyForm surveyId={params.id} />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/funcionario/videos">
        {() => (
          <ProtectedRoute allowedRoles={[UserRole.EMPLOYEE]}>
            <VideoLibrary />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/funcionario/gamificacao">
        {() => (
          <ProtectedRoute allowedRoles={[UserRole.EMPLOYEE]}>
            <Gamification />
          </ProtectedRoute>
        )}
      </Route>
      
      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
