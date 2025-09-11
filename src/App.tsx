import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Checkup } from "./pages/Checkup";
import { Results } from "./pages/Results";
import { Scanner } from "./pages/Scanner";
import TodoPage from "./pages/Todo";
import { Wellness } from "./pages/Wellness";
import { Workouts } from "./pages/Workouts";
import { Parent } from "./pages/Parent";
import { Help } from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkup"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Checkup />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/results"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Results />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/scanner"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Scanner />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/todo"
              element={
                <ProtectedRoute>
                  <Layout>
                    <TodoPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/wellness"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Wellness />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/workouts"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Workouts />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Parent />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/help"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Help />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
