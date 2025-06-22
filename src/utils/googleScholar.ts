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

// Note: Google Scholar doesn't have a public API, so we'll use manually updated data
// Based on https://scholar.google.com/citations?hl=en&user=gy4UVGcAAAAJ&view_op=list_works&sortby=pubdate
export const fetchGoogleScholarStats = async (): Promise<GoogleScholarStats> => {
  try {
    // Manually updated stats from Google Scholar profile (as of current date)
    // These need to be updated periodically since there's no public API
    const stats: GoogleScholarStats = {
      totalCitations: 18105, // From your actual Google Scholar profile
      hIndex: 54,            // From your actual Google Scholar profile  
      i10Index: 145,         // From your actual Google Scholar profile
      totalPublications: 120, // This will be overridden by DBLP count
      lastUpdated: new Date('2024-12-19') // Update this when you manually refresh the stats
    };
    
    console.log('Using manually updated Google Scholar stats:', stats);
    return stats;
  } catch (error) {
    console.error('Error fetching Google Scholar stats:', error);
    throw error;
  }
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