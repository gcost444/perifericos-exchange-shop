
-- Verificar e ajustar as políticas RLS para que admins vejam todos os pedidos
-- Primeiro, vamos dropar as políticas existentes e recriar
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

-- Recriar política para orders permitindo que admins vejam todos os pedidos
CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (
  -- Usuários podem ver seus próprios pedidos OU admins ativos podem ver todos
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = auth.uid() AND is_active = true
  )
);

-- Recriar política para order_items
CREATE POLICY "Admins can view all order items" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (
      orders.user_id = auth.uid() OR 
      EXISTS (
        SELECT 1 FROM public.admins 
        WHERE id = auth.uid() AND is_active = true
      )
    )
  )
);

-- Também vamos garantir que admins possam ver os profiles para mostrar nomes dos clientes
DROP POLICY IF EXISTS "Public profiles are viewable by admins" ON public.profiles;

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
