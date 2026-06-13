-- Seed branches
INSERT INTO branches (id, branch_name, city, address, phone) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Addis Ababa - HQ', 'Addis Ababa', 'Bole Road, Wanza Building, Addis Ababa', '+251 11 000 0001'),
  ('a1b2c3d4-0001-4000-8000-000000000002', 'Mekelle Branch', 'Mekelle', 'Main Street, Mekelle', '+251 11 000 0002'),
  ('a1b2c3d4-0001-4000-8000-000000000003', 'Dire Dawa Branch', 'Dire Dawa', 'Kebele 08, Dire Dawa', '+251 11 000 0003'),
  ('a1b2c3d4-0001-4000-8000-000000000004', 'Bahir Dar Branch', 'Bahir Dar', 'Lake Shore Road, Bahir Dar', '+251 11 000 0004'),
  ('a1b2c3d4-0001-4000-8000-000000000005', 'Hawassa Branch', 'Hawassa', 'Industrial Zone, Hawassa', '+251 11 000 0005'),
  ('a1b2c3d4-0001-4000-8000-000000000006', 'Adama Branch', 'Adama', 'Highway Junction, Adama', '+251 11 000 0006'),
  ('a1b2c3d4-0001-4000-8000-000000000007', 'Jimma Branch', 'Jimma', 'Coffee Road, Jimma', '+251 11 000 0007'),
  ('a1b2c3d4-0001-4000-8000-000000000008', 'Gondar Branch', 'Gondar', 'Fasil Square, Gondar', '+251 11 000 0008'),
  ('a1b2c3d4-0001-4000-8000-000000000009', 'Dessie Branch', 'Dessie', 'Main Market Area, Dessie', '+251 11 000 0009'),
  ('a1b2c3d4-0001-4000-8000-000000000010', 'Nazret Branch', 'Nazret', 'Central Avenue, Nazret', '+251 11 000 0010'),
  ('a1b2c3d4-0001-4000-8000-000000000011', 'Harar Branch', 'Harar', 'Jugol Gate, Harar', '+251 11 000 0011'),
  ('a1b2c3d4-0001-4000-8000-000000000012', 'Shashemene Branch', 'Shashemene', 'Transit Hub, Shashemene', '+251 11 000 0012');

-- Seed sample shipments
INSERT INTO shipments (id, tracking_number, sender_name, sender_phone, sender_address, receiver_name, receiver_phone, receiver_address, origin_branch_id, destination_branch_id, weight_kg, dimensions, shipping_cost, payment_type, payment_status, package_description, status, created_at) VALUES
  ('b1b2c3d4-0001-4000-8000-000000000001', 'WZA-8921102', 'Abebe Kebede', '+251 911 234 567', 'Bole, Addis Ababa', 'Sarah Kamau', '+251 922 345 678', 'Kazanchis, Addis Ababa', 'a1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000002', 12.5, '30x20x15', 337.50, 'sender_pays', 'paid', 'Electronics - Laptop', 'in_transit', '2024-10-24T10:30:00Z'),
  ('b1b2c3d4-0001-4000-8000-000000000002', 'WZA-8921105', 'Dawit Tsegaye', '+251 911 000 001', 'Piassa, Addis Ababa', 'Martha Hailu', '+251 922 000 002', 'Mekelle, Tigray', 'a1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000002', 0.8, '15x10x5', 162.00, 'receiver_pays', 'unpaid', 'Documents', 'delivered', '2024-10-20T08:15:00Z'),
  ('b1b2c3d4-0001-4000-8000-000000000003', 'WZA-8921112', 'Global Trading Co.', '+251 933 444 555', 'Industrial Area, Addis Ababa', 'Tech Solutions', '+251 944 555 666', 'Hawassa, SNNPR', 'a1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000005', 45.0, '100x80x60', 825.00, 'sender_pays', 'paid', 'Industrial equipment parts', 'in_transit', '2024-10-23T14:00:00Z'),
  ('b1b2c3d4-0001-4000-8000-000000000004', 'WZA-8921118', 'Abay Coffee Exporters', '+251 955 666 777', 'Jimma, Oromia', 'Import BV', '+31 20 123 4567', 'Rotterdam, NL', 'a1b2c3d4-0001-4000-8000-000000000007', 'a1b2c3d4-0001-4000-8000-000000000001', 125.0, '200x150x120', 2025.00, 'sender_pays', 'paid', 'Green Coffee Beans', 'processing', '2024-10-25T09:45:00Z'),
  ('b1b2c3d4-0001-4000-8000-000000000005', 'WZA-8921125', 'Zenith Manufacturing', '+251 966 777 888', 'Industrial Zone, Hawassa', 'Haramaya University', '+251 977 888 999', 'Harar, Oromia', 'a1b2c3d4-0001-4000-8000-000000000005', 'a1b2c3d4-0001-4000-8000-000000000011', 5.0, '25x25x25', 225.00, 'receiver_pays', 'unpaid', 'Lab Equipment', 'out_for_delivery', '2024-10-26T07:00:00Z'),
  ('b1b2c3d4-0001-4000-8000-000000000006', 'WZA-8921130', 'Abebe Logistics PLC', '+251 911 111 111', 'Merkato, Addis Ababa', 'Kenya Freight Ltd', '+254 712 000 000', 'Nairobi, Kenya', 'a1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000006', 28.0, '60x40x35', 570.00, 'sender_pays', 'paid', 'Textiles', 'delivered', '2024-10-22T11:00:00Z'),
  ('b1b2c3d4-0001-4000-8000-000000000007', 'WZA-8921135', 'Solar Energy Solutions', '+971 4 123 4567', 'Dubai, UAE', 'Ethiopia Solar Co', '+251 988 999 000', 'Addis Ababa, Ethiopia', 'a1b2c3d4-0001-4000-8000-000000000006', 'a1b2c3d4-0001-4000-8000-000000000001', 18.5, '80x60x40', 427.50, 'receiver_pays', 'unpaid', 'Solar Panels', 'received', '2024-10-26T16:30:00Z'),
  ('b1b2c3d4-0001-4000-8000-000000000008', 'WZA-8921140', 'Addis Pharma', '+251 922 222 222', 'Gulele, Addis Ababa', 'Gondar Hospital', '+251 933 333 333', 'Gondar, Amhara', 'a1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000008', 3.2, '20x15x10', 198.00, 'sender_pays', 'paid', 'Pharmaceutical supplies', 'arrived_at_destination', '2024-10-25T13:00:00Z'),
  ('b1b2c3d4-0001-4000-8000-000000000009', 'WZA-8921145', 'Blue Nile Transport', '+251 944 444 444', 'Bahir Dar, Amhara', 'Dessie Logistics', '+251 955 555 555', 'Dessie, Amhara', 'a1b2c3d4-0001-4000-8000-000000000004', 'a1b2c3d4-0001-4000-8000-000000000009', 8.0, '40x30x20', 270.00, 'sender_pays', 'paid', 'Furniture parts', 'in_transit', '2024-10-24T15:00:00Z'),
  ('b1b2c3d4-0001-4000-8000-000000000010', 'WZA-8921150', 'Rift Valley Foods', '+251 966 666 666', 'Shashemene, Oromia', 'Aster Restaurant', '+251 977 777 777', 'Addis Ababa, Ethiopia', 'a1b2c3d4-0001-4000-8000-000000000012', 'a1b2c3d4-0001-4000-8000-000000000001', 15.0, '50x35x25', 375.00, 'sender_pays', 'paid', 'Spices and grains', 'delivered', '2024-10-21T09:00:00Z');

-- Seed status history
INSERT INTO status_history (shipment_id, previous_status, new_status, notes, branch_id, created_at) VALUES
  ('b1b2c3d4-0001-4000-8000-000000000001', NULL, 'received', 'Package received at Addis Ababa HQ', 'a1b2c3d4-0001-4000-8000-000000000001', '2024-10-24T10:30:00Z'),
  ('b1b2c3d4-0001-4000-8000-000000000001', 'received', 'processing', 'Being prepared for dispatch', 'a1b2c3d4-0001-4000-8000-000000000001', '2024-10-24T12:00:00Z'),
  ('b1b2c3d4-0001-4000-8000-000000000001', 'processing', 'in_transit', 'Left Addis Ababa for Mekelle', 'a1b2c3d4-0001-4000-8000-000000000001', '2024-10-24T14:32:00Z'),
  ('b1b2c3d4-0001-4000-8000-000000000002', NULL, 'received', 'Package received at Addis Ababa HQ', 'a1b2c3d4-0001-4000-8000-000000000001', '2024-10-20T08:15:00Z'),
  ('b1b2c3d4-0001-4000-8000-000000000002', 'received', 'processing', 'Sorted and labeled', 'a1b2c3d4-0001-4000-8000-000000000001', '2024-10-20T09:00:00Z'),
  ('b1b2c3d4-0001-4000-8000-000000000002', 'processing', 'in_transit', 'On the road to Mekelle', 'a1b2c3d4-0001-4000-8000-000000000001', '2024-10-20T10:30:00Z'),
  ('b1b2c3d4-0001-4000-8000-000000000002', 'in_transit', 'arrived_at_destination', 'Arrived at Mekelle branch', 'a1b2c3d4-0001-4000-8000-000000000002', '2024-10-21T06:00:00Z'),
  ('b1b2c3d4-0001-4000-8000-000000000002', 'arrived_at_destination', 'out_for_delivery', 'With delivery driver', 'a1b2c3d4-0001-4000-8000-000000000002', '2024-10-21T08:30:00Z'),
  ('b1b2c3d4-0001-4000-8000-000000000002', 'out_for_delivery', 'delivered', 'Signed by receiver', 'a1b2c3d4-0001-4000-8000-000000000002', '2024-10-21T10:15:00Z');

-- Create index for tracking number lookup
CREATE INDEX idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_origin ON shipments(origin_branch_id);
CREATE INDEX idx_status_history_shipment ON status_history(shipment_id);