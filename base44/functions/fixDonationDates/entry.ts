import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Fetch all existing donations
    const donations = await base44.entities.Donation.list('', 500);

    if (donations.length === 0) {
      return Response.json({ message: 'No donations to update' });
    }

    // Update each donation with a varied date across 18 months
    let updateCount = 0;
    for (let i = 0; i < donations.length; i++) {
      const monthOffset = Math.floor(i / 5) % 18; // Spread across 18 months, ~5 per month
      const dayOffset = (i % 5) + 1; // Days 1-5 within each month spread

      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() - monthOffset);
      targetDate.setDate(dayOffset);

      const dateStr = targetDate.toISOString().split('T')[0];

      await base44.entities.Donation.update(donations[i].id, {
        donation_date: dateStr
      });
      updateCount++;
    }

    return Response.json({
      success: true,
      count: updateCount,
      message: `Updated ${updateCount} donations with varied dates`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});