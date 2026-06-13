CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'branch_manager', 'staff', 'driver')),
  branch_id UUID REFERENCES branches(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_users" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_users" ON users FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_users" ON users FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_users" ON users FOR DELETE TO authenticated USING (true);