import './roseOrderListComponent.scss';
import d3 from 'd3';

export class RoseOrderList {
    constructor(containerId, title) {
        this.containerId = containerId;
        this.title = title;
        this.circleCenter = { x: 50, y: 50 }
        this.svg = d3.select(`#${this.containerId}`)
            .append('svg')
            .attr('width', "100%")
            .attr('height', "100%");
    }

    render() {
        let circleG = this.svg.append('g')
            .attr("transform", "translate(10,170)");
        circleG.append('circle')
            .attr('cx', this.circleCenter.x)
            .attr('cy', this.circleCenter.y)
            .attr('r', 40)
            .attr('class', 'inner');
        circleG.append('circle')
            .attr('cx', this.circleCenter.x)
            .attr('cy', this.circleCenter.y)
            .attr('r', 53)
            .attr('class', 'outter');
        circleG.append('text')
            .attr('class', 'title')
            .text("建议咨询")
            .attr('transform', 'translate(15,56)');
        let arcG = this.svg.append('g')
            .attr('transform', `translate(${this.circleCenter.x + 10}, 220)`);

        this.drawArch(arcG);
    }

    drawArch(preantG) {
        let arc = d3.svg.arc()
            .innerRadius(0)
            .outerRadius(200)
            .startAngle(0)
            .endAngle(0.15 * Math.PI);

        preantG.append("path")
            .attr("class", "arc")
            .attr("d", arc)
            .attr("id", "first")
    }
}