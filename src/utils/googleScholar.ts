interface GoogleScholarStats {
  totalCitations: number;
  hIndex: number;
  i10Index: number;
  totalPublications: number;
  lastUpdated: Date;
}

interface GoogleScholarCache {
  stats: GoogleScholarStats;
  expiresAt: number;
}

const SCHOLAR_CACHE_KEY = 'google_scholar_cache';
const SCHOLAR_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Function to parse h-index from Google Scholar HTML using the specific pattern you provided
const parseScholarHTML = (htmlContent: string): Partial<GoogleScholarStats> | null => {
  try {
    // Look for the exact pattern: h-index</a></td> followed by <td class="gsc_rsb_std">55</td>
    const hIndexRegex = /h-index<\/a><\/td>\s*<td class="gsc_rsb_std">(\d+)<\/td>/;
    const hIndexMatch = htmlContent.match(hIndexRegex);
    
    // Also try to get citations with similar pattern
    const citationsRegex = /Citations<\/a><\/td>\s*<td class="gsc_rsb_std">(\d+)<\/td>/;
    const citationsMatch = htmlContent.match(citationsRegex);
    
    // And i10-index
    const i10IndexRegex = /i10-index<\/a><\/td>\s*<td class="gsc_rsb_std">(\d+)<\/td>/;
    const i10IndexMatch = htmlContent.match(i10IndexRegex);
    
    const stats: Partial<GoogleScholarStats> = {};
    
    if (hIndexMatch) {
      stats.hIndex = parseInt(hIndexMatch[1]);
      console.log('Extracted h-index from Google Scholar:', stats.hIndex);
    }
    
    if (citationsMatch) {
      stats.totalCitations = parseInt(citationsMatch[1]);
      console.log('Extracted total citations from Google Scholar:', stats.totalCitations);
    }
    
    if (i10IndexMatch) {
      stats.i10Index = parseInt(i10IndexMatch[1]);
      console.log('Extracted i10-index from Google Scholar:', stats.i10Index);
    }
    
    if (Object.keys(stats).length > 0) {
      stats.lastUpdated = new Date();
      return stats;
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing Google Scholar HTML:', error);
    return null;
  }
};

// Note: Google Scholar doesn't have a public API, so we'll try to fetch and parse the HTML
// Based on https://scholar.google.com/citations?hl=en&user=gy4UVGcAAAAJ&view_op=list_works&sortby=pubdate
export const fetchGoogleScholarStats = async (): Promise<GoogleScholarStats> => {
  console.log('Attempting to fetch Google Scholar stats from raw HTML...');
  
  const scholarUrl = 'https://scholar.google.com/citations?hl=en&user=gy4UVGcAAAAJ&view_op=list_works&sortby=pubdate';
  
  // Try multiple CORS proxy services
  const proxyServices = [
    `https://api.allorigins.win/get?url=${encodeURIComponent(scholarUrl)}`,
    `https://corsproxy.io/?${encodeURIComponent(scholarUrl)}`,
    `https://cors-anywhere.herokuapp.com/${scholarUrl}`,
  ];
  
  for (const proxyUrl of proxyServices) {
    try {
      console.log('Trying proxy:', proxyUrl.split('?')[0]);
      
      const response = await fetch(proxyUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const htmlContent = data.contents || data.data || data;
        
        if (typeof htmlContent === 'string' && htmlContent.includes('gsc_rsb_std')) {
          const parsedStats = parseScholarHTML(htmlContent);
          
          if (parsedStats && parsedStats.hIndex) {
            console.log('Successfully fetched and parsed Google Scholar stats!');
            
            // Combine with fallback values for any missing data
            return {
              totalCitations: parsedStats.totalCitations || 18105,
              hIndex: parsedStats.hIndex,
              i10Index: parsedStats.i10Index || 145,
              totalPublications: 120, // This comes from DBLP anyway
              lastUpdated: new Date()
            };
          }
        }
      }
    } catch (error) {
      console.log('Proxy failed:', error);
      continue;
    }
  }
  
  // Method 2: Direct fetch (will likely fail due to CORS, but worth trying)
  try {
    console.log('Trying direct fetch...');
    const response = await fetch(scholarUrl, {
      mode: 'no-cors',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Academic Website)',
      },
    });
    
    // Note: no-cors means we can't read the response, but we tried
    console.log('Direct fetch attempted (no-cors mode)');
  } catch (error) {
    console.log('Direct fetch failed (expected):', error);
  }
  
  // Fallback to manually updated data
  console.log('All automatic methods failed, using manually updated Google Scholar stats');
  const stats: GoogleScholarStats = {
    totalCitations: 18105, // From your actual Google Scholar profile
    hIndex: 55,            // From your actual Google Scholar profile  
    i10Index: 145,         // From your actual Google Scholar profile
    totalPublications: 120, // This will be overridden by DBLP count
    lastUpdated: new Date('2024-12-19') // Update this when you manually refresh the stats
  };
  
  return stats;
};

export const getCachedScholarStats = async (): Promise<GoogleScholarStats> => {
  try {
    // Check if we have cached data
    const cachedData = localStorage.getItem(SCHOLAR_CACHE_KEY);
    
    if (cachedData) {
      const cache: GoogleScholarCache = JSON.parse(cachedData);
      
      // Check if cache is still valid
      if (Date.now() < cache.expiresAt) {
        console.log('Using cached Google Scholar data');
        return cache.stats;
      }
    }
    
    // Cache is expired or doesn't exist, fetch fresh data
    console.log('Fetching fresh Google Scholar data...');
    const stats = await fetchGoogleScholarStats();
    
    // Cache the new data
    const newCache: GoogleScholarCache = {
      stats,
      expiresAt: Date.now() + SCHOLAR_CACHE_DURATION
    };
    
    localStorage.setItem(SCHOLAR_CACHE_KEY, JSON.stringify(newCache));
    
    return stats;
    
  } catch (error) {
    console.error('Error getting cached Scholar stats:', error);
    
    // Try to return stale cache if available
    const cachedData = localStorage.getItem(SCHOLAR_CACHE_KEY);
    if (cachedData) {
      const cache: GoogleScholarCache = JSON.parse(cachedData);
      console.log('Using stale cached Scholar data due to fetch error');
      return cache.stats;
    }
    
    // Return default values if no cache available
    return {
      totalCitations: 0,
      hIndex: 0,
      i10Index: 0,
      totalPublications: 0,
      lastUpdated: new Date()
    };
  }
};

export const getScholarCacheInfo = (): { lastUpdated: Date | null; expiresAt: Date | null; isExpired: boolean } => {
  try {
    const cachedData = localStorage.getItem(SCHOLAR_CACHE_KEY);
    
    if (!cachedData) {
      return { lastUpdated: null, expiresAt: null, isExpired: true };
    }
    
    const cache: GoogleScholarCache = JSON.parse(cachedData);
    
    return {
      lastUpdated: cache.stats.lastUpdated ? new Date(cache.stats.lastUpdated) : null,
      expiresAt: new Date(cache.expiresAt),
      isExpired: Date.now() >= cache.expiresAt
    };
  } catch (error) {
    return { lastUpdated: null, expiresAt: null, isExpired: true };
  }
};

export const clearScholarCache = (): void => {
  localStorage.removeItem(SCHOLAR_CACHE_KEY);
};

export const refreshScholarCache = async (): Promise<GoogleScholarStats> => {
  clearScholarCache();
  return getCachedScholarStats();
};

