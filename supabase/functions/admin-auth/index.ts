
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Função para hash da senha usando crypto
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Função para verificar senha
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashedPassword = await hashPassword(password);
  return hashedPassword === hash;
}

// Função simples para gerar token JWT
function generateSimpleToken(adminId: string, email: string): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({
    admin_id: adminId,
    email: email,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
  }));
  
  // Token simples para desenvolvimento
  return `${header}.${payload}.signature`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    console.log('Admin auth request:', path, req.method);

    switch (path) {
      case 'login':
        return await handleLogin(req);
      case 'register':
        return await handleRegister(req);
      case 'verify':
        return await handleVerifyToken(req);
      default:
        return new Response(JSON.stringify({ error: 'Route not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error in admin-auth function:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleLogin(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log('Login attempt for:', email);

    if (!email || !password) {
      console.log('Missing email or password');
      return new Response(JSON.stringify({ error: 'Email e senha são obrigatórios' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Buscar admin no banco
    console.log('Searching for admin in database...');
    const { data: admin, error: dbError } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    console.log('Database query result:', { admin: admin ? 'found' : 'not found', error: dbError });

    if (dbError || !admin) {
      console.log('Admin not found or database error:', dbError);
      return new Response(JSON.stringify({ error: 'Credenciais inválidas' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verificar senha
    console.log('Verifying password for admin:', admin.email);
    const passwordMatch = await verifyPassword(password, admin.password_hash);
    console.log('Password verification result:', passwordMatch);
    
    if (!passwordMatch) {
      console.log('Password does not match for admin:', admin.email);
      return new Response(JSON.stringify({ error: 'Credenciais inválidas' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Gerar token simples
    console.log('Generating simple token...');
    const token = generateSimpleToken(admin.id, admin.email);

    // Salvar sessão no banco
    const expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000));
    console.log('Saving session to database...');
    const { error: sessionError } = await supabase
      .from('admin_sessions')
      .insert({
        admin_id: admin.id,
        token,
        expires_at: expiresAt.toISOString()
      });

    if (sessionError) {
      console.error('Error creating session:', sessionError);
    } else {
      console.log('Session created successfully');
    }

    console.log('Login successful for:', email);

    const response = {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    };

    console.log('Sending response:', response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleRegister(req: Request) {
  try {
    const { email, password, name, role = 'admin' } = await req.json();

    console.log('Admin registration attempt for:', email);

    if (!email || !password || !name) {
      return new Response(JSON.stringify({ error: 'Email, senha e nome são obrigatórios' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (password.length < 6) {
      return new Response(JSON.stringify({ error: 'A senha deve ter pelo menos 6 caracteres' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verificar se o email já existe
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('id')
      .eq('email', email)
      .single();

    if (existingAdmin) {
      return new Response(JSON.stringify({ error: 'Email já está em uso' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Gerar hash da senha
    const passwordHash = await hashPassword(password);

    // Criar admin
    const { data: admin, error } = await supabase
      .from('admins')
      .insert({
        email,
        password_hash: passwordHash,
        name,
        role
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating admin:', error);
      throw error;
    }

    console.log('Admin created successfully:', admin.email);

    return new Response(JSON.stringify({
      message: 'Administrador criado com sucesso',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Register error:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleVerifyToken(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Token não fornecido' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verificar se a sessão ainda é válida
    const { data: session } = await supabase
      .from('admin_sessions')
      .select('*')
      .eq('token', token)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (!session) {
      return new Response(JSON.stringify({ error: 'Token inválido ou expirado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ valid: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Token inválido' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
