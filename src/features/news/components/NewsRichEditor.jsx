import { useRef } from 'react';

/**
 * Trình soạn thảo nội dung tin tức có thanh công cụ định dạng (Đoạn văn, B, I, U, Danh sách, Liên kết).
 * Lưu dưới dạng văn bản có đánh dấu nhẹ, tương thích LONGTEXT của BE và an toàn khi render.
 */
export function NewsRichEditor({ value, onChange, error, placeholder }) {
  const textareaRef = useRef(null);

  const applyFormat = (type) => {
    const textarea = textareaRef.current;
    const current = value || '';
    const start = textarea ? textarea.selectionStart : current.length;
    const end = textarea ? textarea.selectionEnd : current.length;
    const selected = current.slice(start, end);

    let replacement = '';
    let cursorOffset = 0;

    if (type === 'heading') {
      const sample = selected || 'Tiêu đề mục mới';
      replacement = `${start > 0 && !current.slice(0, start).endsWith('\n') ? '\n\n' : ''}## ${sample}\n`;
      cursorOffset = replacement.length;
    } else if (type === 'bold') {
      const sample = selected || 'nội dung in đậm';
      replacement = `**${sample}**`;
      cursorOffset = replacement.length;
    } else if (type === 'italic') {
      const sample = selected || 'nội dung in nghiêng';
      replacement = `*${sample}*`;
      cursorOffset = replacement.length;
    } else if (type === 'underline') {
      const sample = selected || 'nội dung gạch chân';
      replacement = `__${sample}__`;
      cursorOffset = replacement.length;
    } else if (type === 'list') {
      const lines = (selected || 'Mục danh sách 1\nMục danh sách 2')
        .split('\n')
        .map((line) => (line.startsWith('- ') ? line : `- ${line}`))
        .join('\n');
      replacement = `${start > 0 && !current.slice(0, start).endsWith('\n') ? '\n' : ''}${lines}\n`;
      cursorOffset = replacement.length;
    } else if (type === 'link') {
      const label = selected || 'Xem chi tiết';
      replacement = `[${label}](https://vanvietairlines.vn)`;
      cursorOffset = replacement.length;
    }

    const updated = current.slice(0, start) + replacement + current.slice(end);
    onChange(updated);

    requestAnimationFrame(() => {
      if (!textarea) return;
      textarea.focus();
      const nextPos = start + cursorOffset;
      textarea.setSelectionRange(nextPos, nextPos);
    });
  };

  return (
    <div>
      <div
        className={`overflow-hidden rounded-xl border bg-white ${
          error ? 'border-red-400' : 'border-[#cbd5e1] focus-within:border-[#0284c7]'
        }`}
      >
        <div className="flex flex-wrap items-center gap-1 border-b border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 text-[12px] text-[#334155]">
          <button
            type="button"
            onClick={() => applyFormat('heading')}
            className="rounded px-2.5 py-1 font-medium hover:bg-[#e2e8f0] cursor-pointer"
          >
            Đoạn văn
          </button>
          <span className="h-4 w-px bg-[#e2e8f0]" />
          <button
            type="button"
            onClick={() => applyFormat('bold')}
            title="In đậm"
            className="rounded px-2.5 py-1 font-bold hover:bg-[#e2e8f0] cursor-pointer"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => applyFormat('italic')}
            title="In nghiêng"
            className="rounded px-2.5 py-1 italic hover:bg-[#e2e8f0] cursor-pointer"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => applyFormat('underline')}
            title="Gạch chân"
            className="rounded px-2.5 py-1 underline hover:bg-[#e2e8f0] cursor-pointer"
          >
            U
          </button>
          <span className="h-4 w-px bg-[#e2e8f0]" />
          <button
            type="button"
            onClick={() => applyFormat('list')}
            className="rounded px-2.5 py-1 font-medium hover:bg-[#e2e8f0] cursor-pointer"
          >
            Danh sách
          </button>
          <button
            type="button"
            onClick={() => applyFormat('link')}
            className="rounded px-2.5 py-1 font-medium hover:bg-[#e2e8f0] cursor-pointer"
          >
            Liên kết
          </button>
        </div>

        <textarea
          ref={textareaRef}
          rows={12}
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder || 'Nhập nội dung đầy đủ của tin tức...'}
          className="w-full resize-y border-0 p-3.5 text-[13px] leading-relaxed text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none"
        />
      </div>
      {error && <p className="mt-1.5 text-[12px] font-medium text-red-600">{error}</p>}
    </div>
  );
}

/**
 * Render nội dung bài viết an toàn bằng React element (không dùng dangerouslySetInnerHTML).
 */
function renderInlineTokens(text) {
  const tokenRegex = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|\[[^\]]+\]\(https?:\/\/[^)]+\))/g;
  const parts = String(text || '').split(tokenRegex);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-semibold text-[#0f172a]">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('__') && part.endsWith('__')) {
      return <span key={index} className="underline">{part.slice(2, -2)}</span>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[#0284c7] underline hover:text-[#0369a1]"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

export function NewsContentRenderer({ content }) {
  const blocks = String(content || '')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return <p className="text-[14px] text-[#64748b]">Nội dung bài viết đang được cập nhật.</p>;
  }

  return (
    <div className="space-y-4 text-[14px] leading-7 text-[#334155]">
      {blocks.map((block, idx) => {
        if (block.startsWith('## ')) {
          return (
            <h2 key={idx} className="pt-2 text-[18px] font-bold text-[#0f172a]">
              {renderInlineTokens(block.slice(3).trim())}
            </h2>
          );
        }

        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
        const isBulletList = lines.length > 0 && lines.every((l) => l.startsWith('- '));

        if (isBulletList) {
          return (
            <ul key={idx} className="list-disc space-y-1.5 pl-5">
              {lines.map((item, i) => (
                <li key={i}>{renderInlineTokens(item.slice(2).trim())}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={idx} className="whitespace-pre-line">
            {renderInlineTokens(block)}
          </p>
        );
      })}
    </div>
  );
}
