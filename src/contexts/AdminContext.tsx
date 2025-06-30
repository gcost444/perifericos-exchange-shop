
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
      try {
        setToken(savedToken);
        setAdmin(JSON.parse(savedAdmin));
      } catch (error) {
        console.error('Error parsing saved admin data:', error);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
      }
    }
    
    setLoading(false);
  }, []);

  const adminLogin = async (email: string, password: string) => {
    try {
      console.log('Attempting admin login for:', email);
      
      const { data, error } = await supabase.functions.invoke('admin-auth/login', {
        body: { email, password }
      });

      console.log('Login response:', { data, error });

      if (error) {
        console.error('Login error:', error);
        
        let errorMessage = 'Erro ao fazer login';
        
        // Tratamento específico para diferentes tipos de erro
        if (error.message?.includes('FunctionsHttpError')) {
          errorMessage = 'Servidor de autenticação indisponível. Tente novamente em alguns instantes.';
        } else if (error.message?.includes('FunctionsFetchError')) {
          errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        } else if (error.context?.json?.error) {
          errorMessage = error.context.json.error;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast({
          title: "Erro ao fazer login",
          description: errorMessage,
          variant: "destructive",
        });
        
        return { error };
      }

      if (!data || !data.admin || !data.token) {
        const noDataError = new Error('Resposta inválida do servidor');
        console.error('Invalid response data:', data);
        toast({
          title: "Erro ao fazer login",
          description: "Resposta inválida do servidor. Tente novamente.",
          variant: "destructive",
        });
        return { error: noDataError };
      }

      console.log('Login successful, setting admin data:', data.admin);
      
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
        title: "Erro inesperado",
        description: "Erro de conexão com o servidor. Verifique sua internet e tente novamente.",
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
