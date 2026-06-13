CREATE TYPE shipment_status AS ENUM (
  'received', 'processing', 'in_transit', 'arrived_at_destination', 'out_for_delivery', 'delivered', 'cancelled'
);

CREATE TYPE payment_type AS ENUM ('sender_pays', 'receiver_pays');

CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number TEXT UNIQUE NOT NULL,
  sender_name TEXT NOT NULL,
  sender_phone TEXT NOT NULL,
  sender_address TEXT,
  receiver_name TEXT NOT NULL,
  receiver_phone TEXT NOT NULL,
  receiver_address TEXT,
  origin_branch_id UUID REFERENCES branches(id) NOT NULL,
  destination_branch_id UUID REFERENCES branches(id) NOT NULL,
  weight_kg DECIMAL(10,2) NOT NULL DEFAULT 0,
  dimensions TEXT,
  shipping_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
  payment_type payment_type NOT NULL DEFAULT 'sender_pays',
  payment_status TEXT DEFAULT 'pending',
  package_description TEXT,
  status shipment_status NOT NULL DEFAULT 'received',
  assigned_driver_id UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_shipments" ON shipments FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_shipments" ON shipments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_shipments" ON shipments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_shipments" ON shipments FOR DELETE TO authenticated USING (true);

-- Allow public to track by tracking number
CREATE POLICY "public_track_shipments" ON shipments FOR SELECT TO anon USING (true);