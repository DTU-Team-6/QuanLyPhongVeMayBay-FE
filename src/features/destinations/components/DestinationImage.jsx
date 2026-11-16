import { useState } from 'react';
import { validDestinationImage } from '../utils/destinationHelpers';

export default function DestinationImage({ src, name, large = false }) {
  const [failedSource, setFailedSource] = useState(null);
  const showImage = src && validDestinationImage(src) && failedSource !== src;
  return (
    <div className={`${large ? 'h-48 w-full' : 'h-16 w-24 shrink-0'} rounded-lg bg-sky-50 flex items-center justify-center overflow-hidden border border-slate-100`}>
      {showImage ? (
        <img src={src} alt={name || 'Ảnh minh họa điểm đến'} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailedSource(src)} className="size-full object-cover" />
      ) : (
        <span className="text-xs text-slate-500 text-center px-2">{src ? 'Không tải được ảnh' : 'Chưa có ảnh'}</span>
      )}
    </div>
  );
}
