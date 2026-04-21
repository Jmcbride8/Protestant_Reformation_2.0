import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    await base44.asServiceRole.entities.User.update(email, { role: 'admin' });

    return Response.json({ success: true, message: `User ${email} promoted to admin` });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});