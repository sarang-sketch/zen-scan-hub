import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Home } from "./pages/Home";
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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkup" element={<Checkup />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/results" element={<Results />} />
            <Route path="/wellness" element={<Wellness />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/help" element={<Help />} />
            <Route path="/login" element={<Login />} />
            <Route path="/parent" element={<Parent />} />
            <Route path="/ai-extension" element={<AIExtensionPage />} />
            <Route path="/todo" element={<TodoPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
