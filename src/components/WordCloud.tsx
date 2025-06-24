import { useEffect, useRef, useMemo, useState } from 'react';
import { removeStopwords } from 'stopword';
import WordCloud from 'wordcloud';

interface Publication {
  title: string;
  areas?: string[];
}

interface WordCloudProps {
  publications: Publication[];
  width?: number;
  height?: number;
  className?: string;
  selectedArea?: string;
  template?: 'harvard' | 'modern' | 'academic' | 'minimal' | 'rainbow' | 'sunset' | 'ocean' | 'forest';
}

const WordCloudComponent: React.FC<WordCloudProps> = ({ 
  publications, 
  width = 800, 
  height = 600, 
  className = "",
  selectedArea,
  template = 'harvard'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);

  // Template configurations
  const templates = {
    harvard: {
      color: (word: string, freq: number, maxFreq: number) => {
        const normalizedFreq = freq / maxFreq;
        const hue = 0; // Red (Harvard crimson)
        const saturation = 70 + (normalizedFreq * 20);
        const lightness = 60 - (normalizedFreq * 30);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      },
      weightFactor: (freq: number, maxFreq: number) => {
        const normalizedFreq = freq / maxFreq;
        return Math.max(14, Math.min(60, 14 + normalizedFreq * 46));
      },
      rotateRatio: 0.3,
      shape: 'circle'
    },
    modern: {
      color: (word: string, freq: number, maxFreq: number) => {
        const normalizedFreq = freq / maxFreq;
        const hue = 220 + (normalizedFreq * 40); // Blue to purple gradient
        const saturation = 60 + (normalizedFreq * 30);
        const lightness = 50 - (normalizedFreq * 20);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      },
      weightFactor: (freq: number, maxFreq: number) => {
        const normalizedFreq = freq / maxFreq;
        return Math.max(12, Math.min(72, 12 + normalizedFreq * 60));
      },
      rotateRatio: 0.5,
      shape: 'circle'
    },
    academic: {
      color: (word: string, freq: number, maxFreq: number) => {
        const normalizedFreq = freq / maxFreq;
        const hue = 45; // Gold/amber
        const saturation = 80 + (normalizedFreq * 20);
        const lightness = 55 - (normalizedFreq * 25);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      },
      weightFactor: (freq: number, maxFreq: number) => {
        const normalizedFreq = freq / maxFreq;
        return Math.max(16, Math.min(56, 16 + normalizedFreq * 40));
      },
      rotateRatio: 0.1, // Minimal rotation for academic feel
      shape: 'circle'
    },
    minimal: {
      color: (word: string, freq: number, maxFreq: number) => {
        const normalizedFreq = freq / maxFreq;
        const lightness = 20 + (normalizedFreq * 60); // Black to gray
        return `hsl(0, 0%, ${lightness}%)`;
      },
      weightFactor: (freq: number, maxFreq: number) => {
        const normalizedFreq = freq / maxFreq;
        return Math.max(10, Math.min(48, 10 + normalizedFreq * 38));
      },
      rotateRatio: 0,
      shape: 'circle'
    },
    rainbow: {
      color: (word: string, freq: number, maxFreq: number) => {
        // Hot to cold temperature gradient: red -> orange -> yellow -> green -> blue
        const normalizedFreq = freq / maxFreq;
        const hue = 240 - (normalizedFreq * 240); // 240° (blue) to 0° (red) - reversed!
        const saturation = 60 + (normalizedFreq * 20); // 60-80% saturation
        const lightness = 45 + (normalizedFreq * 15); // 45-60% lightness (more muted)
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      },
      weightFactor: (freq: number, maxFreq: number) => {
        const normalizedFreq = freq / maxFreq;
        return Math.max(12, Math.min(68, 12 + normalizedFreq * 56));
      },
      rotateRatio: 0.4,
      shape: 'circle'
    },
    sunset: {
      color: (word: string, freq: number, maxFreq: number) => {
        const normalizedFreq = freq / maxFreq;
        // Sunset colors: red -> orange -> yellow -> pink
        const hue = 0 + (normalizedFreq * 60); // 0° (red) to 60° (yellow)
        const saturation = 85 + (normalizedFreq * 15);
        const lightness = 55 + (normalizedFreq * 15);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      },
      weightFactor: (freq: number, maxFreq: number) => {
        const normalizedFreq = freq / maxFreq;
        return Math.max(14, Math.min(64, 14 + normalizedFreq * 50));
      },
      rotateRatio: 0.2,
      shape: 'circle'
    },
    ocean: {
      color: (word: string, freq: number, maxFreq: number) => {
        const normalizedFreq = freq / maxFreq;
        // Ocean colors: deep blue -> cyan -> light blue
        const hue = 200 + (normalizedFreq * 40); // 200° (blue) to 240° (cyan)
        const saturation = 70 + (normalizedFreq * 30);
        const lightness = 40 + (normalizedFreq * 30);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      },
      weightFactor: (freq: number, maxFreq: number) => {
        const normalizedFreq = freq / maxFreq;
        return Math.max(13, Math.min(62, 13 + normalizedFreq * 49));
      },
      rotateRatio: 0.3,
      shape: 'circle'
    },
    forest: {
      color: (word: string, freq: number, maxFreq: number) => {
        const normalizedFreq = freq / maxFreq;
        // Forest colors: dark green -> light green -> yellow-green
        const hue = 120 + (normalizedFreq * 40); // 120° (green) to 160° (yellow-green)
        const saturation = 75 + (normalizedFreq * 25);
        const lightness = 35 + (normalizedFreq * 35);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      },
      weightFactor: (freq: number, maxFreq: number) => {
        const normalizedFreq = freq / maxFreq;
        return Math.max(15, Math.min(58, 15 + normalizedFreq * 43));
      },
      rotateRatio: 0.25,
      shape: 'circle'
    }
  };

  // Process publications to extract word frequencies
  const wordData = useMemo(() => {
    if (!publications || publications.length === 0) return [];

    // Filter publications by selected area if specified
    const filteredPublications = selectedArea && selectedArea !== 'All' 
      ? publications.filter(pub => pub.areas?.includes(selectedArea))
      : publications;

    if (filteredPublications.length === 0) return [];

    // Extract words from titles
    const wordFreq: { [key: string]: number } = {};
    
    filteredPublications.forEach(pub => {
      if (!pub.title) return;
      // Split on non-word characters
      let words = pub.title.toLowerCase().split(/\W+/);
      // Remove stopwords and filter out short/irrelevant tokens
      words = removeStopwords(words).filter(word => 
        word.length >= 3 && 
        !/^\d+$/.test(word) && // Filter out pure numbers
        !/^[a-z]$/.test(word) // Filter out single letters
      );
      words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      });
    });

    // Convert to array format expected by wordcloud2.js
    const sortedWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 150) // Increased from 100 to 150 words
      .map(([word, count]) => [word, count]);

    return sortedWords;
  }, [publications, selectedArea]);

  useEffect(() => {
    if (!canvasRef.current || wordData.length === 0) {
      return;
    }

    setLoading(true);
    const canvas = canvasRef.current;

    // Get the maximum frequency for scaling
    const maxFreq = Math.max(...wordData.map(([_, freq]) => freq as number));

    // Configure wordcloud2.js options
    const options = {
      list: wordData,
      gridSize: 12, // Increased for better spacing
      weightFactor: function (freq: number) {
        return templates[template].weightFactor(freq, maxFreq);
      },
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', // Better font
      color: function (word: string, freq: number) {
        return templates[template].color(word, freq, maxFreq);
      },
      rotateRatio: templates[template].rotateRatio,
      rotationSteps: 2, // Only 0° and 90° rotations
      backgroundColor: 'transparent', // Transparent background
      shape: templates[template].shape,
      ellipticity: 0.8, // Slightly more oval for better fit
      classes: 'wordcloud',
      hover: function(item: any, dimension: any, event: any) {
        // Simple hover effects without filters
        event.target.style.cursor = 'pointer';
        event.target.style.transform = 'scale(1.05)';
        event.target.style.transition = 'all 0.2s ease';
      },
      click: function(item: any, dimension: any, event: any) {
        // Enhanced click effects
        console.log('Clicked word:', item[0], 'with frequency:', item[1]);
        // Reset hover effects
        event.target.style.transform = '';
      }
    };

    // Clear previous word cloud
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
    }

    // Generate word cloud
    try {
      WordCloud(canvas, options);
      setLoading(false);
    } catch (error) {
      console.error('Error generating word cloud:', error);
      setLoading(false);
    }
  }, [wordData, width, height, template]);

  if (!publications || publications.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 rounded-lg ${className}`} style={{ width, height }}>
        <p className="text-gray-500">No publications available for word cloud</p>
      </div>
    );
  }

  const filteredPublications = selectedArea && selectedArea !== 'All' 
    ? publications.filter(pub => pub.areas?.includes(selectedArea))
    : publications;

  if (filteredPublications.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 rounded-lg ${className}`} style={{ width, height }}>
        <p className="text-gray-500">No publications in selected area</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        {selectedArea && selectedArea !== 'All' 
          ? `${selectedArea} Keywords` 
          : 'Publication Keywords'
        }
      </h3>
      <div className="relative flex justify-center items-center" style={{ minHeight: height }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10 rounded-lg">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A51C30] mb-2"></div>
              <p className="text-sm text-gray-600">Generating word cloud...</p>
            </div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="w-full h-auto"
          style={{ display: 'block' }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-4 text-center">
        Word size indicates frequency in publication titles
        {selectedArea && selectedArea !== 'All' && ` (${filteredPublications.length} publications)`}
      </p>
    </div>
  );
};

export default WordCloudComponent; 