import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowDownCircle, ArrowUpCircle, MinusCircle, CheckCircle, Users } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import GroupFundTrendChart from '@/components/giving/GroupFundTrendChart';

const TYPE_CONFIG = {
  given:    { label: 'Given',    icon: ArrowUpCircle,   color: 'text-green-600',  sign: '+' },
  received: { label: 'Received', icon: ArrowDownCircle, color: 'text-blue-600',   sign: '+' },
  spent:    { label: 'Spent',    icon: MinusCircle,     color: 'text-destructive', sign: '-' },
};

function PoolBalance({ transactions }) {
  const received = transactions.filter(t => t.type === 'given' || t.type === 'received').reduce((s, t) => s + (t.amount || 0), 0);
  const spent    = transactions.filter(t => t.type === 'spent').reduce((s, t) => s + (t.amount || 0), 0);
  const balance  = received - spent;

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {[
        { label: 'Pool Balance', value: balance, highlight: true },
        { label: 'Total Given',  value: received },
        { label: 'Total Spent',  value: spent },
      ].map(({ label, value, highlight }) => (
        <div key={label} className={`rounded-2xl border p-5 text-center ${highlight ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border/50'}`}>
          <p className={`font-body text-xs tracking-widest uppercase mb-1 ${highlight ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{label}</p>
          <p className={`font-heading text-3xl ${highlight ? 'text-primary-foreground' : 'text-primary'}`}>${value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

function GiveToGroupForm({ group, user, onSuccess }) {
  const [form, setForm] = useState({ amount: '', description: '' });
  const [submitted, setSubmitted] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => base44.entities.GroupFundTransaction.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupFundTx', group.id] });
      setSubmitted(true);
      toast.success('Gift recorded — thank you!');
    },
  });

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
        <CheckCircle className="w-14 h-14 text-accent mx-auto mb-3" />
        <h3 className="font-heading text-2xl text-primary mb-1">Thank You!</h3>
        <p className="font-body text-muted-foreground text-sm">Your gift to {group.name} has been recorded.</p>
        <Button className="mt-5 font-body" onClick={() => { setSubmitted(false); setForm({ amount: '', description: '' }); }}>Give Again</Button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate({
          group_id: group.id,
          group_name: group.name,
          type: 'given',
          amount: parseFloat(form.amount),
          description: form.description,
          member_name: user?.full_name || '',
          member_email: user?.email || '',
          transaction_date: new Date().toISOString().split('T')[0],
        });
      }}
      className="space-y-4"
    >
      <h3 className="font-heading text-xl text-primary">Give to {group.name}</h3>
      <div className="space-y-2">
         <Label className="font-body text-sm">Amount ($)</Label>
         <Input type="number" min="1" required className="font-body" placeholder="50" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
       </div>
       <div className="space-y-2">
        <Label className="font-body text-sm">Note (optional)</Label>
        <Input className="font-body" placeholder="What's this gift for?" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
      </div>
      <Button type="submit" disabled={mutation.isPending} className="w-full font-body bg-primary hover:bg-primary/90" size="lg">
        Give Now
      </Button>
    </form>
  );
}

function LogExpenseForm({ group, onSuccess }) {
   const [form, setForm] = useState({ amount: '', description: '', transaction_date: new Date().toISOString().split('T')[0] });
   const queryClient = useQueryClient();

   const mutation = useMutation({
     mutationFn: (data) => base44.entities.GroupFundTransaction.create(data),
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['groupFundTx', group.id] });
       setForm({ amount: '', description: '', transaction_date: new Date().toISOString().split('T')[0] });
       toast.success('Expense logged.');
     },
   });

   return (
     <form
       onSubmit={(e) => {
         e.preventDefault();
         mutation.mutate({
           group_id: group.id,
           group_name: group.name,
           type: 'spent',
           amount: parseFloat(form.amount),
           description: form.description,
           transaction_date: form.transaction_date,
         });
       }}
       className="space-y-4"
     >
       <h4 className="font-heading text-base text-primary">Log an Expense</h4>
       <div className="grid grid-cols-3 gap-3">
         <div className="space-y-1">
           <Label className="font-body text-xs text-muted-foreground">Amount ($)</Label>
           <Input type="number" min="1" required className="font-body text-sm" placeholder="e.g. 75" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
         </div>
         <div className="space-y-1">
           <Label className="font-body text-xs text-muted-foreground">Date</Label>
           <Input type="date" required className="font-body text-sm" value={form.transaction_date} onChange={e => setForm(f => ({ ...f, transaction_date: e.target.value }))} />
         </div>
         <div className="space-y-1">
           <Label className="font-body text-xs text-muted-foreground">Description</Label>
           <Input required className="font-body text-sm" placeholder="e.g. Event supplies" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
         </div>
       </div>
       <Button type="submit" disabled={mutation.isPending} size="sm" variant="outline" className="font-body text-xs w-full">
         Log Expense
       </Button>
     </form>
   );
 }

function TransactionList({ transactions }) {
  if (transactions.length === 0) {
    return <p className="font-body text-sm text-muted-foreground text-center py-6">No transactions yet.</p>;
  }

  const sorted = [...transactions].sort((a, b) => new Date(b.transaction_date || b.created_date) - new Date(a.transaction_date || a.created_date));

  return (
    <div className="divide-y divide-border/40">
      {sorted.map(tx => {
        const cfg = TYPE_CONFIG[tx.type];
        const Icon = cfg.icon;
        return (
          <div key={tx.id} className="flex items-center gap-3 py-3">
            <Icon className={`w-4 h-4 shrink-0 ${cfg.color}`} />
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm text-foreground truncate">{tx.description || cfg.label}</p>
              <p className="font-body text-xs text-muted-foreground">
                {tx.member_name && `${tx.member_name} · `}
                {tx.transaction_date ? format(new Date(tx.transaction_date), 'MMM d, yyyy') : ''}
              </p>
            </div>
            <span className={`font-heading text-base shrink-0 ${cfg.color}`}>
              {cfg.sign}${(tx.amount || 0).toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function GroupFundSection({ group, user }) {
  const isLeader = group.owner_user_id && user?.id === group.owner_user_id;

  const { data: transactions = [] } = useQuery({
    queryKey: ['groupFundTx', group.id],
    queryFn: () => base44.entities.GroupFundTransaction.filter({ group_id: group.id }, '-transaction_date', 50),
  });

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
          <Users className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h2 className="font-heading text-3xl text-primary">{group.name}</h2>
          <p className="font-body text-sm text-muted-foreground">Group Fund</p>
        </div>
        {isLeader && <span className="ml-auto font-body text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">Group Leader</span>}
      </div>

      <PoolBalance transactions={transactions} />

      <GroupFundTrendChart transactions={transactions} />

      <div className={`grid gap-12 mt-12 ${isLeader ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
         {/* Give form */}
         <div className="bg-card border border-border/50 rounded-2xl p-8">
           <GiveToGroupForm group={group} user={user} />
         </div>

         {/* Log expense form (leader only) */}
         {isLeader && (
           <div className="bg-card border border-border/50 rounded-2xl p-8">
             <LogExpenseForm group={group} />
           </div>
         )}
       </div>

      {/* Transaction history */}
      <div className="mt-12">
        <h3 className="font-heading text-xl text-primary mb-4">Transaction History</h3>
        <div className="bg-card border border-border/50 rounded-2xl px-6 py-2">
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </motion.div>
  );
}