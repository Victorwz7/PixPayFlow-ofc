
import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import TransactionsList from '@/components/TransactionsList';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { RefreshCcw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TransactionsPage = () => {
  const { isLoading: authLoading } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Increment refresh key to force component re-render
    setRefreshKey(prev => prev + 1);
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="space-y-4 w-full max-w-md">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-[500px] w-full rounded-lg" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Link 
            to="/" 
            className="text-muted-foreground flex items-center gap-2 hover:text-foreground mb-2"
          >
            <ArrowLeft size={16} />
            <span>Voltar ao início</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Histórico de Transações</h1>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCcw size={16} className={isRefreshing ? "animate-spin" : ""} />
          <span className="ml-2">Atualizar</span>
        </Button>
      </div>
      
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="font-semibold text-foreground">Todas as transações</h2>
        </div>
        
        <div className="max-h-[600px] overflow-auto">
          <TransactionsList disableAutoRefresh={true} key={refreshKey} />
        </div>
      </div>
    </MainLayout>
  );
};

export default TransactionsPage;
