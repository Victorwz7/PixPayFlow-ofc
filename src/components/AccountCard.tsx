
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/services/transactionService';
import { CreditCard, Eye, EyeOff, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AccountCard = () => {
  const { account, profile, isLoading, refreshAccount } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!refreshAccount) return;
    
    setIsRefreshing(true);
    try {
      await refreshAccount();
      toast.success("Saldo atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar saldo.");
      console.error("Erro ao atualizar saldo:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="account-card">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Skeleton className="h-5 w-32 mb-2 bg-white/20" />
            <Skeleton className="h-8 w-48 bg-white/20" />
          </div>
          <Skeleton className="h-8 w-20 rounded-full bg-white/20" />
        </div>
        <div className="mt-3">
          <Skeleton className="h-4 w-24 bg-white/20 mb-2" />
          <Skeleton className="h-5 w-32 bg-white/20" />
        </div>
        
        {/* Elementos decorativos */}
        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10"></div>
        <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-white/10"></div>
      </div>
    );
  }

  if (!account || !profile) return null;

  return (
    <div className="account-card relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">Saldo disponível</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xl font-bold">
              {showBalance ? formatCurrency(account.balance) : 'R$ ••••••'}
            </span>
            <button 
              onClick={() => setShowBalance(!showBalance)} 
              className="p-1 hover:bg-white/20 rounded-full"
              aria-label={showBalance ? "Ocultar saldo" : "Mostrar saldo"}
            >
              {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-white/20 py-1 px-3 rounded-full text-sm">
          <CreditCard size={16} />
          <span>{account.account_number}</span>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-white/80 text-sm">Conta de</p>
        <p className="font-medium">{profile.name}</p>
      </div>
      
      {/* Botão de atualização */}
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="absolute top-1 right-1 text-white/80 hover:text-white hover:bg-white/10"
      >
        <RefreshCcw size={16} className={isRefreshing ? "animate-spin" : ""} />
        <span className="sr-only">Atualizar saldo</span>
      </Button>
      
      {/* Elementos decorativos */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10"></div>
      <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-white/10"></div>
    </div>
  );
};

export default AccountCard;
