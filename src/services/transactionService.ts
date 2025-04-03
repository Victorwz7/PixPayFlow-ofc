
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Transaction } from "@/types/supabase";

export interface TransferParams {
  sourceAccountId: string;
  destinationAccountNumber: string;
  amount: number;
  description?: string;
}

export const getAccountByNumber = async (accountNumber: string) => {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('account_number', accountNumber)
      .single();
    
    if (error) {
      console.error('Erro ao buscar conta:', error);
      return undefined;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar conta:', error);
    return undefined;
  }
};

export const getAccountTransactions = async (accountId: string): Promise<Transaction[]> => {
  try {
    // Using the new database function to get transactions with sender names
    const { data, error } = await supabase
      .rpc('get_transactions_with_sender_name', {
        p_account_id: accountId
      });

    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const transferFunds = async (params: TransferParams): Promise<boolean> => {
  const { sourceAccountId, destinationAccountNumber, amount, description = "" } = params;

  try {
    // Buscar a conta de destino pelo número da conta
    const destinationAccount = await getAccountByNumber(destinationAccountNumber);
    if (!destinationAccount) {
      toast.error("Conta de destino não encontrada!");
      return false;
    }

    // Verificar se é a mesma conta
    if (sourceAccountId === destinationAccount.id) {
      toast.error("Não é possível transferir para a mesma conta!");
      return false;
    }

    // Verificar se o valor é positivo
    if (amount <= 0) {
      toast.error("O valor da transferência deve ser maior que zero!");
      return false;
    }

    // Iniciar transação no Supabase
    const { data, error } = await supabase.rpc('transfer_funds', {
      p_source_account_id: sourceAccountId,
      p_destination_account_id: destinationAccount.id,
      p_amount: amount,
      p_description: description
    });

    if (error) {
      toast.error(error.message || "Erro ao realizar transferência!");
      return false;
    }

    toast.success("Transferência realizada com sucesso!");
    return true;
  } catch (error: any) {
    toast.error(error.message || "Erro ao realizar transferência!");
    return false;
  }
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};
