'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface PieChartData {
  name: string;
  value: number;
  percentage: number;
}

interface PieChartProps {
  data: PieChartData[];
  width?: number;
  height?: number;
}

export function PieChart({ data, width = 300, height = 300 }: PieChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Hapus chart sebelumnya jika ada
    d3.select(svgRef.current).selectAll('*').remove();

    // Siapkan dimensi chart
    const radius = Math.min(width, height) / 2;
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Siapkan color scale
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range([
        '#4f46e5', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', 
        '#10b981', '#22c55e', '#84cc16', '#eab308', '#f59e0b',
        '#f97316', '#ef4444', '#ec4899', '#d946ef', '#a855f7'
      ]);

    // Siapkan pie layout
    const pie = d3.pie<PieChartData>()
      .value(d => d.value)
      .sort(null);

    // Siapkan arc generator
    const arc = d3.arc<d3.PieArcDatum<PieChartData>>()
      .innerRadius(0)
      .outerRadius(radius * 0.8);

    // Siapkan arc untuk label
    const labelArc = d3.arc<d3.PieArcDatum<PieChartData>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.9);

    // Siapkan arc untuk hover
    const hoverArc = d3.arc<d3.PieArcDatum<PieChartData>>()
      .innerRadius(0)
      .outerRadius(radius * 0.85);

    // Buat slices
    const slices = svg.selectAll('.slice')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'slice');

    // Tambahkan path untuk setiap slice
    slices.append('path')
      .attr('d', d => arc(d))
      .attr('fill', d => color(d.data.name) as string)
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .on('mouseover', function(event, d) {
        const path = d3.select(this);
        path.transition()
          .duration(200)
          .attr('d', function() {
            return hoverArc(d);
          });
          
        // Tampilkan tooltip
        const tooltip = d3.select('#tooltip');
        tooltip.style('opacity', 1)
          .html(`
            <div class="p-2 bg-white shadow-lg rounded-md border">
              <div class="font-medium">${d.data.name}</div>
              <div>Rp ${d.data.value.toLocaleString('id-ID')}</div>
              <div>${d.data.percentage.toFixed(1)}%</div>
            </div>
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 20) + 'px');
      })
      .on('mouseout', function(event, d) {
        const path = d3.select(this);
        path.transition()
          .duration(200)
          .attr('d', function() {
            return arc(d);
          });
          
        // Sembunyikan tooltip
        d3.select('#tooltip').style('opacity', 0);
      });

    // Tambahkan label untuk slice yang cukup besar (>5%)
    slices.filter(d => (d.endAngle - d.startAngle) > 0.25)
      .append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text(d => `${d.data.percentage.toFixed(0)}%`);

    // Tambahkan legenda
    const legend = svg.selectAll('.legend')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${radius + 20}, ${-radius + 20 + i * 20})`);

    legend.append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', d => color(d.name) as string);

    legend.append('text')
      .attr('x', 20)
      .attr('y', 10)
      .attr('text-anchor', 'start')
      .style('font-size', '12px')
      .text(d => {
        // Potong nama yang terlalu panjang
        const maxLength = 15;
        const name = d.name.length > maxLength 
          ? d.name.substring(0, maxLength) + '...' 
          : d.name;
        return `${name} (${d.percentage.toFixed(1)}%)`;
      });

  }, [data, width, height]);

  return (
    <div className="relative">
      <svg ref={svgRef}></svg>
      <div id="tooltip" className="absolute pointer-events-none opacity-0 z-10"></div>
    </div>
  );
}
