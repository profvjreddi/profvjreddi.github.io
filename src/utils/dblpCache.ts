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
    
    'Autonomous Systems': [
      'autonomous', 'robot', 'robotics', 'uav', 'drone', 'vehicle', 'navigation',
      'control', 'sensing', 'perception', 'planning', 'ros', 'operating system',
      'fault', 'safety', 'reliability', 'real-time'
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

export const fetchDBLPData = async (): Promise<Publication[]> => {
  try {
    console.log('Fetching DBLP data...');
    
    // Use the exact query that works in browser
    const query = 'author:Vijay_Janapa_Reddi';
    const url = `https://dblp.org/search/publ/api?q=${encodeURIComponent(query)}&format=json&h=200`;
    
    console.log('DBLP API URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; Academic Website)',
      },
    });
    
    console.log('DBLP Response status:', response.status);
    console.log('DBLP Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('DBLP API Error Response:', errorText);
      throw new Error(`DBLP API returned ${response.status}: ${response.statusText}`);
    }
    
    const responseText = await response.text();
    console.log('Raw DBLP Response:', responseText.substring(0, 500) + '...');
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse DBLP response as JSON:', parseError);
      console.error('Response text:', responseText);
      throw new Error('Invalid JSON response from DBLP API');
    }
    
    console.log('Parsed DBLP Response structure:', {
      hasResult: !!data.result,
      hasHits: !!data.result?.hits,
      hasHit: !!data.result?.hits?.hit,
      hitType: Array.isArray(data.result?.hits?.hit) ? 'array' : typeof data.result?.hits?.hit
    });
    
    if (!data.result?.hits?.hit) {
      console.warn('No publications found in DBLP response');
      console.log('Full response:', data);
      return [];
    }
    
    const hits = Array.isArray(data.result.hits.hit) ? data.result.hits.hit : [data.result.hits.hit];
    console.log(`Processing ${hits.length} publication hits`);
    
    const publications: Publication[] = hits.map((hit: any, index: number) => {
      try {
        const info = hit.info;
        console.log(`Processing publication ${index + 1}:`, {
          title: info.title,
          hasAuthors: !!info.authors,
          venue: info.venue || info.journal || info.booktitle,
          year: info.year
        });
        
        // Handle authors - can be string, object, or array
        let authors: string[] = [];
        if (info.authors?.author) {
          if (Array.isArray(info.authors.author)) {
            authors = info.authors.author.map((a: any) => 
              typeof a === 'string' ? a : (a.text || a['#text'] || String(a))
            );
          } else {
            const author = info.authors.author;
            authors = [typeof author === 'string' ? author : (author.text || author['#text'] || String(author))];
          }
        }
        
        const pub: Publication = {
          title: info.title || 'Untitled',
          authors: authors,
          venue: info.venue || info.journal || info.booktitle || 'Unknown Venue',
          year: parseInt(info.year) || new Date().getFullYear(),
          type: info.type || 'article',
          url: info.url,
          ee: info.ee
        };
        
        // Classify research area
        pub.area = classifyResearchArea(pub);
        
        return pub;
      } catch (pubError) {
        console.error(`Error processing publication ${index + 1}:`, pubError);
        return null;
      }
    }).filter(Boolean) as Publication[];
    
    console.log(`Successfully parsed ${publications.length} publications`);
    
    // Sort by year (most recent first)
    publications.sort((a, b) => b.year - a.year);
    
    return publications;
    
  } catch (error) {
    console.error('Error fetching DBLP data:', error);
    throw error;
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