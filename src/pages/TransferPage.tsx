
import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import TransferForm from '@/components/TransferForm';
import AccountCard from '@/components/AccountCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const TransferPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();
  const { refreshAccount } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Garantir que a conta seja atualizada quando entramos na página
  useEffect(() => {
    refreshAccount?.()
      .catch(error => {
        console.error("Erro ao atualizar conta:", error);
        toast.error("Falha ao carregar informações da conta. Tente novamente.");
      });
  }, [refreshAccount]);

  const handleTransferSuccess = async () => {
    setIsProcessing(true);
    
    try {
      // Atualizar o saldo da conta
      await refreshAccount?.();
      
      // Incrementar para forçar o componente AccountCard a atualizar
      setRefreshTrigger(prev => prev + 1);
      
      toast.success('Transferência realizada com sucesso!');
      
      // Redirecionar para o dashboard após um pequeno delay
      setTimeout(() => {
        setIsProcessing(false);
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);
      setIsProcessing(false);
      toast.error('Erro ao atualizar saldo. Por favor, recarregue a página.');
    }
  };

  return (
    <MainLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">Transferência</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <AccountCard key={refreshTrigger} />
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Como funciona</CardTitle>
                <CardDescription>Informações sobre transferências</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="font-medium">Transferências instantâneas</p>
                  <p className="text-muted-foreground">
                    Todas as transferências são processadas instantaneamente, 24h por dia.
                  </p>
                </div>
                <div>
                  <p className="font-medium">Limite de transferência</p>
                  <p className="text-muted-foreground">
                    O limite para transferências é o saldo disponível em sua conta.
                  </p>
                </div>
                <div>
                  <p className="font-medium">Segurança</p>
                  <p className="text-muted-foreground">
                    Verifique sempre o número da conta do destinatário antes de confirmar.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nova Transferência</CardTitle>
              <CardDescription>
                Preencha os dados para realizar sua transferência
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransferForm onSuccess={handleTransferSuccess} isProcessing={isProcessing} />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default TransferPage;
