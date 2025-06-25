
-- Criar usuário administrador padrão
INSERT INTO public.admins (email, password_hash, name, role)
VALUES (
  'admin@sistema.com',
  '$2a$10$rN8L8qNHxvL8xAL2.iAL2eJtDbyIGtQSYVgMQHpw3VLK0tQlpGVYe', -- senha: 12345 (bcrypt hash)
  'Administrador',
  'super_admin'
);
