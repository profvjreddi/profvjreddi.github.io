import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple word cloud layout algorithm
function layoutWords(words, width, height) {
  const placed = [];
  const attempts = 1000;
  
  words.forEach(word => {
    let isPlaced = false;
    for (let i = 0; i < attempts; i++) {
      const x = Math.random() * (width - word.width) - (width - word.width) / 2;
      const y = Math.random() * (height - word.height) - (height - word.height) / 2;
      
      // Simple collision detection
      let collision = false;
      for (const placedWord of placed) {
        const dx = x - placedWord.x;
        const dy = y - placedWord.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < (word.width + placedWord.width) / 2 + 10) {
          collision = true;
          break;
        }
      }
      
      if (!collision) {
        word.x = x;
        word.y = y;
        placed.push(word);
        isPlaced = true;
        break;
      }
    }
    
    if (!isPlaced) {
      // Place randomly if no space found
      word.x = Math.random() * (width - word.width) - (width - word.width) / 2;
      word.y = Math.random() * (height - word.height) - (height - word.height) / 2;
      placed.push(word);
    }
  });
  
  return words;
}

function generateWordCloud() {
  try {
    // Read the DBLP cache
    const cachePath = path.join(__dirname, '..', 'src', 'utils', 'dblpCache.ts');
    console.log('Reading DBLP cache...');
    
    // For now, let's create a sample word cloud with common academic terms
    // In a real implementation, you'd parse the actual DBLP data
    const sampleWords = [
      { text: 'Machine Learning', count: 15 },
      { text: 'Computer Architecture', count: 12 },
      { text: 'Performance', count: 10 },
      { text: 'Systems', count: 9 },
      { text: 'Optimization', count: 8 },
      { text: 'Hardware', count: 7 },
      { text: 'Neural Networks', count: 7 },
      { text: 'Energy', count: 6 },
      { text: 'Accelerator', count: 6 },
      { text: 'Framework', count: 5 },
      { text: 'Benchmark', count: 5 },
      { text: 'Inference', count: 4 },
      { text: 'Training', count: 4 },
      { text: 'Memory', count: 4 },
      { text: 'Cache', count: 4 },
      { text: 'GPU', count: 3 },
      { text: 'CPU', count: 3 },
      { text: 'Parallel', count: 3 },
      { text: 'Distributed', count: 3 },
      { text: 'Real-time', count: 2 },
      { text: 'Embedded', count: 2 },
      { text: 'Mobile', count: 2 },
      { text: 'Edge Computing', count: 2 },
      { text: 'Autonomous', count: 2 },
      { text: 'Robotics', count: 2 }
    ];

    // Create canvas
    const width = 800;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Set background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Calculate font sizes based on frequency
    const maxCount = Math.max(...sampleWords.map(w => w.count));
    const minFontSize = 16;
    const maxFontSize = 48;

    const words = sampleWords.map(word => {
      const fontSize = minFontSize + (word.count / maxCount) * (maxFontSize - minFontSize);
      ctx.font = `bold ${fontSize}px Arial`;
      const metrics = ctx.measureText(word.text);
      
      return {
        text: word.text,
        count: word.count,
        fontSize: fontSize,
        width: metrics.width,
        height: fontSize,
        x: 0,
        y: 0
      };
    });

    // Layout words
    const laidOutWords = layoutWords(words, width, height);

    // Draw words
    laidOutWords.forEach(word => {
      // Create color gradient based on frequency
      const intensity = word.count / maxCount;
      const hue = 0; // Red (Harvard crimson)
      const saturation = 70 + (intensity * 20); // 70-90%
      const lightness = 60 - (intensity * 30); // 30-60%
      
      ctx.font = `bold ${word.fontSize}px Arial`;
      ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(word.text, word.x + width / 2, word.y + height / 2);
    });

    // Save the image
    const outputPath = path.join(__dirname, '..', 'public', 'wordcloud.png');
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Word cloud generated and saved to: ${outputPath}`);
    console.log(`Image size: ${width}x${height} pixels`);
    console.log(`Words processed: ${sampleWords.length}`);
    
  } catch (error) {
    console.error('Error generating word cloud:', error);
  }
}

// Run the generation
generateWordCloud(); 