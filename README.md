
# PerifShop - Loja de Periféricos Gamer

Uma aplicação web moderna para venda de periféricos gamer, construída com React, TypeScript e Supabase.

## 🚀 Funcionalidades

### Principais
- **Catálogo de Produtos**: Navegação e visualização de periféricos gamer
- **Autenticação de Usuários**: Sistema completo de login, cadastro e recuperação de senha
- **Carrinho de Compras**: Adicionar, remover e gerenciar produtos
- **Finalização de Compras**: Sistema simplificado de checkout
- **Gerenciamento de Pedidos**: Visualização do histórico de compras
- **Adicionar Produtos**: Interface para cadastrar novos produtos no sistema

### Técnicas
- Interface responsiva com Tailwind CSS
- Componentes reutilizáveis com shadcn/ui
- Gerenciamento de estado com React Context
- Banco de dados PostgreSQL via Supabase
- Autenticação segura com Row Level Security (RLS)

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Authentication, RLS)
- **Roteamento**: React Router DOM
- **Formulários**: React Hook Form com Zod
- **Ícones**: Lucide React

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta no Supabase

## ⚙️ Configuração do Projeto

### 1. Clone o repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd perifshop
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Supabase

#### 3.1 Crie um projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Crie um novo projeto

#### 3.2 Configure a autenticação
1. No painel do Supabase, vá para **Authentication > Settings**
2. Em **Site URL**, adicione: `http://localhost:3000` (para desenvolvimento)
3. Em **Redirect URLs**, adicione: `http://localhost:3000/**`

#### 3.3 Execute as migrações SQL
Execute os seguintes comandos SQL no editor SQL do Supabase:

```sql
-- Criar tabela de perfis
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de produtos
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  condition TEXT NOT NULL,
  image TEXT NOT NULL,
  original_price NUMERIC NOT NULL,
  sale_price NUMERIC NOT NULL,
  rating NUMERIC DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de pedidos
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de itens do pedido
CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders NOT NULL,
  product_id INTEGER REFERENCES public.products NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar constraint para status dos pedidos
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'completed'));

-- Criar função para manipular novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para novos usuários
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas RLS para orders
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para order_items
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order items" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );
```

### 4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes da biblioteca shadcn/ui
│   ├── Header.tsx      # Cabeçalho da aplicação
│   └── Footer.tsx      # Rodapé da aplicação
├── contexts/           # Contextos React
│   ├── AppContext.tsx  # Estado global da aplicação
│   └── AuthContext.tsx # Contexto de autenticação
├── pages/              # Páginas da aplicação
│   ├── Index.tsx       # Página inicial
│   ├── Products.tsx    # Catálogo de produtos
│   ├── ProductDetail.tsx # Detalhes do produto
│   ├── Cart.tsx        # Carrinho de compras
│   ├── Checkout.tsx    # Finalização da compra
│   ├── Orders.tsx      # Histórico de pedidos
│   ├── Auth.tsx        # Autenticação
│   └── AddProduct.tsx  # Adicionar produtos
└── integrations/       # Integrações externas
    └── supabase/       # Configuração do Supabase
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run preview` - Preview da build de produção

## 🐛 Solução de Problemas Comuns

### Problema com verificação de email
- Verifique se o domínio está configurado corretamente no Supabase
- Confirme as configurações de **Site URL** e **Redirect URLs**
- Para desenvolvimento, desabilite a confirmação de email em **Authentication > Settings**

### Erro ao finalizar compra
- Verifique se o usuário está autenticado
- Confirme se as tabelas foram criadas corretamente
- Verifique os logs do console para erros específicos

### Problemas de autenticação
- Confirme as URLs de redirecionamento no Supabase
- Verifique se as políticas RLS foram aplicadas corretamente

## 📝 Notas Importantes

1. **Segurança**: O projeto utiliza Row Level Security (RLS) para proteger os dados dos usuários
2. **Ambiente de Desenvolvimento**: Para facilitar os testes, considere desabilitar a verificação de email
3. **Produção**: Antes de fazer deploy, configure adequadamente as URLs no Supabase
4. **Backup**: Sempre faça backup do banco de dados antes de modificações importantes

## 🚀 Deploy

Para fazer deploy da aplicação:

1. Configure as URLs de produção no Supabase
2. Execute `npm run build`
3. Deploy dos arquivos da pasta `dist` para seu provedor de hospedagem

## 📞 Suporte

Para dúvidas ou problemas:
- Verifique a documentação do [Supabase](https://supabase.com/docs)
- Consulte a documentação do [React](https://react.dev)
- Revise este README para configurações específicas
