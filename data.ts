import { AlbumStats, CyclingStats, ExperienceItem, SkillCategory, Adventure, CyclingRoute } from './types';

export const cyclingData: CyclingStats[] = [];

export const albumStats: AlbumStats = {
  totalListened: 0,
  averageRating: 0,
  topGenre: "Loading...",
  recentAlbum: "Loading...",
  recentArtist: "",
  recentRating: 0,
  topAlbums: []
};

export const adventures: Adventure[] = [
  {
    id: '1',
    name: 'Patagonia, Chile',
    type: 'past',
    coordinates: { x: 28, y: 85 },
    description: "Bikepacking the Carretera Austral. Wind, rain, and glaciers.",
    photoUrl: "https://picsum.photos/id/1036/400/300"
  },
  {
    id: '2',
    name: 'Dolomites, Italy',
    type: 'past',
    coordinates: { x: 52, y: 32 },
    description: "Via Ferrata climbing and high-altitude espresso.",
    photoUrl: "https://picsum.photos/id/1018/400/300"
  },
  {
    id: '3',
    name: 'Kyoto, Japan',
    type: 'past',
    coordinates: { x: 85, y: 38 },
    description: "Temple hopping and chasing autumn leaves.",
    photoUrl: "https://picsum.photos/id/1015/400/300"
  },
  {
    id: '4',
    name: 'Banff, Canada',
    type: 'past',
    coordinates: { x: 18, y: 25 },
    description: "Ski mountaineering in the Rockies.",
    photoUrl: "https://picsum.photos/id/1039/400/300"
  },
  {
    id: '5',
    name: 'Mongolia',
    type: 'future',
    coordinates: { x: 75, y: 30 },
    description: "The dream: Horse trekking across the steppe.",
  },
  {
    id: '6',
    name: 'New Zealand',
    type: 'future',
    coordinates: { x: 92, y: 88 },
    description: "The ultimate bikepacking traverse.",
  }
];

export const cyclingRoutes: CyclingRoute[] = [
  {
    id: 'r1',
    name: 'Carretera Austral Traverse',
    stats: '770 miles | 45k ft elev',
    path: [
      { x: 28, y: 78 },
      { x: 29, y: 82 },
      { x: 27, y: 86 },
      { x: 28, y: 90 }
    ],
    color: '#059669' // emerald-600
  },
  {
    id: 'r2',
    name: 'NYC Advocacy Loops',
    stats: 'Daily Commute | 5,000+ miles logged',
    path: [
      { x: 23, y: 36 }, 
      { x: 25, y: 38 },
      { x: 22, y: 39 },
      { x: 23, y: 36 }
    ],
    color: '#059669'
  },
  {
    id: 'r3',
    name: 'Italian Alps Circuits',
    stats: 'Sellaronda Hero | 50 miles',
    path: [
      { x: 51, y: 31 },
      { x: 53, y: 31 },
      { x: 53, y: 33 },
      { x: 51, y: 33 },
      { x: 51, y: 31 }
    ],
    color: '#059669'
  }
];

// Keeping skills/experience in file for "Resume PDF" generation or future use, 
// even if not displayed on main page.
export const skills: SkillCategory[] = [
  {
    category: "Data Engineering",
    skills: ["AWS Glue", "PySpark", "S3", "Redshift", "Python", "Boto3", "Airflow"]
  },
  {
    category: "Data Quality & Governance",
    skills: ["Identity Resolution", "Deduplication", "Lineage", "Metadata", "Great Expectations", "dbt"]
  },
  {
    category: "Analytics & BI",
    skills: ["SQL Modeling", "Domo", "Tableau", "Power BI", "Looker", "Executive Dashboards"]
  }
];

export const experience: ExperienceItem[] = [
  {
    company: "The Michael J. Fox Foundation",
    role: "Senior Data Engineer",
    period: "Jan 2025 - Present",
    location: "Remote",
    highlights: [
      "Established Salesforce DQ baseline.",
      "Built standardized clean layer with AWS Glue.",
    ]
  }
];