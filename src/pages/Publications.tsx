import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';
import { getCachedPublications, getCacheInfo, refreshCache } from '../utils/dblpCache';
import { getCachedScholarStats, getScholarCacheInfo } from '../utils/googleScholar';
import WordCloud from '../components/WordCloud';

interface Publication {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: string;
  url?: string;
  ee?: string;
  areas?: string[];
}

interface GoogleScholarStats {
  totalCitations: number;
  hIndex: number;
  i10Index: number;
  totalPublications: number;
  lastUpdated: Date;
}

interface CacheInfo {
  lastUpdated: Date | null;
  expiresAt: Date | null;
  isExpired: boolean;
}

// Classification system for 3 core research areas - now returns multiple areas
const classifyPublication = (publication: Publication): string[] => {
  const title = publication.title.toLowerCase();
  const venue = publication.venue.toLowerCase();
  
  const areas = {
    'Computer Architecture': [
      'architecture', 'processor', 'cpu', 'gpu', 'hardware', 'memory', 'cache',
      'accelerator', 'chip', 'silicon', 'fpga', 'asic', 'microarchitecture',
      'performance', 'energy', 'power', 'multicore', 'parallel', 'embedded',
      'mobile', 'iot', 'edge computing'
    ],
    'Machine Learning Systems': [
      'machine learning', 'ml', 'deep learning', 'neural', 'ai', 'artificial intelligence',
      'tinyml', 'inference', 'training', 'model', 'benchmark', 'mlperf',
      'distributed learning', 'framework', 'system', 'edge ai', 'dataset'
    ],
    'Autonomous Agents': [
      'autonomous', 'robot', 'robotics', 'agent', 'uav', 'drone', 'control',
      'navigation', 'planning', 'safety', 'fault', 'real-time', 'multi-agent',
      'coordination', 'decision making', 'embodied', 'ros'
    ]
  };
  
  const matchedAreas: string[] = [];
  
  for (const [area, keywords] of Object.entries(areas)) {
    let score = 0;
    for (const keyword of keywords) {
      if (title.includes(keyword)) score += 3;
      if (venue.includes(keyword)) score += 1;
    }
    // Lower threshold to allow multiple matches
    if (score >= 2) {
      matchedAreas.push(area);
    }
  }
  
  // If no matches, default to Machine Learning Systems
  return matchedAreas.length > 0 ? matchedAreas : ['Machine Learning Systems'];
};

// Venue color system
const getVenueColor = (venue: string): string => {
  const colors = [
    'bg-red-100 text-red-800', 'bg-blue-100 text-blue-800', 'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800', 'bg-yellow-100 text-yellow-800', 'bg-indigo-100 text-indigo-800',
    'bg-pink-100 text-pink-800', 'bg-cyan-100 text-cyan-800', 'bg-orange-100 text-orange-800'
  ];
  
  let hash = 0;
  for (let i = 0; i < venue.length; i++) {
    hash = ((hash << 5) - hash) + venue.charCodeAt(i);
  }
  return colors[Math.abs(hash) % colors.length];
};

function Publications() {
  const [searchParams] = useSearchParams();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [scholarStats, setScholarStats] = useState<GoogleScholarStats | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>(searchParams.get('area') || 'All');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [cacheInfo, setCacheInfo] = useState<{ lastUpdated: Date | null; expiresAt: Date | null; isExpired: boolean }>({ lastUpdated: null, expiresAt: null, isExpired: true });
  const [showWordCloud, setShowWordCloud] = useState<boolean>(false);
  const [wordCloudTemplate, setWordCloudTemplate] = useState<'harvard' | 'modern' | 'academic' | 'minimal' | 'rainbow' | 'sunset' | 'ocean' | 'forest'>('rainbow');

  const loadPublications = async (forceRefresh = false) => {
    try {
      console.log('loadPublications called with forceRefresh:', forceRefresh);
      setError(null);
      setLoading(!forceRefresh); // Only show full-page loader on initial load
      if (forceRefresh) setRefreshing(true);

      console.log('About to fetch publications and stats...');
      const [pubs, stats] = await Promise.all([
        forceRefresh ? refreshCache() : getCachedPublications(),
        getCachedScholarStats()
      ]);
      
      console.log('Fetched publications:', pubs);
      console.log('Fetched stats:', stats);
      
      const classifiedPubs = pubs.map(pub => ({
        ...pub,
        areas: pub.area ? [pub.area] : classifyPublication(pub)
      }));
      console.log('Classified publications:', classifiedPubs);
      
      setPublications(classifiedPubs);
      setScholarStats(stats);
      setCacheInfo(getCacheInfo());
    } catch (err) {
      console.error('Error in loadPublications:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPublications();
    setCacheInfo(getCacheInfo());
  }, []);

  const handleRefresh = () => {
    loadPublications(true);
  };

  const myNames = [
    "Vijay Janapa Reddi",
    "Vijay J. Reddi", 
    "V. Janapa Reddi",
    "V. J. Reddi",
    "Vijay Reddi",
    "V. Reddi"
    // Add any other common variations you publish under
  ];

  const { coAuthorCount } = useMemo(() => {
    const coAuthors = new Set<string>();
    publications.forEach(pub => {
      pub.authors.forEach(author => {
        if (!myNames.some(name => author.toLowerCase() === name.toLowerCase())) {
          coAuthors.add(author);
        }
      });
    });
    return { coAuthorCount: coAuthors.size };
  }, [publications]);

  const publicationsByArea = useMemo(() => {
    const researchAreas = ['Computer Architecture', 'Machine Learning Systems', 'Autonomous Agents'];
    return researchAreas.reduce((acc, area) => {
      acc[area] = publications.filter(pub => pub.areas?.includes(area)).length;
      return acc;
    }, {} as Record<string, number>);
  }, [publications]);

  const filteredPublications = useMemo(() => {
    if (selectedArea === 'All') {
      return publications;
    }
    return publications.filter(pub => pub.areas?.includes(selectedArea));
  }, [publications, selectedArea]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A51C30] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading publications from DBLP...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <div className="bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Publications</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => loadPublications()}
                className="inline-flex items-center px-4 py-2 bg-[#A51C30] text-white rounded-lg hover:bg-[#8B1A2B] transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Publications</h1>
            <div className="w-24 h-1 bg-[#A51C30]"></div>
            <p className="text-lg text-gray-600 mt-6 max-w-3xl">
              This work often bridges multiple disciplines. The full archive of publications is filterable by core research areas.
              *Please note: Research areas are automatically generated and may not be perfectly accurate.
            </p>
          </div>

          {/* Cache Last Updated */}
          <div className="mb-4 text-sm text-gray-500">
            {cacheInfo.lastUpdated ? (
              <>Last updated: {cacheInfo.lastUpdated.toLocaleString()}</>
            ) : (
              <>Last updated: Unknown</>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <a 
              href="https://scholar.google.com/citations?hl=en&user=gy4UVGcAAAAJ&view_op=list_works&sortby=pubdate" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Google Scholar
              <FiExternalLink className="ml-1 w-4 h-4" />
            </a>
            <a 
              href="https://dblp.org/pid/88/2610.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              DBLP Profile
              <FiExternalLink className="ml-1 w-4 h-4" />
            </a>
            <button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#A51C30] hover:bg-[#8B1A2B] disabled:bg-gray-400"
            >
              {refreshing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              )}
              {refreshing ? 'Refreshing...' : 'Refresh Cache'}
            </button>
          </div>

          {/* Stats Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">At a Glance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-[#A51C30]">{publications.length}</div>
                <div className="text-sm text-gray-600 mt-1">Publications</div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-[#A51C30]">{coAuthorCount}</div>
                <div className="text-sm text-gray-600 mt-1">Co-Authors</div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-[#A51C30]">
                  {scholarStats ? `${Math.floor(scholarStats.totalCitations / 1000)}k+` : '...'}
                </div>
                <div className="text-sm text-gray-600 mt-1">Citations</div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-[#A51C30]">{scholarStats?.hIndex || '...'}</div>
                <div className="text-sm text-gray-600 mt-1">h-index</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* All Publications Section */}
          <div>
            {/* Word Cloud Toggle */}
            <div className="mb-6 text-center">
              <button
                onClick={() => setShowWordCloud(!showWordCloud)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                {showWordCloud ? 'Hide' : 'Show'} Keyword Cloud
                <svg className={`ml-2 w-4 h-4 transition-transform ${showWordCloud ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {/* Word Cloud */}
            {showWordCloud && (
              <div className="mb-8">
                <WordCloud 
                  publications={publications} 
                  width={600} 
                  height={300}
                  className="mx-auto"
                  selectedArea={selectedArea}
                  template="rainbow"
                />
              </div>
            )}
            
            {/* Area Filters */}
            <div className="flex flex-wrap justify-start gap-2 mb-8">
              {['All', ...Object.keys(publicationsByArea)].map((area) => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedArea === area
                      ? "bg-[#A51C30] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  {area} {area !== 'All' && publicationsByArea[area] ? `(${publicationsByArea[area]})` : ''}
                </button>
              ))}
            </div>

            {/* Publications List */}
            {filteredPublications.length > 0 ? (
              <div className="space-y-6">
                {filteredPublications.map((pub, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getVenueColor(pub.venue)}`}>
                        {pub.venue} {pub.year}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {pub.areas?.map((area, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {pub.ee || pub.url ? (
                        <a href={pub.ee || pub.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#A51C30] transition-colors">
                          {pub.title}
                        </a>
                      ) : (
                        pub.title
                      )}
                    </h3>
                    
                    <p className="text-gray-600 mb-4">
                      {pub.authors.map((author, i) => (
                        <span key={i}>
                          {author.includes('Reddi') ? <strong>{author}</strong> : author}
                          {i < pub.authors.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </p>
                    
                    <div className="flex space-x-4">
                      {pub.ee && (
                        <a href={pub.ee} target="_blank" rel="noopener noreferrer" className="text-[#A51C30] hover:text-[#8B1A2B] text-sm font-medium">
                          PDF →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Publications Found</h3>
                <p className="text-gray-500 mb-6">
                  There are no publications matching the selected filter.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Publications;