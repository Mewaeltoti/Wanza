CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_branches" ON branches FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_branches" ON branches FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_branches" ON branches FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_branches" ON branches FOR DELETE TO authenticated USING (true);

-- Allow public read for tracking
CREATE POLICY "public_select_branches" ON branches FOR SELECT TO anon USING (true);