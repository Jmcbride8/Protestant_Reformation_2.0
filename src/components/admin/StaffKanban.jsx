import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const COLUMNS = [
  { key: 'todo', label: 'To Do', color: 'bg-muted', dot: 'bg-muted-foreground' },
  { key: 'in_progress', label: 'In Progress', color: 'bg-accent/10', dot: 'bg-accent' },
  { key: 'done', label: 'Done', color: 'bg-green-50', dot: 'bg-green-500' },
];

const PRIORITY_STYLES = {
  low: 'bg-secondary text-secondary-foreground',
  medium: 'bg-accent/20 text-accent-foreground',
  high: 'bg-red-100 text-red-600',
};

const EMPTY_FORM = { title: '', description: '', assignee: '', priority: 'medium', due_date: '' };

function AddCardForm({ column, onAdd, onClose }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, status: column });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="bg-card border border-border/60 rounded-xl p-4 space-y-3 mt-2">
      <Input
        autoFocus
        className="font-body text-sm"
        placeholder="Action item title…"
        value={form.title}
        onChange={e => set('title', e.target.value)}
      />
      <Input
        className="font-body text-sm"
        placeholder="Details (optional)"
        value={form.description}
        onChange={e => set('description', e.target.value)}
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="font-body text-xs text-muted-foreground">Assignee</Label>
          <Input className="font-body text-sm" placeholder="Staff name" value={form.assignee} onChange={e => set('assignee', e.target.value)} />
        </div>
        <div>
          <Label className="font-body text-xs text-muted-foreground">Due Date</Label>
          <Input className="font-body text-sm" type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)} />
        </div>
      </div>
      <div>
        <Label className="font-body text-xs text-muted-foreground">Priority</Label>
        <div className="flex gap-2 mt-1">
          {['low', 'medium', 'high'].map(p => (
            <button
              key={p}
              onClick={() => set('priority', p)}
              className={`font-body text-xs px-3 py-1 rounded-full capitalize border transition-all ${
                form.priority === p ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" className="font-body text-xs" onClick={onClose}>
          <X className="w-3 h-3 mr-1" /> Cancel
        </Button>
        <Button size="sm" className="font-body text-xs bg-primary" disabled={!form.title} onClick={() => onAdd(form)}>
          <Plus className="w-3 h-3 mr-1" /> Add
        </Button>
      </div>
    </div>
  );
}

function KanbanCard({ item, onDelete, dragHandleProps, draggableProps, innerRef, isDragging }) {
  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      className={`bg-card border rounded-xl p-4 space-y-2 shadow-sm transition-shadow group cursor-grab active:cursor-grabbing ${
        isDragging ? 'shadow-lg border-primary/40 rotate-1 opacity-90' : 'border-border/60 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className={`font-body text-sm font-medium text-foreground leading-snug flex-1 ${item.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
          {item.title}
        </p>
        <button
          onMouseDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); onDelete(item.id); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive/60 hover:text-destructive shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {item.description && (
        <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.description}</p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <Badge className={`font-body text-xs capitalize ${PRIORITY_STYLES[item.priority]}`}>{item.priority}</Badge>
        {item.assignee && (
          <span className="font-body text-xs text-muted-foreground">→ {item.assignee}</span>
        )}
        {item.due_date && (
          <span className="font-body text-xs text-muted-foreground">
            {new Date(item.due_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  );
}

export default function StaffKanban() {
  const queryClient = useQueryClient();
  const [addingTo, setAddingTo] = useState(null);

  const { data: items = [] } = useQuery({
    queryKey: ['actionItems'],
    queryFn: () => base44.entities.ActionItem.list('-created_date', 200),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ActionItem.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['actionItems'] }); setAddingTo(null); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ActionItem.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['actionItems'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ActionItem.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['actionItems'] }); toast.success('Removed'); },
  });

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;
    updateMutation.mutate({ id: draggableId, data: { status: destination.droppableId } });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading text-xl text-primary">Staff Action Board</h3>
        <p className="font-body text-sm text-muted-foreground mt-0.5">Drag cards between columns to update their status.</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map(col => {
            const colItems = items.filter(i => i.status === col.key);
            return (
              <div key={col.key} className={`rounded-2xl p-4 ${col.color} flex flex-col`} style={{ minHeight: '600px' }}>
                {/* Column header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                    <span className="font-body text-sm font-semibold text-foreground">{col.label}</span>
                    <span className="font-body text-xs text-muted-foreground bg-card/60 px-1.5 py-0.5 rounded-full">{colItems.length}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 text-muted-foreground hover:text-primary"
                    onClick={() => setAddingTo(addingTo === col.key ? null : col.key)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Add form */}
                {addingTo === col.key && (
                  <AddCardForm
                    column={col.key}
                    onAdd={(data) => createMutation.mutate(data)}
                    onClose={() => setAddingTo(null)}
                  />
                )}

                {/* Droppable card list */}
                <Droppable droppableId={col.key}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-3 mt-2 rounded-xl transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
                    >
                      {colItems.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <KanbanCard
                              item={item}
                              onDelete={(id) => deleteMutation.mutate(id)}
                              innerRef={provided.innerRef}
                              draggableProps={provided.draggableProps}
                              dragHandleProps={provided.dragHandleProps}
                              isDragging={snapshot.isDragging}
                            />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {colItems.length === 0 && addingTo !== col.key && (
                        <p className="font-body text-xs text-muted-foreground text-center pt-10">
                          {snapshot.isDraggingOver ? 'Drop here' : 'Nothing here'}
                        </p>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}