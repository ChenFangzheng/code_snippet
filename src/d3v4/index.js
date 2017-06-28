import './index.scss';
// import * as d3 from './d3-custom';
import 'd3-selection-multi';
import { CustomPie } from './components/customPieComponent';

new CustomPie('info_1', 83, 93, 'rgb(44,245,247)').render({ name: "使用计算机的企业", num: 541, unit: "个", pct: 99.6 });

// d3.select('#container')
//     .append('svg')
//     .attrs({
//         width: '200px',
//         height: '200px'
//     })
//     .style('background-color', '#09F');


// console.log(d3.sum([1, 2, 3, 4]));