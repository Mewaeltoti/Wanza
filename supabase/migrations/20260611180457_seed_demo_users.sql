-- Insert demo user profiles (they will be linked to Supabase Auth accounts)
-- Password for all accounts: password123
-- These profiles reference the Supabase auth.users table via the id field

INSERT INTO users (id, full_name, email, phone, role, branch_id, is_active) VALUES
  ('00000000-0000-4000-a000-000000000001', 'Abebe Kebede', 'admin@wanzaexpress.com', '+251 911 000 001', 'super_admin', NULL, true),
  ('00000000-0000-4000-a000-000000000002', 'Dawit Tsegaye', 'manager@wanzaexpress.com', '+251 911 000 002', 'branch_manager', 'a1b2c3d4-0001-4000-8000-000000000001', true),
  ('00000000-0000-4000-a000-000000000003', 'Martha Hailu', 'staff@wanzaexpress.com', '+251 911 000 003', 'staff', 'a1b2c3d4-0001-4000-8000-000000000001', true),
  ('00000000-0000-4000-a000-000000000004', 'Yonas Abebe', 'driver@wanzaexpress.com', '+251 911 000 004', 'driver', 'a1b2c3d4-0001-4000-8000-000000000002', true);