import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { SankeyData, SankeyNode, SankeyLink, getAreaColor, getPaperColor } from '../utils/sankeyData';

interface SankeyDiagramProps {
  data: SankeyData;
  width?: number;
  height?: number;
}

interface SankeyNodeExtended extends SankeyNode {
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
  value?: number;
  index?: number;
}

interface SankeyLinkExtended {
  source: number | SankeyNodeExtended;
  target: number | SankeyNodeExtended;
  value: number;
  width?: number;
  paperTitle?: string;
}

function Legend() {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="flex flex-wrap justify-center gap-6 mt-4 text-xs">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-700">Research Areas:</span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: getAreaColor('Computer Architecture') }}></div>
          <span>Computer Architecture</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: getAreaColor('Machine Learning Systems') }}></div>
          <span>ML Systems</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: getAreaColor('Autonomous Agents') }}></div>
          <span>Autonomous Agents</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-700">Papers by Year:</span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: getPaperColor(currentYear) }}></div>
          <span>Recent (≤2y)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: getPaperColor(currentYear - 5) }}></div>
          <span>Older (≤10y)</span>
        </div>
      </div>
    </div>
  );
}

export default function SankeyDiagram({ data, width = 800, height = 600 }: SankeyDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{ content: string; x: number; y: number; visible: boolean }>({
    content: '',
    x: 0,
    y: 0,
    visible: false
  });

  // Debug logging
  console.log('SankeyDiagram render:', { data, width, height, nodesCount: data.nodes.length, linksCount: data.links.length });

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length || !data.links.length) {
      console.log('SankeyDiagram: Missing data or ref', { 
        hasRef: !!svgRef.current, 
        nodesLength: data.nodes.length, 
        linksLength: data.links.length 
      });
      return;
    }

    try {
      console.log('SankeyDiagram: Starting render...');
      
      // Clear previous content
      d3.select(svgRef.current).selectAll('*').remove();

      const svg = d3.select(svgRef.current);
      const margin = { top: 20, right: 20, bottom: 20, left: 20 };
      const chartWidth = width - margin.left - margin.right;
      const chartHeight = height - margin.top - margin.bottom;

      console.log('SankeyDiagram: Chart dimensions:', { chartWidth, chartHeight });

      // Create the chart group
      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Create Sankey layout
      const sankeyLayout = sankey<SankeyNodeExtended, SankeyLinkExtended>()
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[0, 0], [chartWidth, chartHeight]]);

      // Prepare data for D3
      const nodes = data.nodes.map((node, i) => ({ ...node, index: i })) as SankeyNodeExtended[];
      
      const links: SankeyLinkExtended[] = data.links.map(link => {
        const sourceIndex = typeof link.source === 'string' ? data.nodes.findIndex(n => n.id === link.source) : link.source;
        const targetIndex = typeof link.target === 'string' ? data.nodes.findIndex(n => n.id === link.target) : link.target;
        
        return {
          source: sourceIndex,
          target: targetIndex,
          value: link.value,
          paperTitle: link.paperTitle
        };
      });

      const graph = { nodes, links };
      console.log('SankeyDiagram: Prepared graph data:', { nodesCount: nodes.length, linksCount: links.length });

      // Apply Sankey layout
      const { nodes: layoutNodes, links: layoutLinks } = sankeyLayout(graph);
      console.log('SankeyDiagram: Layout applied successfully');

      // Create gradient definitions for links
      const defs = svg.append('defs');
      
      layoutLinks.forEach((link: any, i: number) => {
        const gradient = defs.append('linearGradient')
          .attr('id', `gradient-${i}`)
          .attr('gradientUnits', 'userSpaceOnUse')
          .attr('x1', link.source.x1 || 0)
          .attr('x2', link.target.x0 || 0);

        gradient.append('stop')
          .attr('offset', '0%')
          .attr('stop-color', link.source.type === 'paper' ? getPaperColor(link.source.year || 2020) : getAreaColor(link.source.name))
          .attr('stop-opacity', 0.6);

        gradient.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', link.target.type === 'paper' ? getPaperColor(link.target.year || 2020) : getAreaColor(link.target.name))
          .attr('stop-opacity', 0.6);
      });

      // Draw links
      g.append('g')
        .selectAll('.link')
        .data(layoutLinks)
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', sankeyLinkHorizontal())
        .attr('stroke', (d: any, i: number) => `url(#gradient-${i})`)
        .attr('stroke-width', (d: any) => Math.max(1, d.width || 1))
        .attr('fill', 'none')
        .attr('opacity', 0.7)
        .on('mouseover', function(event: MouseEvent, d: any) {
          d3.select(this).attr('opacity', 1);
          setTooltip({
            content: `${d.source.name} → ${d.target.name}`,
            x: event.pageX,
            y: event.pageY,
            visible: true
          });
        })
        .on('mouseout', function() {
          d3.select(this).attr('opacity', 0.7);
          setTooltip(prev => ({ ...prev, visible: false }));
        });

      // Draw nodes
      const node = g.append('g')
        .selectAll('.node')
        .data(layoutNodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', (d: SankeyNodeExtended) => `translate(${d.x0 || 0},${d.y0 || 0})`);

      // Add node rectangles
      node.append('rect')
        .attr('height', (d: SankeyNodeExtended) => (d.y1 || 0) - (d.y0 || 0))
        .attr('width', (d: SankeyNodeExtended) => (d.x1 || 0) - (d.x0 || 0))
        .attr('fill', (d: SankeyNodeExtended) => d.type === 'paper' ? getPaperColor(d.year || 2020) : getAreaColor(d.name))
        .attr('stroke', '#000')
        .attr('stroke-width', 0.5)
        .on('mouseover', function(event: MouseEvent, d: SankeyNodeExtended) {
          d3.select(this).attr('stroke-width', 2);
          const tooltipContent = d.type === 'paper' 
            ? `${d.name} (${d.year})<br/>${d.venue}`
            : `${d.name}<br/>${d.value || 0} papers`;
          setTooltip({
            content: tooltipContent,
            x: event.pageX,
            y: event.pageY,
            visible: true
          });
        })
        .on('mouseout', function() {
          d3.select(this).attr('stroke-width', 0.5);
          setTooltip(prev => ({ ...prev, visible: false }));
        });

      // Add node labels
      node.append('text')
        .attr('x', (d: SankeyNodeExtended) => (d.x0 || 0) < chartWidth / 2 ? 6 : -6)
        .attr('y', (d: SankeyNodeExtended) => ((d.y1 || 0) + (d.y0 || 0)) / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', (d: SankeyNodeExtended) => (d.x0 || 0) < chartWidth / 2 ? 'start' : 'end')
        .attr('font-size', width < 600 ? '8px' : '10px')
        .attr('font-weight', 'bold')
        .text((d: SankeyNodeExtended) => {
          if (d.type === 'paper') {
            // Truncate paper titles for better display
            const maxLength = width < 600 ? 20 : 30;
            return d.name.length > maxLength ? d.name.substring(0, maxLength) + '...' : d.name;
          }
          return d.name;
        })
        .style('pointer-events', 'none');

      console.log('SankeyDiagram: Render completed successfully');

    } catch (error) {
      console.error('Error rendering Sankey diagram:', error);
    }

  }, [data, width, height]);

  if (!data.nodes.length || !data.links.length) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available for visualization</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border border-gray-200 rounded-lg bg-white"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      
      {/* Legend */}
      <Legend />
      
      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            transform: 'translateY(-100%)'
          }}
          dangerouslySetInnerHTML={{ __html: tooltip.content }}
        />
      )}
    </div>
  );
} 