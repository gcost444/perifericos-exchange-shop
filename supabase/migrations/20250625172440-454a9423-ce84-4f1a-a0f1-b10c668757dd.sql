
-- Criar tabela de administradores
CREATE TABLE public.admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar constraint para roles válidas
ALTER TABLE public.admins ADD CONSTRAINT admins_role_check 
CHECK (role IN ('admin', 'super_admin'));

-- Habilitar RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Política para admins visualizarem outros admins (apenas super_admin pode ver todos)
CREATE POLICY "Admins can view based on role" ON public.admins
  FOR SELECT USING (
    CASE 
      WHEN auth.jwt() ->> 'role' = 'super_admin' THEN true
      WHEN auth.jwt() ->> 'role' = 'admin' AND id = (auth.jwt() ->> 'admin_id')::uuid THEN true
      ELSE false
    END
  );

-- Criar tabela de sessões de admin
CREATE TABLE public.admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES public.admins(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS na tabela de sessões
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Política para sessões
CREATE POLICY "Admin sessions policy" ON public.admin_sessions
  FOR ALL USING (admin_id = (auth.jwt() ->> 'admin_id')::uuid);

-- Adicionar coluna admin_id na tabela products para rastrear quem criou
ALTER TABLE public.products ADD COLUMN admin_id UUID REFERENCES public.admins(id);

-- Criar índices para performance
CREATE INDEX idx_admins_email ON public.admins(email);
CREATE INDEX idx_admin_sessions_token ON public.admin_sessions(token);
CREATE INDEX idx_admin_sessions_expires_at ON public.admin_sessions(expires_at);
