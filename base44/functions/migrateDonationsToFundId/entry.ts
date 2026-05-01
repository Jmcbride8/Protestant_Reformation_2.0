import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Get all active funds
    const allFunds = await base44.asServiceRole.entities.FundSettings.list('sort_order', 100);
    const fundMap = {};
    allFunds.forEach(f => {
      fundMap[f.slug] = f;
    });

    // Get all donations
    const allDonations = await base44.asServiceRole.entities.Donation.list('', 1000);
    
    const annualFund = allFunds.find(f => f.slug === 'annual_fund');
    let migrated = 0;
    let errors = [];
    let skipped = 0;

    // Migrate each donation
    for (const donation of allDonations) {
      try {
        // Skip if already has fund_id
        if (donation.fund_id) {
          skipped++;
          continue;
        }

        // If no fund_id and no fund, assign to annual_fund
        let targetFund = annualFund;

        if (!targetFund) {
          errors.push(`Annual fund not found for donation ${donation.id}`);
          continue;
        }

        // Update donation with fund_id and fund_name
        await base44.asServiceRole.entities.Donation.update(donation.id, {
          fund_id: targetFund.id,
          fund_name: targetFund.name,
        });

        migrated++;
      } catch (e) {
        errors.push(`Error migrating donation ${donation.id}: ${e.message}`);
      }
    }

    return Response.json({
      success: true,
      migrated,
      skipped,
      errors,
      message: `Migrated ${migrated} donations, skipped ${skipped}`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});