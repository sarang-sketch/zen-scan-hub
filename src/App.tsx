import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import { Checkup } from "./pages/Checkup";
import { Scanner } from "./pages/Scanner";
import { Dashboard } from "./pages/Dashboard";
import { Results } from "./pages/Results";
import { Help } from "./pages/Help";
import { Login } from "./pages/Login";
import { Parent } from "./pages/Parent";
import { Wellness } from "./pages/Wellness";
import { Workouts } from "./pages/Workouts";
import { AIExtensionPage } from "./pages/AIExtensionPage";
import TodoPage from "./pages/Todo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/checkup" element={<ProtectedRoute><Checkup /></ProtectedRoute>} />
              <Route path="/scanner" element={<ProtectedRoute><Scanner /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
              <Route path="/wellness" element={<ProtectedRoute><Wellness /></ProtectedRoute>} />
              <Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
              <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
              <Route path="/parent" element={<ProtectedRoute><Parent /></ProtectedRoute>} />
              <Route path="/ai-extension" element={<ProtectedRoute><AIExtensionPage /></ProtectedRoute>} />
              <Route path="/todo" element={<ProtectedRoute><TodoPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
