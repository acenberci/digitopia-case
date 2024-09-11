import React, { useRef, useEffect, useContext } from 'react';
import * as d3 from 'd3';
import { HelperContext } from '@/helpers/HelperContext';

const GanttChart = ({ tasks }) => {
  const chartRef = useRef(null);
  const { panelCollapsed, setPanelCollapsed } = useContext(HelperContext);

  const getQuarterStartEndDates = (date) => {
    const month = date.getMonth();
    const quarter = Math.floor(month / 3);
    const startMonth = quarter * 3;
    const endMonth = startMonth + 3;

    const startDate = new Date(date.getFullYear(), startMonth, 1);
    const endDate = new Date(date.getFullYear(), endMonth, 1);

    return { startDate, endDate };
  };

  const createSectionSeparators = (start, end, numSections) => {
    const sections = [];
    let current = new Date(start);

    while (current < end) {
      const sectionEnd = new Date(current);
      sectionEnd.setMonth(current.getMonth() + 1);
      const interval = (sectionEnd - current) / numSections;

      for (let i = 1; i < numSections; i++) {
        const sectionDate = new Date(current.getTime() + interval * i);
        sections.push(sectionDate);
      }

      current.setMonth(current.getMonth() + 1);
    }

    return sections;
  };

  const createGanttChart = () => {
    const svg = d3.select(chartRef.current);
    const container = chartRef.current.parentElement;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight || 400;

    const startDate = d3.min(tasks, d => new Date(d.startDate));
    const endDate = d3.max(tasks, d => new Date(d.endDate));

    const extendedStartDates = getQuarterStartEndDates(startDate).startDate;
    const extendedEndDates = getQuarterStartEndDates(endDate).endDate;
    const sectionSeparators = createSectionSeparators(extendedStartDates, extendedEndDates, 4);
    const today = new Date();

    const x = d3.scaleTime()
      .domain([extendedStartDates, extendedEndDates])
      .range([0, containerWidth])
      .nice(d3.timeDay);

    const y = d3.scaleBand()
      .domain(tasks.map(d => d.task))
      .range([0, containerHeight - 60])
      .padding(0.2);

    svg.attr('width', containerWidth)
      .attr('height', containerHeight);

    svg.selectAll('*').remove();

    const chart = svg.append('g');

    const monthHeight = 60;

    const monthContainer = chart.append('g')
      .attr('transform', `translate(0, 0)`)
      .attr('class', 'month-container');

    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const yearStart = new Date(extendedStartDates.getFullYear(), 0, 1);
    const yearEnd = new Date(extendedEndDates.getFullYear() + 1, 0, 1);

    const quarterStartDates = [];
    for (let d = yearStart; d < yearEnd; d.setMonth(d.getMonth() + 3)) {
      quarterStartDates.push(new Date(d));
    }

    monthContainer.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', containerWidth)
      .attr('height', monthHeight)
      .attr('fill', 'white');
    monthContainer.append('line')
      .attr('class', 'month-line')
      .attr('x1', x(extendedStartDates))
      .attr('x2', x(extendedEndDates))
      .attr('y1', monthHeight - 1)
      .attr('y2', monthHeight - 1)
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1);

    monthContainer.selectAll('.today')
      .data([today])
      .enter()
      .append('path')
      .attr('d', d => {
        const xPos = x(d);
        const yPos = monthHeight - 3;

        return `M${xPos - 5},${yPos - 5} L${xPos + 5},${yPos - 5} L${xPos},${yPos + 5} Z`;
      })
      .attr('fill', 'blue');

    monthContainer.selectAll('.quarter-label')
      .data(quarterStartDates)
      .enter()
      .append('text')
      .attr('class', 'quarter-label')
      .attr('x', d => (x(d) + x(d3.timeMonth.offset(d, 3))) / 2)
      .attr('y', 10)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'hanging')
      .text((d, i) => ` ${quarters[i % 4]}`)
      .attr('font-size', '12px')
      .attr('fill', '#000');

    monthContainer.selectAll('.h4')
      .data(quarterStartDates)
      .enter()
      .append('text')
      .attr('class', 'h4')
      .attr('x', d => (x(d) + 5))
      .attr('y', 10)
      .attr('text-anchor', 'start')
      .attr('dominant-baseline', 'hanging')
      .text((d, i) => `${(d.getMonth() === 0) ? d.getFullYear() : ""}`)
      .attr('font-size', '12px')
      .attr('fill', '#000');

    monthContainer.selectAll('.quarter-separator')
      .data(quarterStartDates)
      .enter()
      .append('line')
      .attr('class', 'quarter-separator')
      .attr('x1', d => x(d))
      .attr('x2', d => x(d))
      .attr('y1', 10)
      .attr('y2', monthHeight - 10)
      .attr('stroke', '#c1c4c8')
      .attr('stroke-width', d => {
        return (d.getTime() === extendedStartDates.getTime() || d.getTime() === extendedEndDates.getTime()) ? 0 : 1;
      });

    monthContainer.selectAll('.month-label')
      .data(d3.timeMonths(extendedStartDates, extendedEndDates))
      .enter()
      .append('text')
      .attr('class', 'month-label')
      .attr('x', d => (x(d) + x(d3.timeMonth.offset(d, 1))) / 2)
      .attr('y', monthHeight - 13)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'baseline')
      .text(d => d3.timeFormat("%b")(d))
      .attr('font-size', '12px')
      .attr('fill', '#000');

    const taskContainer = chart.append('g')
      .attr('class', 'task-container')
      .attr('transform', `translate(0, ${monthHeight})`);

    taskContainer.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', containerWidth)
      .attr('height', containerHeight - monthHeight)
      .attr('fill', '#fdfdfd');

    taskContainer.selectAll('.section-separator')
      .data(sectionSeparators)
      .enter()
      .append('line')
      .attr('class', 'section-separator')
      .attr('x1', d => x(d))
      .attr('x2', d => x(d))
      .attr('y1', 0)
      .attr('y2', containerHeight - monthHeight)
      .attr('stroke', '#ccc')
      .attr('stroke-width', 0.2);

    taskContainer.selectAll('.month-separator')
      .data(d3.timeMonths(extendedStartDates, new Date(extendedEndDates.getFullYear(), extendedEndDates.getMonth(), extendedEndDates.getDay() + 1)))
      .enter()
      .append('line')
      .attr('class', 'month-separator')
      .attr('x1', d => x(d))
      .attr('x2', d => x(d))
      .attr('y1', 0)
      .attr('y2', containerHeight - monthHeight)
      .attr('stroke', '#ccc')
      .attr('stroke-width', d => {
        return (d.getTime() === extendedStartDates.getTime() || d.getTime() === extendedEndDates.getTime()) ? 0 : 1;
      });

    taskContainer.selectAll('.today')
      .data([today])
      .enter()
      .append('line')
      .attr('x1', d => x(d))
      .attr('x2', d => x(d))
      .attr('y1', 0)
      .attr('y2', containerHeight - monthHeight)
      .attr('stroke', 'blue')
      .attr('stroke-width', 1);

    taskContainer.selectAll('.bar')
      .data(tasks)
      .enter()
      .append('g')
      .attr('class', 'bar-container')
      .each(function (d, i) {
        const container = d3.select(this);

        const startX = x(new Date(d.startDate));
        const endX = x(new Date(d.endDate));
        const barWidth = endX - startX;
        const fillWidth = d3.min(tasks, a => {
          const startMinX = x(new Date(a.startDate))
          const endMinX = x(new Date(a.endDate))
          const final = (endMinX - startMinX) / 2 >= 20 ? 20 : (endMinX - startMinX) / 2
          return final
        });

        container.append('rect')
          .attr('class', 'bar-background')
          .attr('x', startX)
          .attr('y', y(d.task))
          .attr('width', barWidth)
          .attr('height', y.bandwidth())
          .attr('fill', '#162133')
          .attr('rx', 10)
          .attr('ry', 10);

        const maskId = `mask-${i}`;
        svg.append('defs').append('mask')
          .attr('id', maskId)
          .append('rect')
          .attr('x', startX)
          .attr('y', y(d.task))
          .attr('width', barWidth)
          .attr('height', y.bandwidth())
          .attr('rx', 10)
          .attr('ry', 10)
          .attr('fill', 'white');

        container.append('rect')
          .attr('class', 'bar-fill')
          .attr('x', startX)
          .attr('y', y(d.task))
          .attr('width', fillWidth)
          .attr('height', y.bandwidth())
          .attr('fill', "#c97ff8")
          .attr('mask', `url(#${maskId})`);

        container.append('text')
          .attr('class', 'bar-text')
          .attr('x', startX + fillWidth + 5)
          .attr('y', y(d.task) + y.bandwidth() / 2)
          .attr('text-anchor', 'start')
          .attr('dominant-baseline', 'middle')
          .attr('fill', 'white')
          .text(d => d.task);
      });
  };

  useEffect(() => {
    createGanttChart();

    const handleResize = () => {
      createGanttChart();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [tasks]);


  return (
    <svg className='rounded-2xl border transition-all duration-500' ref={chartRef}></svg>
  );
};

export default GanttChart;
