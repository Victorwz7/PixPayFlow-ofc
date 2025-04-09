
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Settings, Home, Send, User, LogOut, LayoutDashboard, History } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { logout, user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/transfer', icon: <Send size={20} />, label: 'Transferir' },
    { path: '/transactions', icon: <History size={20} />, label: 'Transações' },
    { path: '/profile', icon: <User size={20} />, label: 'Perfil' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card shadow-md px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl text-primary">PixPayFlow</Link>
        
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-sm text-muted-foreground">
            Olá, <span className="font-medium text-foreground">{profile?.name || 'Usuário'}</span>
          </span>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-muted/70"
          >
            <Settings size={20} />
          </button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="hidden md:flex"
          >
            <LogOut size={20} />
          </Button>
        </div>
      </header>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-14 right-4 z-50 bg-card shadow-lg rounded-lg py-2 w-48">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-sm text-muted-foreground">Olá,</p>
            <p className="font-medium">{profile?.name || 'Usuário'}</p>
          </div>
          
          <div className="py-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted 
                  ${isActive(item.path) ? 'text-primary font-medium' : 'text-foreground'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted w-full text-left"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      )}
      
      {/* Main content */}
      <main className="flex-1 container py-6 px-4">
        <div className="md:ml-64">
          {children}
        </div>
      </main>
      
      {/* Bottom navigation for mobile */}
      <nav className="md:hidden bg-card border-t border-border fixed bottom-0 left-0 right-0 z-10">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-3 flex-1 
                ${isActive(item.path) ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
      
      {/* Desktop navigation - Corrigido para não invadir o conteúdo */}
      <nav className="hidden md:block fixed top-20 left-6 bottom-6 w-56">
        <div className="bg-sidebar shadow-md rounded-lg h-full py-4">
          <div className="space-y-1 px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-sidebar-accent 
                  ${isActive(item.path) 
                    ? 'bg-sidebar-accent text-primary font-medium' 
                    : 'text-sidebar-foreground'}`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      
      {/* Padding for mobile nav */}
      <div className="md:hidden h-16"></div>
    </div>
  );
};

export default MainLayout;
