import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Camera, TrendingUp, Shield, LogIn, Menu, X, ListTodo, Puzzle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { AIAssistant } from "@/components/AIAssistant";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Checkup Test", path: "/checkup", icon: Brain },
    { name: "Photo Scanner", path: "/scanner", icon: Camera },
    { name: "Progress", path: "/dashboard", icon: TrendingUp },
    { name: "To-Do List", path: "/todo", icon: ListTodo },
    { name: "Parent Mode", path: "/parent", icon: Shield },
    { name: "AI Extension", path: "/ai-extension", icon: Puzzle },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-wellness">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  BalanceAI
                </h1>
                <p className="text-xs text-muted-foreground">Find Your Balance</p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => handleNavigation(item.path)}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Button>
                );
              })}
              <Button variant="glow" onClick={() => handleNavigation("/login")} className="ml-4 gap-2">
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border/50 pt-4">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.path}
                      variant={isActive ? "default" : "ghost"}
                      onClick={() => handleNavigation(item.path)}
                      className="justify-start gap-2 w-full"
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Button>
                  );
                })}
                <Button variant="glow" onClick={() => handleNavigation("/login")} className="gap-2 mt-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card/50 border-t border-border/50 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">BalanceAI</p>
                <p className="text-xs text-muted-foreground">Your private health companion</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                🔒 Your data stays safe. We don't sell or share.
              </span>
            </div>
          </div>
        </div>
      </footer>
      <AIAssistant userId="a1b2c3d4-e5f6-7890-1234-567890abcdef" />
    </div>
  );
};