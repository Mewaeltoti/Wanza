CREATE TABLE status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE NOT NULL,
  previous_status shipment_status,
  new_status shipment_status NOT NULL,
  notes TEXT,
  branch_id UUID REFERENCES branches(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_status_history" ON status_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_status_history" ON status_history FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_status_history" ON status_history FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_status_history" ON status_history FOR DELETE TO authenticated USING (true);

CREATE POLICY "public_select_status_history" ON status_history FOR SELECT TO anon USING (true);