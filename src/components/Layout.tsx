import { Sidebar } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Heart, 
  ScanLine, 
  BarChart3, 
  Brain,
  Menu,
  Users,
  HelpCircle,
  Settings,
  User,
  Dumbbell,
  CheckSquare,
  Bot,
  LogOut
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Don't show sidebar on login page or home page
  const showSidebar = location.pathname !== "/login" && location.pathname !== "/" && user;

  const menuItems = [
    { href: "/dashboard", title: "Dashboard", icon: BarChart3 },
    { href: "/checkup", title: "Wellness Checkup", icon: Heart },
    { href: "/scanner", title: "AI Scanner", icon: ScanLine },
    { href: "/workouts", title: "Workouts", icon: Dumbbell },
    { href: "/wellness", title: "Wellness", icon: Brain },
    { href: "/todo", title: "Todo", icon: CheckSquare },
    { href: "/ai-extension", title: "AI Extension", icon: Bot },
    { href: "/parent", title: "Parent Dashboard", icon: Users },
    { href: "/help", title: "Help", icon: HelpCircle },
  ];

  if (!showSidebar) {
    return <main className="min-h-screen bg-background">{children}</main>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r border-border bg-card">
          <div className="flex h-full max-h-screen flex-col">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
                <Brain className="h-6 w-6 text-primary" />
                <span className="text-primary">BalanceAI</span>
              </Link>
            </div>
            
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4">
                {menuItems.map((item) => (
                  <Button
                    key={item.href}
                    variant={location.pathname === item.href ? "secondary" : "ghost"}
                    className="justify-start mb-1"
                    asChild
                  >
                    <Link to={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Link>
                  </Button>
                ))}
              </nav>
            </div>
            
            {/* User section */}
            {user && (
              <div className="mt-auto p-4 border-t border-border">
                <div className="space-y-2">
                  <div className="px-2 py-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Sidebar>
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};