import React from 'react';
import { Terminal, Leaf } from 'lucide-react';

interface Props {
  title: string;
  subtitle: string;
  isEngineerMode: boolean;
}

export const SectionHeader: React.FC<Props> = ({ title, subtitle, isEngineerMode }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        {isEngineerMode ? (
          <Terminal className="w-6 h-6 text-indigo-400" />
        ) : (
          <Leaf className="w-6 h-6 text-nature-700" />
        )}
        <h2 className={`text-2xl font-bold ${isEngineerMode ? 'font-mono text-indigo-400' : 'text-slate-800'}`}>
          {isEngineerMode ? `class ${title.replace(/\s/g, '')} extends Component` : title}
        </h2>
      </div>
      <p className={`text-lg ${isEngineerMode ? 'font-mono text-slate-500' : 'text-slate-600'}`}>
        {isEngineerMode ? `// ${subtitle}` : subtitle}
      </p>
    </div>
  );
};
