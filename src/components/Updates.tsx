import { useState, useEffect } from 'react';
import yaml from 'js-yaml';

interface Update {
  date: string;
  title: string;
  description: string;
  link?: string;
  link_text?: string;
}

interface UpdatesData {
  updates: Update[];
}

interface UpdatesProps {
  className?: string;
  maxItems?: number;
  homeStyle?: boolean;
}

function Updates({ className = '', maxItems, homeStyle = false }: UpdatesProps) {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUpdates = async () => {
      try {
        setLoading(true);
        const base = process.env.NODE_ENV === 'production' ? '/homepage' : '';
        const response = await fetch(`${base}/content/updates.yaml`);
        if (!response.ok) {
          throw new Error('Failed to load updates');
        }
        const yamlText = await response.text();
        const data = yaml.load(yamlText) as UpdatesData;
        
        // Sort by date (newest first) and limit if needed
        const sortedUpdates = data.updates.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setUpdates(maxItems ? sortedUpdates.slice(0, maxItems) : sortedUpdates);
        setError(null);
      } catch (err) {
        console.error('Error loading updates:', err);
        setError('Failed to load updates');
      } finally {
        setLoading(false);
      }
    };

    loadUpdates();
  }, [maxItems]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    if (homeStyle) {
      return (
        <div className="bg-gradient-to-br from-[#A51C30] to-[#8B1A2B] rounded-2xl p-8 text-white">
          <h3 className="text-xl font-semibold mb-4">Latest Updates</h3>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/10 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-white/10 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className={`${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} text-gray-500 italic`}>
        {error}
      </div>
    );
  }

  // Home style rendering with crimson gradient
  if (homeStyle) {
    return (
      <div className="bg-gradient-to-br from-[#A51C30] to-[#8B1A2B] rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-3">Latest Updates</h3>
        <div className="space-y-3">
          {updates.map((update, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-3">
              <p className="text-sm opacity-90 font-medium mb-1">{update.title}</p>
              <p className="text-xs opacity-80 mb-1 line-clamp-2">
                {update.description.length > 80 
                  ? `${update.description.substring(0, 80)}...` 
                  : update.description}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs opacity-70">{formatDate(update.date)}</p>
                {update.link && update.link_text && (
                  <a 
                    href={update.link}
                    className="text-xs text-white/80 hover:text-white font-medium transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {update.link_text} →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Standard page rendering
  return (
    <div className={`${className}`}>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Latest Updates</h1>
      <div className="space-y-8">
        {updates.map((update, index) => (
          <div key={index} className="border-l-4 border-[#A51C30] pl-6 pb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm text-gray-500">{formatDate(update.date)}</span>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{update.title}</h2>
            
            <p className="text-gray-600 leading-relaxed mb-4">{update.description}</p>
            
            {update.link && update.link_text && (
              <a 
                href={update.link}
                className="text-[#A51C30] hover:text-[#8B1A2B] font-medium transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {update.link_text} →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Updates; 