
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, UserPlus, LogIn, Shield } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, resetPassword } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isReset) {
      const { error } = await resetPassword(formData.email);
      if (!error) {
        setIsReset(false);
        setIsLogin(true);
      }
      setLoading(false);
      return;
    }

    if (isLogin) {
      const { error } = await signIn(formData.email, formData.password);
      if (!error) {
        navigate('/');
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert('As senhas não coincidem');
        setLoading(false);
        return;
      }

      const { error } = await signUp(formData.email, formData.password, formData.fullName);
      if (!error) {
        setIsLogin(true);
      }
    }
    
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {isLogin ? (
              <LogIn className="h-12 w-12 text-blue-600" />
            ) : (
              <UserPlus className="h-12 w-12 text-blue-600" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {isReset 
              ? 'Recuperar Senha' 
              : isLogin 
                ? 'Entrar na sua conta' 
                : 'Criar nova conta'
            }
          </CardTitle>
          <p className="text-gray-600">
            {isReset 
              ? 'Digite seu email para recuperar a senha' 
              : isLogin 
                ? 'Entre com suas credenciais' 
                : 'Preencha os dados para se cadastrar'
            }
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && !isReset && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            {!isReset && (
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            {!isLogin && !isReset && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading 
                ? 'Carregando...' 
                : isReset 
                  ? 'Enviar Email de Recuperação'
                  : isLogin 
                    ? 'Entrar' 
                    : 'Criar Conta'
              }
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            {!isReset && (
              <>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {isLogin 
                      ? 'Não tem uma conta? Cadastre-se' 
                      : 'Já tem uma conta? Faça login'
                    }
                  </button>
                </div>

                {isLogin && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setIsReset(true)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Esqueceu sua senha?
                    </button>
                  </div>
                )}

                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/admin/login')}
                    className="flex items-center w-full"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Acesso Administrativo
                  </Button>
                </div>
              </>
            )}

            {isReset && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsReset(false);
                    setIsLogin(true);
                  }}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Voltar ao login
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
