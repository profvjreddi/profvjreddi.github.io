export interface Publication {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: 'article' | 'inproceedings' | 'proceedings' | 'book' | 'incollection' | 'phdthesis' | 'mastersthesis';
  pages?: string;
  volume?: string;
  number?: string;
  doi?: string;
  url?: string;
  ee?: string;
  key: string;
  area?: string;
}

export interface DBLPData {
  publications: Publication[];
  totalCount: number;
  lastUpdated: Date;
  coAuthors: { [key: string]: number };
  venueStats: { [key: string]: number };
  yearStats: { [key: string]: number };
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
  
  // Machine Learning / AI
  'NeurIPS': 'Machine Learning',
  'ICML': 'Machine Learning',
  'ICLR': 'Machine Learning',
  'AAAI': 'Autonomous Agents',
  'IJCAI': 'Autonomous Agents',
  'AAMAS': 'Autonomous Agents',
  'ICRA': 'Autonomous Agents',
  'IROS': 'Autonomous Agents',
  'RSS': 'Autonomous Agents',
};

const TITLE_KEYWORDS: { [key: string]: string } = {
  'Computer Architecture': ['architecture', 'processor', 'cache', 'memory', 'hardware', 'accelerator', 'chip', 'core', 'pipeline'],
  'ML Systems': ['system', 'distributed', 'scalable', 'framework', 'infrastructure', 'deployment', 'optimization', 'performance'],
  'Autonomous Agents': ['agent', 'autonomous', 'robot', 'planning', 'reinforcement', 'multi-agent', 'coordination', 'decision'],
  'Machine Learning': ['learning', 'neural', 'deep', 'model', 'training', 'inference', 'algorithm']
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

export function parseDBLPXML(xmlContent: string): DBLPData {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
  
  // Check for parsing errors
  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Invalid XML format');
  }
  
  const publications: Publication[] = [];
  const coAuthors: { [key: string]: number } = {};
  const venueStats: { [key: string]: number } = {};
  const yearStats: { [key: string]: number } = {};
  
  // Get all publication elements
  const pubElements = xmlDoc.querySelectorAll('article, inproceedings, proceedings, book, incollection, phdthesis, mastersthesis');
  
  pubElements.forEach((element) => {
    try {
      const type = element.tagName as Publication['type'];
      const key = element.getAttribute('key') || '';
      
      // Extract title
      const titleElement = element.querySelector('title');
      if (!titleElement?.textContent) return;
      const title = titleElement.textContent.trim();
      
      // Extract authors
      const authorElements = element.querySelectorAll('author');
      const authors = Array.from(authorElements).map(el => el.textContent?.trim() || '').filter(Boolean);
      
      // Extract venue (journal, booktitle, or school)
      const venueElement = element.querySelector('journal, booktitle, school');
      const venue = venueElement?.textContent?.trim() || 'Unknown';
      
      // Extract year
      const yearElement = element.querySelector('year');
      const year = yearElement?.textContent ? parseInt(yearElement.textContent) : new Date().getFullYear();
      
      // Extract optional fields
      const pagesElement = element.querySelector('pages');
      const pages = pagesElement?.textContent?.trim();
      
      const volumeElement = element.querySelector('volume');
      const volume = volumeElement?.textContent?.trim();
      
      const numberElement = element.querySelector('number');
      const number = numberElement?.textContent?.trim();
      
      const doiElement = element.querySelector('doi');
      const doi = doiElement?.textContent?.trim();
      
      const urlElement = element.querySelector('url');
      const url = urlElement?.textContent?.trim();
      
      const eeElement = element.querySelector('ee');
      const ee = eeElement?.textContent?.trim();
      
      // Classify research area
      const area = classifyResearchArea(venue, title);
      
      const publication: Publication = {
        title,
        authors,
        venue,
        year,
        type,
        key,
        area,
        ...(pages && { pages }),
        ...(volume && { volume }),
        ...(number && { number }),
        ...(doi && { doi }),
        ...(url && { url }),
        ...(ee && { ee })
      };
      
      publications.push(publication);
      
      // Update statistics
      authors.forEach(author => {
        if (author !== authors[0]) { // Assuming first author is the professor
          coAuthors[author] = (coAuthors[author] || 0) + 1;
        }
      });
      
      venueStats[venue] = (venueStats[venue] || 0) + 1;
      yearStats[year.toString()] = (yearStats[year.toString()] || 0) + 1;
      
    } catch (error) {
      console.warn('Error parsing publication element:', error);
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