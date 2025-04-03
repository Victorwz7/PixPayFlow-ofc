
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/MainLayout';
import AccountCard from '@/components/AccountCard';
import TransactionsList from '@/components/TransactionsList';
import { getAccountTransactions } from '@/services/transactionService';
import { Transaction } from '@/types/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { RefreshCcw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { account, profile, isLoading: authLoading, refreshAccount } = useAuth();
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const loadTransactions = useCallback(async () => {
    if (account) {
      setIsLoading(true);
      setError(false);
      
      try {
        const transactions = await getAccountTransactions(account.id);
        setRecentTransactions(transactions.slice(0, 5));
      } catch (error) {
        console.error("Erro ao carregar transações:", error);
        setError(true);
        toast.error("Não foi possível carregar as transações recentes.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [account]);
  
  useEffect(() => {
    // Carregue as transações apenas uma vez quando o componente for montado
    if (account && recentTransactions.length === 0) {
      loadTransactions();
    }
  }, [account, loadTransactions, recentTransactions.length]);

  const handleRefreshTransactions = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    
    try {
      await loadTransactions();
      toast.success("Transações atualizadas");
    } finally {
      setIsRefreshing(false);
    }
  };

  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="space-y-4 w-full max-w-md">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!account || !profile) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Carregando suas informações...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Olá, {profile.name}</h1>
        <p className="text-muted-foreground">
          Bem-vindo(a) ao PixPayFlow. Aqui está seu resumo financeiro.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="mb-6">
            <AccountCard />
          </div>
          
          <div>
            <h2 className="font-semibold mb-3">Ações rápidas</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/transfer" className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 text-center hover:bg-gray-50 transition-colors">
                <span className="text-bank-blue font-medium">Transferir</span>
              </Link>
              <Link to="/transactions" className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 text-center hover:bg-gray-50 transition-colors">
                <span className="text-bank-blue font-medium">Ver transações</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-black">Transações recentes</h2>
            <Button 
              onClick={handleRefreshTransactions}
              variant="ghost"
              size="sm"
              className="text-bank-blue font-medium hover:bg-gray-50 flex items-center gap-1"
              disabled={isRefreshing}
            >
              <RefreshCcw size={16} className={isRefreshing ? "animate-spin" : ""} />
              <span className="text-black">Atualizar</span>
            </Button>
          </div>
          
          <div className="max-h-[320px] overflow-auto">
            <div className="text-black">
              <TransactionsList limit={5} disableAutoRefresh={true} />
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-black">
              {error ? 'Falha ao carregar transações' : 'Últimas 5 transações'}
            </span>
            <Link 
              to="/transactions"
              className="text-bank-blue font-medium hover:underline flex items-center gap-1 text-sm"
            >
              <span className="text-black">Ver todas</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
