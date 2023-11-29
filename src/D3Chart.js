import * as d3 from 'd3';
import { GetData } from './firestore';

const Margin = { Top: 10, Bottom: 50, Left: 70, Right: 10 };
const Width = 800 - Margin.Left - Margin.Right;
const Height = 500 - Margin.Top - Margin.Bottom;

export default class D3Chart {
  constructor(element) {
    GetData()
      .then((data) => {
        const modifiedData = data.map(d => ({ ...d, cost: Number(d.cost) }));
        this.createChart(element, modifiedData);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  createChart(element, agesData) {
    const svg = d3.select(element)
      .append('svg')
      .attr('width', Width + Margin.Left + Margin.Right)
      .attr('height', Height + Margin.Top + Margin.Bottom)
      .append('g')
      .attr('transform', `translate(${Margin.Left}, ${Margin.Top})`);

    const y = d3.scaleLinear()
      .domain([
        0,
        d3.max(agesData, d => (typeof d.cost === 'number' ? d.cost : 0)) // Check for valid numeric values
      ])
      .range([Height, 0]);

    const x = d3.scaleBand()
      .domain(agesData.map(d => d.name))
      .range([0, Width])
      .padding(0.4);

    const xAxisCall = d3.axisBottom(x);
    svg.append('g')
      .attr('transform', `translate(0, ${Height})`)
      .call(xAxisCall);

    const yAxisCall = d3.axisLeft(y);
    svg.append('g').call(yAxisCall);

    const rects = svg.selectAll('rect')
      .data(agesData);

    rects.enter()
      .append('rect')
      .attr('x', d => x(d.name))
      .attr('y', d => (typeof d.cost === 'number' ? y(d.cost) : Height)) // Handle missing or invalid data
      .attr('width', x.bandwidth())
      .attr('height', d => (typeof d.cost === 'number' ? Height - y(d.cost) : 0)) // Handle missing or invalid data
      .attr('fill', 'grey');
  }
}
