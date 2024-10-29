-- Seed data for development environment
-- Based on the following github gist:
-- https://gist.github.com/khattaksd/4e8f4c89f4e928a2ecaad56d4a17ecd1
-- Insert users.
INSERT INTO
  auth.users (
    instance_id,
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    recovery_sent_at,
    last_sign_in_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    '98765432-1234-5678-1234-567812345678',
    'owner@downtown.com',
    '$2a$10$Bjg0DGauxrxcJq7CWYQJ2e7hKx1uHGwQG4Bs2Ar98cPQ9N6IEHqfy',
    NOW (),
    NOW (),
    NOW (),
    '{"provider":"email","providers":["email"]}',
    '{}',
    'authenticated',
    'authenticated',
    NOW (),
    NOW (),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '76543210-1234-5678-1234-567812345678',
    'owner@uptown.com',
    '$2a$10$U.l9ThtvHEA.RCXOGS4xcuWgI/M/A0rcjOCYli1CudkgtP/8nPH9O',
    NOW (),
    NOW (),
    NOW (),
    '{"provider":"email","providers":["email"]}',
    '{}',
    'authenticated',
    'authenticated',
    NOW (),
    NOW (),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '54321098-1234-5678-1234-567812345678',
    'chef1@downtown.com',
    '$2a$10$nt6zQLvHpjjEdH9aWi7i2eDpcUFbsoOZ60zidjbAtNFZmBjRS4GWu',
    NOW (),
    NOW (),
    NOW (),
    '{"provider":"email","providers":["email"]}',
    '{}',
    'authenticated',
    'authenticated',
    NOW (),
    NOW (),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '32109876-1234-5678-1234-567812345678',
    'chef2@downtown.com',
    '$2a$10$BRzCG83rlsKVohxqxD1N9eqXpgpm2Hl3sVS8y4cYiec.bURU8VbvG',
    NOW (),
    NOW (),
    NOW (),
    '{"provider":"email","providers":["email"]}',
    '{}',
    'authenticated',
    'authenticated',
    NOW (),
    NOW (),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '10987654-1234-5678-1234-567812345678',
    'chef1@uptown.com',
    '$2a$10$1yypRbLqM/UjcuZ8F78KYOfUNuPSszbNviNRbVjIYX2nHmNxQE7nO',
    NOW (),
    NOW (),
    NOW (),
    '{"provider":"email","providers":["email"]}',
    '{}',
    'authenticated',
    'authenticated',
    NOW (),
    NOW (),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '56465468-6646-4868-4894-646876435468',
    'jack@alltrades.com',
    '$2a$10$UFzKr8jMO1qtDwrxJ8A0z.hslDqm0kTDfmaSYhmQzU8m9i9Rkrj9S',
    NOW (),
    NOW (),
    NOW (),
    '{"provider":"email","providers":["email"]}',
    '{}',
    'authenticated',
    'authenticated',
    NOW (),
    NOW (),
    '',
    '',
    '',
    ''
  );