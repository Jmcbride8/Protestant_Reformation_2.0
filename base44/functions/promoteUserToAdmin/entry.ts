import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      return Response.json({ error: 'Forbidden: Admin or Staff access required' }, { status: 403 });
    }

    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find the user by email
    const users = await base44.asServiceRole.entities.User.filter({ email });
    
    if (!users || users.length === 0) {
      // User not registered yet, invite them with staff role
      await base44.users.inviteUser(email, 'staff');
    } else {
      // User exists, update their role
      const userId = users[0].id;
      await base44.asServiceRole.entities.User.update(userId, { role: 'staff' });
    }

    return Response.json({ success: true, message: `User ${email} promoted to admin` });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});