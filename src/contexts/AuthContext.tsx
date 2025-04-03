import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface Profile {
  id: string;
  name: string;
  created_at: string;
}

interface Account {
  id: string;
  user_id: string;
  account_number: string;
  balance: number;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  account: Account | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (name: string, email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  refreshAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchUserData = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (profileError) throw profileError;
      if (!profileData || profileData.length === 0) throw new Error('Profile not found');
      
      const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (accountError) throw accountError;
      if (!accountData || accountData.length === 0) throw new Error('Account not found');
      
      setProfile(profileData[0]);
      setAccount(accountData[0]);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Error loading your data. Please try again.');
    }
  };
  
  const refreshAccount = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Account not found');
      
      setAccount(data[0]);
    } catch (error) {
      console.error('Error updating account data:', error);
      throw error;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
        
        if (newSession?.user) {
          fetchUserData(newSession.user.id);
        } else {
          setProfile(null);
          setAccount(null);
        }
      }
    );
    
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      if (currentSession?.user) {
        fetchUserData(currentSession.user.id);
      }
      
      setIsLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  async function login(email: string, password: string) {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error: any) {
      return { error };
    } finally {
      setIsLoading(false);
    }
  }
  
  async function register(name: string, email: string, password: string) {
    try {
      setIsLoading(true);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });
      
      if (authError) {
        console.error('Auth error during registration:', authError);
        return { error: authError };
      }
      
      if (authData.user) {
        try {
          const accountNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
          const { error: accountError } = await supabase
            .from('accounts')
            .insert([
              {
                user_id: authData.user.id,
                account_number: accountNumber,
                balance: 1000
              }
            ]);
            
          if (accountError) {
            console.error('Error creating account:', accountError);
            return { error: accountError };
          }
        } catch (dbError: any) {
          console.error('Database error saving new user:', dbError);
          return { error: { message: 'Database error saving new user', details: dbError } };
        }
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Error during registration:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  }
  
  async function logout() {
    setIsLoading(true);
    await supabase.auth.signOut();
    setIsLoading(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        account,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
