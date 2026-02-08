import React from 'react';
import { Database, Server, BarChart3, Workflow } from 'lucide-react';
import { SkillCategory } from '../types';
import { CodeBlock } from './CodeBlock';

interface Props {
  skills: SkillCategory[];
  isEngineerMode: boolean;
}

export const SkillMap: React.FC<Props> = ({ skills, isEngineerMode }) => {
  
  const pipelineCode = `
from awsglue.transforms import *
from pyspark.context import SparkContext

# The Foundation
def build_foundation():
    stack = [
        "AWS Glue", "PySpark", 
        "Redshift", "S3"
    ]
    return Pipeline(stack)

# The Logic
def apply_standards(df):
    return df.transform(
        deduplicate(keys=["email", "phone"]),
        standardize_address(),
        resolve_identity()
    )

# The Value
def serve_insights():
    return Dashboard(
        tools=["Domo", "Tableau", "SQL"],
        metric="Trust"
    )
  `.trim();

  if (isEngineerMode) {
    return <CodeBlock language="python" code={pipelineCode} title="src/pipelines/marcus_skills_etl.py" />;
  }

  const getIcon = (cat: string) => {
    if (cat.includes("Engineering")) return <Server className="w-5 h-5 text-blue-500" />;
    if (cat.includes("Quality")) return <Workflow className="w-5 h-5 text-emerald-500" />;
    return <BarChart3 className="w-5 h-5 text-orange-500" />;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
        <Database className="w-5 h-5 text-blue-600" />
        Tech Stack
      </h3>
      
      <div className="space-y-6">
        {skills.map((category) => (
            <div key={category.category}>
                <div className="flex items-center gap-2 mb-3">
                    {getIcon(category.category)}
                    <h4 className="font-semibold text-slate-700">{category.category}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                    {category.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full border border-slate-200">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
