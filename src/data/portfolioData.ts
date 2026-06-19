import { CaseStudy, Experience, SkillItem } from '../types';

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'customer-segmentation',
    title: 'Customer Segmentation Analysis',
    category: 'Marketing Analytics & Automation',
    description: 'Automated RFM (Recency, Frequency, Monetary) analysis using Python data structures to categorize 50,000+ global customers. Provided business users with live, self-serve cohorts to match marketing automation campaigns directly, boosting email campaign performance indices.',
    tags: ['Python', 'Power Query', 'RFM Analysis', 'Customer Cohorts'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuFlL71mrCRfgkuPhdCAF98ij9wxg8CYLIpZ9-eLW7h4uYyJ3RK2vqfoTW-aEPtiwTloMPQUuzIimFyqJ62QDdsTxNT9V9l2dQQp3D8CsXiA5EcPdQFCYSqBrTkET1Lv_-6cLC38OVUm9k2ZDBgSW_nV0u-DVcX7jxS0Od8R6j6p7MF0JG-_eLpOay3rYolqMQEY9ihRsxkZ5XeBeSj7gEVSqO7l7Qm-S_fTzqNKCFqLTRAGH-zuMCMhVa5HVTLyD6jwldzeGj1geA',
    impactMetric: '+24% Email CTR',
    tools: ['Python', 'Power Query', 'SQL'],
    detailedMetrics: [
      { label: 'Active Customers Segmented', value: '54,320' },
      { label: 'Optimized Cohorts Discovered', value: '5 Segments' },
      { label: 'Marketing ROI Increase', value: 'x2.4 fold' }
    ]
  },
  {
    id: 'sales-forecasting',
    title: 'Sales Forecasting Model',
    category: 'Business Planning & Finance',
    description: 'Developed and validated an integrated predictive regression model analyzing multi-year historical order books. Predicts incoming enterprise revenue, seasonal variance modifiers, and marketing channel responses with over 95% validation accuracy.',
    tags: ['SQL', 'PowerBI', 'Sales Trends', 'Business Intelligence'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4at_MfB3KVhLLsSAvR5O74aQ77QDJm5dapXWTiarjOduQPHE1pBfcrbGjeCW7o9usfS9TX8d-Gin7Kp0dJ0WTbNDL_ZwHe_JHbcmlZw3c_EWFbdd415cMyJy6qotSUSzinHUaJ-eINpz4Gh5Pk4Rz-_Qd3bmOcuA-_hPnMZvnayUVcsWZt7S_6mV71rvlkCXIdcCNenlUaSbFdmLog6E26dnCv-_hqCx5PcV-Klbi-t7cgynNu6p_Hz2Yt_F0IKOaCPVGlRmEI4Y',
    impactMetric: '95% Model Accuracy',
    tools: ['SQL', 'PowerBI', 'Python', 'Excel'],
    detailedMetrics: [
      { label: 'Forecast Period', value: '18 Months' },
      { label: 'Inventory Cost Decrease', value: '14.2%' },
      { label: 'Revenue Target Attainment', value: '98.6%' }
    ]
  },
  {
    id: 'supply-chain',
    title: 'Supply Chain Optimization',
    category: 'Operational Logistics',
    description: 'Identified supply chain delivery bottlenecks through comprehensive spatial route allocation and lead-time analysis. Built responsive custom dashboard layouts in PowerBI using cleaned Power Query steps to flag high-latency routes, reducing total delivery lead times through warehouse re-allocation and smart routing patterns.',
    tags: ['PowerBI', 'Power Query', 'Excel', 'KPI Dashboard'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo-a6SXIcAxZjhbhWokPhtATOqTJOhP06ZPDuhdhhIbiZ6m4A8GLXhZNZrbXkcNF19Q85CjV-drdvyruBf0JWduWK9DvUM0lxCwK6jOnZNbbxJA98RlagxFrEdRld5IBNJti-Yacm4AGtAxKMLvi3-1shwH-cCcEdJW8N1dPls9YTrOO8meoT780A_8NMYuoy_soP_Rz82vTIPQ104Ht3AzarfvimQQGILH7zWiPyuZKlRwEnhLCxovkZQuXj7o0qLiWV2pyMgmNY',
    impactMetric: '-15% Lead Time',
    tools: ['PowerBI', 'Power Query', 'Excel', 'SQL'],
    detailedMetrics: [
      { label: 'Annual Savings Generated', value: '$240,000' },
      { label: 'Supply Constraints Eliminated', value: '4 Major Nodes' },
      { label: 'Warehouse Load Balanced', value: '94.8% Utility' }
    ]
  }
];

export const SKILLS: SkillItem[] = [
  {
    id: 'sql',
    name: 'SQL',
    icon: 'Database',
    category: 'core',
    description: 'Database query design, CTEs, window functions, query plan optimization, schema creation, PostgreSQL, and Snowflake setups.'
  },
  {
    id: 'python',
    name: 'Python',
    icon: 'Terminal',
    category: 'core',
    description: 'Pandas, NumPy, data cleaning workflows, automated analytics scripts, statistical aggregations, and custom API proxies.'
  },
  {
    id: 'power-query',
    name: 'Power Query',
    icon: 'Layers',
    category: 'visualization',
    description: 'Advanced M-code operations, ETL data connections, enterprise-level data mashups, parameterization, and schema merges.'
  },
  {
    id: 'powerbi',
    name: 'PowerBI',
    icon: 'TrendingUp',
    category: 'visualization',
    description: 'DAX modeling, power query ETL setups, enterprise level tabular reporting layouts, and automated emails notifications.'
  },
  {
    id: 'excel',
    name: 'Excel',
    icon: 'Grid',
    category: 'analytical',
    description: 'PowerPivot datasets, nested lookup formulas, financial sensitivity scenarios, and rapid ad-hoc analytical checks.'
  }
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'exp-1',
    period: '2021 — PRESENT',
    role: 'Senior Analyst',
    company: 'Global Tech Corp',
    tools: ['SQL', 'Python', 'PowerBI', 'Power Query'],
    bulletPoints: [
      'Developed end-to-end data pipelines using Python and SQL, reducing standard data processing times by 40%.',
      'Led cross-functional teams in identifying $2M in annual cost savings through advanced trend modeling and inventory optimizations.',
      'Built real-time executive dashboards in PowerBI providing instant visibility into KPI performance.'
    ]
  },
  {
    id: 'exp-2',
    period: '2018 — 2021',
    role: 'Data Scientist',
    company: 'Insight Solutions',
    tools: ['Python', 'Power Query', 'Excel', 'PowerBI'],
    bulletPoints: [
      'Implemented a customer segmentation model that increased campaign conversion rates by 18%.',
      'Optimized inventory management systems using analytical linear models, reducing waste by 12%.',
      'Constructed robust ETL procedures using Power Query to clean unstructured user feedback datasets for core product decisions.'
    ]
  }
];
