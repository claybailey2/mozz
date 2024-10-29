-- Insert stores
INSERT INTO
  public.stores (id, name)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Downtown Pizzeria'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Uptown Pizza Palace'
  );

-- Insert store members (owners and chefs)
INSERT INTO
  public.store_members (store_id, role, status, email, user_id)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'owner',
    'active',
    'owner@downtown.com',
    '98765432-1234-5678-1234-567812345678'
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'owner',
    'active',
    'jack@alltrades.com',
    '76543210-1234-5678-1234-567812345678'
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'chef',
    'invited',
    'chef1@downtown.com',
    '54321098-1234-5678-1234-567812345678'
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'chef',
    'invited',
    'chef2@downtown.com',
    '32109876-1234-5678-1234-567812345678'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'owner',
    'active',
    'owner@uptown.com',
    '76543210-1234-5678-1234-567812345678'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'chef',
    'active',
    'jack@alltrades.com',
    '10987654-1234-5678-1234-567812345678'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'chef',
    'invited',
    'chef1@uptown.com',
    '56465468-6646-4868-4894-646876435468'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'chef',
    'invited',
    'new.chef@midtown.com',
    NULL -- No user_id for newly invited chefs
  );

-- Insert toppings for each store
INSERT INTO
  public.toppings (id, store_id, name)
VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Pepperoni'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111',
    'Mushrooms'
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '11111111-1111-1111-1111-111111111111',
    'Bell Peppers'
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '22222222-2222-2222-2222-222222222222',
    'Italian Sausage'
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '22222222-2222-2222-2222-222222222222',
    'Olives'
  ),
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    '22222222-2222-2222-2222-222222222222',
    'Onions'
  );

-- Insert some sample pizzas (you'll need to update created_by with real user IDs after they sign up)
INSERT INTO
  public.pizzas (id, store_id, name, created_by)
VALUES
  (
    '12345678-1234-1234-1234-123456789012',
    '11111111-1111-1111-1111-111111111111',
    'Classic Pepperoni',
    '54321098-1234-5678-1234-567812345678'
  ),
  (
    '23456789-2345-2345-2345-234567890123',
    '11111111-1111-1111-1111-111111111111',
    'Veggie Supreme',
    '56465468-6646-4868-4894-646876435468'
  ),
  (
    '34567890-3456-3456-3456-345678901234',
    '22222222-2222-2222-2222-222222222222',
    'Meat Lovers',
    '10987654-1234-5678-1234-567812345678'
  );

-- Link toppings to pizzas
INSERT INTO
  public.pizza_toppings (pizza_id, topping_id)
VALUES
  (
    '12345678-1234-1234-1234-123456789012',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
  ),
  (
    '23456789-2345-2345-2345-234567890123',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
  ),
  (
    '23456789-2345-2345-2345-234567890123',
    'cccccccc-cccc-cccc-cccc-cccccccccccc'
  ),
  (
    '34567890-3456-3456-3456-345678901234',
    'dddddddd-dddd-dddd-dddd-dddddddddddd'
  );

INSERT INTO
  public.registered_emails (email, created_at)
VALUES
  ('owner@downtown.com', NOW()),
  ('owner@uptown.com', NOW()),
  ('chef1@downtown.com', NOW()),
  ('chef2@downtown.com', NOW()),
  ('chef1@uptown.com', NOW()),
  ('jack@alltrades.com', NOW());