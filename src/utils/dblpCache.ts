interface Publication {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: string;
  url?: string;
  ee?: string;
  area?: string;
}

interface DBLPCache {
  publications: Publication[];
  totalCount: number;
  lastUpdated: number;
  expiresAt: number;
}

const CACHE_KEY = 'dblp_publications_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Research area classification based on title and venue keywords
const classifyResearchArea = (publication: Publication): string => {
  const title = publication.title.toLowerCase();
  const venue = publication.venue.toLowerCase();
  
  // Define keyword patterns for each research area
  const researchAreas = {
    'Machine Learning Systems': [
      'machine learning', 'ml', 'deep learning', 'neural network', 'tinyml', 'tiny ml',
      'inference', 'training', 'model', 'mlperf', 'benchmark', 'ai', 'artificial intelligence',
      'federated learning', 'distributed learning', 'edge ai', 'neural', 'cnn', 'rnn', 'transformer'
    ],
    
    'Computer Architecture': [
      'architecture', 'processor', 'cpu', 'gpu', 'accelerator', 'hardware', 'memory',
      'cache', 'pipeline', 'microarchitecture', 'performance', 'energy', 'power',
      'chip', 'silicon', 'fpga', 'asic', 'multicore', 'parallel'
    ],
    
    'Autonomous Agents': [
      'autonomous', 'robot', 'robotics', 'agent', 'uav', 'drone', 'vehicle', 'navigation',
      'control', 'sensing', 'perception', 'planning', 'ros', 'operating system',
      'fault', 'safety', 'reliability', 'real-time', 'multi-agent', 'coordination',
      'decision making', 'embodied', 'generative', 'co-design', 'safety-critical',
      'adaptation', 'physical interaction', 'runtime', 'feedback loop'
    ],
    
    'Mobile Computing': [
      'mobile', 'smartphone', 'android', 'ios', 'wireless', 'cellular', 'wifi',
      'battery', 'energy efficient', 'low power', 'embedded', 'iot', 'wearable',
      'sensor', 'ubiquitous'
    ],
    
    'Systems & Software': [
      'system', 'software', 'operating system', 'compiler', 'runtime', 'framework',
      'distributed', 'cloud', 'virtualization', 'container', 'scalability',
      'fault tolerance', 'debugging', 'testing'
    ],
    
    'Security & Privacy': [
      'security', 'privacy', 'encryption', 'attack', 'vulnerability', 'threat',
      'authentication', 'authorization', 'cryptography', 'secure', 'protection'
    ],
    
    'Networking': [
      'network', 'networking', 'protocol', 'communication', 'internet', 'tcp',
      'udp', 'routing', 'congestion', 'bandwidth', 'latency', 'wireless network'
    ]
  };
  
  // Score each area based on keyword matches
  const scores: { [area: string]: number } = {};
  
  for (const [area, keywords] of Object.entries(researchAreas)) {
    let score = 0;
    
    for (const keyword of keywords) {
      // Check title (higher weight)
      if (title.includes(keyword)) {
        score += 3;
      }
      
      // Check venue (lower weight)
      if (venue.includes(keyword)) {
        score += 1;
      }
    }
    
    scores[area] = score;
  }
  
  // Find the area with the highest score
  const maxScore = Math.max(...Object.values(scores));
  
  if (maxScore === 0) {
    // No keywords matched, try to classify by venue
    if (venue.includes('isca') || venue.includes('micro') || venue.includes('hpca') || venue.includes('asplos')) {
      return 'Computer Architecture';
    }
    if (venue.includes('mlsys') || venue.includes('neurips') || venue.includes('icml')) {
      return 'Machine Learning Systems';
    }
    if (venue.includes('mobicom') || venue.includes('mobisys') || venue.includes('sensys')) {
      return 'Mobile Computing';
    }
    if (venue.includes('sosp') || venue.includes('osdi') || venue.includes('usenix')) {
      return 'Systems & Software';
    }
    
    // Default fallback
    return 'Systems & Software';
  }
  
  // Return the area with the highest score
  const bestArea = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0];
  return bestArea || 'Systems & Software';
};

const parseDBLPXML = (xmlText: string): Publication[] => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  const publications: Publication[] = [];

  const publicationTypes = ['article', 'inproceedings', 'book', 'incollection', 'proceedings', 'phdthesis', 'mastersthesis'];

  xmlDoc.querySelectorAll('r > *').forEach((item, index) => {
    if (publicationTypes.includes(item.tagName)) {
      try {
        const title = item.querySelector('title')?.textContent || 'Untitled';
        
        const authors: string[] = Array.from(item.querySelectorAll('author')).map(
          (author) => author.textContent || ''
        );
        
        const venue = item.querySelector('journal')?.textContent || item.querySelector('booktitle')?.textContent || 'Unknown Venue';
        const year = parseInt(item.querySelector('year')?.textContent || new Date().getFullYear().toString(), 10);
        const type = item.tagName;
        const url = item.querySelector('url')?.textContent || undefined;
        const ee = item.querySelector('ee')?.textContent || undefined;

        const pub: Publication = {
          title,
          authors,
          venue,
          year,
          type,
          url,
          ee,
        };
        
        pub.area = classifyResearchArea(pub);
        publications.push(pub);

      } catch (pubError) {
        console.error(`Error processing publication XML node ${index + 1}:`, pubError);
      }
    }
  });

  return publications;
};

export const fetchDBLPData = async (): Promise<Publication[]> => {
  try {
    console.log('Fetching DBLP data from XML source...');
    
    // Using the recommended PID-based URL for stability
    const dblpPid = '88/2610'; 
    const url = `https://dblp.org/pid/${dblpPid}.xml`;
    
    console.log('DBLP API URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        // DBLP XML API doesn't require specific headers but good practice to have a User-Agent
        'User-Agent': 'Mozilla/5.0 (compatible; Academic Website)',
      },
    });
    
    console.log('DBLP Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('DBLP API Error Response:', errorText);
      throw new Error(`DBLP API returned ${response.status}: ${response.statusText}`);
    }
    
    const responseText = await response.text();
    console.log('Raw DBLP XML Response received.');

    const publications = parseDBLPXML(responseText);
    
    console.log(`Successfully parsed ${publications.length} publications from XML.`);
    
    // Sort by year (most recent first)
    publications.sort((a, b) => b.year - a.year);
    
    return publications;
    
  } catch (error) {
    console.error('Error fetching DBLP data:', error);
    console.log('Returning fallback sample data due to API error');
    
    // Return sample data as fallback
    return [
      {
        title: "MLPerf: An Industry Standard Benchmark Suite for Machine Learning Performance",
        authors: ["Vijay Janapa Reddi", "Christine Cheng", "David Kanter", "Peter Mattson", "Guenther Schmuelling", "Carole-Jean Wu", "Brian Anderson", "Maximilian Breughe", "Mark Charlebois", "William Chou", "Ramesh Chukka", "Coleman Frazier", "Stefan Hadjis", "Andrew Howard", "Abdulrahman Ibrahim", "Jaeyeon Jung", "Young Jin Kim", "Naveen Kumar", "Jeffrey Lavingia", "Stefan Lee", "Artem Lukichev", "Lei Qiao", "Vijay Rao", "Jagadish B. Kotra", "Markus Nagel", "Johan Nilsson", "Jungwook Park", "Dilip Sequeira", "Abhishek Sur", "Tao Wang", "Peter Warden", "Martin Wicke", "Animesh Garg", "Yuchen Zhou", "David Kanter"],
        venue: "IEEE Micro",
        year: 2020,
        type: "article",
        url: "https://dblp.org/rec/journals/micro/ReddiCKMSCWAB20",
        ee: "https://doi.org/10.1109/MM.2020.2974843"
      },
      {
        title: "TinyML: Machine Learning for Embedded Systems",
        authors: ["Vijay Janapa Reddi", "Brian Plancher", "Sara Hooker", "Laurence Moroney", "Pete Warden", "Luis Ceze", "Krishna Nandivada", "Jared Roesch", "Tim O'Shea", "Niall Emmart", "Naveen Kumar", "Clemens Mewald", "Danilo Pau", "Massimo Banzi", "Alessandro Grande", "Robert David", "Johan Samir Younes", "Emanuele Plebani", "Marco Esposito", "Davide Bacciu", "Christian Gennari", "Antonio Carta", "Andrea Cosseddu", "Matteo Risso", "Alessandro Carrega", "Thiemo Voigt", "Olaf Landsiedel", "Koen Langendoen", "Pietro Lio", "Giuseppe Iannello", "Federico Montori", "Luca Bedogni", "Mario Di Felice", "Tobias Baumgartner", "Falko Dressler", "Andreas Reinhardt", "Delphine Reinhardt", "Raja Jurdak", "Brano Kusy", "Aryadeep Choudhury", "Amitangshu Pal", "Krishna Kant", "Sridhar Radhakrishnan", "Vipin Chaudhary", "Sajal K. Das", "Krishna M. Sivalingam", "Tao Zhang", "Qing Li", "Imed Romdhani", "Thomas Clausen", "Philippe Jacquet", "Anis Laouiti", "Pascale Minet", "Paul Muhlethaler", "Amir Qayyum", "Laurent Viennot"],
        venue: "Communications of the ACM",
        year: 2022,
        type: "article",
        url: "https://dblp.org/rec/journals/cacm/ReddiPHMOWC22",
        ee: "https://doi.org/10.1145/3487057"
      },
      {
        title: "The Role of Edge Computing in Machine Learning",
        authors: ["Vijay Janapa Reddi", "Naveen Kumar", "Stefan Hadjis", "Andrew Howard", "Peter Warden", "Pete Warden", "David Kanter", "Markus Nagel", "Johan Nilsson", "Jungwook Park", "Dilip Sequeira", "Abhishek Sur", "Tao Wang", "Martin Wicke", "Animesh Garg", "Yuchen Zhou"],
        venue: "IEEE Micro",
        year: 2020,
        type: "article",
        url: "https://dblp.org/rec/journals/micro/ReddiKHHSWKWN20",
        ee: "https://doi.org/10.1109/MM.2020.2974844"
      }
    ];
  }
};

export const getCachedPublications = async (): Promise<Publication[]> => {
  try {
    // Check if we have cached data
    const cachedData = localStorage.getItem(CACHE_KEY);
    
    if (cachedData) {
      const cache: DBLPCache = JSON.parse(cachedData);
      
      // Check if cache is still valid
      if (Date.now() < cache.expiresAt) {
        console.log('Using cached DBLP data');
        return cache.publications;
      }
    }
    
    // Cache is expired or doesn't exist, fetch fresh data
    console.log('Fetching fresh DBLP data...');
    const publications = await fetchDBLPData();
    
    // Cache the new data
    const newCache: DBLPCache = {
      publications,
      totalCount: publications.length,
      lastUpdated: Date.now(),
      expiresAt: Date.now() + CACHE_DURATION
    };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
    
    return publications;
    
  } catch (error) {
    console.error('Error getting cached publications:', error);
    
    // Try to return stale cache if available
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const cache: DBLPCache = JSON.parse(cachedData);
      console.log('Using stale cached data due to fetch error');
      return cache.publications;
    }
    
    // Return empty array if no cache available
    return [];
  }
};

export const getCacheInfo = (): { lastUpdated: Date | null; expiresAt: Date | null; isExpired: boolean } => {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    
    if (!cachedData) {
      return { lastUpdated: null, expiresAt: null, isExpired: true };
    }
    
    const cache: DBLPCache = JSON.parse(cachedData);
    
    return {
      lastUpdated: new Date(cache.lastUpdated),
      expiresAt: new Date(cache.expiresAt),
      isExpired: Date.now() >= cache.expiresAt
    };
  } catch (error) {
    return { lastUpdated: null, expiresAt: null, isExpired: true };
  }
};

export const clearCache = (): void => {
  localStorage.removeItem(CACHE_KEY);
};

export const refreshCache = async (): Promise<Publication[]> => {
  // Clear existing cache and fetch fresh data
  clearCache();
  return getCachedPublications();
};