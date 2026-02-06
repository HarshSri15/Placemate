import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Kanban, 
  BarChart3, 
  Bell, 
  Settings, 
  Target,
  Plus,
  LogOut,
  User,
  ChevronLeft,
  Menu,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from '@/components/ThemeToggle';
import { api } from '@/services/api';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Kanban, label: 'Pipeline', path: '/pipeline' },
  { icon: FileText, label: 'Applications', path: '/applications' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Bell, label: 'Reminders', path: '/reminders' },
];

const bottomNavItems = [
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await api.getCurrentUser();
        setUserName(user.name || 'User');
        setUserEmail(user.email || '');
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-2 px-3 py-4 border-b border-sidebar-border",
        collapsed && !isMobile && "justify-center"
      )}>
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Target className="w-5 h-5 text-primary-foreground" />
        </div>
        {(!collapsed || isMobile) && (
          <span className="font-bold text-lg">PlaceMate</span>
        )}
      </div>

      {/* Add New Button */}
      <div className="p-3">
        <Button asChild className={cn("w-full", collapsed && !isMobile && "p-2")}>
          <Link to="/applications/new">
            <Plus className="w-4 h-4" />
            {(!collapsed || isMobile) && <span className="ml-2">Add Application</span>}
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-accent text-sidebar-primary font-medium",
                collapsed && !isMobile && "justify-center px-2"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {(!collapsed || isMobile) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        {/* Theme Toggle */}
        <ThemeToggle collapsed={collapsed && !isMobile} />
        
        {bottomNavItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-accent text-sidebar-primary font-medium",
                collapsed && !isMobile && "justify-center px-2"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {(!collapsed || isMobile) && <span>{item.label}</span>}
            </Link>
          );
        })}

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-colors",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && !isMobile && "justify-center px-2"
            )}>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              {(!collapsed || isMobile) && (
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">{userName}</div>
                  <div className="text-xs text-muted-foreground">{userEmail}</div>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover">
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className={cn(
          "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-40",
          collapsed ? "w-16" : "w-64"
        )}>
          <NavContent />
          
          {/* Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-20 w-6 h-6 rounded-full border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </aside>
      )}

      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 h-14 bg-background border-b border-border flex items-center justify-between px-4 z-40">
          <button onClick={() => setMobileOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Target className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold">PlaceMate</span>
          </div>
          <Button size="sm" asChild>
            <Link to="/applications/new">
              <Plus className="w-4 h-4" />
            </Link>
          </Button>
        </header>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && mobileOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 h-screen w-72 bg-sidebar border-r border-sidebar-border flex flex-col z-50 animate-slide-in-right">
            <NavContent />
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        !isMobile && (collapsed ? "ml-16" : "ml-64"),
        isMobile && "mt-14"
      )}>
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border flex items-center justify-around z-40">
          {navItems.slice(0, 4).map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
