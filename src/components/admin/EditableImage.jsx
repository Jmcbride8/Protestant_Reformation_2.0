import React, { useState, useEffect, useRef } from 'react';
import { Pencil, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// Global cache so all instances share loaded overrides without re-fetching
let _cache = null;
let _listeners = [];
const notifyListeners = () => _listeners.forEach(fn => fn(_cache));

async function loadCache() {
  const records = await base44.entities.SiteImage.list();
  _cache = {};
  records.forEach(r => { _cache[r.key] = r; });
  notifyListeners();
}

/**
 * Drop-in replacement for <img> that shows an edit button for admins.
 * Wrap it in whatever container you need — it fills its parent.
 * 
 * Props:
 *  imageKey  - unique string key for this image slot
 *  src       - fallback/default image URL
 *  alt, className, style - passed to <img>
 *  isAdmin   - shows edit button when true
 *  wrapperClassName - className for the wrapping div (default: "relative")
 */
export default function EditableImage({ imageKey, src, alt, className, style, isAdmin, wrapperClassName = "relative" }) {
  const [overrideUrl, setOverrideUrl] = useState(() => _cache?.[imageKey]?.url ?? null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    const handler = (cache) => setOverrideUrl(cache?.[imageKey]?.url ?? null);
    _listeners.push(handler);

    if (_cache === null) {
      loadCache();
    } else {
      setOverrideUrl(_cache[imageKey]?.url ?? null);
    }

    return () => { _listeners = _listeners.filter(fn => fn !== handler); };
  }, [imageKey]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const existing = _cache?.[imageKey];
    if (existing) {
      await base44.entities.SiteImage.update(existing.id, { url: file_url });
    } else {
      await base44.entities.SiteImage.create({ key: imageKey, url: file_url, label: alt || imageKey });
    }
    await loadCache();
    setUploading(false);
  };

  const displaySrc = overrideUrl || src;

  return (
    <div className={`${wrapperClassName} group/editimg`}>
      <img src={displaySrc} alt={alt} className={className} style={style} />
      {isAdmin && (
        <>
          <button
            onClick={() => inputRef.current?.click()}
            className="absolute top-2 right-2 z-20 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 opacity-0 group-hover/editimg:opacity-100 transition-opacity shadow-lg"
            title={`Replace: ${alt || imageKey}`}
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
          </button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </>
      )}
    </div>
  );
}