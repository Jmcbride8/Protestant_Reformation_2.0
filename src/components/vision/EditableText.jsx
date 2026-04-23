import React, { useState, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';

/**
 * EditableText — renders text with a hover edit button.
 * Persists edits to localStorage keyed by `storageKey`.
 * 
 * Props:
 *   storageKey  — unique key for localStorage
 *   defaultText — fallback text if nothing saved
 *   className   — classes applied to the rendered text element
 *   as          — html tag to render (default: 'p')
 *   isAdmin     — only show edit controls when true
 */
export default function EditableText({ storageKey, defaultText, className = '', as: Tag = 'p', isAdmin }) {
  const lsKey = `vision_text_${storageKey}`;
  const [text, setText] = useState(() => localStorage.getItem(lsKey) || defaultText);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);

  const save = () => {
    localStorage.setItem(lsKey, draft);
    setText(draft);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(text);
    setEditing(false);
  };

  if (!isAdmin) {
    return <Tag className={className}>{text}</Tag>;
  }

  if (editing) {
    return (
      <div className="relative">
        <textarea
          className="w-full min-h-[80px] rounded-lg border border-accent/60 bg-background text-foreground font-body text-sm p-3 resize-y focus:outline-none focus:ring-2 focus:ring-accent"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          autoFocus
        />
        <div className="flex gap-2 mt-1 justify-end">
          <button onClick={cancel} className="flex items-center gap-1 text-xs font-body text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border">
            <X className="w-3 h-3" /> Cancel
          </button>
          <button onClick={save} className="flex items-center gap-1 text-xs font-body text-white bg-accent hover:bg-accent/90 px-2 py-1 rounded">
            <Check className="w-3 h-3" /> Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative inline-block w-full">
      <Tag className={className}>{text}</Tag>
      <button
        onClick={() => { setDraft(text); setEditing(true); }}
        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-accent text-white rounded-full p-1 shadow-md"
        title="Edit text"
      >
        <Pencil className="w-3 h-3" />
      </button>
    </div>
  );
}