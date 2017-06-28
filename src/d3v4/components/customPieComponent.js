import './customPieComponent.scss';
import * as d3 from '../d3-custom';
import $ from "jquery";

const tau = 2 * Math.PI;

export class CustomPie {
    constructor(containerId, innerR, outterR = (innerR + 10), fgColor = 'yellow', bgColor = 'transparent') {
        this.containerId = containerId;
        this.innerR = innerR;
        this.outterR = outterR;
        this.fgColor = fgColor;
        this.bgColor = bgColor;
        this.svg = d3.select(`#${this.containerId}`)
            .append('svg')
            .attr('width', "100%")
            .attr('height', "100%")
            .attr('class', 'customPie');
        let width = +$(`#${this.containerId}`).width(),
            height = +$(`#${this.containerId}`).height();
        this.g = this.svg.append('g').attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        let arcW = this.outterR - this.innerR;
        this.htmlG = this.svg.append('g')
            .attr("transform", `translate(${arcW}, ${arcW})`);;

        this.arc = d3.arc()
            .innerRadius(this.innerR)
            .outerRadius(this.outterR)
            .startAngle(0);

        this.background = this.g.append("path")
            .datum({ endAngle: tau })
            .style("fill", bgColor)
            .attr("d", this.arc);

        this.foreground = this.g.append("path")
            .datum({ endAngle: 0 })
            .style("fill", fgColor)
            .attr("d", this.arc);
    }

    render(data) {
        this.foreground.transition()
            .duration(1000)
            .attrTween('d', this.arcTween(data.pct * tau / 100));

        this.addForeignHtml(this.htmlG, data);
    }

    buildHtmlContent(data) {
        // 针对设计图上颜色的特殊处理
        let color = this.fgColor == 'rgb(57,207,251)' ? 'rgb(59,169,211)' : this.fgColor;

        let html = `
                <div class='innerCircle'>
                    <div style='background-color:${this.fgColor}' class='rectText'>${data.name}</div>
                    <div class='num'>${data.num}<i>${data.unit}</i></div>
                    <div style='color:${color}' class='pct'>${data.pct}%</div>
                </div>
            `;

        return html;
    }

    addForeignHtml(parentG, data) {
        let frnObj = parentG.append('foreignObject')
            .attr('width', `${this.innerR * 2}px`)
            .attr('height', `${this.innerR * 2}px`)
            .append("xhtml:body")
            .html(this.buildHtmlContent(data));
    }

    arcTween(newAngle) {
        return d => {
            var interpolate = d3.interpolate(d.endAngle, newAngle);
            return t => {
                d.endAngle = interpolate(t);
                return this.arc(d);
            };
        }
    }
}