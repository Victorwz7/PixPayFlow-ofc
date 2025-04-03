
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/MainLayout';
import ProfileForm from '@/components/ProfileForm';
import { formatCurrency, formatDate } from '@/services/transactionService';
import { User, CreditCard, Calendar, Key } from 'lucide-react';

const ProfilePage = () => {
  const { profile, account } = useAuth();

  if (!profile || !account) {
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
        <h1 className="text-2xl font-bold text-foreground">Seu perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-xl font-semibold mb-6 text-foreground">Informações da conta</h2>
            <ProfileForm />
          </div>
        </div>
        
        <div>
          <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="font-semibold text-foreground">Detalhes da conta</h2>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-bank-lightBlue p-2 rounded-full text-bank-blue mt-1">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium text-foreground">{profile.name}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-bank-lightBlue p-2 rounded-full text-bank-blue mt-1">
                  <CreditCard size={18} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Número da conta</p>
                  <p className="font-medium text-foreground">{account.account_number}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-bank-lightBlue p-2 rounded-full text-bank-blue mt-1">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Conta criada em</p>
                  <p className="font-medium text-foreground">{formatDate(account.created_at)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-bank-lightBlue p-2 rounded-full text-bank-blue mt-1">
                  <Key size={18} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Saldo atual</p>
                  <p className="font-medium text-bank-green">{formatCurrency(account.balance)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
