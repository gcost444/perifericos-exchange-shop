
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminContextType {
  admin: Admin | null;
  loading: boolean;
  token: string | null;
  adminLogin: (email: string, password: string) => Promise<{ error: any }>;
  adminLogout: () => void;
  isAuthenticated: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há token salvo no localStorage
    const savedToken = localStorage.getItem('admin_token');
    const savedAdmin = localStorage.getItem('admin_data');

    if (savedToken && savedAdmin) {
      setToken(savedToken);
      setAdmin(JSON.parse(savedAdmin));
    }
    
    setLoading(false);
  }, []);

  const adminLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth/login', {
        body: { email, password }
      });

      if (error) throw error;

      setAdmin(data.admin);
      setToken(data.token);
      
      // Salvar no localStorage
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_data', JSON.stringify(data.admin));

      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${data.admin.name}!`,
      });

      return { error: null };
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Credenciais inválidas",
        variant: "destructive",
      });
      return { error };
    }
  };

  const adminLogout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
    
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  return (
    <AdminContext.Provider value={{
      admin,
      loading,
      token,
      adminLogin,
      adminLogout,
      isAuthenticated: !!admin && !!token,
    }}>
      {children}
    </AdminContext.Provider>
  );
};
