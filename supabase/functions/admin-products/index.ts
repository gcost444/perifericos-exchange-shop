
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { verify } from "https://deno.land/x/djwt@v3.0.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const jwtSecret = new TextEncoder().encode('your-super-secret-jwt-key-change-in-production');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verificar autenticação
    const authResult = await verifyAuth(req);
    if (authResult.error) return authResult.response;

    const { admin } = authResult;
    const url = new URL(req.url);
    const method = req.method;

    switch (method) {
      case 'GET':
        return await handleGetProducts(req);
      case 'POST':
        return await handleCreateProduct(req, admin.admin_id);
      case 'PUT':
        return await handleUpdateProduct(req, admin.admin_id);
      case 'DELETE':
        return await handleDeleteProduct(req);
      default:
        return new Response(JSON.stringify({ error: 'Método não permitido' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error in admin-products function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function verifyAuth(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      error: true,
      response: new Response(JSON.stringify({ error: 'Token não fornecido' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    };
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = await verify(token, jwtSecret);
    return { error: false, admin: payload };
  } catch (error) {
    return {
      error: true,
      response: new Response(JSON.stringify({ error: 'Token inválido' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    };
  }
}

async function handleGetProducts(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (id) {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: 'Produto não encontrado' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(product), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return new Response(JSON.stringify(products), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleCreateProduct(req: Request, adminId: string) {
  const productData = await req.json();
  
  const { data: product, error } = await supabase
    .from('products')
    .insert({
      ...productData,
      admin_id: adminId
    })
    .select()
    .single();

  if (error) throw error;

  return new Response(JSON.stringify(product), {
    status: 201,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleUpdateProduct(req: Request, adminId: string) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const productData = await req.json();

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID do produto é obrigatório' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { data: product, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return new Response(JSON.stringify(product), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleDeleteProduct(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID do produto é obrigatório' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;

  return new Response(JSON.stringify({ message: 'Produto deletado com sucesso' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
