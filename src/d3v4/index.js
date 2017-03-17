
import './index.scss';
import * as d3 from './d3-custom';
import 'd3-selection-multi';

d3.select('#container')
    .append('svg')
    .attrs({
        width: '200px',
        height: '200px'
    })
    .style('background-color', '#09F');


console.log(d3.sum([1, 2, 3, 4]));