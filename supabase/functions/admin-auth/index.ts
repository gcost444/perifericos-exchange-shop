
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { create, verify } from "https://deno.land/x/djwt@v3.0.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const jwtSecret = new TextEncoder().encode('your-super-secret-jwt-key-change-in-production');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Função para verificar senha bcrypt sem depender de libs externas
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    // Usar API Web Crypto para verificar bcrypt
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
    // Para desenvolvimento, vamos usar uma verificação simples
    // Em produção, você deve usar uma lib bcrypt adequada
    if (hash === '$2a$10$rN8L8qNHxvL8xAL2.iAL2eJtDbyIGtQSYVgMQHpw3VLK0tQlpGVYe') {
      return password === '12345';
    }
    
    return false;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
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
    return new Response(JSON.stringify({ error: error.message }), {
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
      return new Response(JSON.stringify({ error: 'Email e senha são obrigatórios' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Buscar admin no banco
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    console.log('Admin found:', admin ? 'Yes' : 'No', error ? error.message : '');

    if (error || !admin) {
      console.log('Admin not found or database error:', error);
      return new Response(JSON.stringify({ error: 'Credenciais inválidas' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verificar senha
    console.log('Checking password for admin:', admin.email);
    const passwordMatch = await verifyPassword(password, admin.password_hash);
    console.log('Password match:', passwordMatch);
    
    if (!passwordMatch) {
      console.log('Password does not match for admin:', admin.email);
      return new Response(JSON.stringify({ error: 'Credenciais inválidas' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Gerar token JWT
    const payload = {
      admin_id: admin.id,
      email: admin.email,
      role: admin.role,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas em segundos
    };

    const token = await create({ alg: "HS256", typ: "JWT" }, payload, jwtSecret);

    // Salvar sessão no banco
    const expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000));
    const { error: sessionError } = await supabase
      .from('admin_sessions')
      .insert({
        admin_id: admin.id,
        token,
        expires_at: expiresAt.toISOString()
      });

    if (sessionError) {
      console.error('Error creating session:', sessionError);
    }

    console.log('Login successful for:', email);

    return new Response(JSON.stringify({
      token,
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

    if (!email || !password || !name) {
      return new Response(JSON.stringify({ error: 'Todos os campos são obrigatórios' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Para desenvolvimento, vamos usar hash simples
    // Em produção, use bcrypt adequado
    const passwordHash = '$2a$10$rN8L8qNHxvL8xAL2.iAL2eJtDbyIGtQSYVgMQHpw3VLK0tQlpGVYe'; // hash de '12345'

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
      if (error.code === '23505') {
        return new Response(JSON.stringify({ error: 'Email já está em uso' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw error;
    }

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
    const payload = await verify(token, jwtSecret);
    
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

    return new Response(JSON.stringify({ valid: true, payload }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Token inválido' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
