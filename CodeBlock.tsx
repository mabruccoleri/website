import React from 'react';

interface Props {
  language: 'sql' | 'python' | 'json';
  code: string;
  title?: string;
}

export const CodeBlock: React.FC<Props> = ({ language, code, title }) => {
  return (
    <div className="w-full h-full bg-data-900 rounded-lg overflow-hidden border border-slate-700 shadow-xl flex flex-col">
      {title && (
        <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">{title}</span>
          <span className="text-xs font-mono text-indigo-400 uppercase">{language}</span>
        </div>
      )}
      <div className="p-4 overflow-auto flex-1">
        <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
