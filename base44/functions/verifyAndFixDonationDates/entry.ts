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

    // Log first donation to debug
    console.log('First donation before update:', donations[0]);

    // Update each donation with a varied date across 18 months
    let updateCount = 0;
    for (let i = 0; i < donations.length; i++) {
      const monthOffset = Math.floor(i / 5) % 18;
      const dayOffset = (i % 5) + 1;

      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() - monthOffset);
      targetDate.setDate(dayOffset);

      const dateStr = targetDate.toISOString().split('T')[0];

      const updated = await base44.entities.Donation.update(donations[i].id, {
        donation_date: dateStr
      });
      
      console.log(`Updated donation ${i}: ${donations[i].id} to ${dateStr}`);
      updateCount++;
    }

    // Verify the updates
    const updated = await base44.entities.Donation.list('', 500);
    console.log('First donation after update:', updated[0]);

    // Invalidate React Query cache
    await base44.functions.invoke('_invalidateCache', { 
      queryKeys: ['adminDonations']
    }).catch(() => null);

    return Response.json({
      success: true,
      count: updateCount,
      sample: updated[0],
      message: `Updated ${updateCount} donations`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});