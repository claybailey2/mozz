-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create stores table
CREATE TABLE
  stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    created_at TIMESTAMP
    WITH
      TIME ZONE DEFAULT TIMEZONE ('utc', NOW ()),
      name TEXT NOT NULL,
      owner_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE
  );

-- Create store_members table
CREATE TABLE
  store_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    store_id UUID NOT NULL REFERENCES stores (id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'chef')),
    status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'active')),
    created_at TIMESTAMP
    WITH
      TIME ZONE DEFAULT TIMEZONE ('utc', NOW ()),
      UNIQUE (store_id, user_id)
  );

-- Create toppings table
CREATE TABLE
  toppings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    store_id UUID NOT NULL REFERENCES stores (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP
    WITH
      TIME ZONE DEFAULT TIMEZONE ('utc', NOW ()),
      UNIQUE (store_id, name)
  );

-- Create pizzas table
CREATE TABLE
  pizzas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    store_id UUID NOT NULL REFERENCES stores (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    created_at TIMESTAMP
    WITH
      TIME ZONE DEFAULT TIMEZONE ('utc', NOW ())
  );

-- Create pizza_toppings junction table
CREATE TABLE
  pizza_toppings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    pizza_id UUID NOT NULL REFERENCES pizzas (id) ON DELETE CASCADE,
    topping_id UUID NOT NULL REFERENCES toppings (id) ON DELETE CASCADE,
    UNIQUE (pizza_id, topping_id)
  );

-- Row Level Security Policies
-- Stores: Users can only access stores they're members of
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- View policy: Users can view stores they own
CREATE POLICY "Users can view their own stores" ON stores FOR
SELECT
  USING (owner_id = auth.uid ());

-- Insert policy: Any authenticated user can create stores
CREATE POLICY "Users can create stores" ON stores FOR INSERT
WITH
  CHECK (auth.uid () = owner_id);

-- Update policy: Only store owners can update
CREATE POLICY "Owners can update their stores" ON stores FOR
UPDATE USING (owner_id = auth.uid ());

-- Delete policy: Only store owners can delete
CREATE POLICY "Owners can delete their stores" ON stores FOR DELETE USING (owner_id = auth.uid ());

-- Toppings: Store owners and chefs can view, only owners can modify
ALTER TABLE toppings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store members can view toppings" ON toppings FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        store_members
      WHERE
        store_id = toppings.store_id
        AND user_id = auth.uid ()
    )
  );

CREATE POLICY "Store owners can manage toppings" ON toppings FOR ALL USING (
  EXISTS (
    SELECT
      1
    FROM
      stores
    WHERE
      id = toppings.store_id
      AND owner_id = auth.uid ()
  )
);

-- Pizzas: Store members can view, chefs can create/update their own
ALTER TABLE pizzas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store members can view pizzas" ON pizzas FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        store_members
      WHERE
        store_id = pizzas.store_id
        AND user_id = auth.uid ()
    )
  );

CREATE POLICY "Chefs can manage their pizzas" ON pizzas FOR ALL USING (created_by = auth.uid ());

-- Pizza Toppings: Same access as pizzas
ALTER TABLE pizza_toppings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view pizza toppings for accessible pizzas" ON pizza_toppings FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        pizzas
      WHERE
        id = pizza_toppings.pizza_id
        AND EXISTS (
          SELECT
            1
          FROM
            store_members
          WHERE
            store_id = pizzas.store_id
            AND user_id = auth.uid ()
        )
    )
  );

CREATE POLICY "Chefs can manage pizza toppings" ON pizza_toppings FOR ALL USING (
  EXISTS (
    SELECT
      1
    FROM
      pizzas
    WHERE
      id = pizza_toppings.pizza_id
      AND created_by = auth.uid ()
  )
);

-- Create a view that joins store_members with user emails
create
or replace view store_members_with_email as
select
  sm.*,
  au.email as user_email
from
  store_members sm
  left join auth.users au on au.id = sm.user_id;

-- Set up RLS policy for the view
alter view store_members_with_email
set
  (security_invoker = true);

create policy "Users can view store members they're members of" on store_members for
select
  using (
    exists (
      select
        1
      from
        store_members
      where
        store_id = store_members.store_id
        and user_id = auth.uid ()
    )
  );

-- Enable RLS
ALTER TABLE store_members ENABLE ROW LEVEL SECURITY;

-- Create new simplified policies
-- 1. Insert policy: Allow users to become members
CREATE POLICY "Allow users to become members"
ON store_members
FOR INSERT
WITH CHECK (true);  -- We'll control this via application logic

-- 2. Select policy: Users can view records where they are either the member or the store owner
CREATE POLICY "Users can view relevant memberships"
ON store_members
FOR SELECT
USING (
  user_id = auth.uid() OR  -- They are the member
  EXISTS (
    SELECT 1 FROM stores
    WHERE stores.id = store_members.store_id
    AND stores.owner_id = auth.uid()
  )  -- They are the store owner
);

-- 3. Update policy: Users can only update their own records or as store owner
CREATE POLICY "Users can update relevant memberships"
ON store_members
FOR UPDATE
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM stores
    WHERE stores.id = store_members.store_id
    AND stores.owner_id = auth.uid()
  )
);

-- 4. Delete policy: Only store owners can delete members
CREATE POLICY "Store owners can delete members"
ON store_members
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM stores
    WHERE stores.id = store_members.store_id
    AND stores.owner_id = auth.uid()
  )
);

-- View for store members with email
DROP VIEW IF EXISTS store_members_with_email;
CREATE OR REPLACE VIEW store_members_with_email AS
SELECT 
  sm.*,
  au.email as user_email
FROM store_members sm
LEFT JOIN auth.users au ON au.id = sm.user_id;