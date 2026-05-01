import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Check existing funds
    const existingFunds = await base44.asServiceRole.entities.FundSettings.list('sort_order', 100);
    
    // Create annual fund if it doesn't exist
    let annualFund = existingFunds.find(f => f.slug === 'annual_fund');
    if (!annualFund) {
      const created = await base44.asServiceRole.entities.FundSettings.create({
        name: 'Annual Fund',
        slug: 'annual_fund',
        description: 'General operating fund for church operations and ministry',
        goal: 250000,
        is_active: true,
        sort_order: 1,
        itemization: [
          { label: 'Staff Salaries', amount: 120000 },
          { label: 'Building & Maintenance', amount: 60000 },
          { label: 'Ministry Programs', amount: 50000 },
          { label: 'Community Outreach', amount: 20000 }
        ]
      });
      annualFund = created;
      console.log('Created Annual Fund');
    }

    // Create Tithes fund if it doesn't exist
    let tithesFund = existingFunds.find(f => f.slug === 'tithes');
    if (!tithesFund) {
      tithesFund = await base44.asServiceRole.entities.FundSettings.create({
        name: 'Tithes',
        slug: 'tithes',
        description: 'Member tithes and general offerings',
        goal: 200000,
        is_active: true,
        sort_order: 2
      });
      console.log('Created Tithes Fund');
    }

    return Response.json({
      success: true,
      annualFund: annualFund.id,
      tithesFund: tithesFund?.id,
      totalFunds: existingFunds.length + (annualFund ? 0 : 1) + (tithesFund ? 0 : 1)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});