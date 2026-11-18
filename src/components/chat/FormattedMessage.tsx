import React from 'react';

interface FormattedMessageProps {
  content: string;
}

export function FormattedMessage({ content }: FormattedMessageProps) {
  const lines = content.split('\n');

  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];

  const renderedBlocks: React.ReactNode[] = [];

  const flushTable = (key: string) => {
    if (tableRows.length > 0 || tableHeader.length > 0) {
      renderedBlocks.push(
        <div key={key} className="my-3 overflow-x-auto rounded-xl border border-[#242738] bg-[#0c0d14]/90 shadow-md">
          <table className="w-full text-left text-xs border-collapse">
            {tableHeader.length > 0 && (
              <thead>
                <tr className="border-b border-[#212435] bg-[#141622] text-zinc-300 font-semibold">
                  {tableHeader.map((h, i) => (
                    <th key={i} className="py-2.5 px-3.5 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-[#1c1e2d]">
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-[#0f1018]' : 'bg-[#12131e]'}>
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={`py-2 px-3.5 ${
                        cIdx === 0 ? 'font-semibold text-zinc-300' : 'text-zinc-200'
                      }`}
                    >
                      {formatInlineText(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableHeader = [];
      tableRows = [];
      inTable = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Markdown Table Row
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim());

      if (cells.every((c) => /^:?-+:?$/.test(c))) {
        inTable = true;
        return;
      }

      if (!inTable && tableHeader.length === 0) {
        tableHeader = cells;
      } else {
        tableRows.push(cells);
      }
      return;
    } else if (inTable || tableHeader.length > 0) {
      flushTable(`table-${index}`);
    }

    // Blank lines
    if (!trimmed) {
      renderedBlocks.push(<div key={`br-${index}`} className="h-1.5" />);
      return;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      renderedBlocks.push(
        <h4 key={`h3-${index}`} className="font-bold text-sm text-cyan-300 mt-2 mb-1">
          {formatInlineText(trimmed.replace('### ', ''))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      renderedBlocks.push(
        <h3 key={`h2-${index}`} className="font-bold text-base text-white mt-3.5 mb-1.5 pb-1 border-b border-[#212433]">
          {formatInlineText(trimmed.replace('## ', ''))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('# ')) {
      renderedBlocks.push(
        <h2 key={`h1-${index}`} className="font-black text-lg text-white mt-3.5 mb-2">
          {formatInlineText(trimmed.replace('# ', ''))}
        </h2>
      );
      return;
    }

    // List item
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
      const itemText = trimmed.replace(/^[-•*]\s+/, '');
      return (
        renderedBlocks.push(
          <div key={`li-${index}`} className="flex items-start gap-2 my-1 text-xs sm:text-sm text-zinc-200 pl-1">
            <span className="text-cyan-400 font-bold mt-1 text-[10px]">•</span>
            <span className="leading-relaxed flex-1">{formatInlineText(itemText)}</span>
          </div>
        )
      );
    }

    // Standard paragraph
    renderedBlocks.push(
      <p key={`p-${index}`} className="text-xs sm:text-sm text-zinc-200 leading-relaxed my-1">
        {formatInlineText(trimmed)}
      </p>
    );
  });

  if (inTable || tableHeader.length > 0) {
    flushTable('table-final');
  }

  return <div className="space-y-1">{renderedBlocks}</div>;
}

function formatInlineText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#171824] text-cyan-300 border border-[#27293b]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
