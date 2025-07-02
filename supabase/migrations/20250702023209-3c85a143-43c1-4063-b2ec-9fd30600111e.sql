
-- Criar políticas RLS para admins poderem ver todos os pedidos
CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = auth.uid() AND is_active = true
  )
);

-- Remover a política antiga que só permitia usuários verem seus próprios pedidos
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

-- Criar políticas RLS para admins poderem ver todos os itens de pedidos
CREATE POLICY "Admins can view all order items" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.admins 
      WHERE id = auth.uid() AND is_active = true
    ))
  )
);

-- Remover a política antiga dos order_items
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;

-- Permitir que admins atualizem status dos pedidos
CREATE POLICY "Admins can update order status" 
ON public.orders 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = auth.uid() AND is_active = true
  )
);

-- Permitir que todos vejam os perfis (necessário para mostrar nomes dos clientes)
CREATE POLICY "Public profiles are viewable by admins" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = id OR 
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = auth.uid() AND is_active = true
  )
);

-- Remover a política antiga dos profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
