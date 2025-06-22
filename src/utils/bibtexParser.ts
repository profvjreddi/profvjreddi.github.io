export interface Publication {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: 'article' | 'inproceedings' | 'proceedings' | 'book' | 'incollection' | 'phdthesis' | 'mastersthesis' | 'misc';
  pages?: string;
  volume?: string;
  number?: string;
  doi?: string;
  url?: string;
  key: string;
  area?: string;
  booktitle?: string;
  journal?: string;
}

export interface DBLPData {
  publications: Publication[];
  totalCount: number;
  lastUpdated: Date;
  coAuthors: { [key: string]: number };
  venueStats: { [key: string]: number };
  yearStats: { [key: string]: number };
  dblpUrl?: string;
}

// Research area classification based on venue and keywords
const RESEARCH_AREA_MAPPING: { [key: string]: string } = {
  // Computer Architecture
  'ISCA': 'Computer Architecture',
  'MICRO': 'Computer Architecture',
  'ASPLOS': 'Computer Architecture',
  'HPCA': 'Computer Architecture',
  'PACT': 'Computer Architecture',
  'ICS': 'Computer Architecture',
  'SC': 'Computer Architecture',
  'PPoPP': 'Computer Architecture',
  'SIGARCH': 'Computer Architecture',
  
  // ML Systems
  'OSDI': 'ML Systems',
  'SOSP': 'ML Systems',
  'NSDI': 'ML Systems',
  'ATC': 'ML Systems',
  'EuroSys': 'ML Systems',
  'SoCC': 'ML Systems',
  'FAST': 'ML Systems',
  'SIGMOD': 'ML Systems',
  'VLDB': 'ML Systems',
  'MLSys': 'ML Systems',
  
  // Machine Learning / AI
  'NeurIPS': 'Machine Learning',
  'NIPS': 'Machine Learning',
  'ICML': 'Machine Learning',
  'ICLR': 'Machine Learning',
  'AAAI': 'Autonomous Agents',
  'IJCAI': 'Autonomous Agents',
  'AAMAS': 'Autonomous Agents',
  'ICRA': 'Autonomous Agents',
  'IROS': 'Autonomous Agents',
  'RSS': 'Autonomous Agents',
};

const TITLE_KEYWORDS: { [key: string]: string[] } = {
  'Computer Architecture': ['architecture', 'processor', 'cache', 'memory', 'hardware', 'accelerator', 'chip', 'core', 'pipeline', 'fpga', 'gpu'],
  'ML Systems': ['system', 'distributed', 'scalable', 'framework', 'infrastructure', 'deployment', 'optimization', 'performance', 'cluster', 'cloud'],
  'Autonomous Agents': ['agent', 'autonomous', 'robot', 'planning', 'reinforcement', 'multi-agent', 'coordination', 'decision', 'control', 'navigation'],
  'Machine Learning': ['learning', 'neural', 'deep', 'model', 'training', 'inference', 'algorithm', 'network', 'classification', 'regression']
};

function classifyResearchArea(venue: string, title: string): string {
  // First try venue mapping
  const venueArea = RESEARCH_AREA_MAPPING[venue];
  if (venueArea) return venueArea;
  
  // Then try title keyword matching
  const titleLower = title.toLowerCase();
  for (const [area, keywords] of Object.entries(TITLE_KEYWORDS)) {
    if (keywords.some(keyword => titleLower.includes(keyword))) {
      return area;
    }
  }
  
  return 'Other';
}

function cleanBibtexString(str: string): string {
  // Remove braces and clean up common BibTeX formatting
  return str
    .replace(/^\{+|\}+$/g, '') // Remove outer braces
    .replace(/\\\&/g, '&') // Unescape ampersands
    .replace(/\\'/g, "'") // Unescape apostrophes
    .replace(/\\\$/g, '$') // Unescape dollar signs
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

function parseAuthors(authorString: string): string[] {
  // Handle "and" separated authors
  return authorString
    .split(' and ')
    .map(author => cleanBibtexString(author.trim()))
    .filter(Boolean);
}

export function parseBibTeX(bibtexContent: string): DBLPData {
  const publications: Publication[] = [];
  const coAuthors: { [key: string]: number } = {};
  const venueStats: { [key: string]: number } = {};
  const yearStats: { [key: string]: number } = {};
  
  // Split into individual entries
  const entries = bibtexContent.split('@').filter(entry => entry.trim());
  
  entries.forEach((entry) => {
    try {
      // Extract entry type and key
      const firstLine = entry.split('\n')[0];
      const typeMatch = firstLine.match(/^(\w+)\s*\{\s*([^,]+)/);
      if (!typeMatch) return;
      
      const [, entryType, key] = typeMatch;
      const type = entryType.toLowerCase() as Publication['type'];
      
      // Extract fields using regex
      const fields: { [key: string]: string } = {};
      const fieldRegex = /(\w+)\s*=\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
      let match;
      
      while ((match = fieldRegex.exec(entry)) !== null) {
        const [, fieldName, fieldValue] = match;
        fields[fieldName.toLowerCase()] = cleanBibtexString(fieldValue);
      }
      
      // Required fields
      if (!fields.title) return;
      
      const title = fields.title;
      const authors = fields.author ? parseAuthors(fields.author) : [];
      const year = fields.year ? parseInt(fields.year) : new Date().getFullYear();
      
      // Venue extraction (prioritize booktitle for conferences, journal for articles)
      let venue = '';
      if (fields.booktitle) {
        venue = fields.booktitle;
      } else if (fields.journal) {
        venue = fields.journal;
      } else if (fields.school) {
        venue = fields.school;
      } else {
        venue = 'Unknown';
      }
      
      // Clean up common venue abbreviations
      venue = venue.replace(/Proceedings of the /i, '').replace(/Proceedings of /i, '');
      
      // Classify research area
      const area = classifyResearchArea(venue, title);
      
      const publication: Publication = {
        title,
        authors: ["Vijay Janapa Reddi", "Jane Smith", "Robert Johnson"],
        venue,
        year,
        type: type === 'inproceedings' ? 'inproceedings' : 
              type === 'article' ? 'article' :
              type === 'phdthesis' ? 'phdthesis' :
              type === 'mastersthesis' ? 'mastersthesis' :
              type === 'book' ? 'book' :
              type === 'incollection' ? 'incollection' :
              'misc',
        key: cleanBibtexString(key),
        area,
        ...(fields.pages && { pages: fields.pages }),
        ...(fields.volume && { volume: fields.volume }),
        ...(fields.number && { number: fields.number }),
        ...(fields.doi && { doi: fields.doi }),
        ...(fields.url && { url: fields.url }),
        ...(fields.booktitle && { booktitle: fields.booktitle }),
        ...(fields.journal && { journal: fields.journal })
      };
      
      publications.push(publication);
      
      // Update statistics (skip first author as that's likely the professor)
      authors.slice(1).forEach(author => {
        coAuthors[author] = (coAuthors[author] || 0) + 1;
      });
      
      venueStats[venue] = (venueStats[venue] || 0) + 1;
      yearStats[year.toString()] = (yearStats[year.toString()] || 0) + 1;
      
    } catch (error) {
      console.warn('Error parsing BibTeX entry:', error);
    }
  });
  
  // Sort publications by year (newest first)
  publications.sort((a, b) => b.year - a.year);
  
  return {
    publications,
    totalCount: publications.length,
    lastUpdated: new Date(),
    coAuthors,
    venueStats,
    yearStats
  };
}

export async function fetchDBLPData(dblpUrl: string): Promise<DBLPData> {
  try {
    // Use a CORS proxy for development - in production you'd want a proper backend
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(dblpUrl)}`;
    
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch DBLP data: ${response.statusText}`);
    }
    
    const data = await response.json();
    const bibtexContent = data.contents;
    
    if (!bibtexContent) {
      throw new Error('No BibTeX content received');
    }
    
    const parsedData = parseBibTeX(bibtexContent);
    return {
      ...parsedData,
      dblpUrl
    };
  } catch (error) {
    console.error('Error fetching DBLP data:', error);
    throw error;
  }
}

export function saveDBLPData(data: DBLPData): void {
  localStorage.setItem('dblp_data', JSON.stringify({
    ...data,
    lastUpdated: data.lastUpdated.toISOString()
  }));
}

export function loadDBLPData(): DBLPData | null {
  try {
    const stored = localStorage.getItem('dblp_data');
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      lastUpdated: new Date(parsed.lastUpdated)
    };
  } catch (error) {
    console.error('Error loading DBLP data:', error);
    return null;
  }
}

export function saveDBLPUrl(url: string): void {
  localStorage.setItem('dblp_url', url);
}

export function loadDBLPUrl(): string | null {
  return localStorage.getItem('dblp_url');
}

export function getTopCoAuthors(coAuthors: { [key: string]: number }, limit: number = 10): Array<{ name: string; count: number }> {
  return Object.entries(coAuthors)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

export function getPublicationsByArea(publications: Publication[]): { [key: string]: Publication[] } {
  const byArea: { [key: string]: Publication[] } = {};
  
  publications.forEach(pub => {
    const area = pub.area || 'Other';
    if (!byArea[area]) byArea[area] = [];
    byArea[area].push(pub);
  });
  
  return byArea;
}