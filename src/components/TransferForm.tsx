
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { transferFunds } from '@/services/transactionService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Loader2 } from 'lucide-react';

interface TransferFormProps {
  onSuccess: () => void;
  isProcessing?: boolean;
}

const TransferForm = ({ onSuccess, isProcessing = false }: TransferFormProps) => {
  const { account } = useAuth();
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [formattedAmount, setFormattedAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    accountNumber: '',
    amount: '',
    description: ''
  });

  // Format the amount as currency
  useEffect(() => {
    if (amount) {
      // Format as Brazilian currency
      const numericValue = parseFloat(amount);
      if (!isNaN(numericValue)) {
        setFormattedAmount(
          new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(numericValue)
        );
      } else {
        setFormattedAmount('');
      }
    } else {
      setFormattedAmount('');
    }
  }, [amount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and a decimal point
    const value = e.target.value.replace(/[^\d.,]/g, '');
    
    // Normalize the decimal separator to a period
    const normalizedValue = value.replace(',', '.');
    
    setAmount(normalizedValue);
  };

  const validate = () => {
    const newErrors = {
      accountNumber: '',
      amount: '',
      description: ''
    };
    
    if (!accountNumber) {
      newErrors.accountNumber = 'O número da conta é obrigatório';
    }
    
    if (!amount) {
      newErrors.amount = 'O valor é obrigatório';
    } else {
      const value = parseFloat(amount);
      if (isNaN(value) || value <= 0) {
        newErrors.amount = 'Valor inválido';
      }
    }
    
    // Description is now optional
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate() || !account) return;
    
    setIsLoading(true);
    
    try {
      const success = await transferFunds({
        sourceAccountId: account.id,
        destinationAccountNumber: accountNumber,
        amount: parseFloat(amount),
        description: description || undefined // Send undefined if description is empty
      });
      
      if (success) {
        setAccountNumber('');
        setAmount('');
        setFormattedAmount('');
        setDescription('');
        onSuccess();
      }
    } catch (error) {
      console.error('Erro na transferência:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!account) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="accountNumber">Número da conta destino</Label>
        <Input
          id="accountNumber"
          placeholder="Ex: 1001"
          value={accountNumber}
          onChange={e => setAccountNumber(e.target.value)}
          disabled={isLoading || isProcessing}
        />
        {errors.accountNumber && <p className="text-sm text-destructive">{errors.accountNumber}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amount">Valor</Label>
        <div className="relative">
          <Input
            id="amount"
            type="text"
            placeholder="R$ 0,00"
            value={amount}
            onChange={handleAmountChange}
            disabled={isLoading || isProcessing}
            className="pr-16"
          />
          {formattedAmount && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
              {formattedAmount}
            </div>
          )}
        </div>
        {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Input
          id="description"
          placeholder="Ex: Pagamento de almoço"
          value={description}
          onChange={e => setDescription(e.target.value)}
          disabled={isLoading || isProcessing}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading || isProcessing}>
        {isLoading || isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isLoading ? 'Processando...' : 'Atualizando...'}
          </>
        ) : (
          <>
            Transferir <ArrowRight className="ml-2" size={16} />
          </>
        )}
      </Button>
    </form>
  );
};

export default TransferForm;
