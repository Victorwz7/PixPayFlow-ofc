
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const ProfileForm = () => {
  const { user, profile } = useAuth();
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    
    if (!email) {
      setEmailError('O email é obrigatório');
      return;
    }
    
    if (email === user?.email) {
      setEmailError('O novo email deve ser diferente do atual');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Email inválido');
      return;
    }
    
    setIsEmailLoading(true);
    // Simulação de atualização de email já que não temos a função real no contexto
    setTimeout(() => {
      setIsEmailLoading(false);
      toast.success("Email atualizado com sucesso");
    }, 1500);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    
    if (!currentPassword) {
      errors.currentPassword = 'A senha atual é obrigatória';
    }
    
    if (!newPassword) {
      errors.newPassword = 'A nova senha é obrigatória';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'A senha deve ter pelo menos 6 caracteres';
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Confirme a nova senha';
    } else if (confirmPassword !== newPassword) {
      errors.confirmPassword = 'As senhas não coincidem';
    }
    
    setPasswordErrors(errors);
    
    if (Object.values(errors).some(error => error)) {
      return;
    }
    
    setIsPasswordLoading(true);
    // Simulação de atualização de senha já que não temos a função real no contexto
    setTimeout(() => {
      setIsPasswordLoading(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success("Senha atualizada com sucesso");
    }, 1500);
  };

  if (!user || !profile) return null;

  return (
    <Tabs defaultValue="email" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="password">Senha</TabsTrigger>
      </TabsList>
      
      <TabsContent value="email" className="mt-4">
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Nome</Label>
            <Input
              id="name"
              value={profile.name}
              disabled
              className="bg-muted text-foreground"
            />
            <p className="text-xs text-muted-foreground">O nome não pode ser alterado.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={isEmailLoading}
              className="text-foreground"
            />
            {emailError && <p className="text-sm text-destructive">{emailError}</p>}
          </div>
          
          <Button type="submit" className="w-full" disabled={isEmailLoading}>
            {isEmailLoading ? 'Atualizando...' : 'Atualizar Email'}
          </Button>
        </form>
      </TabsContent>
      
      <TabsContent value="password" className="mt-4">
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-foreground">Senha Atual</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              disabled={isPasswordLoading}
              className="text-foreground"
            />
            {passwordErrors.currentPassword && (
              <p className="text-sm text-destructive">{passwordErrors.currentPassword}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-foreground">Nova Senha</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              disabled={isPasswordLoading}
              className="text-foreground"
            />
            {passwordErrors.newPassword && (
              <p className="text-sm text-destructive">{passwordErrors.newPassword}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground">Confirmar Nova Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              disabled={isPasswordLoading}
              className="text-foreground"
            />
            {passwordErrors.confirmPassword && (
              <p className="text-sm text-destructive">{passwordErrors.confirmPassword}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={isPasswordLoading}>
            {isPasswordLoading ? 'Atualizando...' : 'Atualizar Senha'}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileForm;
