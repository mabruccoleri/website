import React from 'react';
import { Briefcase, Calendar } from 'lucide-react';
import { ExperienceItem } from '../types';
import { CodeBlock } from './CodeBlock';

interface Props {
  experiences: ExperienceItem[];
  isEngineerMode: boolean;
}

export const Timeline: React.FC<Props> = ({ experiences, isEngineerMode }) => {
    
    if (isEngineerMode) {
        const dbtModel = `
-- models/marts/career/dim_experience.sql

WITH raw_jobs AS (
    SELECT 'The Michael J. Fox Foundation' as company, 'Senior Data Engineer' as role, '2025-Present' as period
    UNION ALL
    SELECT 'Magic Leap', 'Data Engineer', '2022-2025'
    UNION ALL
    SELECT 'Rapid7', 'Sr BizOps Analyst', '2022-2022'
)

SELECT 
    *,
    CASE 
        WHEN company = 'MJFF' THEN 'DQ & Standardization'
        WHEN company = 'Magic Leap' THEN 'dbt & BigQuery'
        ELSE 'Analytics Engineering'
    END as core_focus
FROM raw_jobs
ORDER BY period DESC
        `.trim();
        return (
            <div className="w-full">
                <CodeBlock language="sql" code={dbtModel} title="dim_experience.sql" />
            </div>
        );
    }

  return (
    <div className="space-y-8">
      {experiences.map((job, idx) => (
        <div key={idx} className="relative pl-8 border-l-2 border-slate-200 last:border-0">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-emerald-500"></div>
          
          <div className="mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xl font-bold text-slate-800">{job.role}</h3>
            <div className="flex items-center gap-1 text-sm text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">
                <Calendar className="w-3 h-3" />
                {job.period}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-emerald-700 font-medium mb-3">
            <Briefcase className="w-4 h-4" />
            {job.company}
          </div>
          
          <ul className="list-disc list-outside ml-4 space-y-2">
            {job.highlights.map((point, i) => (
                <li key={i} className="text-slate-600 text-sm leading-relaxed pl-1">
                    {point}
                </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
