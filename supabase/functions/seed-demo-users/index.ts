import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const DEMO_USERS = [
  { email: "admin@wanzaexpress.com", password: "password123", full_name: "Abebe Kebede", role: "super_admin", phone: "+251 911 000 001", branch_id: null },
  { email: "manager@wanzaexpress.com", password: "password123", full_name: "Dawit Tsegaye", role: "branch_manager", phone: "+251 911 000 002", branch_id: null },
  { email: "staff@wanzaexpress.com", password: "password123", full_name: "Martha Hailu", role: "staff", phone: "+251 911 000 003", branch_id: null },
  { email: "driver@wanzaexpress.com", password: "password123", full_name: "Yonas Abebe", role: "driver", phone: "+251 911 000 004", branch_id: null },
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const created = [];

    for (const u of DEMO_USERS) {
      // Check if auth user already exists
      const checkRes = await fetch(`${supabaseUrl}/auth/v1/admin/users?email=${encodeURIComponent(u.email)}`, {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      });
      const checkData = await checkRes.json();
      const existing = checkData.users?.find((x: any) => x.email === u.email);

      if (existing) {
        created.push({ email: u.email, id: existing.id, status: "already_exists" });
        continue;
      }

      // Create auth user via admin API
      const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({
          email: u.email,
          password: u.password,
          email_confirm: true,
          user_metadata: {
            full_name: u.full_name,
            role: u.role,
          },
        }),
      });

      const createData = await createRes.json();
      if (!createData.id) {
        created.push({ email: u.email, status: "failed", error: createData });
        continue;
      }

      // Look up branch_id for manager/driver
      let branchId = u.branch_id;
      if (u.role === "branch_manager" || u.role === "staff") {
        const branchRes = await fetch(`${supabaseUrl}/rest/v1/branches?select=id&limit=1&is_active=eq.true&order=branch_name`, {
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
          },
        });
        const branches = await branchRes.json();
        if (branches.length > 0) branchId = branches[0].id;
      }
      if (u.role === "driver") {
        const branchRes = await fetch(`${supabaseUrl}/rest/v1/branches?select=id&limit=1&offset=1&is_active=eq.true&order=branch_name`, {
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
          },
        });
        const branches = await branchRes.json();
        if (branches.length > 0) branchId = branches[0].id;
      }

      // Insert profile into public.users
      await fetch(`${supabaseUrl}/rest/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          id: createData.id,
          full_name: u.full_name,
          email: u.email,
          phone: u.phone,
          role: u.role,
          branch_id: branchId,
          is_active: true,
        }),
      });

      created.push({ email: u.email, id: createData.id, status: "created" });
    }

    return new Response(JSON.stringify({ success: true, users: created }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
