import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Generate sample donations across 18 months
    const funds = ['general', 'building_campaign', 'missions', 'youth', 'community_meals'];
    const donations = [];
    
    for (let i = 0; i < 18; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (17 - i));
      date.setDate(Math.floor(Math.random() * 28) + 1);
      
      const dateStr = date.toISOString().split('T')[0];
      
      // Add 2-4 donations per month
      const donationsPerMonth = Math.floor(Math.random() * 3) + 2;
      for (let j = 0; j < donationsPerMonth; j++) {
        donations.push({
          donor_name: `Donor ${Math.floor(Math.random() * 100) + 1}`,
          donor_email: `donor${Math.floor(Math.random() * 100) + 1}@example.com`,
          amount: Math.floor(Math.random() * 4000) + 100,
          fund: funds[Math.floor(Math.random() * funds.length)],
          donation_date: dateStr,
          is_recurring: Math.random() > 0.7,
          notes: 'Sample donation'
        });
      }
    }

    // Bulk create all donations
    const created = await base44.entities.Donation.bulkCreate(donations);
    
    return Response.json({ 
      success: true, 
      count: created.length,
      message: `Created ${created.length} sample donations`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});