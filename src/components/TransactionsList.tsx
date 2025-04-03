
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAccountTransactions, formatCurrency, formatDate } from '@/services/transactionService';
import { ArrowDown, ArrowUp, RefreshCcw } from 'lucide-react';
import { Transaction } from '@/types/supabase';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface TransactionsListProps {
  limit?: number;
  disableAutoRefresh?: boolean;
}

const TransactionsList = ({ limit, disableAutoRefresh = false }: TransactionsListProps) => {
  const { account } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMobile = useIsMobile();

  const fetchTransactions = useCallback(async () => {
    if (!account) return;
    
    setIsLoading(true);
    setError(false);
    
    try {
      const accountTransactions = await getAccountTransactions(account.id);
      setTransactions(limit ? accountTransactions.slice(0, limit) : accountTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [account, limit]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    
    try {
      await fetchTransactions();
    } finally {
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    // Only fetch on initial load and when account changes
    if (account) {
      fetchTransactions();
    }
  }, [account, fetchTransactions]);

  if (isLoading) {
    return (
      <div className="p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground mb-4">Não foi possível carregar as transações.</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCcw size={16} className={isRefreshing ? "animate-spin" : ""} />
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Ainda não há transações para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {transactions.map((transaction) => {
        const isIncoming = transaction.destination_account_id === account?.id;
        
        return (
          <div key={transaction.id} className="transaction-item">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${isIncoming ? 'bg-bank-lightGreen text-bank-green' : 'bg-bank-lightBlue text-bank-blue'}`}>
                {isIncoming ? <ArrowDown size={isMobile ? 16 : 20} /> : <ArrowUp size={isMobile ? 16 : 20} />}
              </div>
              <div>
                <p className="font-medium text-sm md:text-base text-foreground text-gray-500">
                  {isIncoming ? (transaction.sender_name || 'Recebimento') : 'Transferência para outra conta'}
                </p>
                <div className="flex flex-col">
                  <p className="text-xs md:text-sm text-muted-foreground">{formatDate(transaction.created_at)}</p>
                  {transaction.description && (
                    <p className="text-xs text-muted-foreground">{transaction.description}</p>
                  )}
                </div>
              </div>
            </div>
            <div className={`font-semibold text-sm md:text-base ${isIncoming ? 'text-bank-green' : 'text-bank-blue'}`}>
              {isIncoming ? '+' : '-'} {formatCurrency(transaction.amount)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TransactionsList;
