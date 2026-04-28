import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // First delete existing donations
    const existing = await base44.entities.Donation.list('', 1000);
    for (const donation of existing) {
      await base44.entities.Donation.delete(donation.id);
    }

    // Generate sample donations across 18 months with varied dates
    const funds = ['general', 'building_campaign', 'missions', 'youth', 'community_meals'];
    const donations = [];
    
    for (let monthOffset = 17; monthOffset >= 0; monthOffset--) {
      const baseDate = new Date();
      baseDate.setMonth(baseDate.getMonth() - monthOffset);
      baseDate.setDate(1);
      
      // Add 3-6 donations randomly spread throughout the month
      const donationsPerMonth = Math.floor(Math.random() * 4) + 3;
      for (let j = 0; j < donationsPerMonth; j++) {
        const dayOfMonth = Math.floor(Math.random() * 28) + 1;
        const donationDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), dayOfMonth);
        const isoDate = donationDate.toISOString();
        
        donations.push({
          donor_name: `Donor ${Math.floor(Math.random() * 500) + 1}`,
          donor_email: `donor${Math.floor(Math.random() * 500) + 1}@example.com`,
          amount: Math.floor(Math.random() * 5000) + 50,
          fund: funds[Math.floor(Math.random() * funds.length)],
          donation_date: donationDate.toISOString().split('T')[0],
          is_recurring: Math.random() > 0.8,
          notes: 'Sample donation',
          created_date: isoDate
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